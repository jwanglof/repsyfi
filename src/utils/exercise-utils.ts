import {cloneDeep} from 'lodash';
import {IExercisesSuperSetsModel} from '../models/IExercisesSuperSetsModel';

export const recalculateIndexes = (startIndex: number, array: Array<any>): Array<any> => {
  const newArray = cloneDeep(array);
  for (let i = startIndex, len = newArray.length; i < len; i++) {
    newArray[i].index = newArray[i].index - 1;
  }
  return newArray;
};

export const getNextSuperSetName = (superSets: IExercisesSuperSetsModel[]): string => {
  let superSetName = '1';
  if (superSets.length) {
    // The name is auto set to integers (for now) so just add 1 to the name
    superSetName = (parseInt(superSets[superSets.length - 1].name) + 1).toString();
  }
  return superSetName;
};
