import React, {FunctionComponent, useContext} from 'react';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {TSEditVisibleCtx} from '../Exercise/ExerciseTypes/TSExerciseTimeDistance';
import {Button, CardBody, Col, Row} from 'reactstrap';

const TSTimeDistanceCard: FunctionComponent<TSTimeDistanceCardProps> = ({currentExerciseData}) => {
  const [editVisible, setEditVisible] = useContext<any>(TSEditVisibleCtx);

  return (
    <CardBody className="m-0 p-0">
      <Row>
        <Col xs={6}>Total time</Col>
        <Col xs={6}>Total warm-up</Col>
        <Col xs={6}>{currentExerciseData.totalTimeSeconds}</Col>
        <Col xs={6}>{currentExerciseData.totalWarmupSeconds}</Col>
      </Row>
      <Row>
        <Col xs={6}>Total distance</Col>
        <Col xs={6}>Total kcal</Col>
        <Col xs={6}>{currentExerciseData.totalDistanceMeter}</Col>
        <Col xs={6}>{currentExerciseData.totalKcal}</Col>
      </Row>
      <Row>
        <Col xs={6}>Speed min</Col>
        <Col xs={6}>Speed max</Col>
        <Col xs={6}>{currentExerciseData.speedMin}</Col>
        <Col xs={6}>{currentExerciseData.speedMax}</Col>
      </Row>
      <Row>
        <Col xs={6}>Incline min</Col>
        <Col xs={6}>Incline max</Col>
        <Col xs={6}>{currentExerciseData.inclineMin}</Col>
        <Col xs={6}>{currentExerciseData.inclineMax}</Col>
      </Row>
      <Row>
        <Col>
          <Button color="success" block onClick={() => setEditVisible(true)}>Edit</Button>
        </Col>
      </Row>
    </CardBody>
  );
};

interface TSTimeDistanceCardProps {
  currentExerciseData: ITimeDistanceModel
}

export default TSTimeDistanceCard;