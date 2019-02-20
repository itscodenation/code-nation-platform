import {createContext} from 'react';
import {useImmerReducer} from 'use-immer';

export const StateContext = createContext();
export const DispatchContext = createContext();

const initialState = {
  clients: {
    google: {
      ready: false,
    },
  },
  session: {
    firebaseUser: null,
  }
};

function reducer(state, {type, payload = {}}) {
  switch (type) {
    case 'google-ready':
      state.clients.google.ready = true;
      break;
    case 'user-signed-in':
      state.session.firebaseUser = payload.user;
      break;
    default:
      break;
  }
}

export function useReducer() {
  return useImmerReducer(reducer, initialState);
}
