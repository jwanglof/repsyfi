import {allDays} from '../Day/DayMockData';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

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
  const uid = exerciseData.uid ? exerciseData.uid : Math.floor(Math.random() * 150).toString();
  console.log("addNewExercise", allDays, exerciseData, dayUid, uid);
  const day = find(allDays, d => d.uid === dayUid);
  if (isEmpty(day)) {
    throw "NOOOO! NO DAY!";
  }
  exerciseData.uid = uid;
  exerciseData.sets = [];
  day.exercises.push(exerciseData);
  return await uid;
};