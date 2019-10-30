import './Day.scss';

import React, {FunctionComponent} from 'react';
import {useTranslation} from 'react-i18next';
import {withRoute} from 'react-router5';
import {Router} from 'router5';
import isEmpty from 'lodash/isEmpty';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {IDayModel} from '../../models/IDayModel';
import {Button, Col, Row} from 'reactstrap';
import {RouteNames} from '../../routes';
import DayDetails from './DayDetails';

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
        <DayDetails dayData={data}/>
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
