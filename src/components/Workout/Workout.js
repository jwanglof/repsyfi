import './Workout.scss';

import React from 'react';
import {Card, CardHeader, Col, Table} from 'reactstrap';
import OneSet from '../Set/OneSet';

const Workout = ({ data }) => {
  return (
    <Col lg={6} xs={12}>
      <Card>
        <CardHeader className="text-center pt-0 pb-0">
          <h1 className="workout--title">{data.exerciseName}</h1>
        </CardHeader>
        <Table striped hover size="sm">
          <thead>
          <tr>
            <th>#</th>
            <th>Amount (KG)</th>
            <th>Repetitions</th>
          </tr>
          </thead>
          <tbody>
          {data.sets.map(s => <OneSet key={s.uid} data={s}/>)}
          </tbody>
        </Table>
      </Card>
    </Col>
  );
};

Workout.propTypes = {};

export default Workout;
