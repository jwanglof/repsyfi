import './Day.scss';

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Collapse, Row} from 'reactstrap';
import {Link, withRoute} from 'react-router5'
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import {routeNameAddExerciseToSpecificDay, routeNameSpecificDay} from 'routes';
import AddExerciseForm from 'components/Exercise/AddExerciseForm';
import Loading from 'components/shared/Loading';
import Exercise from 'components/Exercise/Exercise';
import {getFormattedDate, getTitle} from 'components/Day/DayUtils';
import {getSpecificDayFromUid} from 'components/Day/DayService';

// TODO Add real-time elapsed timer!
const Day = ({ router, data={}, uid }) => {
  const [collapseIsOpen, setCollapseIsOpen] = useState(!!uid);
  const [currentData, setCurrentData] = useState(data);
  const [addExerciseViewVisible, setAddExerciseViewVisible] = useState(false);

  useEffect(() => {
    if (!isEmpty(uid)) {
      getSpecificDayFromUid(uid).then(setCurrentData);
    }
  }, []);

  if (isEmpty(currentData)) {
    return <Loading componentName="Day"/>;
  }

  const toggle = () => {
    if (!uid) {
      setCollapseIsOpen(!collapseIsOpen)
    }
  };


  console.log(1122, currentData);
  // const gotoAddExerciseRoute = () => router.navigate(routeNameAddExerciseToSpecificDay, {dayUid: uid}, {reload: true});

  const rootClassNames = classnames({'day--border': !uid});

  return (
    <div className={rootClassNames} onClick={toggle}>
      {isEmpty(uid) && <Row className="text-center">
        <Col xs={12}>
          <Link routeName={routeNameSpecificDay} routeParams={{ uid: data.uid }}>Open link</Link>
        </Col>
      </Row>}

      <Collapse isOpen={collapseIsOpen}>
        <Row className="mt-2">
          <Col xs={12} className="text-center">
            <h1>Day {uid && `(${uid})`}</h1>
          </Col>
        </Row>

        {!isEmpty(uid) && !addExerciseViewVisible &&
        <Row className="mb-4">
          <Col xs={12}>
            {/*<Button color="success" block onClick={gotoAddWorkoutRoute}>Add workout</Button>*/}
            <Button color="success" block onClick={() => setAddExerciseViewVisible(true)}>Add exercise</Button>
          </Col>
        </Row>}

        {/*{addWorkoutViewVisible && <AddOneWorkoutTableRow dayUid={uid} setAddWorkoutViewVisible={setAddWorkoutViewVisible}/>}*/}
        {addExerciseViewVisible && <AddExerciseForm dayUid={uid} setAddExerciseViewVisible={setAddExerciseViewVisible}/>}

        <Row>
          {currentData.exercises.map(exerciseUid => <Exercise key={exerciseUid} exerciseUid={exerciseUid}/>)}
        </Row>
      </Collapse>

      <Row onClick={toggle}>
        <Col className="text-lg-right text-center" lg={3} xs={12}>
          <div>Location: {currentData.location}</div>
          <div>Muscle groups: {currentData.muscleGroups}</div>
        </Col>
        <Col className="text-center" lg={6} xs={12}>
          <h2 className="mb-0">{getTitle(currentData.title || null, currentData.startTimestamp)}</h2>
          <div className="day--notes">{currentData.notes}</div>
        </Col>
        <Col className="text-lg-left text-center" lg={3} xs={12}>
          <div>Fr.o.m. {getFormattedDate(currentData.startTimestamp)}</div>
          <div>T.o.m. {getFormattedDate(currentData.endTimestamp)}</div>
        </Col>
      </Row>

      {isEmpty(uid) && <Row className="text-center">
        <Col xs={12}>
          Click to {collapseIsOpen ? 'collapse': 'expand'}
        </Col>
      </Row>}
    </div>
  );
};

Day.propTypes = {
  data: PropTypes.object,
  uid: PropTypes.string
};

export default withRoute(Day);
