import format from 'date-fns/format';
import isNil from 'lodash-es/isNil';
import React, {useState} from 'react';

import AddToClassroom from './AddToClassroom';
import CenterAll from './layout/CenterAll';
import CloneProgramMaterials from './CloneProgramMaterials';
import CoursePicker from './CoursePicker';
import DatePicker from './DatePicker';
import LessonForm from './LessonForm';
import LessonPicker from './LessonPicker';
import UnitPicker from './UnitPicker';
import ProgramForm from './ProgramForm';
import LessonMaterials from './LessonMaterials';

export default function LessonPlanner() {
  const [classroomMaterials, setClassroomMaterials] = useState();
  const [course, setCourse] = useState();
  const [date, setDate] = useState();
  const [dueDate, setDueDate] = useState();
  const [lessonPlan, setLessonPlan] = useState();
  const [masterLesson, setMasterLesson] = useState();
  const [programDetails, setProgramDetails] = useState();
  const [programLesson, setProgramLesson] = useState();
  const [unit, setUnit] = useState();

  if (isNil(course)) {
    return <CoursePicker onPick={setCourse} />;
  } else if (isNil(programDetails)) {
    return (
      <ProgramForm
        course={course}
        onSubmit={setProgramDetails}
      />
    );
  } else if (isNil(unit))  {
    return <UnitPicker onPick={setUnit} />;
  } else if (isNil(masterLesson)) {
    return (
      <LessonPicker
        unit={unit}
        onPick={setMasterLesson}
      />
    );
  } else if (isNil(programLesson)) {
    return (
      <CloneProgramMaterials
        date={date}
        masterMaterials={masterLesson.materials}
        programDetails={programDetails}
        onCloned={(materials) => {
          setProgramLesson({...masterLesson, materials});
        }}
      />
    );
  } else if (isNil(date)) {
    return <DatePicker onPick={setDate} />;
  } else if (isUndefined(lessonPlan)) {
    return (
      <LessonForm
        lessonMaterials={programLesson.materials}
        onSubmit={setLessonPlan}
      />
    );
  } else if (isNil(classroomMaterials)) {
    return (
      <AddToClassroom
        course={course}
        date={date}
        lesson={programLesson}
        lessonPlan={lessonPlan}
        programDetails={programDetails}
        onComplete={setClassroomMaterials}
      />
    );
  } else {
    return (
      <CenterAll>
        <p>Program: {course.name}</p>
        <p>Unit: {unit.name}</p>
        <p>Lesson: {programLesson.materials.slides.name}</p>
        <p>Date: {format(date, 'MMMM d')}</p>
        <p>Program materials:</p>
        <LessonMaterials lessonMaterials={programLesson.materials} />
        <p>
          <a
            href={course.alternateLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in Google Classroom
          </a>
        </p>
      </CenterAll>
    );
  }
}
