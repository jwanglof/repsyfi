import {IBaseModel} from './IBaseModel';

export interface IDayModel extends IBaseModel {
  startTimestamp: number,
  endTimestamp: number,
  location: string,
  muscleGroups: Array<string>,
  title: string,
  notes: string,
  exercises: Array<string>  // IExerciseModel
}