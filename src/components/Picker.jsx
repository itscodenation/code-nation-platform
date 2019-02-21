import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import isFunction from 'lodash-es/isFunction';
import isNull from 'lodash-es/isNull';
import ListGroup, {Item as ListGroupItem} from 'react-bootstrap/ListGroup';
import map from 'lodash-es/map';
import React from 'react';
import Row from 'react-bootstrap/Row';
import property from 'lodash-es/property';
import {partials} from 'handlebars';

export default function Picker({
  itemKey,
  itemLabel,
  items = null,
  header,
  onPick,
}) {
  const getItemKey = isFunction(itemKey) ? itemKey : property(itemKey);
  const getItemLabel = isFunction(itemLabel) ? itemKey : property(itemLabel);

  return (
    isNull(items) ? (
      <p>Loading…</p>
    ) : (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h2>{header}</h2>
            <ListGroup>
              {map(
                items,
                item =>
                  <ListGroupItem
                    action
                    key={getItemKey(item)}
                    onClick={() => onPick(item)}
                  >
                    {getItemLabel(item)}
                  </ListGroupItem>
              )}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    )
  );
}
