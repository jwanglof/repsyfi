import {IBaseModel, IBaseModelWithoutUid} from './IBaseModel';

interface ISetsBasicModel {
  sets: Array<string>  // ISetModel
}
export interface ISetsModel extends ISetsBasicModel, IBaseModel {}
export interface ISetsModelWithoutUid extends ISetsBasicModel, IBaseModelWithoutUid {}