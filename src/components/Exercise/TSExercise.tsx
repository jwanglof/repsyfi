import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {getExercise} from './TSExerciseService';
import {IExerciseModel} from '../../models/IExerciseModel';
import {Card, CardFooter, Col} from 'reactstrap';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import Loading from '../shared/Loading';
import TSErrorAlert from '../ErrorAlert/TSErrorAlert';
import TSLoadingAlert from '../LoadingAlert/TSLoadingAlert';
import ExerciseHeader from './ExerciseHeader';
import {EXERCISE_TYPE_SETS_REPS, EXERCISE_TYPE_TIME_DISTANCE} from './ExerciseConstants';
import ExerciseSetsReps from './ExerciseTypes/ExerciseSetsReps';
import ExerciseTimeDistance from './ExerciseTypes/ExerciseTimeDistance';
import TSExerciseHeader from './TSExerciseHeader';
import TSExerciseHeaderView from './TSExerciseHeaderView';
import TSExerciseSetsReps from './ExerciseTypes/TSExerciseSetsReps';

const TSExercise: FunctionComponent<TSExerciseProps> = ({ exerciseUid, singleDayView=false, dayUid=null }) => {
  const { t } = useTranslation();

  const [currentExerciseData, setCurrentExerciseData] = useState<IExerciseModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getExercise(exerciseUid);
        console.log('Exercise data:', res);
        setCurrentExerciseData(res);
      } catch (e) {
        console.error(e);
        setFetchDataError(e.message);
      }
    };

    fetchExerciseData();
  }, []);

  if (fetchDataError != null) {
    return <TSErrorAlert errorText={fetchDataError} componentName="TSExercise"/>;
  }

  if (!currentExerciseData) {
    return <TSLoadingAlert componentName="TSExercise"/>;
  }

  return (
    <Col lg={4} xs={12} className="mb-2">
      <Card>
        {dayUid && <TSExerciseHeader exerciseData={currentExerciseData} dayUid={dayUid}/>}
        {!dayUid && <TSExerciseHeaderView exerciseData={currentExerciseData}/>}

        {currentExerciseData.type === EXERCISE_TYPE_SETS_REPS && <TSExerciseSetsReps exerciseUid={currentExerciseData.typeUid} singleDayView={singleDayView}/>}
        {currentExerciseData.type === EXERCISE_TYPE_TIME_DISTANCE && <ExerciseTimeDistance exerciseUid={currentExerciseData.typeUid} singleDayView={singleDayView}/>}
        <CardFooter className="text-muted exercise--card-footer">
          {t("Click on a set for different actions")}
        </CardFooter>
      </Card>
    </Col>
  );
};

interface TSExerciseProps {
  exerciseUid: string,
  singleDayView: boolean,
  dayUid: string | undefined
}

export default TSExercise;