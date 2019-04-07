import React, {FunctionComponent, useState} from 'react';
import {IExerciseModel} from '../../models/IExerciseModel';
import {CardHeader} from 'reactstrap';

const TSExerciseHeaderView: FunctionComponent<TSExerciseHeaderViewProps> = ({exerciseData}) => (
  <CardHeader className="text-center pt-0 pb-0">
    <h1 className="exercise--title">{exerciseData.exerciseName}</h1>
  </CardHeader>
);

interface TSExerciseHeaderViewProps {
  exerciseData: IExerciseModel
}

export default TSExerciseHeaderView;