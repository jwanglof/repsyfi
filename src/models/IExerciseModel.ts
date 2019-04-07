import {IBaseModel, IBaseModelWithoutUid} from './IBaseModel';
import {ExerciseTypesEnum} from '../enums/ExerciseTypesEnum';

export interface IExerciseHeaderModel {
  exerciseName: string
}
export interface IExerciseBasicModel extends IExerciseHeaderModel {
  type: ExerciseTypesEnum,
  typeUid: string
}
export interface IExerciseModel extends IBaseModel, IExerciseBasicModel {}
export interface IExerciseModelWithoutUid extends IBaseModelWithoutUid, IExerciseBasicModel {}