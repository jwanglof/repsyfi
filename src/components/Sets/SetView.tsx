import React, {FunctionComponent, useContext} from 'react';
import {ISetModel} from '../../models/ISetModel';
import classnames from 'classnames';
import {Col, Row} from 'reactstrap';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {SetsExerciseViewShowButtonCtx} from './SetsExerciseView';

const SetView: FunctionComponent<ISetViewProps> = ({setEditVisible, disabled, exerciseType, currentData}) => {
  const setButtonsIsShown = useContext(SetsExerciseViewShowButtonCtx);

  const onClick = () => {
    if (!disabled) {
      setEditVisible(true);
      setButtonsIsShown(false);
    }
  };

  const classNames = classnames('one-set', {
    "one-set--muted": disabled
  });

  return (
    <Row className={classNames} onClick={onClick}>
      <Col xs={2} className="pb-1 pt-1"><strong>{currentData.index}</strong></Col>
      <Col xs={5} className="pb-1 pt-1">{currentData.amountInKg}</Col>
      {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS && <Col xs={5} className="pb-1 pt-1">{currentData.reps}</Col>}
      {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS && <Col xs={5} className="pb-1 pt-1">{currentData.seconds}</Col>}
    </Row>
  );
};

interface ISetViewProps {
  setEditVisible: ((editVisible: boolean) => void)
  disabled: boolean
  exerciseType: ExerciseTypesEnum
  currentData: ISetModel
}

export default SetView;
