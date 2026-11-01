import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBGZR_EA-9q_zTNinOeCSU7Pq5hbWwK_Ek",
  authDomain: "urbanthreadsstore-f0f54.firebaseapp.com",
  projectId: "urbanthreadsstore-f0f54",
  storageBucket: "urbanthreadsstore-f0f54.firebasestorage.app",
  messagingSenderId: "1035929110327",
  appId: "1:1035929110327:web:9edf28721698a8ef663cb2",
  measurementId: "G-5QGWMTNML6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
