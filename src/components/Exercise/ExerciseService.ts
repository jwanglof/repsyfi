import {getSetDocument, getSetsRepsExercise, getSetsRepsExerciseDocument} from '../Sets/SetsReps/SetsRepsService';
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
import {getTimeDistanceDocument} from '../TimeDistance/TimeDistanceService';
import {
  getSetSecondDocument,
  getSetsSecondsExercise,
  getSetsSecondsExerciseDocument
} from '../Sets/SetsSeconds/SetsSecondsService';
import {deleteExerciseFromSuperSet} from '../../services/ExercisesSuperSetService';

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

/**
 * Wrapper for {@link deleteExerciseAndRelatedData}, see linked method's information!
 * This method will not remove super sets so it needs to be handled some other way!
 *
 * @param {string} exerciseUid The exercise UID that will be used to fetch the exercise data.
 * @param {string} dayUid Passed to {@link deleteExerciseAndRelatedData}.
 * @param {firebase.firestore.WriteBatch} batch Passed to {@link deleteExerciseAndRelatedData}.
 * @returns {Promise<firebase.firestore.WriteBatch>} A WriteBatch for chaining.
 */
export const deleteExerciseUidAndRelatedDataWithoutSuperSets = async (exerciseUid: string, dayUid: string, batch: firebase.firestore.WriteBatch): Promise<firebase.firestore.WriteBatch> => {
  const exerciseData = await getExercise(exerciseUid);
  return deleteExerciseAndRelatedData(exerciseData, dayUid, batch, false);
};


/**
 * Delete an entire exercise document together with all related data in Firestore.
 *
 * Related data that will be deleted <u>can</u> be part of these Firestore collection tuples depending on exercise type:
 * <ul>
 *   <li>{@link #FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS_SECONDS} & {@link #FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS}</li>
 *   <li>{@link #FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS} & {@link #FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_REPS}</li>
 *   <li>{@link FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_TIME_DISTANCE}</li>
 *   <li>{@link FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_SUPER_SET}</li>
 * </ul>
 *
 * <strong>CAN NOT be reversed! Use with caution!</strong>
 *
 * @param {IExerciseModel} exerciseData The exercise data that will be used for information about what will be deleted.
 * @param {string} dayUid The day UID the super set will exist on in the cache.
 * @param {firebase.firestore.WriteBatch} batch Used for chaining.
 * @param {boolean} [deleteSuperSets=true] Set to <tt>false</tt> to not delete the exercise from it's super set that might exist.
 *  <strong>If set to <tt>false</tt> this must be handled some other way!</strong>
 * @returns {Promise<firebase.firestore.WriteBatch>} A WriteBatch for chaining.
 */
export const deleteExerciseAndRelatedData = async (exerciseData: IExerciseModel, dayUid: string, batch: firebase.firestore.WriteBatch, deleteSuperSets: boolean = true): Promise<firebase.firestore.WriteBatch> => {
  const exerciseUid = exerciseData.uid;
  const exerciseType = exerciseData.type;
  const typeExerciseUid = exerciseData.typeUid;

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

  if (deleteSuperSets) {
    batch = deleteExerciseFromSuperSet(exerciseUid, dayUid, batch);
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
