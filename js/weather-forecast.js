// Weather Forecast Practice - JavaScript

// Global variables
let citiesData = [];
let currentCity = null;
let currentQuestionIndex = 0;
let selectedDays = new Set();
let answerChecked = false;

// Weather icon mapping
const weatherIcons = {
    'sunny': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'rainy': '🌧️',
    'stormy': '⛈️',
    'snowy': '❄️',
    'windy': '💨',
    'foggy': '🌫️',
    'hot': '🌡️'
};

// Load data and initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// Load weather data from JSON
async function loadData() {
    try {
        const response = await fetch('../data/weather-forecast.json');
        const data = await response.json();
        citiesData = data.cities;
        console.log('Weather data loaded:', citiesData.length, 'cities');
    } catch (error) {
        console.error('Error loading weather data:', error);
    }
}

// Select a city
function selectCity(cityId) {
    // Find the city data
    currentCity = citiesData.find(city => city.id === cityId);
    
    if (!currentCity) {
        console.error('City not found:', cityId);
        return;
    }
    
    // Update button styling
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Reset question index
    currentQuestionIndex = 0;
    
    // Update city name in header
    document.getElementById('cityNameHeader').textContent = `Weekly Forecast - ${currentCity.name}`;
    
    // Load the forecast and first question
    loadForecast();
    loadQuestion();
}

// Load the forecast display
function loadForecast() {
    const container = document.getElementById('forecastDisplay');
    container.innerHTML = '';
    
    // Create forecast grid
    const grid = document.createElement('div');
    grid.className = 'forecast-grid';
    
    // Create day cards
    currentCity.forecast.forEach((dayData, index) => {
        const card = createDayCard(dayData, index + 1);
        grid.appendChild(card);
    });
    
    container.appendChild(grid);
}

// Create a single day card
function createDayCard(dayData, dayNumber) {
    const card = document.createElement('div');
    card.className = 'day-card';
    card.dataset.dayNumber = dayNumber;
    card.addEventListener('click', () => handleDayClick(dayNumber));
    
    // Day name
    const dayName = document.createElement('div');
    dayName.className = 'day-name';
    dayName.textContent = dayData.day;
    card.appendChild(dayName);
    
    // Weather icon
    const icon = document.createElement('div');
    icon.className = 'weather-icon';
    icon.textContent = weatherIcons[dayData.condition] || '☀️';
    card.appendChild(icon);
    
    // High temperature
    const tempHigh = document.createElement('div');
    tempHigh.className = 'temp-high';
    tempHigh.textContent = `${dayData.high}°`;
    card.appendChild(tempHigh);
    
    // Low temperature
    const tempLow = document.createElement('div');
    tempLow.className = 'temp-low';
    tempLow.textContent = `${dayData.low}°`;
    card.appendChild(tempLow);
    
    return card;
}

// Handle day click
function handleDayClick(dayNumber) {
    if (answerChecked) return; // Don't allow clicks after checking answer
    
    const card = document.querySelector(`.day-card[data-day-number="${dayNumber}"]`);
    
    if (selectedDays.has(dayNumber)) {
        // Deselect
        selectedDays.delete(dayNumber);
        card.classList.remove('selected');
    } else {
        // Select
        selectedDays.add(dayNumber);
        card.classList.add('selected');
    }
    
    // Enable check answer button if at least one day is selected
    const checkBtn = document.getElementById('checkAnswerBtn');
    checkBtn.disabled = selectedDays.size === 0;
}

// Load current question
function loadQuestion() {
    if (!currentCity || currentQuestionIndex >= currentCity.questions.length) {
        return;
    }
    
    const question = currentCity.questions[currentQuestionIndex];
    
    // Display question
    const questionBox = document.getElementById('questionBox');
    questionBox.innerHTML = `<p class="question-text">${question.text}</p>`;
    
    // Reset state
    selectedDays.clear();
    answerChecked = false;
    
    // Clear any previous feedback
    clearFeedback();
    
    // Re-enable day cards
    const cards = document.querySelectorAll('.day-card');
    cards.forEach(card => {
        card.classList.remove('selected', 'disabled');
    });
    
    // Reset buttons
    document.getElementById('checkAnswerBtn').disabled = true;
    document.getElementById('checkAnswerBtn').classList.remove('hidden');
    document.getElementById('nextQuestionBtn').classList.add('hidden');
}

// Check the answer
function checkAnswer() {
    if (!currentCity) return;
    
    answerChecked = true;
    const question = currentCity.questions[currentQuestionIndex];
    const correctDays = new Set(question.correctDays);
    
    // Disable day clicks
    const cards = document.querySelectorAll('.day-card');
    cards.forEach(card => {
        card.classList.add('disabled');
        card.classList.remove('selected');
    });
    
    // Check each selected day
    let allCorrect = true;
    selectedDays.forEach(day => {
        if (correctDays.has(day)) {
            showFeedback(day, 'correct');
        } else {
            showFeedback(day, 'incorrect');
            allCorrect = false;
        }
    });
    
    // Check for missed days
    correctDays.forEach(day => {
        if (!selectedDays.has(day)) {
            showFeedback(day, 'missed');
            allCorrect = false;
        }
    });
    
    // Show result
    if (allCorrect && selectedDays.size === correctDays.size) {
        // Success!
        launchConfetti();
        setTimeout(() => {
            document.getElementById('checkAnswerBtn').classList.add('hidden');
            document.getElementById('nextQuestionBtn').classList.remove('hidden');
        }, 300);
    } else {
        // Not quite - still show next question button after a moment
        setTimeout(() => {
            document.getElementById('checkAnswerBtn').classList.add('hidden');
            document.getElementById('nextQuestionBtn').classList.remove('hidden');
        }, 1500);
    }
}

// Show feedback on a day card
function showFeedback(dayNumber, type) {
    const card = document.querySelector(`.day-card[data-day-number="${dayNumber}"]`);
    if (!card) return;
    
    // Create feedback overlay
    const overlay = document.createElement('div');
    overlay.className = `feedback-overlay ${type}`;
    
    // Set feedback icon based on type
    if (type === 'correct') {
        overlay.textContent = '✓';
    } else if (type === 'incorrect') {
        overlay.textContent = '✗';
    } else if (type === 'missed') {
        overlay.textContent = '!';
    }
    
    card.appendChild(overlay);
}

// Clear all feedback overlays
function clearFeedback() {
    const overlays = document.querySelectorAll('.feedback-overlay');
    overlays.forEach(overlay => overlay.remove());
}

// Move to next question
function nextQuestion() {
    currentQuestionIndex++;
    
    // Check if we've completed all questions for this city
    if (currentQuestionIndex >= currentCity.questions.length) {
        launchConfetti();
        setTimeout(() => {
            alert(`¡Excelente! You've completed all questions for ${currentCity.name}. Select another city to continue practicing!`);
            
            // Reset for this city
            currentQuestionIndex = 0;
            
            // Clear the display
            const questionBox = document.getElementById('questionBox');
            questionBox.innerHTML = '<p class="placeholder-text">Select another city to continue practicing.</p>';
            
            document.getElementById('nextQuestionBtn').classList.add('hidden');
            
            // Reset city name header
            document.getElementById('cityNameHeader').textContent = 'Weekly Forecast';
            
        }, 300);
        return;
    }
    
    // Load next question
    loadQuestion();
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
window.selectCity = selectCity;
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;