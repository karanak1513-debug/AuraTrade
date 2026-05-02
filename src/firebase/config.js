import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCMRfrS4hCLUx8lFNigYbzlZm4rZ72SI2k",
  authDomain: "auratrade-dc732.firebaseapp.com",
  projectId: "auratrade-dc732",
  storageBucket: "auratrade-dc732.firebasestorage.app",
  messagingSenderId: "457102627750",
  appId: "1:457102627750:web:2b3d963af026b0bf7c3567",
  measurementId: "G-FTL8Q218B3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
