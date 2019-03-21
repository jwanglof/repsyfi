export const routeNameRoot = "root";
export const routeNameAllDays = "all-days";
export const routeNameSpecificDay = "specific-day";
export const routeNameAddDay = "add-day";
export const routeNameEditDay = "edit-day";
export const routeNameLogout = "logout";

export default [
  { name: routeNameRoot, path: '/' },
  { name: routeNameAllDays, path: '/days' },
  { name: routeNameSpecificDay, path: '/day/:uid' },
  { name: routeNameAddDay, path: '/day/add' },
  { name: routeNameEditDay, path: '/day/edit?:dayUid' },
  { name: routeNameLogout, path: '/logout' },
];
