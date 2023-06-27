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

/* STRUCTURE:
Bart Info > General > date: month day, year
          > Morning > fed: true/false
          > Afternoon > fed: true/false

*/

/* CONSTANTS */
const not_fed_info = "He is not fed :(";
const fed_info = "He is fed!!!";

let refresh_btn = document.getElementById("refresh_btn");
let refresh_text = document.getElementById("refresh_text");

let edit_name_btn = document.getElementById("edit_name_btn");

let mor_btn = document.getElementById("mor_fed_btn");
let mor_text = document.getElementById("mor_text");

let aft_btn = document.getElementById("aft_fed_btn");
let aft_text = document.getElementById("aft_text");

let date_text = document.getElementById("date");
let user_text = document.getElementById("user_name");

let localStorage_key = 'user_name';

// Handle button clicks
refresh_btn.addEventListener("click", async () => {
  getInfo();
  setDateText();
  let date_info = (await getDoc(doc(db, "Bart Info", "General"))).data();
  if (date_text.innerHTML != date_info.date){
    resetFirestore();
  }
});
edit_name_btn.addEventListener("click", () => {
  let temp_name = window.prompt("Please enter your name!\nIf no name is entered, your name will stay the same.", "");
  if (!(temp_name == "" || temp_name == null)){ // If cancelled prompt
    localStorage.setItem(localStorage_key, temp_name);
  }
  user_text.innerHTML = localStorage.getItem(localStorage_key);
});
mor_btn.addEventListener("click", morBtnPressed);
aft_btn.addEventListener("click", aftBtnPressed);


/* FUNCTIONS */
// Set button to not fed
const changeNotFed = (btn, btn_text) => {
  btn_text.innerHTML = not_fed_info;
  btn.classList.remove("btn-success");
  btn.classList.add("btn-danger");
}

const changeFed = (btn, btn_text, who) => {
  if (who == ""){
    btn_text.innerHTML = fed_info;
  } else {
    btn_text.innerHTML = fed_info + " (by " + who+")";
  }
  btn.classList.remove("btn-danger");
  btn.classList.add("btn-success");
}

const setDateText = () => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date_now = new Date();
  date_text.innerHTML = months[date_now.getMonth()] + " " + date_now.getDate() + ", " + date_now.getFullYear();
}

// Morning button
async function morBtnPressed(){
  let mor_info = (await getDoc(doc(db, "Bart Info", "Morning"))).data();
  btnPressed(mor_btn, mor_info,mor_text, "Morning");
}

// Afternoon button
async function aftBtnPressed(){
  let aft_info = (await getDoc(doc(db, "Bart Info", "Afternoon"))).data();
  btnPressed(aft_btn, aft_info, aft_text, "Afternoon");
}

async function isUnsynched(){
  let mor_info = (await getDoc(doc(db, "Bart Info", "Morning"))).data();
  let aft_info = (await getDoc(doc(db, "Bart Info", "Afternoon"))).data();

  return (mor_btn.classList.contains("btn-danger") && mor_info.fed) ||(mor_btn.classList.contains("btn-success") && !mor_info.fed) 
  || (aft_btn.classList.contains("btn-danger") && aft_info.fed) ||(aft_btn.classList.contains("btn-success") && !aft_info.fed);
}

// General button press
async function btnPressed(btn, btn_info, btn_text, doc_name){
  btn_text.innerHTML = "";
  btn_text.classList.add("spinner-border", "spinner-border-sm");
  
  // check if date has changed
  setDateText();
  let date_info = (await getDoc(doc(db, "Bart Info", "General"))).data();
  if (date_text.innerHTML != date_info.date){
    alert("Day has changed! Resetting...");
    resetFirestore();
  } else if (await isUnsynched()){
    // If someone changed status while on the site
    alert("A change was already made to Bart's feeding status while you were on the site. Showing changes...\nYOUR CLICK JUST NOW HAS NO EFFECT EXCEPT REFRESHING THE PAGE");
  } else {
    // Changing firestore
    await updateDoc(doc(db, "Bart Info", doc_name), {
      fed: !btn_info.fed,
      who: localStorage.getItem(localStorage_key)
    });
  } 
  getInfo(); 
  btn_text.classList.remove("spinner-border", "spinner-border-sm");
}

async function resetFirestore(){
  let mor_info = (await getDoc(doc(db, "Bart Info", "Morning"))).data();
  let aft_info = (await getDoc(doc(db, "Bart Info", "Afternoon"))).data();
  let date_info = (await getDoc(doc(db, "Bart Info", "General"))).data();

  setDateText();
  if (date_text.innerHTML == date_info.date){ // the user's date was behind
    return; // do nothing
  } else { // firestore date is wrong (so everything needs to be reset)
    await updateDoc(doc(db, "Bart Info", "Morning"), {
      fed: false, 
      who: ""
    });
    await updateDoc(doc(db, "Bart Info", "Afternoon"), {
      fed: false,
      who: ""
    });
    await updateDoc(doc(db, "Bart Info", "General"), {
      date: date_text.innerHTML
    });
    getInfo();
  }
  
}

async function getInfo(){
  // SPINNER BUTTON!!
  refresh_btn.classList.add("disabled");
  refresh_text.innerHTML = "";
  refresh_text.classList.add("spinner-border", "spinner-border-sm");

  // Set user's name
  user_text.innerHTML = localStorage.getItem(localStorage_key);

  // Set mor/aft buttons
  let mor_info = (await getDoc(doc(db, "Bart Info", "Morning"))).data();
  let aft_info = (await getDoc(doc(db, "Bart Info", "Afternoon"))).data();

  // morning button
  if (mor_info && mor_info.fed){
    changeFed(mor_btn, mor_text, mor_info.who);
  } else{
    changeNotFed(mor_btn, mor_text);
  }

  // afternoon button
  if (aft_info && aft_info.fed){
    changeFed(aft_btn, aft_text, aft_info.who);
  } else{
    changeNotFed(aft_btn, aft_text);
  }


  // UNSPIN THE BUTTON
  refresh_btn.classList.remove("disabled");
  refresh_text.innerHTML = "Refresh Info";
  refresh_text.classList.remove("spinner-border", "spinner-border-sm");
}




/* RUN WHEN INIT */
// Check if day changed:
setDateText();
let date_info = (await getDoc(doc(db, "Bart Info", "General"))).data();
if (date_text.innerHTML != date_info.date){
  resetFirestore();
}
// get user name
if (localStorage.getItem(localStorage_key) == null){ // If first time
  let temp_name = window.prompt("Please enter your name!\nIf no name is entered, your name will be set to \"User\".", "");
  if (temp_name == "" || temp_name == null){ // If cancelled prompt
    localStorage.setItem(localStorage_key, 'User');
  } else {
    localStorage.setItem(localStorage_key, temp_name);
  }
}
// When user enters, run:
getInfo();