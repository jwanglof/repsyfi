import isEmpty from 'lodash/isEmpty';
import firebase, {
  FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS,
  FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE,
  FIRESTORE_COLLECTION_SETS
} from '../../config/firebase';

export const addNewTimeDistanceAndGetUid = async (exerciseUid, ownerUid, timeDistanceData) => {
  const data = {};
  data.ownerUid = ownerUid;
  data.updated = Math.ceil(Date.now() / 1000);
  data.totalTimeSeconds = timeDistanceData.totalTimeSeconds;
  data.totalDistanceMeter = timeDistanceData.totalDistanceMeter;
  data.totalWarmupSeconds = timeDistanceData.totalWarmupSeconds;
  data.kcal = timeDistanceData.kcal;
  data.speedMin = timeDistanceData.speedMin;
  data.speedMax = timeDistanceData.speedMax;
  data.inclineMin = timeDistanceData.inclineMin;
  data.inclineMax = timeDistanceData.inclineMax;
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
    .doc(exerciseUid)
    .update(data);
};

export const getSpecificTimeDistanceExercise = async exerciseUid => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
    .doc(exerciseUid)
    .get()
    .then(querySnapshot => {
      if (!isEmpty(querySnapshot.data())) {
        return querySnapshot.data();
      } else {
        throw "Set data was empty!";
      }
    });
};

export const updateTimeDistanceExercise = async (exerciseUid, exerciseData) => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
    .doc(exerciseUid)
    .update(exerciseData);
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