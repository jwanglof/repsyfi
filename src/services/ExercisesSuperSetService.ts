import firebase from '../config/firebase';
import {FirebaseCollectionNames} from '../config/FirebaseUtils';
import {IExercisesSuperSetsModel} from '../models/IExercisesSuperSetsModel';
import isEmpty from 'lodash/isEmpty';

// TODO Remember to clear the cache when the super set exercise array is changed!
interface ISimpleCache {
  [key: string]: IExercisesSuperSetsModel
}
const simpleCache: ISimpleCache = {};

export const getSuperSetData = async (exerciseUid: string): Promise<IExercisesSuperSetsModel | null> => {
  if (simpleCache[exerciseUid]) {
    return Promise.resolve(simpleCache[exerciseUid]);
  }
  return firebase
    .firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_EXERCISE_SUPER_SET)
    .where("exercises", "array-contains", exerciseUid)
    .limit(1)
    .get()
    .then((querySnapshot: any) => {
      let dsa: IExercisesSuperSetsModel | null = null;
      querySnapshot.forEach((q: any) => {
        if (q.exists && !isEmpty(q.data())) {
          const data = q.data()!;
          const superSetData = {
            uid: q.id,
            ownerUid: data.ownerUid,
            createdTimestamp: data.createdTimestamp,
            version: data.version,
            name: data.name,
            exercises: data.exercises
          };
          data.exercises.forEach((exUid: string) => {
            simpleCache[exUid] = superSetData;
          });
          dsa = superSetData;
        }
      });
      return dsa;
    });
};
