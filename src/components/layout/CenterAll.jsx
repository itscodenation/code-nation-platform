import classnames from 'classnames';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React from 'react';
import Row from 'react-bootstrap/Row';

export default function CenterAll({centerText, children, lg, md, sm, xl, xs}) {
  return (
    <Container>
      <Row className={classnames(
        'align-items-center',
        'justify-content-center',
        'mh-100',
        'vh-100',
        {
          'text-center': centerText,
        }
      )}>
        <Col lg={lg} md={md} sm={sm} xl={xl} xs={xs}>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

CenterAll.defaultProps = {
  centerText: true,
  lg: null,
  md: 'auto',
  sm: true,
  xl: null,
  xs: null,
};
