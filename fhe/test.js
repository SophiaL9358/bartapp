// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1jR756gqSIf84bB_TfaDOGwyHJcBiUrA",
  authDomain: "testin-56e67.firebaseapp.com",
  databaseURL: "https://testin-56e67.firebaseio.com",
  projectId: "testin-56e67",
  storageBucket: "testin-56e67.appspot.com",
  messagingSenderId: "485746421080",
  appId: "1:485746421080:web:035da65a8ca4b87b66892d",
  measurementId: "G-NRRCL7067N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

function owo(){
    /*
    - Check date. If date is outdated, reset firestore
    - Get firestore, see if he really has been fed/not fed
    */
    alert('hey guys');
}