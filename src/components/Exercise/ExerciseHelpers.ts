import isEmpty from 'lodash/isEmpty';
import * as i18next from 'i18next';

interface IExerciseFormValidate {
  exerciseName?: string
}

export const exerciseFormValidation = (values: IExerciseFormValidate, t: i18next.TFunction): IExerciseFormValidate | {} => {
  const errors: IExerciseFormValidate = {};
  if (isEmpty(values.exerciseName)) {
    errors.exerciseName = `${t("Exercise name")} ${t("can't be empty")}`;
  }
  return errors;
};
