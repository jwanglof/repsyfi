import React, {useEffect, useState} from 'react';
import {Col, Row} from 'reactstrap';
import Loading from '../shared/Loading';
import Day from './Day';
import {getAllDays} from './DayService';

const AllDays = () => {
  const [allDays, setAllDays] = useState([]);

  useEffect(() => {
    getAllDays().then(setAllDays);
  }, []);

  if (!allDays.length) {
    return <Loading componentName="days"/>;
  }

  return (
    <Row>
      <Col xs={12}>
        <h1>All days</h1>
      </Col>
      <Col xs={12}>
        {allDays.map(d => <Day key={d.uid} data={d}/>)}
      </Col>
    </Row>
  );
};

AllDays.propTypes = {};

export default AllDays;