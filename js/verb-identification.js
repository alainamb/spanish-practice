// Verb Identification Practice - Reusable Module

let isRevealed = false;
let currentActivity = null;

// Load and initialize the activity
async function initializeApp() {
    const textBox = document.getElementById('textBox');
    const activityId = textBox?.getAttribute('data-activity');
    
    if (!activityId) {
        console.error('No activity ID specified');
        return;
    }
    
    try {
        const response = await fetch('../data/verb-identification.json');
        const data = await response.json();
        
        currentActivity = data.activities.find(activity => activity.id === activityId);
        
        if (!currentActivity) {
            console.error(`Activity "${activityId}" not found`);
            return;
        }
        
        displayText(false);
    } catch (error) {
        console.error('Error loading activity:', error);
    }
}

// Display text based on reveal state
function displayText(revealed) {
    const textBox = document.getElementById('textBox');
    const revealBtn = document.getElementById('revealBtn');
    
    if (!textBox || !revealBtn || !currentActivity) {
        return;
    }
    
    if (revealed) {
        textBox.innerHTML = currentActivity.highlightedText;
        revealBtn.textContent = 'Reset';
        isRevealed = true;
    } else {
        textBox.innerHTML = currentActivity.originalText;
        revealBtn.textContent = 'Reveal';
        isRevealed = false;
    }
}

// Toggle between reveal and reset
function toggleReveal() {
    displayText(!isRevealed);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Make function globally available
window.toggleReveal = toggleReveal;