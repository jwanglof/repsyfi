import {Route} from 'router5';

export enum RouteNames {
  ROOT = 'root',
  ALL_DAYS = 'all-days',
  SPECIFIC_DAY = 'specific-day',
  ADD_DAY = 'add-day',
  EDIT_DAY = 'edit-day',
  LOGOUT = 'logout',
  DASHBOARD = 'dashboard',
  FAQ = 'faq',
  SETTINGS = 'settings',
  SETTINGS_POLAR_LINK = 'settings-polar-link',
  POLAR_LINK_REDIRECT = 'polar-access-link-callback',
}

const routes: Route[] = [
  { name: RouteNames.ROOT, path: '/' },
  { name: RouteNames.ALL_DAYS, path: '/days' },
  { name: RouteNames.SPECIFIC_DAY, path: '/day/:uid' },
  { name: RouteNames.ADD_DAY, path: '/day/add' },
  { name: RouteNames.EDIT_DAY, path: '/day/edit?:dayUid' },
  { name: RouteNames.LOGOUT, path: '/logout' },
  { name: RouteNames.FAQ, path: '/faq' },
  { name: RouteNames.SETTINGS, path: '/settings', children: [
      { name: RouteNames.SETTINGS_POLAR_LINK, path: '/polar-link' },
    ]
  },
  { name: RouteNames.POLAR_LINK_REDIRECT, path: '/polaraccesslinkcallback' }
];

export default routes;
