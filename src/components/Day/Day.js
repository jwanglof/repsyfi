import './Day.scss';

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Collapse, Row} from 'reactstrap';
import Workout from '../Workout/Workout';
import {getFormattedDate, getTitle} from './DayUtils';
import {Link, withRoute} from 'react-router5'
import {fkDayOne, getSpecificDay} from './DayMockData';
import isEmpty from 'lodash/isEmpty';
import Loading from '../shared/Loading';
import classnames from 'classnames';
import {routeNameAddWorkoutToSpecificDay} from '../../routes';
import AddWorkoutForm from '../Workout/AddWorkoutForm';

// TODO Add real-time elapsed timer!
const Day = ({ router, data={}, uid }) => {
  const [collapseIsOpen, setCollapseIsOpen] = useState(!!uid);
  const [currentData, setCurrentData] = useState(data);
  const [addWorkoutViewVisible, setAddWorkoutViewVisible] = useState(false);

  useEffect(() => {
    if (!isEmpty(uid)) {
      setCurrentData(getSpecificDay(uid));
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

  const gotoAddWorkoutRoute = () => router.navigate(routeNameAddWorkoutToSpecificDay, {dayUid: uid}, {reload: true});

  const rootClassNames = classnames({'day--border': !uid});

  return (
    <div className={rootClassNames} onClick={toggle}>
      {isEmpty(uid) && <Row className="text-center">
        <Col xs={12}>
          <Link routeName="specific-day" routeParams={{ uid: fkDayOne }}>Open link</Link>
        </Col>
      </Row>}

      <Collapse isOpen={collapseIsOpen}>
        <Row className="mt-2">
          <Col xs={12} className="text-center">
            <h1>Day {uid && `(${uid})`}</h1>
          </Col>
        </Row>

        {!isEmpty(uid) && !addWorkoutViewVisible &&
        <Row className="mb-4">
          <Col xs={12}>
            {/*<Button color="success" block onClick={gotoAddWorkoutRoute}>Add workout</Button>*/}
            <Button color="success" block onClick={() => setAddWorkoutViewVisible(true)}>Add workout</Button>
          </Col>
        </Row>}

        {/*{addWorkoutViewVisible && <AddOneWorkoutTableRow dayUid={uid} setAddWorkoutViewVisible={setAddWorkoutViewVisible}/>}*/}
        {addWorkoutViewVisible && <AddWorkoutForm dayUid={uid} setAddWorkoutViewVisible={setAddWorkoutViewVisible}/>}

        <Row>
          {currentData.workouts.map(({uid}) => <Workout key={uid} workoutUid={uid}/>)}
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
