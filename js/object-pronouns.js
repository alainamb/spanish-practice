// Spanish Object Pronouns Practice

// Global variables
let currentItem = null;
let selectedMode = null; // 'direct', 'indirect', or 'combined'
let pronounsData = { direct: [], indirect: [], combined: [] };

// Load pronouns data from JSON file
async function loadPronounsData() {
    try {
        const response = await fetch('../data/object-pronouns.json');
        const data = await response.json();

        pronounsData.direct = data.direct;
        pronounsData.indirect = data.indirect;
        pronounsData.combined = data.combined;

        // Ensure first leismo example appears first
        const firstLeismo = pronounsData.indirect.findIndex(s => s.leismo);
        if (firstLeismo > 0) {
            const [item] = pronounsData.indirect.splice(firstLeismo, 1);
            pronounsData.indirect.unshift(item);
        }

        // Ensure first pronoun_only example appears second
        const firstPronounOnly = pronounsData.indirect.findIndex(s => s.pronoun_only);
        if (firstPronounOnly > 1) {
            const [item] = pronounsData.indirect.splice(firstPronounOnly, 1);
            pronounsData.indirect.splice(1, 0, item);
        }

        initializeApp();

    } catch (error) {
        console.error('Error loading pronouns data:', error);
        useFallbackData();
        initializeApp();
    }
}

// Minimal fallback data
function useFallbackData() {
    pronounsData = {
        direct: [
            {
                sentence: "Ella compra el libro.",
                english: "She buys the book.",
                direct_object: "el libro",
                indirect_object: null,
                pronoun_used: "lo",
                rewritten: "Ella lo compra.",
                explanation: "'El libro' is the direct object (what is being bought). Because 'libro' is masculine and singular, it is replaced with 'lo', which goes before the conjugated verb."
            }
        ],
        indirect: [
            {
                sentence: "Ella le da un regalo a su mamá.",
                english: "She gives a gift to her mom.",
                direct_object: "un regalo",
                indirect_object: "a su mamá",
                pronoun_used: "le",
                rewritten: "Ella le da un regalo.",
                explanation: "'A su mamá' is the indirect object (who is receiving the gift). The pronoun 'le' is used for a single person and placed before the conjugated verb."
            }
        ],
        combined: [
            {
                sentence: "Ella le da el libro a su amigo.",
                english: "She gives the book to her friend.",
                direct_object: "el libro",
                indirect_object: "a su amigo",
                do_pronoun: "lo",
                io_pronoun: "le → se",
                rewritten: "Ella se lo da.",
                explanation: "'El libro' → 'lo'. 'A su amigo' → 'le'. When 'le' comes before 'lo', it changes to 'se'. Order: indirect before direct (se + lo)."
            }
        ]
    };
}

// Initialize the app
function initializeApp() {
    console.log('Pronouns practice app initialized.');
    const scenarioBox = document.getElementById('scenarioBox');
    if (scenarioBox) {
        scenarioBox.innerHTML = '<p class="placeholder-text">Once you select a practice mode, a sentence will appear here for you to practice.</p>';
    }
}

// Select practice mode
function selectMode(mode) {
    selectedMode = mode;

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    const clickedButton = Array.from(document.querySelectorAll('.category-btn')).find(btn =>
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${mode}'`)
    );
    if (clickedButton) {
        clickedButton.classList.add('selected');
    }

    generateItem();
}

let firstIndirectShown = false;
let firstPronounOnlyShown = false;

function selectMode(mode) {
    selectedMode = mode;

    // Reset leismo / first pronoun_only flag when switching to indirect
    if (mode === 'indirect') firstIndirectShown = false;
    if (mode === 'indirect') firstPronounOnlyShown = false;

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    const clickedButton = Array.from(document.querySelectorAll('.category-btn')).find(btn =>
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(`'${mode}'`)
    );
    if (clickedButton) {
        clickedButton.classList.add('selected');
    }

    generateItem();
}

// Generate a new item based on the selected mode

function generateItem() {
    if (!selectedMode) return;

    const pool = pronounsData[selectedMode];
    if (!pool || pool.length === 0) {
        console.error('No data for mode:', selectedMode);
        return;
    }

    if (selectedMode === 'indirect' && !firstIndirectShown) {
        currentItem = pool[0]; // leísmo item guaranteed at index 0
        firstIndirectShown = true;
    } else if (selectedMode === 'indirect' && !firstPronounOnlyShown) {
        currentItem = pool[1]; // pronoun_only item guaranteed at index 1
        firstPronounOnlyShown = true;
    } else {
        currentItem = pool[Math.floor(Math.random() * pool.length)];
    }

    const scenarioBox = document.getElementById('scenarioBox');
    if (scenarioBox) {
        let html = `
            <p style="font-size: 1.2rem; line-height: 1.6; margin: 0 0 0.4rem 0;">
                <strong>${currentItem.sentence}</strong>
            </p>
            <p style="margin: 0 0 0.6rem 0; font-style: italic; color: #666; font-size: 1rem;">
                ${currentItem.english}
            </p>
        `;

        if (selectedMode === 'direct') {
            html
        } else if (selectedMode === 'indirect') {
            html
        } else {
            html
        }

        scenarioBox.innerHTML = html;
    }

    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Once you click Show Answer, the rewritten sentence and explanation will appear here.</p>';
    }
}

// Show the answer
function showAnswer() {
    if (!currentItem || !selectedMode) return;

    const answerBox = document.getElementById('answerBox');
    if (!answerBox) return;

    let objectsHTML = '';

    if (selectedMode === 'direct') {
        objectsHTML = `
            <p style="margin: 0 0 0.3rem 0; font-size: 1rem;">
                <strong>Direct object:</strong> ${currentItem.direct_object}
                &nbsp;→&nbsp;
                <strong>Pronoun:</strong> <span style="color: var(--color-primary, #2563eb);">${currentItem.pronoun_used}</span>
            </p>
        `;
    } else if (selectedMode === 'indirect') {
        objectsHTML = `
            <p style="margin: 0 0 0.3rem 0; font-size: 1rem;">
                <strong>Indirect object:</strong> ${currentItem.indirect_object || '(already a pronoun in the sentence)'}
                &nbsp;→&nbsp;
                <strong>Pronoun:</strong> <span style="color: var(--color-primary, #2563eb);">${currentItem.pronoun_used}</span>
            </p>
        `;
    } else {
        // combined
        objectsHTML = `
            <p style="margin: 0 0 0.2rem 0; font-size: 1rem;">
                <strong>Direct object:</strong> ${currentItem.direct_object}
                &nbsp;→&nbsp;
                <strong>D.O. pronoun:</strong> <span style="color: var(--color-primary, #2563eb);">${currentItem.do_pronoun}</span>
            </p>
            <p style="margin: 0 0 0.3rem 0; font-size: 1rem;">
                <strong>Indirect object:</strong> ${currentItem.indirect_object || '(already a pronoun in the sentence)'}
                &nbsp;→&nbsp;
                <strong>I.O. pronoun:</strong> <span style="color: var(--color-primary, #2563eb);">${currentItem.io_pronoun}</span>
            </p>
        `;
    }

    answerBox.innerHTML = `
        ${objectsHTML}
        <p style="font-size: 1.2rem; line-height: 1.6; margin: 0.5rem 0 0.3rem 0;">
            <strong>Rewritten:</strong> ${currentItem.rewritten}
        </p>
        <p style="margin: 0.5rem 10rem 0; font-size: 1rem; color: #555; line-height: 1.5;">
            <strong>Explanation:</strong> ${currentItem.explanation}
        </p>
    `;
}

// Next item
function nextItem() {
    generateItem();
}

// Start on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    loadPronounsData();
});

// Expose functions globally
window.selectMode = selectMode;
window.showAnswer = showAnswer;
window.nextItem = nextItem;
