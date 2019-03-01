import React from 'react';
import PropTypes from 'prop-types';

const OneSet = ({ data }) => {
  return (
    <tr>
      <th scope="row">{data.index}</th>
      <td>{data.amountInKg}</td>
      <td>{data.reps}</td>
    </tr>
  );
};

OneSet.propTypes = {
  data: PropTypes.object.isRequired
};

export default OneSet;