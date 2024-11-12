import { translate, speak } from 'google-translate-api-x';
import { writeFileSync } from 'fs';
 //supports just one word
//inputArray = ["child", "cry", "snail"]; //supports an array of words (in case we want functionality where they can paste a bunch of words)

function showDiv(id, html) {
  var content = document.getElementById("_" + id);
  if (content) content.innerHTML = html;
  var wrapper = document.getElementById(id);
  if (wrapper) wrapper.style.display = html.trim() ? "block" : "none";
}

function showAudio(audiofile){
  var html = [];
  temp = "<audio controls src='" + audiofile + "'>";
  html.push(temp);
  return html.join("");
}

function showTerm(term){
  var html = [];
  html.push(term);
  return html.join("");
}

export async function translateAndT2S(word) {
  console.log(word);
  try {
      // query translation API for translated word
      const translationResult = await translate(word, { from: 'en', to: 'pt', autoCorrect: false, forceBatch: true });
      const translated = translationResult.text;
      console.log(translated);

      // query translation API for audio for translated word
      const audio = await speak(translated, { to: 'pt', forceBatch: true });

      // Debugging: Save the mp3 to file
      writeFileSync(`${translated}.mp3`, audio, { encoding: 'base64' });
      //AN ATTEMPT TO SHOW ON HTML API RESULTS ;-;
      //showAudio("pronunciation", showAudio(`${translated}.mp3`));
      //showDiv("translation", showTerm(translated));

      // Return the translated text and audio as an array
      return [translated, audio];
  } catch (err) {
      console.error("Error in translateAndT2S:", err);
  }
}