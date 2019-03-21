import './Header.scss';

import React from 'react';
import {useTranslation} from 'react-i18next';
import {Col, Row} from 'reactstrap';

const Header = () => {
  const { t } = useTranslation();

  return (<Row className="header container text-muted">
    <Col>
      Header
    </Col>
  </Row>);
};

export default Header;