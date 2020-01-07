import React, {FunctionComponent, useState} from 'react';
import {FormikHelpers} from 'formik';
import {ISetBasicUpdateModel, ISetModel} from '../../models/ISetModel';
// @ts-ignore
import {Col, Row} from 'reactstrap';
import {updateSetsRepsExercise} from './SetsReps/SetsRepsService';
import {updateSetsSecondsExercise} from './SetsSeconds/SetsSecondsService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import SetForm from './SetForm';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';

const SetEditForm: FunctionComponent<ISetFormProps> = ({setEditVisible, exerciseType, currentData}) => {
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <Row><Col><ErrorAlert errorText={submitErrorMessage} componentName="SetForm" uid={currentData.uid}/></Col></Row>;
  }

  const onSubmit = async (values: ISetModel, actions: FormikHelpers<ISetModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetBasicUpdateModel = {
        amountInKg: values.amountInKg,
      };

      if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
        data.reps = values.reps;
        await updateSetsRepsExercise(currentData.uid, data);
      } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
        data.seconds = values.seconds;
        await updateSetsSecondsExercise(currentData.uid, data);
      }

      actions.setSubmitting(false);

      // Hide this form
      setEditVisible(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.data.message);
    }
  };

  return <SetForm setEditVisible={setEditVisible} exerciseType={exerciseType} currentData={currentData} onSubmit={onSubmit}/>;
};

interface ISetFormProps {
  setEditVisible: ((editVisible: boolean) => void)
  exerciseType: ExerciseTypesEnum
  currentData: ISetModel
}

export default SetEditForm;
