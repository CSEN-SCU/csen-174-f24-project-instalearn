
document.addEventListener("DOMContentLoaded", () => {
    const createSetButton = document.getElementById("save-button");
    //console.log("button clicked");
    createSetButton.addEventListener("click", async () => {
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
            alert(result.message);
        } catch (error) {
            console.error(error);
            alert('An error occurred while adding the set.');
        }
    });
});