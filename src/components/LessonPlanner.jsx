import isNull from 'lodash-es/isNull';
import React, {useState} from 'react';

import CoursePicker from './CoursePicker';
import LessonPicker from './LessonPicker';
import UnitPicker from './UnitPicker';

export default function LessonPlanner() {
  const [course, setCourse] = useState(null);
  const [unit, setUnit] = useState(null);
  const [lesson, setLesson] = useState(null);

  if (isNull(course)) {
    return <CoursePicker onPick={setCourse} />;
  } else if (isNull(unit))  {
    return <UnitPicker onPick={setUnit} />;
  } else if (isNull(lesson)) {
    return <LessonPicker unit={unit} onPick={setLesson} />;
  } else {
    return (
      <div>
        <p>Program: {course.name}</p>
        <p>Unit: {unit.name}</p>
        <p>Lesson: {lesson.slides.name}</p>
      </div>
    );
  }
}
