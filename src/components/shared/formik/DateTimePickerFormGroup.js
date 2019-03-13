import React from 'react';
import {Alert, Col, FormGroup, Input, Label} from 'reactstrap';
import {ErrorMessage, Field} from 'formik';
import capitalize from 'lodash/capitalize';
import PropTypes from 'prop-types';
import {colSmSize, labelSmSize} from './formik-utils';

const DateTimePickerFormGroup = ({label, ...inputProps}) => {
  const disabled = !!inputProps.disabled;
  const labelCapitalized = capitalize(label).replace('_', ' ');

  return (
    <FormGroup row>
      <Label for={label} sm={labelSmSize}>{labelCapitalized}</Label>
      <Col sm={colSmSize}>
        <Input tag={Field} type="time" component="input" name={label} id={label} placeholder={labelCapitalized} disabled={disabled} />
        <ErrorMessage name={label}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
      </Col>
    </FormGroup>
  );
};

DateTimePickerFormGroup.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

export default DateTimePickerFormGroup;
