import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {colSmSize, labelSmSize} from './formik-utils';
import {Select} from 'react-formik-ui';
import {ErrorMessage} from 'formik';
import capitalize from 'lodash/capitalize';

const SelectFormGroup = ({label, options, ...inputProps}) => {
  const disabled = !!inputProps.disabled;
  const labelCapitalized = capitalize(label).replace('_', ' ');

  return (
    <FormGroup row>
      <Label for={label} sm={labelSmSize}>{labelCapitalized}</Label>
      <Col sm={colSmSize}>
        <Select className="mt-1" name={label} disabled={disabled} options={options}/>
        <ErrorMessage name={label}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
      </Col>
    </FormGroup>
  );
};

SelectFormGroup.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default SelectFormGroup;