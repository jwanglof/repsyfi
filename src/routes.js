export const routeNameRoot = "root";
export const routeNameAllDays = "all-days";
export const routeNameSpecificDay = "specific-day";
export const routeNameAddDay = "add-day";
export const routeNameAddExerciseToSpecificDay = "add-exercise-to-specific-day";
export const routeNameAddSetToSpecificExercise = "add-set-to-specific-exercise";
export const routeNameLogout = "logout";

export default [
  { name: routeNameRoot, path: '/' },
  { name: routeNameAllDays, path: '/days' },
  { name: routeNameSpecificDay, path: '/day/:uid' },
  { name: routeNameAddDay, path: '/day/add' },
  { name: routeNameAddExerciseToSpecificDay, path: '/day/:dayUid/addExercise' },
  { name: routeNameAddSetToSpecificExercise, path: '/exercise/:exerciseUid/addSet' },
  { name: routeNameLogout, path: '/logout' },
];
