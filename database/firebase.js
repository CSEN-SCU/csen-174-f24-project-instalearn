const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

var serviceAccount = require("../database/creds.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// user = 'carrion';
// word = 'fish';
// translated = 'peixe';
//var sound = require("../peixe.mp3");

//for images/sound firestore doesnt actually store files, so must use mp3
async function writeCard(card, word, translated, image, sound) {
  const docRef = db.collection('cards').doc(card);
  await docRef.set({
    english: word,
    portuguese: translated,
    image: image,
    audio: sound
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
//readData();

module.exports = { writeCard, readData };