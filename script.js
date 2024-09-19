function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "USER" && password === "USER") {
        alert("Logged in as USER.");
        document.getElementById("votingSection").style.display = "block"; // Show voting section
        document.getElementById("loginForm").style.display = "none"; // Hide login form
    } else if (username === "ADMIN" && password === "ADMIN") {
        alert("Logged in as ADMIN.");
        document.getElementById("votingSection").style.display = "block"; // Show voting section
        document.getElementById("adminSection").style.display = "block"; // Show admin panel
        document.getElementById("loginForm").style.display = "none"; // Hide login form
    } else {
        alert("Incorrect username or password.");
    }
}

// Voting form submission
document.getElementById("voteForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const selectedOption = document.querySelector('input[name="option"]:checked');
    
    if (selectedOption) {
        const vote = selectedOption.value;
        document.getElementById("resultMessage").textContent = `You voted for ${vote}. Thank you!`;
    } else {
        document.getElementById("resultMessage").textContent = "Please select an option before submitting.";
    }
});

// Admin: Add and Delete Polls (these are placeholders for now)
function addPoll() {
    alert("Admin added a new poll!");
}

function deletePoll() {
    alert("Admin deleted a poll!");
}
