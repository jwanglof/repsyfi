import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import isEmpty from 'lodash/isEmpty';
import {Form, Formik} from 'formik';
import YesNoField from '../shared/formik/YesNoField';
import {addNewExercise} from './ExerciseService';
import {useTranslation} from 'react-i18next';
import Error from '../shared/Error';

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
    setSubmitErrorMessage(null);
    try {
      console.log('Try to add exercise to day!', values, dayUid);
      const uid = await addNewExercise(values, dayUid);
      console.log('Exercise unique uid:', uid);
      setAddExerciseViewVisible(false);
    } catch (e) {
      console.log(34444, e);
      setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  const values = {
    exerciseName: '',
    feeling: true
  };

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={initialValues ? initialValues : values}
          onSubmit={onSubmit}
          validate={validate}
          // render={({ errors, status, touched, isSubmitting }) => (
          render={() => (
            <Form>
              <FieldFormGroup label="exerciseName"/>
              <YesNoField label="feeling"/>

              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <ButtonGroup className="d-flex">
                      <Button type="submit" color="success" className="w-100">{t("Save exercise")}</Button>
                      <Button color="danger" className="w-100" onClick={() => setAddExerciseViewVisible(false)}>{t("Discard exercise")}</Button>
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
