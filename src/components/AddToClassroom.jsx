import React, {useState} from 'react'
import CenterAll from './layout/CenterAll';
import Button from 'react-bootstrap/Button';
import {addLessonToClassroom} from '../clients/google';

export default function AddToClassroom({
  course,
  date,
  lessonPlan,
  programDetails,
  programMaterials,
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
              lessonPlan,
              programDetails,
              programMaterials,
            }),
          );
        }}
      >
        {isSubmitting ? 'Adding…' : 'Continue'}
      </Button>
    </CenterAll>
  )
}
