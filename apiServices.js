import axios from 'axios';
import { translate, speak } from 'google-translate-api-x';
import { writeFileSync } from 'fs';

async function fetchCardData(word) {
    const image = await fetchImage(word);
    const [translation, audio] = await fetchTranslation(word);
    return { word, image, translation, audio };
}

//query the Bing image search API
async function fetchImage(word) {
    let subscriptionKey = 'key';
    try{
        const res = await axios.get("https://api.bing.microsoft.com/v7.0/images/search", {
            headers : {
                'Ocp-Apim-Subscription-Key' : subscriptionKey,
                },
            params:{
                mkt: "en-US",
                q: word
            }
        });
        return res.data.value[0].webSearchUrl; //return the first result image URL
    }
    catch (err){
        console.error('Error fetching translation:', err);
        throw err;
    }
}

// Call Translation API
async function fetchTranslation(word) {
    try {
        // query translation API for translated word
        const translationResult = await translate(word, { from: 'en', to: 'pt', autoCorrect: false, forceBatch: true });
        const translated = translationResult.text;
        console.log(translated);
  
        // query translation API for audio for translated word
        const audio = await speak(translated, { to: 'pt', forceBatch: true });
  
        // Debugging: Save the mp3 to file
        //writeFileSync(`${translated}.mp3`, audio, { encoding: 'base64' });
  
        // Return the translated text and audio as an array
        return [translated, audio];
    } catch (err) {
        console.error("Error in translation fetch:", err);
    }
}
const fishcard = await fetchCardData("fish");
console.log(fishcard);

