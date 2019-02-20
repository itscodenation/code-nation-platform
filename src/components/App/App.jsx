import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import noop from 'lodash-es/noop';
import {useImmerReducer} from 'use-immer';

import {init as initGoogle} from '../../clients/google';
import {signInWithGoogle} from '../../clients/firebase';
import {useAsyncEffect} from 'use-async-effect';

import styles from './App.module.css';

function reducer(state, {type, payload = {}}) {
  switch (type) {
    case 'google-ready':
      state.clients.google.ready = true;
      break;
    default:
      break;
  }
}

export default function App() {
  const [state, dispatch] = useImmerReducer(
    reducer,
    {clients: {google: {ready: false}}},
  );

  useAsyncEffect(async () => {
    await initGoogle();
    dispatch({type: 'google-ready'});
  }, noop, []);

  return (
    <div className={styles.container}>
      {
        state.clients.google.ready ?
          (
            <Form>
              <p>Sign in with your Google account to get started:</p>
              <Form.Group>
                <Button onClick={signInWithGoogle}>Log in</Button>
              </Form.Group>
            </Form>
          ) : (
            <div>Loading…</div>
          )
      }
    </div>
  );
}
