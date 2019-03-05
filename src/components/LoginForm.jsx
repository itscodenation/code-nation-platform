import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {init as initGoogle} from '../clients/google';
import noop from 'lodash-es/noop';
import React, {useState} from 'react';
import {useAsyncEffect} from 'use-async-effect';

import {signInWithGoogle} from '../clients/firebase';

import CenterAll from './layout/CenterAll';

export default function Main({onSignedIn}) {
  const [isGoogleReady, updateisGoogleReady] = useState(false);

  useAsyncEffect(async () => {
    await initGoogle();
    updateisGoogleReady(true);
  }, noop, []);

  return (
    <CenterAll>
      {
        isGoogleReady ?
          (
            <Form>
              <p>Sign in with your Google account to get started:</p>
              <Form.Group>
                <Button
                  onClick={async() => {
                    const {user} = await signInWithGoogle();
                    onSignedIn(user);
                  }}
                >Log in</Button>
              </Form.Group>
            </Form>
          ) : (
            <div>Loading…</div>
          )
      }
    </CenterAll>
  );
}
