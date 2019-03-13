import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Input} from 'reactstrap';
import isEmpty from 'lodash/isEmpty';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {addNewSet} from './SetService';

const AddOneSetTableRow = ({ dayUid, workoutUid, index, setAddSetViewVisible, initialData={} }) => {
  const [error, setError] = useState(null);
  const [submitErrorMessage, setSubmitErrorMessage] = useState(null);

  // TODO Replace these with Formik!!!
  // TODO When Formik is introduced, add validation rules as well!
  const [amountInKgValue, setAmountInKgValue] = useState(initialData.amountInKg || "");
  const [repsValue, setRepsValue] = useState(initialData.reps || "");

  if (submitErrorMessage !== null) {
    return <ErrorAlert errorText={submitErrorMessage} componentName="AddOneSetTableRow"/>;
  }

  if (!workoutUid || !dayUid) {
    return <ErrorAlert errorText="Need both a workout UID and a day UID to add a set!" componentName="AddOneSetTableRow"/>;
  }

  const onSubmit = async () => {
    setSubmitErrorMessage(null);

    if (isEmpty(amountInKgValue) || isEmpty(repsValue)) {
      setError("You need to specify both amount and reps!");
    } else {
      setError(null);
    }

    try {
      console.log('Try to add set to workout!', amountInKgValue, repsValue, workoutUid);
      const data = {
        index,
        amountInKg: amountInKgValue,
        reps: repsValue
      };
      const uid = await addNewSet(data, dayUid, workoutUid);
      console.log('set uid:', uid);
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
          <Input type="number" name="amountInKg" id="amountInKg" placeholder="Amount in KG" value={amountInKgValue} onChange={({target: {value}}) => setAmountInKgValue(value)}/>
        </td>
        <td>
          <Input type="number" name="reps" id="reps" placeholder="Repetitions" value={repsValue} onChange={({target: {value}}) => setRepsValue(value)}/>
        </td>
      </tr>
      <tr>
        <td colSpan={3}>
          <ButtonGroup className="d-flex">
            <Button type="submit" color="success" className="w-100" onClick={onSubmit}>Save set</Button>
            <Button color="danger" className="w-100" onClick={() => setAddSetViewVisible(false)}>Discard set</Button>
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
  workoutUid: PropTypes.string.isRequired,
  dayUid: PropTypes.string.isRequired,
};

export default AddOneSetTableRow;
