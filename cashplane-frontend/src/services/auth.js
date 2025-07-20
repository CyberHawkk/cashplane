// Firebase login/logout
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export const googleLogin = () => signInWithPopup(auth, new GoogleAuthProvider());
export const logout = () => signOut(auth);
