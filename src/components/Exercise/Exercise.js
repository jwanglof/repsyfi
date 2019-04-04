import './Exercise.scss';

import React, {useEffect, useState} from 'react';
import {Card, CardFooter, Col} from 'reactstrap';
import {withRoute} from 'react-router5';
import PropTypes from 'prop-types';
import {getSpecificExercise} from './ExerciseService';
import isEmpty from 'lodash/isEmpty';
import Loading from '../shared/Loading';
import isString from 'lodash/isString';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {useTranslation} from 'react-i18next';
import ExerciseHeader from './ExerciseHeader';
import {EXERCISE_TYPE_SETS_REPS, EXERCISE_TYPE_TIME_DISTANCE} from './ExerciseConstants';
import ExerciseSetsReps from './ExerciseTypes/ExerciseSetsReps';
import ExerciseTimeDistance from './ExerciseTypes/ExerciseTimeDistance';

const Exercise = ({ exerciseUid, singleDayView=false, dayUid=null }) => {
  const { t } = useTranslation();

  const lgSize = 4;
  const xsSize = 12;

  const [currentExerciseData, setCurrentExerciseData] = useState({});
  const [fetchDataError, setFetchDataError] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getSpecificExercise(exerciseUid);
        console.log('Exercise data:', res);
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

  if (fetchDataError != null) {
    return <Col lg={lgSize} xs={xsSize}><ErrorAlert errorText={fetchDataError} componentName="Exercise"/></Col>;
  }

  if (isEmpty(currentExerciseData)) {
    return <Col lg={lgSize} xs={xsSize}><Loading componentName="Exercise"/></Col>;
  }

  return (
    <Col lg={lgSize} xs={xsSize} className="mb-2">
      <Card>
        <ExerciseHeader exerciseData={currentExerciseData} dayUid={dayUid}/>
        {currentExerciseData.type === EXERCISE_TYPE_SETS_REPS && <ExerciseSetsReps exerciseUid={currentExerciseData.typeUid} singleDayView={singleDayView}/>}
        {currentExerciseData.type === EXERCISE_TYPE_TIME_DISTANCE && <ExerciseTimeDistance exerciseUid={currentExerciseData.typeUid} singleDayView={singleDayView}/>}
        <CardFooter className="text-muted exercise--card-footer">
          {t("Click on a set for different actions")}
        </CardFooter>
      </Card>
    </Col>
  );
};

Exercise.propTypes = {
  exerciseUid: PropTypes.string.isRequired,
  singleDayView: PropTypes.bool,
  dayUid: PropTypes.string
};

export default withRoute(Exercise);
