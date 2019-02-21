import React, {useState} from 'react';

import CoursePicker from './CoursePicker';
import UnitPicker from './UnitPicker';
import {isNull} from 'util';

export default function LessonPlanner() {
  const [course, setCourse] = useState(null);
  if (isNull(course)) {
    return <CoursePicker />;
  } else {
    return <UnitPicker />;
  }
}
