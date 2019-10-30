import React, {FunctionComponent, useContext} from 'react';
import {Button, ButtonDropdown, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import * as i18next from 'i18next';
import {ExerciseHeaderEditCtx} from '../Exercise/ExerciseTypeContainer';

const ExerciseContainerFooter: FunctionComponent<IExistingSetFooter> = ({detailedDayView, addSetViewVisible, dropdownVisible, toggleActionDropdown, setAddSetViewVisible, t, exerciseDeleteStep2Shown, setExerciseDeleteStep2Shown, delExercise}) => {
  const [headerEditVisible, setHeaderEditVisible] = useContext(ExerciseHeaderEditCtx);

  if (!detailedDayView || addSetViewVisible) return null;

  return (<tfoot>
  <tr>
    <td colSpan={3}>
      <ButtonGroup className="w-100">
        <Button color="success" block onClick={() => setAddSetViewVisible(!addSetViewVisible)}>{t("Add set")}</Button>
        <ButtonDropdown isOpen={dropdownVisible} toggle={toggleActionDropdown}>
          <DropdownToggle caret>
            {t("Actions")}
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={() => setHeaderEditVisible(true)} disabled={headerEditVisible}>
              {`${t("Edit")} ${t("name")}`}
            </DropdownItem>
            <DropdownItem toggle={false}>
              {!exerciseDeleteStep2Shown && <span onClick={() => setExerciseDeleteStep2Shown(true)}>{t("Delete")} {t("exercise")}</span>}
              {exerciseDeleteStep2Shown && <span className="text-danger" onClick={delExercise}>{t("Click again to delete!")}</span>}
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </ButtonGroup>
    </td>
  </tr>
  <tr>
    <td className="text-muted text-center font-italic" colSpan={3}><small>{t("Click on a set for different actions")}</small></td>
  </tr>
  </tfoot>)
};

interface IExistingSetFooter {
  detailedDayView: boolean,
  addSetViewVisible: boolean,
  dropdownVisible: boolean,
  toggleActionDropdown: (() => void),
  setAddSetViewVisible: ((visible: boolean) => void),
  t: i18next.TFunction,
  exerciseDeleteStep2Shown: boolean,
  setExerciseDeleteStep2Shown: ((visible: boolean) => void),
  delExercise: (() => void),
}

export default ExerciseContainerFooter;
