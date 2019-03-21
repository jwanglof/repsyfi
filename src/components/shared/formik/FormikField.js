import React from 'react';
import {Alert, Input, Label} from 'reactstrap';
import {ErrorMessage, Field} from 'formik';
import {labelSmSize} from './formik-utils';
import PropTypes from 'prop-types';

const FormikField = ({labelText, name, type="text", labelHidden=false, ...inputProps}) => (
  <>
    {!labelHidden && <Label for={name} sm={labelSmSize}>{labelText}</Label>}
    <Input tag={Field} type={type} component="input" name={name} id={name} placeholder={labelText} {...inputProps} />
    <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
  </>
);

FormikField.propTypes = {
  inputProps: PropTypes.object,
  type: PropTypes.string,
  labelHidden: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default FormikField;