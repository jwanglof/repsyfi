import {IDayModel} from '../../models/IDayModel';
import firebase, {FIRESTORE_COLLECTION_DAYS} from '../../config/firebase';
import {deleteExercise} from '../Exercise/TSExerciseService';
import {isEmpty} from 'lodash';
import {getDayErrorObject} from '../../config/FirebaseUtils';

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
