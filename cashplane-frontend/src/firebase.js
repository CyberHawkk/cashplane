// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCwpg4GT1_AytA032cjexCQC8Z4IE4lr44",
  authDomain: "cashplane-1.firebaseapp.com",
  projectId: "cashplane-1",
  storageBucket: "cashplane-1.appspot.com",
  messagingSenderId: "699865491690",
  appId: "1:699865491690:web:98ad56cef3406163fd8f93",
  measurementId: "G-H097MTFS80",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export default app for Login.jsx
export default app;

// ✅ Named exports (optional use elsewhere)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
