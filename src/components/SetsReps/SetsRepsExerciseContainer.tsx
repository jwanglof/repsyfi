import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ISetsRepsModel} from '../../models/ISetsRepsModel';
import {Button, ButtonDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, Table} from 'reactstrap';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {ISetBasicModel} from '../../models/ISetModel';
import SetsRepsTableRowView from './SetsRepsTableRowView';
import SetsRepsTableRowForm from './SetsRepsTableRowForm';
import firebase from '../../config/firebase';
import {FirebaseCollectionNames} from '../../config/FirebaseUtils';
import {isEmpty, remove} from 'lodash';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {RouteNames} from '../../routes';

import {ExerciseHeaderEditCtx} from '../Exercise/ExerciseTypeContainer';
import {getExerciseDocument} from '../Exercise/ExerciseService';
import {getDay, getDayDocument} from '../Day/DayService';
import {getSetsRepsDocument} from './SetsRepsService';

const SetsRepsExerciseContainer: FunctionComponent<ISetsRepsExerciseContainerRouter & ISetsRepsExerciseContainerProps> = ({router, setsRepsExerciseUid, exerciseUid}) => {
  const { t } = useTranslation();

  const {name: routeName} = router.getState();
  const detailedDayView: boolean = (routeName === RouteNames.SPECIFIC_DAY);

  if (isEmpty(setsRepsExerciseUid)) {
    return <ErrorAlert errorText="Must have the exercises's UID to proceed!" componentName="SetsRepsExerciseContainer"/>;
  }

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [exerciseDeleteStep2Shown, setExerciseDeleteStep2Shown] = useState<boolean>(false);
  const [currentExerciseData, setCurrentExerciseData] = useState<ISetsRepsModel | undefined>(undefined);
  const [snapshotErrorData, setSnapshotErrorData] = useState<string | undefined>(undefined);
  const [addSetViewVisible, setAddSetViewVisible] = useState<boolean>(false);
  const [lastSetData, setLastSetData] = useState<ISetBasicModel | undefined>(undefined);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  const [headerEditVisible, setHeaderEditVisible] = useContext(ExerciseHeaderEditCtx);

  // Effect to subscribe on changes on this specific day
  useEffect(() => {
    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    const unsub = firebase.firestore()
      .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
      // .where("ownerUid", "==", uid)
      .doc(setsRepsExerciseUid)
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

  if (snapshotErrorData || submitErrorMessage) {
    return <ErrorAlert errorText={snapshotErrorData || submitErrorMessage} componentName="SetsRepsExerciseContainer"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="SetsRepsExerciseContainer"/>;
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

  const toggleActionDropdown = () => {
    setExerciseDeleteStep2Shown(false);
    setDropdownVisible(!dropdownVisible)
  };

  const delExercise = async () => {
    setSubmitErrorMessage(undefined);

    try {
      const dayUid = router.getState().params.uid;
      const day = await getDay(dayUid);

      // Recalculate the indexes of the remaining exercises
      // Need this so they keep the order, and when adding a new exercise that an index isn't duplicated
      const exercises = day.exercises;
      const removedExercise = remove(exercises, e => e.exerciseUid === exerciseUid);
      const removedExerciseIndex = removedExercise[0].index;
      for (let i = removedExerciseIndex, len = exercises.length; i < len; i++) {
        exercises[i].index = exercises[i].index - 1;
      }

      // More: https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
      const batch = firebase.firestore().batch();
      batch.delete(getSetsRepsDocument(setsRepsExerciseUid));
      batch.delete(getExerciseDocument(exerciseUid));
      batch.update(getDayDocument(dayUid), {exercises});
      await batch.commit();
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }
  };

  return (
    <Table striped hover={detailedDayView && !addSetViewVisible} size="sm" className="mb-0">
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
          return <SetsRepsTableRowView key={setUid} setUid={setUid} disabled={addSetViewVisible} setLastSetData={setLastSetData}/>;
        }
        return <SetsRepsTableRowView key={setUid} setUid={setUid} disabled={addSetViewVisible}/>;
      })}

      {addSetViewVisible && <SetsRepsTableRowForm exerciseUid={currentExerciseData.uid} setAddSetViewVisible={setAddSetViewVisible} initialData={getLastSetData()}/>}

      </tbody>

      {detailedDayView && !addSetViewVisible && <tfoot>
      <tr>
        <td colSpan={3}>
          <ButtonGroup className="w-100">
            <Button color="success" block onClick={() => setAddSetViewVisible(!addSetViewVisible)}>{t("Add set")}</Button>
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
      <tr>
        <td className="text-muted text-center font-italic" colSpan={3}><small>{t("Click on a set for different actions")}</small></td>
      </tr>
      </tfoot>}

    </Table>
  );
};

interface ISetsRepsExerciseContainerProps {
  setsRepsExerciseUid: string
  exerciseUid: string,
}

interface ISetsRepsExerciseContainerRouter {
  router: Router
}

export default withRouter(SetsRepsExerciseContainer);