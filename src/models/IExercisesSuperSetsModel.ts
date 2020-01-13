import {IBaseModel} from './IBaseModel';

interface IExercisesSuperSetsBasicModel {
  name: string
  exercises: string[]
}

export interface IExercisesSuperSetsModel extends IBaseModel, IExercisesSuperSetsBasicModel{}