import './Day.scss';

import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {withRoute} from 'react-router5';
import {Router} from 'router5';
import {isEmpty, orderBy} from 'lodash';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {IDayModel} from '../../models/IDayModel';
import {deleteDay, endDayNow} from './DayService';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {Button, ButtonGroup, Col, Row} from 'reactstrap';
import {getFormattedDate, getTitle} from './DayUtils';
import ExerciseForm from '../Exercise/ExerciseForm';
import ExerciseTypeContainer from '../Exercise/ExerciseTypeContainer';
import {FirebaseCollectionNames} from '../../config/FirebaseUtils';
import firebase from '../../config/firebase';
import {RouteNames} from '../../routes';
import {useGlobalState} from '../../state';

const DayViewDetailed: FunctionComponent<IDayViewDetailedRouter & IDayViewDetailedProps> = ({router, dayUid}) => {
  const { t } = useTranslation();

  if (isEmpty(dayUid)) {
    return <ErrorAlert errorText="Must have the day's UID to proceed!" componentName="DayViewDetailed"/>;
  }

  const [currentData, setCurrentData] = useState<IDayModel | undefined>(undefined);
  const [deleteErrorData, setDeleteErrorData] = useState<string | undefined>(undefined);
  const [updateErrorData, setUpdateErrorData] = useState<string | undefined>(undefined);
  const [snapshotErrorData, setSnapshotErrorData] = useState<string | undefined>(undefined);
  const [addExerciseViewVisible, setAddExerciseViewVisible] = useState(false);
  const [dayDeleteStep2Shown, setDayDeleteStep2Shown] = useState<boolean>(false);

  const setTimerRunning = useGlobalState('timerRunning')[1];

  // Effect to subscribe on changes on this specific day
  useEffect(() => {
    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    const unsub = firebase.firestore()
      .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
      // .where("ownerUid", "==", uid)
      .doc(dayUid)
      .onSnapshot({includeMetadataChanges: true}, doc => {
        if (doc.exists && !isEmpty(doc.data())) {
          const snapshotData: any = doc.data();
          setCurrentData({
            ownerUid: snapshotData.ownerUid,
            uid: doc.id,
            createdTimestamp: snapshotData.createdTimestamp,
            notes: snapshotData.notes,
            title: snapshotData.title,
            muscleGroups: snapshotData.muscleGroups,
            location: snapshotData.location,
            exercises: snapshotData.exercises,
            startTimestamp: snapshotData.startTimestamp,
            endTimestamp: snapshotData.endTimestamp,
            version: snapshotData.version
          });
        }
      }, err => {
        console.error('error:', err);
        setSnapshotErrorData(err.message);
      });

    // Unsubscribe on un-mount
    return () => {
      unsub();
    };
  }, []);

  if (deleteErrorData || updateErrorData || snapshotErrorData) {
    return <ErrorAlert errorText={deleteErrorData || updateErrorData || snapshotErrorData} componentName="DayDetailedView" uid={dayUid}/>
  }

  if (!currentData) {
    return <LoadingAlert componentName="DayDetailedView"/>;
  }

  const dayEnd = async () => {
    try {
      await endDayNow(dayUid);
      setTimerRunning(false);
    } catch (e) {
      setUpdateErrorData(e.message);
    }
  };

  const dayDelete = async () => {
    try {
      console.log('Removing dayUid:', dayUid);
      await deleteDay(dayUid);
      router.navigate(RouteNames.ALL_DAYS, {}, {reload: true});
    } catch (e) {
      setDeleteErrorData(e.message);
    }
  };

  const editDay = () => router.navigate(RouteNames.EDIT_DAY, {dayUid}, {reload: true});
  const shouldShowEndDayButton = !currentData.endTimestamp;

  return (
    <>
      {!addExerciseViewVisible && <Row className="mb-4 mt-2">
        <Col xs={12}>
          <Button color="success" block onClick={() => setAddExerciseViewVisible(true)}>{t("Add exercise")}</Button>
        </Col>
      </Row>}

      {addExerciseViewVisible && <ExerciseForm setAddExerciseViewVisible={setAddExerciseViewVisible}/>}

      <Row>
        {currentData.exercises.length && orderBy(currentData.exercises, 'index', 'desc').map(e => <ExerciseTypeContainer key={e.exerciseUid} exerciseUid={e.exerciseUid} dayUid={dayUid}/>)}
      </Row>

      <Row>
        <Col className="text-lg-right text-center" lg={3} xs={12}>
          <div>{t("Workout location")}: {currentData.location}</div>
          <div>{t("Muscle groups")}: {currentData.muscleGroups}</div>
        </Col>
        <Col className="text-center" lg={6} xs={12}>
          <h2 className="mb-0">{getTitle(currentData.title || null, currentData.startTimestamp)}</h2>
          <div>{currentData.notes}</div>
        </Col>
        <Col className="text-lg-left text-center" lg={3} xs={12}>
          <div>{t("Start time")}: {getFormattedDate(currentData.startTimestamp)}</div>
          <div>{t("End time")}: {currentData.endTimestamp && getFormattedDate(currentData.endTimestamp)}</div>
        </Col>
        <Col xs={12}>
          <ButtonGroup className="w-100">
            <Button color="info" onClick={editDay}>{t("Edit day")}</Button>
            {shouldShowEndDayButton && <Button onClick={dayEnd}>{t("End day")}</Button>}
            {!dayDeleteStep2Shown && <Button color="warning" onClick={() => setDayDeleteStep2Shown(true)}>{t("Delete day")}</Button>}
            {dayDeleteStep2Shown && <Button color="danger" onClick={dayDelete}>{t("Click again to delete!")}</Button>}
            {dayDeleteStep2Shown && <Button color="primary" onClick={() => setDayDeleteStep2Shown(false)}>{t("Abort")}</Button>}
          </ButtonGroup>
        </Col>
      </Row>
    </>
  );
};

interface IDayViewDetailedProps {
  dayUid: string
}

interface IDayViewDetailedRouter {
  router: Router
}

export default withRoute(DayViewDetailed);
