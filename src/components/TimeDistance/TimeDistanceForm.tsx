import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {ITimeDistanceBasicModel, ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {Formik, FormikHelpers, Form} from 'formik';
import {Button, ButtonGroup} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FieldFormGroup from '../Formik/FieldFormGroup';
import DurationFormGroup from '../Formik/DurationFormGroup';
import {getTimeDistanceExercise, updateTimeDistanceExercise} from './TimeDistanceService';
import LoadingAlert from '../LoadingAlert/LoadingAlert';
import {retrieveErrorMessage} from '../../config/FirebaseUtils';
import {ExerciseContainerAddSetViewVisibleCtx} from '../Exercise/ExerciseTypeContainer';

const TimeDistanceForm: FunctionComponent<ITimeDistanceFormProps> = ({timeDistanceUid}) => {
  const { t } = useTranslation();

  const setEditVisible = useContext(ExerciseContainerAddSetViewVisibleCtx)[1];

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [timeDistanceData, setTimeDistanceDataData] = useState<ITimeDistanceModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const res = await getTimeDistanceExercise(timeDistanceUid);
        setTimeDistanceDataData(res);
      } catch (e) {
        console.error(e);
        setFetchDataError(retrieveErrorMessage(e));
      }
    };

    // noinspection JSIgnoredPromiseFromCall
    fetchExerciseData();
  }, [timeDistanceUid]);

  if (fetchDataError || submitErrorMessage) {
    return <ErrorAlert errorText={fetchDataError || submitErrorMessage} componentName="TimeDistanceView"/>;
  }

  if (!timeDistanceData) {
    return <LoadingAlert componentName="TimeDistanceView"/>;
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
            <FieldFormGroup type="number" name="totalDistanceMeter" labelText={t("Total distance (meters)")}/>
            <FieldFormGroup type="number" name="totalKcal" labelText={t("Total kcal")}/>
            <FieldFormGroup type="number" name="speedMin" labelText={t("Speed min")} inputProps={{step: "0.1"}}/>
            <FieldFormGroup type="number" name="speedMax" labelText={t("Speed max")} inputProps={{step: "0.1"}}/>
            <FieldFormGroup type="number" name="inclineMin" labelText={t("Incline min")} inputProps={{step: "0.5"}}/>
            <FieldFormGroup type="number" name="inclineMax" labelText={t("Incline max")} inputProps={{step: "0.5"}}/>
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
  timeDistanceUid: string
}

export default TimeDistanceForm;