import React, {FunctionComponent, useState} from 'react';
import {FormikHelpers} from 'formik';
import {ISetBasicUpdateModel, ISetModel} from '../../models/ISetModel';
// @ts-ignore
import {ButtonDropdown, Col, DropdownItem, DropdownMenu, DropdownToggle, Row} from 'reactstrap';
import {getSetDocument, getSetsRepsExerciseDocument, updateSetsRepsExercise} from './SetsReps/SetsRepsService';
import {
  getSetSecondDocument,
  getSetsSecondsExerciseDocument,
  updateSetsSecondsExercise
} from './SetsSeconds/SetsSecondsService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import SetForm from './SetForm';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {useTranslation} from 'react-i18next';
// import {SetsExerciseViewShowButtonCtx} from './SetsExerciseView';
import firebase from '../../config/firebase';
import {ISetsModel} from '../../models/ISetsModel';
import {retrieveErrorMessage} from '../../config/FirebaseUtils';

const SetEditForm: FunctionComponent<ISetFormProps> = ({setEditVisible, exerciseType, currentData, exerciseData, setLastSetData}) => {
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [deleteStep2Shown, setDeleteStep2Shown] = useState<boolean>(false);

  if (errorMessage) {
    return <Row><Col><ErrorAlert errorText={errorMessage} componentName="SetForm" uid={currentData.uid}/></Col></Row>;
  }

  const onSubmit = async (values: ISetModel, actions: FormikHelpers<ISetModel>) => {
    actions.setSubmitting(true);
    setErrorMessage(undefined);

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

      hideEditForm();
    } catch (e) {
      console.error(e);
      setErrorMessage(retrieveErrorMessage(e));
    }
  };

  const delSet = async () => {
    try {
      // More: https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
      const batch = firebase.firestore().batch();

      if (exerciseData.sets.length > 1) {
        // Iterate each set on the exercise and change the indexes
        const setIndexPromises = exerciseData.sets.map(async setUid => {
          // Do not care about the current set
          if (setUid !== currentData.uid) {
            let documentReference;
            if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
              documentReference = getSetDocument(setUid);
            } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
              documentReference = getSetSecondDocument(setUid);
            } else {
              throw new Error('Invalid exercise type!');
            }

            const info = await documentReference.get();
            if (info.exists) {
              const setData = info.data()!;
              // If the index is larger than the current set then we need to update the set's index
              if (setData.index > currentData.index) {
                await batch.update(documentReference, {index: setData.index - 1});
              }
            }
          }
        });

        await Promise.all(setIndexPromises);
      } else {
        // If we remove the last set on the exercise, reset the last set data
        setLastSetData(undefined);
      }

      // Delete the set from the exercise's set array and delete the set
      if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
        batch
          .update(
            getSetsRepsExerciseDocument(exerciseData.uid),
            {sets: firebase.firestore.FieldValue.arrayRemove(currentData.uid)}
          );
        batch.delete(getSetDocument(currentData.uid));
      } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
        batch
          .update(
            getSetsSecondsExerciseDocument(exerciseData.uid),
            {sets: firebase.firestore.FieldValue.arrayRemove(currentData.uid)}
          );
        batch.delete(getSetSecondDocument(currentData.uid));
      }

      await batch.commit();

      toggleActionDropdown();
      hideEditForm();
    } catch (e) {
      console.error(e);
      setErrorMessage(retrieveErrorMessage(e));
    }
  };

  const toggleActionDropdown = () => {
    setDeleteStep2Shown(false);
    setDropdownVisible(!dropdownVisible);
  };

  const hideEditForm = () => {
    setEditVisible(false);
  };

  const actionButtonDropdown = (
    <ButtonDropdown isOpen={dropdownVisible} toggle={toggleActionDropdown}>
      <DropdownToggle caret>
        {t("Actions")}
      </DropdownToggle>
      <DropdownMenu>
        {!deleteStep2Shown && <DropdownItem toggle={false} onClick={() => setDeleteStep2Shown(true)}>{t("Delete")} {t("set")}</DropdownItem>}
        {deleteStep2Shown && <DropdownItem toggle={false} className="text-danger" onClick={() => delSet()}>{t("Click again to delete!")}</DropdownItem>}
      </DropdownMenu>
    </ButtonDropdown>
  );

  return <SetForm hideFormCb={hideEditForm} exerciseType={exerciseType} currentData={currentData} onSubmit={onSubmit} extraButtonGroups={actionButtonDropdown}/>;
};

interface ISetFormProps {
  setEditVisible: ((editVisible: boolean) => void)
  exerciseType: ExerciseTypesEnum
  currentData: ISetModel
  exerciseData: ISetsModel
  setLastSetData: ((lastSetData: undefined) => void)
}

export default SetEditForm;
