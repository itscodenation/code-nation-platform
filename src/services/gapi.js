import loadjs from 'loadjs';
import once from 'lodash-es/once';

import {API_KEY, CLIENT_ID} from './firebase';

const GAPI_SCRIPT_URL = 'https://apis.google.com/js/api.js';
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/drive',
];
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest',
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];

let isGapiLoadedAndConfigured = false;

const loadGapi = once(async() => new Promise((resolve, reject) => {
  loadjs(GAPI_SCRIPT_URL, {
    success() {
      resolve(window.gapi);
    },
    error(pathsNotFound) {
      reject(`Could not load scripts ${pathsNotFound.join(', ')}`);
    },
  });
}));

export async function loadAndConfigureGapi() {
  const gapi = await loadGapi();
  await new Promise((resolve, reject) => {
    gapi.load('client:auth2', {
      callback() {
        isGapiLoadedAndConfigured = true;
        resolve(gapi);
      },
      onerror: reject,
      timeout: 5000,
      ontimeout() {
        reject(new Error('Timed out'));
      }
    });
  });

  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scopes: SCOPES.join(' '),
  });

  await gapi.auth2.init({
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    ux_mode: 'popup',
  });
}

export function getGapiSync() {
  if (!isGapiLoadedAndConfigured) {
    throw new Error('gapi is not loaded');
  }
  return window.gapi;
}
