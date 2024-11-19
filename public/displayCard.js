async function searchVocabularyCard(event) {
    event.preventDefault(); 
    var query = document.getElementById('search-form').query.value.trim();
    query = query.toLowerCase();
    if (!query) return;

    window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query) {
        document.getElementById("queried-word").textContent = query;
        document.getElementById("queried-word-title").textContent = query;

        fetchVocabularyData(query);
    }
};

async function fetchVocabularyData(query) {
    try {
        const response = await fetch(`http://localhost:8000/getVocabularyCard?word=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        updateCardDisplay(data);
    } catch (error) {
        console.error('Error fetching vocabulary card:', error);
    }
}

function updateCardDisplay(data) {
    document.getElementById("_translation").innerHTML = `<p>${data.portuguese}</p>`;
    document.getElementById("_image").innerHTML = `<img src="${data.image}" height=75%>`
    //document.getElementById("_image").innerHTML = `<img src="${data.image}" alt="${data.english} image" style="width: 100%; height: auto;">`;
    document.getElementById("_audio").innerHTML = data.audio ? `<audio controls src="data:audio/mp3;base64, ${data.audio}"></audio>` : `<p>No audio available</p>`;
}