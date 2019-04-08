import './Day.scss';

import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {withRoute} from 'react-router5';
import {Router} from 'router5';
import isEmpty from 'lodash/isEmpty';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {IDayModel} from '../../models/IDayModel';
import {deleteDay, endDayNow, getDay} from './DayService';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {routeNameEditDay, routeNameRoot} from '../../routes';
import {Button, ButtonGroup, Col, Row} from 'reactstrap';
import {getFormattedDate, getTitle} from './DayUtils';
import AddExerciseForm from '../Exercise/AddExerciseForm';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import ExerciseTypeContainer from '../Exercise/ExerciseTypeContainer';

const DayDetailedView: FunctionComponent<IDayDetailedViewProps> = ({router, dayUid}) => {
  const { t } = useTranslation();

  if (isEmpty(dayUid)) {
    return <ErrorAlert errorText="Must have the day's UID to proceed!"/>;
  }

  const [currentData, setCurrentData] = useState<IDayModel | undefined>(undefined);
  const [deleteErrorData, setDeleteErrorData] = useState<string | undefined>(undefined);
  const [updateErrorData, setUpdateErrorData] = useState<string | undefined>(undefined);
  const [addExerciseViewVisible, setAddExerciseViewVisible] = useState(false);

  useEffect(() => {
    if (!isEmpty(dayUid)) {
      // Get the day's data
      const fetchDay = async () => {
        const data = await getDay(dayUid);
        console.log('Day data:', data);
        setCurrentData(data);
      };
      fetchDay();
    }
  }, []);

  if (!currentData) {
    return <LoadingAlert componentName="DayDetailedView"/>;
  }

  if (deleteErrorData || updateErrorData) {
    return <ErrorAlert errorText={deleteErrorData || updateErrorData} componentName="DayDetailedView" uid={dayUid}/>
  }

  const dayEnd = async () => {
    try {
      await endDayNow(dayUid);
    } catch (e) {
      setUpdateErrorData(e);
    }
  };

  const dayDelete = async () => {
    try {
      await deleteDay(dayUid);
      router.navigate(routeNameRoot, {}, {reload: true});
    } catch (e) {
      setDeleteErrorData(e);
    }
  };

  const editDay = () => router.navigate(routeNameEditDay, {dayUid}, {reload: true});

  const emptyInitialValues = {exerciseName: '', type: ExerciseTypesEnum.EXERCISE_TYPE_NOT_CHOSEN};

  return (
    <>
      {!addExerciseViewVisible && <Row className="mb-4 mt-2">
        <Col xs={12}>
          <Button color="success" block onClick={() => setAddExerciseViewVisible(true)}>{t("Add exercise")}</Button>
        </Col>
      </Row>}

      {addExerciseViewVisible && <AddExerciseForm dayUid={dayUid} setAddExerciseViewVisible={setAddExerciseViewVisible} initialValues={emptyInitialValues}/>}

      <Row>
        {currentData.exercises.length && currentData.exercises.map(exerciseUid => <ExerciseTypeContainer key={exerciseUid} exerciseUid={exerciseUid} singleDayView={!isEmpty(dayUid)} dayUid={dayUid}/>)}
      </Row>

      <Row>
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
          <div>{t("End time")}: {currentData.endTimestamp && getFormattedDate(currentData.endTimestamp)}</div>
        </Col>
        <Col xs={12}>
          <ButtonGroup className="w-100">
            <Button color="info" onClick={editDay}>{t("Edit day")}</Button>
            <Button disabled={!!currentData.endTimestamp} onClick={dayEnd}>{t("End day")}</Button>
            <Button color="danger" onClick={dayDelete}>{t("Delete day")}</Button>
          </ButtonGroup>
        </Col>
      </Row>
    </>
  );
};

interface IDayDetailedViewProps {
  router: Router,
  dayUid: string
}

export default withRoute(DayDetailedView);
