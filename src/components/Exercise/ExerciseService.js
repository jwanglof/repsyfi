import isEmpty from 'lodash/isEmpty';
import firebase, {FIRESTORE_COLLECTION_DAYS, FIRESTORE_COLLECTION_EXERCISES, getCurrentUsersUid} from '../../config/firebase';
import {deleteSet} from '../Set/SetService';
import {getSpecificDayFromUid, updateDay} from '../Day/DayService';

export const getSpecificExercise = async exerciseUid => {
  const querySnapshot = await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .get();
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
  exerciseData.ownerUid = await getCurrentUsersUid();
  exerciseData.created = Math.ceil(Date.now() / 1000);
  const exerciseDocRef = await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISES)
    .add(exerciseData);
  const createdExerciseUid = exerciseDocRef.id;
  await addExerciseToDayArray(createdExerciseUid, dayUid);
  return createdExerciseUid;
};

const addExerciseToDayArray = async (exerciseUid, dayUid) => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .update({exercises: firebase.firestore.FieldValue.arrayUnion(exerciseUid)});
};

export const deleteExerciseAndRemoveFromDay = async (exerciseUid, dayUid=null) => {
  // Delete the exercise from the day it belonged to
  if (dayUid !== null) {
    const dayData = await getSpecificDayFromUid(dayUid);
    const exerciseIndexInDay = dayData.exercises.indexOf(exerciseUid);
    dayData.exercises.splice(exerciseIndexInDay, 1);
    const dayExerciseData = {exercises: dayData.exercises};
    await updateDay(dayUid, dayExerciseData);
  }
  return await deleteExercise(exerciseUid);
};

export const deleteExercise = async exerciseUid => {
  const exerciseData = await getSpecificExercise(exerciseUid);
  // Remove all sets that exist on the exercise
  if (exerciseData.sets.length) {
    await Promise.all(exerciseData.sets.map(setUid => deleteSet(setUid)));
  }
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .delete();
};

export const updateExercise = async (exerciseUid, exerciseData) => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .update(exerciseData);
};