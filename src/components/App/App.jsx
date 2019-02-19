import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import styles from './App.module.css';

export default function App(props) {
  return (
    <div className={styles.container}>
      <Form>
        <p>Sign in with your Google account to get started:</p>
        <Form.Group>
          <Button>Log in</Button>
        </Form.Group>
      </Form>
    </div>
  );
}
