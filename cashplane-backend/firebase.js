// firebase.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

// 🔐 Load Firebase Admin SDK service account
const serviceAccountPath = path.resolve(__dirname, './serviceAccountKey.json'); // Make sure this file is in .gitignore

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error('❌ Firebase service account key file not found.');
}

const serviceAccount = require(serviceAccountPath);

// ✅ Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = { db };
