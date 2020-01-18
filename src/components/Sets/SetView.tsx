import React, {FunctionComponent} from 'react';
import {ISetModel} from '../../models/ISetModel';
import classnames from 'classnames';
import {Col, Row} from 'reactstrap';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {useGlobalState} from '../../state';

const SetView: FunctionComponent<ISetViewProps> = ({setEditVisible, disabled, exerciseType, currentData}) => {
  const showDebugInformation = useGlobalState('debugInformationShown')[0];

  const onClick = () => {
    if (!disabled) {
      setEditVisible(true);
      // setButtonsIsShown(false);
    }
  };

  const classNames = classnames('one-set', {
    "one-set--muted": disabled
  });

  return (
    <>
      {showDebugInformation && <Row><Col>Set UID: {currentData.uid}</Col></Row>}
      <Row className={classNames} onClick={onClick}>
        <Col xs={2} className=""><strong>{currentData.index}</strong></Col>
        <Col xs={5} className="">{currentData.amountInKg}</Col>
        {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_REPS && <Col xs={5} className="">{currentData.reps}</Col>}
        {exerciseType === ExerciseTypesEnum.EXERCISE_TYPE_SETS_SECONDS && <Col xs={5} className="">{currentData.seconds}</Col>}
      </Row>
    </>
  );
};

interface ISetViewProps {
  setEditVisible: ((editVisible: boolean) => void)
  disabled: boolean
  exerciseType: ExerciseTypesEnum
  currentData: ISetModel
}

export default SetView;
