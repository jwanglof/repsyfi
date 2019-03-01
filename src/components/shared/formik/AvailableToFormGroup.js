import React from 'react';
import {Col, FormGroup, Input, Label} from 'reactstrap';
import {Field} from 'formik';
import {colSmSize, labelSmSize} from '../../utils/formik-utils';
import capitalize from 'lodash/capitalize';

const AvailableToFormGroup = () => {
  const label = 'available_to';
  const labelCapitalized = capitalize(label).replace('_', ' ');

  return (
    <FormGroup row>
      <Label for={label} sm={labelSmSize}>{labelCapitalized}</Label>
      <Col sm={colSmSize}>
        <Input tag={Field} type="text" component="input" name={label} id={label} value="" placeholder="Tillsvidare" disabled />
      </Col>
    </FormGroup>
  );
};

export default AvailableToFormGroup;