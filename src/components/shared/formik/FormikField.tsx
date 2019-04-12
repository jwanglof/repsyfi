import React, {FunctionComponent, useContext} from 'react';
import {IFormikProps} from './ts-formik-utils';
import {Alert, Input, Label} from 'reactstrap';
import {labelSmSize} from './formik-utils';
import {ErrorMessage, Field} from 'formik';

const FormikField: FunctionComponent<IFormikProps> = ({labelText, name, type="text", labelHidden=false, ...inputProps}) => {
  return (<>
    {!labelHidden && <Label for={name} sm={labelSmSize}>{labelText}</Label>}
    <Input tag={Field} type={type} component="input" name={name} id={name} placeholder={labelText} {...inputProps} />
    <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
  </>);
};

export default FormikField;