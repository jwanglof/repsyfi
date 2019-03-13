export const routeNameRoot = "root";
export const routeNameSpecificDay = "specific-day";
export const routeNameAddDay = "add-day";
export const routeNameAddExerciseToSpecificDay = "add-exercise-to-specific-day";
export const routeNameAddSetToSpecificExercise = "add-set-to-specific-exercise";

export default [
  { name: routeNameRoot, path: '/' },
  { name: routeNameSpecificDay, path: '/day/:uid' },
  { name: routeNameAddDay, path: '/day/add' },
  { name: routeNameAddExerciseToSpecificDay, path: '/day/:dayUid/addExercise' },
  { name: routeNameAddSetToSpecificExercise, path: '/exercise/:exerciseUid/addSet' },
];
