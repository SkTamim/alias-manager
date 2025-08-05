// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // <-- Import getAuth
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLraczg4bOLUIM2wmabgaM11I_bdXuv1c",
  authDomain: "alias-manager-rh.firebaseapp.com",
  projectId: "alias-manager-rh",
  storageBucket: "alias-manager-rh.firebasestorage.app",
  messagingSenderId: "479207591625",
  appId: "1:479207591625:web:b81b5298cbaa76be788718"
};

// Initialize Firebase and export the services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // <-- Initialize and export auth
