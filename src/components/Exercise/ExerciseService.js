import isEmpty from 'lodash/isEmpty';
import fb, {FIRESTORE_COLLECTION_DAYS, FIRESTORE_COLLECTION_EXERCISES} from 'config/firebase';
import firebase from 'firebase/app';

export const getSpecificExercise = async exerciseUid => {
  const querySnapshot = await fb.firestore().collection(FIRESTORE_COLLECTION_EXERCISES).doc(exerciseUid).get();
  if (!isEmpty(querySnapshot.data())) {
    const exerciseData = querySnapshot.data();
    exerciseData.uid = querySnapshot.id;
    return exerciseData;
  } else {
    throw "Exercise data was empty!";
  }
};

export const addNewExercise = async (exerciseData, dayUid) => {
  exerciseData.sets = [];
  const exerciseDocRef = await fb.firestore().collection(FIRESTORE_COLLECTION_EXERCISES).add(exerciseData);
  const createdExerciseUid = exerciseDocRef.id;
  await addExerciseToDayArray(createdExerciseUid, dayUid);
  return createdExerciseUid;
};

const addExerciseToDayArray = async (exerciseUid, dayUid) => {
  return await fb.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .update({exercises: firebase.firestore.FieldValue.arrayUnion(exerciseUid)});
};
