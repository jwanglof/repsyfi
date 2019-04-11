import React, {FunctionComponent, useEffect, useState} from 'react';
import {getTimeDistanceExercise} from './TimeDistanceService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import TimeDistanceView from './TimeDistanceView';
import TimeDistanceForm from './TimeDistanceForm';

const TimeDistanceExerciseContainer: FunctionComponent<ITimeDistanceExerciseContainerProps> = ({exerciseUid}) => {
  const [currentExerciseData, setCurrentExerciseData] = useState<ITimeDistanceModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);
  const [editVisible, setEditVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getTimeDistanceExercise(exerciseUid);
        setCurrentExerciseData(res);
      } catch (e) {
        setFetchDataError(e.message);
        console.error(e);
      }
    };

    fetchExerciseData();
  }, []);

  if (fetchDataError) {
    return <ErrorAlert errorText={fetchDataError} componentName="TimeDistanceExerciseContainer"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="TimeDistanceExerciseContainer"/>;
  }

  return (
    <>
      {!editVisible && <TimeDistanceView currentExerciseData={currentExerciseData} setEditVisible={setEditVisible}/>}
      {editVisible && <TimeDistanceForm currentExerciseData={currentExerciseData} setEditVisible={setEditVisible}/>}
    </>
  );
};

interface ITimeDistanceExerciseContainerProps {
  exerciseUid: string
}

export default TimeDistanceExerciseContainer;
