import {IBaseModel, IBaseModelWithoutUid} from './IBaseModel';

interface ISetsSecondsBasicModel {
  sets: Array<string>  // ISetSecondsModel
}
export interface ISetsSecondsModel extends ISetsSecondsBasicModel, IBaseModel {}
export interface ISetsSecondsModelWithoutUid extends ISetsSecondsBasicModel, IBaseModelWithoutUid {}