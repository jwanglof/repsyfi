import firebase from '../../../config/firebase';
import isEmpty from 'lodash/isEmpty';
import {
  FirebaseCollectionNames,
  getErrorObjectCustomMessage,
  getNowTimestamp,
  getSetsSecondsExerciseErrorObject,
  IErrorObject,
  retrieveErrorMessage
} from '../../../config/FirebaseUtils';
import {Versions} from '../../../models/IBaseModel';
import {ISetsSecondsModel, ISetsSecondsModelWithoutUid} from '../../../models/ISetsSecondsModel';
import {
  ISetBasicModel,
  ISetBasicUpdateModel,
  ISetModel,
  ISetModelWithoutUid,
  ISetUpdateModel
} from '../../../models/ISetModel';
import {getSetModelFromSnapshotData, getSetsModelFromSnapshotData} from '../SetsHelpers';
import {ISetsModel} from '../../../models/ISetsModel';

interface IInternalSetSecondsFakeCache {
  [key: string]: ISetModel
}
const InternalSetSecondsFakeCache: IInternalSetSecondsFakeCache = {};

export const deleteSetsSeconds = async (setUid: string): Promise<void> => {
  return await getSetSecondDocument(setUid)
    .delete();
};

export const getSetSecondDocument = (setUid: string) => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS_SECONDS)
    .doc(setUid);
};

export const getSetSecondExerciseDocument = (exerciseUid: string) => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS)
    .doc(exerciseUid);
};

export const updateSetsSecondsExercise = async (setUid: string, setData: ISetBasicUpdateModel) => {
  if (InternalSetSecondsFakeCache[setUid]) {
    delete InternalSetSecondsFakeCache[setUid];
  }
  const data: ISetUpdateModel = {
    amountInKg: setData.amountInKg,
    seconds: setData.seconds,
    updatedTimestamp: getNowTimestamp()
  };
  return await getSetSecondDocument(setUid).update(data);
};

export const addNewSetSecondsAndGetUid = async (setData: ISetBasicModel, ownerUid: string): Promise<string> => {
  const data: ISetModelWithoutUid = {
    index: setData.index,
    amountInKg: setData.amountInKg,
    seconds: setData.seconds,
    ownerUid,
    createdTimestamp: getNowTimestamp(),
    version: Versions.v1
  };
  const setDocRef = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS_SECONDS)
    .add(data);
  return setDocRef.id;
};

export const addSetSecondsToSetsSecondsExerciseArray = async (setUid: string, exerciseUid: string): Promise<void> => {
  return await getSetSecondExerciseDocument(exerciseUid)
    .update({sets: firebase.firestore.FieldValue.arrayUnion(setUid)});
};

export const addNewSetsSecondsExerciseAndGetUid = async (ownerUid: string): Promise<string> => {
  const setsSecondsData: ISetsSecondsModelWithoutUid = {
    sets: [],
    ownerUid,
    createdTimestamp: getNowTimestamp(),
    version: Versions.v1
  };
  const exerciseSetsSecondsDocRef = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS)
    .add(setsSecondsData);
  return exerciseSetsSecondsDocRef.id;
};

export const getSetsSecondsExercise = async (exerciseUid: string): Promise<ISetsSecondsModel> => {
  const querySnapshot = await getSetSecondExerciseDocument(exerciseUid)
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
    throw getSetsSecondsExerciseErrorObject(exerciseUid);
  }
};

export const getSetsSecondsExerciseOnSnapshot = (exerciseUid: string, cb: ((data: ISetsModel) => void), errCb: ((error: IErrorObject) => void)): any => {
  return getSetSecondExerciseDocument(exerciseUid)
    .onSnapshot({includeMetadataChanges: true}, doc => {
      if (doc.exists && !isEmpty(doc.data())) {
        const snapshotData: any = doc.data();
        cb(getSetsModelFromSnapshotData(exerciseUid, snapshotData));
      } else {
        errCb(getErrorObjectCustomMessage(exerciseUid, FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS, 'No data'));
      }
    }, err => {
      console.error('error:', err);
      const errMessage = retrieveErrorMessage(err);
      errCb(getErrorObjectCustomMessage(exerciseUid, FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS, errMessage));
    });
};

export const deleteSetsSecondsExercise = async (setsRepsUid: string): Promise<void> => {
  return await getSetsSecondsExerciseDocument(setsRepsUid).delete();
};

export const getSetsSecondsExerciseDocument = (setsSecondsUid: string): firebase.firestore.DocumentReference => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS)
    .doc(setsSecondsUid);
};

export const getSetsSecond = async (setUid: string): Promise<ISetModel> => {
  if (InternalSetSecondsFakeCache[setUid]) {
    return Promise.resolve(InternalSetSecondsFakeCache[setUid]);
  }
  const querySnapshot = await getSetSecondDocument(setUid).get();
  if (querySnapshot.exists && !isEmpty(querySnapshot.data())) {
    const snapshotData = querySnapshot.data()!;
    const d = {
      ownerUid: snapshotData.ownerUid,
      uid: setUid,
      createdTimestamp: snapshotData.createdTimestamp,
      version: snapshotData.version,
      seconds: snapshotData.seconds,
      amountInKg: snapshotData.amountInKg,
      index: snapshotData.index
    };
    InternalSetSecondsFakeCache[setUid] = d;
    return d;
  }
  throw getSetsSecondsExerciseErrorObject(setUid);
};

export const setSecondOnSnapshot = (setUid: string, cb: ((data: ISetModel) => void), errCb: ((error: string) => void)): any => {
  return getSetSecondDocument(setUid)
    .onSnapshot({includeMetadataChanges: true}, doc => {
      if (doc.exists && !isEmpty(doc.data())) {
        const snapshotData: any = doc.data();
        cb(getSetModelFromSnapshotData(setUid, snapshotData));
      } else {
        errCb('No data');
      }
    }, err => {
      console.error('error:', err);
      errCb(err.message);
    });
};


