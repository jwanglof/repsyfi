import isEmpty from 'lodash/isEmpty';
import firebase, {
  FIRESTORE_COLLECTION_DAYS,
  FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS,
  FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE,
  FIRESTORE_COLLECTION_EXERCISES
} from '../../config/firebase';
// import {deleteSet} from '../Set/SetService';
// import {getSpecificDayFromUid, updateDay} from '../Day/DayService';

// export const getSpecificExercise = async exerciseUid => {
//   const querySnapshot = await firebase.firestore()
//     .collection(FIRESTORE_COLLECTION_EXERCISES)
//     .doc(exerciseUid)
//     .get();
//   if (!isEmpty(querySnapshot.data())) {
//     const exerciseData = querySnapshot.data();
//     exerciseData.uid = querySnapshot.id;
//     return exerciseData;
//   } else {
//     throw "Exercise data was empty!";
//   }
// };

export const getSpecificTimeDistanceExercise = async exerciseUid => {
  const querySnapshot = await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
    .doc(exerciseUid)
    .get();
  if (!isEmpty(querySnapshot.data())) {
    const exerciseData = querySnapshot.data();
    exerciseData.uid = querySnapshot.id;
    return exerciseData;
  } else {
    throw {message: "Exercise data was empty!"};
  }
};

// export const getSpecificSetsRepsExercise = async exerciseUid => {
//   const querySnapshot = await firebase.firestore()
//     .collection(FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
//     .doc(exerciseUid)
//     .get();
//   if (!isEmpty(querySnapshot.data())) {
//     const exerciseData = querySnapshot.data();
//     exerciseData.uid = querySnapshot.id;
//     return exerciseData;
//   } else {
//     throw {message: "Exercise data was empty!"};
//   }
// };

// // export const addNewSetsRepsExerciseAndGetUid = async (exerciseData, dayUid) => {
// export const addNewSetsRepsExerciseAndGetUid = async (ownerUid) => {
//   // exerciseData.sets = [];
//   const setsRepsData = {sets: [], ownerUid, created: Math.ceil(Date.now() / 1000)};
//   const exerciseSetsRepsDocRef = await firebase.firestore()
//     .collection(FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
//     .add(setsRepsData);
//   // await addExerciseToDayArray(createdExerciseUid, dayUid);
//   return exerciseSetsRepsDocRef.id;
//   // return 'lol';
//   // return await _addExercise(exerciseData, dayUid);
// };
//
// // export const addNewTimeDistanceExerciseAndGetUid = async (exerciseData, dayUid) => {
// export const addNewTimeDistanceExerciseAndGetUid = async (ownerUid) => {
//   const timeDistanceData = {};
//   timeDistanceData.totalTimeSeconds = 0;
//   timeDistanceData.totalDistanceMeter = 0;
//   timeDistanceData.totalWarmupSeconds = 0;
//   timeDistanceData.kcal = 0;
//   timeDistanceData.speedMin = 0;
//   timeDistanceData.speedMax = 0;
//   timeDistanceData.inclineMin = 0;
//   timeDistanceData.inclineMax = 0;
//   timeDistanceData.ownerUid = ownerUid;
//   console.log(timeDistanceData);
//   const exerciseSetsRepsDocRef = await firebase.firestore()
//     .collection(FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
//     .add(timeDistanceData);
//   // await addExerciseToDayArray(createdExerciseUid, dayUid);
//   return exerciseSetsRepsDocRef.id;
//   // return await _addExercise(exerciseData, dayUid);
// };

// export const addExerciseAndGetUid = async (exerciseData, ownerUid) => {
//   exerciseData.ownerUid = ownerUid;
//   exerciseData.created = Math.ceil(Date.now() / 1000);
//   const exerciseDocRef = await firebase.firestore()
//     .collection(FIRESTORE_COLLECTION_EXERCISES)
//     .add(exerciseData);
//   return exerciseDocRef.id;
// };
//
// export const addExerciseToDayArray = async (exerciseUid, dayUid) => {
//   return await firebase.firestore()
//     .collection(FIRESTORE_COLLECTION_DAYS)
//     .doc(dayUid)
//     .update({exercises: firebase.firestore.FieldValue.arrayUnion(exerciseUid)});
// };

// export const deleteExerciseAndRemoveFromDay = async (exerciseUid, dayUid=null) => {
//   // Delete the exercise from the day it belonged to
//   if (dayUid !== null) {
//     const dayData = await getSpecificDayFromUid(dayUid);
//     const exerciseIndexInDay = dayData.exercises.indexOf(exerciseUid);
//     dayData.exercises.splice(exerciseIndexInDay, 1);
//     const dayExerciseData = {exercises: dayData.exercises};
//     await updateDay(dayUid, dayExerciseData);
//   }
//   return await deleteExercise(exerciseUid);
// };

// export const deleteExercise = async exerciseUid => {
//   const exerciseData = await getSpecificExercise(exerciseUid);
//   // Remove all sets that exist on the exercise
//   if (exerciseData.sets.length) {
//     await Promise.all(exerciseData.sets.map(setUid => deleteSet(setUid)));
//   }
//   return await firebase.firestore()
//     .collection(FIRESTORE_COLLECTION_EXERCISES)
//     .doc(exerciseUid)
//     .delete();
// };

// export const updateExercise = async (exerciseUid, exerciseData) => {
//   return await firebase.firestore()
//     .collection(FIRESTORE_COLLECTION_EXERCISES)
//     .doc(exerciseUid)
//     .update(exerciseData);
// };