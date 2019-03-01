import React from 'react';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {ErrorMessage} from 'formik';
import capitalize from 'lodash/capitalize';
import PropTypes from 'prop-types';

import {Datepicker} from 'react-formik-ui'
import {colSmSize, labelSmSize} from '../../utils/formik-utils';

export const dateFormat = 'yyyy-MM-dd';

const DatepickerFormGroup = ({label, ...inputProps}) => {
  const disabled = !!inputProps.disabled;
  const labelCapitalized = capitalize(label).replace('_', ' ');

  return (
    <FormGroup row>
      <Label for={label} sm={labelSmSize}>{labelCapitalized}</Label>
      <Col sm={colSmSize}>
        <Datepicker className="mt-1" name={label} disabled={disabled} dateFormat={dateFormat}/>
        <ErrorMessage name={label}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
      </Col>
    </FormGroup>
  );
};

DatepickerFormGroup.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

export default DatepickerFormGroup;
