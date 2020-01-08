import React, {createContext, FunctionComponent, useContext, useEffect, useState} from 'react';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {useTranslation} from 'react-i18next';
import {getSetDocument, getSetsRepsExerciseDocument, getSetsRepsExerciseOnSnapshot} from './SetsReps/SetsRepsService';
import {ISetsModel} from '../../models/ISetsModel';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {Button, ButtonDropdown, ButtonGroup, Col, DropdownItem, DropdownMenu, DropdownToggle, Row} from 'reactstrap';
import {ExerciseHeaderEditCtx} from '../Exercise/ExerciseTypeContainer';
import {getDay, getDayDocument} from '../Day/DayService';
import {remove} from 'lodash';
import {recalculateIndexes} from '../../utils/exercise-utils';
import firebase from '../../config/firebase';
import {
  getSetSecondDocument,
  getSetsSecondsExerciseDocument,
  getSetsSecondsExerciseOnSnapshot
} from './SetsSeconds/SetsSecondsService';
import {getExerciseDocument} from '../Exercise/ExerciseService';
import {ISetModel} from '../../models/ISetModel';
import SetViewContainer from './SetViewContainer';
import {getLastSetData} from './SetsHelpers';
import SetAddForm from './SetAddForm';
import {IErrorObject, retrieveErrorMessage} from '../../config/FirebaseUtils';

export const SetsExerciseViewShowButtonCtx = createContext<any>(() => {});

const SetsExerciseView: FunctionComponent<ISetsViewRouter & ISetsViewProps> = ({router, setsExerciseUid, exerciseUid,  exerciseType}) => {
  const { t } = useTranslation();

  const [headerEditVisible, setHeaderEditVisible] = useContext(ExerciseHeaderEditCtx);

  const [currentExerciseData, setCurrentExerciseData] = useState<ISetsModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [exerciseDeleteStep2Shown, setExerciseDeleteStep2Shown] = useState<boolean>(false);
  const [addSetViewVisible, setAddSetViewVisible] = useState<boolean>(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [lastSetData, setLastSetData] = useState<ISetModel | undefined>(undefined);
  const [buttonsIsShown, setButtonsIsShown] = useState<boolean>(true);

  useEffect(() => {
    const cbErr = (e: IErrorObject) => {
      setFetchDataError(retrieveErrorMessage(e));
    };

    let unsubFn: any;

    if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
      unsubFn = getSetsSecondsExerciseOnSnapshot(setsExerciseUid, setCurrentExerciseData, cbErr);
    } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
      unsubFn = getSetsRepsExerciseOnSnapshot(setsExerciseUid, setCurrentExerciseData, cbErr);
    } else {
      setFetchDataError("Invalid exercise type");
    }

    return () => {
      unsubFn();
    };
  }, [setsExerciseUid, exerciseType]);

  if (fetchDataError || submitErrorMessage) {
    return <ErrorAlert errorText={fetchDataError || submitErrorMessage} componentName="SetsExerciseView"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="SetsExerciseView"/>;
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
      if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
        currentExerciseData.sets.forEach((setUid: string) => batch.delete(getSetSecondDocument(setUid)));
        batch.delete(getSetsSecondsExerciseDocument(setsExerciseUid));
      } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
        currentExerciseData.sets.forEach((setUid: string) => batch.delete(getSetDocument(setUid)));
        batch.delete(getSetsRepsExerciseDocument(setsExerciseUid));
      }
      batch.delete(getExerciseDocument(exerciseUid));
      batch.update(getDayDocument(dayUid), {exercises: recalculatedExercises});
      await batch.commit();
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(retrieveErrorMessage(e));
    }
  };

  const toggleActionDropdown = () => {
    setExerciseDeleteStep2Shown(false);
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <SetsExerciseViewShowButtonCtx.Provider value={setButtonsIsShown}>
      <Col>
        <Row className="set__head">
          <Col xs={2}>#</Col>
          <Col xs={5}>{t("Amount in KG")}</Col>
          {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS && <Col xs={5}>{t("Seconds")}</Col>}
          {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS && <Col xs={5}>{t("Repetitions")}</Col>}
        </Row>
        <div className="legend">
          {currentExerciseData.sets.map((setUid, i) => {
            const isLastSet = i === currentExerciseData.sets.length - 1;
            return <SetViewContainer key={i} setUid={setUid} disabled={addSetViewVisible} exerciseType={exerciseType} isLastSet={isLastSet} setLastSetData={setLastSetData} exerciseData={currentExerciseData}/>
          })}
        </div>

        {addSetViewVisible && <SetAddForm currentData={getLastSetData(lastSetData, exerciseType)} setAddSetViewVisible={setAddSetViewVisible} exerciseType={exerciseType} setsExerciseUid={setsExerciseUid}/>}

        {buttonsIsShown && <Row>
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
        </Row>}
      </Col>
    </SetsExerciseViewShowButtonCtx.Provider>
  );
};

interface ISetsViewProps {
  setsExerciseUid: string
  exerciseUid: string
  exerciseType: ExerciseTypesEnum
}

interface ISetsViewRouter {
  router: Router
}

export default withRouter(SetsExerciseView);
