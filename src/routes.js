export const routeNameRoot = "root";
export const routeNameSpecificDay = "specific-day";
export const routeNameAddDay = "add-day";
export const routeNameAddWorkoutToSpecificDay = "add-workout-to-specific-day";
export const routeNameAddSetToSpecificWorkout = "add-set-to-specific-workout";

export default [
  { name: routeNameRoot, path: '/' },
  { name: routeNameSpecificDay, path: '/day/:uid' },
  { name: routeNameAddDay, path: '/day/add' },
  { name: routeNameAddWorkoutToSpecificDay, path: '/day/:dayUid/addWorkout' },
  { name: routeNameAddSetToSpecificWorkout, path: '/workout/:workoutUid/addSet' },
];
