import React, {useState} from 'react';

import CoursePicker from './CoursePicker';
import UnitPicker from './UnitPicker';
import {isNull} from 'util';

export default function LessonPlanner() {
  const [course, setCourse] = useState(null);
  const [unit, setUnit] = useState(null);

  if (isNull(course)) {
    return <CoursePicker onPick={setCourse} />;
  } else if (isNull(unit))  {
    return <UnitPicker onPick={setUnit} />;
  } else {
    return (
      <div>
        <p>Program: {course.name}</p>
        <p>Unit: {unit.name}</p>
      </div>
    );
  }
}
