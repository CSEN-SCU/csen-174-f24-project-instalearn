//Interfaces with Firestore to save and retrieve vocabulary cards and user sets.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from "./database/creds.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

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
//writeCard("apple");
//writeCard("orange");
//writeCard("banana");
//writeCardToSet("hand", "body", "userid1");
//getSet("body");