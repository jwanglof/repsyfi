import './Footer.scss';

import React, {FunctionComponent, useState} from 'react';
import {Button, Col, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Row} from 'reactstrap';
import {RouteNames} from '../../routes';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useTranslation} from 'react-i18next';
import firebase from '../../config/firebase';
import {Router} from 'router5';
import {withRouter} from 'react-router5';
// @ts-ignore
import Flag from 'react-country-flags';
import FooterDurationTimer from './FooterDurationTimer';
import {useGlobalState} from '../../state';

const Footer: FunctionComponent<IFooterRouter & IFooterProps> = ({router}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [timerRunning, setTimerRunning] = useGlobalState('timerRunning');

  const { t, i18n } = useTranslation();

  const toggleNavbar = (): void => setCollapsed(!collapsed);

  const navigateToRoute = (routeName: string) => {
    toggleNavbar();
    router.navigate(routeName, {}, {reload: true})
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        router.navigate(RouteNames.ROOT, {}, {reload: true});
      })
      .catch(function(error) {
        // An error happened.
        console.error(error);
      });
  };

  return (<footer>
    <Navbar color="dark" fixed="bottom" dark>
      <NavbarBrand href="/" className="mr-auto">
        repsify <FooterDurationTimer/>
      </NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} className="mr-2" />
      <Collapse isOpen={!collapsed} navbar>
        <Nav navbar>
          <NavItem>
            <Row className="text-center">
              <Col>
                <NavLink onClick={() => navigateToRoute(RouteNames.ROOT)}>{t("Home")}</NavLink>
              </Col>
              <Col>
                <NavLink onClick={() => navigateToRoute(RouteNames.ALL_DAYS)}>{t("All days")}</NavLink>
              </Col>
            </Row>
          </NavItem>
          <NavItem>
            <NavLink tag={Button} block onClick={() => navigateToRoute(RouteNames.ADD_DAY)}>{t("Add new day")}</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Button} block onClick={() => setTimerRunning(!timerRunning)}>{timerRunning ? t("Stop timer") : t("Start timer")}</NavLink>
          </NavItem>
          <NavItem>
            <Row className="text-center">
              <Col>
                <NavLink onClick={() => i18n.changeLanguage('sv')}>
                  <Flag country="se" asSquare={true} height="0.3in" className="mr-1" />
                  <span className="align-middle">{t("SW")}</span>
                </NavLink>
              </Col>
              <Col>
                <NavLink onClick={() => i18n.changeLanguage('en')}>
                  <Flag country="gb" asSquare={true} height="0.3in" className="mr-1" />
                  <span className="align-middle">{t("EN")}</span>
                </NavLink>
              </Col>
            </Row>
          </NavItem>
          <NavItem>
            <Row className="text-center">
              <Col>
                <NavLink href="https://github.com/jwanglof/repsyfi" target="_blank">
                  GitHub <FontAwesomeIcon icon="external-link-alt"/>
                </NavLink>
              </Col>
              <Col>
                <NavLink onClick={signOut}>
                  <FontAwesomeIcon icon="sign-out-alt"/> {t("Sign out")}
                </NavLink>
              </Col>
            </Row>
          </NavItem>
          <NavItem>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  </footer>);
};

interface IFooterProps {}

interface IFooterRouter {
  router: Router
}

export default withRouter(Footer);