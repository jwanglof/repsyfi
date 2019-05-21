import {IBaseModel, IBaseModelUpdating, IBaseModelWithoutUid} from './IBaseModel';

export interface ISetSecondsBasicModel {
  index: number,
  amountInKg: number,
  seconds: number,
}

export interface ISetSecondsModel extends IBaseModel, ISetSecondsBasicModel {}

export interface ISetSecondsModelWithoutUid extends IBaseModelWithoutUid, ISetSecondsBasicModel {}

export interface ISetSecondsBasicUpdateModel {
  amountInKg: number,
  seconds: number,
}

export interface ISetSecondsUpdateModel extends ISetSecondsBasicUpdateModel, IBaseModelUpdating {}