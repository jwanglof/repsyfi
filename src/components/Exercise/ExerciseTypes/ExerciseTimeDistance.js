import React, {createContext, useEffect, useState} from 'react';
import {Col} from 'reactstrap';
import PropTypes from 'prop-types';
import {getSpecificTimeDistanceExercise} from '../ExerciseService';
import isEmpty from 'lodash/isEmpty';
import Loading from '../../shared/Loading';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import TimeDistanceCard from '../../TimeDistance/TimeDistanceCard';
import TimeDistanceCardForm from '../../TimeDistance/TimeDistanceCardForm';

export const EditVisibleCtx = createContext([false, () => {}]);

const ExerciseTimeDistance = ({exerciseUid /*singleDayView*/}) => {
  // const { t } = useTranslation();

  const [currentExerciseData, setCurrentExerciseData] = useState({});
  const [fetchDataError, setFetchDataError] = useState(null);
  const [editVisible, setEditVisible] = useState(false);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getSpecificTimeDistanceExercise(exerciseUid);
        setCurrentExerciseData(res);
      } catch (e) {
        setFetchDataError(e.message);
      }
    };

    fetchExerciseData();
  }, []);

  if (fetchDataError != null) {
    return <Col xs={12}><ErrorAlert errorText={fetchDataError} componentName="ExerciseTimeDistance"/></Col>;
  }

  if (isEmpty(currentExerciseData)) {
    return <Col xs={12}><Loading componentName="ExerciseTimeDistance"/></Col>;
  }

  return (
    <EditVisibleCtx.Provider value={[editVisible, setEditVisible]}>
      {!editVisible && <TimeDistanceCard currentExerciseData={currentExerciseData}/>}
      {editVisible && <TimeDistanceCardForm currentExerciseData={currentExerciseData}/>}
    </EditVisibleCtx.Provider>
  );
};

ExerciseTimeDistance.propTypes = {
  exerciseUid: PropTypes.string.isRequired,
  singleDayView: PropTypes.bool.isRequired
};

export default ExerciseTimeDistance;