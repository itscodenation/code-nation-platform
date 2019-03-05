import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import {Formik, Field} from 'formik';
import React from 'react';
import Row from 'react-bootstrap/Row';
import * as yup from 'yup';

import CenterAll from './layout/CenterAll';
import LessonMaterials from './LessonMaterials';

const schema = yup.object().shape({
  doNowPrompt: yup.string()
    .required('Enter a Do Now prompt')
    .default(''),

  doNowStarterCodeUrl: yup.string()
    .url('Please enter a valid URL')
    .default(''),

  exitTicketPrompt: yup.string()
    .default(''),

  independentPracticeStarterCodeUrl: yup.string()
    .url('Please enter a valid URL')
    .default(''),

  objective: yup.string()
    .required('Enter a lesson objective')
    .default(''),

  vocabulary: yup.string().default(''),
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
      <Container>
        <Row>
          <Col lg={4}>
            <h3>Lesson materials</h3>
            <LessonMaterials lessonMaterials={lessonMaterials} />
          </Col>

          <Col lg={8}>
            <h3>Lesson Information</h3>
            <Formik
              initialValues={schema.default()}
              validationSchema={schema}
              onSubmit={values => onSubmit(values)}
            >
              {({handleSubmit, isValid, isSubmitting}) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Field
                    as="textarea"
                    component={LessonFormField}
                    label="Do Now prompt"
                    name="doNowPrompt"
                  />

                  <Field
                    component={LessonFormField}
                    label="Link to starter code for Do Now"
                    name="doNowStarterCodeUrl"
                    type="text"
                  />

                  <Field
                    as="textarea"
                    component={LessonFormField}
                    label="Learning objective"
                    name="objective"
                  />

                  <Field
                    as="textarea"
                    component={LessonFormField}
                    label="Vocabulary"
                    name="vocabulary"
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
                    <Button
                      disabled={!isValid || isSubmitting}
                      type="submit"
                      variant="primary"
                    >Continue</Button>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </CenterAll>
  );
}
