import React, {useEffect, useState} from 'react';
import {Col, FormGroup, Label, Row} from 'reactstrap';
import {Formik} from 'formik';
import capitalize from 'lodash/capitalize';
import PropTypes from 'prop-types';

import {Toggle} from 'react-formik-ui'
import {getLocalHatoukenAsync} from '../../services/UserBlueprint';
import {getRoles} from '../../services/RolesApi';
import find from 'lodash/find';
import {colSmSize, labelSmSize} from '../../utils/formik-utils';

const RolesFormGroup = ({ userRoles, label, onChange }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchRoles() {
    const token = await getLocalHatoukenAsync();
    return await getRoles(token);
  }

  useEffect(() => {
    try {
      fetchRoles().then(setRoles);
    } catch (e) {
      setError(e.message || 'Unexpected error');
    }

    setLoading(false);
  }, []);

  if (loading || roles.length === 0) {
    return <div>Loading</div>
  }

  if (error) {
    return <div style={{color: 'red'}}>ERROR: {error}</div>
  }

  const labelCapitalized = capitalize(label).replace('_', ' ');

  const mappedRoles = {};
  roles.forEach(role => {
    const name = role.name;
    const foundUserRole = find(userRoles, {name});
    mappedRoles[name] = !!foundUserRole;
  });

  const toggleOnChange = values => {
    onChange(values);
    return {};
  };

  return (
    // Using validate as an ugly hack to get the change-event when a toggle is toggled
    <Formik initialValues={mappedRoles} onSubmit={() => {}} validate={toggleOnChange}>
      <FormGroup row>
        <Label for={label} sm={labelSmSize}>{labelCapitalized}</Label>
        <Col sm={colSmSize}>
          {Object.keys(mappedRoles).map(key => (
            <Row key={key}>
              <Col sm={2}>
                <Toggle className="mt-1" name={key}/>
              </Col>
              <Col sm={10}>
                {capitalize(key)}
              </Col>
            </Row>
          ))}
        </Col>
      </FormGroup>
    </Formik>
  );
};

RolesFormGroup.propTypes = {
  userRoles: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RolesFormGroup;
