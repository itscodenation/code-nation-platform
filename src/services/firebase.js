import firebase from 'firebase/app';
import 'firebase/auth';

export const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;
export const CLIENT_ID = process.env.REACT_APP_FIREBASE_CLIENT_ID;
const PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID;

firebase.initializeApp({
  apiKey: API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  projectId: PROJECT_ID,
});

export const app = firebase.app();
export const auth = firebase.auth();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
