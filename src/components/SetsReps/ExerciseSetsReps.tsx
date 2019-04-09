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
import firebase from '../../config/firebase';
import {FirebaseCollectionNames} from '../../config/FirebaseUtils';
import {isEmpty} from 'lodash';

const ExerciseSetsReps: FunctionComponent<IExerciseSetsRepsProps> = ({exerciseUid, singleDayView}) => {
  const { t } = useTranslation();

  if (isEmpty(exerciseUid)) {
    return <ErrorAlert errorText="Must have the exercises's UID to proceed!" componentName="ExerciseSetsReps"/>;
  }

  const [currentExerciseData, setCurrentExerciseData] = useState<ISetsRepsModel | undefined>(undefined);
  const [snapshotErrorData, setSnapshotErrorData] = useState<string | undefined>(undefined);
  const [addSetViewVisible, setAddSetViewVisible] = useState<boolean>(false);
  const [lastSetData, setLastSetData] = useState<ISetBasicModel | undefined>(undefined);

  // Effect to subscribe on changes on this specific day
  useEffect(() => {
    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    const unsub = firebase.firestore()
      .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
      // .where("ownerUid", "==", uid)
      .doc(exerciseUid)
      .onSnapshot({includeMetadataChanges: true}, doc => {
        if (doc.exists && !isEmpty(doc.data())) {
          const snapshotData: any = doc.data();
          setCurrentExerciseData({
            version: snapshotData.version,
            createdTimestamp: snapshotData.createdTimestamp,
            uid: doc.id,
            ownerUid: snapshotData.ownerUid,
            sets: snapshotData.sets
          });
        }
      }, err => {
        console.error('error:', err);
        setSnapshotErrorData(err.message);
      });

    // Unsubscribe on un-mount
    return () => {
      unsub();
    };
  }, []);

  if (snapshotErrorData) {
    return <ErrorAlert errorText={snapshotErrorData} componentName="ExerciseSetsReps"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="ExerciseSetsReps"/>;
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