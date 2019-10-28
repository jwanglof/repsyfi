import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {ISetBasicModel, ISetBasicUpdateModel, ISetModel} from '../../models/ISetModel';
import {Formik, FormikHelpers} from 'formik';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../Formik/FormikField';
import {Button, ButtonGroup} from 'reactstrap';
import isNumber from 'lodash/isNumber';
// TODO :(
// @ts-ignore
import {Form} from 'react-formik-ui';
import {updateSetsRepsExercise} from './SetsRepsService';

const SetsRepsTableRowFormEdit: FunctionComponent<ISetsRepsTableRowFormEditProps> = ({ initialData, setAddSetViewVisible }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsRepsTableRowAdd"/></td></tr>;
  }

  const onSubmit = async (values: ISetBasicModel, actions: FormikHelpers<ISetModel>) => {
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

  const validate = (values: ISetsRepsTableRowFormEditValidate): ISetsRepsTableRowFormEditValidate | {} => {
    const errors: ISetsRepsTableRowFormEditValidateErrors = {};
    if (!isNumber(values.amountInKg) || values.amountInKg && values.amountInKg < 0) {
      errors.amountInKg = t("Amount must exist, and be 0 or higher");
    }
    if (!isNumber(values.reps) || values.reps && values.reps <= 0) {
      errors.reps = t("Repetitions must exist, and be higher than 0");
    }
    return errors;
  };

  // TODO Merge this Form with the form in SetsRepsTableRowForm!
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

interface ISetsRepsTableRowFormEditProps {
  initialData: ISetModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

interface ISetsRepsTableRowFormEditValidate {
  amountInKg?: number,
  reps?: number,
}

interface ISetsRepsTableRowFormEditValidateErrors {
  amountInKg?: string,
  reps?: string,
}

export default SetsRepsTableRowFormEdit;