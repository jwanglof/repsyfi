import './Exercise.scss';

import React, {FunctionComponent, useEffect, useState, createContext} from 'react';
import {getExercise} from './ExerciseService';
import {IExerciseModel} from '../../models/IExerciseModel';
import {Card, CardBody, CardHeader, Col} from 'reactstrap';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import ExerciseHeader from './ExerciseHeader';
import ExerciseHeaderView from './ExerciseHeaderView';
import SetsRepsExerciseContainer from '../Sets/SetsReps/SetsRepsExerciseContainer';
import TimeDistanceExerciseContainer from '../TimeDistance/TimeDistanceExerciseContainer';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import SetsSecondsExerciseContainer from '../Sets/SetsSeconds/SetsSecondsExerciseContainer';

export const ExerciseHeaderEditCtx = createContext<any>([false, () => {}]);

const ExerciseTypeContainer: FunctionComponent<IExerciseTypeContainerProps> = ({ exerciseUid }) => {
  const [currentExerciseData, setCurrentExerciseData] = useState<IExerciseModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);
  const [headerEditVisible, setHeaderEditVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getExercise(exerciseUid);
        setCurrentExerciseData(res);
      } catch (e) {
        console.error(e);
        setFetchDataError(e.message);
      }
    };

    // noinspection JSIgnoredPromiseFromCall
    fetchExerciseData();
  }, [exerciseUid]);

  if (fetchDataError != null) {
    return <ErrorAlert errorText={fetchDataError} componentName="ExerciseTypeContainer"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="ExerciseTypeContainer"/>;
  }

  return (<ExerciseHeaderEditCtx.Provider value={[headerEditVisible, setHeaderEditVisible]}>
    <Col lg={4} xs={12} className="mb-2">
      <Card>
        <CardHeader className="text-center pt-0 pb-0">
          <ExerciseHeader exerciseData={currentExerciseData}/>
          <ExerciseHeaderView exerciseData={currentExerciseData}/>
        </CardHeader>

        <CardBody className="mb-0 p-0">
          {currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS && <SetsRepsExerciseContainer setsRepsExerciseUid={currentExerciseData.typeUid} exerciseUid={exerciseUid}/>}
          {currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE && <TimeDistanceExerciseContainer timeDistanceExerciseUid={currentExerciseData.typeUid} exerciseUid={exerciseUid}/>}
          {currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS && <SetsSecondsExerciseContainer setsSecondsExerciseUid={currentExerciseData.typeUid} exerciseUid={exerciseUid}/>}
        </CardBody>
      </Card>
    </Col>
  </ExerciseHeaderEditCtx.Provider>);
};

interface IExerciseTypeContainerProps {
  exerciseUid: string
}

export default ExerciseTypeContainer;