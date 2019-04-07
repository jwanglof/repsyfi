import {IBaseModel, IBaseModelWithoutUid} from './IBaseModel';

export interface ISetBasicModel {
  index: number,
  amountInKg: number,
  reps: number
}

export interface ISetModel extends IBaseModel, ISetBasicModel {}

export interface ISetModelWithoutUid extends IBaseModelWithoutUid, ISetBasicModel {}