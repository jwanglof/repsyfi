import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {FormikHelpers} from 'formik';
import {ISetSecondsBasicModel} from '../../../models/ISetSecondsModel';
import {addNewSetSecondsAndGetUid, addSetSecondsToSetsSecondsExerciseArray} from './SetsSecondsService';
import {getCurrentUsersUid} from '../../../config/FirebaseUtils';
import SetsSecondsTableFormRowRender from './SetsSecondsTableRowFormRender';

const SetsSecondsTableRowForm: FunctionComponent<ISetsSecondsTableRowFormProps> = ({ exerciseUid, initialData, setAddSetViewVisible }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsSecondsTableRowForm"/></td></tr>;
  }

  if (!exerciseUid) {
    return <tr><td colSpan={3}><ErrorAlert errorText="Need an exercise UID to add a set!" componentName="SetsSecondsTableRowForm"/></td></tr>;
  }

  const onSubmit = async (values: ISetSecondsBasicModel, actions: FormikHelpers<ISetSecondsBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetSecondsBasicModel = {
        index: values.index,
        amountInKg: values.amountInKg,
        seconds: values.seconds
      };
      const ownerUid = await getCurrentUsersUid();
      const uid = await addNewSetSecondsAndGetUid(data, ownerUid);
      await addSetSecondsToSetsSecondsExerciseArray(uid, exerciseUid);

      // Hide this form
      setAddSetViewVisible(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  return <SetsSecondsTableFormRowRender initialData={initialData} onSubmit={onSubmit} setAddSetViewVisible={setAddSetViewVisible} t={t}/>
};

interface ISetsSecondsTableRowFormProps {
  exerciseUid: string,
  initialData: ISetSecondsBasicModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

export default SetsSecondsTableRowForm;