import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import map from 'lodash-es/map';
import noop from 'lodash-es/noop';
import React from 'react';
import Row from 'react-bootstrap/Row';
import {useAsyncEffect} from 'use-async-effect';

import {useImmer} from 'use-immer';
import {loadUnits} from '../clients/google';

export default function UnitPicker() {
  const [{units}, updateState] = useImmer({
    units: {
      items: [],
      fullyLoaded: false,
    }
  });

  useAsyncEffect(async() => {
    const files = await loadUnits();
    updateState(draft => {
      draft.units.items = files;
      draft.units.fullyLoaded = true;
    });
  }, noop, []);

  return (
    units.fullyLoaded ? (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h2>Select a unit:</h2>
            <ListGroup>
              {map(
                units.items,
                ({id, name}) =>
                  <ListGroupItem action key={id}>{name}</ListGroupItem>
              )}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    ) : (
      <p>Loading…</p>
    )
  );
}
