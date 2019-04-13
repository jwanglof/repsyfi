import './Day.scss';

import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {withRoute} from 'react-router5';
import {Router} from 'router5';
import {isEmpty} from 'lodash';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {IDayModel} from '../../models/IDayModel';
import {routeNameSpecificDay} from '../../routes';
import {Button, Col, Collapse, Row} from 'reactstrap';
import {getFormattedDate, getTitle} from './DayUtils';
import ExerciseTypeContainer from '../Exercise/ExerciseTypeContainer';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const DayView: FunctionComponent<IDayViewProps & IDayViewRouter> = ({router, data}) => {
  const { t } = useTranslation();

  if (isEmpty(data)) {
    return <ErrorAlert errorText="Must have data to show anything for the day!" componentName="DayView"/>;
  }

  const [collapseIsOpen, setCollapseIsOpen] = useState<boolean>(false);

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

      {collapseIsOpen && <Row className="text-center"><Col>{t("Open detailed view")} {t("to edit")}</Col></Row>}

      <Collapse isOpen={collapseIsOpen}>
        <Row>
          {data.exercises.length && data.exercises.map(exerciseUid => <ExerciseTypeContainer key={exerciseUid} exerciseUid={exerciseUid}/>)}
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
          <div>{t("End time")}: {data.endTimestamp && getFormattedDate(data.endTimestamp)}</div>
        </Col>
      </Row>

      <Row className="text-center">
        <Col xs={12}>
          {t("Click to")} {collapseIsOpen ? t("collapse"): t("expand")}
          <br/>
          {collapseIsOpen ? <FontAwesomeIcon icon="caret-up" size="2x"/> : <FontAwesomeIcon icon="caret-down" size="2x"/>}
        </Col>
      </Row>
    </div>
  );
};

interface IDayViewProps {
  data: IDayModel
}

interface IDayViewRouter {
  router: Router
}

export default withRoute(DayView);
