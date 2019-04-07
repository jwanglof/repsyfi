import firebase from './firebase';

export const getCurrentUsersUid = async (): Promise<string> => {
  const currentUser = await firebase.auth().currentUser;
  // TODO How do I make sure that currentUser isn't empty?
  // @ts-ignore
  return currentUser.uid;
};

// TODO Move! To a context, perhaps?
export const getNowTimestamp = (): number => Math.ceil(Date.now() / 1000);
export const getDayErrorObject = (dayUid: string): object => _getErrorObject(dayUid, "Day");
export const getExerciseErrorObject = (dayUid: string): object => _getErrorObject(dayUid, "Exercise");
export const getSetErrorObject = (dayUid: string): object => _getErrorObject(dayUid, "Set");
const _getErrorObject = (uid: string, type: string): object => ({message: `${type} (uid: ${uid}) did not exist/had no data!`});
