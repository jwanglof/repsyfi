import toString from 'lodash/toString';
import {allDays} from './DayMockData';
import firebase from '../../config/firebase';
import subDays from 'date-fns/subDays';
import getUnixTime from 'date-fns/getUnixTime';

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

export const getAllDays = async () => {
  const days = [];
  const sub10DaysTimestamp = getUnixTime(subDays(new Date(), 10));
  return firebase.firestore()
    .collection("days")
    .where("startTimestamp", ">=", sub10DaysTimestamp)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(a => {
        console.log(555, a.data(), a.id);
        days.push({...a.data(), uid: a.id});
      });
      console.log(1112, days);
      return days;
    })
    .catch(err => {
      console.error(err);
    });
};

export const getSpecificDayFromUid = async uid => {
  return firebase.firestore()
    .collection("days")
    .doc(uid)
    .get()
    .then(querySnapshot => {
      return {...querySnapshot.data(), uid};
    })
    .catch(err => {
      console.error(err);
    });
};
