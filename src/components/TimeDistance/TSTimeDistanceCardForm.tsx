import React, {FunctionComponent, useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import TSErrorAlert from '../ErrorAlert/TSErrorAlert';
import {ITimeDistanceBasicModel} from '../../models/ITimeDistanceModel';
import {ErrorMessage, Field, Formik, FormikActions} from 'formik';
import {Alert, Button, ButtonGroup, CardBody, Col, FormGroup, Input, Label} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {colSmSize, labelSmSize} from '../shared/formik/formik-utils';
import DateTimePickerFormGroup from '../shared/formik/DateTimePickerFormGroup';
import FieldFormGroup from '../shared/formik/FieldFormGroup';
import {TSEditVisibleCtx} from '../Exercise/ExerciseTypes/TSExerciseTimeDistance';
// @ts-ignore
import {Form} from 'react-formik-ui';

const TSTimeDistanceCardForm: FunctionComponent<TSTimeDistanceCardFormProps> = ({currentExerciseData}) => {
  const { t } = useTranslation();

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [editVisible, setEditVisible] = useContext<any>(TSEditVisibleCtx);

  if (submitErrorMessage) {
    return <TSErrorAlert errorText={submitErrorMessage} componentName="TSTimeDistanceCardForm"/>;
  }

  const onSubmit = async (values: ITimeDistanceBasicModel, actions: FormikActions<ITimeDistanceBasicModel>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    try {
      console.log(values);
      // const ownerUid = await getCurrentUsersUid();
      // await addNewTimeDistanceAndGetUid(currentExerciseData.uid, ownerUid, values);
      // Hide this form
      setEditVisible(false)
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }
    actions.setSubmitting(false);
  };

  return (
    <CardBody className="m-0 p-0">
      <Formik
        initialValues={currentExerciseData}
        onSubmit={onSubmit}
        // validate={validate}
        render={({errors, isSubmitting}) => (
          <>
            {isSubmitting && <div className="text-center"><FontAwesomeIcon icon="spinner" spin/></div>}
            {!isSubmitting && <Form>
              <FormGroup row>
                <Label for="totalTimeSeconds" sm={labelSmSize}>Total exercise time (HH MM)</Label>
                <Col sm={colSmSize}>
                  <Input tag={Field} type="number" component="input" name="totalTimeSeconds" id="totalTimeSeconds" placeholder="Total exercise time (HH MM)" />
                  {/* TODO! YOU ARE HERE! Fix the time chooser thingy. Have 2 inputs? One for hour and one for minute?*/}
                  <ErrorMessage name="totalTimeSeconds">{msg => <Alert color="warning" className="pb-0 pt-0 pl-2 pr-2 mt-2">{msg}</Alert>}</ErrorMessage>
                </Col>
              </FormGroup>
              {/*<DatepickerFormGroup name="totalTimeSeconds" labelText={t("Total exercise time (HH MM)")} dateFormat="HH:mm:ss" showTimeSelect={true}/>*/}
              {/*<DateTimePickerFormGroup name="totalTimeSeconds" labelText={t("Total exercise time (HH MM)")}/>*/}
              <DateTimePickerFormGroup name="totalWarmupSeconds" labelText={t("Total warm-up time (HH MM)")}/>
              <FieldFormGroup type="number" name="totalDistanceMeter" labelText={t("Total distance (meters)")}/>
              <FieldFormGroup type="number" name="kcal" labelText={t("Total kcal")}/>
              <FieldFormGroup type="number" name="speedMin" labelText={t("Speed min")}/>
              <FieldFormGroup type="number" name="speedMax" labelText={t("Speed max")}/>
              <FieldFormGroup type="number" name="inclineMin" labelText={t("Incline min")}/>
              <FieldFormGroup type="number" name="inclineMax" labelText={t("Incline max")}/>
              <ButtonGroup className="w-100">
                <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save")}</Button>
                <Button color="danger" onClick={() => setEditVisible(false)}>{t("Discard")}</Button>
              </ButtonGroup>
            </Form>}
          </>
        )}
      />
    </CardBody>
  );
};

interface TSTimeDistanceCardFormProps {
  currentExerciseData: ITimeDistanceBasicModel
}

export default TSTimeDistanceCardForm;