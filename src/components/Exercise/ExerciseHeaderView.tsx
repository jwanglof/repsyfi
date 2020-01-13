import React, {FunctionComponent, useContext} from 'react';
import {IExerciseModel} from '../../models/IExerciseModel';
import {ExerciseHeaderEditCtx} from './ExerciseTypeContainer';

const ExerciseHeaderView: FunctionComponent<IExerciseHeaderViewProps> = ({exerciseData, superSetName}) => {
  const [headerEditVisible] = useContext(ExerciseHeaderEditCtx);

  if (headerEditVisible) return null;
  return <h1 className="exercise--title">{exerciseData.exerciseName}<small className="text-muted">{superSetName && ` - ${superSetName}`}</small></h1>;
};

interface IExerciseHeaderViewProps {
  exerciseData: IExerciseModel
  superSetName: string | undefined
}

export default ExerciseHeaderView;