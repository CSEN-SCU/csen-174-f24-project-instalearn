let deletedTerms = [];

//Grab userid and set variable
var userid = 'userid1';

//get setid
var setid = params.get('query');
setid = setid.toLowerCase();
console.log(setid);

//when user clicks edit button...
const editBtn = document.getElementById("edit-btn");
const doneBtn = document.getElementById("done-btn");
const delSetBtn = document.getElementById("delSet-btn");
editBtn.addEventListener('click', async (event) => {
    //hide edit-btn, show done-btn
    editBtn.style.display = 'none';
    doneBtn.style.display = 'block';
    delSetBtn.style.display = 'block';
    //add clickable x per card that appears
    var cardHeader = document.getElementsByClassName("word-title");
    Array.prototype.forEach.call(cardHeader, function(cardTitle) {
        var deleteLabel = document.createElement("button");
        deleteLabel.classList.add("del");
        deleteLabel.textContent = "X";
        cardTitle.appendChild(deleteLabel);
    });
    //when "X" clicked, get term name
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

//when user clicks done button...
doneBtn.addEventListener('click', async (event) => {
    //hide edit-btn, show done-btn
    editBtn.style.display = 'block';
    doneBtn.style.display = 'none';
    delSetBtn.style.display = 'none';
    //remove clickable x per card that appears
    var xBtn = document.getElementsByClassName("del");
    console.log(xBtn);
    // Convert the live HTMLCollection to a static array
    var xBtnArray = Array.from(xBtn);
    xBtnArray.forEach(function(delBtn) {
    // Clear card divs that are officially deleted
        if (delBtn.parentNode.parentNode.style.display == 'none') {
            delBtn.parentNode.parentNode.parentNode.innerHTML = '';
        }
        // Remove the x button
        delBtn.remove();
    });
    var clearedDivs = document.getElementsByClassName("result-details");
    var clearDivArray = Array.from(clearedDivs);
    clearDivArray.forEach(function(emptyDiv){
        if(emptyDiv.innerHTML == ''){
            emptyDiv.remove();
        }
    });
    
    try {
        console.log(userid, setid, deletedTerms);
        // Make a POST request to the backend
        const response = await fetch('http://localhost:8000/deleteCard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ selectedCards: deletedTerms, setid: setid, userid: userid })
        });
        if (!response.ok) throw new Error('Failed to delete card from set');
        const result = await response.json();
        alert(result.message); // Notify user of success
    } catch (error) {
        console.error('Error deleting card from set:', error);
    }
});

//when user clicks delete set button...
delSetBtn.addEventListener('click', async (event) => {
    try {
        console.log(userid, setid);
        // Make a POST request to the backend
        const response = await fetch('http://localhost:8000/deleteSet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ setName: setid, userId: userid })
        });
        console.log(response.body);
        if (!response.ok) throw new Error('Failed to delete set');
        const result = await response.json();
        alert(result.message); // Notify user of success
        window.location.href = '/index.html'; //redirect user to home page to see set was deleted successfully
    } catch (error) {
        console.error('Error deleting set:', error);
    }
});