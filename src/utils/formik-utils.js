import {isNumber, isNull, isUndefined, isEmpty, isBoolean} from 'lodash';
import {format, fromUnixTime, getUnixTime, parseISO} from 'date-fns';

// Replace all empty values with an empty string
export const replaceEmptyValues = values => {
  const obj = {};
  Object.keys(values).forEach(key => {
    let value = values[key];
    if (isNull(value) || isUndefined(value)) {
      obj[key] = '';
    } else {
      obj[key] = value;
    }
  });
  return obj;
};

export const replaceEmptyValuesWithNull = values => {
  const obj = {};
  Object.keys(values).forEach(key => {
    let value = values[key];
    if (isEmpty(value) && !isNumber(value) && !isBoolean(value)) {
      obj[key] = null;
    } else {
      obj[key] = value;
    }
  });
  return obj;
};

export const labelSmSize = 4;
export const colSmSize = 8;

export const dateFormat = 'yyyy-MM-dd';
export const dateFormatWithTime = "yyyy-MM-dd HH:mm:ss";
export const timeFormat = "HH:mm";
export const timeFormatWithSeconds = "HH:mm:ss";

export const formikDatepickerToTimestamp = value => getUnixTime(parseISO(value));
export const timestampToFormikDatepickerFormat = value => format(fromUnixTime(value), dateFormat);
