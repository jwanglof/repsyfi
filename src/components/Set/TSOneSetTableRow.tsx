import React, {FunctionComponent, useEffect, useState} from 'react';
import {getSet} from './TSSetService';
import {ISetModel} from '../../models/ISetModel';
import TSErrorAlert from '../ErrorAlert/TSErrorAlert';
import TSLoadingAlert from '../LoadingAlert/TSLoadingAlert';
import classnames from 'classnames';

const TSOneSetTableRow: FunctionComponent<TSOneSetTableRowProps> = ({ setUid, disabled, setLastSetData }) => {
  const [currentData, setCurrentData] = useState<ISetModel | undefined>(undefined);
  const [fetchDataError, setFetchDataError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchSetData = async () => {
      try {
        const res = await getSet(setUid);
        if (setLastSetData) {
          setLastSetData(res);
        }
        setCurrentData(res);
      } catch (e) {
        setFetchDataError(e.message);
        console.error(e);
      }
    };

    fetchSetData();
  }, []);

  if (fetchDataError) {
    return <tr><td colSpan={3}><TSErrorAlert errorText={fetchDataError} componentName="OneSet" uid={setUid}/></td></tr>;
  }

  if (!currentData) {
    return <tr><td colSpan={3}><TSLoadingAlert componentName="OneSet"/></td></tr>;
  }

  const classNames = classnames({
    "one-set--muted": disabled
  });

  // TODO implement edit functionality
  // TODO This edit functionality needs to be disabled when disabled is true!
  return (
    <tr className={classNames}>
      <th scope="row">{currentData.index}</th>
      <td>{currentData.amountInKg}</td>
      <td>{currentData.reps}</td>
    </tr>
  );
};

interface TSOneSetTableRowProps {
  setUid: string,
  disabled: boolean,
  setLastSetData?: any
}

export default TSOneSetTableRow;