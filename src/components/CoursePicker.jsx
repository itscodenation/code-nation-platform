import {loadCourses} from '../clients/google';
import Picker from './Picker';
import React from 'react';
import {useAsyncEffect} from 'use-async-effect';
import useCollection from './effects/useCollection';

export default function CoursePicker() {
  const [{items: courses, isComplete}, addItems] = useCollection();

  useAsyncEffect(async () => {
    const courses = await loadCourses();
    addItems(courses, true);
  }, null, []);

  return (
    <Picker
      header="Select a program"
      items={isComplete ? courses : null}
      itemKey="id"
      itemLabel="name"
    />
  );
}
