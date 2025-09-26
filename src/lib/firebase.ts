// Firebase configuration using the blueprint integration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.VITE_FIREBASE_API_KEY,
//   authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
//   projectId: process.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
//   appId: process.env.VITE_FIREBASE_APP_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyAPKcXgBJLbmngYHfOymjkV-d3t1NmhRoU",
  authDomain: "portfolio-5e3eb.firebaseapp.com",
  projectId: "portfolio-5e3eb",
  storageBucket: "portfolio-5e3eb.appspot.com",
  messagingSenderId: "511561733367",
  appId: "1:511561733367:web:6de02fa9d4201c67e02ff2"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;