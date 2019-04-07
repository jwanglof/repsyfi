import firebase, {
  FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS,
  FIRESTORE_COLLECTION_SETS,
  getCurrentUsersUid
} from '../../config/firebase';
import {isEmpty} from "lodash";
import {ISetBasicModel, ISetModel, ISetModelWithoutUid} from '../../models/ISetModel';
import {getNowTimestamp, getSetErrorObject} from '../../config/FirebaseUtils';

export const deleteSet = async (setUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_SETS)
    .doc(setUid)
    .delete();
};

export const getSet = async (setUid: string): Promise<ISetModel> => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_SETS)
    .doc(setUid)
    .get()
    .then((querySnapshot: any) => {
      if (querySnapshot.exists && !isEmpty(querySnapshot.data())) {
        const data = querySnapshot.data();
        return {
          uid: data.id,
          ownerUid: data.ownerUid,
          createdTimestamp: data.createdTimestamp,
          index: data.index,
          amountInKg: data.amountInKg,
          reps: data.reps
        };
      } else {
        throw getSetErrorObject(setUid);
      }
    });
};

export const addNewSetAndGetUid = async (setData: ISetBasicModel, ownerUid: string): Promise<string> => {
  const data: ISetModelWithoutUid = {
    index: setData.index,
    amountInKg: setData.amountInKg,
    reps: setData.reps,
    ownerUid,
    createdTimestamp: getNowTimestamp()
  };
  const setDocRef = await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_SETS)
    .add(data);
  return setDocRef.id;
};

export const addSetToSetsRepsExerciseArray = async (setUid: string, exerciseUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
    .doc(exerciseUid)
    .update({sets: firebase.firestore.FieldValue.arrayUnion(setUid)});
};
