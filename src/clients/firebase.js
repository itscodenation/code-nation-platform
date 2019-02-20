import {auth, googleAuthProvider} from '../services/firebase';
import {signIn as signInToGoogle} from './google';

export async function signInWithGoogle() {
  const googleUser = await signInToGoogle();
  const googleCredential =
    googleAuthProvider.credential(googleUser.getAuthResponse().id_token);
  try {
    const {user, credential, additionalUserInfo} =
      await auth.signInAndRetrieveDataWithCredential(googleCredential);
  } catch (e) {
    debugger;
    throw(e);
  }
}
