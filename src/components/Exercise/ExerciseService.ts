import {deleteSet, deleteSetsRepsExercise, getSetsRepsExercise} from '../SetsReps/SetsRepsService';
import firebase from '../../config/firebase';
import {isEmpty} from 'lodash';
import {IExerciseBasicModel, IExerciseModel, IExerciseModelWithoutUid} from '../../models/IExerciseModel';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {FirebaseCollectionNames, getExerciseErrorObject, getNowTimestamp} from '../../config/FirebaseUtils';
import {Versions} from '../../models/IBaseModel';
import {deleteTimeDistanceExercise} from '../TimeDistance/TimeDistanceService';

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

export const getExerciseTypes = (): Array<ExerciseTypesOptions> => ([
  {value: ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS, label: 'Sets and reps'},
  {value: ExerciseTypesEnum.EXERCISE_TYPE_TIME_DISTANCE, label: 'Time and distance'},
  // {value: ExerciseTypesEnum.EXERCISE_TYPE_NOT_CHOSEN, label: 'Other'},  // TODO Implement
]);

interface ExerciseTypesOptions {
  value: ExerciseTypesEnum,
  label: string
}