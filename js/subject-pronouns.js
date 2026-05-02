// pronombres.js — Subject Pronouns & Ser activity

// ── State ──────────────────────────────────────────────────────────────────

let pronounsData = [];
let situationsData = [];
let currentSituationIndex = 0;

const filters = {
    dir: 'all',
    reg: 'all',
    rgn: 'all',
    gen: 'all'
};

// ── Data loading ───────────────────────────────────────────────────────────

async function loadData() {
    try {
        const response = await fetch('../data/subject-pronouns.json');
        const data = await response.json();
        pronounsData = data.pronouns;
        situationsData = data.situations;
    } catch (error) {
        console.error('Error loading subject-pronouns.json, using fallback data:', error);
        useFallbackData();
    }
    renderChart();
    loadSituation();
}

function useFallbackData() {
    pronounsData = [
        { cell: '1sg', pron: 'yo',             verb: 'soy',   dir: ['about'], reg: 'both',     rgn: ['all','latam','vos','tu','spain'], gen: ['m','f','nb'] },
        { cell: '2sg', pron: 'tú',             verb: 'eres',  dir: ['to'],    reg: 'informal', rgn: ['all','latam','tu','spain'],       gen: ['m','f','nb'] },
        { cell: '2sg', pron: 'vos',            verb: 'sos',   dir: ['to'],    reg: 'informal', rgn: ['all','latam','vos'],              gen: ['m','f','nb'] },
        { cell: '2sg', pron: 'usted',          verb: 'es',    dir: ['to'],    reg: 'formal',   rgn: ['all','latam','vos','tu','spain'], gen: ['m','f','nb'] },
        { cell: '3sg', pron: 'él',             verb: 'es',    dir: ['about'], reg: 'informal', rgn: ['all','latam','vos','tu','spain'], gen: ['m'] },
        { cell: '3sg', pron: 'ella',           verb: 'es',    dir: ['about'], reg: 'informal', rgn: ['all','latam','vos','tu','spain'], gen: ['f'] },
        { cell: '3sg', pron: 'elle',           verb: 'es',    dir: ['about'], reg: 'informal', rgn: ['all','latam','vos','tu','spain'], gen: ['nb'] },
        { cell: '3sg', pron: '(it - implied)', verb: 'es',    dir: ['about'], reg: 'both',     rgn: ['all','latam','vos','tu','spain'], gen: ['all'], note: "no pronoun for 'it'" },
        { cell: '1pl', pron: 'nosotros',       verb: 'somos', dir: ['about'], reg: 'informal', rgn: ['all','latam','vos','tu','spain'], gen: ['m'], note: 'also traditionally used for mixed-gender groups' },
        { cell: '1pl', pron: 'nosotras',       verb: 'somos', dir: ['about'], reg: 'informal', rgn: ['all','latam','vos','tu','spain'], gen: ['f'] },
        { cell: '1pl', pron: 'nosotres',       verb: 'somos', dir: ['about'], reg: 'informal', rgn: ['all','latam','vos','tu','spain'], gen: ['nb'] },
        { cell: '2pl', pron: 'vosotros',       verb: 'sois',  dir: ['to'],    reg: 'informal', rgn: ['all','spain'],                   gen: ['m'], note: 'also traditionally used for mixed-gender groups' },
        { cell: '2pl', pron: 'vosotras',       verb: 'sois',  dir: ['to'],    reg: 'informal', rgn: ['all','spain'],                   gen: ['f'] },
        { cell: '2pl', pron: 'vosotres',       verb: 'sois',  dir: ['to'],    reg: 'informal', rgn: ['all','spain'],                   gen: ['nb'] },
        { cell: '2pl', pron: 'ustedes',        verb: 'son',   dir: ['to'],    reg: 'both',     rgn: ['all','latam','vos','tu','spain'], gen: ['m','f','nb'] },
        { cell: '3pl', pron: 'ellos',          verb: 'son',   dir: ['about'], reg: 'informal', rgn: ['all','latam','vos','tu','spain'], gen: ['m'], note: 'also traditionally used for mixed-gender groups' },
        { cell: '3pl', pron: 'ellas',          verb: 'son',   dir: ['about'], reg: 'informal', rgn: ['all','latam','vos','tu','spain'], gen: ['f'] },
        { cell: '3pl', pron: 'elles',          verb: 'son',   dir: ['about'], reg: 'informal', rgn: ['all','latam','vos','tu','spain'], gen: ['nb'] }
    ];

    situationsData = [
        { context: 'First person', situation: 'You want to introduce yourself.', answer: 'yo soy', explanation: '<em>Yo</em> is the first-person singular pronoun. <br>Because Spanish verb endings already encode the subject, <em>yo</em> is often omitted in natural speech. Using <em>soy</em> alone is perfectly clear. <br>It is usually stated for emphasis or contrast: <em>Yo soy profesora, no ella.</em>' },
        { context: 'Mexico | informal conversation', situation: "You're in Mexico City talking casually to a friend.", answer: 'tú eres', explanation: 'In Mexico and much of Latin America, <em>tú</em> (<em>tuteo</em>) is used for the informal singular \'you.\' The verb form is <em>eres</em>. <br>The pronoun can be dropped: <em>Eres muy simpático</em> is just as natural as <em>Tú eres muy simpático</em>.' },
        { context: 'Argentina | informal conversation', situation: "You're in Buenos Aires talking casually to someone.", answer: 'vos sos', explanation: '<em>Vos</em> is used as the informal \'you\' in Argentina, Uruguay, Paraguay, and throughout Central America. <br>It takes its own conjugation: <em>sos</em> rather than <em>eres</em>. This form (<em>voseo</em>) is a fully standard feature of those dialects, not slang.' },
        { context: 'Formal | any region', situation: "You're formally addressing a client, a professor, or someone you've just met.", answer: 'usted es', explanation: '<em>Usted</em> is the formal singular \'you\' used throughout the Spanish-speaking world. <br>It is conjugated in the same way as <em>él/ella/elle</em> with the third-person singular form. <br>In Costa Rica, <em>usted</em> can also be used as a casual form of address.' },
        { context: 'Talking about a man', situation: "You want to describe a man who isn't in the room.", answer: 'él es', explanation: '<em>Él</em> (note the accent mark, which distinguishes it from <em>el</em> \'the\') is the masculine third-person singular pronoun. <br>Like all subject pronouns in Spanish, it is frequently omitted when the context is clear.' },
        { context: 'Talking about a woman', situation: "You want to describe a woman who isn't present.", answer: 'ella es', explanation: '<em>Ella</em> is the feminine third-person singular pronoun. The verb form is <em>es</em>, shared with <em>él</em>, <em>elle</em>, and <em>usted</em>.' },
        { context: 'Talking about a non-binary person', situation: 'You want to talk about a non-binary person using gender-neutral language.', answer: 'elle es', explanation: '<em>Elle</em> is an emerging gender-neutral third-person singular pronoun used by many Spanish speakers. <br>While it is not yet considered to be a standard form, it is widely used in gender-inclusive contexts in Latin America and Spain. <br>When in doubt, ask the person which pronouns they use.' },
        { context: 'First person plural | mixed gender or masculine', situation: 'You want to describe a group that includes yourself and your guy friends or mixed-gender group of friends.', answer: 'nosotros somos', explanation: '<em>Nosotros</em> is the first-person plural pronoun for all-male or mixed-gender groups. <br><em>Nosotras</em> is used for all-female groups; <em>nosotres</em> is the gender-neutral alternative used in inclusive language contexts.' },
        { context: 'First person plural | all female', situation: 'You identify as a woman, and you and your female classmates want to introduce yourselves as a group.', answer: 'nosotras somos', explanation: '<em>Nosotras</em> specifies an all-female group. Spanish makes this distinction grammatically explicit, unlike English \'we.\' <br>If the group is mixed or gender-unspecified, <em>nosotros</em> is traditionally used.' },
        { context: 'First person plural | all non-binary', situation: 'You identify as non-binary, and you and your non-binary friends want to introduce yourselves as a group.', answer: 'nosotres somos', explanation: '<em>Nosotres</em> is the gender-neutral first-person plural pronoun used in inclusive language contexts. <br>Spanish makes this distinction grammatically explicit, unlike English \'we.\'' },
        { context: 'Spain | informal plural', situation: "You're in Madrid and talking informally to a group of friends.", answer: 'vosotros/vosotras/vosotres sois', explanation: '<em>Vosotros/vosotras/vosotres</em> is the informal second-person plural pronoun used in Spain. <br>As with the plural first person and all third person forms, you\'ll select the appropriate form based on the gender of the group. <br><em>Vosotros</em> does not exist in Latin American Spanish, where <em>ustedes son</em> serves all plural \'you\' situations regardless of formality. <br>In Spain, <em>ustedes</em> is used in formal situations.' },
        { context: 'Latin America | any register', situation: "You're in Colombia addressing a group either casually or formally.", answer: 'ustedes son', explanation: 'Throughout Latin America, <em>ustedes</em> is the only second-person plural form. <br>It is used for informal and formal situations alike, unlike in Spain, where <em>vosotros</em> is the informal second-person plural form.' },
        { context: 'Talking about a group of men or a mixed-gender group', situation: "You're describing a group that includes all men or people of different genders.", answer: 'ellos son (traditional)', explanation: 'Traditional Spanish grammar uses <em>ellos</em> as the default masculine plural for mixed-gender groups. <br>Many speakers today are shifting toward more gender-neutral alternatives.' },
        { context: 'Talking about a group of women', situation: "You're talking about a group of women.", answer: 'ellas son', explanation: '<em>Ellas</em> is the feminine third-person plural pronoun, used for an all-female group. <br>For mixed groups, traditional grammar uses <em>ellos</em>.' },
        { context: 'Talking about a group of non-binary people', situation: "You're talking about a group of non-binary people.", answer: 'elles son', explanation: '<em>Elles</em> is the non-binary third-person plural pronoun, used for an all-non-binary group.' },
        { context: 'Implicit subject | no pronoun', situation: "You want to say 'it\\'s interesting' without naming a subject.", answer: '(it - implied) es', explanation: 'Spanish has no pronoun for the English \'it\' as an inanimate subject. <br>The verb here stands alone: <em>Es interesante.</em> The subject is entirely implied. <br>This is one of the clearest structural differences between English and Spanish.' }
    ];
}

// ── Chart rendering ────────────────────────────────────────────────────────

const CELL_IDS = {
    '1sg': 'cell-1sg',
    '2sg': 'cell-2sg',
    '3sg': 'cell-3sg',
    '1pl': 'cell-1pl',
    '2pl': 'cell-2pl',
    '3pl': 'cell-3pl'
};

function matchesFilters(form) {
    const dirOk = filters.dir === 'all' || form.dir.includes(filters.dir);
    const regOk = filters.reg === 'all' || form.reg === filters.reg ||
                  (form.reg === 'both' && !(filters.rgn === 'spain' && filters.reg === 'informal'));
    const rgnOk = form.rgn.includes(filters.rgn);
    const genOk = filters.gen === 'all' || form.gen.includes(filters.gen);
    return dirOk && regOk && rgnOk && genOk;
}

function renderChart() {
    // Group forms by cell key
    const byCellId = {};
    Object.keys(CELL_IDS).forEach(function(key) { byCellId[key] = []; });
    pronounsData.forEach(function(form) {
        if (byCellId[form.cell] !== undefined) {
            byCellId[form.cell].push(form);
        }
    });

    // Render each cell
    Object.entries(CELL_IDS).forEach(function(entry) {
        const cellKey = entry[0];
        const domId   = entry[1];
        const el = document.getElementById(domId);
        if (!el) return;
        el.innerHTML = '';

        const forms = byCellId[cellKey];
        forms.forEach(function(form, i) {
            const highlighted = matchesFilters(form);

            const row = document.createElement('div');
            row.className = 'form-row' + (highlighted ? ' highlighted' : ' dimmed');

            const pronSpan = document.createElement('span');
            pronSpan.className = 'form-pron';
            pronSpan.textContent = form.pron;

            const verbSpan = document.createElement('span');
            verbSpan.className = 'form-verb';
            verbSpan.textContent = form.verb;

            row.appendChild(pronSpan);
            row.appendChild(verbSpan);

            if (form.note) {
                const noteSpan = document.createElement('span');
                noteSpan.className = 'form-note';
                noteSpan.textContent = '(' + form.note + ')';
                row.appendChild(noteSpan);
            }

            el.appendChild(row);

            if (i < forms.length - 1) {
                const hr = document.createElement('hr');
                hr.className = 'form-divider';
                el.appendChild(hr);
            }
        });
    });

    // 1st person row is always visible; filter dimming handles it naturally
}

// ── Filter controls ────────────────────────────────────────────────────────

function setFilter(btn) {
    const filterKey = btn.dataset.filter;
    const value     = btn.dataset.value;

    // Update active button within this group
    const group = btn.closest('.filter-group');
    group.querySelectorAll('.filter-btn').forEach(function(b) {
        b.classList.remove('active');
    });
    btn.classList.add('active');

    filters[filterKey] = value;

    // Progressive reveal: perspective controls which secondary filters appear
    if (filterKey === 'dir') {
        const rowRegister = document.getElementById('filter-row-register');
        const rowRegion   = document.getElementById('filter-row-region');
        const rowGender   = document.getElementById('filter-row-gender');

        // Hide and reset all secondary filters first
        [rowRegister, rowRegion, rowGender].forEach(function(row) {
            row.style.display = 'none';
        });
        resetFilterRow('reg');
        resetFilterRow('rgn');
        resetFilterRow('gen');

        if (value === 'to') {
            rowRegister.style.display = '';
            rowRegion.style.display   = '';
            // Gender shown only when Spain is subsequently selected
        } else if (value === 'about') {
            rowGender.style.display = '';
        }
        // 'all' — secondary filters stay hidden
    }

    // When region changes under "Talking to someone", show gender only for Spain
    if (filterKey === 'rgn' && filters.dir === 'to') {
        const rowGender = document.getElementById('filter-row-gender');
        if (value === 'spain') {
            rowGender.style.display = '';
        } else {
            rowGender.style.display = 'none';
            resetFilterRow('gen');
        }
    }

    renderChart();
}

function resetFilterRow(filterKey) {
    filters[filterKey] = 'all';
    const labelMap = { reg: 'register', rgn: 'region', gen: 'gender' };
    const row = document.getElementById('filter-row-' + labelMap[filterKey]);
    if (!row) return;
    row.querySelectorAll('.filter-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.value === 'all');
    });
}

// ── Practice situations ────────────────────────────────────────────────────

function loadSituation() {
    if (!situationsData || situationsData.length === 0) return;

    const situation = situationsData[currentSituationIndex];

    const questionBox = document.getElementById('questionBox');
    if (questionBox) {
        questionBox.innerHTML =
            '<p class="situation-context">' + situation.context + '</p>' +
            '<p class="situation-text">' + situation.situation + '</p>';
    }

    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML = '<p class="placeholder-text">Click Reveal to see the pronoun + ser form for this situation.</p>';
    }
}

function revealAnswer() {
    if (!situationsData || situationsData.length === 0) return;

    const situation = situationsData[currentSituationIndex];

    const answerBox = document.getElementById('answerBox');
    if (answerBox) {
        answerBox.innerHTML =
            '<p class="answer-pronoun">' + situation.answer + '</p>' +
            '<p class="answer-explanation">' + situation.explanation + '</p>';
    }
}

function nextQuestion() {
    currentSituationIndex = (currentSituationIndex + 1) % situationsData.length;
    loadSituation();
}

// ── Init ───────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

window.setFilter    = setFilter;
window.revealAnswer = revealAnswer;
window.nextQuestion = nextQuestion;