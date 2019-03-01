import React, {Fragment} from 'react';
import {Col, Row} from 'reactstrap';

const Loading = ({componentName=undefined}) => {
  return (
    <Fragment>
      <Col>
        <Row xs={12}>
          Loading {componentName ? componentName : null}...
        </Row>
      </Col>
    </Fragment>
  );
};

export default Loading;