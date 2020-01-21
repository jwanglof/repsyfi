import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import TimeDistanceView from './TimeDistanceView';
import TimeDistanceForm from './TimeDistanceForm';
import {ExerciseContainerAddSetViewVisibleCtx} from '../Exercise/ExerciseTypeContainer';
import {Col, Row} from 'reactstrap';
import {getTimeDistanceOnSnapshot} from './TimeDistanceService';
import {IErrorObject, retrieveErrorMessage} from '../../config/FirebaseUtils';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';

const TimeDistanceExerciseContainer: FunctionComponent<ITimeDistanceExerciseContainerProps> = ({timeDistanceExerciseUid}) => {
  const editVisible = useContext(ExerciseContainerAddSetViewVisibleCtx)[0];

  const [timeDistanceData, setTimeDistanceDataData] = useState<ITimeDistanceModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cbErr = (e: IErrorObject) => {
      setFetchDataError(retrieveErrorMessage(e));
    };

    const cb = (data: ITimeDistanceModel) => {
      setTimeDistanceDataData(data);
    };

    const unsubFn = getTimeDistanceOnSnapshot(timeDistanceExerciseUid, cb, cbErr);

    return () => {
      unsubFn();
    };
  }, [timeDistanceExerciseUid]);

  if (fetchDataError) {
    return <ErrorAlert errorText={fetchDataError} componentName="TimeDistanceExerciseContainer"/>;
  }

  if (!timeDistanceData) {
    return <LoadingAlert componentName="TimeDistanceExerciseContainer"/>;
  }

  return (
    <Row>
      <Col>
        {!editVisible && <TimeDistanceView timeDistanceData={timeDistanceData}/>}
        {editVisible && <TimeDistanceForm timeDistanceData={timeDistanceData} />}
      </Col>
    </Row>
  );
};

interface ITimeDistanceExerciseContainerProps {
  timeDistanceExerciseUid: string,
}

export default TimeDistanceExerciseContainer;
