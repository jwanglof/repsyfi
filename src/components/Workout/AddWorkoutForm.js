import React, {useState, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {CardBody, CardText, CardTitle, Col, Row, Table} from 'reactstrap';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import isEmpty from 'lodash/isEmpty';
import {Form} from 'formik';

const AddWorkoutForm = ({ initialValues }) => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');

  const validate = (values) => {
    let errors = {};

    return errors;
  };

  const onSubmit = async (values, actions) => {
    setSubmitErrorMessage('');
    try {
      console.log('Try to save!');
    } catch (e) {
      setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={validate}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FieldFormGroup label="email" type="email"/>
              <FieldFormGroup label="firstname"/>
              <FieldFormGroup label="lastname"/>
              <FieldFormGroup label="current_town"/>
              <FieldFormGroup label="home_town"/>
              <FieldFormGroup label="uid" disabled/>
              <FieldFormGroup label="activation_code" disabled/>

              <FormGroup row>
                <Col xs={12}>
                  You don't need to save anything, all your changes are automatically synced!
                </Col>
                <Col sm={12}>
                  <Button type="submit" disabled={isSubmitting || !isEmpty(errors)} block>Delete (!!)</Button>
                </Col>
              </FormGroup>
            </Form>
          )}
        />
      </Col>
    </Row>
  );
};

AddWorkoutForm.propTypes = {
  initialValues: PropTypes.object.isRequired
};

export default AddWorkoutForm;
