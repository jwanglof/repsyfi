import React, {FunctionComponent} from 'react';
import {routeNode, withRouter} from 'react-router5';
import {Router, State} from 'router5';
import {Button, ButtonGroup, Col, Row} from 'reactstrap';
import {RouteNames} from '../../routes';
import SettingsPolarLink from './SettingsPolarLink';

const SettingsMenu: FunctionComponent<ISettingsMenuRouter & ISettingsMenu> = ({route, router}) => {
  const routeSplit = route.name.split('.');
  const topRouteName: string = routeSplit[0];
  const childRouteName: string = routeSplit[1];

  let shownChildComponent: any = undefined;

  console.log('Seeettings menu:::', topRouteName, childRouteName);

  const goToRoute = (name: string, data: object = {}) => {
    console.log('Goootoooo:', name, data);
    router.navigate(`${RouteNames.SETTINGS}.${name}`, data, {reload: true})
  };

  switch (childRouteName) {
    case RouteNames.SETTINGS_POLAR_LINK:
      shownChildComponent = <SettingsPolarLink/>;
      break;
    default:
      goToRoute(RouteNames.SETTINGS_POLAR_LINK);
  }

  return <Row>
    <Col xs={12}>
      <ButtonGroup className="w-100">
        <Button onClick={() => goToRoute(RouteNames.SETTINGS_POLAR_LINK)}>Polar link</Button>
      </ButtonGroup>
    </Col>
    <Col xs={12}>
      {shownChildComponent}
    </Col>
  </Row>;
};

interface ISettingsMenu {}

interface ISettingsMenuRouter {
  route: State,
  router: Router
}

export default routeNode<any>('settingsMenu')(withRouter(SettingsMenu));
