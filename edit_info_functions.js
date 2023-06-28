// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection, updateDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

/* FIRESTORE STRUCTURE - on the functions.js file
*/

/* FILE STRUCTURE
- get info from firestore
- calculate 
- on submit
*/

const getFirestoreValues = async () => {
    // set "General Information" values
    let general_info = (await getDoc(doc(db, "Bart Info", "General"))).data();

    document.getElementById('dry_food_cal').value = general_info.dry_food_cal;
    document.getElementById('wet_food_cal').value = general_info.wet_food_cal;
    document.getElementById('weight_lb').value = general_info.weight_lb;

    // set "Morning" values
    let mor_info = (await getDoc(doc(db, "Bart Info", "Morning"))).data();

    document.getElementById('mor_dry_food_tbsp').value = mor_info.dry_food_tbsp;
    document.getElementById('mor_wet_food_can').value = mor_info.wet_food_can;

    // set "Afternoon values"
    let aft_info = (await getDoc(doc(db, "Bart Info", "Afternoon"))).data();

    document.getElementById('aft_dry_food_tbsp').value = aft_info.dry_food_tbsp;
    document.getElementById('aft_wet_food_can').value = aft_info.wet_food_can;

};

let submitForm = async () => {
    console.log('uwu');
};

window.submitForm = submitForm;

getFirestoreValues();