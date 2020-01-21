import React, {FunctionComponent} from 'react';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {Table} from 'reactstrap';
import {useTranslation} from 'react-i18next';
import {formatSecondsToPrettyPrint} from '../../utils/time-utils';

const TimeDistanceView: FunctionComponent<ITimeDistanceViewProps> = ({timeDistanceData}) => {
  const { t } = useTranslation();

  return (<Table size="sm" className="mb-0">
    <tbody>
    <tr>
      <td>{t("Exercise time")}</td>
      <td>{formatSecondsToPrettyPrint(timeDistanceData.totalTimeSeconds)}</td>
    </tr>
    <tr>
      <td>{t("Warm-up time")}</td>
      <td>{formatSecondsToPrettyPrint(timeDistanceData.totalWarmupSeconds)}</td>
    </tr>

    <tr>
      <td>{t("Distance (meters)")}</td>
      <td>{timeDistanceData.totalDistanceMeter}m</td>
    </tr>
    <tr>
      <td>{t("Kcal")}</td>
      <td>{timeDistanceData.totalKcal}</td>
    </tr>

    <tr>
      <td>{t("Speed min")}</td>
      <td>{timeDistanceData.speedMin}</td>
    </tr>
    <tr>
      <td>{t("Speed max")}</td>
      <td>{timeDistanceData.speedMax}</td>
    </tr>

    <tr>
      <td>{t("Incline min")}</td>
      <td>{timeDistanceData.inclineMin}</td>
    </tr>
    <tr>
      <td>{t("Incline max")}</td>
      <td>{timeDistanceData.inclineMax}</td>
    </tr>
    </tbody>
  </Table>);
};

interface ITimeDistanceViewProps {
  timeDistanceData: ITimeDistanceModel
}

export default TimeDistanceView;