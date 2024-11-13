import { getCard, writeCard } from './databaseServices.js';
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
