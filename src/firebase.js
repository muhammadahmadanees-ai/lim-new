import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZrO41T6gz9qnsLqN9EqxiFFKFbZzjIPU",
  authDomain: "limstorepk.firebaseapp.com",
  projectId: "limstorepk",
  storageBucket: "limstorepk.firebasestorage.app",
  messagingSenderId: "215094075559",
  appId: "1:215094075559:web:8751d25ef90b7160d0bb82",
  measurementId: "G-W7RT93PM7C"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
