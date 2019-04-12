import React, {FunctionComponent} from 'react';
import {Col, Row} from 'reactstrap';
import News from '../News/News';

const Dashboard: FunctionComponent<IDashboardProps> = () => {
  return <>
    <Row>
      <Col>This is where you'll see your dashboard with some stats. Because everyone loves stats, right? <span role="img" aria-label="" aria-labelledby="">😉</span></Col>
    </Row>
    <Row>
      <Col xs={12}>
        <h1>News</h1>
      </Col>
    </Row>
    <News/>
  </>;
};

interface IDashboardProps {}

export default Dashboard;