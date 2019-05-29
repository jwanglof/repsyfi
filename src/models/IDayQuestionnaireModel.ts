import {IBaseModel, IBaseModelUpdating, IBaseModelWithoutUid} from './IBaseModel';

export interface IDayQuestionnaireBasicModelV1 {
  stretched: boolean,
  totalStretchSeconds: number,
  feeling: FEELING
}

export interface IDayQuestionnaireModelV1 extends IDayQuestionnaireBasicModelV1, IBaseModel {}
export interface IDayQuestionnaireModelV1WithoutUid extends IDayQuestionnaireBasicModelV1, IBaseModelWithoutUid {}

export interface IDayQuestionnaireBasicUpdateModelV1 {
  stretched: boolean,
  totalStretchSeconds?: number,
  feeling: FEELING
}

export interface IDayQuestionnaireUpdateModelV1 extends IDayQuestionnaireBasicUpdateModelV1, IBaseModelUpdating {}

export enum FEELING {
  WORST = 'worst',
  BAD = 'bad',
  NEUTRAL = 'neutral',
  GOOD = 'good',
  GOD_LIKE = 'god-like'
}
