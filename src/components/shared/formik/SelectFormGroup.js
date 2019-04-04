import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Col, FormGroup, Label} from 'reactstrap';
import {colSmSize, labelSmSize} from './formik-utils';
import {Select} from 'react-formik-ui';
import {ErrorMessage} from 'formik';

const SelectFormGroup = ({labelText, name, options, labelHidden=false, ...inputProps}) => {
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

SelectFormGroup.propTypes = {
  inputProps: PropTypes.shape({
    disabled: PropTypes.bool
  }),
  labelHidden: PropTypes.bool,
  labelText: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
// SelectFormGroup.propTypes = {
//   disabled: PropTypes.bool,
//   label: PropTypes.string.isRequired,
//   options: PropTypes.array.isRequired,
// };

export default SelectFormGroup;