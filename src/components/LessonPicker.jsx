import noop from 'lodash-es/noop';
import React from 'react';
import {useAsyncEffect} from 'use-async-effect';

import {loadLessons} from '../clients/google';

import Picker from './Picker';
import useCollection from './hooks/useCollection';

export default function LessonPicker({unit, onPick}) {
  const [
    {items: lessons, isComplete},
    addItems,
    resetLessons,
  ] = useCollection();

  useAsyncEffect(async() => {
    resetLessons();
    const files = await loadLessons(unit);
    addItems(files, true);
  }, noop, [unit]);

  return (
    <Picker
      itemKey="slides.id"
      itemLabel="slides.name"
      items={isComplete ? lessons : null}
      header="Select a unit:"
      onPick={onPick}
    />
  );
}
