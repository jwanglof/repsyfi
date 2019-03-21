import React, {useState} from 'react';
import {Button, Col, FormGroup, Row} from 'reactstrap';
import {Form, Formik} from 'formik';
import isEmpty from 'lodash/isEmpty';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import format from 'date-fns/format'
import {dateFormat, timeFormat} from '../shared/formik/formik-utils';
import {addNewDay} from './DayService';
import DateTimePickerFormGroup from '../shared/formik/DateTimePickerFormGroup';
import DatepickerFormGroup from '../shared/formik/DatepickerFormGroup';
import parseISO from 'date-fns/parseISO'
import getUnixTime from 'date-fns/getUnixTime'
import {buildInitialFirebaseDayData} from './DayUtils';
import Error from '../shared/Error';
import {withRoute} from 'react-router5';
import {routeNameSpecificDay} from '../../routes';
import {useTranslation} from 'react-i18next';

const AddDay = ({ router }) => {
  const { t } = useTranslation();

  // const [roles, setRoles] = useState([]);
  // const [error, setError] = useState('');
  const [submitErrorMessage, setSubmitErrorMessage] = useState(null);

  if (submitErrorMessage !== null) {
    return <Error componentName="AddDay"/>;
  }

  const onSubmit = async (values, actions) => {
    setSubmitErrorMessage(null);

    if (!values.startDate || !values.startTime) {
      setSubmitErrorMessage('WOOPS');
      actions.setSubmitting(false);
    } else {
      try {
        const startTimestamp = getUnixTime(parseISO(`${values.startDate}T${values.startTime}`));
        const dayData = buildInitialFirebaseDayData({...values, startTimestamp});
        const newUid = await addNewDay(dayData);
        console.log('new uid:', newUid);
        router.navigate(routeNameSpecificDay, {uid: newUid}, {reload: true});
      } catch (e) {
        console.log(e);
        setSubmitErrorMessage(e.data.message);
      }
      actions.setSubmitting(false);
    }
  };

  const nowDate = format(new Date(), dateFormat);

  const initialValues = {
    location: '',
    muscleGroups: '',
    title: nowDate,
    startTime: format(new Date(), timeFormat),
    startDate: nowDate,
  };
  // const preInitialValues = {
  //   location: 'Kontoret',
  //   muscleGroups: 'Abs, legs',
  //   title: nowDate,
  //   startTime: format(new Date(), timeFormat),
  //   startDate: nowDate,
  // };

  return (
    <Row>
      <Col xs={12}>
        <h1>{t("Add day")}</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FieldFormGroup name="location" labelText={t("Location")}/>
              <FieldFormGroup name="muscleGroups" labelText={t("Muscle groups")}/>
              <FieldFormGroup name="title" labelText={t("Title")}/>

              <DatepickerFormGroup name="startDate" labelText={t("Start date")}/>
              <DateTimePickerFormGroup name="startTime" labelText={t("Start time")}/>
              {/*<DateTimePickerFormGroup label="endTime"/>*/}

              <FormGroup row>
                <Col sm={12}>
                  <Button type="submit" color="primary" disabled={isSubmitting || !isEmpty(errors)} block>{t("Save new day")}</Button>
                </Col>
              </FormGroup>
            </Form>
          )}
        />
      </Col>
    </Row>
  );
};

AddDay.propTypes = {};

export default withRoute(AddDay);
