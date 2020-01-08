import './Exercise.scss';

import React, {createContext, FunctionComponent, useEffect, useState} from 'react';
import {getExercise} from './ExerciseService';
import {IExerciseModel} from '../../models/IExerciseModel';
import {Card, CardBody, CardFooter, CardHeader, Col} from 'reactstrap';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import ExerciseHeader from './ExerciseHeader';
import ExerciseHeaderView from './ExerciseHeaderView';
import TimeDistanceExerciseContainer from '../TimeDistance/TimeDistanceExerciseContainer';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {useTranslation} from 'react-i18next';
import SetsView from '../Sets/SetsExerciseView';
import {retrieveErrorMessage} from '../../config/FirebaseUtils';

export const ExerciseHeaderEditCtx = createContext<any>([false, () => {}]);

const ExerciseTypeContainer: FunctionComponent<IExerciseTypeContainerProps> = ({ exerciseUid }) => {
  const { t } = useTranslation();

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
        setFetchDataError(retrieveErrorMessage(e));
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

  const showFooterInfo = (currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS || currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS);

  return (<ExerciseHeaderEditCtx.Provider value={[headerEditVisible, setHeaderEditVisible]}>
    <Col lg={4} xs={12} className="mb-2">
      <Card>
        <CardHeader className="text-center pt-0 pb-0">
          <ExerciseHeader exerciseData={currentExerciseData}/>
          <ExerciseHeaderView exerciseData={currentExerciseData}/>
        </CardHeader>

        <CardBody className="mb-0 p-0">
          {(currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS || currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) && <SetsView setsExerciseUid={currentExerciseData.typeUid} exerciseType={currentExerciseData.type} exerciseUid={exerciseUid}/>}
          {currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE && <TimeDistanceExerciseContainer timeDistanceExerciseUid={currentExerciseData.typeUid} exerciseUid={exerciseUid}/>}
        </CardBody>

        {showFooterInfo && <CardFooter className="text-muted text-center font-italic p-0">
          <small>{t("Click on a set for different actions")}</small>
        </CardFooter>}
      </Card>
    </Col>
  </ExerciseHeaderEditCtx.Provider>);
};

interface IExerciseTypeContainerProps {
  exerciseUid: string
}

export default ExerciseTypeContainer;