import './Exercise.scss';

import React, {createContext, FunctionComponent, useEffect, useState} from 'react';
import {deleteExerciseAndRelatedData, getExercise} from './ExerciseService';
import {IExerciseModel} from '../../models/IExerciseModel';
import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row
} from 'reactstrap';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import TimeDistanceExerciseContainer from '../TimeDistance/TimeDistanceExerciseContainer';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {useTranslation} from 'react-i18next';
import SetsView from '../Sets/SetsExerciseView';
import {IErrorObject, retrieveErrorMessage} from '../../config/FirebaseUtils';
import {getDay, getDayDocument} from '../Day/DayService';
import {recalculateIndexes} from '../../utils/exercise-utils';
import {withRouter} from 'react-router5';
import {Router} from 'router5';
import {getSuperSetData, getSuperSetOnSnapshot} from '../../services/ExercisesSuperSetService';
import firebase from '../../config/firebase';
import {useGlobalState} from '../../state';
import ExerciseHeaderContainer from './ExerciseHeader/ExerciseHeaderContainer';
import {EXERCISE_HEADER_TYPES} from './ExerciseHeader/ExerciseHeaderHelpers';
import {IExercisesSuperSetsModel} from '../../models/IExercisesSuperSetsModel';

export const ExerciseHeaderEditCtx = createContext<any>([EXERCISE_HEADER_TYPES, () => {}]);
export const ExerciseContainerAddSetViewVisibleCtx = createContext<any>([false, () => {}]);
export const ExerciseContainerEditSetViewVisibleCtx = createContext<any>([false, () => {}]);

const ExerciseTypeContainer: FunctionComponent<IExerciseTypeContainerRouter & IExerciseTypeContainerProps> = ({ router, exerciseUid }) => {
  const { t } = useTranslation();
  const dayUid = router.getState().params.uid;

  const showDebugInformation = useGlobalState('debugInformationShown')[0];

  const [currentExerciseData, setCurrentExerciseData] = useState<IExerciseModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);
  const [headerEditType, setHeaderEditType] = useState<EXERCISE_HEADER_TYPES>(EXERCISE_HEADER_TYPES.SHOW_EXERCISE_NAME);
  const [addSetViewVisible, setAddSetViewVisible] = useState<boolean>(false);
  const [editSetViewVisible, setEditSetViewVisible] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [exerciseDeleteStep2Shown, setExerciseDeleteStep2Shown] = useState<boolean>(false);
  const [options, setOptions] = useState<any>({});
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [superSetData, setSuperSetData] = useState<IExercisesSuperSetsModel | undefined>(undefined);
  const [initialSuperSetData, setInitialSuperSetData] = useState<IExercisesSuperSetsModel | null>(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getExercise(exerciseUid);
        setCurrentExerciseData(res);

        const superSetData = await getSuperSetData(exerciseUid, dayUid);
        if (superSetData !== null) {
          setInitialSuperSetData(superSetData);
        }
      } catch (e) {
        console.error(e);
        setFetchDataError(retrieveErrorMessage(e));
      }
    };

    // noinspection JSIgnoredPromiseFromCall
    fetchExerciseData();
  }, [exerciseUid, dayUid]);

  useEffect(() => {
    if (initialSuperSetData !== null) {
      const unsubFn = initializeSuperSetData(initialSuperSetData);
      return () => {
        unsubFn();
      };
    }
  }, [initialSuperSetData]);

  useEffect(() => {
    if (currentExerciseData) {
      if (currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS || currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
        const texts = {
          actionButtonText: t("Add set"),
          showFooterInfo: true
        };
        setOptions(texts);
      } else if (currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE) {
        const texts = {
          actionButtonText: t("Edit"),
          showFooterInfo: false
        };
        setOptions(texts);
      }
    }
  }, [currentExerciseData, t]);

  if (fetchDataError != null || submitErrorMessage) {
    return <ErrorAlert errorText={fetchDataError || submitErrorMessage} componentName="ExerciseTypeContainer"/>;
  }

  if (!currentExerciseData) {
    return <LoadingAlert componentName="ExerciseTypeContainer"/>;
  }

  const initializeSuperSetData = (superSetsModelData: IExercisesSuperSetsModel) => {
    // Note that if this method is called from a component,
    //  the Firestore subscription _will not_ be cancelled on unmount!
    const cbErr = (e: IErrorObject) => {
      setFetchDataError(retrieveErrorMessage(e));
    };

    const cb = (data: any) => {
      if (data.exercises.includes(exerciseUid)) {
        setSuperSetData(data);
      } else {
        setSuperSetData(undefined);
      }
    };

    return getSuperSetOnSnapshot(superSetsModelData.uid, cb, cbErr);
  };

  const toggleActionDropdown = () => {
    setExerciseDeleteStep2Shown(false);
    setDropdownVisible(!dropdownVisible);
  };

  const delExercise = async () => {
    setSubmitErrorMessage(undefined);

    try {
      const day = await getDay(dayUid);

      // Recalculate the indexes of the remaining exercises
      // Need this so they keep the order, and when adding a new exercise that an index isn't duplicated
      const exercises = day.exercises;
      const removedExercise = exercises.find(e => e.exerciseUid === exerciseUid);
      if (!removedExercise) {
        setSubmitErrorMessage("Exercise not found in day's exercises!");
        return;
      }
      const exercisesWithoutRemoved = exercises.filter(e => e.exerciseUid !== exerciseUid);
      const recalculatedExercises: Array<any> = recalculateIndexes(removedExercise.index, exercisesWithoutRemoved);

      // More: https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
      let batch = firebase.firestore().batch();
      batch = await deleteExerciseAndRelatedData(currentExerciseData, dayUid, batch);
      await batch
        .update(getDayDocument(dayUid), {exercises: recalculatedExercises})
        .commit();
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(retrieveErrorMessage(e));
    }
  };

  const showFooterButtons = !addSetViewVisible && !editSetViewVisible && !headerEditType;

  return (
    <ExerciseHeaderEditCtx.Provider value={[headerEditType, setHeaderEditType]}>
      <ExerciseContainerAddSetViewVisibleCtx.Provider value={[addSetViewVisible, setAddSetViewVisible]}>
        <ExerciseContainerEditSetViewVisibleCtx.Provider value={[editSetViewVisible, setEditSetViewVisible]}>
          <Col lg={4} xs={12} className="mb-2">
            <Card>
              <CardHeader className="text-center pt-0 pb-0">
                <ExerciseHeaderContainer exerciseData={currentExerciseData} superSetData={superSetData} initializeSuperSetData={initializeSuperSetData}/>
                {showDebugInformation && <h2>Ex UID: {currentExerciseData.uid}</h2>}
              </CardHeader>

              <CardBody className="p-0">
                {showDebugInformation && <Row><Col>Type UID: {currentExerciseData.typeUid}</Col></Row>}
                {(currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS || currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) && <SetsView setsExerciseUid={currentExerciseData.typeUid} exerciseType={currentExerciseData.type}/>}
                {currentExerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE && <TimeDistanceExerciseContainer timeDistanceExerciseUid={currentExerciseData.typeUid}/>}
              </CardBody>

              <CardFooter className="p-0">
                {showFooterButtons && <ButtonGroup className="w-100" vertical>
                  <Button color="success" block onClick={() => setAddSetViewVisible(true)}>{options.actionButtonText}</Button>
                  <ButtonDropdown isOpen={dropdownVisible} toggle={toggleActionDropdown}>
                    <DropdownToggle caret>
                      {t("Actions")}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setHeaderEditType(EXERCISE_HEADER_TYPES.EDIT_EXERCISE_NAME)}>
                        {`${t("Edit")} ${t("name")}`}
                      </DropdownItem>
                      {!exerciseDeleteStep2Shown && <DropdownItem toggle={false} onClick={() => setExerciseDeleteStep2Shown(true)}>{t("Delete")} {t("exercise")}</DropdownItem>}
                      {exerciseDeleteStep2Shown && <DropdownItem className="text-danger" onClick={() => delExercise()}>{t("Click again to delete!")}</DropdownItem>}
                      <DropdownItem onClick={() => setHeaderEditType(EXERCISE_HEADER_TYPES.EDIT_SUPER_SET)}>{t('Edit super set')}</DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>}
                {/*<ButtonGroup className="w-100"></ButtonGroup>  // Something wrong with buttongroup and dropdown.. */}
                {options.showFooterInfo && <div className="text-muted text-center font-italic">
                  <small>{t("Click on a set for different actions")}</small>
                </div>}
              </CardFooter>
            </Card>
          </Col>
        </ExerciseContainerEditSetViewVisibleCtx.Provider>
      </ExerciseContainerAddSetViewVisibleCtx.Provider>
    </ExerciseHeaderEditCtx.Provider>
  );
};

interface IExerciseTypeContainerProps {
  exerciseUid: string
}

interface IExerciseTypeContainerRouter {
  router: Router
}

export default withRouter(ExerciseTypeContainer);