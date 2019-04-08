import React, {FunctionComponent, useEffect, useState} from 'react';
import {Router} from 'router5';
import {withRoute} from 'react-router5';
import {useTranslation} from 'react-i18next';
import {addDay, getDay, updateDay} from './DayService';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import {dateFormat, timeFormat} from '../shared/formik/formik-utils';
import {IDayBasicModel, IDayBasicUpdateModel, IDayUpdateModel} from '../../models/IDayModel';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {isDate} from 'lodash';
import getUnixTime from 'date-fns/getUnixTime';
import parseISO from 'date-fns/parseISO';
import {routeNameSpecificDay} from '../../routes';
import {Formik, FormikActions} from 'formik';
import {getCurrentUsersUid} from '../../config/FirebaseUtils';
import {Button, ButtonGroup, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import SelectFormGroup from '../shared/formik/SelectFormGroup';
import {getExerciseTypes} from '../Exercise/ExerciseService';
import DateTimePickerFormGroup from '../shared/formik/DateTimePickerFormGroup';
import DatepickerFormGroup from '../shared/formik/DatepickerFormGroup';
// @ts-ignore
import {Form} from 'react-formik-ui';

const AddDay: FunctionComponent<IAddDayProps & IAddDayRouter> = ({router, setAddExerciseViewVisible}) => {
  const { t } = useTranslation();
  const nowDate = format(new Date(), dateFormat);
  const initialData: IAddEditDayEditData = {
    location: '',
    muscleGroups: '',
    title: nowDate,
    startTimeFormatted: format(new Date(), timeFormat),
    startDateFormatted: nowDate,
  };

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <ErrorAlert componentName="AddEditDay" errorText={submitErrorMessage}/>;
  }

  const onSubmit = async (values: IAddEditDayEditData, actions: FormikActions<IAddEditDayEditData>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);
    try {
      const ownerUid: string = await getCurrentUsersUid();
      const data: IDayBasicModel = {
        notes: '',
        title: values.title,
        muscleGroups: values.muscleGroups,
        location: values.location,
        exercises: [],
        startTimestamp: getUnixTime(parseISO(`${values.startDateFormatted}T${values.startTimeFormatted}`))
      };
      const newUid = await addDay(data, ownerUid);
      router.navigate(routeNameSpecificDay, {uid: newUid}, {reload: true});
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
          onSubmit={onSubmit}
          validate={validate}
          // render={({ errors, status, touched, isSubmitting }) => (
          render={({ errors, isSubmitting }) => (
            <Form>
              <FieldFormGroup name="location" labelText={t("Workout location")}/>
              <FieldFormGroup name="muscleGroups" labelText={t("Muscle groups")}/>
              <FieldFormGroup name="title" labelText={t("Title")}/>

              <DatepickerFormGroup name="startDateFormatted" labelText={t("Start date")}/>
              <DateTimePickerFormGroup name="startTimeFormatted" labelText={t("Start time")}/>

              <FormGroup row>
                <Col sm={12}>
                  <Button type="submit" color="primary" disabled={isSubmitting || !errors} block>{t("Save new day")}</Button>
                </Col>
              </FormGroup>
            </Form>
          )}
        />
      </Col>
    </Row>
  );
};

interface IAddDayProps {
  setAddExerciseViewVisible: any
}

interface IAddDayRouter {
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

export default withRoute(AddDay);