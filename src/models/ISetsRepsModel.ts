import {IBaseModel, IBaseModelWithoutUid} from './IBaseModel';

interface ISetsRepsBasicModel {
  sets: Array<string>  // ISetModel
}
export interface ISetsRepsModel extends ISetsRepsBasicModel, IBaseModel {}
export interface ISetsRepsModelWithoutUid extends ISetsRepsBasicModel, IBaseModelWithoutUid {}