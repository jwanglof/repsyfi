import React, {FunctionComponent} from 'react';
import {Alert, Col, FormGroup, Input, Label} from 'reactstrap';
import {colSmSize, labelSmSize} from './formik-utils';
import {ErrorMessage, Field} from 'formik';
import {IFormikProps} from './ts-formik-utils';

const FieldFormGroup: FunctionComponent<IFormikProps> = ({labelText, name, type="text", labelHidden=false, ...inputProps}) => {
  return (<FormGroup row>
    {!labelHidden && <Label for={name} sm={labelSmSize}>{labelText}</Label>}
    <Col sm={colSmSize}>
      <Input tag={Field} type={type} component="input" name={name} id={name} placeholder={labelText} {...inputProps} />
      <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
    </Col>
  </FormGroup>);
};

export default FieldFormGroup;