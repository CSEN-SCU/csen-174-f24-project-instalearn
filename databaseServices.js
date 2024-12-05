//Interfaces with Firestore to save and retrieve vocabulary cards and user sets.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from "firebase/auth";
import serviceAccount from "./database/creds.json" with { type: "json" };

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export async function writeCard(word, translated, image, sound) {
  const docRef = db.collection('cards').doc(word);
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

export async function writeCardToSet(word, setid) {
  const timestamp = new Date(); 
  const auth = getAuth();
  const userid = auth.currentUser.uid;
  const docRef = db.collection('sets').doc(userid).collection("sets").doc(setid).collection("cards").doc(word);
  
  await docRef.set({
      cardid: word,
      createdAt: timestamp 
  });

  console.log('Card written to set successfully');
}
// export async function getSet(setid){
//     console.log(setid);
//     const set = await db.collection("sets").doc("userid1").collection("sets").doc(setid).collection("cards").get();
//   set.forEach((doc) => {
//     console.log(doc.id, '=>', doc.data());
//   });
//   return set.exists ? set.data() : null;
// }

export async function getSet(userid, query) {
  const user = userid;
  if (userid != "userid1"){
    const auth = getAuth();
    user = auth.currentUser.uid;
    console.log(user);
  }
  const setCollection = await db.collection("sets").doc(user).collection("sets").doc(query).collection("cards").get();
  const cards = [];
  setCollection.forEach(doc => {
      cards.push({ id: doc.id, ...doc.data() });
  });

  return cards;
}

export async function createSet(setName) {
  const auth = getAuth();
  const userid = auth.currentUser.uid;
  const setRef = db.collection('sets').doc(userid).collection("sets").doc(setName); 
  await setRef.set({
    setName: setName,
    createdAt: new Date()
  });
  console.log(`Set "${setName}" created successfully for user "${userid}"`);
}

export async function getSetsByUser(userId) {
  const user = userId;
  if (userId != "userid1"){
    console.log("requesting current userid");
    const auth = getAuth();
    user = auth.currentUser.uid;
    console.log(user);
  }
  try {
      const setsCollection = await db.collection('sets').doc(user).collection('sets').get();
  
      if (setsCollection.empty) {
        console.log(`No sets found for user ${user}`);
        return [];
      }
  
        // Map over the documents to get the set names
      return setsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching sets by user:", error);
      throw error;
    }
}

//const sets = await getSetsByUser("userid1");
//console.log(sets);

//debugging
//writeCardToSet("hand", "body", "userid1");
//getSet("fruit");
