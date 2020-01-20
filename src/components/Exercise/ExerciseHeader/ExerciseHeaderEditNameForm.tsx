import React, {FunctionComponent, useContext, useState} from 'react';
import {IExerciseHeaderModel, IExerciseModel} from '../../../models/IExerciseModel';
import {useTranslation} from 'react-i18next';
import {updateExercise} from '../ExerciseService';
import {Form, Formik, FormikHelpers} from 'formik';
import {Button, ButtonGroup} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../../Formik/FormikField';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {ExerciseHeaderEditCtx} from '../ExerciseTypeContainer';
import {retrieveErrorMessage} from '../../../config/FirebaseUtils';
import {exerciseFormValidation} from '../ExerciseHelpers';
import {EXERCISE_HEADER_TYPES} from './ExerciseHeaderHelpers';

const ExerciseHeaderEditNameForm: FunctionComponent<IExerciseHeaderProps> = ({exerciseData}) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const setHeaderEditVisible = useContext(ExerciseHeaderEditCtx)[1];

  const onSubmit = async (values: any, actions: FormikHelpers<IExerciseHeaderModel>) => {
    if (values.exerciseName === exerciseData.exerciseName) {
      return showExerciseNameAndHideThisForm();
    }
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const updateData: IExerciseHeaderModel = {
        exerciseName: values.exerciseName
      };
      await updateExercise(exerciseData.uid, updateData);
      exerciseData.exerciseName = values.exerciseName;
      actions.setSubmitting(false);
      return showExerciseNameAndHideThisForm();
    } catch (e) {
      setSubmitErrorMessage(retrieveErrorMessage(e));
    }
  };

  const showExerciseNameAndHideThisForm = () => {
    setHeaderEditVisible(EXERCISE_HEADER_TYPES.SHOW_EXERCISE_NAME)
  };

  return (
    <Formik
      initialValues={{exerciseName: exerciseData.exerciseName}}
      onSubmit={onSubmit}
      validate={(values: any) => {
        return exerciseFormValidation(values, t);
      }}>
      {({errors, isSubmitting}) => (
        <>
          {submitErrorMessage && <ErrorAlert errorText={submitErrorMessage} componentName="ExerciseHeader"/>}
          {isSubmitting && <FontAwesomeIcon icon="spinner" spin/>}
          {!isSubmitting && <>
            <Form>
              <FormikField name="exerciseName" labelHidden inputProps={{autoFocus: true}}/>
              <ButtonGroup className="w-100">
                <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save")}</Button>
                <Button color="danger" onClick={showExerciseNameAndHideThisForm}>{t("Discard")}</Button>
              </ButtonGroup>
            </Form>
          </>}
        </>
      )}
    </Formik>
  );
};


interface IExerciseHeaderProps {
  exerciseData: IExerciseModel
}

export default ExerciseHeaderEditNameForm;
