import React from 'react';
import {Alert, Col, FormGroup, Input, Label} from 'reactstrap';
import {ErrorMessage, Field} from 'formik';
import PropTypes from 'prop-types';
import {colSmSize, labelSmSize} from './formik-utils';

const DateTimePickerFormGroup = ({labelText, name, ...inputProps}) => {
  return (
    <FormGroup row>
      <Label for={name} sm={labelSmSize}>{labelText}</Label>
      <Col sm={colSmSize}>
        <Input tag={Field} type="time" component="input" name={name} id={name} placeholder={labelText} {...inputProps} />
        <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
      </Col>
    </FormGroup>
  );
};

DateTimePickerFormGroup.propTypes = {
  inputProps: PropTypes.shape({
    disabled: PropTypes.bool
  }),
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default DateTimePickerFormGroup;
