import {loadCourses} from '../clients/google';
import noop from 'lodash-es/noop';
import Picker from './Picker';
import React, {useState} from 'react';
import {useAsyncEffect} from 'use-async-effect';

export default function CoursePicker({onPick}) {
  const [courses, setCourses] = useState(null);

  useAsyncEffect(async () => {
    setCourses(await loadCourses());
  }, noop, []);

  return (
    <Picker
      header="Select a program"
      items={courses}
      itemKey="id"
      itemLabel="name"
      onPick={onPick}
    />
  );
}
