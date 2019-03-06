import noop from 'lodash-es/noop';
import React, {useState} from 'react';
import {useAsyncEffect} from 'use-async-effect';

import {loadLessons} from '../clients/google';

import Picker from './Picker';

export default function LessonPicker({unit, onPick}) {
  const [lessons, setLessons] = useState(null);

  useAsyncEffect(async() => {
    setLessons(null);
    setLessons(await loadLessons(unit));
  }, noop, [unit]);

  return (
    <Picker
      itemKey="lessonId"
      itemLabel={({lessonId, title}) => `${lessonId}: ${title}`}
      items={lessons}
      header="Select a lesson:"
      onPick={onPick}
    />
  );
}
