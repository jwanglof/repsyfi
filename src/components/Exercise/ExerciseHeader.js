import React, {useState} from 'react';
import {Button, ButtonGroup, CardHeader} from 'reactstrap';
import PropTypes from 'prop-types';
import {Form, Formik} from 'formik';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FormikField from '../shared/formik/FormikField';
import isEmpty from 'lodash/isEmpty';
import {useTranslation} from 'react-i18next';
import {deleteExerciseAndRemoveFromDay, updateExercise} from './ExerciseService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

const ExerciseHeader = ({exerciseData, dayUid}) => {
  const { t } = useTranslation();

  const [collapsed, setCollapsed] = useState(true);
  const [submitErrorMessage, setSubmitErrorMessage] = useState(null);

  const toggleEditForm = () => {
    setCollapsed(!collapsed);
  };

  const onSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(null);

    try {
      await updateExercise(exerciseData.uid, values);
      exerciseData.exerciseName = values.exerciseName;
      setCollapsed(true);
    } catch (e) {
      setSubmitErrorMessage(e.message);
    }

    actions.setSubmitting(false);
  };

  const validate = values => {
    let errors = {};

    if (values.title === '') {
      errors.title = t("Title can't be empty");
    }

    return errors;
  };

  const removeExercise = async () => {
    setSubmitErrorMessage(null);

    try {
      await deleteExerciseAndRemoveFromDay(exerciseData.uid, dayUid);
    } catch (e) {
      setSubmitErrorMessage(e.message);
    }
  };

  return (
    <CardHeader className="text-center pt-0 pb-0">
      {collapsed && <h1 className="exercise--title" onClick={toggleEditForm}>{exerciseData.exerciseName} <FontAwesomeIcon icon="edit" size="xs"/></h1>}
      {!collapsed &&
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
                      <Button type="submit" color="primary" disabled={isSubmitting || !isEmpty(errors)}>{t("Save")}</Button>
                      <Button color="warning" onClick={removeExercise}>{t("Delete")}</Button>
                      <Button color="danger" onClick={toggleEditForm}>{t("Discard")}</Button>
                    </ButtonGroup>
                  </Form>
              </>}
          </>
        )}
      />}
    </CardHeader>
  );
};

ExerciseHeader.propTypes = {
  exerciseData: PropTypes.object.isRequired,
  dayUid: PropTypes.string.isRequired
};

export default ExerciseHeader;