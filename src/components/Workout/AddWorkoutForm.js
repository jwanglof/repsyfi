import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import isEmpty from 'lodash/isEmpty';
import {Form, Formik} from 'formik';
import YesNoField from '../shared/formik/YesNoField';
import {addNewWorkout} from './WorkoutService';

const AddWorkoutForm = ({ initialValues, dayUid, setAddWorkoutViewVisible }) => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [submitErrorMessage, setSubmitErrorMessage] = useState(null);

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
      console.log('Try to add workout to day!', values, dayUid);
      const uid = await addNewWorkout(values, dayUid);
      console.log('workout uid:', uid);
      setAddWorkoutViewVisible(false);
    } catch (e) {
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
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FieldFormGroup label="exerciseName"/>
              <YesNoField label="feeling"/>

              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <ButtonGroup className="d-flex">
                      <Button type="submit" color="success" className="w-100">Save workout</Button>
                      <Button color="danger" className="w-100" onClick={() => setAddWorkoutViewVisible(false)}>Discard workout</Button>
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

AddWorkoutForm.propTypes = {
  initialValues: PropTypes.object,
  dayUid: PropTypes.string.isRequired,
  setAddWorkoutViewVisible: PropTypes.func.isRequired,
};

export default AddWorkoutForm;
