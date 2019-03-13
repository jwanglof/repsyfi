import {allDays} from '../Day/DayMockData';
import forEach from 'lodash/forEach';
import fb from 'config/firebase';
import cuid from 'cuid';
import firebase from 'firebase/app';

export const getSpecificExercise = async (exerciseUid) => {
  let exercise = {};
  await forEach(allDays, d => {
    forEach(d.exercises, e => {
      if (e.uid === exerciseUid) {
        exercise = e;
        return false;
      }
    })
  });
  return await exercise;
};

export const addNewExercise = async (exerciseData, dayUid) => {
  exerciseData.uid = cuid();
  exerciseData.sets = [];
  await fb.firestore()
    .collection("days")
    .doc(dayUid)
    .update({
      exercises: firebase.firestore.FieldValue.arrayUnion(exerciseData)
    });
  return await exerciseData.uid;
};