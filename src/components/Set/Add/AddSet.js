import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';

const AddSet = () => {
  return (
    <Row>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
        </FormGroup>
        <Button block>Submit</Button>
      </Form>
    </Row>
  );
};

AddSet.propTypes = {
};

export default AddSet;