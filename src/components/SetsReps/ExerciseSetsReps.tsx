import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {getSetsRepsExercise} from '../Exercise/ExerciseService';
import {ISetsRepsModel} from '../../models/ISetsRepsModel';
import {Button, CardBody, Table} from 'reactstrap';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {ISetBasicModel} from '../../models/ISetModel';
import OneSetTableRow from './OneSetTableRow';
import AddOneSetTableRow from './AddOneSetTableRow';

const ExerciseSetsReps: FunctionComponent<IExerciseSetsRepsProps> = ({exerciseUid, singleDayView}) => {
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
    return <ErrorAlert errorText={fetchDataError} componentName="TSExerciseSetsReps"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="TSExerciseSetsReps"/>;
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
    <CardBody className="mb-0 p-0">
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
            return <OneSetTableRow key={setUid} setUid={setUid} disabled={addSetViewVisible} setLastSetData={setLastSetData}/>;
          }
          return <OneSetTableRow key={setUid} setUid={setUid} disabled={addSetViewVisible}/>;
        })}
        {addSetViewVisible && <AddOneSetTableRow exerciseUid={currentExerciseData.uid} setAddSetViewVisible={setAddSetViewVisible} initialData={getLastSetData()}/>}
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

interface IExerciseSetsRepsProps {
  exerciseUid: string,
  singleDayView: boolean
}

export default ExerciseSetsReps;