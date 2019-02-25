import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Formik, Field} from 'formik';
import React from 'react';
import * as yup from 'yup';

import CenterAll from './layout/CenterAll';

const schema = yup.object().shape({
  doNowPrompt: yup.string()
    .required('Enter a Do Now prompt')
    .default(''),

  exitTicketPrompt: yup.string()
    .required('Enter the Exit Ticket prompt')
    .default(''),

  independentPracticeSlideUrl: yup.string()
    .url('Please enter a valid URL')
    .default(''),

  independentPracticeStarterCodeUrl: yup.string()
    .url('Please enter a valid URL')
    .default(''),

  objective: yup.string()
    .required('Enter a lesson objective')
    .default(''),
});

function LessonFormField({
  field: {name, value, onBlur, onChange},
  form: {errors, touched},
  label,
  ...props
}) {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        isInvalid={touched[name] && errors[name]}
        name={name}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        {...props}
      />
      <Form.Control.Feedback type="invalid">
        {errors[name]}
      </Form.Control.Feedback>
    </Form.Group >
  );
}

export default function LessonForm({lessonMaterials, onSubmit}) {
  return (
    <CenterAll centerText={false} lg={8}>
      <p>
        Refer to the{' '}
        <a
          href={lessonMaterials.slides.webViewLink}
          rel="noopener noreferrer"
          target="_blank"
        >lesson slides</a>
        {' '}for the below information.
      </p>

      <Formik
        initialValues={schema.default()}
        validationSchema={schema}
        onSubmit={values => onSubmit(values)}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit
        }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Field
                as="textarea"
                component={LessonFormField}
                label="Learning objective"
                name="objective"
              />

              <Field
                as="textarea"
                component={LessonFormField}
                label="Do Now prompt"
                name="doNowPrompt"
              />

              <Field
                component={LessonFormField}
                label="Link to slides for Independent Practice"
                name="independentPracticeSlideUrl"
                type="text"
              />

              <Field
                component={LessonFormField}
                label="Link to starter code for Independent Practice"
                name="independentPracticeStarterCodeUrl"
                type="text"
              />

              <Field
                as="textarea"
                component={LessonFormField}
                label="Exit ticket prompt"
                name="exitTicketPrompt"
              />

              <Form.Group>
                <Button variant="primary" type="submit">Continue</Button>
              </Form.Group>
            </Form>
          )}
      </Formik>
    </CenterAll>
  );
}
