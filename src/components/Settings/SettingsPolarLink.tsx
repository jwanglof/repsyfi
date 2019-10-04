import React, {FunctionComponent} from 'react';
import {withRouter} from 'react-router5';
import {Router} from 'router5';

const POLAR_CLIENT_ID = '26f37b8e-5cdb-4cb6-b278-382838ce4299';
const POLAR_REDIRECT_URI = 'http://r.jwanglof.se/#/polaraccesslinkcallback';
const getPolarOauth2Url = () => `https://flow.polar.com/oauth2/authorization?response_type=code&client_id=${POLAR_CLIENT_ID}&redirect_uri=${POLAR_REDIRECT_URI}`;

const SettingsPolarLink: FunctionComponent<ISettingsPolarLinkRouter & ISettingsPolarLink> = ({router}) => {
  return <>
    Polar link! <a href={getPolarOauth2Url()} target="_blank">Auth</a>
  </>;
};

interface ISettingsPolarLink {}

interface ISettingsPolarLinkRouter {
  router: Router
}

export default withRouter(SettingsPolarLink);
