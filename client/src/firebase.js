// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "learning-blog-7c3b9.firebaseapp.com",
  projectId: "learning-blog-7c3b9",
  storageBucket: "learning-blog-7c3b9.appspot.com",
  messagingSenderId: "757383472320",
  appId: "1:757383472320:web:9822a77a0e7c709c13f925"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);