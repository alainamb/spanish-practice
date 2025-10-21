// Spanish Verb Conjugation Practice - Present + Past Tense Drill

// Global variables
let currentVerb = null;
let currentSubject = null;
let selectedCategory = 'all';
let verbsData = [];
let categoriesData = [];

// Extended subjects list with contextual additions
const subjects = [
    { pronoun: "yo", display: "yo", grammaticalPronoun: "yo" },
    { pronoun: "tú", display: "tú", grammaticalPronoun: "tú" },
    { pronoun: "él", display: "él", grammaticalPronoun: "él" },
    { pronoun: "ella", display: "ella", grammaticalPronoun: "ella" },
    { pronoun: "elle", display: "elle", grammaticalPronoun: "elle" },
    { pronoun: "usted", display: "usted", grammaticalPronoun: "usted" },
    { pronoun: "nosotros", display: "nosotros", grammaticalPronoun: "nosotros" },
    { pronoun: "nosotras", display: "nosotras", grammaticalPronoun: "nosotras" },
    { pronoun: "vosotros", display: "vosotros", grammaticalPronoun: "vosotros" },
    { pronoun: "vosotras", display: "vosotras", grammaticalPronoun: "vosotras" },
    { pronoun: "ellos", display: "ellos", grammaticalPronoun: "ellos" },
    { pronoun: "ellas", display: "ellas", grammaticalPronoun: "ellas" },
    { pronoun: "elles", display: "elles", grammaticalPronoun: "elles" },
    { pronoun: "ustedes", display: "ustedes", grammaticalPronoun: "ustedes" },
    // Contextual subjects
    { pronoun: "ella", display: "Claudia Sheinbaum", grammaticalPronoun: "ella" },
    { pronoun: "ellos", display: "Martha Stewart and Snoop Dogg", grammaticalPronoun: "ellos" },
    { pronoun: "nosotros", display: "Mis amigos y yo", grammaticalPronoun: "nosotros" },
    { pronoun: "ella", display: "Mi familia", grammaticalPronoun: "ella" },
    { pronoun: "él", display: "El grupo de profesionales", grammaticalPronoun: "él" }
];

// Load verb data from JSON file
async function loadVerbData() {
    try {
        const response = await fetch('/data/ESP-verbs.json');
        const data = await response.json();
        
        verbsData = data.verbs;
        categoriesData = data.categories;
        
        initializeApp();
        
    } catch (error) {
        console.error('Error loading verb data:', error);
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
            "conjugationsPresent": {
                yo: "bailo",
                tú: "bailas",
                él: "baila",
                ella: "baila",
                elle: "baila",
                usted: "baila",
                nosotros: "bailamos",
                nosotras: "bailamos",
                vosotros: "bailáis",
                vosotras: "bailáis",
                ellos: "bailan",
                ellas: "bailan",
                elles: "bailan",
                ustedes: "bailan"
            },
            "conjugationsPreterite": {
                yo: "bailé",
                tú: "bailaste",
                él: "bailó",
                ella: "bailó",
                elle: "bailó",
                usted: "bailó",
                nosotros: "bailamos",
                nosotras: "bailamos",
                vosotros: "bailasteis",
                vosotras: "bailasteis",
                ellos: "bailaron",
                ellas: "bailaron",
                elles: "bailaron",
                ustedes: "bailaron"
            }
        }
    ];
}

// Ensure bailar exists as fallback
function ensureBailarExists() {
    const bailarExists = verbsData.some(verb => verb.infinitive === "bailar");
    
    if (!bailarExists) {
        verbsData.unshift({
            infinitive: "bailar",
            english: "to dance",
            categories: ["regular ar verbs"],
            "conjugationsPresent": {
                yo: "bailo",
                tú: "bailas",
                él: "baila",
                ella: "baila",
                elle: "baila",
                usted: "baila",
                nosotros: "bailamos",
                nosotras: "bailamos",
                vosotros: "bailáis",
                vosotras: "bailáis",
                ellos: "bailan",
                ellas: "bailan",
                elles: "bailan",
                ustedes: "bailan"
            },
            "conjugationsPreterite": {
                yo: "bailé",
                tú: "bailaste",
                él: "bailó",
                ella: "bailó",
                elle: "bailó",
                usted: "bailó",
                nosotros: "bailamos",
                nosotras: "bailamos",
                vosotros: "bailasteis",
                vosotras: "bailasteis",
                ellos: "bailaron",
                ellas: "bailaron",
                elles: "bailaron",
                ustedes: "bailaron"
            }
        });
    }
}

// Initialize the app
function initializeApp() {
    ensureBailarExists();
    
    // Set "All verbs" as selected by default
    const allVerbsButton = document.querySelector('button[onclick="selectCategory(\'all\')"]');
    if (allVerbsButton) {
        allVerbsButton.classList.add('selected');
    }
    
    // Set up the default question
    setupDefaultQuestion();
}

// Set up the default question
function setupDefaultQuestion() {
    currentVerb = verbsData.find(verb => verb.infinitive === "bailar");
    currentSubject = subjects.find(subject => subject.display === "yo");
    
    if (!currentVerb || !currentSubject) {
        return;
    }
    
    displayQuestion();
    showAnswer('present');
}

// Display the current question
function displayQuestion() {
    if (!currentVerb || !currentSubject) {
        return;
    }
    
    const questionText = `${currentSubject.display} + ${currentVerb.infinitive}`;
    
    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML = `<p class="question-text">${questionText}</p>`;
    }
}

// Select category function
function selectCategory(category) {
    selectedCategory = category;
    
    // Update button styles
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const clickedButton = Array.from(document.querySelectorAll('.category-btn')).find(btn => 
        btn.getAttribute('onclick').includes(`'${category}'`)
    );
    if (clickedButton) {
        clickedButton.classList.add('selected');
    }
    
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
        
        let jsonCategory = categoryMappings[selectedCategory] || selectedCategory;
        
        availableVerbs = verbsData.filter(verb => {
            return verb.categories && verb.categories.includes(jsonCategory);
        });
    }
    
    if (availableVerbs.length === 0) {
        availableVerbs = verbsData;
    }
    
    // Select random verb and subject
    currentVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
    currentSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    displayQuestion();
    
    // Reset answer section
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Once you click the present or past tense buttons, the correct conjugation will appear here.</p>';
    }
}

function showAnswer(tense) {
    if (!currentVerb || !currentSubject) {
        return;
    }
    
    const grammaticalPronoun = currentSubject.grammaticalPronoun;
    const displaySubject = currentSubject.display;
    
    // Get conjugations
    const presentConj = currentVerb.conjugationsPresent[grammaticalPronoun];
    const pastConj = currentVerb.conjugationsPreterite[grammaticalPronoun];
    
    let answer;
    let tenseLabel;
    
    if (tense === true || tense === 'present') {  // Changed this line
        tenseLabel = 'Present Tense';
        if (displaySubject === grammaticalPronoun) {
            if (grammaticalPronoun === "yo") {
                answer = `${presentConj.charAt(0).toUpperCase() + presentConj.slice(1)}...`;
            } else {
                answer = `${displaySubject.charAt(0).toUpperCase() + displaySubject.slice(1)} ${presentConj}...`;
            }
        } else {
            answer = `${displaySubject} ${presentConj}...`;
        }
    } else { // past
        tenseLabel = 'Past Tense';
        if (displaySubject === grammaticalPronoun) {
            if (grammaticalPronoun === "yo") {
                answer = `${pastConj.charAt(0).toUpperCase() + pastConj.slice(1)}...`;
            } else {
                answer = `${displaySubject.charAt(0).toUpperCase() + displaySubject.slice(1)} ${pastConj}...`;
            }
        } else {
            answer = `${displaySubject} ${pastConj}...`;
        }
    }
    
    // Display answer
    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = `
            <div class="answer-text">
                <p>${answer}</p>
            </div>
            <div class="verb-info">
                <strong>Significado:</strong> ${currentVerb.english}
            </div>
        `;
    }
}

// Next question function
function nextQuestion() {
    generateQuestion();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadVerbData();
});

// Make functions globally available
window.selectCategory = selectCategory;
window.showAnswer = showAnswer;
window.nextQuestion = nextQuestion;