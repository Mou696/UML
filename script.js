const credentials = {
    USER: "USER",
    ADMIN: "ADMIN"
};

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (credentials[username] && credentials[username] === password) {
        localStorage.setItem("role", username);
        window.location.href = username === "ADMIN" ? "admin_dashboard.html" : "user_dashboard.html";
    } else {
        document.getElementById("username").classList.add("is-invalid");
        document.getElementById("password").classList.add("is-invalid");
        document.getElementById("error-message").style.display = "block";
    }
}

let pollResults = [
    { pollName: "Poll 1", options: [{ option: "Option 1", votes: 10 }, { option: "Option 2", votes: 5 }] },
    { pollName: "Poll 2", options: [{ option: "Option A", votes: 8 }, { option: "Option B", votes: 3 }] }
];

let optionCount = 2; // Initial number of options for new poll creation

// Check if user is logged in and allow voting
function checkLoginForVoting() {
    const role = localStorage.getItem("role");
    if (!role) {
        alert("Please log in to vote.");
        window.location.href = "login.html";
    }
}

function handleVote(event, pollIndex) {
    event.preventDefault();
    const selectedOption = document.querySelector('input[name="vote-option-' + pollIndex + '"]:checked');

    if (!selectedOption) {
        alert("Please select an option to vote.");
        return;
    }

    const selectedValue = selectedOption.value;

    // Update votes
    pollResults[pollIndex].options.forEach(option => {
        if (option.option === selectedValue) {
            option.votes += 1;
        }
    });

    alert(`You voted for ${selectedValue}`);
    updatePollResultsDisplay(); // Refresh the results display
    showProgressBars(pollIndex); // Update the progress bars
}

function showProgressBars(pollIndex) {
    const totalVotes = pollResults[pollIndex].options.reduce((total, option) => total + option.votes, 0);
    
    pollResults[pollIndex].options.forEach((option, index) => {
        const progressBar = document.getElementById(`progress-${pollIndex}-${index}`);
        const percentageText = document.getElementById(`percentage-${pollIndex}-${index}`);
        
        // Calculate the percentage
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        
        // Update the progress bar
        progressBar.style.display = "block";
        progressBar.querySelector('.progress-bar').style.width = `${percentage}%`;
        percentageText.style.display = "block";
        percentageText.textContent = `${percentage.toFixed(1)}%`;
        
        // Ensure the progress bar has a fixed height
        progressBar.style.height = "20px"; // Set a fixed height
        progressBar.querySelector('.progress-bar').style.height = "100%"; // Ensure inner bar fills it completely

        // Change colors
        if (option.votes > 0) {
            progressBar.querySelector('.progress-bar').style.backgroundColor = option.option === selectedValue ? 'blue' : 'gray';
        } else {
            progressBar.querySelector('.progress-bar').style.backgroundColor = 'gray';
        }
    });
}

function updatePollResultsDisplay() {
    const resultsDiv = document.getElementById("poll-results");
    resultsDiv.innerHTML = ''; // Clear current results

    pollResults.forEach((poll, pollIndex) => {
        const totalVotes = poll.options.reduce((total, option) => total + option.votes, 0);
        const pollElement = document.createElement("div");
        pollElement.className = "poll-container mb-4"; // Add class for styling
        pollElement.innerHTML = `<h3>${poll.pollName}</h3>`;

        poll.options.forEach((option, index) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const optionElement = `
                <div class="option">
                    <div class="progress mb-2" role="progressbar" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100" id="progress-${pollIndex}-${index}">
                        <div class="progress-bar" style="width: ${percentage}%; background-color: ${percentage > 0 ? 'blue' : 'gray'}; height: 100%;"></div>
                    </div>
                    <p id="percentage-${pollIndex}-${index}">${option.option}: ${option.votes} votes (${percentage.toFixed(2)}%)</p>
                </div>
            `;
            pollElement.insertAdjacentHTML('beforeend', optionElement);
        });

        resultsDiv.appendChild(pollElement);
    });
}

// Handle creating a new poll in the admin dashboard
function handleCreatePoll(event) {
    event.preventDefault();

    const pollName = document.getElementById("pollName").value.trim();
    const options = [];

    for (let i = 1; i <= optionCount; i++) {
        const optionValue = document.getElementById(`option${i}`).value.trim();
        if (optionValue) {
            options.push({ option: optionValue, votes: 0 });
        }
    }

    if (pollName && options.length >= 2) {
        pollResults.push({ pollName: pollName, options: options });
        alert(`Poll "${pollName}" created successfully.`);
        updatePollList(); // Refresh poll list for admin view
        closePollForm(); // Close and reset poll creation form
    } else {
        alert("Poll must have a name and at least 2 options.");
    }
}

// Update poll list for admin (for deletion and voting)
function updatePollList() {
    const pollList = document.getElementById("poll-list");

    if (pollList) {
        pollList.innerHTML = '';
        pollResults.forEach((poll, pollIndex) => {
            const pollCard = document.createElement("div");
            pollCard.className = "col-md-4 mb-3"; // Bootstrap column for layout

            pollCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${poll.pollName}</h5>
                        <div class="options mb-3">
                            ${poll.options.map(option => `
                                <div class="form-check">
                                    <input type="radio" class="form-check-input" id="${option.option}-${pollIndex}" name="vote-option-${pollIndex}" value="${option.option}">
                                    <label class="form-check-label" for="${option.option}-${pollIndex}">${option.option}</label>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-primary mt-3 vote-button" onclick="handleVote(event, ${pollIndex})">Vote</button>
                        <button class="btn btn-danger mt-3" onclick="deletePoll(${pollIndex})">Delete</button>
                    </div>
                </div>
            `;

            pollList.appendChild(pollCard);
        });
    }
}

// Delete a poll
function deletePoll(pollIndex) {
    const pollName = pollResults[pollIndex].pollName; // Store name before deletion
    const confirmDelete = confirm(`Are you sure you want to delete poll "${pollName}"?`);
    if (confirmDelete) {
        pollResults.splice(pollIndex, 1);
        alert(`Poll "${pollName}" deleted.`);
        updatePollList(); // Refresh poll list
    }
}

// Add a new poll option input field
function addPollOption() {
    optionCount++;
    const optionContainer = document.getElementById("options-container");
    const newOptionInput = document.createElement("div");
    newOptionInput.innerHTML = `
        <label for="option${optionCount}">Option ${optionCount}:</label>
        <input type="text" id="option${optionCount}" required>
    `;
    optionContainer.appendChild(newOptionInput);
}

// Reset and close the poll creation form
function closePollForm() {
    document.getElementById("pollName").value = '';
    document.getElementById("options-container").innerHTML = `
        <label for="option1">Option 1:</label>
        <input type="text" id="option1" required>
        <label for="option2">Option 2:</label>
        <input type="text" id="option2" required>
    `;
    optionCount = 2; // Reset option count to initial value
    document.getElementById("poll-form-modal").style.display = "none"; // Close modal
}

// Logout function
function logout() {
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

// Load data when admin dashboard is accessed
window.onload = function() {
    updatePollList(); // Show polls in admin dashboard
}
