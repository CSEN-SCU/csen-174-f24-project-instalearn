
import { getCard, writeCard, getSet, createSet, getSetsByUser, writeCardToSet, deleteSetCard, deleteWholeSet } from './databaseServices.js';
import { fetchCardData } from './apiServices.js';

export async function getVocabCard(req, res) {
    const { word } = req.query;
    
    let card = await getCard(word);
    if (!card) {
        // Fetch from APIs if not in Firestore
        card = await fetchCardData(word);
        await writeCard(word, card.portuguese, card.image, card.audio);
        console.log("Data from API");
    }
    else{
        console.log("Data from Firebase");
    }
    //console.log(card);
    res.json(card);
}

export async function getVocabSet(req, res) {
    const userId = req.user?.uid;
    const { query } = req.query;
    //console.log("Query: ", query);
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const data = await getSet(userId, query);
        if (data.length === 0) {
            return res.status(404).json({ error: "No cards found for the given query" });
        }
        res.json(data);
    } catch (error) {
        console.error("Error fetching set:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
export async function addSet(req, res) {
    const userId = req.user?.uid; // Get authenticated user ID from request
    const { name } = req.body; // Extract set name from request body

    if (!userId || !name) {
        return res.status(400).json({ error: "Set name is required" });
    }

    try {
        await createSet(userId, name);
        res.status(201).json({ message: 'Set created successfully' });
    } catch (error) {
        console.error('Error creating set:', error);
        res.status(500).json({ error: 'Failed to create set' });
    }
}
export async function getUserSets(req, res) {
    const userId = req.user?.uid; // Get authenticated user ID from request

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        const sets = await getSetsByUser(userId);  // Fetch sets by user ID

        if (!sets || sets.length === 0) {
            return res.status(404).json({ error: "No sets found for this user" });
        }

        res.json(sets);  // Respond with the list of sets
    } catch (error) {
        console.error("Error fetching user sets:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function addCardToSet(req, res) {
    //console.log("ABC: ", req.body);
    const userId = req.user?.uid; // Get authenticated user ID from request
    const { word, setid } = req.body;
    //console.log(userId);
    //console.log(word);
    //console.log(setid);
        if (!word || !setid || !userId) {
            return res.status(400).json({ error: "Missing required parameters: word, setid, userid" });
        }

        try {
            console.log("writing to db");
            writeCardToSet(word, setid, userId);
        } catch (error) {
            console.error("Error adding card to set:", error);
            res.status(500).json({ error: "Internal server error" });
        }
}

export async function deleteCard(req, res){
    const userid = req.user?.uid;
    const { selectedCards, setid } = req.body;
    //console.log(selectedCards, setid, userid);
    //console.log(selectedCards[0])

    if (!selectedCards || !setid || !userid){
        return res.status(400).json({error: "Missing required parameters: userid, setid, selectedCards"});
    }

    try{
        selectedCards.forEach(word => {
            deleteSetCard(userid, setid, word);
        })
        res.status(201).json({ message: 'Words deleted successfully' });
    } catch (error){
        console.error("Error deleting card from set:", error);
        res.status(500).json({error: "Internal server error"});
    }
}

export async function deleteSet(req, res){
    const userid = req.user?.uid;
    console.log("Request received:", req.body);
    const { setName } = req.body;

    if (!setName || !userid) {
        return res.status(400).json({ message: "Missing required fields: setName or userId" });
    }

    try {
        deleteWholeSet(setName, userid);
        res.status(200).json({ message: `Set "${setName}" deleted successfully.` });
    } catch (error) {
        console.error("Error deleting set:", error);
        res.status(500).json({ message: "Failed to delete set." });
    }
}