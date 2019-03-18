import "./OneSet.scss";

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import {getSpecificSet} from './SetService';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import Loading from '../shared/Loading';

const OneSetTableRow = ({ setUid, disabled, setLastSetData }) => {
  const [currentData, setCurrentData] = useState({});
  const [fetchDataError, setFetchDataError] = useState(null);

  useEffect(() => {
    const fetchSetData = async () => {
      try {
        const res = await getSpecificSet(setUid);
        if (setLastSetData) {
          setLastSetData(res);
        }
        setCurrentData(res);
      } catch (e) {
        if (isString(e)) {
          setFetchDataError(e);
        } else {
          console.error("Not just a string!", e);
        }
      }
    };

    fetchSetData();
  }, []);

  if (fetchDataError != null) {
    return <tr><td colSpan={3}><ErrorAlert errorText={fetchDataError} componentName="OneSet" uid={setUid}/></td></tr>;
  }

  if (isEmpty(currentData)) {
    return <tr><td colSpan={3}><Loading componentName="OneSet"/></td></tr>;
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

OneSetTableRow.propTypes = {
  setUid: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  setLastSetData: PropTypes.func,
};

export default OneSetTableRow;