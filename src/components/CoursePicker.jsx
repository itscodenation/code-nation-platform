import {loadCourses} from '../clients/google';
import noop from 'lodash-es/noop';
import Picker from './Picker';
import React from 'react';
import {useAsyncEffect} from 'use-async-effect';
import useCollection from './hooks/useCollection';

export default function CoursePicker({onPick}) {
  const [{items: courses, isComplete}, addItems] = useCollection();

  useAsyncEffect(async () => {
    const courses = await loadCourses();
    addItems(courses, true);
  }, noop, []);

  return (
    <Picker
      header="Select a program"
      items={isComplete ? courses : null}
      itemKey="id"
      itemLabel="name"
      onPick={onPick}
    />
  );
}
