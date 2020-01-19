import React, {FunctionComponent} from 'react';
import {IExerciseModel} from '../../../models/IExerciseModel';

const ExerciseHeaderView: FunctionComponent<IExerciseHeaderViewProps> = ({exerciseData, superSetName}) => {
  return <h1 className="exercise--title">{exerciseData.exerciseName}<small className="text-muted">{superSetName && ` - ${superSetName}`}</small></h1>;
};

interface IExerciseHeaderViewProps {
  exerciseData: IExerciseModel
  superSetName: string | undefined
}

export default ExerciseHeaderView;