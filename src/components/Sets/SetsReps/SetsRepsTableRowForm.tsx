import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {addNewSetAndGetUid, addSetToSetsRepsExerciseArray} from './SetsRepsService';
import {ISetBasicModel} from '../../../models/ISetModel';
import {FormikHelpers} from 'formik';
import {getCurrentUsersUid} from '../../../config/FirebaseUtils';
import SetsTableRowFormRender from '../SetsTableRowFormRender';
import {SetTypesEnum} from '../../../enums/SetTypesEnum';

const SetsRepsTableRowForm: FunctionComponent<ISetsRepsTableRowFormProps> = ({ exerciseUid, initialData, setAddSetViewVisible }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsRepsTableRowAdd"/></td></tr>;
  }

  if (!exerciseUid) {
    return <tr><td colSpan={3}><ErrorAlert errorText="Need an exercise UID to add a set!" componentName="SetsRepsTableRowAdd"/></td></tr>;
  }

  const onSubmit = async (values: ISetBasicModel, actions: FormikHelpers<ISetBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetBasicModel = {
        index: values.index,
        amountInKg: values.amountInKg,
        reps: values.reps
      };
      const ownerUid = await getCurrentUsersUid();
      const uid = await addNewSetAndGetUid(data, ownerUid);
      await addSetToSetsRepsExerciseArray(uid, exerciseUid);

      // Hide this form
      setAddSetViewVisible(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  return <SetsTableRowFormRender initialData={initialData} onSubmit={onSubmit} setAddSetViewVisible={setAddSetViewVisible} t={t} setTypeShown={SetTypesEnum.SET_TYPE_REPS}/>;
};

interface ISetsRepsTableRowFormProps {
  exerciseUid: string,
  initialData: ISetBasicModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

export default SetsRepsTableRowForm;