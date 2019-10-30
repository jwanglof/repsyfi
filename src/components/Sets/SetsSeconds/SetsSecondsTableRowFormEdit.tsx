import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {FormikHelpers} from 'formik';
import {updateSetsSecondsExercise} from './SetsSecondsService';
import SetsSecondsTableFormRowRender from './SetsSecondsTableRowFormRender';
import {ISetBasicModel, ISetBasicUpdateModel, ISetModel} from '../../../models/ISetModel';

const SetsSecondsTableRowFormEdit: FunctionComponent<ISetsSecondsTableRowFormEditProps> = ({ initialData, setAddSetViewVisible }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsSecondsTableRowFormEdit"/></td></tr>;
  }

  const onSubmit = async (values: ISetBasicModel, actions: FormikHelpers<ISetBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetBasicUpdateModel = {
        amountInKg: values.amountInKg,
        seconds: values.seconds
      };
      await updateSetsSecondsExercise(initialData.uid, data);

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

interface ISetsSecondsTableRowFormEditProps {
  initialData: ISetModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

export default SetsSecondsTableRowFormEdit;