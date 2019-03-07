import React, {useState} from 'react'
import CenterAll from './layout/CenterAll';
import Button from 'react-bootstrap/Button';
import {addLessonToClassroom} from '../clients/google';

export default function AddToClassroom({
  course,
  date,
  dueDate,
  lesson,
  lessonPlan,
  programDetails,
  onComplete,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <CenterAll>
      <p>Add lesson materials to Google Classroom?</p>
      <Button
        disabled={isSubmitting}
        onClick={async () => {
          setIsSubmitting(true);
          onComplete(
            await addLessonToClassroom({
              course,
              date,
              dueDate,
              lesson,
              lessonPlan,
              programDetails,
            }),
          );
        }}
      >
        {isSubmitting ? 'Adding…' : 'Continue'}
      </Button>
    </CenterAll>
  )
}
