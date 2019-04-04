import isEmpty from 'lodash/isEmpty';
import firebase, {
  FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS,
  FIRESTORE_COLLECTION_SETS,
  getCurrentUsersUid
} from '../../config/firebase';

export const addNewSetAndGetUid = async setData => {
  setData.ownerUid = await getCurrentUsersUid();
  setData.created = Math.ceil(Date.now() / 1000);
  const setDocRef = await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_SETS)
    .add(setData);
  return setDocRef.id;
};

export const getSpecificSet = async setUid => {
  return await firebase.firestore()
    .collection("sets")
    .doc(setUid)
    .get()
    .then(querySnapshot => {
      if (!isEmpty(querySnapshot.data())) {
        return querySnapshot.data();
      } else {
        throw "Set data was empty!";
      }
    });
};

export const addSetToSetsRepsExerciseArray = async (setUid, exerciseUid) => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
    .doc(exerciseUid)
    .update({sets: firebase.firestore.FieldValue.arrayUnion(setUid)});
};

export const deleteSet = async setUid => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_SETS)
    .doc(setUid)
    .delete();
};