import React, {Fragment, useEffect, useState} from 'react';
import {Button, Col, Row} from 'reactstrap';
import Loading from '../shared/Loading';
import Day from './Day';
import {getDays} from './DayMockData';

const AllDays = () => {
  const [allDays, setAllDays] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setAllDays(getDays());
    }, 1500);
  }, []);

  if (!allDays.length) {
    return <Loading componentName="days"/>;
  }

  return (
    <Fragment>
      <Row>
        <Col className="text-center" xs={12}>
          <h1>All days <Button color="primary">Add</Button></h1>
        </Col>
        <Col xs={12}>
          {allDays.map(d => <Day key={d.uid} data={d}/>)}
        </Col>
      </Row>
    </Fragment>
  );
};

AllDays.propTypes = {};

export default AllDays;