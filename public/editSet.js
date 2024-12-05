let deletedTerms = [];

//when user clicks edit button...
const editBtn = document.getElementById("edit-btn");
editBtn.addEventListener('click', async (event) => {
    //get setid
    const params = new URLSearchParams(window.location.search);
    var setid = params.get('query');
    setid = setid.toLowerCase();
    console.log(setid);
    //hide edit-btn, show done-btn
    editBtn.style.display = 'none';
    const doneBtn = document.getElementById("done-btn");
    doneBtn.style.display = 'block';
    //add clickable x per card that appears
    var cardHeader = document.getElementsByClassName("word-title");
    Array.prototype.forEach.call(cardHeader, function(cardTitle) {
        var deleteLabel = document.createElement("button");
        deleteLabel.classList.add("del");
        deleteLabel.textContent = "X";
        cardTitle.appendChild(deleteLabel);
    });
    console.log(cardHeader);
    //When "X" clicked, get term name and call to database to delete
    var closebtns = document.getElementsByClassName("del");
    Array.prototype.forEach.call(closebtns, function(cardClose) {
        cardClose.addEventListener("click", async (event) => {
            var word = cardClose.parentNode.getElementsByTagName("h2")[0].textContent;
            console.log(word);
            deletedTerms.push(word);
            console.log(deletedTerms)
            cardClose.parentNode.parentNode.style.display = 'none';
        });
    }); 
});

//Grab userid and set variable
//asdfasdfasdf

const setElement = document.getElementById("done-btn");
setElement.addEventListener('click', async (event) => {

});

// const setElement = document.getElementById("edit-btn");
// setElement.addEventListener('click', async (event) => {
//     event.preventDefault(); // Prevent default link behavior
    
//     try {
//       console.log(query, setName, userId);
//       alert(query + ' successfully added to set ' + setName);
//       // Make a POST request to the backend
//       const response = await fetch('http://localhost:8000/deleteCard', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ word: query, setid: setName, userid: userId })
//       });
//       if (!response.ok) throw new Error('Failed to add card to set');
      
//       const result = await response.json();
//       alert(result.message); // Notify user of success
//     } catch (error) {
//       console.error('Error adding card to set:', error);
//       alert('Failed to add card to set');
//     }
// });