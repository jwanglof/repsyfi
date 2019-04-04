import {IBaseModel} from './IBaseModel';

export interface ISetModel extends IBaseModel {
  index: number,
  amountInKg: number,
  reps: number
}