import firebase from './firebase';

export const getCurrentUsersUid = async (): Promise<string> => {
  const currentUser = await firebase.auth().currentUser;
  // TODO How do I make sure that currentUser isn't empty?
  // @ts-ignore
  return currentUser.uid;
};

export enum FirebaseCollectionNames {
  FIRESTORE_COLLECTION_EXERCISES = "exercises",
  FIRESTORE_COLLECTION_DAYS = "days",
  FIRESTORE_COLLECTION_SETS = "sets",
  FIRESTORE_COLLECTION_SETS_SECONDS = "sets-seconds",
  FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS = "exercises-sets-reps",
  FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS = "exercises-sets-seconds",
  FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE = "exercises-time-distance"
}

export const getNowTimestamp = (): number => Math.ceil(Date.now() / 1000);
export const getDayErrorObject = (dayUid: string): object => _getErrorObject(dayUid, "Day");
export const getExerciseErrorObject = (dayUid: string): object => _getErrorObject(dayUid, "Exercise");
export const getTimeDistanceExerciseErrorObject = (dayUid: string): object => _getErrorObject(dayUid, "TimeDistance Exercise");
export const getSetsRepsExerciseErrorObject = (dayUid: string): object => _getErrorObject(dayUid, "SetsReps Exercise");
export const getSetsSecondsExerciseErrorObject = (dayUid: string): object => _getErrorObject(dayUid, "SetsSeconds Exercise");
export const getSetErrorObject = (dayUid: string): object => _getErrorObject(dayUid, "Set");
const _getErrorObject = (uid: string, type: string): object => ({message: `${type} (uid: ${uid}) did not exist/had no data!`});

export const _getErrorObjectCustomMessage = (uid: string, type: string, message: string): object => ({message: `${type} (uid: ${uid}): ${message}`});
