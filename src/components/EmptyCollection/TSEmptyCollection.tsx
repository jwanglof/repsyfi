import React, {FunctionComponent} from 'react';
import {Alert, Col, Row} from 'reactstrap';

const TSEmptyCollection: FunctionComponent<TSEmptyCollectionProps> = ({componentName, collectionName}) => (<Row><Col xs={12}><Alert color="warning">No data in collection <code>{collectionName}</code> (from component: <code>{componentName}</code>)</Alert></Col></Row>);

interface TSEmptyCollectionProps {
  componentName: string,
  collectionName: string
}

export default TSEmptyCollection;