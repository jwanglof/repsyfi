import React, {FunctionComponent, useEffect, useState} from 'react';
import {Router} from 'router5';
import {withRoute} from 'react-router5';
import {useTranslation} from 'react-i18next';
import {addDay, getDay} from './DayService';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import {dateFormat, timeFormat} from '../shared/formik/formik-utils';
import {IDayBasicModel} from '../../models/IDayModel';
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
// @ts-ignore
import {Form} from 'react-formik-ui';

const AddEditDay: FunctionComponent<IAddEditDayProps> = ({router, setAddExerciseViewVisible, initialValues}) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [initialData, setInitialData] = useState<IAddEditDayEditData | undefined>(undefined);
  const [updating, setUpdating] = useState<boolean>(false); // TODO Rename to editing?
  const [dayUid, setDayUid] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch day data if the user is editing
    if (router.getState().params && router.getState().params.dayUid) {
      const dayUid = router.getState().params.dayUid;
      getDay(dayUid).then(res => {
        const data: IAddEditDayEditData = {
          ...res,
          startTimeFormatted: format(fromUnixTime(res.startTimestamp), timeFormat),
          startDateFormatted: format(fromUnixTime(res.startTimestamp), dateFormat)
        };
        // data.startTimeFormatted = format(fromUnixTime(res.startTimestamp), timeFormat);
        // data.startDateFormatted = format(fromUnixTime(res.startTimestamp), dateFormat);
        if (res.endTimestamp) {
          data.endTimeFormatted = format(fromUnixTime(res.endTimestamp), timeFormat);
          data.endDateFormatted = format(fromUnixTime(res.endTimestamp), dateFormat);
        } else {
          data.endTimeFormatted = format(new Date, timeFormat);
          data.endDateFormatted = format(new Date, dateFormat);
        }
        setUpdating(true);
        setDayUid(dayUid);
        setInitialData(data);
      });
    } else {
      const nowDate = format(new Date(), dateFormat);
      const initialValues: IAddEditDayEditData = {
        location: '',
        muscleGroups: '',
        title: nowDate,
        startTimeFormatted: format(new Date(), timeFormat),
        startDateFormatted: nowDate,
      };
      setInitialData(initialValues);
    }
  }, []);

  if (!initialData) {
    return <LoadingAlert componentName="AddEditDay"/>
  }

  if (submitErrorMessage) {
    return <ErrorAlert componentName="AddEditDay" errorText={submitErrorMessage}/>;
  }

  // Format a date object to a specific format
  const getFormattedDate = (startDate: Date | string) => {
    let d = startDate;
    if (isDate(startDate)) {
      d = format(startDate, dateFormat);
    }
    return d;
  };

  const onSubmit = async (values: IAddEditDayEditData, actions: FormikActions<IAddEditDayEditData>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);
    try {
      const ownerUid: string = await getCurrentUsersUid();
      const startTimestamp = getUnixTime(parseISO(`${values.startDateFormatted}T${values.startTimeFormatted}`));
      // const dayData = buildInitialFirebaseDayData({...values, startTimestamp});
      const data: IDayBasicModel = {
        notes: '',
        title: values.title,
        muscleGroups: values.muscleGroups,
        location: values.location,
        exercises: [],
        startTimestamp
      };
      const newUid = await addDay(data, ownerUid);
      router.navigate(routeNameSpecificDay, {uid: newUid}, {reload: true});
    } catch (e) {
      console.error(e);
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
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validate}
          // render={({ errors, status, touched, isSubmitting }) => (
          render={({ errors, isSubmitting }) => (
            <Form themed>
              <FieldFormGroup name="exerciseName" labelText={t("Exercise")}/>
              <SelectFormGroup name="type" labelText={t("Exercise type")} options={getExerciseTypes()}/>

              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <ButtonGroup className="w-100">
                      <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save exercise")}</Button>
                      <Button color="danger" onClick={() => setAddExerciseViewVisible(false)}>{t("Discard exercise")}</Button>
                    </ButtonGroup>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
        />
      </Col>
    </Row>
  );
};

interface IAddEditDayProps {
  router: Router,
  initialValues: IAddEditDayEditData,
  setAddExerciseViewVisible: any
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
  // notes: string,
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

export default withRoute(AddEditDay);