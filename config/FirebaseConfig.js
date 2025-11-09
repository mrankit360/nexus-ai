// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-multi-model-92e23.firebaseapp.com",
  projectId: "ai-multi-model-92e23",
  storageBucket: "ai-multi-model-92e23.firebasestorage.app",
  messagingSenderId: "1083157085293",
  appId: "1:1083157085293:web:91897d00e675c4db329364",
  measurementId: "G-85018EN5FF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app)