import {
  IDayBasicModel,
  IDayBasicUpdateModel,
  IDayModel,
  IDayModelWithoutUid,
  IDayUpdateModel
} from '../../models/IDayModel';
import firebase, {getCurrentUsersUid} from '../../config/firebase';
import {deleteExercise} from '../Exercise/ExerciseService';
import {isEmpty} from 'lodash';
import {FirebaseCollectionNames, getDayErrorObject, getNowTimestamp} from '../../config/FirebaseUtils';
import getUnixTime from 'date-fns/getUnixTime';
import subDays from 'date-fns/subDays';
import {Versions} from '../../models/IBaseModel';

export const getDay = async (dayUid: string): Promise<IDayModel> => {
  return firebase
    .firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
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
          createdTimestamp: data.createdTimestamp,
          version: data.version
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
    // await Promise.all(dayData.exercises.map(exerciseUid => deleteExercise(exerciseUid)));
    await Promise.all(dayData.exercises.map(e => deleteExercise(e.exerciseUid)));
  }
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .delete();
};

export const endDayNow = async (dayUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
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
    endTimestamp: null,
    version: Versions.v1
  };
  const dayDocRef = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .add(data);
  return dayDocRef.id;
};

export const getAllDays10DaysBackInTime = async (): Promise<Array<IDayModel>> => {
  const sub10DaysTimestamp = getUnixTime(subDays(new Date(), 100));  // TODO Lol
  const ownerUid = await getCurrentUsersUid();
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
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
          uid: a.id,
          version: data.ownerUid
        });
        // days.push({...a.data(), uid: a.id});
      });
      return days;
    });
};

export const updateDay = async (dayUid: string, dayData: IDayBasicUpdateModel) => {
  const data: IDayUpdateModel = {
    endTimestamp: dayData.endTimestamp,
    location: dayData.location,
    muscleGroups: dayData.muscleGroups,
    startTimestamp: dayData.startTimestamp,
    title: dayData.title,
    updatedTimestamp: getNowTimestamp(),
    notes: dayData.notes
  };
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .update(data);
};

export const addExerciseToDayArray = async (exerciseUid: string, dayUid: string): Promise<void> => {
  // TODO Should exercises be an object with the index as key??
  // return await firebase.firestore()
  //   .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
  //   .doc(dayUid)
  //   .update({exercises: firebase.firestore.FieldValue.arrayUnion(exerciseUid)});
};