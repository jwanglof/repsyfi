import React, {FunctionComponent, useEffect, useReducer, useState} from 'react';
import {Router} from 'router5';
import {withRoute} from 'react-router5';
import {useTranslation} from 'react-i18next';
import {addDay, getAllLocations} from './DayService';
import format from 'date-fns/format';
import {dateFormat, timeFormat} from '../../utils/formik-utils';
import {IDayBasicModel} from '../../models/IDayModel';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import getUnixTime from 'date-fns/getUnixTime';
import parseISO from 'date-fns/parseISO';
import {Formik, FormikActions} from 'formik';
import {getCurrentUsersUid} from '../../config/FirebaseUtils';
import {Button, Col, FormGroup, Row} from 'reactstrap';
import DateTimePickerFormGroup from '../Formik/DateTimePickerFormGroup';
import DatepickerFormGroup from '../Formik/DatepickerFormGroup';
// @ts-ignore
import {Form} from 'react-formik-ui';
import isDate from 'date-fns/isDate';
import {RouteNames} from '../../routes';
import FieldFormGroup from '../Formik/FieldFormGroup';
import {useGlobalState} from '../../state';

const AddDay: FunctionComponent<IAddDayProps & IAddDayRouter> = ({router}) => {
  const { t } = useTranslation();
  const nowDate = format(new Date(), dateFormat);
  const initialData: IAddDayEditData = {
    location: '',
    muscleGroups: '',
    title: nowDate,
    startTimeFormatted: format(new Date(), timeFormat),
    startDateFormatted: nowDate,
    notes: ''
  };

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const setTimerRunning = useGlobalState('timerRunning')[1];

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await getAllLocations();
      console.log(2222, locations);
    };
    fetchLocations();
  }, []);

  if (submitErrorMessage) {
    return <ErrorAlert componentName="AddEditDay" errorText={submitErrorMessage}/>;
  }

  const onSubmit = async (values: IAddDayEditData, actions: FormikActions<IAddDayEditData>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);
    try {
      const ownerUid: string = await getCurrentUsersUid();
      let startDateFormatted: string = values.startDateFormatted;
      if (isDate(values.startDateFormatted)) {
        // TODO Fix so that 'values.startDateFormatted' never is a date but formatted!
        // @ts-ignore
        startDateFormatted = format(values.startDateFormatted, dateFormat);
      }
      const data: IDayBasicModel = {
        title: values.title,
        muscleGroups: values.muscleGroups,
        location: values.location,
        exercises: [],
        startTimestamp: getUnixTime(parseISO(`${startDateFormatted}T${values.startTimeFormatted}`)),
        notes: values.notes
      };
      const newUid = await addDay(data, ownerUid);
      setTimerRunning(true);
      router.navigate(RouteNames.SPECIFIC_DAY, {uid: newUid}, {reload: true});
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }
    actions.setSubmitting(false);
  };

  const validate = (values: IAddDayEditData): IAddDayFormValidate | {} => {
    let errors: IAddDayFormValidate = {};
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
              <FieldFormGroup name="notes" labelText={t("Notes")}/>

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

interface IAddDayProps {}

interface IAddDayRouter {
  router: Router
}

interface IAddDayEditData {
  startTimeFormatted: string,
  startDateFormatted: string,
  location: string,
  muscleGroups: string,
  title: string,
  notes: string
}

interface IAddDayFormValidate {
  startTimeFormatted?: string,
  startDateFormatted?: string,
  location?: string,
  muscleGroups?: string,
  title?: string,
  notes?: string
}

export default withRoute(AddDay);