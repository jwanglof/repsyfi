import React, {Fragment} from 'react';
import {Col, Row} from 'reactstrap';

const Error = ({componentName=undefined}) => {
  return (
    <Fragment>
      <Col>
        <Row xs={12}>
          Error in {componentName ? componentName : null}...
        </Row>
      </Col>
    </Fragment>
  );
};

export default Error;