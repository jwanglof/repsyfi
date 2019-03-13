import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'reactstrap';

const ErrorAlert = ({errorText, componentName=null}) => (<Alert color="danger">{errorText} {componentName && `(from component: ${componentName})`}</Alert>);

ErrorAlert.propTypes = {
  errorText: PropTypes.string.isRequired
};

export default ErrorAlert;