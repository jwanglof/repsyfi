import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import isEmpty from 'lodash/isEmpty';
import {Formik} from 'formik';
import {
  addExerciseAndGetUid,
  addExerciseToDayArray,
  addNewSetsRepsExerciseAndGetUid,
  addNewTimeDistanceExerciseAndGetUid
} from './ExerciseService';
import {useTranslation} from 'react-i18next';
import Error from '../shared/Error';
import SelectFormGroup from '../shared/formik/SelectFormGroup';
import {Form} from 'react-formik-ui';
import {EXERCISE_TYPE_SETS_REPS, EXERCISE_TYPE_TIME_DISTANCE} from './ExerciseConstants';
import {getCurrentUsersUid} from '../../config/firebase';

const AddExerciseForm = ({ initialValues, dayUid, setAddExerciseViewVisible }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState(null);

  if (submitErrorMessage !== null) {
    return <Error componentName="AddExerciseForm"/>;
  }

  const validate = (values) => {
    let errors = {};

    if (isEmpty(values.exerciseName)) {
      errors.exerciseName = "exerciseName can't be empty"
    }

    return errors;
  };

  const onSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(null);
    try {
      const ownerUid = await getCurrentUsersUid();

      console.log('Try to add exercise to day!', values, dayUid, ownerUid);

      let exerciseTypeUid;
      switch (values.type) {
        case EXERCISE_TYPE_SETS_REPS:
          exerciseTypeUid = await addNewSetsRepsExerciseAndGetUid(ownerUid);
          break;
        case EXERCISE_TYPE_TIME_DISTANCE:
          exerciseTypeUid = await addNewTimeDistanceExerciseAndGetUid(ownerUid);
          break;
      }
      console.log('Exercise unique uid:', exerciseTypeUid);
      const exerciseData = {
        exerciseName: values.exerciseName,
        feeling: values.feeling,
        type: values.type,
        typeUid: exerciseTypeUid
      };
      const exerciseUid = await addExerciseAndGetUid(exerciseData, ownerUid);
      await addExerciseToDayArray(exerciseUid, dayUid);
      setAddExerciseViewVisible(false);
    } catch (e) {
      console.log(34444, e);
      setSubmitErrorMessage(e.message);
    }
    actions.setSubmitting(false);
  };

  const values = {
    exerciseName: '',
    feeling: true,
    type: EXERCISE_TYPE_SETS_REPS
  };

  // TODO Add treadmill as exercise form here!
  const exerciseTypes = [
    {value: EXERCISE_TYPE_SETS_REPS, label: 'Sets and reps'},
    {value: EXERCISE_TYPE_TIME_DISTANCE, label: 'Time and distance'},
  ];

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={initialValues ? initialValues : values}
          onSubmit={onSubmit}
          validate={validate}
          // render={({ errors, status, touched, isSubmitting }) => (
          render={({ errors, isSubmitting }) => (
            <Form themed>
              <FieldFormGroup name="exerciseName" labelText={t("Exercise")}/>
              <SelectFormGroup name="type" labelText={t("Exercise type")} options={exerciseTypes}/>
              {/*<YesNoField name="feeling" labelText={t("Feeling")}/>*/}

              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <ButtonGroup className="w-100">
                      <Button type="submit" color="primary" disabled={isSubmitting || !isEmpty(errors)}>{t("Save exercise")}</Button>
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

AddExerciseForm.propTypes = {
  initialValues: PropTypes.object,
  dayUid: PropTypes.string.isRequired,
  setAddExerciseViewVisible: PropTypes.func.isRequired,
};

export default AddExerciseForm;
