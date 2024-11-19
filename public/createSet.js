document.addEventListener("DOMContentLoaded", () => {
    const createSetButton = document.getElementById("save-button");

    createSetButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const setName = document.getElementById("set-name").value.trim();
        const user = "userid1"; // Replace with dynamic user identification logic

        if (!setName) {
            alert("Set name is required!");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/addSet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user, name: setName }) // Include both user and set name
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