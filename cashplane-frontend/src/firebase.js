// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCwpg4GT1_AytA032cjexCQC8Z4IE4lr44",
  authDomain: "cashplane-1.firebaseapp.com",
  projectId: "cashplane-1",
  storageBucket: "cashplane-1.appspot.com",
  messagingSenderId: "cashplane",
  appId: "1:699865491690:web:98ad56cef3406163fd8f93",
  measurementId: "G-H097MTFS80",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// ✅ Export them for use in your app
export { auth, provider, db };
