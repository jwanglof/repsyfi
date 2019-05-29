import React, {FunctionComponent, useEffect, useState} from 'react';
import {Router} from 'router5';
import {withRoute} from 'react-router5';
import {useTranslation} from 'react-i18next';
import {getDay, updateDay} from './DayService';
import fromUnixTime from 'date-fns/fromUnixTime';
import {dateFormat, timeFormat} from '../../utils/formik-utils';
import {IDayBasicUpdateModel} from '../../models/IDayModel';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {isEmpty} from 'lodash';
import getUnixTime from 'date-fns/getUnixTime';
import parseISO from 'date-fns/parseISO';
import {Formik, FormikActions} from 'formik';
import {Button, ButtonGroup, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../Formik/FieldFormGroup';
import DateTimePickerFormGroup from '../Formik/DateTimePickerFormGroup';
import DatepickerFormGroup from '../Formik/DatepickerFormGroup';
// @ts-ignore
import {Form} from 'react-formik-ui';
import {isDate, format} from 'date-fns';
import {RouteNames} from '../../routes';

const EditDay: FunctionComponent<IEditDayProps & IEditDayRouter> = ({router, dayUid}) => {
  const { t } = useTranslation();

  if (isEmpty(dayUid)) {
    return <ErrorAlert errorText="Must have the day's UID to proceed!" componentName="EditDay"/>;
  }

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [initialData, setInitialData] = useState<IEditDayEditData | undefined>(undefined);

  useEffect(() => {
    // Fetch day data if the user is editing
    getDay(dayUid).then(res => {
      const data: IEditDayEditData = {
        ...res,
        startTimeFormatted: format(fromUnixTime(res.startTimestamp), timeFormat),
        startDateFormatted: format(fromUnixTime(res.startTimestamp), dateFormat)
      };

      if (res.endTimestamp) {
        data.endTimeFormatted = format(fromUnixTime(res.endTimestamp), timeFormat);
        data.endDateFormatted = format(fromUnixTime(res.endTimestamp), dateFormat);
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

  const onUpdate = async (values: IEditDayEditData, actions: FormikActions<IEditDayEditData>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      if (isDate(values.startDateFormatted)) {
        // TODO Fix!!
        // @ts-ignore
        values.startDateFormatted = format(values.startDateFormatted, dateFormat);
      }
      if (isDate(values.endDateFormatted)) {
        // TODO Fix!!
        // @ts-ignore
        values.endDateFormatted = format(values.endDateFormatted, dateFormat);
      }

      const data: IDayBasicUpdateModel = {
        notes: values.notes,
        title: values.title,
        muscleGroups: values.muscleGroups,
        location: values.location,
        startTimestamp: getUnixTime(parseISO(`${values.startDateFormatted}T${values.startTimeFormatted}`))
      };
      if (!isEmpty(values.endTimeFormatted) && !isEmpty(values.endDateFormatted)) {
        data.endTimestamp = getUnixTime(parseISO(`${values.endDateFormatted}T${values.endTimeFormatted}`));
      } else {
        data.endTimestamp = undefined;
      }
      await updateDay(dayUid, data);
      router.navigate(RouteNames.SPECIFIC_DAY, {uid: dayUid}, {reload: true});
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }
    actions.setSubmitting(false);
  };

  const validate = (values: IEditDayEditData): IEditDayFormValidate | {} => {
    let errors: IEditDayFormValidate = {};
    if (values.startDateFormatted === '') {
      errors.startDateFormatted = `${t("Start date")} ${t("must be set")}`;
    }
    if (values.startTimeFormatted === '') {
      errors.startTimeFormatted = `${t("Start time")} ${t("must be set")}`;
    }
    return errors;
  };

  const toggleEditForm = () => router.navigate(RouteNames.SPECIFIC_DAY, {uid: dayUid}, {reload: true});

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={initialData}
          onSubmit={onUpdate}
          validate={validate}
          // render={({ errors, status, touched, isSubmitting }) => (
          render={({ errors, isSubmitting }) => (
            <Form mode='structured' themed>
              <FieldFormGroup name="location" labelText={t("Workout location")}/>
              <FieldFormGroup name="muscleGroups" labelText={t("Muscle groups")}/>
              <FieldFormGroup name="title" labelText={t("Title")}/>
              <FieldFormGroup name="notes" labelText={t("Notes")}/>

              <DatepickerFormGroup name="startDateFormatted" labelText={t("Start date")}/>
              <DateTimePickerFormGroup name="startTimeFormatted" labelText={t("Start time")}/>

              {initialData.endTimestamp && <DatepickerFormGroup name="endDateFormatted" labelText={t("End date")}/>}
              {initialData.endTimestamp && <DateTimePickerFormGroup name="endTimeFormatted" labelText={t("End time")}/>}

              <FormGroup row>
                <Col sm={12}>
                  <ButtonGroup className="w-100">
                    <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Update day")}</Button>
                    <Button color="danger" disabled={isSubmitting || !errors} onClick={toggleEditForm}>{t("Discard")}</Button>
                  </ButtonGroup>
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

interface IEditDayEditData {
  startTimeFormatted: string,
  startDateFormatted: Date | string,
  endTimeFormatted?: string,
  endDateFormatted?: string | Date,
  endTimestamp?: number | undefined | null,
  location: string,
  muscleGroups: string,
  title: string,
  notes?: string,
}

interface IEditDayFormValidate {
  startTimeFormatted?: string,
  startDateFormatted?: string | Date,
  endTimeFormatted?: string,
  endDateFormatted?: string | Date,
  location?: string,
  muscleGroups?: string,
  title?: string,
  notes?: string,
}

export default withRoute(EditDay);