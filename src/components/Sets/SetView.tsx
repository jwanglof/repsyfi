import React, {FunctionComponent, useContext} from 'react';
import {ISetModel} from '../../models/ISetModel';
import classnames from 'classnames';
import {Col, Row} from 'reactstrap';
import {ExerciseTypesEnum} from '../../enums/ExerciseTypesEnum';
import {useGlobalState} from '../../state';
import {ExerciseContainerAddSetViewVisibleCtx} from '../Exercise/ExerciseTypeContainer';

const SetView: FunctionComponent<ISetViewProps> = ({setEditVisible, exerciseType, currentData}) => {
  const showDebugInformation = useGlobalState('debugInformationShown')[0];
  const addSetViewVisible = useContext(ExerciseContainerAddSetViewVisibleCtx)[0];


  const onClick = () => {
    if (!addSetViewVisible) {
      setEditVisible(true);
      // setButtonsIsShown(false);
    }
  };

  const classNames = classnames('one-set', {
    "one-set--muted": addSetViewVisible
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
  exerciseType: ExerciseTypesEnum
  currentData: ISetModel
}

export default SetView;
