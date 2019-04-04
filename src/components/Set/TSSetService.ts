import firebase, {FIRESTORE_COLLECTION_SETS} from '../../config/firebase';

export const deleteSet = async (setUid: string): Promise<void> => {
  return await firebase.firestore()
    .collection(FIRESTORE_COLLECTION_SETS)
    .doc(setUid)
    .delete();
};