import find from 'lodash/find';
import toString from 'lodash/toString';
import isEmpty from 'lodash/isEmpty';
import {allDays} from '../Day/DayMockData';

export const addNewSet = async (setData, dayUid, workoutUid) => {
  const uid = toString(setData.uid ? setData.uid : Math.floor(Math.random() * 150) + 1);
  const day = find(allDays, d => d.uid === dayUid);
  const workout = find(day.workouts, w => w.uid === workoutUid);
  if (isEmpty(workout)) {
    throw "NOOOO";
  }
  setData.uid = uid;
  workout.sets.push(setData);
  return await uid;
};
