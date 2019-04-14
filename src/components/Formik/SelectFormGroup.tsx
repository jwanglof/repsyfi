import React, {FunctionComponent, useContext} from 'react';
import {IFormikProps} from '../../utils/ts-formik-utils';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {colSmSize, labelSmSize} from '../../utils/formik-utils';
import {ErrorMessage} from 'formik';
// @ts-ignore
import {Select} from 'react-formik-ui';

const SelectFormGroup: FunctionComponent<ISelectFormGroup> = ({labelText, name, options, labelHidden=false, ...inputProps}) => {
  return (
    <FormGroup row>
      {!labelHidden && <Label for={name} sm={labelSmSize}>{labelText}</Label>}
      <Col sm={colSmSize}>
        <Select name={name} options={options} {...inputProps}/>
        <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
      </Col>
    </FormGroup>
  );
};

interface ISelectFormGroup extends IFormikProps {
  options: any
}

export default SelectFormGroup;
