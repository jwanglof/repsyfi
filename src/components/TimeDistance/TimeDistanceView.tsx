import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {Button, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, Table} from 'reactstrap';
import {useTranslation} from 'react-i18next';
import {formatSecondsToPrettyPrint} from '../../utils/time-utils';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {RouteNames} from '../../routes';
import ButtonDropdown from 'reactstrap/lib/ButtonDropdown';
import {ExerciseHeaderEditCtx} from '../Exercise/ExerciseTypeContainer';
import {deleteONLYExercise} from '../Exercise/ExerciseService';
import {removeExerciseFromDayArray} from '../Day/DayService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {deleteTimeDistanceExercise, getTimeDistanceExercise} from './TimeDistanceService';
import LoadingAlert from '../LoadingAlert/LoadingAlert';

const TimeDistanceView: FunctionComponent<ITimeDistanceViewRouter & ITimeDistanceViewProps> = ({router, timeDistanceUid, setEditVisible, exerciseUid}) => {
  const { t } = useTranslation();

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [exerciseDeleteStep2Shown, setExerciseDeleteStep2Shown] = useState<boolean>(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [timeDistanceData, setTimeDistanceDataData] = useState<ITimeDistanceModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);

  const [headerEditVisible, setHeaderEditVisible] = useContext(ExerciseHeaderEditCtx);

  const {name: routeName} = router.getState();
  const detailedDayView = (routeName === RouteNames.SPECIFIC_DAY);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getTimeDistanceExercise(timeDistanceUid);
        setTimeDistanceDataData(res);
      } catch (e) {
        console.error(e);
        setFetchDataError(e.message);
      }
    };

    fetchExerciseData();
  }, []);

  if (fetchDataError) {
    return <ErrorAlert errorText={fetchDataError} componentName="TimeDistanceView"/>;
  }

  if (!timeDistanceData) {
    return <LoadingAlert componentName="TimeDistanceView"/>;
  }

  const delExercise = async () => {
    setSubmitErrorMessage(undefined);

    try {
      const dayUid = router.getState().params.uid;
      await deleteTimeDistanceExercise(timeDistanceUid);
      await deleteONLYExercise(exerciseUid);
      await removeExerciseFromDayArray(exerciseUid, dayUid);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }
  };

  const toggleActionDropdown = () => {
    setExerciseDeleteStep2Shown(false);
    setDropdownVisible(!dropdownVisible)
  };

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
    {detailedDayView && <tfoot>
    {submitErrorMessage && <tr><td colSpan={2}><ErrorAlert errorText={submitErrorMessage}/></td></tr>}
    <tr>
      <td colSpan={2}>
        <ButtonGroup className="w-100">
          <Button color="success" onClick={() => setEditVisible(true)}>{t("Edit")}</Button>
          <ButtonDropdown isOpen={dropdownVisible} toggle={toggleActionDropdown}>
            <DropdownToggle caret>
              {t("Actions")}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => setHeaderEditVisible(true)} disabled={headerEditVisible}>
                {`${t("Edit")} ${t("name")}`}
              </DropdownItem>
              <DropdownItem toggle={false}>
                {!exerciseDeleteStep2Shown && <span onClick={() => setExerciseDeleteStep2Shown(true)}>{t("Delete")} {t("exercise")}</span>}
                {exerciseDeleteStep2Shown && <span className="text-danger" onClick={delExercise}>{t("Click again to delete!")}</span>}
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
      </td>
    </tr>
    </tfoot>}
  </Table>);
};

interface ITimeDistanceViewProps {
  timeDistanceUid: string,
  setEditVisible: ((visible: boolean) => void),
  exerciseUid: string
}

interface ITimeDistanceViewRouter {
  router: Router
}

export default withRouter(TimeDistanceView);