//Interfaces with Firestore to save and retrieve vocabulary cards and user sets.

import e from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
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
  const startTime = performance.now(); // Start the timer
  const card = await db.collection('cards').doc(word).get();
  const endTime = performance.now(); // End the timer
  console.log(`Firebase call took ${endTime - startTime} milliseconds.`);
  console.log(card.id, '=>', card.data());
  return card.exists ? card.data() : null;
}

export async function writeCardToSet(word, setid, userid) {
  const timestamp = new Date(); 
  console.log(userid);
  console.log(word);
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

export async function getSet(user, query) {
  const setCollection = await db.collection("sets").doc(user).collection("sets").doc(query).collection("cards").get();
  const cards = [];
  setCollection.forEach(doc => {
      cards.push({ id: doc.id, ...doc.data() });
  });

  return cards;
}

export async function createSet(userid, setName) {
  const setRef = db.collection('sets').doc(userid).collection("sets").doc(setName); 
  await setRef.set({
    setName: setName,
    createdAt: new Date()
  });
  console.log(`Set "${setName}" created successfully for user "${userid}"`);
}
export async function getSetsByUser(userId) {
    try {
      const setsCollection = await db.collection('sets').doc(userId).collection('sets').get();
  
      if (setsCollection.empty) {
        console.log(`No sets found for user ${userId}`);
        return [];
      }
  
        // Map over the documents to get the set names
      return setsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching sets by user:", error);
      throw error;
    }
}

export async function deleteSetCard(userId, setName, term) {
  try {
    console.log(setName, term);
    await db.collection('sets').doc(userId).collection('sets').doc(setName).collection('cards').doc(term).delete();
    console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error removing document: ", error);
  }
}

export async function deleteWholeSet(setName, userId){
  try {
    // Reference to the cards collection
    const cardsCollection = db.collection('sets').doc(userId).collection('sets').doc(setName).collection('cards');

    // Fetch all documents in the collection
    const snapshot = await cardsCollection.get();

    if (snapshot.empty) {
      console.log("No cards found to delete.");
    } else {
      // Use a batch to delete all cards
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        console.log(doc)
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log("Cards deleted successfully.");
    }

    // Delete the set document itself
    const setDoc = db.collection('sets').doc(userId).collection('sets').doc(setName);
    await setDoc.delete();

    console.log(`Set "${setName}" deleted successfully.`);
  } catch (error) {
    console.error("Error deleting the set:", error);
  }
}

//const sets = await getSetsByUser("userid1");
//console.log(sets);

//debugging
//writeCardToSet("hand", "body", "userid1");
//getSet("fruit");
//deleteWholeSet("test", "userid1");