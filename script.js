const credentials = {
    USER: "USER",
    ADMIN: "ADMIN"
};

// Utility function to create option input fields
function createOptionField(optionNumber) {
    return `
        <label for="option${optionNumber}">Option ${optionNumber}:</label>
        <input type="text" id="option${optionNumber}" required>
    `;
}

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

// Poll Results Data
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

// Handle Vote Submission
function handleVote(event, pollIndex) {
    event.preventDefault();
    const selectedOption = document.querySelector(`input[name="vote-option-${pollIndex}"]:checked`);

    if (!selectedOption) {
        alert("Please select an option before voting!");
        return;
    }

    const hasVoted = localStorage.getItem(`voted-${pollIndex}`);
    if (hasVoted) {
        alert("You have already voted on this poll.");
        return;
    }

    const selectedValue = selectedOption.value;

    // Update votes
    pollResults[pollIndex].options.forEach(option => {
        if (option.option === selectedValue) {
            option.votes += 1;
        }
    });

    localStorage.setItem(`voted-${pollIndex}`, true); // Mark poll as voted
    updatePollResultsDisplay();  // Refresh the poll results
    showProgressBars(pollIndex, selectedValue);  // Display the updated progress bars
}

// Display Progress Bars
function showProgressBars(pollIndex, selectedValue) {
    const totalVotes = pollResults[pollIndex].options.reduce((total, option) => total + option.votes, 0);
    
    pollResults[pollIndex].options.forEach((option, index) => {
        const progressBar = document.getElementById(`progress-${pollIndex}-${index}`);
        const percentageText = document.getElementById(`percentage-${pollIndex}-${index}`);
        
        const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
        
        progressBar.style.display = "block";
        progressBar.querySelector('.progress-bar').style.width = `${percentage}%`;
        percentageText.textContent = `${percentage.toFixed(1)}%`;

        if (option.option === selectedValue) {
            progressBar.querySelector('.progress-bar').style.backgroundColor = 'blue';
        } else {
            progressBar.querySelector('.progress-bar').style.backgroundColor = 'gray';
        }
    });
}

// Update Poll Results Display
function updatePollResultsDisplay() {
    const resultsDiv = document.getElementById("poll-results");
    resultsDiv.innerHTML = '';

    pollResults.forEach((poll, pollIndex) => {
        const totalVotes = poll.options.reduce((total, option) => total + option.votes, 0);
        const pollElement = document.createElement("div");
        pollElement.className = "poll-container mb-4";
        pollElement.innerHTML = `<h3>${poll.pollName}</h3>`;

        poll.options.forEach((option, index) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const optionElement = `
                <div class="option">
                    <div class="progress mb-2" id="progress-${pollIndex}-${index}">
                        <div class="progress-bar" style="width: ${percentage}%; background-color: ${percentage > 0 ? 'blue' : 'gray'};"></div>
                    </div>
                    <p id="percentage-${pollIndex}-${index}">${option.option}: ${option.votes} votes (${percentage.toFixed(2)}%)</p>
                </div>
            `;
            pollElement.insertAdjacentHTML('beforeend', optionElement);
        });

        resultsDiv.appendChild(pollElement);
    });
}

// Admin Dashboard Functions

// Update Poll List on Admin Dashboard
function updatePollList() {
    const pollList = document.getElementById("poll-list");
    pollList.innerHTML = ''; // Clear existing polls

    pollResults.forEach((poll, pollIndex) => {
        const pollCard = `
            <div class="col-lg-4 mb-3">
                <div class="card poll-card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${poll.pollName}</h5>
                        <form id="pollForm-${pollIndex}">
                            ${poll.options.map((option, index) => `
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="vote-option-${pollIndex}" id="option-${pollIndex}-${index}" value="${option.option}">
                                    <label class="form-check-label" for="option-${pollIndex}-${index}">
                                        ${option.option}
                                    </label>
                                </div>
                            `).join('')}
                            <button type="button" class="btn btn-primary mt-3" onclick="handleVote(event, ${pollIndex})">Vote</button>
                        </form>
                        <div id="poll-results-${pollIndex}"></div>
                    </div>
                </div>
            </div>
        `;
        pollList.insertAdjacentHTML('beforeend', pollCard);
    });
}

// Function to add a poll
function addPoll(pollName, options) {
    const pollList = document.getElementById("poll-list");

    // Create a new poll container
    const pollContainer = document.createElement('div');
    pollContainer.classList.add('col-lg-4', 'mb-3'); // Add necessary classes for styling

    // Create poll card
    const pollCard = `
        <div class="card poll-card h-100 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">${pollName}</h5>
                <button class="btn btn-danger mt-3" onclick="deletePoll(${pollResults.length})">Delete Poll</button>
            </div>
        </div>
    `;

    pollContainer.innerHTML = pollCard;
    pollList.appendChild(pollContainer);
}

// Voting section control
function addPollOption() {
    const optionsContainer = document.getElementById('options-container');
    const newOptionCount = optionsContainer.getElementsByClassName('form-group').length + 1;
    if (newOptionCount <= 5) { // Limit options to 5
        const newOption = document.createElement('div');
        newOption.classList.add('form-group');
        newOption.innerHTML = `
            <label for="option${newOptionCount}">Option ${newOptionCount}</label>
            <input type="text" class="form-control" id="option${newOptionCount}" required>
        `;
        optionsContainer.appendChild(newOption);
    }
}

// Handle Poll Creation in Admin Dashboard
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

    if (pollName && options.length >= 2 && options.length <= 5) {
        pollResults.push({ pollName, options });
        addPoll(pollName, options); // Add the poll to the poll list
        
        updatePollList();
        closePollForm();
    } else {
        alert("Poll must have a name and between 2 to 5 options.");
    }
}

// Delete Poll Function
function deletePoll(pollIndex) {
    const pollName = pollResults[pollIndex].pollName;
    const confirmDelete = confirm(`Are you sure you want to delete poll "${pollName}"?`);
    if (confirmDelete) {
        pollResults.splice(pollIndex, 1);
        updatePollList();
    }
}

// Add a new poll option input field
function addPollOption() {
    if (optionCount < 5) { // Limit to 5 options
        optionCount++;
        const optionContainer = document.getElementById("options-container");
        const newOptionInput = createOptionField(optionCount);
        optionContainer.insertAdjacentHTML('beforeend', newOptionInput);
    }
}

// Initialize and render poll results on load
document.addEventListener("DOMContentLoaded", () => {
    updatePollList();
    updatePollResultsDisplay();
});

// Attach event listeners for login form
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
}
