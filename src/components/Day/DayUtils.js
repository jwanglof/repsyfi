import fromUnixTime from "date-fns/fromUnixTime";
import format from "date-fns/format";
import isEmpty from 'lodash/isEmpty';

export const dateFormat = "yyyy-MM-dd";
export const dateFormatWithTime = "yyyy-MM-dd HH:mm:ss";

export const getFormattedDate = (timestamp, dateFormat = dateFormatWithTime) => {
  if (timestamp.toString().length === 13) {
    timestamp = timestamp / 1000;
  }
  const date = fromUnixTime(timestamp);
  return format(date, dateFormat);
};

export const getTitle = (title, startTimestamp) => {
  // Default title is the date the workout was added
  if (isEmpty(title)) {
    return getFormattedDate(startTimestamp, dateFormat);
  }
  return title;
};