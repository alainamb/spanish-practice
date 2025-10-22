// Spanish Verb Conjugation Practice - Present Tense Q&A

// Global variables
let currentVerb = null;
let currentSubject = null;
let selectedCategory = 'all'; // Default to 'all' verbs
let verbsData = [];
let categoriesData = [];

// Complete subjects list including elle/elles and nosotras
const subjects = [
    { pronoun: "tú", needsSubject: false },
    { pronoun: "usted", needsSubject: true },
    { pronoun: "él", needsSubject: true },
    { pronoun: "ella", needsSubject: true },
    { pronoun: "elle", needsSubject: true },
    { pronoun: "ustedes", needsSubject: true },
    { pronoun: "ellos", needsSubject: true },
    { pronoun: "ellas", needsSubject: true },
    { pronoun: "elles", needsSubject: true }
    // Removed nosotros/nosotras to avoid subjunctive command forms in negative responses
];

// Load verb data from JSON file
async function loadVerbData() {
    try {
        const response = await fetch('/data/ESP-verbs.json');
        const data = await response.json();
        
        verbsData = data.verbs;
        categoriesData = data.categories;
        
        // Initialize the app after data is loaded
        initializeApp();
        
    } catch (error) {
        // Fallback to sample data if JSON fails to load
        useFallbackData();
        initializeApp();
    }
}

// Fallback data in case JSON doesn't load
function useFallbackData() {
    
    categoriesData = [
        "important verbs",
        "regular ar verbs", 
        "regular er verbs",
        "regular ir verbs",
        "stem changers: e:ie",
        "stem changers: o:ue", 
        "stem changers: e:i",
        "irregular yo",
        "to be or to be",
        "to know or to know"
    ];
    
    verbsData = [
        {
            infinitive: "bailar",
            english: "to dance",
            categories: ["regular ar verbs"],
            conjugationsPresent: {
                yo: "bailo",
                tú: "bailas",
                él: "baila",
                ella: "baila",
                elle: "baila",
                usted: "baila",
                nosotros: "bailamos",
                nosotras: "bailamos",
                ellos: "bailan",
                ellas: "bailan",
                elles: "bailan",
                ustedes: "bailan"
            }
        },
        {
            infinitive: "conocer",
            english: "to know (people/places)",
            categories: ["to know or to know", "irregular yo"],
            conjugationsPresent: {
                yo: "conozco",
                tú: "conoces",
                él: "conoce",
                ella: "conoce",
                elle: "conoce",
                usted: "conoce",
                nosotros: "conocemos",
                nosotras: "conocemos",
                ellos: "conocen",
                ellas: "conocen",
                elles: "conocen",
                ustedes: "conocen"
            }
        }
    ];
}

// Always ensure bailar is available as fallback
function ensureBailarExists() {
    const bailarExists = verbsData.some(verb => verb.infinitive === "bailar");
    
    if (!bailarExists) {
        verbsData.unshift({
            infinitive: "bailar",
            english: "to dance",
            categories: ["regular ar verbs"],
            conjugationsPresent: {
                yo: "bailo",
                tú: "bailas",
                él: "baila",
                ella: "baila",
                elle: "baila",
                usted: "baila",
                nosotros: "bailamos",
                nosotras: "bailamos",
                ellos: "bailan",
                ellas: "bailan",
                elles: "bailan",
                ustedes: "bailan"
            }
        });
    }
}

// Initialize the app
function initializeApp() {
    
    // Ensure bailar exists in the verb data
    ensureBailarExists();
    
    // Set "All verbs" as selected by default
    const allVerbsButton = document.querySelector('button[onclick="selectCategory(\'all\')"]');
    if (allVerbsButton) {
        allVerbsButton.classList.add('selected');
    }
    
    // Set up the default question: "¿Bailas?"
    setupDefaultQuestion();

}

// Set up the default question and answer
function setupDefaultQuestion() {
    
    // Ensure we find "bailar" verb - it should definitely exist now
    currentVerb = verbsData.find(verb => verb.infinitive === "bailar");
    
    // Set subject to "tú" for "¿Bailas?"
    currentSubject = subjects.find(subject => subject.pronoun === "tú");
    
    if (!currentVerb) {
        return;
    }
    
    if (!currentSubject) {
        return;
    }
    
    // Display the question "¿Bailas?"
    const questionText = "¿Bailas...?";
    
    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML = `<p class="question-text">${questionText}</p>`;
    }
    
    // Show the default positive answer
    showAnswer(true);
}

// Select category function
function selectCategory(category) {
    
    selectedCategory = category;
    
    // Update button styles to show selection
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Find and highlight the clicked button
    const clickedButton = Array.from(document.querySelectorAll('.category-btn')).find(btn => 
        btn.getAttribute('onclick').includes(`'${category}'`)
    );
    if (clickedButton) {
        clickedButton.classList.add('selected');
    }
    
    // Generate new question for the selected category
    generateQuestion();
}

// Generate a random question
function generateQuestion() {
    
    if (!selectedCategory) {
        return;
    }
    
    // Filter verbs by category
    let availableVerbs;
    if (selectedCategory === 'all') {
        availableVerbs = verbsData;
    } else {
        // Map HTML button categories to JSON categories
        let jsonCategory = selectedCategory;
        
        // Handle all the category name mappings
        const categoryMappings = {
            'stem changers: e→ie': 'stem changers: e:ie',
            'stem changers: o→ue': 'stem changers: o:ue', 
            'stem changers: e→i': 'stem changers: e:i',
            'Ser vs Estar': 'to be or to be',
            'Saber vs Conocer': 'to know or to know',
            'Important verbs': 'important verbs',
            'Regular AR verbs': 'regular ar verbs',
            'Regular ER verbs': 'regular er verbs', 
            'Regular IR verbs': 'regular ir verbs',
            'Irregular yo': 'irregular yo'
        };
        
        // Apply mapping if it exists
        if (categoryMappings[selectedCategory]) {
            jsonCategory = categoryMappings[selectedCategory];
        }
        
        availableVerbs = verbsData.filter(verb => {
            const hasCategory = verb.categories && verb.categories.includes(jsonCategory);
            return hasCategory;
        });
        
    }
    
    if (availableVerbs.length === 0) {
        availableVerbs = verbsData; // Fallback to all verbs
    }
    
    // Select random verb and subject
    currentVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
    currentSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    // Create question text
    let questionText;
    const conjugation = currentVerb.conjugationsPresent[currentSubject.pronoun];
    
    if (currentSubject.needsSubject) {
        // Capitalize the subject pronoun
        const capitalizedSubject = currentSubject.pronoun.charAt(0).toUpperCase() + currentSubject.pronoun.slice(1);
        questionText = `¿${capitalizedSubject} ${conjugation}...?`;
    } else {
        // Capitalize the verb for tú, nosotros, nosotras forms
        const capitalizedVerb = conjugation.charAt(0).toUpperCase() + conjugation.slice(1);
        questionText = `¿${capitalizedVerb}...?`;
    }
    
    // Display question
    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML = `<p class="question-text">${questionText}</p>`;
    }
    
    // Reset answer section to placeholder
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Once you click the positive or negative response buttons, the answer will appear here.</p>';
    }
}

// Show answer function
function showAnswer(isPositive) {
    
    if (!currentVerb || !currentSubject) {
        return;
    }
    
    let responseSubject, responseConjugation;
    
    // Determine response based on question type
    if (currentSubject.pronoun === 'tú' || currentSubject.pronoun === 'usted') {
        responseSubject = 'yo';
        responseConjugation = currentVerb.conjugationsPresent.yo;
    } else if (currentSubject.pronoun === 'ustedes') {
        responseSubject = 'nosotros';
        responseConjugation = currentVerb.conjugationsPresent.nosotros;
    } else {
        // Third person or nosotros/nosotras - mirror the question
        responseSubject = currentSubject.pronoun;
        responseConjugation = currentVerb.conjugationsPresent[currentSubject.pronoun];
    }
    
    // Format answer
    let answerText;
    if (isPositive) {
        if (responseSubject === 'yo') {
            answerText = `Sí, ${responseConjugation}...`;
        } else {
            answerText = `Sí, ${responseSubject} ${responseConjugation}...`;
        }
    } else {
        if (responseSubject === 'yo') {
            answerText = `No, no ${responseConjugation}...`;
        } else {
            answerText = `No, ${responseSubject} no ${responseConjugation}...`;
        }
    }
    
    // Show answer in answer box
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = `
            <div class="answer-text-q-a">${answerText}</div>
            <div class="verb-info">
                <strong>Infinitivo:</strong> ${currentVerb.infinitive}<br>
                <strong>Significado:</strong> ${currentVerb.english}
            </div>
        `;
    }
}

// Next question function
function nextQuestion() {
    generateQuestion();
}

// Start loading data when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadVerbData();
});

// Test that functions are available globally
window.selectCategory = selectCategory;
window.showAnswer = showAnswer;
window.nextQuestion = nextQuestion;