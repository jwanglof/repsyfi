import React, {FunctionComponent} from 'react';
import {IFormikProps} from '../../utils/ts-formik-utils';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {colSmSize, labelSmSize} from '../../utils/formik-utils';
import {ErrorMessage, Field} from 'formik';

const SelectFormGroup: FunctionComponent<ISelectFormGroup> = ({labelText, name, options, labelHidden=false}) => (
  <FormGroup row>
    {!labelHidden && <Label for={name} sm={labelSmSize}>{labelText}</Label>}
    <Col sm={colSmSize}>
      <Field as="select" name={name} id={name} className="form-control">
        {options.map((option, i) => (<option key={i} value={option.value} disabled={option.disabled}>{option.label}</option>))}
      </Field>
      <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
    </Col>
  </FormGroup>
);

interface ISelectFormGroup extends IFormikProps {
  options: ISelectFormOptions[]
}

export interface ISelectFormOptions {
  value: string
  label: string
  disabled?: boolean
}

export default SelectFormGroup;
