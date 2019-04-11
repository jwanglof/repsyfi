import React, {FunctionComponent} from 'react';
import {ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {Button, Table} from 'reactstrap';
import {useTranslation} from 'react-i18next';

const TimeDistanceCard: FunctionComponent<ITimeDistanceCardProps> = ({currentExerciseData, setEditVisible}) => {
  const { t } = useTranslation();

  return (<Table size="sm" className="mb-0">
    <tbody>
    <tr>
      <td>{t("Total time")}</td>
      <td>{currentExerciseData.totalTimeSeconds}</td>
    </tr>
    <tr>
      <td>{t("Total warm-up")}</td>
      <td>{currentExerciseData.totalWarmupSeconds}</td>
    </tr>

    <tr>
      <td>{t("Total distance")}</td>
      <td>{currentExerciseData.totalDistanceMeter}</td>
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
    <tfoot>
    <tr>
      <td colSpan={2}>
        <Button color="success" block onClick={() => setEditVisible(true)}>Edit</Button>
      </td>
    </tr>
    </tfoot>
  </Table>);
};

interface ITimeDistanceCardProps {
  currentExerciseData: ITimeDistanceModel,
  setEditVisible: ((visible: boolean) => void)
}

export default TimeDistanceCard;