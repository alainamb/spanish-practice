// Spanish Commands Practice - Tú & Usted Forms

// Global variables
let currentScenario = null;
let selectedMode = null; // 'tu' or 'usted'
let commandsData = [];

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
            tú_do_command: "sé tranquilo/a",
            tú_dont_command: "no seas nervioso/a",
            usted_do_command: "sea tranquilo/a",
            usted_dont_command: "no sea nervioso/a"
        },
        {
            scenario: "A family member is rushing out the door without their phone and keys on the table.",
            tú_do_command: "trae tu teléfono y tus llaves",
            tú_dont_command: "no salgas sin tu teléfono y tus llaves",
            usted_do_command: "traiga su teléfono y sus llaves",
            usted_dont_command: "no salga sin su teléfono y sus llaves"
        },
        {
            scenario: "Your roommate is about to put a hot pan directly on the wooden counter.",
            tú_do_command: "pon la sartén en el salvamanteles",
            tú_dont_command: "no pongas la sartén en la mesa",
            usted_do_command: "ponga la sartén en el salvamanteles",
            usted_dont_command: "no ponga la sartén en la mesa"
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
    
    // Generate first scenario for the selected mode
    generateScenario();
}

// Generate a random scenario
function generateScenario() {
    if (!selectedMode) {
        return;
    }
    
    if (commandsData.length === 0) {
        console.error('No commands data available');
        return;
    }
    
    // Select random scenario
    currentScenario = commandsData[Math.floor(Math.random() * commandsData.length)];
    
    // Display scenario
    const scenarioBox = document.getElementById('scenarioBox');
    if (scenarioBox) {
        let scenarioHTML = `
            <p style="font-size: 1.2rem; line-height: 1.6; margin: 0;">
                <strong>${currentScenario.scenario}</strong>
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
            commandType = 'Tú - Affirmative Command';
        } else {
            commandText = currentScenario.tú_dont_command;
            commandType = 'Tú - Negative Command';
        }
    } else { // usted
        if (isPositive) {
            commandText = currentScenario.usted_do_command;
            commandType = 'Usted - Affirmative Command';
        } else {
            commandText = currentScenario.usted_dont_command;
            commandType = 'Usted - Negative Command';
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

// Next scenario function
function nextScenario() {
    generateScenario();
}

// Start loading data when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadCommandsData();
});

// Make functions available globally
window.selectMode = selectMode;
window.showAnswer = showAnswer;
window.nextScenario = nextScenario;