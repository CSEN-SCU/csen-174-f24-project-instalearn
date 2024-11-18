import { getCard, writeCard, createSet } from './databaseServices.js';
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
