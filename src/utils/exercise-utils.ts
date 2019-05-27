import {cloneDeep} from 'lodash';

export const recalculateIndexes = (startIndex: number, array: Array<any>): Array<any> => {
  const newArray = cloneDeep(array);
  for (let i = startIndex, len = newArray.length; i < len; i++) {
    newArray[i].index = newArray[i].index - 1;
  }
  return newArray;
};