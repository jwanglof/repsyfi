export interface IBaseModel extends IBaseModelWithoutUid {
  uid: string
}

export interface IBaseModelWithoutUid {
  ownerUid: string,
  createdTimestamp: number,
  version: Versions
}

export interface IBaseModelUpdating {
  updatedTimestamp: number
}

export enum Versions {
  v1 = "v1"
}
