const { translate, speak } = require('google-translate-api-x');
const { writeFileSync } = require('fs');

word = 'fish'; //supports just one word
inputArray = ["child", "cry", "snail"]; //supports an array of words (in case we want functionality where they can paste a bunch of words)
translated = 'peixe';

translate(word, { from: 'en', to: 'pt' , autoCorrect: false, forceBatch: true})
  .then(res => {
    console.log(res.text); //=> I speak English
    translated = res.text;
  })
  .catch(err => {
    console.error(err);
  });


//figure out why u get rate limited for doing 2 requests in a row
speak(translated, {to: 'pt', forceBatch: 'true'})
  .then(res => {
    writeFileSync(translated + '.mp3', res, {encoding:'base64'}); // Saves the mp3 to file
  })
  .catch(err =>{
    console.error(err);
  })