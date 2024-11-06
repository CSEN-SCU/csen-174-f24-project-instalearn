const { translate, speak } = require('google-translate-api-x');
const { writeFileSync } = require('fs');
worde = 'hand'; //supports just one word
//inputArray = ["child", "cry", "snail"]; //supports an array of words (in case we want functionality where they can paste a bunch of words)

async function translateAndT2S(word) {
  try {
      // query translation API for translated word
      const translationResult = await translate(word, { from: 'en', to: 'pt', autoCorrect: false, forceBatch: true });
      const translated = translationResult.text;

      // query translation API for audio for translated word
      const audio = await speak(translated, { to: 'pt', forceBatch: true });

      // Debugging: Save the mp3 to file
      writeFileSync(`${translated}.mp3`, audio, { encoding: 'base64' });

      // Return the translated text and audio as an array
      return [translated, audio];
  } catch (err) {
      console.error("Error in translateAndT2S:", err);
  }
}
module.exports = { translateAndT2S };

