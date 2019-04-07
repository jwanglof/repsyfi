import React, {createContext, FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {getTimeDistanceExercise} from '../TSExerciseService';
import TSErrorAlert from '../../ErrorAlert/TSErrorAlert';
import TSLoadingAlert from '../../LoadingAlert/TSLoadingAlert';
import {ITimeDistanceModel} from '../../../models/ITimeDistanceModel';
import TimeDistanceCardForm from '../../TimeDistance/TimeDistanceCardForm';
import TSTimeDistanceCard from '../../TimeDistance/TSTimeDistanceCard';

export const TSEditVisibleCtx = createContext<any>([false, () => {}]);

const TSExerciseTimeDistance: FunctionComponent<TSExerciseTimeDistanceProps> = ({exerciseUid, singleDayView}) => {

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
    return <TSErrorAlert errorText={fetchDataError} componentName="TSExerciseSetsReps"/>;
  }

  if (!currentExerciseData) {
    return <TSLoadingAlert componentName="TSExerciseSetsReps"/>;
  }

  return (
    <TSEditVisibleCtx.Provider value={[editVisible, setEditVisible]}>
      {!editVisible && <TSTimeDistanceCard currentExerciseData={currentExerciseData}/>}
      {editVisible && <TimeDistanceCardForm currentExerciseData={currentExerciseData}/>}
    </TSEditVisibleCtx.Provider>
  );
};

interface TSExerciseTimeDistanceProps {
  exerciseUid: string,
  singleDayView: boolean
}

export default TSExerciseTimeDistance;
