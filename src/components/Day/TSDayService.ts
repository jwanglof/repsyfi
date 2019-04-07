import {IDayBasicModel, IDayModel, IDayModelWithoutUid} from '../../models/IDayModel';
import firebase, {FIRESTORE_COLLECTION_DAYS, getCurrentUsersUid} from '../../config/firebase';
import {deleteExercise} from '../Exercise/TSExerciseService';
import {isEmpty} from 'lodash';
import {getDayErrorObject, getNowTimestamp} from '../../config/FirebaseUtils';
import getUnixTime from "date-fns/getUnixTime";
import subDays from "date-fns/subDays";

export const getDay = async (dayUid: string): Promise<IDayModel> => {
  return firebase
    .firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .get()
    .then((querySnapshot: any) => {
      if (querySnapshot.exists && !isEmpty(querySnapshot.data())) {
        const data = querySnapshot.data()!;
        return {
          startTimestamp: data.startTimestamp,
          endTimestamp: data.endTimestamp,
          location: data.location,
          muscleGroups: data.muscleGroups,
          title: data.title,
          notes: data.notes,
          exercises: data.exercises,
          uid: querySnapshot.id,
          ownerUid: data.ownerUid,
          createdTimestamp: data.createdTimestamp
        };
      } else {
        throw getDayErrorObject(dayUid);
      }
    });
};

export const deleteDay = async (dayUid: string): Promise<void> => {
  const dayData = await getDay(dayUid);
  // Remove all exercises that exist on the day
  if (dayData.exercises.length) {
    await Promise.all(dayData.exercises.map(exerciseUid => deleteExercise(exerciseUid)));
  }
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .delete();
};

export const endDayNow = async (dayUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .update({
      endTimestamp: Math.ceil(Date.now() / 1000)  // TODO Can I use IDayModel somehow?
    });
};

export const addDay = async (dayData: IDayBasicModel, ownerUid: string): Promise<string> => {
  const data: IDayModelWithoutUid = {
    location: dayData.location,
    muscleGroups: dayData.muscleGroups,
    title: dayData.title,
    notes: dayData.notes,
    exercises: [],
    ownerUid,
    createdTimestamp: getNowTimestamp(),
    startTimestamp: dayData.startTimestamp,
    endTimestamp: null
  };
  const dayDocRef = await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .add(data);
  return dayDocRef.id;
};

export const getAllDays10DaysBackInTime = async (): Promise<Array<IDayModel>> => {
  const sub10DaysTimestamp = getUnixTime(subDays(new Date(), 100));  // TODO Lol
  const ownerUid = await getCurrentUsersUid();
  return firebase.firestore()
    .collection(FIRESTORE_COLLECTION_DAYS)
    .where("startTimestamp", ">=", sub10DaysTimestamp)
    .where("ownerUid", "==", ownerUid)
    .get()
    .then(querySnapshot => {
      const days: Array<IDayModel> = [];
      querySnapshot.forEach(a => {
        const data = a.data();
        days.push({
          endTimestamp: data.endTimestamp,
          startTimestamp: data.startTimestamp,
          exercises: data.exercises,
          location: data.location,
          muscleGroups: data.muscleGroups,
          title: data.title,
          notes: data.notes,
          createdTimestamp: data.createdTimestamp,
          ownerUid: data.ownerUid,
          uid: a.id
        });
        // days.push({...a.data(), uid: a.id});
      });
      return days;
    });
};
