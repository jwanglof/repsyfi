import React, {FunctionComponent, useContext, useState} from 'react';
import {FormikHelpers} from 'formik';
import {ISetBasicUpdateModel, ISetModel} from '../../models/ISetModel';
// @ts-ignore
import {Button, ButtonDropdown, Col, DropdownItem, DropdownMenu, DropdownToggle, Row} from 'reactstrap';
import {updateSetsRepsExercise} from './SetsReps/SetsRepsService';
import {updateSetsSecondsExercise} from './SetsSeconds/SetsSecondsService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import SetForm from './SetForm';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {useTranslation} from 'react-i18next';
import {SetsExerciseViewShowButtonCtx} from './SetsExerciseView';

const SetEditForm: FunctionComponent<ISetFormProps> = ({setEditVisible, exerciseType, currentData}) => {
  const { t } = useTranslation();

  const [ignored, setButtonsIsShown] = useContext(SetsExerciseViewShowButtonCtx);

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [deleteStep2Shown, setDeleteStep2Shown] = useState<boolean>(false);

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

      hideEditForm();
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.data.message);
    }
  };

  const delSet = () => {
    console.log('Delete!');
  };

  const toggleActionDropdown = () => {
    setDeleteStep2Shown(false);
    setDropdownVisible(!dropdownVisible);
  };

  const hideEditForm = () => {
    setEditVisible(false);
    setButtonsIsShown(true);
  };

  const actionButtonDropdown = (
    <ButtonDropdown isOpen={dropdownVisible} toggle={toggleActionDropdown}>
      <DropdownToggle caret>
        {t("Actions")}
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem toggle={false}>
          {!deleteStep2Shown && <Button onClick={() => setDeleteStep2Shown(true)}>{t("Delete")} {t("set")}</Button>}
          {deleteStep2Shown && <Button className="text-danger" onClick={delSet}>{t("Click again to delete!")}</Button>}
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );

  return <SetForm hideFormCb={hideEditForm} exerciseType={exerciseType} currentData={currentData} onSubmit={onSubmit} extraButtonGroups={actionButtonDropdown}/>;
};

interface ISetFormProps {
  setEditVisible: ((editVisible: boolean) => void)
  exerciseType: ExerciseTypesEnum
  currentData: ISetModel
}

export default SetEditForm;
