import React from 'react';
import {Alert, Col, Row} from 'reactstrap';
import PropTypes from 'prop-types';

const EmptyCollection = ({componentName, collectionName}) => (<Row><Col xs={12}><Alert color="warning">No data in collection <code>{collectionName}</code> (from component: <code>{componentName}</code>)</Alert></Col></Row>);

EmptyCollection.propTypes = {
  componentName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
};

export default EmptyCollection;