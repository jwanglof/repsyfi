import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {useTranslation} from 'react-i18next';
import {getSetsRepsExerciseOnSnapshot} from './SetsReps/SetsRepsService';
import {ISetsModel} from '../../models/ISetsModel';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {Col, Row} from 'reactstrap';
import {ExerciseContainerAddSetViewVisibleCtx} from '../Exercise/ExerciseTypeContainer';
import {getSetsSecondsExerciseOnSnapshot} from './SetsSeconds/SetsSecondsService';
import {ISetModel} from '../../models/ISetModel';
import SetViewContainer from './SetViewContainer';
import {getLastSetData} from './SetsHelpers';
import SetAddForm from './SetAddForm';
import {IErrorObject, retrieveErrorMessage} from '../../config/FirebaseUtils';

const SetsExerciseView: FunctionComponent<ISetsViewProps> = ({setsExerciseUid,  exerciseType}) => {
  const { t } = useTranslation();

  const [addSetViewVisible, setAddSetViewVisible] = useContext(ExerciseContainerAddSetViewVisibleCtx);

  const [currentExerciseData, setCurrentExerciseData] = useState<ISetsModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);
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

  if (fetchDataError) {
    return <ErrorAlert errorText={fetchDataError} componentName="SetsExerciseView"/>;
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
            return <SetViewContainer key={i} setUid={setUid} exerciseType={exerciseType} isLastSet={isLastSet} setLastSetData={setLastSetData} exerciseData={currentExerciseData}/>
          })}
        </div>

        {addSetViewVisible && <SetAddForm currentData={getLastSetData(lastSetData, exerciseType)} setAddSetViewVisible={setAddSetViewVisible} exerciseType={exerciseType} setsExerciseUid={setsExerciseUid}/>}
      </Col>
  );
};

interface ISetsViewProps {
  setsExerciseUid: string
  exerciseType: ExerciseTypesEnum
}

export default SetsExerciseView;
