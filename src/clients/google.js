import {getGapiSync, loadAndConfigureGapi} from '../services/gapi';

export async function init() {
  return loadAndConfigureGapi();
}

export async function signIn() {
  const gapi = getGapiSync();
  const auth = gapi.auth2.getAuthInstance();
  return auth.signIn({prompt: 'select_account'});
};
