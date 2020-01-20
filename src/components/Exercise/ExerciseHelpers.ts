import isEmpty from 'lodash/isEmpty';
import * as i18next from 'i18next';
import {ISelectFormOptions} from '../Formik/SelectFormGroup';
import {IExercisesSuperSetsModel} from '../../models/IExercisesSuperSetsModel';

interface IExerciseFormValidate {
  exerciseName?: string
}

export enum SUPER_SET_DEFAULT_TYPES {
  EMPTY="EMPTY",
  NEW="NEW",
  REMOVE="REMOVE"
}

export const exerciseFormValidation = (values: IExerciseFormValidate, t: i18next.TFunction): IExerciseFormValidate | {} => {
  const errors: IExerciseFormValidate = {};
  if (isEmpty(values.exerciseName)) {
    errors.exerciseName = `${t("Exercise name")} ${t("can't be empty")}`;
  }
  return errors;
};

export const parseProvidedSuperSetOptions = (superSets: IExercisesSuperSetsModel[]): ISelectFormOptions[] => {
  return superSets.map((s): ISelectFormOptions => {
    return {value: s.uid, label: s.name};
  });
};
