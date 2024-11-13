async function searchVocabularyCard(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    const query = document.getElementById('search-form').query.value.trim();
    if (!query) return;

    document.getElementById("queried-word").textContent = query;
    document.getElementById("queried-word-title").textContent = query;

    // Fetch data from the backend
    try {
        const response = await fetch(`http://localhost:8000/getVocabularyCard?word=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        updateCardDisplay(data);
    } catch (error) {
        console.error('Error fetching vocabulary card:', error);
    }
}

// Update HTML elements to display vocabulary card data
function updateCardDisplay(data) {
    document.getElementById("_translation").innerHTML = `<p>${data.portuguese}</p>`;
    document.getElementById("_image").innerHTML = `<iframe src="${data.image}" width="100%" height="250" style="border:none;"></iframe>`
    //document.getElementById("_image").innerHTML = `<img src="${data.image}" alt="${data.english} image" style="width: 100%; height: auto;">`;
    document.getElementById("_audio").innerHTML = data.audio ? `<audio controls src="data:audio/mp3;base64, ${data.audio}"></audio>` : `<p>No audio available</p>`;
}