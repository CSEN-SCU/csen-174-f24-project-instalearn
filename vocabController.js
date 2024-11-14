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

export async function getVocabSet(req, res) {
    const { setName } = req.query;
    let vocabSet = await getSet(setName);
    if (!vocabSet) {
        return 1;
    }
    //console.log(card);
    res.json(vocabSet);
}