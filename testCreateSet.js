import { createSet } from './databaseServices.js';

async function testCreateSet() {
  const userId = "userid1"; // Replace with a test user ID
  const setName = "Test Set Name"; // Name of the set to be created

  try {
    await createSet(userId, setName); // Only pass the user ID and set name
    console.log(`Set "${setName}" created successfully.`);
  } catch (error) {
    console.error("Error creating set:", error);
  }
}

testCreateSet();