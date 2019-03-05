import {auth, db, googleAuthProvider} from '../services/firebase';
import {signIn as signInToGoogle} from './google';

export async function signInWithGoogle() {
  const googleUser = await signInToGoogle();
  const googleCredential =
    googleAuthProvider.credential(googleUser.getAuthResponse().id_token);
  return auth.signInAndRetrieveDataWithCredential(googleCredential);
}

export async function saveProgramDetails(courseId, programDetails) {
  await db.collection('programs')
    .doc(courseId.toString())
    .set(programDetails);
}

export async function loadProgramDetails(courseId) {
  const doc = await db.collection('programs')
    .doc(courseId.toString())
    .get();

  if (doc.exists) {
    return doc.data();
  }
}
