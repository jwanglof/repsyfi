import {IBaseModel, IBaseModelUpdating, IBaseModelWithoutUid} from './IBaseModel';
import firebase from '../config/firebase';

export interface IDayBasicModel {
  startTimestamp: number,
  endTimestamp?: number | null,
  location: string,
  muscleGroups: string,
  title: string,
  notes: string,
  exercises: Array<IDayExercisesArray>,  // IExerciseModel
  questionnaire?: string
}

export interface IDayExercisesArray {
  index: number,
  exerciseUid: string
}

export interface IDayModel extends IDayBasicModel, IBaseModel {}
export interface IDayModelWithoutUid extends IDayBasicModel, IBaseModelWithoutUid {}

export interface IDayBasicUpdateModel {
  startTimestamp?: number,
  endTimestamp?: number | firebase.firestore.FieldValue,
  location?: string,
  muscleGroups?: string,
  title?: string,
  notes?: string,
  questionnaire?: string
}

export interface IDayUpdateModel extends IDayBasicUpdateModel, IBaseModelUpdating {}
