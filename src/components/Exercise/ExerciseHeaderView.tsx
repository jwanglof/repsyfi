import React, {FunctionComponent, useContext} from 'react';
import {IExerciseModel} from '../../models/IExerciseModel';
import {ExerciseHeaderEditCtx} from './ExerciseTypeContainer';

const ExerciseHeaderView: FunctionComponent<IExerciseHeaderViewProps> = ({exerciseData}) => {
  const [headerEditVisible] = useContext(ExerciseHeaderEditCtx);

  if (headerEditVisible) return null;
  return <h1 className="exercise--title">{exerciseData.exerciseName}</h1>;
};

interface IExerciseHeaderViewProps {
  exerciseData: IExerciseModel
}

export default ExerciseHeaderView;