import React, {FunctionComponent} from 'react';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {Button, Table} from 'reactstrap';
import {useTranslation} from 'react-i18next';
import {getHourMinuteSecondsFromSeconds} from '../shared/time-utils';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {routeNameSpecificDay} from '../../routes';

const TimeDistanceView: FunctionComponent<ITimeDistanceViewRouter & ITimeDistanceViewProps> = ({router, currentExerciseData, setEditVisible}) => {
  const { t } = useTranslation();
  const {name: routeName} = router.getState();
  const detailedDayView = (routeName === routeNameSpecificDay);

  const formatSecondsToTime = (seconds: number): string => {
    let t = getHourMinuteSecondsFromSeconds(seconds);
    let hh: number | string = t.hours;
    let mm: number | string = t.minutes;
    let ss: number | string = t.seconds;
    if (hh < 10) hh = "0"+hh;
    if (mm < 10) mm = "0"+mm;
    if (ss < 10) ss = "0"+ss;
    return `${hh}:${mm}:${ss}`;
  };

  return (<Table size="sm" className="mb-0">
    <tbody>
    <tr>
      <td>{t("Total time")}</td>
      <td>{formatSecondsToTime(currentExerciseData.totalTimeSeconds)}</td>
    </tr>
    <tr>
      <td>{t("Total warm-up")}</td>
      <td>{formatSecondsToTime(currentExerciseData.totalWarmupSeconds)}</td>
    </tr>

    <tr>
      <td>{t("Total distance")}</td>
      <td>{currentExerciseData.totalDistanceMeter}m</td>
    </tr>
    <tr>
      <td>{t("Total kcal")}</td>
      <td>{currentExerciseData.totalKcal}</td>
    </tr>

    <tr>
      <td>{t("Speed min")}</td>
      <td>{currentExerciseData.speedMin}</td>
    </tr>
    <tr>
      <td>{t("Speed max")}</td>
      <td>{currentExerciseData.speedMax}</td>
    </tr>

    <tr>
      <td>{t("Incline min")}</td>
      <td>{currentExerciseData.inclineMin}</td>
    </tr>
    <tr>
      <td>{t("Incline max")}</td>
      <td>{currentExerciseData.inclineMax}</td>
    </tr>
    </tbody>
    {detailedDayView && <tfoot>
    <tr>
      <td colSpan={2}>
        <Button color="success" block onClick={() => setEditVisible(true)}>{t("Edit")}</Button>
      </td>
    </tr>
    </tfoot>}
  </Table>);
};

interface ITimeDistanceViewProps {
  currentExerciseData: ITimeDistanceModel,
  setEditVisible: ((visible: boolean) => void)
}

interface ITimeDistanceViewRouter {
  router: Router
}

export default withRouter(TimeDistanceView);