import isNull from 'lodash-es/isNull';
import React from 'react';

import LessonPlanner from './LessonPlanner';
import LoginForm from './LoginForm';
import {useStateContext} from '../store';

export default function Main() {
  const {session: {firebaseUser}} = useStateContext();

  if (isNull(firebaseUser)) {
    return <LoginForm />;
  } else {
    return <LessonPlanner />
  }
}
