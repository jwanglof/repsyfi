import subDays from 'date-fns/subDays';
import getUnixTime from 'date-fns/getUnixTime';
import firebase, {FIRESTORE_COLLECTION_DAYS, getCurrentUsersUid} from '../../config/firebase';
import {deleteExercise} from '../Exercise/ExerciseService';

export const addNewDay = async dayData => {
  dayData.ownerUid = await getCurrentUsersUid();
  dayData.created = Math.ceil(Date.now() / 1000);
  const dayDocRef = await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .add(dayData);
  return dayDocRef.id;
};

export const getAllDays10DaysBackInTime = async () => {
  const sub10DaysTimestamp = getUnixTime(subDays(new Date(), 100));
  const ownerUid = await getCurrentUsersUid();
  return firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .where("startTimestamp", ">=", sub10DaysTimestamp)
    .where("ownerUid", "==", ownerUid)
    .get()
    .then(querySnapshot => {
      const days = [];
      querySnapshot.forEach(a => {
        days.push({...a.data(), uid: a.id});
      });
      return days;
    });
};

export const getSpecificDayFromUid = async uid => {
  return firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .doc(uid)
    .get()
    .then(querySnapshot => {
      return {...querySnapshot.data(), uid};
    })
    .catch(err => {
      console.error(err);
    });
};

export const deleteDay = async dayUid => {
  const dayData = await getSpecificDayFromUid(dayUid);
  // Remove all exercises that exist on the day
  if (dayData.exercises.length) {
    await Promise.all(dayData.exercises.map(exerciseUid => deleteExercise(exerciseUid)));
  }
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .delete();
};

export const endDayNow = async dayUid => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .update({
      endTimestamp: Math.ceil(Date.now() / 1000)
    });
};

export const updateDay = async (dayUid, dayData) => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .update(dayData);
};
