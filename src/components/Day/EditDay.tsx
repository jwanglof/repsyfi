import React, {FunctionComponent, useEffect, useState} from 'react';
import {Router} from 'router5';
import {withRoute} from 'react-router5';
import {useTranslation} from 'react-i18next';
import {getDay, updateDay} from './DayService';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import {dateFormat, timeFormat} from '../shared/formik/formik-utils';
import {IDayBasicUpdateModel} from '../../models/IDayModel';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {isEmpty} from 'lodash';
import getUnixTime from 'date-fns/getUnixTime';
import parseISO from 'date-fns/parseISO';
import {routeNameSpecificDay} from '../../routes';
import {Formik, FormikActions} from 'formik';
import {Button, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import DateTimePickerFormGroup from '../shared/formik/DateTimePickerFormGroup';
import DatepickerFormGroup from '../shared/formik/DatepickerFormGroup';
// @ts-ignore
import {Form} from 'react-formik-ui';

const EditDay: FunctionComponent<IEditDayProps & IEditDayRouter> = ({router, dayUid}) => {
  const { t } = useTranslation();

  if (isEmpty(dayUid)) {
    return <ErrorAlert errorText="Must have the day's UID to proceed!" componentName="EditDay"/>;
  }

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [initialData, setInitialData] = useState<IAddEditDayEditData | undefined>(undefined);

  useEffect(() => {
    // Fetch day data if the user is editing
    getDay(dayUid).then(res => {
      const data: IAddEditDayEditData = {
        ...res,
        startTimeFormatted: format(fromUnixTime(res.startTimestamp), timeFormat),
        startDateFormatted: format(fromUnixTime(res.startTimestamp), dateFormat)
      };

      if (res.endTimestamp) {
        data.endTimeFormatted = format(fromUnixTime(res.endTimestamp), timeFormat);
        data.endDateFormatted = format(fromUnixTime(res.endTimestamp), dateFormat);
      } else {
        data.endTimeFormatted = format(new Date, timeFormat);
        data.endDateFormatted = format(new Date, dateFormat);
      }
      setInitialData(data);
    });
  }, []);

  if (!initialData) {
    return <LoadingAlert componentName="EditDay"/>
  }

  if (submitErrorMessage) {
    return <ErrorAlert componentName="EditDay" errorText={submitErrorMessage}/>;
  }

  const onUpdate = async (values: IAddEditDayEditData, actions: FormikActions<IAddEditDayEditData>) => {
    actions.setSubmitting(true);
    try {
      const data: IDayBasicUpdateModel = {
        notes: values.notes,
        title: values.title,
        muscleGroups: values.muscleGroups,
        location: values.location,
        startTimestamp: getUnixTime(parseISO(`${values.startDateFormatted}T${values.startTimeFormatted}`))
      };
      if (values.endTimeFormatted && values.endDateFormatted) {
        data.endTimestamp = getUnixTime(parseISO(`${values.endDateFormatted}T${values.endTimeFormatted}`));
      }
      await updateDay(dayUid, data);
      router.navigate(routeNameSpecificDay, {uid: dayUid}, {reload: true});
    } catch (e) {
      console.log(e);
      setSubmitErrorMessage(e.message);
    }
    actions.setSubmitting(false);
  };

  const validate = (values: IAddEditDayEditData): IAddEditDayFormValidate | {} => {
    let errors: IAddEditDayFormValidate = {};
    if (values.startDateFormatted === '') {
      errors.startDateFormatted = `${t("Start date")} ${t("must be set")}`;
    }
    if (values.startTimeFormatted === '') {
      errors.startTimeFormatted = `${t("Start time")} ${t("must be set")}`;
    }
    return errors;
  };

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={initialData}
          onSubmit={onUpdate}
          validate={validate}
          // render={({ errors, status, touched, isSubmitting }) => (
          render={({ errors, isSubmitting }) => (
            <Form>
              <FieldFormGroup name="location" labelText={t("Workout location")}/>
              <FieldFormGroup name="muscleGroups" labelText={t("Muscle groups")}/>
              <FieldFormGroup name="title" labelText={t("Title")}/>

              <DatepickerFormGroup name="startDateFormatted" labelText={t("Start date")}/>
              <DateTimePickerFormGroup name="startTimeFormatted" labelText={t("Start time")}/>

              <DatepickerFormGroup name="endDateFormatted" labelText={t("End date")}/>
              <DateTimePickerFormGroup name="endTimeFormatted" labelText={t("End time")}/>

              <FormGroup row>
                <Col sm={12}>
                  <Button type="submit" color="primary" disabled={isSubmitting || !errors} block>{t("Update day")}</Button>
                </Col>
              </FormGroup>
            </Form>
          )}
        />
      </Col>
    </Row>
  );
};

interface IEditDayProps {
  dayUid: string
}

interface IEditDayRouter {
  router: Router
}

// interface IAddEditDayEditData extends IDayModel {
interface IAddEditDayEditData {
  startTimeFormatted: string,
  startDateFormatted: string,
  endTimeFormatted?: string,
  endDateFormatted?: string,
  location: string,
  muscleGroups: string, // Will be split into an array with strings
  title: string,
  notes?: string,
  // exercises: Array<string>  // IExerciseModel
}

interface IAddEditDayFormValidate {
  startTimeFormatted?: string,
  startDateFormatted?: string,
  endTimeFormatted?: string,
  endDateFormatted?: string,
  location?: string,
  muscleGroups?: string,
  title?: string
}

export default withRoute(EditDay);