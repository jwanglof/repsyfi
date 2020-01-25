import * as i18next from 'i18next';
import {ISetModel} from '../../models/ISetModel';
import {Versions} from '../../models/IBaseModel';
import {ISetsModel} from '../../models/ISetsModel';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';

const _isEmpty = (value: any) => !value.toString() || value.toString() === '';

const _isNegative = (value: any) => _isLowerThan(value, 0.0);

const _isLowerThan = (value: any, lowerThan: number) => {
  const floatValue = parseFloat(value);
  return floatValue < lowerThan;
};

const _isNumber = (value: any) => {
  const floatValue = parseFloat(value);
  return Object.is(floatValue, NaN);
};

export const setsValidation = (values: ISetsFormValidate, t: i18next.TFunction): ISetsFormValidateErrors => {
  const errors: ISetsFormValidateErrors = {};
  const firstErrorText = `${t("must exist")}, ${t("be a number")}, ${t("and")}`;
  const {amountInKg, reps, seconds} = values;
  if (_isNumber(amountInKg) || _isEmpty(amountInKg) || _isNegative(amountInKg)) {
    errors.amountInKg = `${t("Amount")} ${firstErrorText} ${t("be 0 or higher")}`;
  }
  if (reps !== undefined && (_isNumber(reps) || _isEmpty(reps) || _isLowerThan(reps, 1))) {
    errors.reps = `${t("Repetitions")} ${firstErrorText} ${t("be 1 or higher")}`;
  }
  if (seconds !== undefined && (_isNumber(seconds) || _isEmpty(seconds) || _isLowerThan(seconds, 1))) {
    errors.seconds = `${t("Seconds")} ${firstErrorText} ${t("be 1 or higher")}`;
  }
  return errors;
};

interface ISetsFormValidate {
  amountInKg?: number,
  reps?: number,
  seconds?: number,
  index?: number,
}

interface ISetsFormValidateErrors {
  amountInKg?: string,
  reps?: string,
  seconds?: string,
  index?: string,
}

// Return the last set's data so that it can be pre-filled to the new set
export const getLastSetData = (lastSetData: (ISetModel | undefined), exerciseType: ExerciseTypesEnum): ISetModel => {
  if (!lastSetData) {
    const newVar: ISetModel = {
      createdTimestamp: 0,
      ownerUid: '',
      uid: '',
      version: Versions.v1,
      index: 1,
      amountInKg: 0
    };
    if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
      newVar.seconds = 0;
    } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
      newVar.reps = 0;
    }
    return newVar;
  }
  const newVar: ISetModel = {
    createdTimestamp: 0,
    ownerUid: lastSetData.ownerUid,
    uid: '',
    version: lastSetData.version,
    index: (lastSetData.index + 1),
    amountInKg: lastSetData.amountInKg
  };
  if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS) {
    newVar.seconds = lastSetData.seconds;
  } else if (exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS) {
    newVar.reps = lastSetData.reps;
  }
  return newVar;
};

export const getSetModelFromSnapshotData = (setUid: string, snapshotData: any): ISetModel => ({
  ownerUid: snapshotData.ownerUid,
  uid: setUid,
  createdTimestamp: snapshotData.createdTimestamp,
  version: snapshotData.version,
  seconds: snapshotData.seconds,
  reps: snapshotData.reps,
  amountInKg: snapshotData.amountInKg,
  index: snapshotData.index
});

export const getSetsModelFromSnapshotData = (exerciseUid: string, snapshotData: any): ISetsModel => ({
  sets: snapshotData.sets,
  uid: exerciseUid,
  ownerUid: snapshotData.ownerUid,
  createdTimestamp: snapshotData.createdTimestamp,
  version: snapshotData.version
});
