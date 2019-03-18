import './Footer.scss';

import React from 'react';
import {Button, ButtonGroup, Col} from 'reactstrap';
import {withRoute} from 'react-router5';
import {routeNameAddDay, routeNameAllDays, routeNameRoot} from '../../routes';
import Logout from '../Logout/Logout';
import Row from 'reactstrap/es/Row';
import {useTranslation} from 'react-i18next';

const Footer = ({router}) => {
  const { t, i18n } = useTranslation();

  return (<Row className="footer container text-muted">
    <Col>
      <ButtonGroup className="w-100">
        <Button onClick={() => router.navigate(routeNameRoot, {}, {reload: true})}>{t("Home")}</Button>
        <Button onClick={() => router.navigate(routeNameAddDay, {}, {reload: true})}>{t("Add day")}</Button>
        <Button onClick={() => router.navigate(routeNameAllDays, {}, {reload: true})}>{t("All days")}</Button>
      </ButtonGroup>
    </Col>
    <Col>
      <ButtonGroup>
        <Button onClick={() => i18n.changeLanguage('sv')}>{t("SW")}</Button>
        <Button onClick={() => i18n.changeLanguage('en')}>{t("EN")}</Button>
      </ButtonGroup>
    </Col>
    <Col xs={12} lg={2}>
      <Logout/>
    </Col>
  </Row>);
};

export default withRoute(Footer);