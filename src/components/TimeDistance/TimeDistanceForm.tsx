import React, {FunctionComponent, useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {ITimeDistanceBasicModel, ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {Form, Formik, FormikHelpers} from 'formik';
import {Button, ButtonGroup} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FieldFormGroup from '../Formik/FieldFormGroup';
import DurationFormGroup from '../Formik/DurationFormGroup';
import {updateTimeDistanceExercise} from './TimeDistanceService';
import {retrieveErrorMessage} from '../../config/FirebaseUtils';
import {ExerciseContainerAddSetViewVisibleCtx} from '../Exercise/ExerciseTypeContainer';

const TimeDistanceForm: FunctionComponent<ITimeDistanceFormProps> = ({timeDistanceData}) => {
  const { t } = useTranslation();

  const setEditVisible = useContext(ExerciseContainerAddSetViewVisibleCtx)[1];

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  if (submitErrorMessage) {
    return <ErrorAlert errorText={submitErrorMessage} componentName="TimeDistanceView"/>;
  }

  const onSubmit = async (values: ITimeDistanceBasicModel, actions: FormikHelpers<ITimeDistanceModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);
    try {
      await updateTimeDistanceExercise(timeDistanceData.uid, values);
      actions.setSubmitting(false);

      // Hide this form
      setEditVisible(false)
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(retrieveErrorMessage(e));
    }
  };

  const defaultInputProps = {min: 0};
  const speedInputProps = {step: "0.1", ...defaultInputProps};
  const inclineInputProps = {step: "0.5", ...defaultInputProps};
  return (
    <Formik
      initialValues={timeDistanceData}
      onSubmit={onSubmit}>
      {({errors, isSubmitting}) => (
        <>
          {isSubmitting && <div className="text-center"><FontAwesomeIcon icon="spinner" spin/></div>}
          {!isSubmitting && <Form>
            <DurationFormGroup name="totalTimeSeconds" labelText={t("Total exercise time (HH MM SS)")} autoFocus/>
            <DurationFormGroup name="totalWarmupSeconds" labelText={t("Total warm-up time (HH MM SS)")}/>
            <FieldFormGroup type="number" name="totalDistanceMeter" labelText={t("Total distance (meters)")} inputProps={defaultInputProps}/>
            <FieldFormGroup type="number" name="totalKcal" labelText={t("Total kcal")} inputProps={defaultInputProps}/>
            <FieldFormGroup type="number" name="speedMin" labelText={t("Speed min")} inputProps={speedInputProps}/>
            <FieldFormGroup type="number" name="speedMax" labelText={t("Speed max")} inputProps={speedInputProps}/>
            <FieldFormGroup type="number" name="inclineMin" labelText={t("Incline min")} inputProps={inclineInputProps}/>
            <FieldFormGroup type="number" name="inclineMax" labelText={t("Incline max")} inputProps={inclineInputProps}/>
            <ButtonGroup className="w-100 m-0">
              <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save")}</Button>
              <Button color="danger" onClick={() => setEditVisible(false)}>{t("Discard")}</Button>
            </ButtonGroup>
          </Form>}
        </>
      )}
    </Formik>
  );
};

interface ITimeDistanceFormProps {
  timeDistanceData: ITimeDistanceModel
}

export default TimeDistanceForm;