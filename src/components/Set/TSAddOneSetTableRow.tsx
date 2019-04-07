import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import TSErrorAlert from '../ErrorAlert/TSErrorAlert';
import {addNewSetAndGetUid, addSetToSetsRepsExerciseArray} from './TSSetService';
import {ISetBasicModel} from '../../models/ISetModel';
import {Formik, FormikActions} from 'formik';
import {getCurrentUsersUid} from '../../config/FirebaseUtils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../shared/formik/FormikField';
import {Button, ButtonGroup} from 'reactstrap';
// TODO :(
// @ts-ignore
import {Form} from 'react-formik-ui';

const TSAddOneSetTableRow: FunctionComponent<ITSAddOneSetTableRowProps> = ({ exerciseUid, initialData, setAddSetViewVisible, setLastSetUid }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><TSErrorAlert errorText={submitErrorMessage} componentName="TSAddOneSetTableRow"/></td></tr>;
  }

  if (!exerciseUid) {
    return <tr><td colSpan={3}><TSErrorAlert errorText="Need an exercise UID to add a set!" componentName="TSAddOneSetTableRow"/></td></tr>;
  }

  const onSubmit = async (values: ISetBasicModel, actions: FormikActions<ISetBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data = {
        index: values.index,
        amountInKg: values.amountInKg,
        reps: values.reps
      };
      const ownerUid = await getCurrentUsersUid();
      const uid = await addNewSetAndGetUid(data, ownerUid);
      await addSetToSetsRepsExerciseArray(uid, exerciseUid);

      // Set the new last UID for the exercise
      setLastSetUid(uid);
      // Hide this form
      setAddSetViewVisible(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  const validate = (values: ITSAddOneSetTableRowValidate): ITSAddOneSetTableRowValidate | {} => {
    const errors: ITSAddOneSetTableRowValidateErrors = {};
    if (!values.amountInKg || values.amountInKg <= 0) {
      errors.amountInKg = t("Amount must exist, and be 0 or higher");
    }
    if (!values.reps || values.reps <= 0) {
      errors.reps = t("Repetitions must exist, and be higher than 1");
    }
    if (!values.index || values.index <= 0) {
      errors.index = t("Index must exist, and be higher than 1")
    }
    return errors;
  };

  return (
    <Formik
      initialValues={initialData}
      onSubmit={onSubmit}
      validate={validate}
      render={({errors, isSubmitting}) => (
        <>
          {isSubmitting && <tr><td colSpan={3} className="text-center"><FontAwesomeIcon icon="spinner" spin/></td></tr>}
          {!isSubmitting && <>
            <tr>
              <th className="align-middle" scope="row">{initialData.index}</th>
              <td>
                <FormikField name="amountInKg" labelText={t("Amount in KG")} type="number" labelHidden={true} min="0"/>
              </td>
              <td>
                <FormikField name="reps" labelText={t("Repetitions")} type="number" labelHidden={true} min="0"/>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <Form>
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

interface ITSAddOneSetTableRowProps {
  exerciseUid: string,
  initialData: any,
  setAddSetViewVisible: any,
  setLastSetUid: any
}

interface ITSAddOneSetTableRowValidate {
  amountInKg?: number,
  reps?: number,
  index?: number
}

interface ITSAddOneSetTableRowValidateErrors {
  amountInKg?: string,
  reps?: string,
  index?: string
}

// interface TSAddOneSetTableRowFormValues {
//   index: values.index,
//   amountInKg: values.amountInKg,
//   reps: values.reps
// }

export default TSAddOneSetTableRow;