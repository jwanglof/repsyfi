import {IBaseModel, IBaseModelUpdating, IBaseModelWithoutUid} from './IBaseModel';

export interface ISetBasicModel {
  index: number,
  amountInKg: number,
  reps?: number,
  seconds?: number,
}

export interface ISetModel extends IBaseModel, ISetBasicModel {}

export interface ISetModelWithoutUid extends IBaseModelWithoutUid, ISetBasicModel {}

export interface ISetBasicUpdateModel {
  amountInKg: number,
  reps?: number,
  seconds?: number,
}

export interface ISetUpdateModel extends ISetBasicUpdateModel, IBaseModelUpdating {}