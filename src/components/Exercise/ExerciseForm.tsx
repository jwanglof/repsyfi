import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {getCurrentUsersUid, retrieveErrorMessage} from '../../config/FirebaseUtils';
import {Formik, FormikHelpers, Form} from 'formik';
import isEmpty from 'lodash/isEmpty';
import {addExerciseAndGetUid} from './ExerciseService';
import {IExerciseBasicModel} from '../../models/IExerciseModel';
import {Button, ButtonGroup, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../Formik/FieldFormGroup';
import SelectFormGroup, {ISelectFormOptions} from '../Formik/SelectFormGroup';
import {addNewTimeDistanceExerciseAndGetUid} from '../TimeDistance/TimeDistanceService';
import {addNewSetsRepsExerciseAndGetUid} from '../Sets/SetsReps/SetsRepsService';
import {addExerciseToDayArray} from '../Day/DayService';
import {Router} from 'router5';
import {withRoute} from 'react-router5';
import {addNewSetsSecondsExerciseAndGetUid} from '../Sets/SetsSeconds/SetsSecondsService';
import {
  addExerciseToSuperSet,
  createNewSuperSetAndReturnUid,
  getAllSuperSets
} from '../../services/ExercisesSuperSetService';
import {IExercisesSuperSetsModel} from '../../models/IExercisesSuperSetsModel';
import {orderBy} from 'lodash';

const ExerciseForm: FunctionComponent<IExerciseFormRouter & IExerciseFormProps> = ({router, setAddExerciseViewVisible}) => {
  const { t } = useTranslation();
  const dayUid = router.getState().params.uid;
  const emptySuperSetValue = 'empty-super-set-option-value';
  const newSuperSetValue = 'new-super-set-option-value';

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [superSets, setSuperSets] = useState<IExercisesSuperSetsModel[]>([]);

  useEffect(() => {
    const allSuperSets = getAllSuperSets(dayUid);
    setSuperSets(orderBy(allSuperSets, 'name', 'asc'));
  }, [dayUid]);

  if (!dayUid) {
    return <ErrorAlert errorText="Need a day UID to add an exercise!" componentName="ExerciseForm"/>;
  }

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

  const onSubmit = async (values: IExerciseForm, actions: FormikHelpers<IExerciseForm>) => {
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

      if (values.superSet === newSuperSetValue) {
        // Create new super set with created exercise
        let superSetName = '1';
        if (superSets.length) {
          // The name is auto set to integers (for now) so just add 1 to the name
          superSetName = (parseInt(superSets[superSets.length - 1].name) + 1).toString();
        }
        await createNewSuperSetAndReturnUid(ownerUid, superSetName, exerciseUid, dayUid);
      } else if (values.superSet !== emptySuperSetValue && values.superSet) {
        // Update existing super set with created exercise
        await addExerciseToSuperSet(values.superSet, exerciseUid, dayUid);
      }

      await addExerciseToDayArray(exerciseUid, dayUid);
      actions.setSubmitting(false);
      setAddExerciseViewVisible(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(retrieveErrorMessage(e));
    }
  };

  const getExerciseTypes = (): Array<ISelectFormOptions> => ([
    {value: ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS, label: t("Sets with reps")},
    {value: ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE, label: t("Time and distance")},
    {value: ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS, label: t("Sets with seconds")},
    // {value: ExerciseTypesEnum.EXERCISE_TYPE_NOT_CHOSEN, label: 'Other'},  // TODO Implement
  ]);

  const getSuperSetOptions = (): ISelectFormOptions[] => {
    const d = superSets.map((s): ISelectFormOptions => {
      return {value: s.uid, label: s.name};
    });
    const emptyOption = {value: emptySuperSetValue, label: t('No')};
    const newOption = {value: newSuperSetValue, label: t('New super set')};
    d.unshift(emptyOption, newOption);
    return d;
  };

  const emptyInitialValues: IExerciseForm = {
    exerciseName: '',
    type: ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS,
    superSet: emptySuperSetValue
  };

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={emptyInitialValues}
          onSubmit={onSubmit}
          validate={validate}>
          {({ errors, isSubmitting }) => (
            <Form>
              <FieldFormGroup name="exerciseName" labelText={t('Exercise name')} inputProps={{autoFocus: true}}/>
              <SelectFormGroup name="type" labelText={t('Exercise type')} options={getExerciseTypes()}/>
              <SelectFormGroup name="superSet" labelText={t('Part of super set')} options={getSuperSetOptions()}/>

              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <ButtonGroup className="w-100">
                      <Button type="submit" color="primary" disabled={isSubmitting || !isEmpty(errors)}>{t('Save exercise')}</Button>
                      <Button color="danger" onClick={() => setAddExerciseViewVisible(false)}>{t('Discard exercise')}</Button>
                    </ButtonGroup>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

interface IExerciseFormProps {
  setAddExerciseViewVisible: ((visible: boolean) => void),
}

interface IExerciseForm {
  exerciseName: string
  type: ExerciseTypesEnum
  superSet: string | undefined
}

interface IExerciseFormValidate {
  exerciseName?: string
}

interface IExerciseFormRouter {
  router: Router
}

export default withRoute(ExerciseForm);