import React, {FunctionComponent, useEffect, useState} from 'react';
import {Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row} from 'reactstrap';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Formik, FormikHelpers} from 'formik';
// @ts-ignore
import {Form} from 'react-formik-ui';
import DurationFormGroup from '../Formik/DurationFormGroup';
import {FEELING, IDayQuestionnaireBasicModelV1, IDayQuestionnaireModelV1} from '../../models/IDayQuestionnaireModel';
import {FirebaseCollectionNames, getCurrentUsersUid, retrieveErrorMessage} from '../../config/FirebaseUtils';
import {Router} from 'router5';
import {withRouter} from 'react-router5';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import {IDayModel} from '../../models/IDayModel';
import {addQuestionnaire, updateDayWithQuestionnaireUid, updateQuestionnaire} from './DayQuestionnaireService';
import firebase from '../../config/firebase';
import {isEmpty} from 'lodash';
import LoadingAlert from '../LoadingAlert/LoadingAlert';

const DayQuestionnaire: FunctionComponent<IDayQuestionnaireRouter & IDayQuestionnaireProps> = ({router, show, dayData}) => {
  const { t } = useTranslation();

  const [currentData, setCurrentData] = useState<IDayQuestionnaireModelV1 | undefined>(undefined);
  const [feelingButton, setFeelingButton] = useState<FEELING>(FEELING.NEUTRAL);
  const [yesNoButton, setYesNoButton] = useState<boolean>(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | undefined>(undefined);
  const [snapshotErrorData, setSnapshotErrorData] = useState<string | undefined>(undefined);

  const subscribeOnQuestionnaireAndSetData = (questionnaireUid: string) => {
    // TODO Need to verify that a user can't send any UID in here, somehow... That should be specified in the rules!
    return firebase.firestore()
      .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_QUESTIONNAIRE)
      // .where("ownerUid", "==", uid)
      .doc(questionnaireUid)
      .onSnapshot({includeMetadataChanges: true}, doc => {
        if (doc.exists && !isEmpty(doc.data())) {
          const snapshotData: any = doc.data();
          setCurrentData({
            ownerUid: snapshotData.ownerUid,
            uid: doc.id,
            createdTimestamp: snapshotData.createdTimestamp,
            version: snapshotData.version,
            totalStretchSeconds: snapshotData.totalStretchSeconds,
            stretched: snapshotData.stretched,
            feeling: snapshotData.feeling
          });
          setFeelingButton(snapshotData.feeling);
          setYesNoButton(snapshotData.stretched);
        }
      }, err => {
        console.error('error:', err);
        setSnapshotErrorData(err.message);
      });
  };

  useEffect(() => {
    const questionnaireUid: string | undefined = dayData.questionnaire;
    if (questionnaireUid) {
      const unsub = subscribeOnQuestionnaireAndSetData(questionnaireUid);

      // Unsubscribe on un-mount
      return () => {
        unsub();
      };
    }
  }, [dayData.questionnaire]);

  if (!show) return null;

  if (!isEmpty(dayData.questionnaire) && !currentData) {
    return <LoadingAlert componentName="DayQuestionnaire"/>;
  }

  if (submitErrorMessage || snapshotErrorData) {
    return <ErrorAlert componentName="DayQuestionnaire" errorText={submitErrorMessage || snapshotErrorData}/>;
  }

  const onSubmit = async (values: any, actions: FormikHelpers<any>) => {
    actions.setSubmitting(true);
    setSubmitErrorMessage(undefined);

    let totalStretchTimeSeconds = values.totalStretchSeconds;
    let yesNoButtonValue = yesNoButton;

    if (!yesNoButton) {
      totalStretchTimeSeconds = 0;
    }

    if (!totalStretchTimeSeconds && yesNoButton) {
      yesNoButtonValue = false;
    }

    try {
      const dayUid = router.getState().params.uid;
      const ownerUid: string = await getCurrentUsersUid();

      const data: IDayQuestionnaireBasicModelV1 = {
        feeling: feelingButton,
        stretched: yesNoButtonValue,
        totalStretchSeconds: totalStretchTimeSeconds
      };

      if (!currentData) {
        const questionnaireUid = await addQuestionnaire(data, ownerUid);
        await updateDayWithQuestionnaireUid(dayUid, questionnaireUid);
        subscribeOnQuestionnaireAndSetData(questionnaireUid);
      } else {
        const questionnaireUid = currentData.uid;
        await updateQuestionnaire(data, questionnaireUid);
      }
    } catch (e) {
      console.error(e);
      setSubmitErrorMessage(retrieveErrorMessage(e));
    }

    actions.setSubmitting(false);
  };

  let initialValues;
  if (currentData) {
    initialValues = currentData;
  } else {
    initialValues = {totalStretchSeconds: 0};
  }

  const buttonText = (!currentData ? t("Save") : t("Update")) + ` ${t("questionnaire")}`;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      render={({errors, isSubmitting}) => (
        <>
          {isSubmitting && <div className="text-center"><FontAwesomeIcon icon="spinner" spin/></div>}
          {!isSubmitting && <Form mode='structured'>
            <Row>
              <Col className="mt-3" xs={12}>
                <Card>
                  <CardHeader className="text-center pt-0 pb-0">
                    <h1 className="exercise--title mb-0">{t("Exercise questionnaire")}</h1>
                  </CardHeader>

                  <CardBody>
                    <CardTitle className="text-center">
                      <h3>{t("How did the workout feel?")}</h3>
                    </CardTitle>
                    <Row>
                      <ButtonGroup className="mx-auto">
                        <Button onClick={() => setFeelingButton(FEELING.WORST)}
                                active={feelingButton === FEELING.WORST}
                                color="info">{t("Worst")}</Button>
                        <Button onClick={() => setFeelingButton(FEELING.BAD)}
                                active={feelingButton === FEELING.BAD}
                                color="info">{t("Bad")}</Button>
                        <Button onClick={() => setFeelingButton(FEELING.NEUTRAL)}
                                active={feelingButton === FEELING.NEUTRAL}
                                color="info">{t("Neutral")}</Button>
                        <Button onClick={() => setFeelingButton(FEELING.GOOD)}
                                active={feelingButton === FEELING.GOOD}
                                color="info">{t("Good")}</Button>
                        <Button onClick={() => setFeelingButton(FEELING.GOD_LIKE)}
                                active={feelingButton === FEELING.GOD_LIKE}
                                color="info">{t("God-like")}</Button>
                      </ButtonGroup>
                    </Row>
                  </CardBody>

                  <CardBody>
                    <CardTitle className="text-center">
                      <h3>{t("Did you stretch?")}</h3>
                    </CardTitle>
                    <Row>
                      <ButtonGroup className="mx-auto w-100">
                        <Button onClick={() => setYesNoButton(true)}
                                active={yesNoButton}
                                color="info">{t("Yes")}</Button>
                        <Button onClick={() => setYesNoButton(false)}
                                active={!yesNoButton}
                                color="info">{t("No")}</Button>
                      </ButtonGroup>
                    </Row>
                  </CardBody>

                  {yesNoButton && <CardBody>
                    <CardTitle className="text-center">
                      <h3>{t("How long did you stretch?")}</h3>
                    </CardTitle>
                    <DurationFormGroup name="totalStretchSeconds" labelText={`${t("Total stretch time")} ${t("(HH MM SS)")}`} autoFocus/>
                  </CardBody>}

                  <CardFooter>
                    <Button type="submit" color="primary" disabled={isSubmitting || !errors} block>
                      {buttonText}
                    </Button>
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
  show: boolean,
  dayData: IDayModel
}

interface IDayQuestionnaireRouter {
  router: Router
}

export default withRouter(DayQuestionnaire);
