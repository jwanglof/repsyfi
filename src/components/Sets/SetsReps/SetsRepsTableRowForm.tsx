import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {addNewSetAndGetUid, addSetToSetsRepsExerciseArray} from './SetsRepsService';
import {ISetBasicModel} from '../../../models/ISetModel';
import {Formik, FormikHelpers} from 'formik';
import {getCurrentUsersUid} from '../../../config/FirebaseUtils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../../Formik/FormikField';
import {Button, ButtonGroup} from 'reactstrap';
// TODO :(
// @ts-ignore
import {Form} from 'react-formik-ui';
import {setsValidation} from '../SetsHelpers';

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

  return (
    <Formik
      initialValues={initialData}
      onSubmit={onSubmit}
      validate={(values: any) => {
        return setsValidation(values, t);
      }}
      render={({errors, isSubmitting}) => (
        <>
          {isSubmitting && <tr><td colSpan={3} className="text-center"><FontAwesomeIcon icon="spinner" spin/></td></tr>}
          {!isSubmitting && <>
            <tr>
              <th className="align-middle" scope="row">{initialData.index}</th>
              <td>
                <FormikField name="amountInKg" labelText={t("Amount in KG")} type="number" labelHidden inputProps={{min: 0, autoFocus: true}}/>
              </td>
              <td>
                <FormikField name="reps" labelText={t("Repetitions")} type="number" labelHidden inputProps={{min: 0}}/>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <Form mode='structured'>
                  <ButtonGroup className="w-100">
                    <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save set")}</Button>
                    <Button color="danger" onClick={() => setAddSetViewVisible(false)}>{t("Discard set")}</Button>
                  </ButtonGroup>
                </Form>
              </td>
            </tr>
          </>}
        </>
      )}
    />
  );
};

interface ISetsRepsTableRowFormProps {
  exerciseUid: string,
  initialData: ISetBasicModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

export default SetsRepsTableRowForm;