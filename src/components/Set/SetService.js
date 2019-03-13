import find from 'lodash/find';
import toString from 'lodash/toString';
import isEmpty from 'lodash/isEmpty';
import {allDays} from '../Day/DayMockData';

export const addNewSet = async (setData, dayUid, exerciseUid) => {
  const uid = toString(setData.uid ? setData.uid : Math.floor(Math.random() * 150) + 1);
  const day = find(allDays, d => d.uid === dayUid);
  const exercise = find(day.exercises, w => w.uid === exerciseUid);
  if (isEmpty(exercise)) {
    throw "NOOOO";
  }
  setData.uid = uid;
  exercise.sets.push(setData);
  return await uid;
};
