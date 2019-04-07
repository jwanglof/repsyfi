import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {getSetsRepsExercise} from '../TSExerciseService';
import {ISetsRepsModel} from '../../../models/ISetsRepsModel';
import {Button, CardBody, Table} from 'reactstrap';
import TSErrorAlert from '../../ErrorAlert/TSErrorAlert';
import TSLoadingAlert from '../../LoadingAlert/TSLoadingAlert';
import {ISetBasicModel} from '../../../models/ISetModel';
import TSOneSetTableRow from '../../Set/TSOneSetTableRow';

const TSExerciseSetsReps: FunctionComponent<TSExerciseSetsRepsProps> = ({exerciseUid, singleDayView}) => {
  const { t } = useTranslation();

  const [currentExerciseData, setCurrentExerciseData] = useState<ISetsRepsModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);
  const [addSetViewVisible, setAddSetViewVisible] = useState<boolean>(false);
  const [lastSetData, setLastSetData] = useState<ISetBasicModel | undefined>(undefined);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getSetsRepsExercise(exerciseUid);
        setCurrentExerciseData(res);
      } catch (e) {
        setFetchDataError(e.message);
        console.error(e);
      }
    };

    fetchExerciseData();
  }, []);

  if (fetchDataError) {
    return <TSErrorAlert errorText={fetchDataError} componentName="TSExerciseSetsReps"/>;
  }

  if (!currentExerciseData) {
    return <TSLoadingAlert componentName="TSExerciseSetsReps"/>;
  }

  // Return the last set's data so that it can be pre-filled to the new set
  const getLastSetData = (): ISetBasicModel => {
    if (!lastSetData) {
      return {
        index: 1,
        amountInKg: 0,
        reps: 0
      }
    }
    return {
      index: (lastSetData.index + 1),
      amountInKg: lastSetData.amountInKg,
      reps: lastSetData.reps
    };
  };

  return (
    <CardBody className="mb-0">
      <Table striped hover={singleDayView && !addSetViewVisible} size="sm" className="mb-0">
        <thead>
        <tr>
          <th style={{width: "10%"}}>#</th>
          <th style={{width: "45%"}}>{t("Amount in KG")}</th>
          <th style={{width: "45%"}}>{t("Repetitions")}</th>
        </tr>
        </thead>
        <tbody>
        {currentExerciseData.sets.map((setUid, i) => {
          if ((i + 1 ) === currentExerciseData.sets.length) {
            // Pass the setter for the last set to the last set
            return <TSOneSetTableRow key={setUid} setUid={setUid} disabled={addSetViewVisible} setLastSetData={setLastSetData}/>;
          }
          return <TSOneSetTableRow key={setUid} setUid={setUid} disabled={addSetViewVisible}/>;
        })}
        {/*{addSetViewVisible && <AddOneSetTableRow exerciseUid={currentExerciseData.uid} setAddSetViewVisible={setAddSetViewVisible} initialData={getLastSetData()} setLastSetUid={setLastSetUid}/>}*/}
        </tbody>
        <tfoot>
        {singleDayView && !addSetViewVisible && <tr>
          <td colSpan={3}>
            <Button color="success" block onClick={() => setAddSetViewVisible(!addSetViewVisible)}>{t("Add set")}</Button>
          </td>
        </tr>}
        </tfoot>
      </Table>
    </CardBody>
  );
};

interface TSExerciseSetsRepsProps {
  exerciseUid: string,
  singleDayView: boolean
}

export default TSExerciseSetsReps;