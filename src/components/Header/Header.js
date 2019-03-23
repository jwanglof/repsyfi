import './Header.scss';

import React from 'react';
import {useTranslation} from 'react-i18next';
import {Col, Row} from 'reactstrap';

const Header = () => {
  const { t } = useTranslation();

  return (<header><Row className="header container text-muted">
    <Col>
      Header
    </Col>
  </Row></header>);
};

export default Header;