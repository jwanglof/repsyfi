import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Router} from 'router5';
import {useTranslation} from 'react-i18next';
import {RouteNames} from '../../routes';
import {ISetsModel} from '../../models/ISetsModel';
import {isEmpty, remove} from 'lodash';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {ISetBasicModel} from '../../models/ISetModel';
import {Button, ButtonDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, Table} from 'reactstrap';
import {SetTypesEnum} from '../../enums/SetTypesEnum';
import SetsTableRowView from './SetsTableRowView';
import SetsTableRowFormRender from './SetsTableRowFormRender';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {withRouter} from 'react-router5';
import {getLastSetData} from './SetsHelpers';
import {getDay, getDayDocument} from '../Day/DayService';
import {recalculateIndexes} from '../../utils/exercise-utils';
import firebase from '../../config/firebase';
import {getSetsSecondDocument, getSetsSecondsExerciseDocument} from './SetsSeconds/SetsSecondsService';
import {getSetDocument, getSetsRepsExerciseDocument} from './SetsReps/SetsRepsService';
import {getExerciseDocument} from '../Exercise/ExerciseService';
import {FirebaseCollectionNames} from '../../config/FirebaseUtils';
import fromUnixTime from 'date-fns/fromUnixTime';
import isWithinInterval from 'date-fns/isWithinInterval';
import subSeconds from 'date-fns/subSeconds';
import addSeconds from 'date-fns/addSeconds';
import {ExerciseHeaderEditCtx} from '../Exercise/ExerciseTypeContainer';

const SetsExerciseContainer: FunctionComponent<ISetsExerciseContainerRouter & ISetsExerciseContainerProps> = ({router, setsExerciseUid, exerciseUid,  exerciseType}) => {
  const { t } = useTranslation();

  const {name: routeName} = router.getState();
  const detailedDayView: boolean = (routeName === RouteNames.SPECIFIC_DAY);

  let type: SetTypesEnum = SetTypesEnum.SET_TYPE_REPS;
  let collectionName: FirebaseCollectionNames = FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS;
  if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
    type = SetTypesEnum.SET_TYPE_SECONDS;
    collectionName = FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS;
  }

  const [currentExerciseData, setCurrentExerciseData] = useState<ISetsModel | undefined>(undefined);
  const [snapshotErrorData, setSnapshotErrorData] = useState<string | undefined>(undefined);
  const [addSetViewVisible, setAddSetViewVisible] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [exerciseDeleteStep2Shown, setExerciseDeleteStep2Shown] = useState<boolean>(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [lastSetData, setLastSetData] = useState<ISetBasicModel | undefined>(undefined);
  const [headerEditVisible, setHeaderEditVisible] = useContext(ExerciseHeaderEditCtx);

  useEffect(() => {
    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    const unsub = firebase.firestore()
      .collection(collectionName)
      // .where("ownerUid", "==", uid)
      .doc(setsExerciseUid)
      .onSnapshot({includeMetadataChanges: true}, doc => {
        if (doc.exists && !isEmpty(doc.data())) {
          const snapshotData: any = doc.data();
          // Open a new set if this exercise is not older than 10 seconds, and the sets-array is empty
          const createdDate = fromUnixTime(snapshotData.createdTimestamp);
          const nowDate = new Date();
          const isNewExercise = isWithinInterval(createdDate, {start: subSeconds(nowDate, 10), end: addSeconds(nowDate, 10)});
          if (isNewExercise && !snapshotData.sets.length) {
            setAddSetViewVisible(true);
          }

          const d: ISetsModel = {
            version: snapshotData.version,
            createdTimestamp: snapshotData.createdTimestamp,
            uid: doc.id,
            ownerUid: snapshotData.ownerUid,
            sets: snapshotData.sets
          };

          setCurrentExerciseData(d);
        }
      }, err => {
        console.error('error:', err);
        setSnapshotErrorData(err.message);
      });

    // Unsubscribe on un-mount
    return () => {
      unsub();
    };
  }, [setsExerciseUid]);

  if (isEmpty(setsExerciseUid)) {
    return <ErrorAlert errorText="Must have the exercises's UID to proceed!" componentName="SetsExerciseContainer"/>;
  }

  if (snapshotErrorData || submitErrorMessage) {
    return <ErrorAlert errorText={snapshotErrorData || submitErrorMessage} componentName="SetsExerciseContainer"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="SetsExerciseContainer"/>;
  }

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
      const recalculatedExercises: any = recalculateIndexes(removedExerciseIndex, exercises);

      // More: https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
      const batch = firebase.firestore().batch();
      if (type === SetTypesEnum.SET_TYPE_SECONDS) {
        currentExerciseData.sets.forEach((setUid: string) => batch.delete(getSetsSecondDocument(setUid)));
        batch.delete(getSetsSecondsExerciseDocument(setsExerciseUid));
      } else if (type === SetTypesEnum.SET_TYPE_REPS) {
        currentExerciseData.sets.forEach((setUid: string) => batch.delete(getSetDocument(setUid)));
        batch.delete(getSetsRepsExerciseDocument(setsExerciseUid));
      }
      batch.delete(getExerciseDocument(exerciseUid));
      batch.update(getDayDocument(dayUid), {exercises: recalculatedExercises});
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
        {type === SetTypesEnum.SET_TYPE_SECONDS && <th style={{width: "45%"}}>{t("Seconds")}</th>}
        {type === SetTypesEnum.SET_TYPE_REPS && <th style={{width: "45%"}}>{t("Repetitions")}</th>}
      </tr>
      </thead>

      <tbody>

      {currentExerciseData.sets.map((setUid, i) => {
        if ((i + 1 ) === currentExerciseData.sets.length) {
          // Pass the setter for the last set to the last set
          return <SetsTableRowView key={setUid} setUid={setUid} disabled={addSetViewVisible} setLastSetData={setLastSetData} setTypeShown={type}/>;
        }
        return <SetsTableRowView key={setUid} setUid={setUid} disabled={addSetViewVisible} setTypeShown={type}/>;
      })}

      {addSetViewVisible && <SetsTableRowFormRender initialData={getLastSetData(lastSetData, type)} setAddSetViewVisible={setAddSetViewVisible} setTypeShown={type} exerciseUid={currentExerciseData.uid}/>}

      </tbody>

      <tfoot>
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
      </tfoot>

    </Table>
  );
};

interface ISetsExerciseContainerProps {
  setsExerciseUid: string
  exerciseUid: string
  exerciseType: ExerciseTypesEnum
}

interface ISetsExerciseContainerRouter {
  router: Router
}

export default withRouter(SetsExerciseContainer);
