import noop from 'lodash-es/noop';
import React, {useState} from 'react';
import {useAsyncEffect} from 'use-async-effect';

import {loadUnits} from '../clients/google';
import Picker from './Picker';

export default function UnitPicker({onPick}) {
  const [units, setUnits] = useState();

  useAsyncEffect(async() => {
    setUnits(await loadUnits());
  }, noop, []);

  return (
    <Picker
      itemKey="id"
      itemLabel="name"
      items={units}
      header="Select a unit:"
      onPick={onPick}
    />
  );
}
