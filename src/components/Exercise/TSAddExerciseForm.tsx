import React, {FunctionComponent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import TSErrorAlert from '../ErrorAlert/TSErrorAlert';
import {getCurrentUsersUid, getNowTimestamp} from '../../config/FirebaseUtils';
import {Formik, FormikActions} from 'formik';
import {isEmpty} from 'lodash';
import {
  addExerciseAndGetUid,
  addExerciseToDayArray,
  addNewSetsRepsExerciseAndGetUid,
  addNewTimeDistanceExerciseAndGetUid,
  getExerciseTypes
} from './TSExerciseService';
import {IExerciseModelWithoutUid} from '../../models/IExerciseModel';
import {Button, ButtonGroup, Col, FormGroup, Row} from 'reactstrap';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import SelectFormGroup from '../shared/formik/SelectFormGroup';
// @ts-ignore
import {Form} from 'react-formik-ui';

const TSAddExerciseForm: FunctionComponent<TSAddExerciseFormProps> = ({dayUid, setAddExerciseViewVisible, initialValues}) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <TSErrorAlert errorText={submitErrorMessage} componentName="TSAddExerciseForm"/>;
  }

  const validate = (values: TSAddExerciseFormValidate): TSAddExerciseFormValidate | {} => {
    const errors: TSAddExerciseFormValidate = {};
    if (isEmpty(values.exerciseName)) {
      errors.exerciseName = "Exercise name can't be empty"
    }
    return errors;
  };

  const onSubmit = async (values: ITSAddExerciseForm, actions: FormikActions<TSAddExerciseFormSubmitValues>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);
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

      const exerciseData: IExerciseModelWithoutUid = {
        exerciseName: values.exerciseName,
        type: values.type,
        typeUid: exerciseTypeUid,
        ownerUid: ownerUid,
        createdTimestamp: getNowTimestamp()
      };
      const exerciseUid = await addExerciseAndGetUid(exerciseData);
      await addExerciseToDayArray(exerciseUid, dayUid);
      setAddExerciseViewVisible(false);
    } catch (e) {
      setSubmitErrorMessage(e.message);
    }
    actions.setSubmitting(false);
  };

  return (
    <Row>
      <Col xs={12}>
        <Formik
          initialValues={initialValues}
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

interface TSAddExerciseFormProps {
  initialValues: ITSAddExerciseForm,
  dayUid: string,
  setAddExerciseViewVisible: any  // TODO Change to method?
}

interface ITSAddExerciseForm {
  exerciseName: string,
  type: ExerciseTypesEnum
}

interface TSAddExerciseFormValidate {
  exerciseName?: string
}

interface TSAddExerciseFormSubmitValues {
  exerciseName: string,
  type: ExerciseTypesEnum
}

export default TSAddExerciseForm;