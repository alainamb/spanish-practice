// 100 Mexicanos - Reusable Game Engine

// Global variables
let surveyData = [];
let currentQuestionIndex = 0;
let currentQuestion = null;
let revealedAnswers = new Set();
let strikes = 0;
let allAnswers = [];
let dataFilePath = ''; // Will be set by the HTML page

// Load data and initialize
document.addEventListener('DOMContentLoaded', function() {
    // Get data file path from the data attribute on the script tag
    const scriptTag = document.querySelector('script[data-json-file]');
    if (scriptTag) {
        dataFilePath = scriptTag.getAttribute('data-json-file');
    }
    
    if (dataFilePath) {
        loadData();
    } else {
        console.error('No data file path specified. Add data-json-file attribute to script tag.');
    }
});

// Load survey data from JSON
async function loadData() {
    try {
        const response = await fetch(dataFilePath);
        const data = await response.json();
        surveyData = data.surveyQs;
        console.log('Survey data loaded:', surveyData.length, 'questions');
    } catch (error) {
        console.error('Error loading survey data:', error);
    }
}

// Start the game
function startGame() {
    if (surveyData.length === 0) {
        alert('Data is still loading. Please wait a moment and try again.');
        return;
    }
    
    // Hide start button, show next button
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('nextBtn').classList.remove('hidden');
    
    // Start with first question
    currentQuestionIndex = 0;
    loadQuestion();
}

// Load a question
function loadQuestion() {
    // Reset game state
    revealedAnswers.clear();
    strikes = 0;
    
    // Get current question
    currentQuestion = surveyData[currentQuestionIndex];
    
    // Display question
    document.getElementById('questionText').textContent = currentQuestion.question;
    
    // Reset answer slots
    resetAnswerSlots();
    
    // Reset strikes
    resetStrikes();
    
    // Create answer buttons
    createAnswerButtons();
}

// Reset answer slots to placeholder state
function resetAnswerSlots() {
    for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`slot${i}`);
        slot.classList.remove('revealed');
        const answerSpan = slot.querySelector('.slot-answer');
        answerSpan.textContent = `Top Answer ${i}`;
    }
}

// Reset strikes display
function resetStrikes() {
    for (let i = 1; i <= 3; i++) {
        const strike = document.getElementById(`strike${i}`);
        strike.classList.remove('active');
    }
}

// Create answer buttons from current question
function createAnswerButtons() {
    const container = document.getElementById('answerButtons');
    container.innerHTML = '';
    
    // Combine top answers and random answers
    allAnswers = [
        { text: currentQuestion.top1answer, isTop: true, slot: 1 },
        { text: currentQuestion.top2answer, isTop: true, slot: 2 },
        { text: currentQuestion.top3answer, isTop: true, slot: 3 },
        { text: currentQuestion.top4answer, isTop: true, slot: 4 },
        { text: currentQuestion.top5answer, isTop: true, slot: 5 },
        ...currentQuestion.randomAnswers.map(answer => ({ text: answer, isTop: false, slot: null }))
    ];
    
    // Shuffle the answers
    shuffleArray(allAnswers);
    
    // Create buttons
    allAnswers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        button.onclick = () => handleAnswerClick(answer, button);
        container.appendChild(button);
    });
}

// Handle answer button click
function handleAnswerClick(answer, button) {
    // Disable the button
    button.disabled = true;
    
    if (answer.isTop) {
        // Correct answer!
        button.classList.add('correct');
        revealAnswer(answer.slot, answer.text);
        
        // Check if all answers revealed
        if (revealedAnswers.size === 5) {
            launchConfetti();
            setTimeout(() => {
                alert('¡Excelente! You found all 5 top answers!');
            }, 300);
        }
    } else {
        // Incorrect answer - add strike
        button.classList.add('incorrect');
        addStrike();
    }
}

// Reveal an answer on the board
function revealAnswer(slotNumber, answerText) {
    revealedAnswers.add(slotNumber);
    
    const slot = document.getElementById(`slot${slotNumber}`);
    const answerSpan = slot.querySelector('.slot-answer');
    
    answerSpan.textContent = answerText;
    slot.classList.add('revealed');
}

// Add a strike
function addStrike() {
    strikes++;
    
    const strike = document.getElementById(`strike${strikes}`);
    strike.classList.add('active');
    
    // Check if game over (3 strikes)
    if (strikes === 3) {
        setTimeout(() => {
            alert('Three strikes! The round is over. Click "Next Question" to continue.');
            disableAllButtons();
        }, 300);
    }
}

// Disable all answer buttons
function disableAllButtons() {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);
}

// Move to next question
function nextQuestion() {
    currentQuestionIndex++;
    
    // Check if we've gone through all questions
    if (currentQuestionIndex >= surveyData.length) {
        launchConfetti();
        setTimeout(() => {
            alert('¡Felicidades! You\'ve completed all questions!');
        }, 300);
        currentQuestionIndex = 0; // Loop back to start
    }
    
    loadQuestion();
}

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Confetti animation function
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
        
        // Create confetti from two points
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

// Make functions globally available
window.startGame = startGame;
window.nextQuestion = nextQuestion;