import './StartPage.scss';

import React, {FunctionComponent, useState} from 'react';
import {Col, Row} from 'reactstrap';
import firebase from '../../config/firebase';
// @ts-ignore
import Flag from 'react-country-flags';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import {useTranslation} from 'react-i18next';
import useInterval from '../../utils/useInterval';
import Instructions from './Instructions';

const StartPage: FunctionComponent<ILoginProps> = ({userSignedIn, userDetails}) => {
  const { t, i18n } = useTranslation();

  const featureList: Array<string> = [
    t("Track your sets and repetitions"),
    t("Track your cardio machines"),
    t("Know how long you ran last time"),
    t("See how long you've been exercising"),
    t("Know how long your rest has been"),
    t("Know what you lifted last time"),
    t("Know how fast you ran last time"),
  ];

  const [currentFeatureIndex, setCurrentFeatureIndex] = useState<number>(0);

  const durationCb = () => {
    if (!userSignedIn) {
      // Change the feature shown
      let index = currentFeatureIndex + 1;
      if (index > featureList.length - 1) {
        index = 0;
      }
      setCurrentFeatureIndex(index);
    }
  };
  useInterval(durationCb, 2000);

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  const uiConfig = {
    signInFlow: 'redirect',
    callbacks: {
      signInSuccessWithAuthResult: (authResult: any) => {
        // console.log(111, authResult);
        // const { credential: { accessToken }, additionalUserInfo: { profile: { email, given_name, picture } } } = authResult;
        // console.log(444, accessToken, email, given_name, picture);
        return false;
      },
    },
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
  };

  return (<>
    <Row className="mt-2">
      <Col xs={12} className="text-center">
        <h1 className="display-1 start-page--title">Repsify</h1>
      </Col>
    </Row>

    <Row className="mt-4">
      <Col xs={6} className="text-right">
        <div onClick={() => i18n.changeLanguage('sv')}>
          <span className="align-middle">{t("SW")}</span>
          <Flag country="se" asSquare={true} height="0.3in" className="ml-1"/>
        </div>
      </Col>
      <Col xs={6}>
        <div onClick={() => i18n.changeLanguage('en')}>
          <Flag country="gb" asSquare={true} height="0.3in" className="mr-1" />
          <span className="align-middle">{t("EN")}</span>
        </div>
      </Col>
    </Row>

    <Row className="mt-5 text-center">
      <Col>
        <h2 className="lead text-uppercase"><small>{t("Welcome to your")}</small></h2>
        <h3 className="display-4 text-capitalize">{t("exercise diary")}</h3>
      </Col>
    </Row>

    {!userSignedIn && <><Row className="mt-5 text-center">
      <Col xs={12}>
        <blockquote className="blockquote">
          {t("This application will help you to")}:
        </blockquote>
      </Col>
      <Col xs={12}>
        <ul className="list-unstyled" style={{height: '24px'}}>
          <li>{featureList[currentFeatureIndex]}</li>
        </ul>
      </Col>
    </Row>
    <Row className="mt-3">
      <Col xs={12}>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      </Col>
    </Row></>}

    {userSignedIn && <Row className="mt-3"><Col><Instructions userDetails={userDetails}/></Col></Row>}

    {/*<Row className="text-center fixed-bottom mb-1">*/}
    {/*  <Col xs={12}>*/}
    {/*    <h1><Link routeName={RouteNames.FAQ} routeOptions={{reload: true}}>FAQ</Link></h1>*/}
    {/*  </Col>*/}
    {/*</Row>*/}
  </>);
};

interface ILoginProps {
  userSignedIn: boolean,
  userDetails: firebase.User | undefined
}

export default StartPage;