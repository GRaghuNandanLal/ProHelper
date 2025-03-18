// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Ensure this line is present

const firebaseConfig = {
  // apiKey: "AIzaSyChpymChpH_ahinNigRzI6_vCgldoPTWcA",
  // authDomain: "serviceproviderdb-341fe.firebaseapp.com",
  // projectId: "serviceproviderdb-341fe",
  // storageBucket: "serviceproviderdb-341fe.appspot.com",
  // messagingSenderId: "670698719360",
  // appId: "1:670698719360:web:02ba0ac465bbe393ec7e65",
  // measurementId: "G-ZMD6WMNMKT"
  apiKey: "AIzaSyAGvy2S8ZWUrgCO3zrEd8igQbk6WRJ-sO8",
  authDomain: "skillmatchdb1.firebaseapp.com",
  projectId: "skillmatchdb1",
  storageBucket: "skillmatchdb1.appspot.com",
  messagingSenderId: "553868990007",
  appId: "1:553868990007:web:5e08931a9c8bd1455591b2",
  measurementId: "G-TQ0JEMYVNV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
