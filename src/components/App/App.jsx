import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import styles from './App.module.css';
import {init as initGoogle} from '../../clients/google';
import {signInWithGoogle} from '../../clients/firebase';

initGoogle();

export default function App() {
  return (
    <div className={styles.container}>
      <Form>
        <p>Sign in with your Google account to get started:</p>
        <Form.Group>
          <Button onClick={signInWithGoogle}>Log in</Button>
        </Form.Group>
      </Form>
    </div>
  );
}
