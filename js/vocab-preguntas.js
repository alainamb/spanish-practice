// vocab-preguntas.js
// Reusable script for vocabulary question activities.
// Reads the target JSON file from the data-file attribute on the script tag.
// Usage: <script src="../js/vocab-preguntas.js" data-file="vacaciones.json"></script>
// The JSON file should live in ../data/ relative to the page.

(function () {

    // --- State ---
    let questions = [];
    let answers = [];
    let checked = [];
    let current = 0;

    // --- Bootstrap ---
    document.addEventListener('DOMContentLoaded', function () {
        const scriptTag = document.querySelector('script[src*="vocab-preguntas.js"]');
        const dataFile = scriptTag ? scriptTag.getAttribute('data-file') : null;

        if (!dataFile) {
            console.error('vocab-preguntas.js: no data-file attribute found on script tag.');
            return;
        }

        const jsonPath = '../data/' + dataFile;

        fetch(jsonPath)
            .then(function (res) {
                if (!res.ok) throw new Error('Could not load ' + jsonPath);
                return res.json();
            })
            .then(function (data) {
                questions = data.preguntas || [];
                answers = Array(questions.length).fill('');
                checked = Array(questions.length).fill(false);
                render();
            })
            .catch(function (err) {
                console.error('vocab-preguntas.js:', err);
                const qBox = document.getElementById('vp-question-box');
                if (qBox) qBox.innerHTML = '<p class="placeholder-text">Error loading questions. Check the data file path.</p>';
            });
    });

    // --- Helpers ---
    function hasSomeMatch(idx) {
        const ans = answers[idx].toLowerCase();
        return questions[idx]['palabras-clave'].some(function (k) {
            return ans.includes(k.toLowerCase());
        });
    }

    function getFeedbackHTML(idx) {
        const good = hasSomeMatch(idx);
        const header = good ? '¡Bien!' : 'Respuesta de ejemplo:';
        return '<p class="answer-text-q-a">' + header + '</p>'
             + '<p class="verb-info">' + questions[idx]['respuesta-modelo'] + '</p>';
    }

    // --- Render ---
    function render() {
        if (questions.length === 0) return;

        const q = questions[current];
        const alreadyChecked = checked[current];

        // Progress
        const pct = ((current + 1) / questions.length * 100).toFixed(0);
        const progEl = document.getElementById('vp-progress');
        if (progEl) progEl.style.width = pct + '%';

        const counterEl = document.getElementById('vp-counter');
        if (counterEl) counterEl.textContent = (current + 1) + ' / ' + questions.length;

        // Question
        const qBox = document.getElementById('vp-question-box');
        if (qBox) {
            qBox.innerHTML = '<p class="question-text">' + q['pregunta'] + '</p>';
        }

        // Hint
        const hintEl = document.getElementById('vp-hint');
        if (hintEl) {
            hintEl.textContent = q['pista'] || '';
        }

        // Answer input
        const input = document.getElementById('vp-answer-input');
        if (input) {
            input.value = answers[current];
            input.oninput = function () { answers[current] = input.value; };
        }

        // Feedback
        const fbBox = document.getElementById('vp-feedback-box');
        if (fbBox) {
            if (alreadyChecked) {
                fbBox.innerHTML = getFeedbackHTML(current);
                fbBox.style.display = '';
            } else {
                fbBox.style.display = 'none';
                fbBox.innerHTML = '';
            }
        }

        // Nav buttons
        const prevBtn = document.getElementById('vp-prev-btn');
        if (prevBtn) prevBtn.style.display = current === 0 ? 'none' : '';

        const nextBtn = document.getElementById('vp-next-btn');
        if (nextBtn) {
            nextBtn.textContent = current === questions.length - 1 ? 'Ver resultados →' : 'Siguiente →';
        }

        // Summary hidden while on questions
        const summary = document.getElementById('vp-summary');
        if (summary) summary.style.display = 'none';

        // Main app visible
        const app = document.getElementById('vocab-preguntas-app');
        if (app) {
            // Show inner elements (in case we're returning from summary)
            ['vp-progress', 'vp-counter', 'vp-question-box', 'vp-hint',
             'vp-answer-input', 'vp-check-btn', 'vp-prev-btn', 'vp-next-btn'].forEach(function (id) {
                const el = document.getElementById(id);
                if (el && el._vpHidden) { el.style.display = ''; el._vpHidden = false; }
            });
        }
    }

    // --- Check Answer ---
    window.vpCheckAnswer = function () {
        checked[current] = true;
        const fbBox = document.getElementById('vp-feedback-box');
        if (fbBox) {
            fbBox.innerHTML = getFeedbackHTML(current);
            fbBox.style.display = '';
        }
    };

    // --- Navigation ---
    window.vpMove = function (dir) {
        current += dir;
        if (current >= questions.length) {
            showSummary();
            return;
        }
        render();
    };

    // --- Summary ---
    function showSummary() {
        // Hide question elements
        ['vp-question-box', 'vp-hint', 'vp-answer-input', 'vp-check-btn',
         'vp-prev-btn', 'vp-next-btn', 'vp-feedback-box'].forEach(function (id) {
            const el = document.getElementById(id);
            if (el) { el.style.display = 'none'; el._vpHidden = true; }
        });

        const score = checked.filter(function (c, i) { return c && hasSomeMatch(i); }).length;
        const total = questions.length;

        const scoreEl = document.getElementById('vp-final-score');
        if (scoreEl) scoreEl.textContent = score + ' / ' + total;

        const msgEl = document.getElementById('vp-final-msg');
        if (msgEl) {
            if (score <= Math.floor(total * 0.4)) {
                msgEl.textContent = '¡Sigue practicando!';
            } else if (score <= Math.floor(total * 0.7)) {
                msgEl.textContent = '¡Buen trabajo!';
            } else if (score < total) {
                msgEl.textContent = '¡Muy bien!';
            } else {
                msgEl.textContent = '¡Excelente!';
            }
        }

        const summary = document.getElementById('vp-summary');
        if (summary) summary.style.display = '';
    }

    // --- Restart ---
    window.vpRestart = function () {
        current = 0;
        answers = Array(questions.length).fill('');
        checked = Array(questions.length).fill(false);
        render();
    };

})();