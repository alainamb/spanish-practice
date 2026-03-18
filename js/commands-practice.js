// Spanish Commands Practice - Tú, Usted & Ustedes Forms

// Global variables
let currentScenario = null;
let selectedMode = null; // 'tu', 'usted', or 'ustedes'
let commandsData = [];
let remainingScenarios = [];
let isComplete = false;

// Load commands data from JSON file
async function loadCommandsData() {
    try {
        const response = await fetch('../data/commands.json');
        const data = await response.json();
        
        commandsData = data.commands;
        
        // Initialize the app after data is loaded
        initializeApp();
        
    } catch (error) {
        console.error('Error loading commands data:', error);
        // Use fallback data if JSON fails to load
        useFallbackData();
        initializeApp();
    }
}

// Fallback data in case JSON doesn't load
function useFallbackData() {
    commandsData = [
        {
            scenario: "Your friend is about to leave for an important job interview but seems nervous.",
            tú_do_command: "mantén la calma",
            tú_dont_command: "no dejes que los nervios te ganen",
            usted_do_command: "mantenga la calma",
            usted_dont_command: "no deje que los nervios le ganen",
            ustedes_do_command: "mantengan la calma",
            ustedes_dont_command: "no dejen que los nervios les ganen"
        },
        {
            scenario: "A family member is rushing out the door without their phone and keys on the table.",
            tú_do_command: "lleva tu teléfono y tus llaves",
            tú_dont_command: "no olvides tu teléfono y tus llaves",
            usted_do_command: "lleve su teléfono y sus llaves",
            usted_dont_command: "no olvide su teléfono y sus llaves",
            ustedes_do_command: "lleven sus teléfonos y sus llaves",
            ustedes_dont_command: "no olviden sus teléfonos y sus llaves"
        },
        {
            scenario: "Your roommate is about to put a hot pan directly on the wooden counter.",
            tú_do_command: "pon la sartén en el salvamanteles",
            tú_dont_command: "no pongas la sartén en la mesa",
            usted_do_command: "ponga la sartén en el salvamanteles",
            usted_dont_command: "no ponga la sartén en la mesa",
            ustedes_do_command: "pongan la sartén en el salvamanteles",
            ustedes_dont_command: "no pongan la sartén en la mesa"
        }
    ];
}

// Initialize the app
function initializeApp() {
    console.log('Commands practice app initialized with', commandsData.length, 'scenarios');
    
    // Set initial message
    const scenarioBox = document.getElementById('scenarioBox');
    if (scenarioBox) {
        scenarioBox.innerHTML = '<p class="placeholder-text">Once you select a practice mode, a scenario will appear here for you to practice.</p>';
    }
}

// Shuffle an array (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Select practice mode
function selectMode(mode) {
    selectedMode = mode;
    
    // Update button styles to show selection
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Find and highlight the clicked button
    const clickedButton = Array.from(document.querySelectorAll('.category-btn')).find(btn => 
        btn.getAttribute('onclick').includes(`'${mode}'`)
    );
    if (clickedButton) {
        clickedButton.classList.add('selected');
    }

    // Reset completion flag and queue, then start fresh
    isComplete = false;
    remainingScenarios = shuffleArray(commandsData);
    generateScenario();
}

// Generate the next scenario from the queue
function generateScenario() {
    if (!selectedMode) {
        return;
    }
    
    if (commandsData.length === 0) {
        console.error('No commands data available');
        return;
    }

    // If the queue is empty, all scenarios have been shown — celebrate!
    if (remainingScenarios.length === 0) {
        showCompletionMessage();
        return;
    }

    // Draw the next scenario from the front of the queue
    currentScenario = remainingScenarios.shift();
    
    // Display scenario
    const scenarioBox = document.getElementById('scenarioBox');
    if (scenarioBox) {
        const scenarioText = (selectedMode === 'ustedes' && currentScenario.ustedes_scenario)
            ? currentScenario.ustedes_scenario
            : currentScenario.scenario;

        let scenarioHTML = `
            <p style="font-size: 1.2rem; line-height: 1.6; margin: 0;">
                <strong>${scenarioText}</strong>
            </p>
        `;
        
        // Add verb suggestions if available
        if (currentScenario.verb_suggestions) {
            scenarioHTML += `
                <p style="margin-top: 0.5rem; margin-bottom: 0; font-style: italic; color: #666; font-size: 1rem;">
                    <strong>Verb(s) to use:</strong> ${currentScenario.verb_suggestions}
                </p>
            `;
        }
        
        scenarioBox.innerHTML = scenarioHTML;
    }
    
    // Reset answer section to placeholder
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Once you click a command button, a possible response will appear here.</p>';
    }
}

// Show answer function
function showAnswer(isPositive) {
    if (!currentScenario || !selectedMode) {
        return;
    }
    
    let commandText;
    let commandType;
    
    // Determine which command to show based on mode and positive/negative
    if (selectedMode === 'tu') {
        if (isPositive) {
            commandText = currentScenario.tú_do_command;
            commandType = 'Tú — Affirmative Command';
        } else {
            commandText = currentScenario.tú_dont_command;
            commandType = 'Tú — Negative Command';
        }
    } else if (selectedMode === 'usted') {
        if (isPositive) {
            commandText = currentScenario.usted_do_command;
            commandType = 'Usted — Affirmative Command';
        } else {
            commandText = currentScenario.usted_dont_command;
            commandType = 'Usted — Negative Command';
        }
    } else { // ustedes
        if (isPositive) {
            commandText = currentScenario.ustedes_do_command;
            commandType = 'Ustedes — Affirmative Command';
        } else {
            commandText = currentScenario.ustedes_dont_command;
            commandType = 'Ustedes — Negative Command';
        }
    }
    
    // Capitalize first letter of command
    const capitalizedCommand = commandText.charAt(0).toUpperCase() + commandText.slice(1);
    
    // Show answer in answer box
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = `
            <p style="font-size: 1.2rem; line-height: 1.6; margin: 0;">
                <strong>${capitalizedCommand}</strong>
            </p>
            <p style="margin-top: 0.5rem; margin-bottom: 0; font-style: italic; color: #666; font-size: 1rem;">
                <strong>Command Type:</strong> ${commandType}
            </p>
        `;
    }
}

// Show completion message
function showCompletionMessage() {
    if (isComplete) return;
    isComplete = true;
    launchConfetti();
    setTimeout(() => {
        alert('¡Excelente! You finished all the scenarios. Select another mode to keep practicing.');
        resetPage();
    }, 300);
}

// Reset the page to its initial state
function resetPage() {
    selectedMode = null;
    currentScenario = null;
    remainingScenarios = [];

    // Deselect all mode buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Reset scenario box
    const scenarioBox = document.getElementById('scenarioBox');
    if (scenarioBox) {
        scenarioBox.innerHTML = '<p class="placeholder-text">Once you select a practice mode, a scenario will appear here for you to practice.</p>';
    }

    // Reset answer box
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Once you click a command button, a possible response will appear here.</p>';
    }

    // Restore Next Scenario button
    const nextScenarioSection = document.getElementById('nextScenarioSection');
    if (nextScenarioSection) {
        nextScenarioSection.style.display = '';
    }
}

// Next scenario function
function nextScenario() {
    // Restore the Next Scenario button in case it was hidden
    const nextScenarioSection = document.getElementById('nextScenarioSection');
    if (nextScenarioSection) {
        nextScenarioSection.style.display = '';
    }
    generateScenario();
}

// Confetti animation
function launchConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// Start loading data when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadCommandsData();
});

// Make functions available globally
window.selectMode = selectMode;
window.showAnswer = showAnswer;
window.nextScenario = nextScenario;