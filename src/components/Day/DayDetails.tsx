import React, {FunctionComponent} from 'react';
import {IDayModel} from '../../models/IDayModel';
import {Col} from 'reactstrap';
import {getFormattedDate, getTitle} from './DayUtils';
import {useTranslation} from 'react-i18next';

const DayDetails: FunctionComponent<IDayDetailsProps> = ({dayData}) => {
  const { t } = useTranslation();

  return (
    <>
      <Col className="text-lg-right text-center" lg={3} xs={12}>
        <div>{t("Workout location")}: {dayData.location}</div>
        <div>{t("Muscle groups")}: {dayData.muscleGroups}</div>
      </Col>
      <Col className="text-center" lg={6} xs={12}>
        <h2 className="mb-0">{getTitle(dayData.title || null, dayData.startTimestamp)}</h2>
        <div className="day--notes">{dayData.notes}</div>
      </Col>
      <Col className="text-lg-left text-center" lg={3} xs={12}>
        <div>{t("Start time")}: {getFormattedDate(dayData.startTimestamp)}</div>
        <div>{t("End time")}: {dayData.endTimestamp && getFormattedDate(dayData.endTimestamp)}</div>
      </Col>
    </>
  );
};

interface IDayDetailsProps {
  dayData: IDayModel
}

export default DayDetails;