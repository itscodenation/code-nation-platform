import Form from 'react-bootstrap/Form';
import {Formik} from 'formik';
import React from 'react';
import * as yup from 'yup';

import CenterAll from './layout/CenterAll';

export default function LessonForm({onSubmit}) {
  return (
    <CenterAll centerText={false} lg={8}>
      <Formik
        initialValues={{
          doNowPrompt: '',
          objective: '',
        }}
        validationSchema={yup.object().shape({
          doNowPrompt: yup.string().required('Enter a Do Now prompt'),
          objective: yup.string().required('Enter a lesson objective'),
        })}
        onSubmit={values => onSubmit(values)}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit
        }) => {
          console.log({touched});
          return <Form noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Do Now Prompt:</Form.Label>
                <Form.Control
                  as="textarea"
                  isInvalid={touched.doNowPrompt && errors.doNowPrompt}
                  name="doNowPrompt"
                  value={values.doNowPrompt}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.doNowPrompt}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Lesson Objective</Form.Label>
                <Form.Control
                  as="textarea"
                  isInvalid={touched.objective && errors.objective}
                  name="objective"
                  value={values.objective}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.objective}
                </Form.Control.Feedback>
            </Form.Group>
          </Form>;
        }}
      </Formik>
    </CenterAll>
  );
}
