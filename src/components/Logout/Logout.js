import React from 'react';
import {routeNameRoot} from '../../routes';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {withRoute} from 'react-router5';
import firebase from '../../config/firebase';
import {Button} from 'reactstrap';
import {useTranslation} from 'react-i18next';

const Logout = ({ router }) => {
  const { t } = useTranslation();

  const signOut = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log('WOWOWOWOWPP');
      router.navigate(routeNameRoot, {}, {reload: true});
    }).catch(function(error) {
      // An error happened.
      console.error(error);
    });
  };

  return <Button block onClick={signOut}>
    <FontAwesomeIcon icon="sign-out-alt"/>
    <span className="ml-1">{t("Sign out")}</span>
  </Button>;
};

export default withRoute(Logout);