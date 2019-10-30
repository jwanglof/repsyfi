import './Day.scss';

import React, {FunctionComponent} from 'react';
import {useTranslation} from 'react-i18next';
import {withRoute} from 'react-router5';
import {Router} from 'router5';
import isEmpty from 'lodash/isEmpty';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {IDayModel} from '../../models/IDayModel';
import {Button, Col, Row} from 'reactstrap';
import {getFormattedDate, getTitle} from './DayUtils';
import {RouteNames} from '../../routes';

const DayView: FunctionComponent<IDayViewProps & IDayViewRouter> = ({router, data}) => {
  const { t } = useTranslation();

  if (isEmpty(data)) {
    return <ErrorAlert errorText="Must have data to show anything for the day!" componentName="DayView"/>;
  }

  const openDetailedView = () => router.navigate(RouteNames.SPECIFIC_DAY, { uid: data.uid, data }, {reload: true});

  return (
    <div className="day--separator">
      <Row className="text-center">
        <Col xs={12}>
          <Button block size="sm" onClick={openDetailedView}>{t("Open detailed view")}</Button>
        </Col>
      </Row>

      <Row className="text-center mt-1 mb-2"><Col>{t("Open detailed view")} {t("to edit/view")}</Col></Row>

      <Row>
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
