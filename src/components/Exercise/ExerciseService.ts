import {deleteSet, deleteSetsRepsExercise, getSetsRepsExercise} from '../SetsReps/SetsRepsService';
import firebase, {getCurrentUsersUid} from '../../config/firebase';
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
import {deleteTimeDistanceExercise} from '../TimeDistance/TimeDistanceService';
import {deleteSetsSeconds, deleteSetsSecondsExercise, getSetsSecondsExercise} from '../SetsSeconds/SetsSecondsService';

// "Cache"
interface IExerciseServiceCache {
  exerciseNames: Array<string>
}
const exerciseServiceCache: IExerciseServiceCache = {exerciseNames: []};

export const addExerciseNameToCache = (exerciseName: string) => {
  if (exerciseServiceCache.exerciseNames.length > 0 && exerciseServiceCache.exerciseNames.indexOf(exerciseName) === -1) {
    exerciseServiceCache.exerciseNames.push(exerciseName);
  }
};

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

export const getLatest30ExerciseNames = async (): Promise<IExerciseServiceCache['exerciseNames']> => {
  if (exerciseServiceCache.exerciseNames.length > 0) {
    return exerciseServiceCache.exerciseNames;
  }

  const ownerUid = await getCurrentUsersUid();

  const exerciseNames: Array<string> = [];

  await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .orderBy("createdTimestamp", "desc")
    .where("ownerUid", "==", ownerUid)
    .limit(1)
    .get()
    .then(res => {
      let firstDayExerciseName = '';
      res.forEach((d: any) => {
        firstDayExerciseName = d.data().exerciseName;
      });
      exerciseNames.push(firstDayExerciseName);
      return firstDayExerciseName;
    });

  await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .where("location", "<", exerciseNames[0])
    .where("ownerUid", "==", ownerUid)
    .limit(30)
    .get()
    .then(res => {
      res.forEach((d: any) => {
        console.log(1111, d, d.data());
        if (exerciseNames.indexOf(d.data().location) === -1) {
          exerciseNames.push(d.data().location);
        }
      });
    });

  await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISES)
    .where("location", ">", exerciseNames[0])
    .where("ownerUid", "==", ownerUid)
    .limit(30)
    .get()
    .then(res => {
      res.forEach((d: any) => {
        console.log(2222, d, d.data());
        if (exerciseNames.indexOf(d.data().location) === -1) {
          exerciseNames.push(d.data().location);
        }
      });
    });

  console.log(exerciseNames);

  exerciseServiceCache.exerciseNames = exerciseNames;

  return exerciseServiceCache.exerciseNames;
};
