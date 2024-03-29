// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBi-kWJ091WgznkX5WSfJZGo50Kmkfkp20",
  authDomain: "onespotapp-45841.firebaseapp.com",
  databaseURL: "https://onespotapp-45841-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "onespotapp-45841",
  storageBucket: "onespotapp-45841.appspot.com",
  messagingSenderId: "414345920391",
  appId: "1:414345920391:web:e8d3eb4fe6342135c35d22",
  measurementId: "G-R2ME43GQYD",
  clientId: "414345920391-du9k4dacovq09q49q6dgqsqnp3vdf4fm.apps.googleusercontent.com",
  scopes: ['email', 'profile', 'https://www.googleapis.com/auth/calendar', 'openid'],
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
const db = getFirestore(app);
export default db;
