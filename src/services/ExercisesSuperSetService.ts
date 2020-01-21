import firebase from '../config/firebase';
import {
  FirebaseCollectionNames,
  getErrorObjectCustomMessage,
  getNowTimestamp,
  IErrorObject, retrieveErrorMessage
} from '../config/FirebaseUtils';
import {IExercisesSuperSetsModel, IExercisesSuperSetsModelWithoutUid} from '../models/IExercisesSuperSetsModel';
import isEmpty from 'lodash/isEmpty';
import {Versions} from '../models/IBaseModel';

interface ISimpleCacheArray {
  [dayUid: string]: Array<IExercisesSuperSetsModel>
}
const simpleDayCache: ISimpleCacheArray = {};

export const getAllSuperSets = (dayUid: string): Array<IExercisesSuperSetsModel> => {
  if (!simpleDayCache[dayUid]) {
    return [];
  }
  return simpleDayCache[dayUid];
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
  if (!simpleDayCache[dayUid]) {
    return;
  }
  simpleDayCache[dayUid].forEach(superSetModel => {
    if (superSetModel.uid === superSetUid) {
      superSetModel.exercises.push(exerciseUid);
    }
  });
};

const deleteExerciseFromSuperSetDayCache = (exerciseUid: string, superSetUid: string, dayUid: string) => {
  if (!simpleDayCache[dayUid]) {
    return;
  }
  simpleDayCache[dayUid].forEach(superSetModel => {
    if (superSetModel.uid === superSetUid) {
      const index = superSetModel.exercises.indexOf(exerciseUid);
      if (index > -1) {
        superSetModel.exercises.splice(index, 1);
      }
    }
  });
};

const deleteEntireExerciseFromDayCache = (dayUid: string, superSetUid: string) => {
  if (!simpleDayCache[dayUid]) {
    return;
  }
  simpleDayCache[dayUid].forEach(superSetModel => {
    if (superSetModel.uid === superSetUid) {
      const superSetIndex = simpleDayCache[dayUid].indexOf(superSetModel);
      if (superSetIndex > -1) {
        simpleDayCache[dayUid].splice(superSetIndex, 1);
      }
    }
  });
};

const removeEntireDayFromDayCache = (dayUid: string): void => {
  if (simpleDayCache[dayUid]) {
    delete simpleDayCache[dayUid];
  }
};

export const getSuperSetFromExerciseUid = (exerciseUid: string, dayUid: string): IExercisesSuperSetsModel | undefined => {
  if (!simpleDayCache[dayUid]) {
    return undefined;
  }
  return simpleDayCache[dayUid].find(superSetModel => {
    return superSetModel.exercises.includes(exerciseUid);
  })
};

export const getSuperSetDocument = (superSetUid: string): firebase.firestore.DocumentReference => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_SUPER_SET)
    .doc(superSetUid);
};

/**
 * Get the super set document data from Firestore, and add to cache, that the exercise UID belongs to.
 * Only queries for 1 document since an exercise UID can not exist in multiple super sets at the same time.
 *
 * @param {string} exerciseUid The exercise UID which will be queried if it exist in a super set's exercise array.
 * @param {string} dayUid The day UID the super set will exist on in the cache.
 * @returns {Promise<IExercisesSuperSetsModel | null>} A promise with the super set document's data,
 *  or null if the super set document does not exist.
 */
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

/**
 * Create a new super set document and add exercise UID to the new super set document's exercise array in Firestore
 * and to cache.
 *
 * @param {string} ownerUid The user who will own the new super set document.
 * @param {string} name Name of the super set.
 * @param {string} exerciseUid The exercise UID that will be added to the new super set's exercise array.
 * @param {string} dayUid The day UID the super set exists on in the cache.
 * @returns {Promise<String>} A promise with the new super set document's UID.
 */
export const createAndGetNewSuperSetWithExercise = async (ownerUid: string, name: string, exerciseUid: string, dayUid: string): Promise<IExercisesSuperSetsModel> => {
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

  return superSetData;
};

/**
 * Add an exercise UID to a super set document's exercise array in Firestore and to cache.
 *
 * @param {string} superSetUid The super set UID that should be updated.
 * @param {string} exerciseUid The exercise UID that will be added to the super set's exercise array.
 * @param {string} dayUid The day UID the super set exists on in the cache.
 * @returns {Promise} A promise with no value.
 */
export const addExerciseToSuperSet = async (superSetUid: string, exerciseUid: string, dayUid: string): Promise<void> => {
  const update = await getSuperSetDocument(superSetUid)
    .update({exercises: firebase.firestore.FieldValue.arrayUnion(exerciseUid)});

  // Add the exercise to the super set day cache
  addExerciseToDayCache(dayUid, superSetUid, exerciseUid);

  return update;
};

/**
 * Wrapper for {@link deleteExerciseFromSuperSetWithUid}, see linked method's information!
 * This method will not alter any Firestore documents if no super set data is found.
 *
 * @param {string} exerciseUid The exercise UID that should be removed from the super set.
 * @param {string} dayUid The day UID the super set exists on in the cache.
 * @param {firebase.firestore.WriteBatch} batch Used for chaining.
 * @returns {firebase.firestore.WriteBatch} A WriteBatch for chaining.
 */
export const deleteExerciseFromSuperSet = (exerciseUid: string, dayUid: string, batch: firebase.firestore.WriteBatch): firebase.firestore.WriteBatch => {
  const superSetData = getSuperSetFromExerciseUid(exerciseUid, dayUid);
  if (superSetData) {
    batch = deleteExerciseFromSuperSetWithUid(exerciseUid, dayUid, superSetData, batch);
  }
  return batch;
};

/**
 * Delete an exercise's UID from a super set document's exercise array in Firestore and from cache.
 *
 * This method have side-effects, namely:
 * <ul>
 *   <li><i>IF</i> the super set is left without exercises the super set document will be removed in Firestore.</li>
 *   <li><i>ELSE IF</i> the super set have exercises left the super set document will be altered in Firestore.</li>
 * </ul>
 *
 * <strong>CAN NOT be reversed! Use with caution!</strong>
 *
 * @param {string} exerciseUid The exercise UID that should be removed from the super set.
 * @param {string} dayUid The day UID the super set exists on in the cache.
 * @param {IExercisesSuperSetsModel} superSetData The super set data that will be used for information about what will be deleted.
 * @param {firebase.firestore.WriteBatch} batch Used for chaining.
 * @returns {firebase.firestore.WriteBatch} A WriteBatch for chaining.
 */
export const deleteExerciseFromSuperSetWithUid = (exerciseUid: string, dayUid: string, superSetData: IExercisesSuperSetsModel, batch: firebase.firestore.WriteBatch): firebase.firestore.WriteBatch => {
  const superSetUid = superSetData.uid;
  deleteExerciseFromSuperSetDayCache(exerciseUid, superSetUid, dayUid);
  if (!superSetData.exercises.length) {
    // Delete the super set if it doesn't contain any exercises
    deleteEntireExerciseFromDayCache(dayUid, superSetUid);
    batch.delete(getSuperSetDocument(superSetUid));
  } else {
    // Remove the exercise from the super set
    batch.update(getSuperSetDocument(superSetUid), {exercises: firebase.firestore.FieldValue.arrayRemove(exerciseUid)});
  }
  return batch;
};

/**
 * Delete an entire super set document in Firestore and from cache.
 *
 * <strong>CAN NOT be reversed! Use with caution!</strong>
 *
 * @param {string} superSetUid The super set UID that should be removed.
 * @param {string} dayUid The day UID the super set exists on in the cache.
 * @param {firebase.firestore.WriteBatch} batch Used for chaining.
 * @returns {firebase.firestore.WriteBatch} A WriteBatch for chaining.
 */
export const deleteSuperSet = (superSetUid: string, dayUid: string, batch: firebase.firestore.WriteBatch): firebase.firestore.WriteBatch => {
  removeEntireDayFromDayCache(dayUid);
  return batch.delete(getSuperSetDocument(superSetUid));
};

/**
 * Get a Firebase snapshot listener.
 *
 * @param {string} superSetUid The super set UID that the listener will be returned for.
 * @param {function} cb Callback function that will be called on new snapshot data.
 * @param {function} errCb Callback function that will be called on snapshot errors.
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export const getSuperSetOnSnapshot = (superSetUid: string, cb: ((data: IExercisesSuperSetsModel) => void), errCb: ((error: IErrorObject) => void)): any => {
  return getSuperSetDocument(superSetUid)
    .onSnapshot({includeMetadataChanges: true}, doc => {
      if (doc.exists && !isEmpty(doc.data())) {
        const snapshotData: any = doc.data();
        cb(getSuperSetModelFromSnapshotData(superSetUid, snapshotData));
      } else {
        errCb(getErrorObjectCustomMessage(superSetUid, FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_SUPER_SET, 'No data'));
      }
    }, err => {
      console.error('error:', err);
      const errMessage = retrieveErrorMessage(err);
      errCb(getErrorObjectCustomMessage(superSetUid, FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_SUPER_SET, errMessage));
    });
};

const getSuperSetModelFromSnapshotData = (superSetUid: string, snapshotData: any): IExercisesSuperSetsModel => ({
  exercises: snapshotData.exercises,
  name: snapshotData.name,
  uid: superSetUid,
  ownerUid: snapshotData.ownerUid,
  createdTimestamp: snapshotData.createdTimestamp,
  version: snapshotData.version
});
