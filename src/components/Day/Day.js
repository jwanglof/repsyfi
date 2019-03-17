import './Day.scss';

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Collapse, Row} from 'reactstrap';
import {Link, withRoute} from 'react-router5'
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import {routeNameRoot, routeNameSpecificDay} from 'routes';
import AddExerciseForm from 'components/Exercise/AddExerciseForm';
import Loading from 'components/shared/Loading';
import Exercise from 'components/Exercise/Exercise';
import {getFormattedDate, getTitle} from 'components/Day/DayUtils';
import {getSpecificDayFromUid} from 'components/Day/DayService';
import firebase, {FIRESTORE_COLLECTION_DAYS} from '../../config/firebase';
import ButtonGroup from 'reactstrap/es/ButtonGroup';
import {deleteDay, endDayNow} from './DayService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

// TODO Add real-time elapsed timer!
const Day = ({ router, data={}, uid }) => {
  const [collapseIsOpen, setCollapseIsOpen] = useState(!!uid);
  const [currentData, setCurrentData] = useState(data);
  const [addExerciseViewVisible, setAddExerciseViewVisible] = useState(false);
  const [deleteErrorData, setDeleteErrorData] = useState(null);
  const [updateErrorData, setUpdateErrorData] = useState(null);

  useEffect(() => {
    if (!isEmpty(uid)) {
      getSpecificDayFromUid(uid).then(setCurrentData);
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(uid)) {
      // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
      const unsub = firebase.firestore()
        .collection(FIRESTORE_COLLECTION_DAYS)
        // .where("ownerUid", "==", uid)
        .doc(uid)
        .onSnapshot({includeMetadataChanges: true}, doc => {
          console.log('new doc!!', doc.data());
          setCurrentData(doc.data());
        }, err => {
          console.error('error:', err);
        });

      return () => {
        unsub();
      };
    }
  }, []);

  if (isEmpty(currentData)) {
    return <Loading componentName="Day"/>;
  }

  if (deleteErrorData !== null || updateErrorData !== null) {
    return <ErrorAlert errorText={deleteErrorData || updateErrorData} componentName="Day" uid={uid}/>
  }

  const toggle = () => {
    if (!uid) {
      setCollapseIsOpen(!collapseIsOpen)
    }
  };

  const dayEnd = async () => {
    try {
      await endDayNow(uid);
    } catch (e) {
      setUpdateErrorData(e);
    }
  };

  const dayDelete = async () => {
    try {
      await deleteDay(uid);
      router.navigate(routeNameRoot, {}, {reload: true});
    } catch (e) {
      setDeleteErrorData(e);
    }
  };

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
        {!isEmpty(uid) && !addExerciseViewVisible &&
        <Row className="mb-4 mt-2">
          <Col xs={12}>
            <Button color="success" block onClick={() => setAddExerciseViewVisible(true)}>Add exercise</Button>
          </Col>
        </Row>}

        {/*{addWorkoutViewVisible && <AddOneWorkoutTableRow dayUid={uid} setAddWorkoutViewVisible={setAddWorkoutViewVisible}/>}*/}
        {addExerciseViewVisible && <AddExerciseForm dayUid={uid} setAddExerciseViewVisible={setAddExerciseViewVisible}/>}

        <Row>
          {currentData.exercises.map(exerciseUid => <Exercise key={exerciseUid} exerciseUid={exerciseUid} singleDayView={!isEmpty(uid)}/>)}
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
        {!isEmpty(uid) && <Col xs={12}>
          <ButtonGroup className="w-100">
            <Button color="info">Edit</Button>
            <Button disabled={!!currentData.endTimestamp} onClick={dayEnd}>End day</Button>
            <Button color="danger" onClick={dayDelete}>Delete</Button>
          </ButtonGroup>
        </Col>}
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
