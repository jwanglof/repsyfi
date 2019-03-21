import React from 'react';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {ErrorMessage} from 'formik';
import PropTypes from 'prop-types';

import {Datepicker} from 'react-formik-ui'
import {colSmSize, dateFormat, labelSmSize} from './formik-utils';

const DatepickerFormGroup = ({labelText, name, disabled=false}) => (
  <FormGroup row>
    <Label for={name} sm={labelSmSize}>{labelText}</Label>
    <Col sm={colSmSize}>
      <Datepicker className="mt-1" name={name} disabled={disabled} dateFormat={dateFormat}/>
      <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
    </Col>
  </FormGroup>
);

DatepickerFormGroup.propTypes = {
  disabled: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default DatepickerFormGroup;
