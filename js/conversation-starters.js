// Global variables
let conversationData = null;
let currentConversation = null;

// Load conversation data from JSON file
async function loadConversationData() {
    try {
        const response = await fetch('../data/conversation-starters.json');
        const data = await response.json();
        
        conversationData = data;
        
        // Initialize the app after data is loaded
        initializeApp();
        
    } catch (error) {
        console.error('Error loading conversation data:', error);
        alert('Error loading conversation data. Please refresh the page.');
    }
}

// Initialize the app
function initializeApp() {
    // Set up the first conversation automatically
    generateConversation();
}

// Check if a combination is inappropriate
function isInappropriateCombination(question, answer, throwback, throwbackAnswer) {
    const inappropriate = conversationData['inappropriate-combinations'];
    
    for (const rule of inappropriate) {
        let matchesRule = true;
        
        // Check if question matches (if rule has questions)
        if (rule.questions && !rule.questions.includes(question)) {
            matchesRule = false;
        }
        
        // Check if answer matches (if rule has answers)
        if (rule.answers && !rule.answers.includes(answer)) {
            matchesRule = false;
        }
        
        // Check if throwback matches (if rule has throwbacks)
        if (rule.throwbacks && !rule.throwbacks.includes(throwback)) {
            matchesRule = false;
        }
        
        // Check if throwback answer matches (if rule has throwback-answers)
        if (rule['throwback-answers'] && !rule['throwback-answers'].includes(throwbackAnswer)) {
            matchesRule = false;
        }
        
        // If all present criteria match, this combination is inappropriate
        if (matchesRule) {
            return true;
        }
    }
    
    return false;
}

// Generate a valid random conversation
function generateConversation() {
    if (!conversationData) {
        return;
    }
    
    const questions = conversationData.elements[0].questions;
    const answers = conversationData.elements[1].answers;
    const throwbacks = conversationData.elements[2].throwbacks;
    const throwbackAnswers = conversationData.elements[3]['throwback-answers'];
    
    let question, answer, throwback, throwbackAnswer;
    let attempts = 0;
    const maxAttempts = 100;
    
    // Keep trying random combinations until we find a valid one
    do {
        question = questions[Math.floor(Math.random() * questions.length)];
        answer = answers[Math.floor(Math.random() * answers.length)];
        throwback = throwbacks[Math.floor(Math.random() * throwbacks.length)];
        throwbackAnswer = throwbackAnswers[Math.floor(Math.random() * throwbackAnswers.length)];
        
        attempts++;
        
        if (attempts > maxAttempts) {
            console.error('Could not generate valid conversation after maximum attempts');
            break;
        }
        
    } while (isInappropriateCombination(question, answer, throwback, throwbackAnswer));
    
    // Store current conversation
    currentConversation = {
        question: question,
        answer: answer,
        throwback: throwback,
        throwbackAnswer: throwbackAnswer
    };
    
    // Display conversation
    displayConversation();
}

// Display the current conversation
function displayConversation() {
    const questionBox = document.getElementById('questionBox');
    
    if (questionBox && currentConversation) {
        questionBox.innerHTML = `
            <div class="conversation-display">
                <p class="conversation-line"><strong>Persona 1:</strong> Hola. ${currentConversation.question}</p>
                <p class="conversation-line"><strong>Persona 2:</strong> ${currentConversation.answer} ${currentConversation.throwback}</p>
                <p class="conversation-line"><strong>Persona 1:</strong> ${currentConversation.throwbackAnswer}</p>
            </div>
        `;
    }
}

// Show answer function (generates next conversation)
function showAnswer(nextConversation) {
    if (nextConversation) {
        generateConversation();
    }
}

// Start loading data when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadConversationData();
});

// Make functions available globally
window.showAnswer = showAnswer;