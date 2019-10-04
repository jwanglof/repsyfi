import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {getCurrentUsersUid} from '../../config/FirebaseUtils';
import {Formik, FormikActions} from 'formik';
import isEmpty from 'lodash/isEmpty';
import {addExerciseAndGetUid, addExerciseNameToCache, getLatest30ExerciseNames} from './ExerciseService';
import {IExerciseBasicModel} from '../../models/IExerciseModel';
import {Button, ButtonGroup, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../Formik/FieldFormGroup';
import SelectFormGroup from '../Formik/SelectFormGroup';
import {addNewTimeDistanceExerciseAndGetUid} from '../TimeDistance/TimeDistanceService';
import {addNewSetsRepsExerciseAndGetUid} from '../SetsReps/SetsRepsService';
import {addExerciseToDayArray, getAllLocations} from '../Day/DayService';
// @ts-ignore
import {Form} from 'react-formik-ui';
import {Router} from 'router5';
import {withRoute} from 'react-router5';
import {addNewSetsSecondsExerciseAndGetUid} from '../SetsSeconds/SetsSecondsService';
import AutocompleteFormGroup from '../Formik/AutocompleteFormGroup';

const ExerciseForm: FunctionComponent<IExerciseFormRouter & IExerciseFormProps> = ({router, setAddExerciseViewVisible}) => {
  const { t } = useTranslation();
  const dayUid = router.getState().params.uid;

  if (!dayUid) {
    return <ErrorAlert errorText="Need a day UID to add an exercise!" componentName="ExerciseForm"/>;
  }

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [exerciseNames, setExerciseNames] = useState<Array<string>>([]);

  useEffect(() => {
    const fetchExerciseNames = async () => {
      const exerciseNames = await getLatest30ExerciseNames();
      setExerciseNames(exerciseNames);
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchExerciseNames();
  }, []);

  if (submitErrorMessage) {
    return <ErrorAlert errorText={submitErrorMessage} componentName="AddExerciseForm"/>;
  }

  const validate = (values: IExerciseFormValidate): IExerciseFormValidate | {} => {
    const errors: IExerciseFormValidate = {};
    if (isEmpty(values.exerciseName)) {
      errors.exerciseName = "Exercise name can't be empty"
    }
    return errors;
  };

  const onSubmit = async (values: IExerciseForm, actions: FormikActions<IExerciseFormSubmitValues>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);
    try {
      const ownerUid: string = await getCurrentUsersUid();

      let exerciseTypeUid;
      if (values.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
        exerciseTypeUid = await addNewSetsRepsExerciseAndGetUid(ownerUid);
      } else if (values.type === ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE) {
        exerciseTypeUid = await addNewTimeDistanceExerciseAndGetUid(ownerUid);
      } else if (values.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
        exerciseTypeUid = await addNewSetsSecondsExerciseAndGetUid(ownerUid);
      } else {
        return;
      }

      const exerciseData: IExerciseBasicModel = {
        exerciseName: values.exerciseName,
        type: values.type,
        typeUid: exerciseTypeUid
      };
      const exerciseUid = await addExerciseAndGetUid(exerciseData, ownerUid);
      await addExerciseToDayArray(exerciseUid, dayUid);

      // Add the exercise name to the cache
      addExerciseNameToCache(values.exerciseName);

      setAddExerciseViewVisible(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }
    actions.setSubmitting(false);
  };

  const getExerciseTypes = (): Array<ExerciseTypesOptions> => ([
    {value: ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS, label: t("Sets with reps")},
    {value: ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE, label: t("Time and distance")},
    {value: ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS, label: t("Sets with seconds")},
    // {value: ExerciseTypesEnum.EXERCISE_TYPE_NOT_CHOSEN, label: 'Other'},  // TODO Implement
  ]);

  const emptyInitialValues: IExerciseForm = {exerciseName: '', type: ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS};

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={emptyInitialValues}
          onSubmit={onSubmit}
          validate={validate}
          // render={({ errors, status, touched, isSubmitting }) => (
          render={({ errors, isSubmitting }) => (
            <Form mode='structured' themed>
              {/*<FieldFormGroup name="exerciseName" labelText={t("Exercise name")} inputProps={{autoFocus: true}}/>*/}
              <AutocompleteFormGroup name="exerciseName" labelText={t("Exercise name")} suggestions={exerciseNames}  inputProps={{autoFocus: true}}/>
              <SelectFormGroup name="type" labelText={t("Exercise type")} options={getExerciseTypes()}/>

              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <ButtonGroup className="w-100">
                      <Button type="submit" color="primary" disabled={isSubmitting || !isEmpty(errors)}>{t("Save exercise")}</Button>
                      <Button color="danger" onClick={() => setAddExerciseViewVisible(false)}>{t("Discard exercise")}</Button>
                    </ButtonGroup>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
        />
      </Col>
    </Row>
  );
};

interface IExerciseFormProps {
  setAddExerciseViewVisible: ((visible: boolean) => void),
}

interface IExerciseForm {
  exerciseName: string,
  type: ExerciseTypesEnum
}

interface IExerciseFormValidate {
  exerciseName?: string
}

interface IExerciseFormSubmitValues {
  exerciseName: string,
  type: ExerciseTypesEnum
}

interface IExerciseFormRouter {
  router: Router
}

interface ExerciseTypesOptions {
  value: ExerciseTypesEnum,
  label: string
}

export default withRoute(ExerciseForm);