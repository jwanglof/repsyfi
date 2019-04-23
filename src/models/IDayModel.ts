import {IBaseModel, IBaseModelUpdating, IBaseModelWithoutUid} from './IBaseModel';
import {firestore} from 'firebase';

export interface IDayBasicModel {
  startTimestamp: number,
  endTimestamp?: number | null,
  location: string,
  muscleGroups: string,
  title: string,
  notes: string,
  exercises: Array<IDayExercisesArray>  // IExerciseModel
}

export interface IDayExercisesArray {
  index: number,
  exerciseUid: string
}

export interface IDayModel extends IDayBasicModel, IBaseModel {}
export interface IDayModelWithoutUid extends IDayBasicModel, IBaseModelWithoutUid {}

export interface IDayBasicUpdateModel {
  startTimestamp?: number,
  endTimestamp?: number | firestore.FieldValue,
  location?: string,
  muscleGroups?: string,
  title?: string,
  notes?: string
}

export interface IDayUpdateModel extends IDayBasicUpdateModel, IBaseModelUpdating {}
