import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {useTranslation} from 'react-i18next';
import {getSetDocument, getSetsRepsExerciseDocument, getSetsRepsExerciseOnSnapshot} from './SetsReps/SetsRepsService';
import {ISetsModel} from '../../models/ISetsModel';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {Col, Row} from 'reactstrap';
import {ExerciseContainerAsdCtx} from '../Exercise/ExerciseTypeContainer';
import {getDay, getDayDocument} from '../Day/DayService';
import {remove} from 'lodash';
import {recalculateIndexes} from '../../utils/exercise-utils';
import firebase from '../../config/firebase';
import {
  getSetSecondDocument,
  getSetsSecondsExerciseDocument,
  getSetsSecondsExerciseOnSnapshot
} from './SetsSeconds/SetsSecondsService';
import {getExerciseDocument} from '../Exercise/ExerciseService';
import {ISetModel} from '../../models/ISetModel';
import SetViewContainer from './SetViewContainer';
import {getLastSetData} from './SetsHelpers';
import SetAddForm from './SetAddForm';
import {IErrorObject, retrieveErrorMessage} from '../../config/FirebaseUtils';

const SetsExerciseView: FunctionComponent<ISetsViewRouter & ISetsViewProps> = ({router, setsExerciseUid, exerciseUid,  exerciseType}) => {
  const { t } = useTranslation();

  const [addSetViewVisible, setAddSetViewVisible] = useContext(ExerciseContainerAsdCtx);

  const [currentExerciseData, setCurrentExerciseData] = useState<ISetsModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [lastSetData, setLastSetData] = useState<ISetModel | undefined>(undefined);

  useEffect(() => {
    const cbErr = (e: IErrorObject) => {
      setFetchDataError(retrieveErrorMessage(e));
    };

    let unsubFn: any;

    if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
      unsubFn = getSetsSecondsExerciseOnSnapshot(setsExerciseUid, setCurrentExerciseData, cbErr);
    } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
      unsubFn = getSetsRepsExerciseOnSnapshot(setsExerciseUid, setCurrentExerciseData, cbErr);
    } else {
      setFetchDataError("Invalid exercise type");
    }

    return () => {
      unsubFn();
    };
  }, [setsExerciseUid, exerciseType]);

  if (fetchDataError || submitErrorMessage) {
    return <ErrorAlert errorText={fetchDataError || submitErrorMessage} componentName="SetsExerciseView"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="SetsExerciseView"/>;
  }

  return (
      <Col>
        <Row className="set__head">
          <Col xs={2}>#</Col>
          <Col xs={5}>{t("Amount in KG")}</Col>
          {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS && <Col xs={5}>{t("Seconds")}</Col>}
          {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS && <Col xs={5}>{t("Repetitions")}</Col>}
        </Row>
        <div className="legend">
          {currentExerciseData.sets.map((setUid, i) => {
            const isLastSet = i === currentExerciseData.sets.length - 1;
            return <SetViewContainer key={i} setUid={setUid} disabled={addSetViewVisible} exerciseType={exerciseType} isLastSet={isLastSet} setLastSetData={setLastSetData} exerciseData={currentExerciseData}/>
          })}
        </div>

        {addSetViewVisible && <SetAddForm currentData={getLastSetData(lastSetData, exerciseType)} setAddSetViewVisible={setAddSetViewVisible} exerciseType={exerciseType} setsExerciseUid={setsExerciseUid}/>}
      </Col>
  );
};

interface ISetsViewProps {
  setsExerciseUid: string
  exerciseUid: string
  exerciseType: ExerciseTypesEnum
}

interface ISetsViewRouter {
  router: Router
}

export default withRouter(SetsExerciseView);
