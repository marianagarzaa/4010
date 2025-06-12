// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCmRuPWL-pyzIjl9kaOmCw3sqA4c-2FNDM",
    authDomain: "spruce-c8a31.firebaseapp.com",
    projectId: "spruce-c8a31",
    storageBucket: "spruce-c8a31.firebasestorage.app",
    messagingSenderId: "10861916182",
    appId: "1:10861916182:web:bbc2c9019dc50baac54537",
    measurementId: "G-0TSNY7LXMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };