import './Footer.scss';

import React, {useState} from 'react';
import {
  Button,
  Col,
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Row
} from 'reactstrap';
import {withRoute} from 'react-router5';
import {routeNameAddDay, routeNameAllDays, routeNameRoot} from '../../routes';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import firebase from '../../config/firebase';
import Flag from 'react-country-flags';

const Footer = ({router}) => {
  const [collapsed, setCollapsed] = useState(true);
  const { t, i18n } = useTranslation();

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
    // this.setState({
    //   collapsed: !this.state.collapsed
    // });
  };

  const navigateToRoute = routeName => {
    toggleNavbar();
    router.navigate(routeName, {}, {reload: true})
  };

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

  return (
    <footer>
      <Navbar color="dark" fixed="bottom" dark>
        <NavbarBrand href="/" className="mr-auto">repsify</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <Row className="text-center">
                <Col>
                  <NavLink onClick={() => navigateToRoute(routeNameRoot)}>{t("Home")}</NavLink>
                </Col>
                <Col>
                  <NavLink onClick={() => navigateToRoute(routeNameAllDays)}>{t("All days")}</NavLink>
                </Col>
              </Row>
            </NavItem>
            <NavItem>
              <NavLink tag={Button} block onClick={() => navigateToRoute(routeNameAddDay)}>{t("Add new day")}</NavLink>
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
    </footer>
  );
};

export default withRoute(Footer);