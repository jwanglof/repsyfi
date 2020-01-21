import React, {Dispatch, FunctionComponent, SetStateAction, useContext} from 'react';
import {ExerciseHeaderEditCtx} from '../ExerciseTypeContainer';
import {IExerciseModel} from '../../../models/IExerciseModel';
import {EXERCISE_HEADER_TYPES} from './ExerciseHeaderHelpers';
import ExerciseHeaderView from './ExerciseHeaderView';
import ExerciseHeaderEditNameForm from './ExerciseHeaderEditNameForm';
import {IExercisesSuperSetsModel} from '../../../models/IExercisesSuperSetsModel';
import ExerciseHeaderSuperSetForm from './ExerciseHeaderSuperSetForm';

const ExerciseHeaderContainer: FunctionComponent<IExerciseHeaderContainerProps> = ({exerciseData, superSetData, setInitialSuperSetData}) => {
  const headerEditVisible = useContext(ExerciseHeaderEditCtx)[0];

  return (<>
    {headerEditVisible === EXERCISE_HEADER_TYPES.SHOW_EXERCISE_NAME && <ExerciseHeaderView exerciseData={exerciseData} superSetName={superSetData?.name}/>}
    {headerEditVisible === EXERCISE_HEADER_TYPES.EDIT_EXERCISE_NAME && <ExerciseHeaderEditNameForm exerciseData={exerciseData}/>}
    {headerEditVisible === EXERCISE_HEADER_TYPES.EDIT_SUPER_SET && <ExerciseHeaderSuperSetForm exerciseData={exerciseData} superSetData={superSetData} setInitialSuperSetData={setInitialSuperSetData}/>}
  </>);
};

interface IExerciseHeaderContainerProps {
  exerciseData: IExerciseModel
  superSetData?: IExercisesSuperSetsModel
  setInitialSuperSetData: Dispatch<SetStateAction<IExercisesSuperSetsModel | null>>
}

export default ExerciseHeaderContainer;
