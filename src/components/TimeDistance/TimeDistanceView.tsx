import React, {FunctionComponent} from 'react';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {Button, Table} from 'reactstrap';
import {useTranslation} from 'react-i18next';
import {formatSecondsToPrettyPrint} from '../../utils/time-utils';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {RouteNames} from '../../routes';

const TimeDistanceView: FunctionComponent<ITimeDistanceViewRouter & ITimeDistanceViewProps> = ({router, currentExerciseData, setEditVisible}) => {
  const { t } = useTranslation();
  const {name: routeName} = router.getState();
  const detailedDayView = (routeName === RouteNames.SPECIFIC_DAY);

  return (<Table size="sm" className="mb-0">
    <tbody>
    <tr>
      <td>{t("Total time")}</td>
      <td>{formatSecondsToPrettyPrint(currentExerciseData.totalTimeSeconds)}</td>
    </tr>
    <tr>
      <td>{t("Total warm-up")}</td>
      <td>{formatSecondsToPrettyPrint(currentExerciseData.totalWarmupSeconds)}</td>
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