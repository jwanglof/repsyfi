import './Footer.scss';

import React from 'react';
import {Button, ButtonGroup, Col} from 'reactstrap';
import {withRoute} from 'react-router5';
import {routeNameAddDay, routeNameAllDays, routeNameRoot} from '../../routes';
import Logout from '../Logout/Logout';
import Row from 'reactstrap/es/Row';

const Footer = ({router}) => {
  return (<Row className="footer container text-muted">
      <Col>
        <ButtonGroup className="w-100">
          <Button onClick={() => router.navigate(routeNameRoot, {}, {reload: true})}>Home</Button>
          <Button onClick={() => router.navigate(routeNameAddDay, {}, {reload: true})}>Add day</Button>
          <Button onClick={() => router.navigate(routeNameAllDays, {}, {reload: true})}>All days</Button>
        </ButtonGroup>
      </Col>
      <Col xs={12} lg={2}>
        <Logout/>
      </Col>
  </Row>);
};

export default withRoute(Footer);