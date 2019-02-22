import classnames from 'classnames';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React from 'react';
import Row from 'react-bootstrap/Row';

export default function CenterAll({children}) {
  return (
    <Container>
      <Row className={classnames(
        'align-items-center',
        'justify-content-center',
        'mh-100',
        'text-center',
        'vh-100'
      )}>
        <Col md="auto">
          {children}
        </Col>
      </Row>
    </Container>
  );
}
