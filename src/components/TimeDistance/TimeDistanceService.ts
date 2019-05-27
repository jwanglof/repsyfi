import {
  ITimeDistanceBasicModel,
  ITimeDistanceModel,
  ITimeDistanceModelWithoutUid,
  ITimeDistanceUpdateModel
} from '../../models/ITimeDistanceModel';
import {FirebaseCollectionNames, getNowTimestamp, getTimeDistanceExerciseErrorObject} from '../../config/FirebaseUtils';
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
    return {
      totalTimeSeconds: exerciseData.totalTimeSeconds,
      totalDistanceMeter: exerciseData.totalDistanceMeter,
      totalWarmupSeconds: exerciseData.totalWarmupSeconds,
      totalKcal: exerciseData.totalKcal,
      speedMin: exerciseData.speedMin,
      speedMax: exerciseData.speedMax,
      inclineMin: exerciseData.inclineMin,
      inclineMax: exerciseData.inclineMax,
      uid: querySnapshot.id,
      ownerUid: exerciseData.ownerUid,
      createdTimestamp: exerciseData.createdTimestamp,
      version: exerciseData.version
    };
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
