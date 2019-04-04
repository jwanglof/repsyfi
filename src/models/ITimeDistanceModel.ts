import {IBaseModel, IBaseModelWithoutUid} from './IBaseModel';

export interface ITimeDistanceBasicModel {
  totalTimeSeconds: number,
  totalDistanceMeter: number,
  totalWarmupSeconds: number,
  totalKcal: number,
  speedMin: number,
  speedMax: number,
  inclineMin: number,
  inclineMax: number
}

export interface ITimeDistanceModel extends ITimeDistanceBasicModel, IBaseModel {}
export interface ITimeDistanceModelWithoutUid extends ITimeDistanceBasicModel, IBaseModelWithoutUid {}