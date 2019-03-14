import "./OneSet.scss";

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {getSpecificExercise} from 'components/Exercise/ExerciseService';
import isString from 'lodash/isString';
import {getSpecificSet} from 'components/Set/SetService';
import {Col} from 'reactstrap';
import ErrorAlert from 'components/ErrorAlert/ErrorAlert';
import isEmpty from 'lodash/isEmpty';
import Loading from 'components/shared/Loading';

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

  console.log(45554, setUid, currentData);

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