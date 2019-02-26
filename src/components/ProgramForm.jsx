import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import {Formik} from 'formik';
import isUndefined from 'lodash-es/isUndefined';
import React from 'react'
import * as yup from 'yup';

import CenterAll from './layout/CenterAll';

const yupTime = yup.number()
  .default('')
  .min(0, 'Enter a valid time')
  .max(60 * 60 * 24 * 1000, 'Enter a valid time')
  .typeError('Enter a time in the format 9:30am')
  .transform((_, originalValue) => {
    const [didMatch, hoursString, minutesString, ampm] =
      /^(\d{1,2}):(\d{2})(?: ?(am|pm))?$/i.exec(originalValue) || [];
    if (didMatch) {
      let hours = Number(hoursString);
      const minutes = Number(minutesString);

      let timestamp = minutes * 60 * 1000;
      if (!isUndefined(ampm) && ampm.toLowerCase() === 'pm') {
        hours += 12;
      }
      timestamp += hours * 60 * 60 * 1000;
      return timestamp;
    }
    return NaN;
  });

const schema = yup.object().shape({
  endTime: yupTime.required('Enter the end time'),

  lessonMaterialsFolderUrl: yup.string()
    .default('')
    .required('Enter the URL of your program\'s lesson materials folder in Google Drive')
    .url('Please enter a valid URL')
    .matches(
      /https:\/\/drive.google.com\/drive(?:.*)\/folders\/[-\w]+/,
      {
        message: 'Enter a Google Drive URL',
        excludeEmptyString: true,
      },
    ),

  programPrefix: yup.string().default('').required('Enter a program prefix'),

  startTime: yupTime.required('Enter the start time'),
}).test(
  'end-time-after-start-time',
  'Enter an end time after the start time',
  function ({startTime, endTime}) {
    if (startTime && endTime && startTime >= endTime) {
      return this.createError({path: 'endTime'});
    }
    return true;
  },
);

export default function ProgramForm({onSubmit}) {
  return (
    <CenterAll lg={8} centerText={false}>
      <Formik
        initialValues={schema.default()}
        validationSchema={schema}
        onSubmit={values => onSubmit(schema.cast(values))}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isValid,
          touched,
          values: {endTime, lessonMaterialsFolderUrl, programPrefix, startTime}
        }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>
                  Google Drive URL of team lesson materials folder
                </Form.Label>
                <Form.Control
                  isInvalid={
                    touched.lessonMaterialsFolderUrl &&
                    errors.lessonMaterialsFolderUrl
                  }
                  name="lessonMaterialsFolderUrl"
                  value={lessonMaterialsFolderUrl}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lessonMaterialsFolderUrl}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Row>
                  <Col>
                    <Form.Label>Program start time</Form.Label>
                    <Form.Control
                      isInvalid={touched.startTime && errors.startTime}
                      name="startTime"
                      value={startTime}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.startTime}
                    </Form.Control.Feedback>
                  </Col>

                  <Col>
                    <Form.Label>Program end time</Form.Label>
                    <Form.Control
                      isInvalid={touched.endTime && errors.endTime}
                      name="endTime"
                      value={endTime}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endTime}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Row>
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Prefix to use for program's copies of lesson materials
                </Form.Label>
                <Form.Control
                  isInvalid={
                    touched.programPrefix &&
                    errors.programPrefix
                  }
                  name="programPrefix"
                  value={programPrefix}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.programPrefix}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Button
                  disabled={!isValid}
                  type="submit"
                >
                  Continue
                </Button>
              </Form.Group>
            </Form>
          )}
      </Formik>
    </CenterAll>
  );
}

