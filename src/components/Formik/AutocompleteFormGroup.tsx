import React, {FunctionComponent} from 'react';
import {IFormikProps} from '../../utils/ts-formik-utils';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {colSmSize, dateFormat, labelSmSize} from '../../utils/formik-utils';
import {ErrorMessage} from 'formik';
// @ts-ignore
import {Autocomplete} from 'react-formik-ui';

const AutocompleteFormGroup: FunctionComponent<IFormikProps> = ({labelText, name, suggestions, inputProps}) => {
  const disabled = inputProps && inputProps.disabled;
  return (<FormGroup row>
    <Label for={name} sm={labelSmSize}>{labelText}</Label>
    <Col sm={colSmSize}>
      <Autocomplete className="mt-1" name={name} disabled={disabled} suggestions={suggestions}/>
      <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
    </Col>
  </FormGroup>);
};

export default AutocompleteFormGroup;