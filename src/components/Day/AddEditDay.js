import React, {useEffect, useState} from 'react';
import {Button, Col, FormGroup, Row} from 'reactstrap';
import {Form, Formik} from 'formik';
import isEmpty from 'lodash/isEmpty';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import format from 'date-fns/format'
import {dateFormat, timeFormat} from '../shared/formik/formik-utils';
import {addNewDay, getSpecificDayFromUid, updateDay} from './DayService';
import DateTimePickerFormGroup from '../shared/formik/DateTimePickerFormGroup';
import DatepickerFormGroup from '../shared/formik/DatepickerFormGroup';
import parseISO from 'date-fns/parseISO'
import getUnixTime from 'date-fns/getUnixTime'
import fromUnixTime from 'date-fns/fromUnixTime'
import {buildInitialFirebaseDayData, buildUpdatedFirebaseDayData} from './DayUtils';
import Error from '../shared/Error';
import {withRoute} from 'react-router5';
import {routeNameSpecificDay} from '../../routes';
import {useTranslation} from 'react-i18next';
import Loading from '../shared/Loading';

const AddEditDay = ({ router }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [dayUid, setDayUid] = useState(null);

  useEffect(() => {
    // Fetch day data if the user is editing
    if (router.getState().params && router.getState().params.dayUid) {
      const dayUid = router.getState().params.dayUid;
      getSpecificDayFromUid(dayUid).then(res => {
        res.startTime = format(fromUnixTime(res.startTimestamp), timeFormat);
        res.startDate = format(fromUnixTime(res.startTimestamp), dateFormat);
        if (res.endTimestamp) {
          res.endTime = format(fromUnixTime(res.endTimestamp), timeFormat);
          res.endDate = format(fromUnixTime(res.endTimestamp), dateFormat);
        } else {
          res.endTime = format(new Date, timeFormat);
          res.endDate = format(new Date, dateFormat);
        }
        setUpdating(true);
        setDayUid(dayUid);
        setInitialData(res);
      });
    } else {
      const nowDate = format(new Date(), dateFormat);
      const initialValues = {
        location: '',
        muscleGroups: '',
        title: nowDate,
        startTime: format(new Date(), timeFormat),
        startDate: nowDate,
      };
      setInitialData(initialValues);
    }
  }, []);


  if (initialData === null) {
    return <Loading componentName="AddDay"/>
  }

  if (submitErrorMessage !== null) {
    return <Error componentName="AddDay"/>;
  }

  const onSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(null);
    try {
      const startTimestamp = getUnixTime(parseISO(`${values.startDate}T${values.startTime}`));
      const dayData = buildInitialFirebaseDayData({...values, startTimestamp});
      const newUid = await addNewDay(dayData);
      router.navigate(routeNameSpecificDay, {uid: newUid}, {reload: true});
    } catch (e) {
      console.log(e);
      setSubmitErrorMessage(e);
    }
    actions.setSubmitting(false);
  };

  const onUpdate = async (values, actions) => {
    actions.setSubmitting(true);
    try {
      const startTimestamp = getUnixTime(parseISO(`${values.startDate}T${values.startTime}`));
      let endTimestamp = null;
      if (values.endTime && values.endDate) {
        endTimestamp = getUnixTime(parseISO(`${values.endDate}T${values.endTime}`));
      }
      const dayData = buildUpdatedFirebaseDayData({...values, startTimestamp, endTimestamp});
      await updateDay(dayUid, dayData);
      router.navigate(routeNameSpecificDay, {uid: dayUid}, {reload: true});
    } catch (e) {
      console.log(e);
      setSubmitErrorMessage(e);
    }
    actions.setSubmitting(false);
  };

  const validate = values => {
    let errors = {};

    if (values.startDate === '') {
      errors.startDate = `${t("Start date")} ${t("must be set")}`;
    }

    if (values.startTime === '') {
      errors.startTime = `${t("Start time")} ${t("must be set")}`;
    }

    return errors;
  };

  return (
    <Row>
      <Col xs={12}>
        <h1>{updating ? t("Update day") : t("Add new day")}</h1>
        <Formik
          initialValues={initialData}
          onSubmit={updating ? onUpdate : onSubmit}
          validate={validate}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FieldFormGroup name="location" labelText={t("Location")}/>
              <FieldFormGroup name="muscleGroups" labelText={t("Muscle groups")}/>
              <FieldFormGroup name="title" labelText={t("Title")}/>

              <DatepickerFormGroup name="startDate" labelText={t("Start date")}/>
              <DateTimePickerFormGroup name="startTime" labelText={t("Start time")}/>

              {updating && <>
                <DatepickerFormGroup name="endDate" labelText={t("End date")}/>
                <DateTimePickerFormGroup name="endTime" labelText={t("End time")}/>
              </>}

              <FormGroup row>
                <Col sm={12}>
                  <Button type="submit" color="primary" disabled={isSubmitting || !isEmpty(errors)} block>{updating ? t("Update day") : t("Save new day")}</Button>
                </Col>
              </FormGroup>
            </Form>
          )}
        />
      </Col>
    </Row>
  );
};

AddEditDay.propTypes = {};

export default withRoute(AddEditDay);
