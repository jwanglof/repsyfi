import {IBaseModel, IBaseModelUpdating, IBaseModelWithoutUid} from './IBaseModel';

interface IExercisesSuperSetsBasicModel {
  name: string
  exercises: string[]
}

interface IExercisesSuperSetsBasicUpdateModel {
  name?: string
  exercises?: string[]
}

export interface IExercisesSuperSetsModel extends IBaseModel, IExercisesSuperSetsBasicModel {}

export interface IExercisesSuperSetsModelWithoutUid extends IBaseModelWithoutUid, IExercisesSuperSetsBasicModel {}

export interface IExercisesSuperSetsUpdateModel extends IBaseModelUpdating, IExercisesSuperSetsBasicUpdateModel {}