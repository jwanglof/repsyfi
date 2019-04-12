import React, {FunctionComponent} from 'react';
import {IFormikProps} from './ts-formik-utils';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {colSmSize, dateFormat, labelSmSize} from './formik-utils';
import {ErrorMessage} from 'formik';
// @ts-ignore
import {Datepicker} from 'react-formik-ui';

const DatepickerFormGroup: FunctionComponent<IFormikProps> = ({labelText, name, inputProps}) => {
  const disabled = inputProps && inputProps.disabled;
  return (<FormGroup row>
    <Label for={name} sm={labelSmSize}>{labelText}</Label>
    <Col sm={colSmSize}>
      <Datepicker className="mt-1" name={name} disabled={disabled} dateFormat={dateFormat}/>
      <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
    </Col>
  </FormGroup>);
};

export default DatepickerFormGroup;