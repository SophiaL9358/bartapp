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

let mor_btn = document.getElementById("mor_fed_btn");
let aft_btn = document.getElementById("aft_fed_btn");
let date_text = document.getElementById("date");

mor_btn.addEventListener("click", morBtnPressed);
aft_btn.addEventListener("click", aftBtnPressed);

// When user enters, run:
getInfo();
// Check if day changed:
setDateText();
let date_info = (await getDoc(doc(db, "Bart Info", "General"))).data();
if (date_text.innerHTML != date_info.date){
  resetFirestore();
}
  

/* FUNCTIONS */
// Set button to not fed
function changeNotFed(btn){
  btn.innerHTML = not_fed_info;
  btn.classList.remove("btn-success");
  btn.classList.add("btn-danger");
}
function changeFed(btn){
  btn.innerHTML = fed_info;
  btn.classList.remove("btn-danger");
  btn.classList.add("btn-success");
}

// Debug
function debug(){
  console.log("hello sir");
}

// Morning button
async function morBtnPressed(){
  let mor_info = (await getDoc(doc(db, "Bart Info", "Morning"))).data();
  btnPressed(mor_btn, mor_info, "Morning");
}

// Afternoon button
async function aftBtnPressed(){
  let aft_info = (await getDoc(doc(db, "Bart Info", "Afternoon"))).data();
  btnPressed(aft_btn, aft_info, "Afternoon");
}

async function isUnsynched(){
  let mor_info = (await getDoc(doc(db, "Bart Info", "Morning"))).data();
  let aft_info = (await getDoc(doc(db, "Bart Info", "Afternoon"))).data();

  return (mor_btn.innerHTML == not_fed_info && mor_info.fed) ||(mor_btn.innerHTML == fed_info && !mor_info.fed) || (aft_btn.innerHTML == not_fed_info && aft_info.fed) ||(aft_btn.innerHTML == fed_info && !aft_info.fed);
}

// General button press
async function btnPressed(btn, btn_info, doc_name){
  
  // check if date has changed
  setDateText();
  let date_info = (await getDoc(doc(db, "Bart Info", "General"))).data();
  if (date_text.innerHTML != date_info.date){
    alert("Day has changed! Resetting...");
    resetFirestore();
  } else if (await isUnsynched()){
    // If someone changed status while on the site
    alert("A change was already made to Bart's feeding status while you were on the site. Showing changes...");
  } else {
    // Changing firestore
    await updateDoc(doc(db, "Bart Info", doc_name), {
      fed: !btn_info.fed
    });
  } 
  getInfo(); 
}

async function resetFirestore(){
  let mor_info = (await getDoc(doc(db, "Bart Info", "Morning"))).data();
  let aft_info = (await getDoc(doc(db, "Bart Info", "Afternoon"))).data();
  let date_info = (await getDoc(doc(db, "Bart Info", "General"))).data();

  setDateText();
  if (date_text.innerHTML == date_info.date){ // the user's date was behind
    console.log("do nothing");
    return; // do nothing

  } else { // firestore date is wrong (so everything needs to be reset)
    await updateDoc(doc(db, "Bart Info", "Morning"), {
      fed: false
    });
    await updateDoc(doc(db, "Bart Info", "Afternoon"), {
      fed: false
    });
    await updateDoc(doc(db, "Bart Info", "General"), {
      date: date_text.innerHTML
    });
    getInfo();
  }
  
}

function setDateText(){
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date_now = new Date();
  date_text.innerHTML = months[date_now.getMonth()] + " " + date_now.getDate() + ", " + date_now.getFullYear();
}

async function getInfo(){
  let mor_info = (await getDoc(doc(db, "Bart Info", "Morning"))).data();
  let aft_info = (await getDoc(doc(db, "Bart Info", "Afternoon"))).data();

  // morning button
  if (mor_info && mor_info.fed){
    changeFed(mor_btn);
  } else{
    changeNotFed(mor_btn);
  }

  // afternoon button
  if (aft_info && aft_info.fed){
    changeFed(aft_btn);
  } else{
    changeNotFed(aft_btn);
  }


}