document.addEventListener("DOMContentLoaded", () => {
    const createSetButton = document.getElementById("save-button");

    createSetButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        var setName = document.getElementById("set-name").value.trim();
        const user = "userid1"; // Replace with dynamic user identification logic

        setName = setName.toLowerCase();

        if (!setName) {
            alert("Set name is required!");
            return;
        }

        try {
            idToken = localStorage.getItem("userToken");
            const response = await fetch('/addSet', {
                method: 'POST',
                headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${idToken}` 
                },
                body: JSON.stringify({ name: setName }),
              });
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const result = await response.json();
            //alert(result.message);

            window.location.href = "index.html";  //redirect to home page
        } catch (error) {
            console.error(error);
            alert('An error occurred while adding the set.');
        }
    });
    
});

document.querySelector('.logout').addEventListener('click', async () => {
    try {
        // Sign out from Firebase (if using Firebase Auth)
        if (typeof firebase !== 'undefined') {
            const auth = firebase.auth();
            await auth.signOut();
            console.log('User signed out from Firebase');
        }
        localStorage.removeItem("userId");
        // Redirect to login page
        window.location.href = "/login.html"; // Adjust the path to your login page
    } catch (error) {
        console.error("Error logging out:", error);
        alert("An error occurred while logging out. Please try again.");
    }
});