//Interfaces with Firestore to save and retrieve vocabulary cards and user sets.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from "./database/creds.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// put HTML markup into a <div> and reveal it
function showDiv(id, html) {
  var content = document.getElementById("_" + id)
  if (content) content.innerHTML = html;
  var wrapper = document.getElementById(id);
  if (wrapper) wrapper.style.display = html.trim() ? "block" : "none";
}

//FUNCTIONS TO SHOW IMAGE, AUDIO, AND TRANSLATION IN CARD DIVS
function showImage(imageFile){
  var html = [];
  var height = 120;
  var width = Math.max(Math.round(height * item.thumbnail.width / item.thumbnail.height), 120);
  html.push("<p class='images' style='max-width: " + width + "px'>");
  html.push("<img src='"+ imageFile + "&h=" + height + "&w=" + width + "' height=" + height + " width=" + width + "'>");
  return html.join("");
}

function showAudio(audioFile){
  var html = [];
  temp = "<audio controls src='" + audioFile + "'>";
  html.push(temp);
  return html.join("");
}

function showTerm(term){
  var html = [];
  html.push(term);
  return html.join("");
}

export async function writeCard(card, word, translated, image, sound) {
  const docRef = db.collection('cards').doc(card);
  await docRef.set({
    english: word,
    portuguese: translated,
    image: image,
    audio: sound
  });
  console.log('Card written to db successfully');
}

export async function getCard(word) {
  const card = await db.collection('cards').doc(word).get();
  console.log(card.id, '=>', card.data());
  //FUNCTION CALLS TO DISPLAY ON FRONTEND (IDK IF SHOULD PUT HERE)
  showDiv("image", showImage(card.image));
  showDiv("pronunciation", showAudio(card.audio));
  showDiv("translation", showTerm(card.portuguese));
  return card.exists ? card.data() : null;
}

export async function writeCardToSet(word, setid, userid){
    const docRef = db.collection('sets').doc(userid).collection("sets").doc(setid).collection("cards").doc(word);
  await docRef.set({
    cardid: word
  });
  console.log('Card written to set successfully');
}

export async function getSet(setid){
    const set = await db.collection("sets").doc("userid1").collection("sets").doc(setid).collection("cards").get();
  set.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
  return set.exists ? set.data() : null;
}

//debugging
//writeCardToSet("hand", "body", "userid1");
//getSet("body");

//FUNCTION TO SEARCH DB OR SEARCH API SOURCES
function searchCard(form){
  var searchTerm = form.value;
  console.log(getCard(searchTerm));
  if(getCard(searchTerm)){
    console.log("DB WORK");

    //DISPLAY TO FRONTEND
  }
  else{
    //INSERT API SERVICES FUNCTION CALLS
    console.log("API WORK");
    //WRITE TO DB FUNCTION WITH API RESULTS
    //DISPLAY TO FRONTEND\
  }
}