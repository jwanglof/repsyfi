import {
  IDayBasicModel,
  IDayBasicUpdateModel,
  IDayExercisesArray,
  IDayModel,
  IDayModelWithoutUid,
  IDayUpdateModel
} from '../../models/IDayModel';
import firebase, {getCurrentUsersUid} from '../../config/firebase';
import {deleteExerciseUidAndRelatedDataWithoutSuperSets} from '../Exercise/ExerciseService';
import isEmpty from 'lodash/isEmpty';
import {FirebaseCollectionNames, getDayErrorObject, getNowTimestamp} from '../../config/FirebaseUtils';
import {Versions} from '../../models/IBaseModel';
import {deleteSuperSet, getSuperSetFromExerciseUid} from '../../services/ExercisesSuperSetService';
import {getDayQuestionnaireDocument} from './DayQuestionnaireService';

// "Cache"
interface IDayServiceCache {
  locations: Array<string>
}
const dayServiceCache: IDayServiceCache = {locations: []};

export const getDayDocument = (dayUid: string): firebase.firestore.DocumentReference => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid);
};

export const addLocationToCache = (location: string) => {
  if (dayServiceCache.locations.length > 0) {
    if (dayServiceCache.locations.indexOf(location) === -1) {
      dayServiceCache.locations.push(location);
    }
  }
};

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

/**
 * Delete an entire day document together with all related data in Firestore.
 *
 * Related data that will be deleted are:
 * <ul>
 *   <li>Exercises ({@link deleteExerciseUidAndRelatedDataWithoutSuperSets}) and related data. See linked method for more information!</li>
 *   <li>Super set document if an exercise is part of it</li>
 *   <li>The day's questionnaire if it exist</li>
 * </ul>
 *
 * <strong>CAN NOT be reversed! Use with caution!</strong>
 *
 * @param {IDayModel} dayData The day data that will be used for information about what will be deleted.
 * @param {firebase.firestore.WriteBatch} batch Used for chaining.
 * @returns {Promise<firebase.firestore.WriteBatch>} A WriteBatch for chaining.
 */
export const deleteDayAndRelatedData = async (dayData: IDayModel, batch: firebase.firestore.WriteBatch): Promise<firebase.firestore.WriteBatch> => {
  const dayUid = dayData.uid;

  if (dayData.exercises.length) {
    const superSetUniqueUIDs: string[] = [];

    // Remove exercises with related data
    await Promise.all(dayData.exercises.map(async (e) => {
      batch = await deleteExerciseUidAndRelatedDataWithoutSuperSets(e.exerciseUid, dayUid, batch);

      // Add unique super set UIDs to delete
      const superSetData = getSuperSetFromExerciseUid(e.exerciseUid, dayUid);
      if (superSetData && !superSetUniqueUIDs.includes(superSetData.uid)) {
        superSetUniqueUIDs.push(superSetData.uid);
      }
    }));

    // Delete super sets
    superSetUniqueUIDs.forEach(uid => {
      batch = deleteSuperSet(uid, dayUid, batch);
    });
  }

  // Delete questionnaire
  if (dayData.questionnaire) {
     batch.delete(getDayQuestionnaireDocument(dayData.questionnaire));
  }

  return batch.delete(getDayDocument(dayUid));
};

export const endDayNow = async (dayUid: string): Promise<void> => {
  return await getDayDocument(dayUid)
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

export const getLatest10Days = async (): Promise<Array<IDayModel>> => {
  const ownerUid = await getCurrentUsersUid();
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .where("ownerUid", "==", ownerUid)
    .orderBy('startTimestamp', 'desc')
    .limit(10)
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
  // Remove the entire endTimestamp field if it doesn't have a value
  if (!dayData.endTimestamp) {
    data.endTimestamp = firebase.firestore.FieldValue.delete();
  }
  return await getDayDocument(dayUid)
    .update(data);
};

export const addExerciseToDayArray = async (exerciseUid: string, dayUid: string): Promise<void> => {
  const dayData = await getDay(dayUid);
  const exerciseData: IDayExercisesArray = {
    exerciseUid,
    index: dayData.exercises.length
  };
  return await getDayDocument(dayUid)
    .update({exercises: firebase.firestore.FieldValue.arrayUnion(exerciseData)});
};

export const getAllLocations = async (): Promise<IDayServiceCache['locations']> => {
  if (dayServiceCache.locations.length > 0) {
    return dayServiceCache.locations;
  }

  const ownerUid = await getCurrentUsersUid();

  const locations: Array<string> = [];

  await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .orderBy("createdTimestamp", "desc")
    .where("ownerUid", "==", ownerUid)
    .limit(1)
    .get()
    .then(res => {
      let firstDayLocation = '';
      res.forEach((d: any) => {
        firstDayLocation = d.data().location;
      });
      locations.push(firstDayLocation);
      return firstDayLocation;
    });

  await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .where("location", "<", locations[0])
    .where("ownerUid", "==", ownerUid)
    .limit(10)
    .get()
    .then(res => {
      res.forEach((d: any) => {
        if (locations.indexOf(d.data().location) === -1) {
          locations.push(d.data().location);
        }
      });
    });

  await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .where("location", ">", locations[0])
    .where("ownerUid", "==", ownerUid)
    .limit(10)
    .get()
    .then(res => {
      res.forEach((d: any) => {
        if (locations.indexOf(d.data().location) === -1) {
          locations.push(d.data().location);
        }
      });
    });

  dayServiceCache.locations = locations;

  return dayServiceCache.locations;
};
