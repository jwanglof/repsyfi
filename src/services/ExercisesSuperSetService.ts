import firebase from '../config/firebase';
import {FirebaseCollectionNames} from '../config/FirebaseUtils';
import {IExercisesSuperSetsModel} from '../models/IExercisesSuperSetsModel';
import isEmpty from 'lodash/isEmpty';

// TODO Remember to clear the cache when the super set exercise array is changed!
interface ISimpleCache {
  [excerciseUid: string]: IExercisesSuperSetsModel
}
interface ISimpleCacheArray {
  [dayUid: string]: Array<IExercisesSuperSetsModel>
}
const simpleExerciseCache: ISimpleCache = {};
const simpleDayCache: ISimpleCacheArray = {};

export const getAllSuperSets = (dayUid: string): Array<IExercisesSuperSetsModel> => {
  return simpleDayCache[dayUid];
};

const addSuperSetIfNotExistToDayCache = (dayUid: string, superSetData: IExercisesSuperSetsModel) => {
  if (simpleDayCache[dayUid] && simpleDayCache[dayUid].length) {
    const superSetExistInCahe = simpleDayCache[dayUid].some(superSet => superSet.uid === superSetData.uid);
    if (!superSetExistInCahe) {
      simpleDayCache[dayUid].push(superSetData);
    }
  } else {
    simpleDayCache[dayUid] = [superSetData];
  }
};

export const getSuperSetData = async (exerciseUid: string, dayUid: string): Promise<IExercisesSuperSetsModel | null> => {
  if (simpleExerciseCache[exerciseUid]) {
    return Promise.resolve(simpleExerciseCache[exerciseUid]);
  }
  return firebase
    .firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_SUPER_SET)
    .where("exercises", "array-contains", exerciseUid)
    .limit(1)
    .get()
    .then((querySnapshot: any) => {
      let dsa: IExercisesSuperSetsModel | null = null;
      querySnapshot.forEach((queryData: any) => {
        if (queryData.exists && !isEmpty(queryData.data())) {
          const data = queryData.data()!;
          const superSetData = {
            uid: queryData.id,
            ownerUid: data.ownerUid,
            createdTimestamp: data.createdTimestamp,
            version: data.version,
            name: data.name,
            exercises: data.exercises
          };
          // Add data to the different caches
          data.exercises.forEach((exUid: string) => {
            simpleExerciseCache[exUid] = superSetData;
            addSuperSetIfNotExistToDayCache(dayUid, superSetData);
          });
          dsa = superSetData;
        }
      });
      return dsa;
    });
};
