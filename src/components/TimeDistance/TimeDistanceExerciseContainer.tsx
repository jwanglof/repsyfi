import React, {FunctionComponent, useContext} from 'react';
import TimeDistanceView from './TimeDistanceView';
import TimeDistanceForm from './TimeDistanceForm';
import {ExerciseContainerAddSetViewVisibleCtx} from '../Exercise/ExerciseTypeContainer';
import {Col, Row} from 'reactstrap';

const TimeDistanceExerciseContainer: FunctionComponent<ITimeDistanceExerciseContainerProps> = ({timeDistanceExerciseUid}) => {
  const editVisible = useContext(ExerciseContainerAddSetViewVisibleCtx)[0];

  return (
    <Row>
      <Col>
        {!editVisible && <TimeDistanceView timeDistanceUid={timeDistanceExerciseUid}/>}
        {editVisible && <TimeDistanceForm timeDistanceUid={timeDistanceExerciseUid}/>}
      </Col>
    </Row>
  );
};

interface ITimeDistanceExerciseContainerProps {
  timeDistanceExerciseUid: string,
}

export default TimeDistanceExerciseContainer;
