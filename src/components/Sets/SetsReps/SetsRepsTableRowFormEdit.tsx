import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {ISetBasicModel, ISetBasicUpdateModel, ISetModel} from '../../../models/ISetModel';
import {FormikHelpers} from 'formik';
import {updateSetsRepsExercise} from './SetsRepsService';
import SetsRepsTableRowFormRender from './SetsRepsTableRowFormRender';

const SetsRepsTableRowFormEdit: FunctionComponent<ISetsRepsTableRowFormEditProps> = ({ initialData, setAddSetViewVisible }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsRepsTableRowAdd"/></td></tr>;
  }

  const onSubmit = async (values: ISetBasicModel, actions: FormikHelpers<ISetBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetBasicUpdateModel = {
        amountInKg: values.amountInKg,
        reps: values.reps
      };
      await updateSetsRepsExercise(initialData.uid, data);

      // Hide this form
      setAddSetViewVisible(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  return <SetsRepsTableRowFormRender initialData={initialData} onSubmit={onSubmit} t={t} setAddSetViewVisible={setAddSetViewVisible}/>;
};

interface ISetsRepsTableRowFormEditProps {
  initialData: ISetModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

export default SetsRepsTableRowFormEdit;