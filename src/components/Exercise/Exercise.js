import './Exercise.scss';

import React, {useEffect, useState, createContext} from 'react';
import {Button, Card, CardHeader, Col, Table} from 'reactstrap';
import OneSetTableRow from '../Set/OneSetTableRow';
import {withRoute} from 'react-router5';
import AddOneSetTableRow from '../Set/AddOneSetTableRow';
import PropTypes from 'prop-types';
import {getSpecificExercise} from './ExerciseService';
import isEmpty from 'lodash/isEmpty';
import Loading from '../shared/Loading';
import isString from 'lodash/isString';
import ErrorAlert from 'components/ErrorAlert/ErrorAlert';
import cloneDeep from 'lodash/cloneDeep';

const Exercise = ({ router, exerciseUid, singleDayView=false }) => {
  const lgSize = 6;
  const xsSize = 12;

  const [addSetViewVisible, setAddSetViewVisible] = useState(false);
  const [currentExerciseData, setCurrentExerciseData] = useState({});
  const [fetchDataError, setFetchDataError] = useState(null);
  const [lastSetData, setLastSetData] = useState({});
  const [lastSetUid, setLastSetUid] = useState(null);

  const dayUid = router.getState().params.uid;

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getSpecificExercise(exerciseUid);
        // TODO YOu are here! Fix so that we re-fetch the entire workout when a new set is added!
        // setLastSetUid(res.sets[res.sets.length - 1]);
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
        amountInKg: '',
        reps: ''
      }
    }
    return {
      amountInKg: lastSetData.amountInKg,
      reps: lastSetData.reps
    };
  };


  return (
    <Col lg={lgSize} xs={xsSize}>
      <Card>
        <CardHeader className="text-center pt-0 pb-0">
          <h1 className="exercise--title">{currentExerciseData.exerciseName}</h1>
        </CardHeader>
        <Table striped hover size="sm" className="mb-0">
          <thead>
          <tr>
            <th style={{width: "10%"}}>#</th>
            <th style={{width: "45%"}}>Amount (KG)</th>
            <th style={{width: "45%"}}>Repetitions</th>
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
          {addSetViewVisible && <AddOneSetTableRow exerciseUid={currentExerciseData.uid} index={currentExerciseData.sets.length + 1} setAddSetViewVisible={setAddSetViewVisible} initialData={getLastSetData()} setLastSetUid={setLastSetUid}/>}
          </tbody>
          <tfoot>
          {singleDayView && !addSetViewVisible && <tr>
            <td colSpan={3}>
              <Button color="success" block onClick={() => setAddSetViewVisible(!addSetViewVisible)}>Add set</Button>
            </td>
          </tr>}
          <tr>
            <td className="text-center text-muted exercise--edit-text" colSpan={3}>
              Click on a set for different actions
            </td>
          </tr>
          </tfoot>
        </Table>
      </Card>
    </Col>
  );
};

Exercise.propTypes = {
  exerciseUid: PropTypes.string.isRequired,
  singleDayView: PropTypes.bool
};

export default withRoute(Exercise);
