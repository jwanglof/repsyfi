import React, {FunctionComponent, useEffect, useState} from 'react';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {Table} from 'reactstrap';
import {useTranslation} from 'react-i18next';
import {formatSecondsToPrettyPrint} from '../../utils/time-utils';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {RouteNames} from '../../routes';
import {getExerciseDocument} from '../Exercise/ExerciseService';
import {getDay, getDayDocument} from '../Day/DayService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {getTimeDistanceDocument, getTimeDistanceExercise} from './TimeDistanceService';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import firebase from '../../config/firebase';
import {remove} from 'lodash';
import {recalculateIndexes} from '../../utils/exercise-utils';
import {retrieveErrorMessage} from '../../config/FirebaseUtils';

const TimeDistanceView: FunctionComponent<ITimeDistanceViewRouter & ITimeDistanceViewProps> = ({router, timeDistanceUid, exerciseUid}) => {
  const { t } = useTranslation();

  // const setEditVisible = useContext(ExerciseContainerAsdCtx)[1];

  // const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  // const [exerciseDeleteStep2Shown, setExerciseDeleteStep2Shown] = useState<boolean>(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [timeDistanceData, setTimeDistanceDataData] = useState<ITimeDistanceModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);

  // const [headerEditVisible, setHeaderEditVisible] = useContext(ExerciseHeaderEditCtx);

  const {name: routeName} = router.getState();
  const detailedDayView = (routeName === RouteNames.SPECIFIC_DAY);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getTimeDistanceExercise(timeDistanceUid);
        setTimeDistanceDataData(res);
      } catch (e) {
        console.error(e);
        setFetchDataError(retrieveErrorMessage(e));
      }
    };

    fetchExerciseData();
  }, [timeDistanceUid]);

  if (fetchDataError) {
    return <ErrorAlert errorText={fetchDataError} componentName="TimeDistanceView"/>;
  }

  if (!timeDistanceData) {
    return <LoadingAlert componentName="TimeDistanceView"/>;
  }

  // const toggleActionDropdown = () => {
  //   setExerciseDeleteStep2Shown(false);
  //   setDropdownVisible(!dropdownVisible)
  // };

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
    {/*<tr>
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
    </tr>*/}
    </tfoot>}
  </Table>);
};

interface ITimeDistanceViewProps {
  timeDistanceUid: string,
  // setEditVisible: ((visible: boolean) => void),
  exerciseUid: string
}

interface ITimeDistanceViewRouter {
  router: Router
}

export default withRouter(TimeDistanceView);