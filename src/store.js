import {createContext} from 'react';

export const StateContext = createContext();
export const DispatchContext = createContext();

export const initialState = {
  clients: {
    google: {
      ready: false,
    },
  },
};

export function reducer(state, {type, payload = {}}) {
  switch (type) {
    case 'google-ready':
      state.clients.google.ready = true;
      break;
    default:
      break;
  }
}
