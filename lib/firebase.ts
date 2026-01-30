// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyDsU00p8_jwWr-ljDuLs_0Qq8l2rDhmNxg",
    authDomain: "carhunter-52d21.firebaseapp.com",
    projectId: "carhunter-52d21",
    storageBucket: "carhunter-52d21.firebasestorage.app",
    messagingSenderId: "1066282934568",
    appId: "1:1066282934568:web:ce7138f95201b2399cb01d",
    measurementId: "G-75Q1HYFS67"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
