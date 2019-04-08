import React, {createContext, FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {getTimeDistanceExercise} from '../Exercise/ExerciseService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import TimeDistanceCard from './TimeDistanceCard';
import TimeDistanceCardForm from './TimeDistanceCardForm';

export const TSEditVisibleCtx = createContext<any>([false, () => {}]);

const ExerciseTimeDistance: FunctionComponent<IExerciseTimeDistanceProps> = ({exerciseUid, singleDayView}) => {

  const { t } = useTranslation();

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
    <TSEditVisibleCtx.Provider value={[editVisible, setEditVisible]}>
      {!editVisible && <TimeDistanceCard currentExerciseData={currentExerciseData}/>}
      {editVisible && <TimeDistanceCardForm currentExerciseData={currentExerciseData}/>}
    </TSEditVisibleCtx.Provider>
  );
};

interface IExerciseTimeDistanceProps {
  exerciseUid: string,
  singleDayView: boolean
}

export default ExerciseTimeDistance;
