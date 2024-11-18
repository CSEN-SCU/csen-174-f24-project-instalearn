import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from "./database/creds.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export async function createSet(userid, setName) {
    const setRef = db.collection('sets').doc(userid).collection("sets").doc(setName); 
    await setRef.set({
      setName: setName,
      createdAt: new Date()
    });
    console.log(`Set "${setName}" created successfully for user "${userid}"`);
  }
  
document.getElementById('save-button').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent form submission

    const setName = document.getElementById('set-name').value.trim();
    if (!setName) {
        alert('Please enter a set name.');
        return;
    }

    const userId = 'userid1'; // Replace with actual logged-in user ID

    try {
        // Send the set creation request to the backend
        const response = await fetch('http://localhost:8000/createSet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, setName }),
        });

        if (!response.ok) throw new Error('Failed to create set');

        const data = await response.json();
        alert(`Set "${data.set.name}" created successfully!`);
        document.getElementById('set-name').value = ''; // Reset the input field

    } catch (error) {
        console.error('Error creating set:', error);
        alert('There was an error creating the set. Please try again.');
    }
});