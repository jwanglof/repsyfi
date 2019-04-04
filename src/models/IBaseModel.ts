export interface IBaseModel extends IBaseModelWithoutUid{
  uid: string
}

export interface IBaseModelWithoutUid {
  ownerUid: string,
  createdTimestamp: number
}