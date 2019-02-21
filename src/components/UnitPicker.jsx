import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import map from 'lodash-es/map';
import noop from 'lodash-es/noop';
import React from 'react'
import Row from 'react-bootstrap/Row';
import {useAsyncEffect} from 'use-async-effect';

import {loadAndConfigureGapi} from '../services/gapi';
import {useImmer} from 'use-immer';

export default function UnitPicker() {
  const [{units}, updateState] = useImmer({
    units: {
      items: [],
      fullyLoaded: false,
    }
  });

  useAsyncEffect(async() => {
    const gapi = await loadAndConfigureGapi();
    const {result: {files}} = await gapi.client.drive.files.list({
      q: "'1wEfbo0L404VKNFpiOtOyQvllfiTs7CnO' in parents"
    });
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
              {map(units.items, ({name}) => <ListGroupItem>{name}</ListGroupItem>)}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    ) : (
      <p>Loading…</p>
    )
  );
}
