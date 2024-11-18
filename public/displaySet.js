import { getVocabSet } from "../vocabController";

async function searchSet() {
    //GRAB SET TITLE FROM THE URL QUERY PARAMS
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    console.log(query);
    if (!query) return;

    console.log(getVocabSet(query));

    // Fetch data from the backend
     try {
         const response = await fetch(`http://localhost:8000/getVocabularySet?setid=${encodeURIComponent(query)}`);
         if (!response.ok) throw new Error('Failed to fetch data');

         const data = await response.json();
    //     updateCardDisplay(data);
     } catch (error) {
         console.error('Error fetching vocabulary set:', error);
     }
}

// Update HTML elements to display vocabulary card data
function updateCardDisplay(data) {
    document.getElementById("_translation").innerHTML = `<p>${data.portuguese}</p>`;
    document.getElementById("_image").innerHTML = `<img src="${data.image}" height=75%>`
    document.getElementById("_audio").innerHTML = data.audio ? `<audio controls src="data:audio/mp3;base64, ${data.audio}"></audio>` : `<p>No audio available</p>`;
}

function displayAllCards(){
    //FOR LOOP TO GO THROUGH ALL CARDS AND GENERATE THE SAME HTML CSS FORMAT
}

searchSet();