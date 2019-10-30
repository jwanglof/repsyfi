import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {FormikHelpers} from 'formik';
import {addNewSetSecondsAndGetUid, addSetSecondsToSetsSecondsExerciseArray} from './SetsSecondsService';
import {getCurrentUsersUid} from '../../../config/FirebaseUtils';
import {ISetBasicModel} from '../../../models/ISetModel';
import SetsTableRowFormRender from '../SetsTableRowFormRender';
import {SetTypesEnum} from '../../../enums/SetTypesEnum';

const SetsSecondsTableRowForm: FunctionComponent<ISetsSecondsTableRowFormProps> = ({ exerciseUid, initialData, setAddSetViewVisible }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsSecondsTableRowForm"/></td></tr>;
  }

  if (!exerciseUid) {
    return <tr><td colSpan={3}><ErrorAlert errorText="Need an exercise UID to add a set!" componentName="SetsSecondsTableRowForm"/></td></tr>;
  }

  const onSubmit = async (values: ISetBasicModel, actions: FormikHelpers<ISetBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetBasicModel = {
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

  return <SetsTableRowFormRender initialData={initialData} onSubmit={onSubmit} setAddSetViewVisible={setAddSetViewVisible} t={t} setTypeShown={SetTypesEnum.SET_TYPE_SECONDS}/>;
};

interface ISetsSecondsTableRowFormProps {
  exerciseUid: string,
  initialData: ISetBasicModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

export default SetsSecondsTableRowForm;