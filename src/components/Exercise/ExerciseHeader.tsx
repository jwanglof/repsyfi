import React, {FunctionComponent, useContext, useState} from 'react';
import {IExerciseHeaderModel, IExerciseModel} from '../../models/IExerciseModel';
import {useTranslation} from 'react-i18next';
import {updateExercise} from './ExerciseService';
import {Formik, FormikHelpers} from 'formik';
import {Button, ButtonGroup} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../Formik/FormikField';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {ExerciseHeaderEditCtx} from './ExerciseTypeContainer';
// TODO :(
// @ts-ignore
import {Form} from 'react-formik-ui';

const ExerciseHeader: FunctionComponent<IExerciseHeaderProps> = ({exerciseData}) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [headerEditVisible, setHeaderEditVisible] = useContext(ExerciseHeaderEditCtx);

  if (!headerEditVisible) return null;

  const onSubmit = async (values: any, actions: FormikHelpers<IExerciseHeaderModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      const updateData: IExerciseHeaderModel = {
        exerciseName: values.exerciseName
      };
      await updateExercise(exerciseData.uid, updateData);
      exerciseData.exerciseName = values.exerciseName;
      setHeaderEditVisible(false)
    } catch (e) {
      setSubmitErrorMessage(e.message);
    }

    actions.setSubmitting(false);
  };

  const validate = (values: IExerciseHeaderValidate): IExerciseHeaderValidate | {} => {
    const errors: IExerciseHeaderValidate = {};
    if (values.exerciseName === '') {
      errors.exerciseName = t("Exercise name can't be empty");
    }
    return errors;
  };

  return (
    <Formik
      initialValues={{exerciseName: exerciseData.exerciseName}}
      onSubmit={onSubmit}
      validate={validate}
      render={({errors, isSubmitting}) => (
        <>
          {submitErrorMessage && <ErrorAlert errorText={submitErrorMessage} componentName="ExerciseHeader"/>}
          {isSubmitting && <FontAwesomeIcon icon="spinner" spin/>}
          {!isSubmitting && <>
            <Form mode='structured'>
              <FormikField labelText="Exercise name" name="exerciseName" labelHidden inputProps={{autoFocus: true}}/>
              <ButtonGroup className="w-100">
                <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save")}</Button>
                <Button color="danger" onClick={() => setHeaderEditVisible(false)}>{t("Discard")}</Button>
              </ButtonGroup>
            </Form>
          </>}
        </>
      )}
    />
  );
};

interface IExerciseHeaderValidate {
  exerciseName?: string
}

interface IExerciseHeaderProps {
  exerciseData: IExerciseModel
}

export default ExerciseHeader;