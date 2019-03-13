import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Input} from 'reactstrap';
import isEmpty from 'lodash/isEmpty';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

const AddOneExerciseTableRow = ({ dayUid, index, setAddExerciseViewVisible, initialData={} }) => {
  const [error, setError] = useState(null);
  const [submitErrorMessage, setSubmitErrorMessage] = useState(null);

  // TODO Replace these with Formik!!!
  // TODO When Formik is introduced, add validation rules as well!
  const [amountInKgValue, setAmountInKgValue] = useState(initialData.amountInKg || "");
  const [repsValue, setRepsValue] = useState(initialData.reps || "");

  if (submitErrorMessage !== null) {
    return <ErrorAlert errorText={submitErrorMessage} componentName="AddOneExerciseTableRow"/>;
  }

  if (!dayUid) {
    return <ErrorAlert errorText="Need a day UID to add an exercise!" componentName="AddOneExerciseTableRow"/>;
  }

  const onSubmit = async () => {
    setSubmitErrorMessage(null);
    console.log("SAVE!!");
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
            <Button color="danger" className="w-100" onClick={() => setAddExerciseViewVisible(false)}>Discard set</Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  );
};

AddOneExerciseTableRow.propTypes = {
  index: PropTypes.number,
  initialData: PropTypes.object,
  setAddExerciseViewVisible: PropTypes.func.isRequired,
  dayUid: PropTypes.string.isRequired,
};

export default AddOneExerciseTableRow;
