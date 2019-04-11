import React, {FunctionComponent, useEffect, useState} from 'react';
import {getTimeDistanceExercise} from './TimeDistanceService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import TimeDistanceCard from './TimeDistanceCard';
import TimeDistanceCardForm from './TimeDistanceCardForm';

const ExerciseTimeDistance: FunctionComponent<IExerciseTimeDistanceProps> = ({exerciseUid}) => {
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
    return <ErrorAlert errorText={fetchDataError} componentName="TSExerciseSetsReps"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="TSExerciseSetsReps"/>;
  }

  return (
    <>
      {!editVisible && <TimeDistanceCard currentExerciseData={currentExerciseData} setEditVisible={setEditVisible}/>}
      {editVisible && <TimeDistanceCardForm currentExerciseData={currentExerciseData} setEditVisible={setEditVisible}/>}
    </>
  );
};

interface IExerciseTimeDistanceProps {
  exerciseUid: string
}

export default ExerciseTimeDistance;
