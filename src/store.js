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
};

function reducer(state, {type, payload = {}}) {
  switch (type) {
    case 'google-ready':
      state.clients.google.ready = true;
      break;
    default:
      break;
  }
}

export function useReducer() {
  return useImmerReducer(reducer, initialState);
}
