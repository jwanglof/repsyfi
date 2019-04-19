import React, {FunctionComponent, useState} from 'react';
import TimeDistanceView from './TimeDistanceView';
import TimeDistanceForm from './TimeDistanceForm';

const TimeDistanceExerciseContainer: FunctionComponent<ITimeDistanceExerciseContainerProps> = ({timeDistanceExerciseUid, exerciseUid}) => {
  const [editVisible, setEditVisible] = useState<boolean>(false);

  // TODO Add a context for timeDistanceUid and setEditVisible
  return (
    <>
      {!editVisible && <TimeDistanceView setEditVisible={setEditVisible} exerciseUid={exerciseUid} timeDistanceUid={timeDistanceExerciseUid}/>}
      {editVisible && <TimeDistanceForm setEditVisible={setEditVisible} timeDistanceUid={timeDistanceExerciseUid}/>}
    </>
  );
};

interface ITimeDistanceExerciseContainerProps {
  timeDistanceExerciseUid: string,
  exerciseUid: string,
}

export default TimeDistanceExerciseContainer;
