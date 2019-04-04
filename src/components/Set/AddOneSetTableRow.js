import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup} from 'reactstrap';
import isEmpty from 'lodash/isEmpty';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {addNewSetAndGetUid, addSetToSetsRepsExerciseArray} from './SetService';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTranslation} from 'react-i18next';
import {Form, Formik} from 'formik';
import FormikField from '../shared/formik/FormikField';
import toNumber from 'lodash/toNumber';

const AddOneSetTableRow = ({ exerciseUid, initialData, setAddSetViewVisible, setLastSetUid }) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState(null);

  if (submitErrorMessage !== null) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="AddOneSetTableRow"/></td></tr>;
  }

  if (!exerciseUid) {
    return <tr><td colSpan={3}><ErrorAlert errorText="Need an exercise UID to add a set!" componentName="AddOneSetTableRow"/></td></tr>;
  }

  const onSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(null);

    try {
      const data = {
        index: values.index,
        amountInKg: values.amountInKg,
        reps: values.reps
      };
      const uid = await addNewSetAndGetUid(data);
      await addSetToSetsRepsExerciseArray(uid, exerciseUid);

      // Set the new last UID for the exercise
      setLastSetUid(uid);
      // Hide this form
      setAddSetViewVisible(false);
    } catch (e) {
      console.error(e);
      // setSubmitErrorMessage(e.data.message);
    }
    actions.setSubmitting(false);
  };

  const validate = values => {
    let errors = {};

    const amountInKgNumber = toNumber(values.amountInKg);
    if (amountInKgNumber < 0 || values.amountInKg === '') {
      errors.amountInKg = t("Amount must be 0 or higher");
    }

    const repsNumber = toNumber(values.reps);
    if (repsNumber <= 0) {
      errors.reps = t("Repetitions must be higher than 1");
    }

    const indexNumber = toNumber(values.index);
    if (indexNumber <= 0) {
      errors.index = t("Index must be higher than 1")
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
                    <Button type="submit" color="primary" disabled={isSubmitting || !isEmpty(errors)}>{t("Save set")}</Button>
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

AddOneSetTableRow.propTypes = {
  exerciseUid: PropTypes.string.isRequired,
  initialData: PropTypes.object.isRequired,
  setAddSetViewVisible: PropTypes.func.isRequired,
  setLastSetUid: PropTypes.func.isRequired
};

export default AddOneSetTableRow;
