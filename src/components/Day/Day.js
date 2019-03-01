import './Day.scss';

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Col, Collapse, Row} from 'reactstrap';
import Workout from '../Workout/Workout';
import {getFormattedDate, getTitle} from './DayUtils';

const Day = ({ data }) => {
  const [collapseIsOpen, setCollapseIsOpen] = useState(false);

  const toggle = () => setCollapseIsOpen(!collapseIsOpen);

  return (
    <div className="day--border">
      <Row onClick={toggle}>
        <Col className="text-lg-right text-center" lg={3} xs={12}>
          <div>Location: {data.location}</div>
          <div>Muscle groups: {data.muscleGroups}</div>
        </Col>
        <Col className="text-center" lg={6} xs={12}>
          <h2 className="mb-0">{getTitle(data.title, data.startTimestamp)}</h2>
        </Col>
        <Col className="text-lg-left text-center" lg={3} xs={12}>
          <div>Fr.o.m. {getFormattedDate(data.startTimestamp)}</div>
          <div>T.o.m. {getFormattedDate(data.stopTimestamp)}</div>
        </Col>
      </Row>
      <Collapse isOpen={collapseIsOpen}>
        <Row className="mt-2">
          {data.workouts.map(w => <Workout key={w.uid} data={w}/>)}
        </Row>
      </Collapse>
      <Row className="text-center">
        <Col xs={12}>
          Click to {collapseIsOpen ? 'collapse': 'expand'}
        </Col>
      </Row>
    </div>
  );
};

Day.propTypes = {
  data: PropTypes.object.isRequired
};

export default Day;
