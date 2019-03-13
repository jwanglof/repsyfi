import {allDays} from '../Day/DayMockData';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

export const getSpecificWorkout = async (workoutUid) => {
  let workout = {};
  await forEach(allDays, d => {
    forEach(d.workouts, w => {
      if (w.uid === workoutUid) {
        workout = w;
        return false;
      }
    })
  });
  return await workout;
};

export const addNewWorkout = async (workoutData, dayUid) => {
  const uid = workoutData.uid ? workoutData.uid : Math.floor(Math.random() * 150).toString();
  console.log("addNewWorkout", allDays, workoutData, dayUid, uid);
  const day = find(allDays, d => d.uid === dayUid);
  if (isEmpty(day)) {
    throw "NOOOO! NO DAY!";
  }
  workoutData.uid = uid;
  workoutData.sets = [];
  day.workouts.push(workoutData);
  return await uid;
};