import React, {FunctionComponent} from 'react';
import {useTranslation} from 'react-i18next';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import {ISetBasicModel} from '../../../models/ISetModel';
import SetsTableRowFormRender from '../SetsTableRowFormRender';
import {SetTypesEnum} from '../../../enums/SetTypesEnum';

const SetsSecondsTableRowForm: FunctionComponent<ISetsSecondsTableRowFormProps> = ({ exerciseUid, initialData, setAddSetViewVisible }) => {
  const { t } = useTranslation();

  if (!exerciseUid) {
    return <tr><td colSpan={3}><ErrorAlert errorText="Need an exercise UID to add a set!" componentName="SetsSecondsTableRowForm"/></td></tr>;
  }

  return <SetsTableRowFormRender initialData={initialData} setAddSetViewVisible={setAddSetViewVisible} t={t} setTypeShown={SetTypesEnum.SET_TYPE_SECONDS} exerciseUid={exerciseUid}/>;
};

interface ISetsSecondsTableRowFormProps {
  exerciseUid: string,
  initialData: ISetBasicModel,
  setAddSetViewVisible: ((visible: boolean) => void),
}

export default SetsSecondsTableRowForm;