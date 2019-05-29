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
import {ISetSecondsBasicModel} from '../../models/ISetSecondsModel';
import {addNewSetSecondsAndGetUid, addSetSecondsToSetsSecondsExerciseArray} from './SetsSecondsService';
import {getCurrentUsersUid} from '../../config/FirebaseUtils';

const SetsSecondsTableRowForm: FunctionComponent<ISetsSecondsTableRowFormProps> = ({ exerciseUid, initialData, setAddSetViewVisible }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="SetsSecondsTableRowForm"/></td></tr>;
  }

  if (!exerciseUid) {
    return <tr><td colSpan={3}><ErrorAlert errorText="Need an exercise UID to add a set!" componentName="SetsSecondsTableRowForm"/></td></tr>;
  }

  const onSubmit = async (values: ISetSecondsBasicModel, actions: FormikActions<ISetSecondsBasicModel>) => {
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

  const validate = (values: ISetsSecondsTableRowFormValidate): ISetsSecondsTableRowFormValidate | {} => {
    const errors: ISetsSecondsTableRowFormValidateErrors = {};
    if (!isNumber(values.amountInKg) || values.amountInKg && values.amountInKg < 0) {
      errors.amountInKg = t("Amount must exist, and be 0 or higher");
    }
    if (!isNumber(values.seconds) || values.seconds && values.seconds <= 0) {
      errors.seconds = t("Repetitions must exist, and be higher than 0");
    }
    if (!isNumber(values.index) || values.index && values.index <= 0) {
      errors.index = t("Index must exist, and be higher than 0")
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
                <FormikField name="amountInKg" labelText={t("Amount in KG")} type="number" labelHidden inputProps={{min: 0, autoFocus: true}}/>
              </td>
              <td>
                <FormikField name="seconds" labelText={t("Seconds")} type="number" labelHidden inputProps={{min: 0}}/>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <Form mode='structured' themed>
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

interface ISetsSecondsTableRowFormProps {
  exerciseUid: string,
  initialData: ISetSecondsBasicModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

interface ISetsSecondsTableRowFormValidate {
  amountInKg?: number,
  seconds?: number,
  index?: number
}

interface ISetsSecondsTableRowFormValidateErrors {
  amountInKg?: string,
  seconds?: string,
  index?: string
}

export default SetsSecondsTableRowForm;