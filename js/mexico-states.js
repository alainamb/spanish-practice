// Mexico States Practice - JavaScript

// State data with ID mapping and display names (matching the SVG map IDs)
const mexicanStates = [
    { id: "MXAGU", name: "Aguascalientes" },
    { id: "MXBCN", name: "Baja California" },
    { id: "MXBCS", name: "Baja California Sur" },
    { id: "MXCAM", name: "Campeche" },
    { id: "MXCOA", name: "Coahuila" },
    { id: "MXCOL", name: "Colima" },
    { id: "MXCHP", name: "Chiapas" },
    { id: "MXCHH", name: "Chihuahua" },
    { id: "MXCMX", name: "Ciudad de México" },
    { id: "MXDUR", name: "Durango" },
    { id: "MXGUA", name: "Guanajuato" },
    { id: "MXGRO", name: "Guerrero" },
    { id: "MXHID", name: "Hidalgo" },
    { id: "MXJAL", name: "Jalisco" },
    { id: "MXMEX", name: "Estado de México" },
    { id: "MXMIC", name: "Michoacán" },
    { id: "MXMOR", name: "Morelos" },
    { id: "MXNAY", name: "Nayarit" },
    { id: "MXNLE", name: "Nuevo León" },
    { id: "MXOAX", name: "Oaxaca" },
    { id: "MXPUE", name: "Puebla" },
    { id: "MXQUE", name: "Querétaro" },
    { id: "MXROO", name: "Quintana Roo" },
    { id: "MXSLP", name: "San Luis Potosí" },
    { id: "MXSIN", name: "Sinaloa" },
    { id: "MXSON", name: "Sonora" },
    { id: "MXTAB", name: "Tabasco" },
    { id: "MXTAM", name: "Tamaulipas" },
    { id: "MXTLA", name: "Tlaxcala" },
    { id: "MXVER", name: "Veracruz" },
    { id: "MXYUC", name: "Yucatán" },
    { id: "MXZAC", name: "Zacatecas" }
];

// Practice state variables
let currentStateIndex = 0;
let remainingStates = [];
let completedStates = [];
let awaitingNext = false;

// Initialize the practice activity when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    startPractice();
});

// Initialize map event listeners
function initializeMap() {
    const statePaths = document.querySelectorAll('path[id^="MX"], circle[id^="MX"]');
    
    statePaths.forEach(element => {
        element.addEventListener('click', handleStateClick);
    });
}

// Start the practice activity
function startPractice() {
    completedStates = [];
    awaitingNext = false;
    
    // Create a shuffled copy of all states
    remainingStates = [...mexicanStates].sort(() => Math.random() - 0.5);
    
    // Always start with Ciudad de México
    const cdmxIndex = remainingStates.findIndex(state => state.id === "MXCMX");
    if (cdmxIndex !== -1) {
        const cdmx = remainingStates.splice(cdmxIndex, 1)[0];
        remainingStates.unshift(cdmx);
    }
    
    currentStateIndex = 0;
    
    // Reset all states on the map
    const statePaths = document.querySelectorAll('path[id^="MX"], circle[id^="MX"]');
    statePaths.forEach(element => {
        element.classList.remove('correct', 'completed');
    });
    
    // Hide restart button initially
    document.getElementById('restartBtn').classList.add('hidden');
    
    // Display first state
    displayCurrentState();
}

// Restart the practice
function restartPractice() {
    startPractice();
}

// Display the current state to find
function displayCurrentState() {
    const questionBox = document.getElementById('questionBox');
    const nextBtn = document.getElementById('nextBtn');
    
    if (currentStateIndex >= remainingStates.length) {
        // Practice completed!
        showCompletionMessage();
        return;
    }
    
    const currentState = remainingStates[currentStateIndex];
    awaitingNext = false;
    
    questionBox.innerHTML = `<p class="question-text">${currentState.name}</p>`;
    nextBtn.classList.add('hidden');
}

// Handle state click on the map
function handleStateClick(event) {
    if (awaitingNext) {
        return; // Don't allow clicking while waiting for next button
    }
    
    if (currentStateIndex >= remainingStates.length) {
        return;
    }
    
    const clickedStateId = event.target.id;
    const currentState = remainingStates[currentStateIndex];
    const questionBox = document.getElementById('questionBox');
    const nextBtn = document.getElementById('nextBtn');
    
    if (clickedStateId === currentState.id) {
        // Correct answer!
        completedStates.push(currentState.id);
        awaitingNext = true;
        
        // Visual feedback on map
        event.target.classList.add('correct');
        setTimeout(() => {
            event.target.classList.remove('correct');
            event.target.classList.add('completed');
        }, 1000);
        
        // Display success message in question box
        questionBox.innerHTML = `
            <p class="feedback-message correct">¡Correcto! That's ${currentState.name}!</p>
        `;
        
        // Show next button
        nextBtn.classList.remove('hidden');
        
    } else {
        // Incorrect answer
        const clickedState = mexicanStates.find(s => s.id === clickedStateId);
        const clickedStateName = clickedState ? clickedState.name : 'that state';
        
        // Visual feedback on map
        event.target.classList.add('incorrect');
        setTimeout(() => {
            event.target.classList.remove('incorrect');
        }, 800);
        
        // Display error message in question box
        questionBox.innerHTML = `
            <p class="question-text">${currentState.name}</p>
            <p class="feedback-message incorrect">That's ${clickedStateName}. Try again!</p>
        `;
    }
}

// Move to next state
function nextState() {
    currentStateIndex++;
    displayCurrentState();
}

// Make functions available globally
window.nextState = nextState;
window.restartPractice = restartPractice;