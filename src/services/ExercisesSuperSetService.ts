import firebase from '../config/firebase';
import {FirebaseCollectionNames, getNowTimestamp} from '../config/FirebaseUtils';
import {
  IExercisesSuperSetsModel,
  IExercisesSuperSetsModelWithoutUid
} from '../models/IExercisesSuperSetsModel';
import isEmpty from 'lodash/isEmpty';
import {Versions} from '../models/IBaseModel';

interface ISimpleCacheArray {
  [dayUid: string]: Array<IExercisesSuperSetsModel>
}
const simpleDayCache: ISimpleCacheArray = {};

export const getAllSuperSets = (dayUid: string): Array<IExercisesSuperSetsModel> => {
  if (simpleDayCache[dayUid] && simpleDayCache[dayUid].length) {
    return simpleDayCache[dayUid];
  }
  return [];
};

const addSuperSetIfNotExistToDayCache = (dayUid: string, superSetData: IExercisesSuperSetsModel) => {
  if (simpleDayCache[dayUid] && simpleDayCache[dayUid].length) {
    const superSetExistInCahe = simpleDayCache[dayUid].some(superSet => superSet.uid === superSetData.uid);
    if (!superSetExistInCahe) {
      simpleDayCache[dayUid].push(superSetData);
    }
  } else {
    simpleDayCache[dayUid] = [superSetData];
  }
};

const addExerciseToDayCache = (dayUid: string, superSetUid: string, exerciseUid: string) => {
  if (simpleDayCache[dayUid].length) {
    simpleDayCache[dayUid].forEach(superSetModel => {
      if (superSetModel.uid === superSetUid) {
        superSetModel.exercises.push(exerciseUid);
      }
    });
  }
};

const removeExerciseFromSuperSetDayCache = (exerciseUid: string, superSetUid: string, dayUid: string) => {
  if (simpleDayCache[dayUid].length) {
    simpleDayCache[dayUid].forEach(superSetModel => {
      if (superSetModel.uid === superSetUid) {
        const index = superSetModel.exercises.indexOf(exerciseUid);
        if (index > -1) {
          superSetModel.exercises.splice(index, 1);
        }
      }
    });
  }
};

const removeEntireExerciseFromDayCache = (dayUid: string, superSetUid: string) => {
  if (simpleDayCache[dayUid].length) {
    simpleDayCache[dayUid].forEach(superSetModel => {
      if (superSetModel.uid === superSetUid) {
        const superSetIndex = simpleDayCache[dayUid].indexOf(superSetModel);
        if (superSetIndex > -1) {
          simpleDayCache[dayUid].splice(superSetIndex, 1);
        }
      }
    });
  }
};

const getSuperSetFromExerciseUid = (exerciseUid: string, dayUid: string): IExercisesSuperSetsModel | undefined => {
  return simpleDayCache[dayUid].find(superSetModel => {
    return superSetModel.exercises.includes(exerciseUid);
  })
};

export const getSuperSetData = async (exerciseUid: string, dayUid: string): Promise<IExercisesSuperSetsModel | null> => {
  return firebase
    .firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_SUPER_SET)
    .where("exercises", "array-contains", exerciseUid)
    .limit(1)
    .get()
    .then((querySnapshot: any) => {
      let returnData: IExercisesSuperSetsModel | null = null;
      querySnapshot.forEach((queryData: any) => {
        if (queryData.exists && !isEmpty(queryData.data())) {
          const data = queryData.data()!;
          const superSetData = {
            uid: queryData.id,
            ownerUid: data.ownerUid,
            createdTimestamp: data.createdTimestamp,
            version: data.version,
            name: data.name,
            exercises: data.exercises
          };

          // Add data to cache
          addSuperSetIfNotExistToDayCache(dayUid, superSetData);

          returnData = superSetData;
        }
      });
      return returnData;
    });
};

export const createNewSuperSetAndReturnUid = async (ownerUid: string, name: string, exerciseUid: string, dayUid: string): Promise<string> => {
  const data: IExercisesSuperSetsModelWithoutUid = {
    exercises: [exerciseUid],
    name: name,
    createdTimestamp: getNowTimestamp(),
    ownerUid: ownerUid,
    version: Versions.v1
  };
  const docRef = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_SUPER_SET)
    .add(data);

  // Add the new super set to cache
  const superSetData: IExercisesSuperSetsModel = {
    ...data,
    uid: docRef.id
  };
  addSuperSetIfNotExistToDayCache(dayUid, superSetData);

  return docRef.id;
};

const getSuperSetDocument = (superSetUid: string) => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_SUPER_SET)
    .doc(superSetUid);
};

export const addExerciseToSuperSet = async (superSetUid: string, exerciseUid: string, dayUid: string): Promise<void> => {
  const update = await getSuperSetDocument(superSetUid)
    .update({exercises: firebase.firestore.FieldValue.arrayUnion(exerciseUid)});

  // Add the exercise to the super set day cache
  addExerciseToDayCache(dayUid, superSetUid, exerciseUid);

  return update;
};

export const deleteOrUpdateSuperSetWithExercise = (exerciseUid: string, dayUid: string, batch: firebase.firestore.WriteBatch): firebase.firestore.WriteBatch => {
  const superSetData = getSuperSetFromExerciseUid(exerciseUid, dayUid);
  if (superSetData) {
    removeExerciseFromSuperSetDayCache(exerciseUid, superSetData.uid, dayUid);
    if (!superSetData.exercises.length) {
      // Delete the super set if it doesn't contain any exercises
      removeEntireExerciseFromDayCache(dayUid, superSetData.uid);
      batch.delete(getSuperSetDocument(superSetData.uid));
    } else {
      // Remove the exercise from the super set
      batch.update(getSuperSetDocument(superSetData.uid), {exercises: firebase.firestore.FieldValue.arrayRemove(exerciseUid)});
    }
  }
  return batch;
};
