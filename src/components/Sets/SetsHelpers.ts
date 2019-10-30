import {isNumber, isEmpty, isUndefined} from 'lodash';
import * as i18next from 'i18next';

const _checkIfEmptyAndNotNegative = (value: any) => {
  if (!isUndefined(value)) {
    if (isNumber(value) && value < 0) {
      return true;
    } else if (!isNumber(value) && isEmpty(value)) {
      return true;
    }
  }
  return false;
};

export const setsValidation = (values: ISetsFormValidate, t: i18next.TFunction): ISetsFormValidateErrors => {
  const errors: ISetsFormValidateErrors = {};
  if (_checkIfEmptyAndNotNegative(values.amountInKg)) {
    errors.amountInKg = t("Amount must exist, and be 0 or higher");
  }
  if (_checkIfEmptyAndNotNegative(values.reps)) {
    errors.reps = t("Repetitions must exist, and be higher than 0");
  }
  if (_checkIfEmptyAndNotNegative(values.seconds)) {
    errors.seconds = t("Seconds must exist, and be higher than 0");
  }
  return errors;
};

interface ISetsFormValidate {
  amountInKg?: number,
  reps?: number,
  seconds?: number,
}

interface ISetsFormValidateErrors {
  amountInKg?: string,
  reps?: string,
  seconds?: string,
}