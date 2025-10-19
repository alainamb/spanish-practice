// Global variables
let currentScenario = null;
let scenariosData = [];
let usedScenarios = [];

// Load scenario data from JSON file
async function loadScenarioData() {
    try {
        const response = await fetch('../data/courtesy-expressions.json');
        const data = await response.json();
        
        scenariosData = data.scenarios;
        
        // Initialize the app after data is loaded
        initializeApp();
        
    } catch (error) {
        console.error('Error loading scenario data:', error);
        // Fallback to sample data if JSON fails to load
        useFallbackData();
        initializeApp();
    }
}

// Fallback data in case JSON doesn't load
function useFallbackData() {
    
    scenariosData = [
        {
            scenario: "You'd like another slice of dessert.",
            responses: "Sí por favor | Con permiso"
        },
        {
            scenario: "Someone thanks you",
            responses: "De nada | No hay de que"
        },
        {
            scenario: "Someone gave you a gift.",
            responses: "Gracias | Muchas gracias"
        }
    ];
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
        answerBox.innerHTML = '<p class="placeholder-text">Once you click Show Answer, potential responses will appear here.</p>';
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
            console.log('Answer displayed successfully');
        }
    }
}

// Start loading data when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadScenarioData();
});

// Make functions available globally
window.showAnswer = showAnswer;