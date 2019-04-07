import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {withRoute} from 'react-router5';
import {Router} from 'router5';
import isEmpty from 'lodash/isEmpty';
import TSErrorAlert from '../ErrorAlert/TSErrorAlert';
import {IDayModel} from '../../models/IDayModel';
import {routeNameSpecificDay} from '../../routes';
import {Button, Col, Collapse, Row} from 'reactstrap';
import {getFormattedDate, getTitle} from './DayUtils';
import TSExercise from '../Exercise/TSExercise';

const TSDayView: FunctionComponent<TSDayViewProps & TSDayViewRouter> = ({router, data}) => {
  const { t } = useTranslation();

  if (isEmpty(data)) {
    return <TSErrorAlert errorText="Must have data to show anything for the day!"/>;
  }

  const [collapseIsOpen, setCollapseIsOpen] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<IDayModel | undefined>(undefined);


  const toggle = () => {
    setCollapseIsOpen(!collapseIsOpen);
  };

  const openDetailedView = () => router.navigate(routeNameSpecificDay, { uid: data.uid }, {reload: true});

  return (
    <div className="day--separator" onClick={toggle}>
      <Row className="text-center">
        <Col xs={12}>
          <Button block size="sm" onClick={openDetailedView}>{t("Open detailed view")}</Button>
        </Col>
      </Row>

      <Collapse isOpen={collapseIsOpen}>
        <Row>
          {data.exercises.length && data.exercises.map(exerciseUid => <TSExercise key={exerciseUid} dayUid={data.uid} exerciseUid={exerciseUid} singleDayView={false}/>)}
          {/*{currentData.exercises.length && currentData.exercises.map(exerciseUid => <Exercise key={exerciseUid} exerciseUid={exerciseUid} singleDayView={!isEmpty(dayUid)} dayUid={dayUid}/>)}*/}
        </Row>
      </Collapse>

      <Row onClick={toggle}>
        <Col className="text-lg-right text-center" lg={3} xs={12}>
          <div>{t("Workout location")}: {data.location}</div>
          <div>{t("Muscle groups")}: {data.muscleGroups}</div>
        </Col>
        <Col className="text-center" lg={6} xs={12}>
          <h2 className="mb-0">{getTitle(data.title || null, data.startTimestamp)}</h2>
          <div className="day--notes">{data.notes}</div>
        </Col>
        <Col className="text-lg-left text-center" lg={3} xs={12}>
          <div>{t("Start time")}: {getFormattedDate(data.startTimestamp)}</div>
          <div>{t("End time")}: {getFormattedDate(data.endTimestamp)}</div>
        </Col>
      </Row>

      <Row className="text-center">
        <Col xs={12}>
          {t("Click to")} {collapseIsOpen ? t("collapse"): t("expand")}
        </Col>
      </Row>
    </div>
  );
};

interface TSDayViewProps {
  data: IDayModel
}

interface TSDayViewRouter {
  router: Router
}

export default withRoute(TSDayView);
