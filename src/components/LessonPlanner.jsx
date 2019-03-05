import format from 'date-fns/format';
import isUndefined from 'lodash-es/isUndefined';
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
  const [lessonPlan, setLessonPlan] = useState();
  const [masterMaterials, setMasterMaterials] = useState();
  const [programDetails, setProgramDetails] = useState();
  const [programMaterials, setProgramMaterials] = useState();
  const [unit, setUnit] = useState();

  if (isUndefined(course)) {
    return <CoursePicker onPick={setCourse} />;
  } else if (isUndefined(programDetails)) {
    return (
      <ProgramForm
        course={course}
        onSubmit={setProgramDetails}
      />
    );
  } else if (isUndefined(unit))  {
    return <UnitPicker onPick={setUnit} />;
  } else if (isUndefined(masterMaterials)) {
    return (
      <LessonPicker
        unit={unit}
        onPick={setMasterMaterials}
      />
    );
  } else if (isUndefined(programMaterials)) {
    return (
      <CloneProgramMaterials
        date={date}
        masterMaterials={masterMaterials}
        programDetails={programDetails}
        onCloned={setProgramMaterials}
      />
    );
  } else if (isUndefined(date)) {
    return <DatePicker onPick={setDate} />;
  } else if (isUndefined(lessonPlan)) {
    return (
      <LessonForm
        lessonMaterials={programMaterials}
        onSubmit={setLessonPlan}
      />
    );
  } else if (isUndefined(classroomMaterials)) {
    return (
      <AddToClassroom
        course={course}
        date={date}
        lessonPlan={lessonPlan}
        programDetails={programDetails}
        programMaterials={programMaterials}
        onComplete={setClassroomMaterials}
      />
    );
  } else {
    return (
      <CenterAll>
        <p>Program: {course.name}</p>
        <p>Unit: {unit.name}</p>
        <p>Lesson: {masterMaterials.slides.name}</p>
        <p>Date: {format(date, 'MMMM d')}</p>
        <p>Program materials:</p>
        <LessonMaterials lessonMaterials={programMaterials} />
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
