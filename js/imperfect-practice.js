// Spanish Imperfect Tense Practice

// Global variables
let currentVerb = null;
let currentSubject = null;
let currentMode = null;
let currentScenario = null;
let verbsData = [];
let interruptionsData = [];
let thenAndNowData = [];
let usedScenarios = [];

// Complete subjects list including elle/elles and nosotres
const subjects = [
    { pronoun: "yo", display: "yo" },
    { pronoun: "tú", display: "tú" },
    { pronoun: "él", display: "él" },
    { pronoun: "ella", display: "ella" },
    { pronoun: "elle", display: "elle" },
    { pronoun: "usted", display: "usted" },
    { pronoun: "nosotros", display: "nosotros" },
    { pronoun: "nosotras", display: "nosotras" },
    { pronoun: "nosotres", display: "nosotres" },
    { pronoun: "vosotros", display: "vosotros" },
    { pronoun: "vosotras", display: "vosotras" },
    { pronoun: "ellos", display: "ellos" },
    { pronoun: "ellas", display: "ellas" },
    { pronoun: "elles", display: "elles" },
    { pronoun: "ustedes", display: "ustedes" }
];

// Load all data files
async function loadAllData() {
    try {
        // Load verbs
        const verbsResponse = await fetch('../data/ESP-verbs.json');
        const verbsJson = await verbsResponse.json();
        verbsData = verbsJson.verbs;
        
        // Load interruptions
        const interruptionsResponse = await fetch('../data/imperfect-interruptions.json');
        const interruptionsJson = await interruptionsResponse.json();
        interruptionsData = interruptionsJson.interruptions;
        
        // Load then and now scenarios
        const thenNowResponse = await fetch('../data/imperfect-then-now.json');
        const thenNowJson = await thenNowResponse.json();
        thenAndNowData = thenNowJson.scenarios;
        
        initializeApp();
        
    } catch (error) {
        console.error('Error loading data:', error);
        useFallbackData();
        initializeApp();
    }
}

// Fallback data in case JSON doesn't load
function useFallbackData() {
    verbsData = [
        {
            infinitive: "bailar",
            english: "to dance",
            categories: ["regular ar verbs"],
            conjugationsImperfect: {
                yo: "bailaba",
                tú: "bailabas",
                él: "bailaba",
                ella: "bailaba",
                elle: "bailaba",
                usted: "bailaba",
                nosotros: "bailábamos",
                nosotras: "bailábamos",
                nosotres: "bailábamos",
                vosotros: "bailabais",
                vosotras: "bailabais",
                ellos: "bailaban",
                ellas: "bailaban",
                elles: "bailaban",
                ustedes: "bailaban"
            }
        }
    ];
    
    interruptionsData = [
        "cuando sonó el teléfono",
        "cuando llegaron mis amigos",
        "cuando empezó a llover"
    ];
    
    thenAndNowData = [
        { 
            scenario: "Ahora vivo en Milwaukee, pero antes...", 
            response: "...vivía en otra ciudad. ¿Y tú? ¿Dónde vivías antes?",
            context: "location" 
        },
        { 
            scenario: "Hoy en día trabajo en una oficina, pero antes...", 
            response: "...trabajaba en un restaurante. Era muy diferente.",
            context: "work" 
        }
    ];
}

// Initialize the app
function initializeApp() {
    // No default mode selected - user must choose
    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML = '<p class="placeholder-text">Once you pick a practice mode, the first question will appear here.</p>';
    }
}

// ========================================
// SHARED HELPER FUNCTIONS
// ========================================

// Select a non-repeating scenario from an array (shared logic with scenario-practice.js)
function selectNonRepeatingScenario(scenariosArray) {
    if (scenariosArray.length === 0) {
        return null;
    }
    
    // If all scenarios have been used, reset the used list
    if (usedScenarios.length === scenariosArray.length) {
        usedScenarios = [];
    }
    
    // Find scenarios that haven't been used yet
    const availableScenarios = scenariosArray.filter((scenario, index) => 
        !usedScenarios.includes(index)
    );
    
    // Select random scenario from available ones
    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    const selectedScenario = availableScenarios[randomIndex];
    
    // Mark this scenario as used
    const originalIndex = scenariosArray.indexOf(selectedScenario);
    usedScenarios.push(originalIndex);
    
    return selectedScenario;
}

// Select random verb and subject
function selectRandomVerbAndSubject() {
    currentVerb = verbsData[Math.floor(Math.random() * verbsData.length)];
    currentSubject = subjects[Math.floor(Math.random() * subjects.length)];
}

// Get imperfect conjugation with nosotres fallback
function getImperfectConjugation() {
    let conjugation = currentVerb.conjugationsImperfect[currentSubject.pronoun];
    
    // Fallback to nosotros if nosotres doesn't exist
    if (!conjugation && currentSubject.pronoun === 'nosotres') {
        conjugation = currentVerb.conjugationsImperfect['nosotros'];
    }
    
    return conjugation;
}

// Format answer with proper capitalization
function formatAnswer(conjugation) {
    if (currentSubject.pronoun === 'yo') {
        // Capitalize first letter for yo
        return conjugation.charAt(0).toUpperCase() + conjugation.slice(1);
    } else {
        return `${currentSubject.display.charAt(0).toUpperCase() + currentSubject.display.slice(1)} ${conjugation}`;
    }
}

// ========================================
// MODE SELECTION AND QUESTION GENERATION
// ========================================

// Select mode function
function selectMode(mode) {
    currentMode = mode;
    usedScenarios = []; // Reset used scenarios when switching modes
    
    // Update button styles
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const clickedButton = Array.from(document.querySelectorAll('.category-btn')).find(btn => 
        btn.getAttribute('onclick').includes(`'${mode}'`)
    );
    if (clickedButton) {
        clickedButton.classList.add('selected');
    }
    
    // Generate first question
    generateQuestion();
}

// Generate a random question
function generateQuestion() {
    if (!currentMode) {
        return;
    }
    
    if (currentMode === 'interruptions') {
        generateInterruptionQuestion();
    } else if (currentMode === 'then-and-now') {
        generateThenAndNowQuestion();
    }
    
    // Reset answer section
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Click the Show Example button, and an example .</p>';
    }
}

// ========================================
// INTERRUPTIONS MODE
// ========================================

// Generate interruption question (random selection each time)
function generateInterruptionQuestion() {
    selectRandomVerbAndSubject();
    currentScenario = interruptionsData[Math.floor(Math.random() * interruptionsData.length)];
    
    displayInterruptionQuestion();
}

// Display interruption question
function displayInterruptionQuestion() {
    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML = `
            <p class="question-text">_______ ${currentScenario}.</p>
            <div class="verb-info" style="margin-top: 15px;">
                <strong>Subject:</strong> ${currentSubject.display} | <strong>Verb:</strong> ${currentVerb.infinitive}
            </div>
        `;
    }
}

// ========================================
// THEN AND NOW MODE
// ========================================

// Generate then and now question (non-repeating scenarios)
function generateThenAndNowQuestion() {
    currentScenario = selectNonRepeatingScenario(thenAndNowData);
    
    if (!currentScenario) {
        return;
    }
    
    displayThenAndNowQuestion();
}

// Display then and now question
function displayThenAndNowQuestion() {
    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML = `
            <p class="question-text">${currentScenario.scenario} ______</p>
        `;
    }
}

// ========================================
// ANSWER DISPLAY
// ========================================

// Show answer function
function showAnswer() {
    if (!currentMode) {
        return;
    }
    
    const answerBox = document.getElementById('answerBox');
    
    if (currentMode === 'then-and-now') {
        // For Then and Now mode, show the pre-written response
        if (!currentScenario) {
            return;
        }
        
        if (answerBox) {
            answerBox.innerHTML = `<div class="answer-text">${currentScenario.response}...</div>`;
        }
    } else if (currentMode === 'interruptions') {
        // For Interruptions mode, show the conjugated verb
        if (!currentVerb || !currentSubject) {
            return;
        }
        
        const conjugation = getImperfectConjugation();
        const answer = formatAnswer(conjugation);
        
        if (answerBox) {
            answerBox.innerHTML = `
                <div class="answer-text-plus">${answer}...</div>
                <div class="verb-info">
                    <strong>Infinitivo:</strong> ${currentVerb.infinitive}<br>
                    <strong>Significado:</strong> ${currentVerb.english}
                </div>
            `;
        }
    }
}

// ========================================
// NAVIGATION
// ========================================

// Next question function
function nextQuestion() {
    generateQuestion();
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
});

// Make functions globally available
window.selectMode = selectMode;
window.showAnswer = showAnswer;
window.nextQuestion = nextQuestion;