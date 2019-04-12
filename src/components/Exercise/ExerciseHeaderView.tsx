import React, {FunctionComponent} from 'react';
import {IExerciseModel} from '../../models/IExerciseModel';

const ExerciseHeaderView: FunctionComponent<IExerciseHeaderViewProps> = ({exerciseData}) => (<h1 className="exercise--title">{exerciseData.exerciseName}</h1>);

interface IExerciseHeaderViewProps {
  exerciseData: IExerciseModel
}

export default ExerciseHeaderView;