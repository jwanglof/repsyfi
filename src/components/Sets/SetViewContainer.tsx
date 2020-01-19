import React, {FunctionComponent, useEffect, useState} from 'react';
import SetView from './SetView';
import {ISetModel} from '../../models/ISetModel';
import {setSecondOnSnapshot} from './SetsSeconds/SetsSecondsService';
import {setRepOnSnapshot} from './SetsReps/SetsRepsService';
import {Col, Row} from 'reactstrap';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import SetEditForm from './SetEditForm';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {ISetsModel} from '../../models/ISetsModel';
import {retrieveErrorMessage} from '../../config/FirebaseUtils';

const SetViewContainer: FunctionComponent<ISetViewContainerProps> = ({setUid, exerciseType, isLastSet, setLastSetData, exerciseData}) => {
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<ISetModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cb = (data: ISetModel) => {
      if (isLastSet) {
        setLastSetData(data);
      }
      setCurrentData(data);
    };

    const cbErr = (e: any) => {
      console.error(e);
      setFetchDataError(retrieveErrorMessage(e));
    };

    let unsubFn: any;
    if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
      unsubFn = setSecondOnSnapshot(setUid, cb, cbErr);
    } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
      unsubFn = setRepOnSnapshot(setUid, cb, cbErr);
    } else {
      setFetchDataError("Invalid set type");
    }

    return () => {
      unsubFn();
    }
  }, [setUid, exerciseType, isLastSet, setLastSetData]);

  if (fetchDataError) {
    return <Row><Col><ErrorAlert errorText={fetchDataError} componentName="SetViewContainer"/></Col></Row>;
  }

  if (!currentData) {
    return <Row><Col><LoadingAlert componentName="SetViewContainer"/></Col></Row>;
  }

  return (
    <>
      {!editVisible && <SetView setEditVisible={setEditVisible} exerciseType={exerciseType} currentData={currentData}/>}
      {editVisible && <SetEditForm setEditVisible={setEditVisible} exerciseType={exerciseType} currentData={currentData} exerciseData={exerciseData} setLastSetData={setLastSetData}/>}
    </>
  );
};

interface ISetViewContainerProps {
  setUid: string
  exerciseType: ExerciseTypesEnum
  isLastSet: boolean
  setLastSetData: ((lastSetData: ISetModel | undefined) => void)
  exerciseData: ISetsModel
}

export default SetViewContainer;