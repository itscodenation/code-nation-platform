import isNull from 'lodash-es/isNull';
import React, {useState} from 'react';

import LoginForm from './LoginForm';
import LessonPlanner from './LessonPlanner';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  if (isNull(currentUser)) {
    return <LoginForm onSignedIn={setCurrentUser} />;
  } else {
    return <LessonPlanner />;
  }
}
