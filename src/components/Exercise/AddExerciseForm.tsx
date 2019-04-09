import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {getCurrentUsersUid} from '../../config/FirebaseUtils';
import {Formik, FormikActions} from 'formik';
import {isEmpty} from 'lodash';
import {
  addExerciseAndGetUid,
  addExerciseToDayArray,
  addNewSetsRepsExerciseAndGetUid,
  addNewTimeDistanceExerciseAndGetUid,
  getExerciseTypes
} from './ExerciseService';
import {IExerciseBasicModel} from '../../models/IExerciseModel';
import {Button, ButtonGroup, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import SelectFormGroup from '../shared/formik/SelectFormGroup';
// @ts-ignore
import {Form} from 'react-formik-ui';

const AddExerciseForm: FunctionComponent<IAddExerciseFormProps> = ({dayUid, setAddExerciseViewVisible}) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <ErrorAlert errorText={submitErrorMessage} componentName="AddExerciseForm"/>;
  }

  const validate = (values: IAddExerciseFormValidate): IAddExerciseFormValidate | {} => {
    const errors: IAddExerciseFormValidate = {};
    if (isEmpty(values.exerciseName)) {
      errors.exerciseName = "Exercise name can't be empty"
    }
    return errors;
  };

  const onSubmit = async (values: IAddExerciseForm, actions: FormikActions<IAddExerciseFormSubmitValues>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);
    console.log('values:', values);
    try {
      const ownerUid: string = await getCurrentUsersUid();

      let exerciseTypeUid;
      if (values.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
        exerciseTypeUid = await addNewSetsRepsExerciseAndGetUid(ownerUid);
      } else if (values.type === ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE) {
        exerciseTypeUid = await addNewTimeDistanceExerciseAndGetUid(ownerUid);
      } else {
        return;
      }

      console.log('exerciseTypeUid:', exerciseTypeUid);

      const exerciseData: IExerciseBasicModel = {
        exerciseName: values.exerciseName,
        type: values.type,
        typeUid: exerciseTypeUid
      };
      const exerciseUid = await addExerciseAndGetUid(exerciseData, ownerUid);
      console.log('exerciseUid:', exerciseUid, exerciseData);
      await addExerciseToDayArray(exerciseUid, dayUid);
      setAddExerciseViewVisible(false);
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }
    actions.setSubmitting(false);
  };

  const emptyInitialValues: IAddExerciseForm = {exerciseName: '', type: ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS};

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={emptyInitialValues}
          onSubmit={onSubmit}
          validate={validate}
          // render={({ errors, status, touched, isSubmitting }) => (
          render={({ errors, isSubmitting }) => (
            <Form themed>
              <FieldFormGroup name="exerciseName" labelText={t("Exercise")}/>
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

interface IAddExerciseFormProps {
  // initialValues: IAddExerciseForm,
  dayUid: string,
  setAddExerciseViewVisible: any  // TODO Change to method?
}

interface IAddExerciseForm {
  exerciseName: string,
  type: ExerciseTypesEnum
}

interface IAddExerciseFormValidate {
  exerciseName?: string
}

interface IAddExerciseFormSubmitValues {
  exerciseName: string,
  type: ExerciseTypesEnum
}

export default AddExerciseForm;