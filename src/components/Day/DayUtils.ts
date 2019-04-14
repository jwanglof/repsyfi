import fromUnixTime from "date-fns/fromUnixTime";
import format from "date-fns/format";
import isEmpty from 'lodash/isEmpty';
import {dateFormat, dateFormatWithTime} from '../../utils/formik-utils';

export const getFormattedDate = (timestamp: number, dateFormat: string = dateFormatWithTime): string => {
  if (timestamp === null) {
    return "";
  }
  if (timestamp.toString().length === 13) {
    timestamp = timestamp / 1000;
  }
  const date = fromUnixTime(timestamp);
  return format(date, dateFormat);
};

export const getTitle = (title: string | null, startTimestamp: number): string => {
  // Default title is the date the exercise was added
  if (isEmpty(title) || title === null) {
    return getFormattedDate(startTimestamp || 0, dateFormat);
  }
  return title;
};

// export const buildInitialFirebaseDayData = data => ({
//   startTimestamp: data.startTimestamp,
//   location: data.location,
//   muscleGroups: data.muscleGroups,
//   title: data.title,
//   // These variables will be populated during the exercise
//   exercises: [],
//   // These variables will be populated when the exercise is done
//   endTimestamp: null
// });
//
// export const buildUpdatedFirebaseDayData = data => ({
//   startTimestamp: data.startTimestamp,
//   location: data.location,
//   muscleGroups: data.muscleGroups,
//   title: data.title,
//   endTimestamp: data.endTimestamp
// });