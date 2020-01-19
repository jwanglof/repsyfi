import isEmpty from 'lodash/isEmpty';
import * as i18next from 'i18next';
import {ISelectFormOptions} from '../Formik/SelectFormGroup';
import {IExercisesSuperSetsModel} from '../../models/IExercisesSuperSetsModel';

interface IExerciseFormValidate {
  exerciseName?: string
}

export enum SUPER_SET_DEFAULT_TYPES {
  EMPTY="EMPTY",
  NEW="NEW"
}

export const exerciseFormValidation = (values: IExerciseFormValidate, t: i18next.TFunction): IExerciseFormValidate | {} => {
  const errors: IExerciseFormValidate = {};
  if (isEmpty(values.exerciseName)) {
    errors.exerciseName = `${t("Exercise name")} ${t("can't be empty")}`;
  }
  return errors;
};

export const getSuperSetOptions = (superSets: IExercisesSuperSetsModel[], t: i18next.TFunction): ISelectFormOptions[] => {
  const d = superSets.map((s): ISelectFormOptions => {
    return {value: s.uid, label: s.name};
  });
  const emptyOption = {value: SUPER_SET_DEFAULT_TYPES.EMPTY, label: t('No')};
  const newOption = {value: SUPER_SET_DEFAULT_TYPES.NEW, label: t('New super set')};
  d.unshift(emptyOption, newOption);
  return d;
};
