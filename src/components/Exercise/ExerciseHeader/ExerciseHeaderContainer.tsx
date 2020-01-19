import React, {FunctionComponent, useContext} from 'react';
import {ExerciseHeaderEditCtx} from '../ExerciseTypeContainer';
import {IExerciseModel} from '../../../models/IExerciseModel';
import {EXERCISE_HEADER_TYPES} from './ExerciseHeaderHelpers';
import ExerciseHeaderView from './ExerciseHeaderView';
import ExerciseHeaderForm from './ExerciseHeaderForm';

const ExerciseHeaderContainer: FunctionComponent<IExerciseHeaderContainerProps> = ({exerciseData, superSetName}) => {
  const headerEditVisible = useContext(ExerciseHeaderEditCtx)[0];

  return (<>
    {headerEditVisible === EXERCISE_HEADER_TYPES.SHOW_EXERCISE_NAME && <ExerciseHeaderView exerciseData={exerciseData} superSetName={superSetName}/>}
    {headerEditVisible === EXERCISE_HEADER_TYPES.EDIT_EXERCISE_NAME && <ExerciseHeaderForm exerciseData={exerciseData}/>}
  </>);
};

interface IExerciseHeaderContainerProps {
  exerciseData: IExerciseModel
  superSetName: string | undefined
}

export default ExerciseHeaderContainer;
