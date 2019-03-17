import React from 'react';
import {Button, Col, Row} from 'reactstrap';
import firebase from '../../config/firebase';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const Login = ({}) => {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  const uiConfig = {
    signInFlow: 'redirect',
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        console.log(111, authResult);
        const { credential: { accessToken }, additionalUserInfo: { profile: { email, given_name, picture } } } = authResult;

        console.log(444, accessToken, email, given_name, picture);
        return false;
      },
    },
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
  };

  return (
    <Row>
      <Col xs={12}>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      </Col>
    </Row>
  );
};

export default Login;