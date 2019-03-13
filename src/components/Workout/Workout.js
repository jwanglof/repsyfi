import './Workout.scss';

import React, {useEffect, useState} from 'react';
import {Button, Card, CardHeader, Col, Table} from 'reactstrap';
import OneSet from '../Set/OneSet';
import {withRoute} from 'react-router5';
import AddOneSetTableRow from '../Set/AddOneSetTableRow';
import PropTypes from 'prop-types';
import {getSpecificWorkout} from './WorkoutService';
import isEmpty from 'lodash/isEmpty';
import Loading from '../shared/Loading';

async function fetchSpecificWorkout(workoutUid) {
  return await getSpecificWorkout(workoutUid);
}

const Workout = ({ router, workoutUid }) => {
  const lgSize = 6;
  const xsSize = 12;

  const [addSetViewVisible, setAddSetViewVisible] = useState(false);
  const [currentWorkoutData, setCurrentWorkoutData] = useState({});

  const dayUid = router.getState().params.uid;

  useEffect(() => {
    try {
      setTimeout(() => {
      fetchSpecificWorkout(workoutUid).then(setCurrentWorkoutData)
      }, 500);
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (isEmpty(currentWorkoutData)) {
    return <Col lg={lgSize} xs={xsSize}><Loading componentName="Workout"/></Col>;
  }

  // Return the last set's data so that it can be pre-filled to the new set
  const getLastSetData = () => {
    if (!currentWorkoutData.sets.length) {
      return {
        amountInKg: '',
        reps: ''
      }
    }
    const lastSet = currentWorkoutData.sets[currentWorkoutData.sets.length - 1];
    return {
      amountInKg: lastSet.amountInKg,
      reps: lastSet.reps
    };
  };

  return (
    <Col lg={lgSize} xs={xsSize}>
      <Card>
        <CardHeader className="text-center pt-0 pb-0">
          <h1 className="workout--title">{currentWorkoutData.exerciseName}</h1>
        </CardHeader>
        <Table striped hover size="sm" className="mb-0">
          <thead>
          <tr>
            <th style={{width: "10%"}}>#</th>
            <th style={{width: "45%"}}>Amount (KG)</th>
            <th style={{width: "45%"}}>Repetitions</th>
          </tr>
          </thead>
          <tbody>
          {currentWorkoutData.sets.map(s => <OneSet key={s.uid} data={s} disabled={addSetViewVisible}/>)}
          {addSetViewVisible && <AddOneSetTableRow dayUid={dayUid} workoutUid={currentWorkoutData.uid} index={currentWorkoutData.sets.length + 1} setAddSetViewVisible={setAddSetViewVisible} initialData={getLastSetData()}/>}
          </tbody>
          <tfoot>
          <tr>
            <td colSpan={3}>
              {!addSetViewVisible && <Button color="success" block onClick={() => setAddSetViewVisible(!addSetViewVisible)}>Add set</Button>}
            </td>
          </tr>
          <tr>
            <td className="text-center text-muted workout--edit-text" colSpan={3}>
              Click on a set for different actions
            </td>
          </tr>
          </tfoot>
        </Table>
      </Card>
    </Col>
  );
};

Workout.propTypes = {
  workoutUid: PropTypes.string.isRequired
};

export default withRoute(Workout);
