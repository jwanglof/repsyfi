import React, {FunctionComponent, useState} from 'react';
import {Table} from 'reactstrap';
import SetsTableRowView from './SetsTableRowView';
import {SetTypesEnum} from '../../enums/SetTypesEnum';
import ExerciseContainerFooter from './ExerciseContainerFooter';
import * as i18next from 'i18next';
import {ISetsSecondsModel} from '../../models/ISetsSecondsModel';
import {ISetBasicModel} from '../../models/ISetModel';
import {getDay, getDayDocument} from '../Day/DayService';
import {recalculateIndexes} from '../../utils/exercise-utils';
import firebase from '../../config/firebase';
import {getSetsSecondDocument, getSetsSecondsExerciseDocument} from './SetsSeconds/SetsSecondsService';
import {getExerciseDocument} from '../Exercise/ExerciseService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {Router} from 'router5';
import {remove} from 'lodash';
import {getSetDocument, getSetsRepsExerciseDocument} from './SetsReps/SetsRepsService';
import SetsTableRowFormRender from './SetsTableRowFormRender';

const SetsExerciseContainerRender: FunctionComponent<ISetsExerciseContainerRender> = ({router, detailedDayView, addSetViewVisible, t, currentExerciseData, setLastSetData, setAddSetViewVisible, getLastSetData, exerciseUid, setsSecondsExerciseUid="", setsRepsExerciseUid="", type}) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [exerciseDeleteStep2Shown, setExerciseDeleteStep2Shown] = useState<boolean>(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <ErrorAlert errorText={submitErrorMessage} componentName="SetsExerciseContainerRender"/>;
  }

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
        batch.delete(getSetsSecondsExerciseDocument(setsSecondsExerciseUid));
      } else if (type === SetTypesEnum.SET_TYPE_REPS) {
        currentExerciseData.sets.forEach((setUid: string) => batch.delete(getSetDocument(setUid)));
        batch.delete(getSetsRepsExerciseDocument(setsRepsExerciseUid));
      }
      batch.delete(getExerciseDocument(exerciseUid));
      batch.update(getDayDocument(dayUid), {exercises: recalculatedExercises});
      await batch.commit();
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }
  };

  const toggleActionDropdown = () => {
    setExerciseDeleteStep2Shown(false);
    setDropdownVisible(!dropdownVisible)
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

      {addSetViewVisible && <SetsTableRowFormRender initialData={getLastSetData()} setAddSetViewVisible={setAddSetViewVisible} t={t} setTypeShown={type} exerciseUid={currentExerciseData.uid}/>}

      </tbody>

      <ExerciseContainerFooter detailedDayView={detailedDayView} addSetViewVisible={addSetViewVisible} dropdownVisible={dropdownVisible} toggleActionDropdown={toggleActionDropdown} setAddSetViewVisible={setAddSetViewVisible} t={t} exerciseDeleteStep2Shown={exerciseDeleteStep2Shown} setExerciseDeleteStep2Shown={setExerciseDeleteStep2Shown} delExercise={delExercise}/>

    </Table>
  );
};

interface ISetsExerciseContainerRender {
  router: Router,
  detailedDayView: boolean,
  addSetViewVisible: boolean,
  t: i18next.TFunction,
  currentExerciseData: ISetsSecondsModel,
  setLastSetData: ((lastSetData: ISetBasicModel) => void),
  setAddSetViewVisible: ((value: boolean) => void),
  getLastSetData: (() => ISetBasicModel),
  exerciseUid: string,
  setsSecondsExerciseUid?: string,
  setsRepsExerciseUid?: string,
  type: SetTypesEnum
}

// TODO withRouter?
export default SetsExerciseContainerRender;
// export default withRouter(SetsExerciseContainerRender);