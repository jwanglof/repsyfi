import React, {FunctionComponent, useState} from 'react';
import {IExerciseHeaderModel, IExerciseModel} from '../../models/IExerciseModel';
import {useTranslation} from 'react-i18next';
import {updateExercise} from './TSExerciseService';
import {Form, Formik, FormikActions} from 'formik';
import {Button, ButtonGroup, CardHeader} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import FormikField from '../shared/formik/FormikField';

const TSExerciseHeader: FunctionComponent<TSExerciseHeaderProps> = ({exerciseData, dayUid}) => {
  const { t } = useTranslation();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  const toggleEditForm = () => setIsCollapsed(!isCollapsed);

  const onSubmit = async (values: any, actions: FormikActions<IExerciseHeaderModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      await updateExercise(exerciseData.uid, values);
      exerciseData.exerciseName = values.exerciseName;
      setIsCollapsed(true);
    } catch (e) {
      setSubmitErrorMessage(e.message);
    }

    actions.setSubmitting(false);
  };

  const validate = (values: TSExerciseHeaderValidate): TSExerciseHeaderValidate | {} => {
    const errors: TSExerciseHeaderValidate = {};
    if (values.exerciseName === '') {
      errors.exerciseName = t("Title can't be empty");  // TODO Rename to exercise name!
    }
    return errors;
  };

  return (
    <CardHeader className="text-center pt-0 pb-0">
      {isCollapsed && <h1 className="exercise--title" onClick={toggleEditForm}>{exerciseData.exerciseName} <FontAwesomeIcon icon="edit" size="xs"/></h1>}
      {!isCollapsed &&
      <Formik
        initialValues={{exerciseName: exerciseData.exerciseName}}
        onSubmit={onSubmit}
        validate={validate}
        render={({errors, isSubmitting}) => (
          <>
            {submitErrorMessage && <ErrorAlert errorText={submitErrorMessage} componentName="ExerciseHeader"/>}
            {isSubmitting && <FontAwesomeIcon icon="spinner" spin/>}
            {!isSubmitting && <>
              <Form>
                <FormikField labelText="Exercise name" name="exerciseName" labelHidden/>
                <ButtonGroup className="w-100">
                  <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save")}</Button>
                  <Button color="danger" onClick={toggleEditForm}>{t("Discard")}</Button>
                </ButtonGroup>
              </Form>
            </>}
          </>
        )}
      />}
    </CardHeader>
  );

  // TODO Move this to another place!
  // {/*<Button color="warning" onClick={removeExercise}>{t("Delete")}</Button>*/}
  // const removeExercise = async () => {
  //   setSubmitErrorMessage(undefined);
  //
  //   try {
  //     await deleteExerciseAndRemoveFromDay(exerciseData.uid, dayUid);
  //   } catch (e) {
  //     setSubmitErrorMessage(e.message);
  //   }
  // };
};

interface TSExerciseHeaderValidate {
  exerciseName?: string
}

interface TSExerciseHeaderProps {
  exerciseData: IExerciseModel,
  dayUid: string
}

export default TSExerciseHeader;