import {
  ITimeDistanceBasicModel,
  ITimeDistanceModel,
  ITimeDistanceModelWithoutUid,
  ITimeDistanceUpdateModel
} from '../../models/ITimeDistanceModel';
import {
  FirebaseCollectionNames,
  getErrorObjectCustomMessage,
  getNowTimestamp,
  getTimeDistanceExerciseErrorObject,
  IErrorObject,
  retrieveErrorMessage
} from '../../config/FirebaseUtils';
import {Versions} from '../../models/IBaseModel';
import firebase from '../../config/firebase';
import isEmpty from 'lodash/isEmpty';

export const addNewTimeDistanceExerciseAndGetUid = async (ownerUid: string): Promise<string> => {
  const timeDistanceData: ITimeDistanceModelWithoutUid = {
    totalTimeSeconds: 0,
    totalDistanceMeter: 0,
    totalWarmupSeconds: 0,
    totalKcal: 0,
    speedMin: 0,
    speedMax: 0,
    inclineMin: 0,
    inclineMax: 0,
    ownerUid: ownerUid,
    createdTimestamp: getNowTimestamp(),
    version: Versions.v1
  };
  const exerciseSetsRepsDocRef = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
    .add(timeDistanceData);
  return exerciseSetsRepsDocRef.id;
};

export const getTimeDistanceExercise = async (exerciseUid: string): Promise<ITimeDistanceModel> => {
  const querySnapshot = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
    .doc(exerciseUid)
    .get();
  if (!isEmpty(querySnapshot.data())) {
    const exerciseData = querySnapshot.data()!;
    return getTimeDistanceModelFromSnapshotData(exerciseUid, exerciseData);
  } else {
    throw getTimeDistanceExerciseErrorObject(exerciseUid);
  }
};

export const deleteTimeDistanceExercise = async (exerciseUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
    .doc(exerciseUid)
    .delete();
};

export const updateTimeDistanceExercise = async(exerciseUid: string, timeDistanceData: ITimeDistanceBasicModel): Promise<void> => {
  const data: ITimeDistanceUpdateModel = {
    totalTimeSeconds: timeDistanceData.totalTimeSeconds,
    totalDistanceMeter: timeDistanceData.totalDistanceMeter,
    totalWarmupSeconds: timeDistanceData.totalWarmupSeconds,
    totalKcal: timeDistanceData.totalKcal,
    speedMin: timeDistanceData.speedMin,
    speedMax: timeDistanceData.speedMax,
    inclineMin: timeDistanceData.inclineMin,
    inclineMax: timeDistanceData.inclineMax,
    updatedTimestamp: getNowTimestamp()
  };
  return await getTimeDistanceDocument(exerciseUid).update(data);
};

export const getTimeDistanceDocument = (timeDistanceUid: string): firebase.firestore.DocumentReference => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
    .doc(timeDistanceUid);
};

export const getTimeDistanceOnSnapshot  = (timeDistanceUid: string, cb: ((data: ITimeDistanceModel) => void), errCb: ((error: IErrorObject) => void)): any => {
  return getTimeDistanceDocument(timeDistanceUid)
    .onSnapshot({includeMetadataChanges: true}, doc => {
      if (doc.exists && !isEmpty(doc.data())) {
        const snapshotData: any = doc.data();
        cb(getTimeDistanceModelFromSnapshotData(timeDistanceUid, snapshotData));
      } else {
        errCb(getErrorObjectCustomMessage(timeDistanceUid, FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE, 'No data'));
      }
    }, err => {
      console.error('error:', err);
      const errMessage = retrieveErrorMessage(err);
      errCb(getErrorObjectCustomMessage(timeDistanceUid, FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE, errMessage));
    });
};

const getTimeDistanceModelFromSnapshotData = (timeDistanceUid: string, snapshotData: any): ITimeDistanceModel => ({
  totalTimeSeconds: snapshotData.totalTimeSeconds,
  totalDistanceMeter: snapshotData.totalDistanceMeter,
  totalWarmupSeconds: snapshotData.totalWarmupSeconds,
  totalKcal: snapshotData.totalKcal,
  speedMin: snapshotData.speedMin,
  speedMax: snapshotData.speedMax,
  inclineMin: snapshotData.inclineMin,
  inclineMax: snapshotData.inclineMax,
  uid: timeDistanceUid,
  ownerUid: snapshotData.ownerUid,
  createdTimestamp: snapshotData.createdTimestamp,
  version: snapshotData.version
});
