// Global variables
let currentScenario = null;
let scenariosData = [];
let usedScenarios = [];

// Get the data file from the script tag's data attribute
function getDataFile() {
    const scriptTag = document.currentScript || document.querySelector('script[data-file]');
    return scriptTag ? scriptTag.getAttribute('data-file') : null;
}

// Load scenario data from JSON file
async function loadScenarioData() {
    const dataFile = getDataFile();
    
    if (!dataFile) {
        console.error('No data file specified in script tag');
        return;
    }
    
    try {
        const response = await fetch(`../data/${dataFile}`);
        const data = await response.json();
        
        scenariosData = data.scenarios;
        
        // Initialize the app after data is loaded
        initializeApp();
        
    } catch (error) {
        console.error('Error loading scenario data:', error);
        alert('Error loading activity data. Please refresh the page.');
    }
}

// Initialize the app
function initializeApp() {
    // Set up the first scenario automatically
    generateScenario();
}

// Generate a new scenario
function generateScenario() {
    
    if (scenariosData.length === 0) {
        return;
    }
    
    // If all scenarios have been used, reset the used list
    if (usedScenarios.length === scenariosData.length) {
        usedScenarios = [];
    }
    
    // Find scenarios that haven't been used yet
    const availableScenarios = scenariosData.filter((scenario, index) => 
        !usedScenarios.includes(index)
    );
    
    // Select random scenario from available ones
    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    currentScenario = availableScenarios[randomIndex];
    
    // Mark this scenario as used
    const originalIndex = scenariosData.indexOf(currentScenario);
    usedScenarios.push(originalIndex);
    
    // Display scenario
    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML = `<p class="question-text">${currentScenario.scenario}</p>`;
    }
    
    // Reset answer section to placeholder
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Once you click Show Answer, the appropriate response will appear here.</p>';
    }
}

// Show answer function
function showAnswer(nextScenario) {
    
    if (nextScenario) {
        // Generate new scenario
        generateScenario();
    } else {
        // Show the answer for current scenario
        if (!currentScenario) {
            return;
        }
    
        const answerBox = document.getElementById('answerBox');
        if (answerBox) {
            answerBox.innerHTML = `<div class="answer-text">${currentScenario.responses}</div>`;
        }
    }
}

// Start loading data when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadScenarioData();
});

// Make functions available globally
window.showAnswer = showAnswer;