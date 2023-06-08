// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh9KIbCZA5WtpkPU7FClIzZ0NAwkE3oP0",
  authDomain: "share-with-next.firebaseapp.com",
  projectId: "share-with-next",
  storageBucket: "share-with-next.appspot.com",
  messagingSenderId: "418234877386",
  appId: "1:418234877386:web:289590579cd8b945c5fb33",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
