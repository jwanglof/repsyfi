import {Route} from 'router5';

export const routeNameRoot: string = "root";
export const routeNameAllDays: string = "all-days";
export const routeNameSpecificDay: string = "specific-day";
export const routeNameAddDay: string = "add-day";
export const routeNameEditDay: string = "edit-day";
export const routeNameLogout: string = "logout";

const routes: Route[] = [
  { name: routeNameRoot, path: '/' },
  { name: routeNameAllDays, path: '/days' },
  { name: routeNameSpecificDay, path: '/day/:uid' },
  { name: routeNameAddDay, path: '/day/add' },
  { name: routeNameEditDay, path: '/day/edit?:dayUid' },
  { name: routeNameLogout, path: '/logout' },
];
export default routes;
