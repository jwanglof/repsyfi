import firebase from '../../../config/firebase';
import isEmpty from 'lodash/isEmpty';
import {
  FirebaseCollectionNames,
  getNowTimestamp,
  getSetsSecondsExerciseErrorObject
} from '../../../config/FirebaseUtils';
import {Versions} from '../../../models/IBaseModel';
import {ISetsSecondsModel, ISetsSecondsModelWithoutUid} from '../../../models/ISetsSecondsModel';
import {ISetBasicModel, ISetBasicUpdateModel, ISetModelWithoutUid, ISetUpdateModel} from '../../../models/ISetModel';

export const deleteSetsSeconds = async (setUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS_SECONDS)
    .doc(setUid)
    .delete();
};

export const getSetsSecondDocument = (setUid: string) => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_SETS_SECONDS)
    .doc(setUid);
};

export const updateSetsSecondsExercise = async (setUid: string, setData: ISetBasicUpdateModel) => {
  const data: ISetUpdateModel = {
    amountInKg: setData.amountInKg,
    seconds: setData.seconds,
    updatedTimestamp: getNowTimestamp()
  };
  return await getSetsSecondDocument(setUid).update(data);
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
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS)
    .doc(exerciseUid)
    .update({sets: firebase.firestore.FieldValue.arrayUnion(setUid)});
};
//
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
  const querySnapshot = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS)
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
    throw getSetsSecondsExerciseErrorObject(exerciseUid);
  }
};

export const deleteSetsSecondsExercise = async (setsRepsUid: string): Promise<void> => {
  return await getSetsSecondsExerciseDocument(setsRepsUid).delete();
};

export const getSetsSecondsExerciseDocument = (setsSecondsUid: string): firebase.firestore.DocumentReference => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_TYPE_SETS_SECONDS)
    .doc(setsSecondsUid);
};
