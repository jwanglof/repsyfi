import {isNumber, isEmpty, isUndefined} from 'lodash';
import * as i18next from 'i18next';
import {ISetBasicModel} from '../../models/ISetModel';
import {SetTypesEnum} from '../../enums/SetTypesEnum';

const _isEmptyOrNegative = (value: any) => {
  if (!isUndefined(value)) {
    if (isNumber(value) && value < 0) {
      return true;
    } else if (!isNumber(value) && isEmpty(value)) {
      return true;
    }
  }
  return false;
};

const getErrorText = (key: string) => key + " must exist, and be 0 or higher";

export const setsValidation = (values: ISetsFormValidate, t: i18next.TFunction): ISetsFormValidateErrors => {
  const errors: ISetsFormValidateErrors = {};
  if (_isEmptyOrNegative(values.amountInKg)) {
    errors.amountInKg = t(getErrorText("Amount"));
  }
  if (_isEmptyOrNegative(values.reps)) {
    errors.reps = t(getErrorText("Repetitions"));
  }
  if (_isEmptyOrNegative(values.seconds)) {
    errors.seconds = t(getErrorText("Seconds"));
  }
  if (_isEmptyOrNegative(values.index)) {
    errors.index = t(getErrorText("Index"));
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
export const getLastSetData = (lastSetData: (ISetBasicModel | undefined), type: SetTypesEnum): ISetBasicModel => {
  if (!lastSetData) {
    const newVar: ISetBasicModel = {
      index: 1,
      amountInKg: 0,
    };
    if (type === SetTypesEnum.SET_TYPE_SECONDS) {
      newVar.seconds = 0;
    } else if (type === SetTypesEnum.SET_TYPE_REPS) {
      newVar.reps = 0;
    }
    return newVar;
  }
  const newVar: ISetBasicModel = {
    index: (lastSetData.index + 1),
    amountInKg: lastSetData.amountInKg,
  };
  if (type === SetTypesEnum.SET_TYPE_SECONDS) {
    newVar.seconds = lastSetData.seconds;
  } else if (type === SetTypesEnum.SET_TYPE_REPS) {
    newVar.reps = lastSetData.reps;
  }
  return newVar;
};
