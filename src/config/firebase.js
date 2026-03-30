import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Replace these with your actual config from Firebase Console -> Project Settings -> General -> Web App
const firebaseConfig = {
  apiKey: "AIzaSyCKHSLjB4U5PZGAXtqQ73GAmks5xlkdv8E",
  authDomain: "pragati-61ef5.firebaseapp.com",
  projectId: "pragati-61ef5",
  storageBucket: "pragati-61ef5.firebasestorage.app",
  messagingSenderId: "205919504296",
  appId: "1:205919504296:web:df2aada02e3e7db6bf7f9d",
  measurementId: "G-ZDBQKG0YMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
