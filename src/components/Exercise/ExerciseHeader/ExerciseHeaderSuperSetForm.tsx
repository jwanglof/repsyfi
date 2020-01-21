import React, {Dispatch, FunctionComponent, SetStateAction, useContext, useEffect, useState} from 'react';
import {Form, Formik, FormikHelpers} from 'formik';
import {IExercisesSuperSetsModel} from '../../../models/IExercisesSuperSetsModel';
import {Button, ButtonGroup, Col} from 'reactstrap';
import {EXERCISE_HEADER_TYPES} from './ExerciseHeaderHelpers';
import {ExerciseHeaderEditCtx} from '../ExerciseTypeContainer';
import {useTranslation} from 'react-i18next';
import SelectFormGroup, {ISelectFormOptions} from '../../Formik/SelectFormGroup';
import {parseProvidedSuperSetOptions, SUPER_SET_DEFAULT_TYPES} from '../ExerciseHelpers';
import {
  addExerciseToSuperSet,
  createAndGetNewSuperSetWithExercise,
  deleteExerciseFromSuperSetWithUid,
  getAllSuperSets, getSuperSetFromExerciseUid
} from '../../../services/ExercisesSuperSetService';
import {orderBy} from 'lodash';
import {withRoute} from 'react-router5';
import {Router} from 'router5';
import {IExerciseModel} from '../../../models/IExerciseModel';
import firebase from '../../../config/firebase';
import {getCurrentUsersUid, retrieveErrorMessage} from '../../../config/FirebaseUtils';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {getNextSuperSetName} from '../../../utils/exercise-utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const ExerciseHeaderSuperSetForm: FunctionComponent<IExerciseHeaderSuperSetFormRouter & IExerciseHeaderSuperSetFormProps> = ({router, exerciseData, superSetData, setInitialSuperSetData}) => {
  const { t } = useTranslation();
  const dayUid = router.getState().params.uid;

  const setHeaderEditVisible = useContext(ExerciseHeaderEditCtx)[1];

  const [superSets, setSuperSets] = useState<IExercisesSuperSetsModel[]>([]);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const allSuperSets = getAllSuperSets(dayUid);
    setSuperSets(orderBy(allSuperSets, 'name', 'asc'));
  }, [dayUid]);

  if (submitErrorMessage) {
    return <ErrorAlert errorText={submitErrorMessage} componentName="ExerciseHeaderSuperSetForm"/>;
  }

  const removeSuperSet = async (exerciseUid: string) => {
    // More: https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
    let batch = firebase.firestore().batch();
    if (superSetData) {
      batch = deleteExerciseFromSuperSetWithUid(exerciseUid, dayUid, superSetData, batch);
    }
    setInitialSuperSetData(null);
    return await batch.commit();
  };

  const newSuperSet = async (exerciseUid: string) => {
    const ownerUid: string = await getCurrentUsersUid();
    const superSetName = getNextSuperSetName(superSets);
    const superSetData = await createAndGetNewSuperSetWithExercise(ownerUid, superSetName, exerciseUid, dayUid);
    setInitialSuperSetData(superSetData);
  };

  const changeSuperSet = async (exerciseUid: string, changeToSuperSetUid: string) => {
    // More: https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
    let batch = firebase.firestore().batch();// const changeToSuperSetUid = values.superSet;
    // Delete the current exercise from existing super set, if the current exercise have a super set
    if (superSetData) {
      batch = deleteExerciseFromSuperSetWithUid(exerciseUid, dayUid, superSetData, batch);
    }
    // Add the current exercise to the super set
    await addExerciseToSuperSet(changeToSuperSetUid, exerciseUid, dayUid);
    const newSuperSetData = getSuperSetFromExerciseUid(exerciseUid, dayUid);
    if (newSuperSetData) {
      setInitialSuperSetData(newSuperSetData);
    }
    return await batch.commit();
  };

  const onSubmit = async (values: IExerciseForm, actions: FormikHelpers<IExerciseForm>) => {
    if (superSetData && values.superSet === superSetData.uid) {
      return showExerciseNameAndHideThisForm();
    }

    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const exerciseUid = exerciseData.uid;

      if (values.superSet === SUPER_SET_DEFAULT_TYPES.REMOVE) {
        await removeSuperSet(exerciseUid);
      } else if (values.superSet === SUPER_SET_DEFAULT_TYPES.NEW) {
        await newSuperSet(exerciseUid);
      } else if (values.superSet) {
        await changeSuperSet(exerciseUid, values.superSet)
      }

      actions.setSubmitting(false);
      return showExerciseNameAndHideThisForm();
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(retrieveErrorMessage(e));
    }
  };

  const showExerciseNameAndHideThisForm = () => {
    setHeaderEditVisible(EXERCISE_HEADER_TYPES.SHOW_EXERCISE_NAME)
  };

  const getSuperSetOptions = (): ISelectFormOptions[] => {
    const d = parseProvidedSuperSetOptions(superSets);
    // Only add the remove option if the exercise have any super set data
    if (superSetData) {
      const removeOption = {value: SUPER_SET_DEFAULT_TYPES.REMOVE, label: t('Remove from super set')};
      d.unshift(removeOption);
    }
    const newOption = {value: SUPER_SET_DEFAULT_TYPES.NEW, label: t('New super set')};
    d.unshift(newOption);
    return d;
  };

  const initialData: IExerciseForm = {
    superSet: SUPER_SET_DEFAULT_TYPES.NEW
  };
  if (superSetData && superSetData.uid) {
    initialData.superSet = superSetData.uid;
  }

  return (
    <div className="form-row">
      <Col>
        <Formik
          initialValues={initialData}
          onSubmit={onSubmit}>
          {({errors, isSubmitting}) => (
            <>
              {isSubmitting && <FontAwesomeIcon icon="spinner" spin/>}
              {!isSubmitting && <Form>
                <SelectFormGroup name="superSet" options={getSuperSetOptions()}/>

                <ButtonGroup className="w-100">
                  <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save")}</Button>
                  <Button color="danger" onClick={showExerciseNameAndHideThisForm}>{t("Discard")}</Button>
                </ButtonGroup>
              </Form>}
            </>
          )}
        </Formik>
      </Col>
    </div>
  );
};

interface IExerciseHeaderSuperSetFormProps {
  exerciseData: IExerciseModel
  superSetData?: IExercisesSuperSetsModel
  setInitialSuperSetData: Dispatch<SetStateAction<IExercisesSuperSetsModel | null>>
}

interface IExerciseHeaderSuperSetFormRouter {
  router: Router
}

interface IExerciseForm {
  superSet?: string
}

export default withRoute(ExerciseHeaderSuperSetForm);
