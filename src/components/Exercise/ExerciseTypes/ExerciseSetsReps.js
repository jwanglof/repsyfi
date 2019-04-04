import React, {useEffect, useState} from 'react';
import {Button, CardBody, Col, Table} from 'reactstrap';
import OneSetTableRow from '../../Set/OneSetTableRow';
import AddOneSetTableRow from '../../Set/AddOneSetTableRow';
import PropTypes from 'prop-types';
import {getSpecificSetsRepsExercise} from '../ExerciseService';
import isEmpty from 'lodash/isEmpty';
import Loading from '../../shared/Loading';
import isString from 'lodash/isString';
import cloneDeep from 'lodash/cloneDeep';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {useTranslation} from 'react-i18next';

const ExerciseSetsReps = ({ exerciseUid, singleDayView=false }) => {
  const { t } = useTranslation();

  const lgSize = 4;
  const xsSize = 12;

  const [addSetViewVisible, setAddSetViewVisible] = useState(false);
  const [currentExerciseData, setCurrentExerciseData] = useState({});
  const [fetchDataError, setFetchDataError] = useState(null);
  const [lastSetData, setLastSetData] = useState({});
  const [lastSetUid, setLastSetUid] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getSpecificSetsRepsExercise(exerciseUid);
        setCurrentExerciseData(res);
      } catch (e) {
        if (isString(e)) {
          setFetchDataError(e);
        } else {
          console.error("Not just a string!", e);
        }
      }
    };

    fetchExerciseData();
  }, []);

  useEffect(() => {
    if (!isEmpty(lastSetUid)) {
      const copy = cloneDeep(currentExerciseData);
      copy.sets.push(lastSetUid);
      setCurrentExerciseData(copy);
    }
  }, [lastSetUid]);

  if (fetchDataError != null) {
    return <Col lg={lgSize} xs={xsSize}><ErrorAlert errorText={fetchDataError} componentName="Exercise"/></Col>;
  }

  if (isEmpty(currentExerciseData)) {
    return <Col lg={lgSize} xs={xsSize}><Loading componentName="Exercise"/></Col>;
  }

  // Return the last set's data so that it can be pre-filled to the new set
  const getLastSetData = () => {
    if (isEmpty(lastSetData)) {
      return {
        index: 1,
        amountInKg: '',
        reps: ''
      }
    }
    return {
      index: (lastSetData.index + 1),
      amountInKg: lastSetData.amountInKg,
      reps: lastSetData.reps
    };
  };

  return (
    <CardBody className="mb-0">
      <Table striped hover={singleDayView && !addSetViewVisible} size="sm" className="mb-0">
        <thead>
        <tr>
          <th style={{width: "10%"}}>#</th>
          <th style={{width: "45%"}}>{t("Amount in KG")}</th>
          <th style={{width: "45%"}}>{t("Repetitions")}</th>
        </tr>
        </thead>
        <tbody>
        {currentExerciseData.sets.map((setUid, i) => {
          if ((i + 1 ) === currentExerciseData.sets.length) {
            // Pass the setter for the last set to the last set
            return <OneSetTableRow key={setUid} setUid={setUid} disabled={addSetViewVisible} setLastSetData={setLastSetData}/>;
          }
          return <OneSetTableRow key={setUid} setUid={setUid} disabled={addSetViewVisible}/>;
        })}
        {addSetViewVisible && <AddOneSetTableRow exerciseUid={currentExerciseData.uid} setAddSetViewVisible={setAddSetViewVisible} initialData={getLastSetData()} setLastSetUid={setLastSetUid}/>}
        </tbody>
        <tfoot>
        {singleDayView && !addSetViewVisible && <tr>
          <td colSpan={3}>
            <Button color="success" block onClick={() => setAddSetViewVisible(!addSetViewVisible)}>{t("Add set")}</Button>
          </td>
        </tr>}
        </tfoot>
      </Table>
    </CardBody>
  );
};

ExerciseSetsReps.propTypes = {
  exerciseUid: PropTypes.string.isRequired,
  singleDayView: PropTypes.bool.isRequired
};

export default ExerciseSetsReps;