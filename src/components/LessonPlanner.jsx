import isNull from 'lodash-es/isNull';
import partial from 'lodash-es/partial';
import React, {useState} from 'react';

import CoursePicker from './CoursePicker';
import DatePicker from './DatePicker';
import LessonPicker from './LessonPicker';
import UnitPicker from './UnitPicker';
import {useImmer} from 'use-immer';
import {format} from 'date-fns';

export default function LessonPlanner() {
  const [{course, date, materials, unit}, updateLesson] = useImmer({
    course: null,
    date: null,
    materials: null,
    unit: null,
  });

  function setLessonProp(prop, value) {
    return updateLesson(draft => { draft[prop] = value; });
  }

  if (isNull(course)) {
    return <CoursePicker onPick={partial(setLessonProp, 'course')} />;
  } else if (isNull(unit))  {
    return <UnitPicker onPick={partial(setLessonProp, 'unit')} />;
  } else if (isNull(materials)) {
    return (
      <LessonPicker
        unit={unit}
        onPick={partial(setLessonProp, 'materials')}
      />
    );
  } else if (isNull(date)) {
    return <DatePicker onPick={partial(setLessonProp, 'date')} />;
  } else {
    return (
      <div>
        <p>Program: {course.name}</p>
        <p>Unit: {unit.name}</p>
        <p>Lesson: {materials.slides.name}</p>
        <p>Date: {format(date, 'MMMM D')}</p>
      </div>
    );
  }
}
