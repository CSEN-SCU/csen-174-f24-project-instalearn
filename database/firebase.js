const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

var serviceAccount = require("../database/creds.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

user = 'carrion';
word = 'fish';
translated = 'peixe';
//var sound = require("../peixe.mp3");

//for images/sound firestore doesnt actually store files, so must use mp3
async function writeData(user, word, translated) {
  const docRef = db.collection('users').doc(user);
  await docRef.set({
    en: word,
    pt: translated,
    image: "image url",
    audio: "sound url"
  });
  console.log('Document written successfully');
}

async function readData() {
  const snapshot = await db.collection('users').get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
}

//writeData(user, word, translated).catch(console.error);
readData();

/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ8JW1j_GOV8ldqKCLJRQwC0RqMT3GeZM",
  authDomain: "instalearn-51628.firebaseapp.com",
  databaseURL: "https://instalearn-51628-default-rtdb.firebaseio.com",
  projectId: "instalearn-51628",
  storageBucket: "instalearn-51628.appspot.com",
  messagingSenderId: "774690452779",
  appId: "1:774690452779:web:7e378a292d64db14ce016e",
  measurementId: "G-K4QPHLR83W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/