import React, {useContext} from 'react';
import {Button, CardBody, Col, Row} from 'reactstrap';
import PropTypes from 'prop-types';
import {EditVisibleCtx} from '../Exercise/ExerciseTypes/ExerciseTimeDistance';

const TimeDistanceCard = ({currentExerciseData}) => {
  const [editVisible, setEditVisible] = useContext(EditVisibleCtx);

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
        <Col xs={6}>{currentExerciseData.kcal}</Col>
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

TimeDistanceCard.propTypes = {
  currentExerciseData: PropTypes.object.isRequired
};

export default TimeDistanceCard;