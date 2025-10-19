// Spanish Verb Conjugation Practice App
console.log('=== VERBS.JS LOADING ===');

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
        
        console.log('Loaded verbs:', verbsData.length);
        console.log('Loaded categories:', categoriesData);
        
        // Initialize the app after data is loaded
        initializeApp();
        
    } catch (error) {
        console.error('Error loading verb data:', error);
        console.log('JSON file not found or invalid, using fallback data');
        // Fallback to sample data if JSON fails to load
        useFallbackData();
        initializeApp();
    }
}

// Fallback data in case JSON doesn't load
function useFallbackData() {
    console.log('Using fallback verb data');
    
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
            conjugations: {
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
            conjugations: {
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
        console.log('Adding bailar as fallback verb');
        verbsData.unshift({
            infinitive: "bailar",
            english: "to dance",
            categories: ["regular ar verbs"],
            conjugations: {
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
    console.log('=== INITIALIZING APP ===');
    
    // Ensure bailar exists in the verb data
    ensureBailarExists();
    
    // Set "All verbs" as selected by default
    const allVerbsButton = document.querySelector('button[onclick="selectCategory(\'all\')"]');
    if (allVerbsButton) {
        allVerbsButton.classList.add('selected');
        console.log('All verbs button marked as selected');
    }
    
    // Set up the default question: "¿Bailas?"
    setupDefaultQuestion();
    
    console.log('=== APP INITIALIZED ===');
}

// Set up the default question and answer
function setupDefaultQuestion() {
    console.log('=== SETTING UP DEFAULT QUESTION ===');
    
    // Ensure we find "bailar" verb - it should definitely exist now
    currentVerb = verbsData.find(verb => verb.infinitive === "bailar");
    
    // Set subject to "tú" for "¿Bailas?"
    currentSubject = subjects.find(subject => subject.pronoun === "tú");
    
    console.log('Default verb:', currentVerb);
    console.log('Default subject:', currentSubject);
    
    if (!currentVerb) {
        console.error('Bailar verb not found! Available verbs:', verbsData.map(v => v.infinitive));
        return;
    }
    
    if (!currentSubject) {
        console.error('Tú subject not found!');
        return;
    }
    
    // Display the question "¿Bailas?"
    const questionText = "¿Bailas...?";
    
    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML = `<p class="question-text">${questionText}</p>`;
        console.log('Default question displayed:', questionText);
    }
    
    // Show the default positive answer
    showAnswer(true);
}

// Select category function
function selectCategory(category) {
    console.log('=== SELECT CATEGORY CALLED ===');
    console.log('Category selected:', category);
    
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
    console.log('=== GENERATE QUESTION CALLED ===');
    console.log('Selected category:', selectedCategory);
    
    if (!selectedCategory) {
        console.log('No category selected, returning');
        return;
    }
    
    // Filter verbs by category
    let availableVerbs;
    if (selectedCategory === 'all') {
        availableVerbs = verbsData;
        console.log('Using all verbs:', availableVerbs.length);
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
        
        console.log('HTML category:', selectedCategory);
        console.log('JSON category to search for:', jsonCategory);
        console.log('Available categories in data:', [...new Set(verbsData.map(verb => verb.categories).flat())]);
        
        availableVerbs = verbsData.filter(verb => {
            const hasCategory = verb.categories && verb.categories.includes(jsonCategory);
            console.log(`Verb ${verb.infinitive} categories:`, verb.categories, 'matches:', hasCategory);
            return hasCategory;
        });
        
        console.log('Filtered verbs for category:', jsonCategory, 'Found:', availableVerbs.length);
        console.log('Available verbs:', availableVerbs.map(v => v.infinitive));
    }
    
    if (availableVerbs.length === 0) {
        console.log('No verbs found for category:', selectedCategory);
        console.log('All available verbs:', verbsData.map(v => `${v.infinitive} (${v.categories?.join(', ') || 'no categories'})`));
        availableVerbs = verbsData; // Fallback to all verbs
    }
    
    // Select random verb and subject
    currentVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
    currentSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    console.log('Current verb set to:', currentVerb);
    console.log('Current subject set to:', currentSubject);
    
    // Create question text
    let questionText;
    const conjugation = currentVerb.conjugations[currentSubject.pronoun];
    
    if (currentSubject.needsSubject) {
        // Capitalize the subject pronoun
        const capitalizedSubject = currentSubject.pronoun.charAt(0).toUpperCase() + currentSubject.pronoun.slice(1);
        questionText = `¿${capitalizedSubject} ${conjugation}...?`;
    } else {
        // Capitalize the verb for tú, nosotros, nosotras forms
        const capitalizedVerb = conjugation.charAt(0).toUpperCase() + conjugation.slice(1);
        questionText = `¿${capitalizedVerb}...?`;
    }
    
    console.log('Question text:', questionText);
    
    // Display question
    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML = `<p class="question-text">${questionText}</p>`;
        console.log('Question displayed successfully');
    }
    
    // Reset answer section to placeholder
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Once you click the positive or negative response buttons, the answer will appear here.</p>';
    }
}

// Show answer function
function showAnswer(isPositive) {
    console.log('=== SHOW ANSWER CALLED ===');
    console.log('Is positive:', isPositive);
    console.log('Current verb:', currentVerb);
    console.log('Current subject:', currentSubject);
    
    if (!currentVerb || !currentSubject) {
        console.log('Missing verb or subject, cannot show answer');
        return;
    }
    
    let responseSubject, responseConjugation;
    
    // Determine response based on question type
    if (currentSubject.pronoun === 'tú' || currentSubject.pronoun === 'usted') {
        responseSubject = 'yo';
        responseConjugation = currentVerb.conjugations.yo;
    } else if (currentSubject.pronoun === 'ustedes') {
        responseSubject = 'nosotros';
        responseConjugation = currentVerb.conjugations.nosotros;
    } else {
        // Third person or nosotros/nosotras - mirror the question
        responseSubject = currentSubject.pronoun;
        responseConjugation = currentVerb.conjugations[currentSubject.pronoun];
    }
    
    console.log('Response will be:', responseSubject, responseConjugation);
    
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
    
    console.log('Answer text:', answerText);
    
    // Show answer in answer box
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = `
            <div class="answer-text">${answerText}</div>
            <div class="verb-info">
                <strong>Infinitivo:</strong> ${currentVerb.infinitive}<br>
                <strong>Significado:</strong> ${currentVerb.english}
            </div>
        `;
        console.log('Answer box updated successfully');
    }
}

// Next question function
function nextQuestion() {
    console.log('=== NEXT QUESTION CALLED ===');
    generateQuestion();
}

// Start loading data when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM LOADED - STARTING APP ===');
    loadVerbData();
});

// Test that functions are available globally
window.selectCategory = selectCategory;
window.showAnswer = showAnswer;
window.nextQuestion = nextQuestion;

console.log('=== VERBS.JS LOADED SUCCESSFULLY ===');