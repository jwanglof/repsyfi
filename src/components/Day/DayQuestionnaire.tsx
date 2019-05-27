import React, {FunctionComponent, useState} from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Row
} from 'reactstrap';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Formik, FormikActions} from 'formik';
// @ts-ignore
import {Form} from 'react-formik-ui';
import {ITimeDistanceBasicModel} from '../../models/ITimeDistanceModel';
import DurationFormGroup from '../Formik/DurationFormGroup';
import {updateTimeDistanceExercise} from '../TimeDistance/TimeDistanceService';

const DayQuestionnaire: FunctionComponent<IDayQuestionnaireProps> = ({show}) => {
  if (!show) return null;

  const { t } = useTranslation();

  const [feelingButton, setFeelingButton] = useState<FEELING_BUTTONS>(FEELING_BUTTONS.NEUTRAL);
  const [yesNoButton, setYesNoButton] = useState<boolean>(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);

  const onSubmit = async (values: any, actions: FormikActions<any>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    if (!yesNoButton) {
      values.totalStretchTimeSeconds = 0;
    }

    console.log(3333, values, feelingButton);

    try {
      // await updateTimeDistanceExercise(timeDistanceData.uid, values);
      // Hide this form
      // setEditVisible(false)
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(e.message);
    }

    actions.setSubmitting(false);
  };

  const initialValues = {
    totalStretchTimeSeconds: 0
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({errors, isSubmitting}) => (
        <>
          {isSubmitting && <div className="text-center"><FontAwesomeIcon icon="spinner" spin/></div>}
          {!isSubmitting && <Form>
            <Row>
              <Col className="mt-3" xs={12}>
                <Card>
                  <CardHeader className="text-center pt-0 pb-0">
                    <h1 className="exercise--title mb-0">{t("Exercise questionnaire")}</h1>
                  </CardHeader>

                  <CardBody>
                    <CardTitle className="text-center">
                      <h3>How did the workout feel?</h3>
                    </CardTitle>
                    <ButtonGroup className="w-100">
                      <Button onClick={() => setFeelingButton(FEELING_BUTTONS.WORST)}
                              active={feelingButton === FEELING_BUTTONS.WORST}
                              color="info">Worst</Button>
                      <Button onClick={() => setFeelingButton(FEELING_BUTTONS.BAD)}
                              active={feelingButton === FEELING_BUTTONS.BAD}
                              color="info">Bad</Button>
                      <Button onClick={() => setFeelingButton(FEELING_BUTTONS.NEUTRAL)}
                              active={feelingButton === FEELING_BUTTONS.NEUTRAL}
                              color="info">Neutral</Button>
                      <Button onClick={() => setFeelingButton(FEELING_BUTTONS.GOOD)}
                              active={feelingButton === FEELING_BUTTONS.GOOD}
                              color="info">Good</Button>
                      <Button onClick={() => setFeelingButton(FEELING_BUTTONS.GOD_LIKE)}
                              active={feelingButton === FEELING_BUTTONS.GOD_LIKE}
                              color="info">God-like</Button>
                    </ButtonGroup>
                  </CardBody>

                  <CardBody>
                    <CardTitle className="text-center">
                      <h3>Did you stretch?</h3>
                    </CardTitle>
                    <ButtonGroup className="w-100">
                      <Button onClick={() => setYesNoButton(true)}
                              active={yesNoButton}
                              color="info">{t("Yes")}</Button>
                      <Button onClick={() => setYesNoButton(false)}
                              active={!yesNoButton}
                              color="info">{t("No")}</Button>
                    </ButtonGroup>
                  </CardBody>

                  {yesNoButton && <CardBody>
                    <CardTitle className="text-center">
                      <h3>How long did you stretch?</h3>
                    </CardTitle>
                    <DurationFormGroup name="totalStretchTimeSeconds" labelText={t("Total stretch time (HH MM SS)")} autoFocus/>
                  </CardBody>}

                  <CardFooter><ButtonGroup className="w-100 m-0 p-0">
                    <Button type="submit" color="primary" disabled={isSubmitting || !errors}>{t("Save")}</Button>
                    <Button color="danger">{t("Discard")}</Button>
                  </ButtonGroup>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Form>}
        </>
      )}
    />
  );
};

interface IDayQuestionnaireProps {
  show: boolean
}

enum FEELING_BUTTONS {
  WORST = 'worst',
  BAD = 'bad',
  NEUTRAL = 'neutral',
  GOOD = 'good',
  GOD_LIKE = 'god-like'
}

enum YES_NO_BUTTONS {
  YES = 'yes',
  NO = 'no'
}

export default DayQuestionnaire;
