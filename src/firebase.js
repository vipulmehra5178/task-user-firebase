import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, PhoneAuthProvider, PhoneMultiFactorGenerator } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD7homTF3QiSTPdZQ0PW2pyWtp4ZyTz1JE",
    authDomain: "userauthentication-4cfad.firebaseapp.com",
    projectId: "userauthentication-4cfad",
    storageBucket: "userauthentication-4cfad.firebasestorage.app",
    messagingSenderId: "313117766342",
    appId: "1:313117766342:web:eaaf103c9cb051168b1dc7",
    measurementId: "G-JFX7J12G2B"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, PhoneAuthProvider, PhoneMultiFactorGenerator };