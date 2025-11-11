// Me duele practice - JavaScript

// Global variables
let painPointsData = [];
let currentMode = null;
let currentBodyPart = null;
let answerShown = false;

// Load data and initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    loadSVG();
});

// Load pain points data from JSON
async function loadData() {
    try {
        const response = await fetch('../data/me-duele.json');
        const data = await response.json();
        painPointsData = data['pain-points'];
    } catch (error) {
        console.error('Error loading pain points data:', error);
    }
}

// Load SVG into the container
async function loadSVG() {
    try {
        const response = await fetch('../images/MeDuele.svg');
        const svgText = await response.text();
        const container = document.getElementById('bodyImageContainer');
        container.innerHTML = svgText;
        
        // Add click event listeners to all rectangles with IDs
        const bodyParts = document.querySelectorAll('rect[id]');
        bodyParts.forEach(part => {
            part.addEventListener('click', handleBodyPartClick);
        });
    } catch (error) {
        console.error('Error loading SVG:', error);
    }
}

// Select practice mode
function selectMode(mode) {
    currentMode = mode;
    
    // Update button styling
    const buttons = document.querySelectorAll('.exercise-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Reset the exercise
    resetExercise();
    
    // Update prompt box
    const promptBox = document.getElementById('promptBox');
    promptBox.innerHTML = '<p class="placeholder-text">Click on a body part to practice.</p>';
}

// Handle body part click
function handleBodyPartClick(event) {
    if (!currentMode) {
        alert('Please select a practice mode first.');
        return;
    }
    
    const bodyPartId = event.target.id;
    const bodyPartData = painPointsData.find(item => item.id === bodyPartId);
    
    if (!bodyPartData) {
        console.error('Body part data not found for:', bodyPartId);
        return;
    }
    
    currentBodyPart = bodyPartData;
    answerShown = false;
    
    // Generate prompt based on mode
    displayPrompt();
    
    // Enable Show Answer button
    document.getElementById('showAnswerBtn').disabled = false;
    
    // Clear answer box
    const answerBox = document.getElementById('answerBox');
    answerBox.innerHTML = '<p class="placeholder-text">Click Show Answer to see the correct response.</p>';
}

// Display the prompt based on current mode
function displayPrompt() {
    const promptBox = document.getElementById('promptBox');
    
    switch (currentMode) {
        case 'vocab':
            // Show "Me duele..." or "Me duelen..."
            promptBox.innerHTML = `<p class="question-text">${currentBodyPart['doler-yo']} _____</p>`;
            break;
            
        case 'verb':
            // Show "_____ [body part]"
            promptBox.innerHTML = `<p class="question-text">_____ ${currentBodyPart['body-part']}</p>`;
            break;
            
        case 'both':
            // Show just "?"
            promptBox.innerHTML = `<p class="question-text" style="font-size: 2rem;">?</p>`;
            break;
    }
}

// Show the answer
function showAnswer() {
    if (!currentBodyPart) {
        return;
    }
    
    answerShown = true;
    const answerBox = document.getElementById('answerBox');
    
    switch (currentMode) {
        case 'vocab':
            // Show full phrase: Me duele la cabeza
            answerBox.innerHTML = `
                <p class="answer-text-plus">${currentBodyPart['doler-yo']} ${currentBodyPart['body-part']}</p>
            `;
            break;
            
        case 'verb':
            // Show tú form: Te duele la cabeza
            answerBox.innerHTML = `
                <p class="answer-text-plus">${currentBodyPart['doler-tú']} ${currentBodyPart['body-part']}</p>
            `;
            break;
            
        case 'both':
            // Show all four "le" forms
            answerBox.innerHTML = `
                <div>
                    <p class="answer-text-plus" style="margin-bottom: 0.5rem;">${currentBodyPart['doler-usted']} ${currentBodyPart['body-part']}</p>
                    <p class="answer-text-plus" style="margin-bottom: 0.5rem;">${currentBodyPart['doler-él']} ${currentBodyPart['body-part']}</p>
                    <p class="answer-text-plus" style="margin-bottom: 0.5rem;">${currentBodyPart['doler-ella']} ${currentBodyPart['body-part']}</p>
                    <p class="answer-text-plus" style="margin-bottom: 0;">${currentBodyPart['doler-elle']} ${currentBodyPart['body-part']}</p>
                </div>
            `;
            break;
    }
}

// Reset the exercise
function resetExercise() {
    currentBodyPart = null;
    answerShown = false;
    
    const promptBox = document.getElementById('promptBox');
    const answerBox = document.getElementById('answerBox');
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    
    promptBox.innerHTML = '<p class="placeholder-text">Click on a body part to practice.</p>';
    answerBox.innerHTML = '<p class="placeholder-text">The answer will appear here after you click Show Answer.</p>';
    showAnswerBtn.disabled = true;
}

// Make functions globally available
window.selectMode = selectMode;
window.showAnswer = showAnswer;