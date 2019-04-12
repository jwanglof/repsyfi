import React, {FunctionComponent} from 'react';
import {Alert, Col, Row} from 'reactstrap';

const EmptyCollection: FunctionComponent<IEmptyCollectionProps> = ({componentName, collectionName}) => (<Row><Col xs={12}><Alert color="warning">No data in collection <code>{collectionName}</code> (from component: <code>{componentName}</code>)</Alert></Col></Row>);

interface IEmptyCollectionProps {
  componentName: string,
  collectionName: string
}

export default EmptyCollection;