import {deleteSet} from '../SetsReps/SetService';
import firebase from '../../config/firebase';
import {isEmpty} from 'lodash';
import {IExerciseBasicModel, IExerciseModel, IExerciseModelWithoutUid} from '../../models/IExerciseModel';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {ISetsRepsModel, ISetsRepsModelWithoutUid} from '../../models/ISetsRepsModel';
import {ITimeDistanceModel, ITimeDistanceModelWithoutUid} from '../../models/ITimeDistanceModel';
import {
  FirebaseCollectionNames,
  getExerciseErrorObject,
  getNowTimestamp,
  getSetsRepsExerciseErrorObject,
  getTimeDistanceExerciseErrorObject
} from '../../config/FirebaseUtils';
import {Versions} from '../../models/IBaseModel';

export const getExercise = async (exerciseUid: string): Promise<IExerciseModel> => {
  const querySnapshot = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .get();
  if (querySnapshot.exists && !isEmpty(querySnapshot.data())) {
    const exerciseData = querySnapshot.data()!;
    // exerciseData.uid = querySnapshot.id;
    return {
      exerciseName: exerciseData.exerciseName,
      type: exerciseData.type,
      typeUid: exerciseData.typeUid,
      uid: querySnapshot.id,
      ownerUid: exerciseData.ownerUid,
      createdTimestamp: exerciseData.createdTimestamp,
      version: exerciseData.version
    };
  } else {
    throw getExerciseErrorObject(exerciseUid);
  }
};

export const deleteExercise = async (exerciseUid: string): Promise<void> => {
  const exerciseData = await getExercise(exerciseUid);

  if (exerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
    const setsRepsData = await getSetsRepsExercise(exerciseData.typeUid);
    // Remove all sets that exist on the exercise
    if (setsRepsData.sets.length) {
      await Promise.all(setsRepsData.sets.map(setUid => deleteSet(setUid)));
    }
    await deleteSetsRepsExercise(setsRepsData.uid);
  } else if (exerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE) {
    await deleteTimeDistanceExercise(exerciseData.typeUid);
  } else {
    console.warn(`${exerciseData.type} is not supported to be deleted!`);
  }

  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .delete();
};

export const deleteSetsRepsExercise = async (exerciseUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS)
    .doc(exerciseUid)
    .delete();
};

export const deleteTimeDistanceExercise = async (exerciseUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE)
    .doc(exerciseUid)
    .delete();
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

export const addExerciseAndGetUid = async (exerciseData: IExerciseBasicModel, ownerUid: string): Promise<string> => {
  const data: IExerciseModelWithoutUid = {
    ownerUid,
    createdTimestamp: getNowTimestamp(),
    type: exerciseData.type,
    typeUid: exerciseData.typeUid,
    exerciseName: exerciseData.exerciseName,
    version: Versions.v1
  };
  const exerciseDocRef = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .add(data);
  return exerciseDocRef.id;
};

export const updateExercise = async(exerciseUid: string, exerciseHeaderData: IExerciseBasicModel): Promise<void> => {
  const data: IExerciseBasicModel = {
    exerciseName: exerciseHeaderData.exerciseName,
    typeUid: exerciseHeaderData.typeUid,
    type: exerciseHeaderData.type
  };
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .update(data);
};

// TODO Move to the DayService?
export const addExerciseToDayArray = async (exerciseUid: string, dayUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .update({exercises: firebase.firestore.FieldValue.arrayUnion(exerciseUid)});
};

export const getExerciseTypes = (): Array<ExerciseTypesOptions> => ([
  {value: ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS, label: 'Sets and reps'},
  {value: ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE, label: 'Time and distance'},
  // {value: ExerciseTypesEnum.EXERCISE_TYPE_NOT_CHOSEN, label: 'Other'},  // TODO Implement
]);

interface ExerciseTypesOptions {
  value: ExerciseTypesEnum,
  label: string
}