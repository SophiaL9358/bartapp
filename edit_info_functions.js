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

// dark mode
if (localStorage.getItem('darkMode') == 'true'){
    document.getElementById('main_body').classList.add('text-bg-dark');
} else {
    document.getElementById('main_body').classList.remove('text-bg-dark');
}

// FUNCTIONS

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
    // SETTING UP VARIABLES
    // General info
    let dry_food_cal_value = document.getElementById('dry_food_cal').value;
    let wet_food_cal_value = document.getElementById('wet_food_cal').value;
    let weight_lb_value = document.getElementById('weight_lb').value;
    // Morning info
    let mor_dry_value = document.getElementById('mor_dry_food_tbsp').value;
    let mor_wet_value = document.getElementById('mor_wet_food_can').value;
    // Afternoon info
    let aft_dry_value = document.getElementById('aft_dry_food_tbsp').value;
    let aft_wet_value = document.getElementById('aft_wet_food_can').value;


    // UPDATING FIRESTORE
    // update morning info
    await updateDoc(doc(db, "Bart Info", "Morning"), {
        dry_food_tbsp: mor_dry_value,
        wet_food_can: mor_wet_value
    })

    // update afternoon info
    await updateDoc(doc(db, "Bart Info", "Afternoon"), {
        dry_food_tbsp: aft_dry_value,
        wet_food_can: aft_wet_value
    })

    // update general info
    // get given cal
    let calc_given_cal = Number(dry_food_cal_value)/16*(Number(mor_dry_value)+Number(aft_dry_value)); // dry food
    // console.log(calc_given_cal);
    calc_given_cal += Number(wet_food_cal_value)*(Number(mor_wet_value)+Number(aft_wet_value)); // wet food
    // console.log(wet_food_cal_value, Number(mor_wet_value)+Number(aft_wet_value), calc_given_cal)
    // rer = resting energy requirements
    let rer = {6:149, 7:167, 8:184, 9:200, 10:218, 11:234, 12:250, 13:265, 14:280, 15:295, 16:310, 17:324, 18:339, 19:353, 20:366, 25:433};
    await updateDoc(doc(db, "Bart Info", "General"), {
        dry_food_cal: dry_food_cal_value,
        wet_food_cal: wet_food_cal_value,
        weight_lb: weight_lb_value,
        rec_cal: rer[weight_lb_value],
        given_cal: calc_given_cal
    });

    if (confirm("Is this good?\nRecommended Calories: "+rer[weight_lb_value] + "\nGiven Calories: "+calc_given_cal)){
        window.location.href = 'home.html';
    }

};

window.submitForm = submitForm;



getFirestoreValues();
