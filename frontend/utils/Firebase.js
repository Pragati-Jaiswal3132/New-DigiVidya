// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "digividya-cc8a3.firebaseapp.com",
  projectId: "digividya-cc8a3",
  storageBucket: "digividya-cc8a3.firebasestorage.app",
  messagingSenderId: "150756547489",
  appId: "1:150756547489:web:ac1768a3e2e709e51d09e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}