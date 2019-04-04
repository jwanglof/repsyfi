import {IBaseModel, IBaseModelWithoutUid} from './IBaseModel';
import {ExerciseTypesEnum} from '../enums/ExerciseTypesEnum';

export interface IExerciseBasicModel {
  exerciseName: string,
  type: ExerciseTypesEnum,
  typeUid: string
}
export interface IExerciseModel extends IBaseModel, IExerciseBasicModel {}
export interface IExerciseModelWithoutUid extends IBaseModelWithoutUid, IExerciseBasicModel {}