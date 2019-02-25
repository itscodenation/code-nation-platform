import isNull from 'lodash-es/isNull';
import partial from 'lodash-es/partial';
import React from 'react';

import CoursePicker from './CoursePicker';
import DatePicker from './DatePicker';
import LessonForm from './LessonForm';
import LessonPicker from './LessonPicker';
import UnitPicker from './UnitPicker';
import {useImmer} from 'use-immer';
import {format} from 'date-fns';

export default function LessonPlanner() {
  const [{course, date, materials, responses, unit}, updateLesson] = useImmer({
    course: null,
    date: null,
    materials: null,
    responses: null,
    unit: null,
  });

  function setLessonProp(prop, value) {
    return updateLesson((draft) => {
      draft[prop] = value;
    });
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
  } else if (isNull(responses)) {
    return <LessonForm onSubmit={partial(setLessonProp, 'responses')} />;
  } else {
    return (
      <div>
        <p>Program: {course.name}</p>
        <p>Unit: {unit.name}</p>
        <p>Lesson: {materials.slides.name}</p>
        <p>Date: {format(date, 'MMMM d')}</p>
        <p>Responses: <pre>{JSON.stringify(responses)}</pre></p>
      </div>
    );
  }
}
