import React from 'react';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {ErrorMessage} from 'formik';
import capitalize from 'lodash/capitalize';
import PropTypes from 'prop-types';

import {Toggle} from 'react-formik-ui'
import {colSmSize, labelSmSize} from './formik-utils';

const YesNoField = ({label, ...inputProps}) => {
  const disabled = !!inputProps.disabled;
  const labelCapitalized = capitalize(label).replace('_', ' ');

  return (
    <FormGroup row>
      <Label for={label} sm={labelSmSize}>{labelCapitalized}</Label>
      <Col sm={colSmSize}>
        <Toggle className="mt-1" name={label} disabled={disabled}/>
        <ErrorMessage name={label}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
      </Col>
    </FormGroup>
  );
};

YesNoField.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

export default YesNoField;
