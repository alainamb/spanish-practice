// Spanish Definite Articles Practice

let currentItem = null;
let selectedMode = null; // 'standard' (mapped from 'direct') or 'all' (mapped from 'indirect')
let articlesData = { standard: [], all: [] };
let unusedIndices = [];

// Load data from JSON
async function loadArticlesData() {
    try {
        const response = await fetch('../data/definite-articles.json');
        const data = await response.json();

        articlesData.standard = data.standard || [];
        // 'all' includes both standard items and non-binary items
        articlesData.all = [...(data.standard || []), ...(data.all || [])];

        initializeApp();
    } catch (error) {
        console.error('Error loading articles data:', error);
        useFallbackData();
        initializeApp();
    }
}

// Fallback data
function useFallbackData() {
    const fallbackStandard = [
        {
            sentence: "___ café de Colombia es famoso.",
            english: "Coffee from Colombia is famous.",
            noun: "café",
            article_needed: true,
            article_used: "El",
            rewritten: "El café de Colombia es famoso.",
            explanation: "Generic subjects in Spanish require definite articles. Since 'café' is masculine singular, use 'El'."
        }
    ];

    const fallbackAll = [
        ...fallbackStandard,
        {
            sentence: "___ amigues vienen hoy.",
            english: "The friends are coming today.",
            noun: "amigues",
            article_needed: true,
            article_used: "Les",
            rewritten: "Les amigues vienen hoy.",
            explanation: "Inclusive plural nouns use the non-binary plural article 'Les'."
        }
    ];

    articlesData = { standard: fallbackStandard, all: fallbackAll };
}

// Initialize application
function initializeApp() {
    const scenarioBox = document.getElementById('scenarioBox');
    if (scenarioBox) {
        scenarioBox.innerHTML = '<p class="placeholder-text">Once you select a practice mode, a sentence will appear here for you to practice.</p>';
    }
}

// Select practice mode ('direct' -> standard, 'indirect' -> all)
function selectMode(modeKey) {
    selectedMode = (modeKey === 'indirect') ? 'all' : 'standard';

    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('selected'));
    
    const clickedButton = Array.from(document.querySelectorAll('.category-btn')).find(btn =>
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${modeKey}'`)
    );
    if (clickedButton) clickedButton.classList.add('selected');

    // Reset remaining items pool whenever a mode is selected
    const pool = articlesData[selectedMode];
    unusedIndices = pool.map((_, index) => index);

    generateItem();
}

// Generate new random question item
function generateItem() {
    if (!selectedMode) return;

    const pool = articlesData[selectedMode];
    const scenarioBox = document.getElementById('scenarioBox');
    const answerBox = document.getElementById('answerBox');

    // Check if the user finished all questions in this mode
    if (unusedIndices.length === 0) {
        if (scenarioBox) {
            scenarioBox.innerHTML = `
                <p style="font-size: 1.2rem; color: #2e7d32; text-align: center;">
                    <strong>🎉 Activity Complete!</strong><br>
                    You have practiced all sentences in this mode. Click a practice mode button to try again!
                </p>
            `;
        }
        if (answerBox) {
            answerBox.innerHTML = '<p class="placeholder-text">Select a practice mode to restart.</p>';
        }
        currentItem = null;
        return;
    }

    // Pick a random position from the remaining unused indices
    const randomIndex = Math.floor(Math.random() * unusedIndices.length);
    const selectedItemIndex = unusedIndices[randomIndex];
    
    // Remove that index so it cannot be picked again
    unusedIndices.splice(randomIndex, 1);

    currentItem = pool[selectedItemIndex];

    if (scenarioBox) {
        scenarioBox.innerHTML = `
            <p style="font-size: 1.2rem; line-height: 1.6; margin: 0 0 0.4rem 0;">
                <strong>${currentItem.sentence}</strong>
            </p>
            <p style="margin: 0 0 0.6rem 0; font-style: italic; color: #666; font-size: 1rem;">
                ${currentItem.english}
            </p>
        `;
    }

    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Once you click Show Answer, the rewritten sentence and explanation will appear here.</p>';
    }
}

// Display the answer and rule explanation
function showAnswer() {
    if (!currentItem || !selectedMode) return;

    const answerBox = document.getElementById('answerBox');
    if (!answerBox) return;

    const articleInfo = currentItem.article_needed 
        ? `<span style="color: var(--color-primary, #2563eb); font-weight: bold;">${currentItem.article_used}</span>`
        : `<em>No article needed</em>`;

    answerBox.innerHTML = `
        <p style="margin: 0 0 0.3rem 0; font-size: 1rem;">
            <strong>Target Noun:</strong> ${currentItem.noun} 
            &nbsp;→&nbsp; 
            <strong>Article Required:</strong> ${articleInfo}
        </p>
        <p style="font-size: 1.2rem; line-height: 1.6; margin: 0.5rem 0 0.3rem 0;">
            <strong>Complete Sentence:</strong> ${currentItem.rewritten}
        </p>
        <p style="margin: 0.5rem 0 0; font-size: 1rem; color: #555; line-height: 1.5;">
            <strong>Explanation:</strong> ${currentItem.explanation}
        </p>
    `;
}

// Load next question
function nextItem() {
    generateItem();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    loadArticlesData();
});

// Global Function Exports
window.selectMode = selectMode;
window.showAnswer = showAnswer;
window.nextItem = nextItem;