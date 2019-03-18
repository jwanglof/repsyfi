import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import isEmpty from 'lodash/isEmpty';
import {Form, Formik} from 'formik';
import Error from '../shared/Error';

const AddSetForm = ({ initialValues, exerciseUid }) => {
  // const [roles, setRoles] = useState([]);
  // const [error, setError] = useState('');
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');

  if (submitErrorMessage !== null) {
    return <Error componentName="AddSetForm"/>;
  }

  const validate = (values) => {
    let errors = {};

    return errors;
  };

  const onSubmit = async (values, actions) => {
    setSubmitErrorMessage('');
    try {
      console.log('Try to add set to exercise!', values, exerciseUid);
    } catch (e) {
      setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={initialValues ? initialValues : {}}
          onSubmit={onSubmit}
          validate={validate}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FieldFormGroup label="amount"/>
              <FieldFormGroup label="repetitions"/>

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

AddSetForm.propTypes = {
  initialValues: PropTypes.object,
  exerciseUid: PropTypes.string.isRequired
};

export default AddSetForm;
