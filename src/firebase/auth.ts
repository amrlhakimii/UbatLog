import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './config';

const provider = new GoogleAuthProvider();

export function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}

export function signOut() {
  return firebaseSignOut(auth);
}
