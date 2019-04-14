import React from 'react';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {ErrorMessage} from 'formik/dist/index';
import capitalize from 'lodash/capitalize';
import PropTypes from 'prop-types';

import {Toggle} from 'react-formik-ui'
import {colSmSize, labelSmSize} from '../../utils/formik-utils';

const YesNoField = ({labelText, name, ...inputProps}) => {
  const disabled = !!inputProps.disabled;

  return (
    <FormGroup row>
      <Label for={name} sm={labelSmSize}>{labelText}</Label>
      <Col sm={colSmSize}>
        <Toggle className="mt-1" name={name} disabled={disabled}/>
        <ErrorMessage name={name}>{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
      </Col>
    </FormGroup>
  );
};

YesNoField.propTypes = {
  disabled: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default YesNoField;
