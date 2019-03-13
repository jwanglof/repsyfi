import toString from 'lodash/toString';
import {allDays} from './DayMockData';

export const addNewDay = async dayData => {
  const uid = toString(dayData.uid ? dayData.uid : Math.floor(Math.random() * 15) + 1);
  allDays.push({
    startTimestamp: dayData.startTimestamp,
    endTimestamp: dayData.endTimestamp,
    location: dayData.location,
    muscleGroups: dayData.muscleGroups,
    uid,
    title: dayData.title,
    exercises: []
  });
  return await uid;
};
