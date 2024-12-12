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
        query = query.toLowerCase();
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

function dropShow(){
    document.getElementById("myDropdown").classList.toggle("show");
    document.getElementById("myDropdown").style.display = "block";
}

async function fetchUserSetOptions(userId) {
    try {
        const response = await fetch(`http://localhost:8000/getUserSets?userId=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error('Failed to fetch user sets');

        const sets = await response.json();

        // Update the UI with the list of sets
        const setsContainer = document.getElementById('myDropdown');
        sets.forEach(set => {
            const setElement = document.createElement('a');
            var setName = set.id;
            setElement.href = "set.html?query=" + setName;
            setElement.textContent = setName.charAt(0).toUpperCase() + setName.slice(1);
            //setElement.onclick = addCardToSet(query, setName, userId);
            setElement.addEventListener('click', async (event) => {
                  event.preventDefault(); // Prevent default link behavior
                  
                  try {
                    console.log(query, setName, userId);
                    alert(query + ' successfully added to set ' + setName);
                    // Make a POST request to the backend
                    const response = await fetch('http://localhost:8000/addCardToSet', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ word: query, setid: setName, userid: userId })
                    });
                    if (!response.ok) throw new Error('Failed to add card to set');
                    
                    const result = await response.json();
                    alert(result.message); // Notify user of success
                  } catch (error) {
                    console.error('Error adding card to set:', error);
                    alert('Failed to add card to set');
                  }
                });
            setsContainer.appendChild(setElement);
        });
    } catch (error) {
        console.error('Error fetching user sets:', error);
    }
}
// Example: Call this function with a userId
fetchUserSetOptions('userid1');

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.btn')) {
        //var dropdowns = document.getElementsByClassName("dropdown-content");
        //var i;
        //for (i = 0; i < dropdowns.length; i++) {
        //var openDropdown = dropdowns[i];
        //if (openDropdown.classList.contains('show')) {
        //openDropdown.style.display = "none";
        //}
        document.getElementById("myDropdown").style.display = "none";
    }
  }