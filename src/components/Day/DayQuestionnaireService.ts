import {
  IDayQuestionnaireBasicModelV1,
  IDayQuestionnaireModelV1,
  IDayQuestionnaireModelV1WithoutUid, IDayQuestionnaireUpdateModelV1
} from '../../models/IDayQuestionnaireModel';
import {FirebaseCollectionNames, getDayQuestionnaireErrorObject, getNowTimestamp} from '../../config/FirebaseUtils';
import {Versions} from '../../models/IBaseModel';
import firebase from '../../config/firebase';
import {IDayUpdateModel} from '../../models/IDayModel';
import {isEmpty} from 'lodash';

export const addQuestionnaire = async (questionnaireData: IDayQuestionnaireBasicModelV1, ownerUid: string) => {
  const data: IDayQuestionnaireModelV1WithoutUid = {
    feeling: questionnaireData.feeling,
    stretched: questionnaireData.stretched,
    totalStretchSeconds: questionnaireData.totalStretchSeconds || 0,
    ownerUid,
    createdTimestamp: getNowTimestamp(),
    version: Versions.v1
  };
  const dayDocRef = await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_QUESTIONNAIRE)
    .add(data);
  return dayDocRef.id;
};

export const updateQuestionnaire = async (questionnaireData: IDayQuestionnaireBasicModelV1, questionnaireUid: string) => {
  const data: IDayQuestionnaireUpdateModelV1 = {
    feeling: questionnaireData.feeling,
    stretched: questionnaireData.stretched,
    totalStretchSeconds: questionnaireData.totalStretchSeconds || 0,
    updatedTimestamp: getNowTimestamp()
  };
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_QUESTIONNAIRE)
    .doc(questionnaireUid)
    .update(data);
  // const dayDocRef = await firebase.firestore()
  //   .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_QUESTIONNAIRE)
  //   .add(data);
  // return dayDocRef.id;
};

export const updateDayWithQuestionnaireUid = async (dayUid: string, questionnaireUid: string) => {
  const data: IDayUpdateModel = {
    updatedTimestamp: getNowTimestamp(),
    questionnaire: questionnaireUid
  };
  return await firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_DAYS)
    .doc(dayUid)
    .update(data);
};

export const getDayQuestionnaire = async (questionnaireUid: string): Promise<IDayQuestionnaireModelV1> => {
  return await getDayQuestionnaireDocument(questionnaireUid)
    .get()
    .then((querySnapshot: any) => {
      if (querySnapshot.exists && !isEmpty(querySnapshot.data())) {
        const data = querySnapshot.data()!;
        console.log(1211, data);
        return {
          stretched: data.stretched,
          totalStretchSeconds: data.totalStretchSeconds,
          feeling: data.feeling,
          uid: querySnapshot.id,
          ownerUid: data.ownerUid,
          createdTimestamp: data.createdTimestamp,
          version: data.version
        };
      } else {
        throw getDayQuestionnaireErrorObject(questionnaireUid);
      }
    });
};

export const getDayQuestionnaireDocument = (questionnaireUid: string): firebase.firestore.DocumentReference => {
  return firebase.firestore()
    .collection(FirebaseCollectionNames.FIRESTORE_COLLECTION_QUESTIONNAIRE)
    .doc(questionnaireUid);
};

