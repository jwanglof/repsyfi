import {IBaseModel, IBaseModelUpdating, IBaseModelWithoutUid} from './IBaseModel';

export interface IDayBasicModel {
  startTimestamp: number,
  endTimestamp?: number | null,
  location: string,
  muscleGroups: string,
  title: string,
  notes: string,
  exercises: Array<string>  // IExerciseModel
}

export interface IDayModel extends IDayBasicModel, IBaseModel {}
export interface IDayModelWithoutUid extends IDayBasicModel, IBaseModelWithoutUid {}

export interface IDayBasicUpdateModel {
  startTimestamp?: number,
  endTimestamp?: number,
  location?: string,
  muscleGroups?: string,
  title?: string,
  notes?: string
}

export interface IDayUpdateModel extends IDayBasicUpdateModel, IBaseModelUpdating {}
