import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import map from 'lodash-es/map';
import noop from 'lodash-es/noop';
import React from 'react';
import Row from 'react-bootstrap/Row';
import {useAsyncEffect} from 'use-async-effect';

import {loadUnits} from '../clients/google';
import useCollection from './hooks/useCollection';
import Picker from './Picker';

export default function UnitPicker({onPick}) {
  const [{items: units, isComplete}, addItems] = useCollection();

  useAsyncEffect(async() => {
    const files = await loadUnits();
    addItems(files, true);
  }, noop, []);

  return (
    <Picker
      itemKey="id"
      itemLabel="name"
      items={isComplete ? units : null}
      header="Select a unit:"
      onPick={onPick}
    />
  );
}
