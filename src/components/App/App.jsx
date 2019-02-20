import noop from 'lodash-es/noop';
import React from 'react';
import {useAsyncEffect} from 'use-async-effect';
import {useImmerReducer} from 'use-immer';

import {init as initGoogle} from '../../clients/google';
import {
  DispatchContext,
  StateContext,
  useReducer,
} from '../../store';
import Main from '../Main';

export default function App() {
  const [state, dispatch] = useReducer();

  useAsyncEffect(async () => {
    await initGoogle();
    dispatch({type: 'google-ready'});
  }, noop, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <Main />
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}
