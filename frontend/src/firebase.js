import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBNeBw_um2KZvM-f26g2gQclOxQKz7GRXE",
  authDomain: "crowdfunding-startup.firebaseapp.com",
  projectId: "crowdfunding-startup",
  storageBucket: "crowdfunding-startup.firebasestorage.app",
  messagingSenderId: "1063170014638",
  appId: "1:1063170014638:web:8f3a54e501f9e24dac9c3f",
  measurementId: "G-0DBJJ8L7HP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export {app, auth, db}; 
