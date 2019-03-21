import React from 'react';
import {Alert, Col, FormGroup, Input, Label} from 'reactstrap';
import {ErrorMessage, Field} from 'formik';
import {colSmSize, labelSmSize} from './formik-utils';
import PropTypes from 'prop-types';

const FieldFormGroup = ({labelText, name, type="text", labelHidden=false, ...inputProps}) => (
  <FormGroup row>
    {!labelHidden && <Label for={name} sm={labelSmSize}>{labelText}</Label>}
    <Col sm={colSmSize}>
      <Input tag={Field} type={type} component="input" name={name} id={name} placeholder={labelText} {...inputProps} />
      <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
    </Col>
  </FormGroup>
);

FieldFormGroup.propTypes = {
  inputProps: PropTypes.shape({
    disabled: PropTypes.bool
  }),
  type: PropTypes.string,
  labelHidden: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default FieldFormGroup;