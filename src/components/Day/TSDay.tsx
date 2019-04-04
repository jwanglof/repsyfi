import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {withRoute} from 'react-router5';
import {Router} from 'router5';
import isEmpty from 'lodash/isEmpty';
import TSErrorAlert from '../ErrorAlert/TSErrorAlert';
import {IDayModel} from '../../models/IDayModel';
import {deleteDay, endDayNow, getDay} from './TSDayService';
import TSLoadingAlert from '../LoadingAlert/TSLoadingAlert';
import {routeNameEditDay, routeNameRoot, routeNameSpecificDay} from '../../routes';
import classnames from 'classnames';
import {Button, ButtonGroup, Col, Collapse, Row} from 'reactstrap';
import {getFormattedDate, getTitle} from './DayUtils';
import TSAddExerciseForm from '../Exercise/TSAddExerciseForm';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';

const TSDay: FunctionComponent<TSDayProps> = ({router, dayUid}) => {
  const { t } = useTranslation();

  if (isEmpty(dayUid)) {
    return <TSErrorAlert errorText="Must have the day's UID to proceed!"/>;
  }

  const [collapseIsOpen, setCollapseIsOpen] = useState<boolean>(!!dayUid);
  const [currentData, setCurrentData] = useState<IDayModel | undefined>(undefined);
  const [deleteErrorData, setDeleteErrorData] = useState<string | undefined>(undefined);
  const [updateErrorData, setUpdateErrorData] = useState<string | undefined>(undefined);
  const [addExerciseViewVisible, setAddExerciseViewVisible] = useState(false);

  useEffect(() => {
    if (!isEmpty(dayUid)) {
      // Get the day's data
      const fetchDay = async () => {
        const data = await getDay(dayUid);
        setCurrentData(data);
      };
      fetchDay();
    }
  }, []);

  if (!currentData) {
    return <TSLoadingAlert componentName="Day"/>;
  }

  if (deleteErrorData || updateErrorData) {
    return <TSErrorAlert errorText={deleteErrorData || updateErrorData} componentName="TSDay" uid={dayUid}/>
  }

  const toggle = () => {
    if (!dayUid) {
      setCollapseIsOpen(!collapseIsOpen);
    }
  };

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

  const openDetailedView = () => router.navigate(routeNameSpecificDay, { uid: currentData.uid }, {reload: true});

  const rootClassNames = classnames({'day--separator': !dayUid});

  const emptyInitialValues = {exerciseName: '', type: ExerciseTypesEnum.EXERCISE_TYPE_NOT_CHOSEN};

  console.log(12121, currentData);
  return (
    <div className={rootClassNames} onClick={toggle}>
      {isEmpty(dayUid) && <Row className="text-center">
        <Col xs={12}>
          <Button block size="sm" onClick={openDetailedView}>{t("Open detailed view")}</Button>
        </Col>
      </Row>}

      <Collapse isOpen={collapseIsOpen}>
        {!isEmpty(dayUid) && !addExerciseViewVisible &&
        <Row className="mb-4 mt-2">
          <Col xs={12}>
            <Button color="success" block onClick={() => setAddExerciseViewVisible(true)}>{t("Add exercise")}</Button>
          </Col>
        </Row>}

        {addExerciseViewVisible && <TSAddExerciseForm dayUid={dayUid} setAddExerciseViewVisible={setAddExerciseViewVisible} initialValues={emptyInitialValues}/>}

        {/*<Row>*/}
        {/*  {currentData.exercises.length && currentData.exercises.map(exerciseUid => <Exercise key={exerciseUid} exerciseUid={exerciseUid} singleDayView={!isEmpty(dayUid)} dayUid={dayUid}/>)}*/}
        {/*</Row>*/}
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
        {!isEmpty(dayUid) && <Col xs={12}>
          <ButtonGroup className="w-100">
            <Button color="info" onClick={editDay}>{t("Edit day")}</Button>
            <Button disabled={!!currentData.endTimestamp} onClick={dayEnd}>{t("End day")}</Button>
            <Button color="danger" onClick={dayDelete}>{t("Delete day")}</Button>
          </ButtonGroup>
        </Col>}
      </Row>

      {isEmpty(dayUid) && <Row className="text-center">
        <Col xs={12}>
          {t("Click to")} {collapseIsOpen ? t("collapse"): t("expand")}
        </Col>
      </Row>}
    </div>
  );
};

interface TSDayProps {
  router: Router,
  dayUid: string
}

export default withRoute(TSDay);
