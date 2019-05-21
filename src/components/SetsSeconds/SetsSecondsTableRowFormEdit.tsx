import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {Formik, FormikActions} from 'formik';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../Formik/FormikField';
import {Button, ButtonGroup} from 'reactstrap';
import isNumber from 'lodash/isNumber';
// TODO :(
// @ts-ignore
import {Form} from 'react-formik-ui';
import {ISetSecondsBasicModel, ISetSecondsBasicUpdateModel, ISetSecondsModel} from '../../models/ISetSecondsModel';
import {updateSetsSecondsExercise} from './SetsSecondsService';

const SetsSecondsTableRowFormEdit: FunctionComponent<ISetsSecondsTableRowFormEditProps> = ({ initialData, setAddSetViewVisible }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsSecondsTableRowFormEdit"/></td></tr>;
  }

  const onSubmit = async (values: ISetSecondsBasicModel, actions: FormikActions<ISetSecondsBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const data: ISetSecondsBasicUpdateModel = {
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

  const validate = (values: ISetsSecondsTableRowFormEditValidate): ISetsSecondsTableRowFormEditValidate | {} => {
    const errors: ISetsSecondsTableRowFormEditValidateErrors = {};
    if (!isNumber(values.amountInKg) || values.amountInKg && values.amountInKg < 0) {
      errors.amountInKg = t("Amount must exist, and be 0 or higher");
    }
    if (!isNumber(values.seconds) || values.seconds && values.seconds <= 0) {
      errors.seconds = t("Seconds must exist, and be higher than 0");
    }
    return errors;
  };

  // TODO Merge this Form with the form in SetsSecondsTableRowForm!
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
                <FormikField name="seconds" labelText={t("Seconds")} type="number" labelHidden inputProps={{min: 0}}/>
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

interface ISetsSecondsTableRowFormEditProps {
  initialData: ISetSecondsModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

interface ISetsSecondsTableRowFormEditValidate {
  amountInKg?: number,
  seconds?: number,
}

interface ISetsSecondsTableRowFormEditValidateErrors {
  amountInKg?: string,
  seconds?: string,
}

export default SetsSecondsTableRowFormEdit;