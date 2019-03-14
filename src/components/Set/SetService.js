import isEmpty from 'lodash/isEmpty';
import fb, {FIRESTORE_COLLECTION_EXERCISES, FIRESTORE_COLLECTION_SETS} from 'config/firebase';
import firebase from 'firebase';

export const addNewSet = async (setData, exerciseUid) => {
  const setDocRef = await fb.firestore().collection(FIRESTORE_COLLECTION_SETS).add(setData);
  const createdSetUid = setDocRef.id;
  await addSetToExerciseArray(createdSetUid, exerciseUid);
  return createdSetUid;
};

export const getSpecificSet = async setUid => {
  return await fb.firestore()
    .collection("sets")
    .doc(setUid)
    .get()
    .then(querySnapshot => {
      console.log(888, setUid, querySnapshot.data());
      if (!isEmpty(querySnapshot.data())) {
        return querySnapshot.data();
      } else {
        throw "Set data was empty!";
      }
    });
};

const addSetToExerciseArray = async (setUid, exerciseUid) => {
  return await fb.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .update({sets: firebase.firestore.FieldValue.arrayUnion(setUid)});
};