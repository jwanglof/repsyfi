import React, {FunctionComponent} from 'react';
import {IFormikProps} from '../../utils/ts-formik-utils';
import {Alert, Col, FormGroup, Input, Label} from 'reactstrap';
import {colSmSize, labelSmSize} from '../../utils/formik-utils';
import {ErrorMessage, Field} from 'formik';

const DateTimePickerFormGroup: FunctionComponent<IFormikProps> = ({labelText, name, ...inputProps}) => {
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

export default DateTimePickerFormGroup;