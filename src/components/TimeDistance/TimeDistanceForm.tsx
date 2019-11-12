import React, {FunctionComponent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {ITimeDistanceBasicModel, ITimeDistanceModel} from '../../models/ITimeDistanceModel';
import {Formik, FormikHelpers} from 'formik';
import {Button, ButtonGroup} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import FieldFormGroup from '../Formik/FieldFormGroup';
// @ts-ignore
import {Form} from 'react-formik-ui';
import DurationFormGroup from '../Formik/DurationFormGroup';
import {getTimeDistanceExercise, updateTimeDistanceExercise} from './TimeDistanceService';
import LoadingAlert from '../LoadingAlert/LoadingAlert';

const TimeDistanceForm: FunctionComponent<ITimeDistanceFormProps> = ({timeDistanceUid, setEditVisible}) => {
  const { t } = useTranslation();

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
        setFetchDataError(e.message);
      }
    };

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
      // Hide this form
      setEditVisible(false)
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={timeDistanceData}
      onSubmit={onSubmit}
      render={({errors, isSubmitting}) => (
        <>
          {isSubmitting && <div className="text-center"><FontAwesomeIcon icon="spinner" spin/></div>}
          {!isSubmitting && <Form mode='structured'>
            <DurationFormGroup name="totalTimeSeconds" labelText={t("Total exercise time (HH MM SS)")} autoFocus/>
            <DurationFormGroup name="totalWarmupSeconds" labelText={t("Total warm-up time (HH MM SS)")}/>
            <FieldFormGroup type="number" name="totalDistanceMeter" labelText={t("Total distance (meters)")}/>
            <FieldFormGroup type="number" name="totalKcal" labelText={t("Total kcal")}/>
            <FieldFormGroup type="number" name="speedMin" labelText={t("Speed min")} inputProps={{step: "0.1"}}/>
            <FieldFormGroup type="number" name="speedMax" labelText={t("Speed max")} inputProps={{step: "0.1"}}/>
            <FieldFormGroup type="number" name="inclineMin" labelText={t("Incline min")} inputProps={{step: "0.5"}}/>
            <FieldFormGroup type="number" name="inclineMax" labelText={t("Incline max")} inputProps={{step: "0.5"}}/>
            <ButtonGroup className="w-100 m-0 p-0">
              <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save")}</Button>
              <Button color="danger" onClick={() => setEditVisible(false)}>{t("Discard")}</Button>
            </ButtonGroup>
          </Form>}
        </>
      )}
    />
  );
};

interface ITimeDistanceFormProps {
  timeDistanceUid: string,
  setEditVisible: ((visible: boolean) => void)
}

export default TimeDistanceForm;