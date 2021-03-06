import React, {FunctionComponent, useState} from 'react';
import {FormikHelpers} from 'formik';
import {ISetBasicModel, ISetModel} from '../../models/ISetModel';
// @ts-ignore
import {Col, Row} from 'reactstrap';
import {addNewSetAndGetUid, addSetToSetsRepsExerciseArray} from './SetsReps/SetsRepsService';
import {addNewSetSecondsAndGetUid, addSetSecondsToSetsSecondsExerciseArray} from './SetsSeconds/SetsSecondsService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import SetForm from './SetForm';
import {getCurrentUsersUid, retrieveErrorMessage} from '../../config/FirebaseUtils';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';

const SetAddForm: FunctionComponent<ISetFormProps> = ({setAddSetViewVisible, exerciseType, currentData, setsExerciseUid}) => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <Row><Col><ErrorAlert errorText={submitErrorMessage} componentName="SetForm" uid={currentData.uid}/></Col></Row>;
  }

  const onSubmit = async (values: ISetModel, actions: FormikHelpers<ISetModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetBasicModel = {
        index: values.index,
        amountInKg: values.amountInKg,
      };
      const ownerUid = await getCurrentUsersUid();

      if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
        data.seconds = values.seconds;
        const uid = await addNewSetSecondsAndGetUid(data, ownerUid);
        await addSetSecondsToSetsSecondsExerciseArray(uid, setsExerciseUid);
      } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
        data.reps = values.reps;
        const uid = await addNewSetAndGetUid(data, ownerUid);
        await addSetToSetsRepsExerciseArray(uid, setsExerciseUid);
      }

      actions.setSubmitting(false);

      hideAddForm();
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(retrieveErrorMessage(e));
    }
  };

  const hideAddForm = () => {
    setAddSetViewVisible(false);
  };

  return <SetForm hideFormCb={hideAddForm} exerciseType={exerciseType} currentData={currentData} onSubmit={onSubmit}/>;
};

interface ISetFormProps {
  setAddSetViewVisible: ((editVisible: boolean) => void)
  exerciseType: ExerciseTypesEnum
  currentData: ISetModel
  setsExerciseUid: string
}

export default SetAddForm;
