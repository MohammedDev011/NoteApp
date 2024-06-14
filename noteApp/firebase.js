// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore, collection} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyAIuN98n0dK1rJrvS_QLBAz9LpfvcJKA",
  authDomain: "react-note-app-f2ee7.firebaseapp.com",
  projectId: "react-note-app-f2ee7",
  storageBucket: "react-note-app-f2ee7.appspot.com",
  messagingSenderId: "286781171773",
  appId: "1:286781171773:web:bc29f1f2a3f60046c92254"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")