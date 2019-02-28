import React from 'react'
import CenterAll from './layout/CenterAll';
import Button from 'react-bootstrap/Button';
import {addLessonToClassroom} from '../clients/google';

export default function AddToClassroom({
  course,
  date,
  lessonPlan,
  programDetails,
  programMaterials,
}) {
  return (
    <CenterAll>
      <p>Add lesson materials to Google Classroom?</p>
      <Button
        onClick={async () => {
          await addLessonToClassroom({
            course,
            date,
            lessonPlan,
            programDetails,
            programMaterials,
          });
        }}
      >
        Continue
      </Button>
    </CenterAll>
  )
}
