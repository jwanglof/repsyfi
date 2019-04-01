import './Day.scss';

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup, Col, Collapse, Row} from 'reactstrap';
import {withRoute} from 'react-router5'
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';
import {deleteDay, endDayNow, getSpecificDayFromUid} from './DayService';
import firebase, {FIRESTORE_COLLECTION_DAYS} from '../../config/firebase';
import Loading from '../shared/Loading';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {routeNameEditDay, routeNameRoot, routeNameSpecificDay} from '../../routes';
import {getFormattedDate, getTitle} from './DayUtils';
import AddExerciseForm from '../Exercise/AddExerciseForm';
import Exercise from '../Exercise/Exercise';
import {useTranslation} from 'react-i18next';

// TODO Add real-time elapsed timer!
const Day = ({ router, data={}, uid }) => {
  const { t } = useTranslation();

  const [collapseIsOpen, setCollapseIsOpen] = useState(!!uid);
  const [currentData, setCurrentData] = useState(data);
  const [addExerciseViewVisible, setAddExerciseViewVisible] = useState(false);
  const [deleteErrorData, setDeleteErrorData] = useState(null);
  const [updateErrorData, setUpdateErrorData] = useState(null);

  // Effect to set the specific day's initial data
  useEffect(() => {
    if (!isEmpty(uid)) {
      getSpecificDayFromUid(uid).then(setCurrentData);
    }
  }, []);

  // Effect to subscribe on changes on this specific day
  useEffect(() => {
    if (!isEmpty(uid)) {
      // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
      const unsub = firebase.firestore()
        .collection(FIRESTORE_COLLECTION_DAYS)
        // .where("ownerUid", "==", uid)
        .doc(uid)
        .onSnapshot({includeMetadataChanges: true}, doc => {
          if (!isEmpty(doc.data())) {
            setCurrentData(doc.data());
          }
        }, err => {
          console.error('error:', err);
        });

      // Unsubscribe on un-mount
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

  const editDay = () => router.navigate(routeNameEditDay, {dayUid: uid}, {reload: true});

  const openDetailedView = () => router.navigate(routeNameSpecificDay, { uid: currentData.uid }, {reload: true});

  const rootClassNames = classnames({'day--separator': !uid});

  return (
    <div className={rootClassNames} onClick={toggle}>
      {isEmpty(uid) && <Row className="text-center">
        <Col xs={12}>
          <Button block size="sm" onClick={openDetailedView}>{t("Open detailed view")}</Button>
        </Col>
      </Row>}

      <Collapse isOpen={collapseIsOpen}>
        {!isEmpty(uid) && !addExerciseViewVisible &&
        <Row className="mb-4 mt-2">
          <Col xs={12}>
            <Button color="success" block onClick={() => setAddExerciseViewVisible(true)}>{t("Add exercise")}</Button>
          </Col>
        </Row>}

        {addExerciseViewVisible && <AddExerciseForm dayUid={uid} setAddExerciseViewVisible={setAddExerciseViewVisible}/>}

        <Row>
          {currentData.exercises.length && currentData.exercises.map(exerciseUid => <Exercise key={exerciseUid} exerciseUid={exerciseUid} singleDayView={!isEmpty(uid)} dayUid={uid}/>)}
        </Row>
      </Collapse>

      <Row onClick={toggle}>
        <Col className="text-lg-right text-center" lg={3} xs={12}>
          <div>{t("Workout location")}: {currentData.location}</div>
          <div>{t("Muscle groups")}: {currentData.muscleGroups}</div>
        </Col>
        <Col className="text-center" lg={6} xs={12}>
          <h2 className="mb-0">{getTitle(currentData.title || null, currentData.startTimestamp)}</h2>
          <div className="day--notes">{currentData.notes}</div>
        </Col>
        <Col className="text-lg-left text-center" lg={3} xs={12}>
          <div>{t("Start time")}: {getFormattedDate(currentData.startTimestamp)}</div>
          <div>{t("End time")}: {getFormattedDate(currentData.endTimestamp)}</div>
        </Col>
        {!isEmpty(uid) && <Col xs={12}>
          <ButtonGroup className="w-100">
            <Button color="info" onClick={editDay}>{t("Edit day")}</Button>
            <Button disabled={!!currentData.endTimestamp} onClick={dayEnd}>{t("End day")}</Button>
            <Button color="danger" onClick={dayDelete}>{t("Delete day")}</Button>
          </ButtonGroup>
        </Col>}
      </Row>

      {isEmpty(uid) && <Row className="text-center">
        <Col xs={12}>
          {t("Click to")} {collapseIsOpen ? t("collapse"): t("expand")}
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
