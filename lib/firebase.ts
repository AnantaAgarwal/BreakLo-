import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnYxYRsK_kg6ExaUy7tO_W43rToxewD98",
  authDomain: "breaklo.firebaseapp.com",
  projectId: "breaklo",
  storageBucket: "breaklo.firebasestorage.app",
  messagingSenderId: "368050994289",
  appId: "1:368050994289:web:1355d7d2338b5e3abe2fd0",
  measurementId: "G-MBKKBHXBV9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);