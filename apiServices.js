import axios from 'axios';
import { translate, speak } from 'google-translate-api-x';
import { writeFileSync } from 'fs';

export async function fetchCardData(word) {
    const [portuguese, audio] = await fetchTranslation(word);
    const image = await fetchImage(portuguese);
    const english = word;
    return { english, image, portuguese, audio };
}

//query the Bing image search API
async function fetchImage(word) {
    const startTime = performance.now(); // Start the timer
    let subscriptionKey = '02bd4abba1da45218285359503abc2de';
    try{
        const res = await axios.get("https://api.bing.microsoft.com/v7.0/images/search", {
            headers : {
                'Ocp-Apim-Subscription-Key' : subscriptionKey,
                },
            params:{
                q: word
            }
        });
        const endTime = performance.now(); // End the timer
        console.log(`Bing API call took ${endTime - startTime} milliseconds.`);
        return res.data.value[0].thumbnailUrl; //return the first result image 
    }
    catch (err){
        console.error('Error fetching translation:', err);
        throw err;
    }
}

// Call Translation API
async function fetchTranslation(word) {
    const startTime = performance.now(); // Start the timer
    try {
        // query translation API for translated word
        const translationResult = await translate(word, { from: 'en', to: 'pt', autoCorrect: false, forceBatch: true });
        const portuguese = translationResult.text;
        console.log(portuguese);
  
        // query translation API for audio for translated word
        const audio = await speak(portuguese, { to: 'pt', forceBatch: true });
  
        // Debugging: Save the mp3 to file
        //writeFileSync(`${translated}.mp3`, audio, { encoding: 'base64' });
  
        const endTime = performance.now(); // End the timer
        console.log(`Translation API call took ${endTime - startTime} milliseconds.`);

        // Return the translated text and audio as an array
        return [portuguese, audio];
    } catch (err) {
        console.error("Error in translation fetch:", err);
    }
}
//const fishcard = await fetchCardData("apple");
//console.log(fishcard);

// const fish = await fetchImage("fish");
// console.log(fish);

