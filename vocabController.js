
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

// export async function getDatabaseCard(req, res) {
//     const { word } = req.query;
//     console.log("Received word query:", word);  // Log the received query parameter
//     if (!word) {
//         return res.status(400).json({ error: "word query parameter is required" });
//     }

//     try {
//         const card = await getCard(word);
//         console.log("Fetched card:", card);  // Log the fetched card data
//         if (!card) {
//             return res.status(404).json({ error: "Card not found" });
//         }
//         res.json(card);
//     } catch (error) {
//         console.error("Error fetching card:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

export async function getVocabSet(req, res) {
    const { query } = req.query;
    console.log("Query: ", query);
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const data = await getSet(query);
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
    const { user, name } = req.body; // Extract user and set name from request body
    // console.log(user);
    // console.log(name);
    if (!user || !name) {
        return res.status(400).json({ error: 'Set name is required' });
    }

    try {
        await createSet(user, name);
        res.status(201).json({ message: 'Set created successfully' });
    } catch (error) {
        console.error('Error creating set:', error);
        res.status(500).json({ error: 'Failed to create set' });
    }
}
export async function getUserSets(req, res) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "userId query parameter is required" });
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
    console.log("ABC: ", req.body);
    const { word, setid, userid } = req.body;
    console.log(word);
    console.log(setid);
    console.log(userid);

        if (!word || !setid || !userid) {
            return res.status(400).json({ error: "Missing required parameters: word, setid, userid" });
        }

        try {
            writeCardToSet(word, setid, userid);
        } catch (error) {
            console.error("Error adding card to set:", error);
            res.status(500).json({ error: "Internal server error" });
        }
}

export async function deleteCard(req, res){
    const { selectedCards, setid, userid } = req.body;
    console.log(selectedCards, setid, userid);
    console.log(selectedCards[0])

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
    console.log("Request received:", req.body);
    const { setName, userId } = req.body;

    if (!setName || !userId) {
        return res.status(400).json({ message: "Missing required fields: setName or userId" });
    }

    try {
        deleteWholeSet(setName, userId);
        res.status(200).json({ message: `Set "${setName}" deleted successfully.` });
    } catch (error) {
        console.error("Error deleting set:", error);
        res.status(500).json({ message: "Failed to delete set." });
    }
}