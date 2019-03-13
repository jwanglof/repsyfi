import "./OneSet.scss";

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const OneSet = ({ data, disabled }) => {

  const classNames = classnames({
    "one-set--muted": disabled
  });

  // TODO implement edit functionality
  // TODO This edit functionality needs to be disabled when disabled is true!
  return (
    <tr className={classNames}>
      <th scope="row">{data.index}</th>
      <td>{data.amountInKg}</td>
      <td>{data.reps}</td>
    </tr>
  );
};

OneSet.propTypes = {
  data: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default OneSet;