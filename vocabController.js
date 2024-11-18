import { getCard, writeCard, getSet } from './databaseServices.js';
import { fetchCardData } from './apiServices.js';

export async function getVocabCard(req, res) {
    const { word } = req.query;
    
    let card = await getCard(word);
    if (!card) {
        // Fetch from APIs if not in Firestore
        card = await fetchCardData(word);
        await writeCard(word, card.portuguese, card.image, card.audio);
    }
    //console.log(card);
    res.json(card);
}

export async function getDatabaseCard(req, res) {
    const { word } = req.query;
    console.log("Received word query:", word);  // Log the received query parameter
    if (!word) {
        return res.status(400).json({ error: "word query parameter is required" });
    }

    try {
        const card = await getCard(word);
        console.log("Fetched card:", card);  // Log the fetched card data
        if (!card) {
            return res.status(404).json({ error: "Card not found" });
        }
        res.json(card);
    } catch (error) {
        console.error("Error fetching card:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

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