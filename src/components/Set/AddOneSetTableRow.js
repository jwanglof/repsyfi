import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Input} from 'reactstrap';
import isEmpty from 'lodash/isEmpty';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {addNewSet} from './SetService';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTranslation} from 'react-i18next';

const AddOneSetTableRow = ({ exerciseUid, index, setAddSetViewVisible, setLastSetUid, initialData={} }) => {
  const { t } = useTranslation();

  const [error, setError] = useState(null);
  const [submitErrorMessage, setSubmitErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // TODO Replace these with Formik!!!
  // TODO When Formik is introduced, add validation rules as well!
  const [amountInKgValue, setAmountInKgValue] = useState(initialData.amountInKg || "");
  const [repsValue, setRepsValue] = useState(initialData.reps || "");

  if (loading) {
    return <tr><td colSpan={3}><FontAwesomeIcon icon="spinner" spin/></td></tr>;
  }

  if (submitErrorMessage !== null) {
    return <tr><td colSpan={3}><ErrorAlert errorText={submitErrorMessage} componentName="AddOneSetTableRow"/></td></tr>;
  }

  if (!exerciseUid) {
    return <tr><td colSpan={3}><ErrorAlert errorText="Need a exercise UID to add a set!" componentName="AddOneSetTableRow"/></td></tr>;
  }

  const onSubmit = async () => {
    setSubmitErrorMessage(null);

    if (isEmpty(amountInKgValue) || isEmpty(repsValue)) {
      setError("You need to specify both amount and reps!");
    } else {
      setError(null);
    }

    try {
      const data = {
        index,
        amountInKg: amountInKgValue,
        reps: repsValue
      };
      console.log('BASSS');
      setLoading(true);
      const uid = await addNewSet(data, exerciseUid);
      setLoading(false);
      // Set the new last UID for the exercise
      setLastSetUid(uid);
      // Hide this form
      setAddSetViewVisible(false);
    } catch (e) {
      console.error(e);
      // setSubmitErrorMessage(e.data.message);
    }
  };

  return (
    <>
      {!isEmpty(error) && <tr><td colSpan={3}><ErrorAlert errorText={error}/></td></tr>}
      <tr>
        <th className="align-middle" scope="row">{index || initialData.index}</th>
        <td>
          <Input type="number" name="amountInKg" id="amountInKg" placeholder={t("Amount in KG")} value={amountInKgValue} onChange={({target: {value}}) => setAmountInKgValue(value)}/>
        </td>
        <td>
          <Input type="number" name="reps" id="reps" placeholder={t("Repetitions")} value={repsValue} onChange={({target: {value}}) => setRepsValue(value)}/>
        </td>
      </tr>
      <tr>
        <td colSpan={3}>
          <ButtonGroup className="d-flex">
            <Button type="submit" color="success" className="w-100" onClick={onSubmit}>{t("Save set")}</Button>
            <Button color="danger" className="w-100" onClick={() => setAddSetViewVisible(false)}>{t("Discard set")}</Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  );
};

AddOneSetTableRow.propTypes = {
  index: PropTypes.number,
  initialData: PropTypes.object,
  setAddSetViewVisible: PropTypes.func.isRequired,
  exerciseUid: PropTypes.string.isRequired,
  setLastSetUid: PropTypes.func.isRequired
};

export default AddOneSetTableRow;
