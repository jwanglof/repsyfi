import firebase from '../../../config/firebase';
import isEmpty from 'lodash/isEmpty';
import {
  ISetBasicModel,
  ISetBasicUpdateModel,
  ISetModel,
  ISetModelWithoutUid,
  ISetUpdateModel
} from '../../../models/ISetModel';
import {
  FirebaseCollectionNames,
  getErrorObjectCustomMessage,
  getNowTimestamp,
  getSetsRepsExerciseErrorObject,
  IErrorObject,
  retrieveErrorMessage
} from '../../../config/FirebaseUtils';
import {Versions} from '../../../models/IBaseModel';
import {ISetsRepsModel, ISetsRepsModelWithoutUid} from '../../../models/ISetsRepsModel';
import {getSetModelFromSnapshotData, getSetsModelFromSnapshotData} from '../SetsHelpers';
import {ISetsModel} from '../../../models/ISetsModel';

interface IInternalSetRepsFakeCache {
  [key: string]: ISetModel
}
const InternalSetRepsFakeCache: IInternalSetRepsFakeCache = {};

export const deleteSet = async (setUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS)
    .doc(setUid)
    .delete();
};

export const getSetDocument = (setUid: string): firebase.firestore.DocumentReference => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS)
    .doc(setUid);
};

const getSetRepsExerciseDocument = (exerciseUid: string): firebase.firestore.DocumentReference => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
    .doc(exerciseUid);
};

export const updateSetsRepsExercise = async (setUid: string, setData: ISetBasicUpdateModel) => {
  if (InternalSetRepsFakeCache[setUid]) {
    delete InternalSetRepsFakeCache[setUid];
  }
  const data: ISetUpdateModel = {
    amountInKg: setData.amountInKg,
    reps: setData.reps,
    updatedTimestamp: getNowTimestamp()
  };
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS)
    .doc(setUid)
    .update(data);
};

export const addNewSetAndGetUid = async (setData: ISetBasicModel, ownerUid: string): Promise<string> => {
  const data: ISetModelWithoutUid = {
    index: setData.index,
    amountInKg: setData.amountInKg,
    reps: setData.reps,
    ownerUid,
    createdTimestamp: getNowTimestamp(),
    version: Versions.v1
  };
  const setDocRef = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS)
    .add(data);
  return setDocRef.id;
};

export const addSetToSetsRepsExerciseArray = async (setUid: string, exerciseUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
    .doc(exerciseUid)
    .update({sets: firebase.firestore.FieldValue.arrayUnion(setUid)});
};

export const addNewSetsRepsExerciseAndGetUid = async (ownerUid: string): Promise<string> => {
  const setsRepsData: ISetsRepsModelWithoutUid = {
    sets: [],
    ownerUid,
    createdTimestamp: getNowTimestamp(),
    version: Versions.v1
  };
  const exerciseSetsRepsDocRef = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
    .add(setsRepsData);
  return exerciseSetsRepsDocRef.id;
};

export const getSetsRepsExercise = async (exerciseUid: string): Promise<ISetsRepsModel> => {
  const querySnapshot = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
    .doc(exerciseUid)
    .get();
  if (querySnapshot.exists && !isEmpty(querySnapshot.data())) {
    const exerciseData = querySnapshot.data()!;
    return {
      sets: exerciseData.sets,
      uid: querySnapshot.id,
      ownerUid: exerciseData.ownerUid,
      createdTimestamp: exerciseData.createdTimestamp,
      version: exerciseData.version
    };
  } else {
    throw getSetsRepsExerciseErrorObject(exerciseUid);
  }
};

export const getSetsRepsExerciseOnSnapshot = (exerciseUid: string, cb: ((data: ISetsModel) => void), errCb: ((error: IErrorObject) => any)): any => {
  return getSetRepsExerciseDocument(exerciseUid)
    .onSnapshot({includeMetadataChanges: true}, doc => {
      if (doc.exists && !isEmpty(doc.data())) {
        const snapshotData: any = doc.data();
        cb(getSetsModelFromSnapshotData(exerciseUid, snapshotData));
      } else {
        errCb(getErrorObjectCustomMessage(exerciseUid, FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS, 'No data'));
      }
    }, err => {
      console.error('error:', err);
      const errMessage = retrieveErrorMessage(err);
      errCb(getErrorObjectCustomMessage(exerciseUid, FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS, errMessage));
    });
};

export const deleteSetsRepsExercise = async (setsRepsUid: string): Promise<void> => {
  return await getSetsRepsExerciseDocument(setsRepsUid).delete();
};

export const getSetsRepsExerciseDocument = (setsRepsUid: string): firebase.firestore.DocumentReference => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
    .doc(setsRepsUid);
};

export const getSetRep = async (setUid: string): Promise<ISetModel> => {
  if (InternalSetRepsFakeCache[setUid]) {
    return Promise.resolve(InternalSetRepsFakeCache[setUid]);
  }
  const querySnapshot = await getSetDocument(setUid).get();
  if (querySnapshot.exists && !isEmpty(querySnapshot.data())) {
    const snapshotData = querySnapshot.data()!;
    const d = {
      ownerUid: snapshotData.ownerUid,
      uid: setUid,
      createdTimestamp: snapshotData.createdTimestamp,
      version: snapshotData.version,
      reps: snapshotData.reps,
      amountInKg: snapshotData.amountInKg,
      index: snapshotData.index
    };
    InternalSetRepsFakeCache[setUid] = d;
    return d;
  }
  throw getSetsRepsExerciseErrorObject(setUid);
};

export const setRepOnSnapshot = (setUid: string, cb: ((data: ISetModel) => void), errCb: ((error: string) => void)): any => {
  return getSetDocument(setUid)
    .onSnapshot({includeMetadataChanges: true}, doc => {
      if (doc.exists && !isEmpty(doc.data())) {
        const snapshotData: any = doc.data();
        cb(getSetModelFromSnapshotData(setUid, snapshotData));
      }
    }, err => {
      console.error('error:', err);
      errCb(err.message);
    });
};
