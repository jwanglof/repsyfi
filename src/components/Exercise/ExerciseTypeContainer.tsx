import './Exercise.scss';

import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {getExercise} from './ExerciseService';
import {IExerciseModel} from '../../models/IExerciseModel';
import {Card, CardBody, CardFooter, CardHeader, Col} from 'reactstrap';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import ExerciseHeader from './ExerciseHeader';
import ExerciseHeaderView from './ExerciseHeaderView';
import SetsRepsExerciseContainer from '../SetsReps/SetsRepsExerciseContainer';
import TimeDistanceExerciseContainer from '../TimeDistance/TimeDistanceExerciseContainer';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';

const ExerciseTypeContainer: FunctionComponent<IExerciseTypeContainerProps> = ({ exerciseUid, singleDayView=false, dayUid=null }) => {
  const { t } = useTranslation();

  const [currentExerciseData, setCurrentExerciseData] = useState<IExerciseModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getExercise(exerciseUid);
        console.log('EXEC::', res);
        setCurrentExerciseData(res);
      } catch (e) {
        console.error(e);
        setFetchDataError(e.message);
      }
    };

    fetchExerciseData();
  }, []);

  if (fetchDataError != null) {
    return <ErrorAlert errorText={fetchDataError} componentName="ExerciseTypeContainer"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="ExerciseTypeContainer"/>;
  }

  return (
    <Col lg={4} xs={12} className="mb-2">
      <Card>
        <CardHeader className="text-center pt-0 pb-0">
          {dayUid && <ExerciseHeader exerciseData={currentExerciseData} dayUid={dayUid}/>}
          {!dayUid && <ExerciseHeaderView exerciseData={currentExerciseData}/>}
        </CardHeader>

        <CardBody className="mb-0 p-0">
          {currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS && <SetsRepsExerciseContainer exerciseUid={currentExerciseData.typeUid} singleDayView={singleDayView}/>}
          {currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE && <TimeDistanceExerciseContainer exerciseUid={currentExerciseData.typeUid}/>}
        </CardBody>
      </Card>
    </Col>
  );
};

interface IExerciseTypeContainerProps {
  exerciseUid: string,
  singleDayView: boolean,
  dayUid?: string
}

export default ExerciseTypeContainer;