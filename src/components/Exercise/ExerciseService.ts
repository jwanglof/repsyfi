import {
  deleteSet,
  deleteSetsRepsExercise,
  getSetDocument,
  getSetsRepsExercise,
  getSetsRepsExerciseDocument
} from '../Sets/SetsReps/SetsRepsService';
import firebase from '../../config/firebase';
import isEmpty from 'lodash/isEmpty';
import {
  IExerciseBasicModel,
  IExerciseHeaderModel,
  IExerciseModel,
  IExerciseModelWithoutUid
} from '../../models/IExerciseModel';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {FirebaseCollectionNames, getExerciseErrorObject, getNowTimestamp} from '../../config/FirebaseUtils';
import {Versions} from '../../models/IBaseModel';
import {deleteTimeDistanceExercise, getTimeDistanceDocument} from '../TimeDistance/TimeDistanceService';
import {
  deleteSetsSeconds,
  deleteSetsSecondsExercise,
  getSetSecondDocument,
  getSetsSecondsExercise, getSetsSecondsExerciseDocument
} from '../Sets/SetsSeconds/SetsSecondsService';
import {getDayDocument} from '../Day/DayService';

export const getExercise = async (exerciseUid: string): Promise<IExerciseModel> => {
  const querySnapshot = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .get();
  if (querySnapshot.exists && !isEmpty(querySnapshot.data())) {
    const exerciseData = querySnapshot.data()!;
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
  // TODO Make this a batch update/delete! See how in SetsSecondsExerciseContainer#delExercise !!
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
  } else if (exerciseData.type === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
    const setsRepsData = await getSetsSecondsExercise(exerciseData.typeUid);
    // Remove all sets that exist on the exercise
    if (setsRepsData.sets.length) {
      await Promise.all(setsRepsData.sets.map(setUid => deleteSetsSeconds(setUid)));
    }
    await deleteSetsSecondsExercise(setsRepsData.uid);
  } else {
    console.warn(`${exerciseData.type} is not supported to be deleted!`);
  }

  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .delete();
};

export const getBatchToDeleteExercise = async (exerciseUid: string): Promise<firebase.firestore.WriteBatch> => {
  const exerciseData = await getExercise(exerciseUid);
  const exerciseType = exerciseData.type;
  const typeExerciseUid = exerciseData.typeUid;

  // More: https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
  const batch = firebase.firestore().batch();
  if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
    const setsRepsData = await getSetsSecondsExercise(typeExerciseUid);
    setsRepsData.sets.forEach((setUid: string) => batch.delete(getSetSecondDocument(setUid)));
    batch.delete(getSetsSecondsExerciseDocument(typeExerciseUid));
  } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
    const setsRepsData = await getSetsRepsExercise(typeExerciseUid);
    setsRepsData.sets.forEach((setUid: string) => batch.delete(getSetDocument(setUid)));
    batch.delete(getSetsRepsExerciseDocument(typeExerciseUid));
  } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE) {
    batch.delete(getTimeDistanceDocument(typeExerciseUid));
  }

  return batch.delete(getExerciseDocument(exerciseUid));
};


export const deleteONLYExercise = async (exerciseUid: string): Promise<void> => {
  return await getExerciseDocument(exerciseUid).delete();
};

export const getExerciseDocument = (exerciseUid: string): any => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
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

export const updateExercise = async(exerciseUid: string, exerciseHeaderData: IExerciseHeaderModel): Promise<void> => {
  const data: IExerciseHeaderModel = {
    exerciseName: exerciseHeaderData.exerciseName
  };
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .doc(exerciseUid)
    .update(data);
};
