import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {getGapiSync, loadAndConfigureGapi} from '../../services/gapi';

import styles from './App.module.css';

loadAndConfigureGapi();

export default function App() {
  return (
    <div className={styles.container}>
      <Form>
        <p>Sign in with your Google account to get started:</p>
        <Form.Group>
          <Button onClick={async() => {
            const gapi = getGapiSync();
            const auth = gapi.auth2.getAuthInstance();
            await auth.signIn({prompt: 'select_account'});
          }}>Log in</Button>
        </Form.Group>
      </Form>
    </div>
  );
}
