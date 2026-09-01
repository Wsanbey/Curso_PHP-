// ============================================================
// APP.JS - Lógica Principal
// ============================================================

// ============================================================
// ESTADO
// ============================================================
let state = {
    currentView: 'inicio',
    quiz: {
        active: false,
        questions: [],
        currentIndex: 0,
        answers: {},
        correct: 0,
        wrong: 0,
        streak: 0,
        maxStreak: 0,
        config: {
            categories: Object.keys(CATEGORIES),
            limit: 10,
            order: 'random'
        }
    },
    history: [],
    studyFilter: 'all'
};

// ============================================================
// PERSISTÊNCIA (localStorage)
// ============================================================
function saveState() {
    const toSave = {
        quiz: state.quiz,
        history: state.history
    };
    localStorage.setItem('php-quiz-state', JSON.stringify(toSave));
}

function loadState() {
    try {
        const saved = localStorage.getItem('php-quiz-state');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.history) state.history = parsed.history;
            if (parsed.quiz) {
                state.quiz.config = { ...state.quiz.config, ...parsed.quiz.config };
                if (parsed.quiz.active && parsed.quiz.currentIndex < parsed.quiz.questions.length) {
                    state.quiz.active = parsed.quiz.active;
                    state.quiz.questions = parsed.quiz.questions;
                    state.quiz.currentIndex = parsed.quiz.currentIndex;
                    state.quiz.answers = parsed.quiz.answers || {};
                    state.quiz.correct = parsed.quiz.correct || 0;
                    state.quiz.wrong = parsed.quiz.wrong || 0;
                    state.quiz.streak = parsed.quiz.streak || 0;
                    state.quiz.maxStreak = parsed.quiz.maxStreak || 0;
                }
            }
        }
    } catch (e) {
        console.warn('Erro ao carregar estado:', e);
    }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderCategories();
    renderStudyContent();
    renderHistory();
    checkResume();
    setupNav();
    setupStudyFilters();
});

// ============================================================
// NAVEGAÇÃO
// ============================================================
function setupNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            showView(view);
        });
    });
}

function showView(view) {
    state.currentView = view;

    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(`view-${view}`).style.display = 'block';

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-btn[data-view="${view}"]`).classList.add('active');

    if (view === 'historico') renderHistory();
    if (view === 'estudo') renderStudyContent();
    if (view === 'inicio') checkResume();

    window.scrollTo(0, 0);
}

// ============================================================
// CATEGORIAS
// ============================================================
function renderCategories() {
    const grid = document.getElementById('category-grid');
    grid.innerHTML = '';

    Object.entries(CATEGORIES).forEach(([key, cat]) => {
        const chip = document.createElement('div');
        chip.className = 'category-chip' + (state.quiz.config.categories.includes(key) ? ' selected' : '');
        chip.dataset.category = key;
        chip.innerHTML = `<span class="chip-icon">${cat.icon}</span> ${cat.name}`;
        chip.addEventListener('click', () => toggleCategory(key, chip));
        grid.appendChild(chip);
    });
}

function toggleCategory(key, chip) {
    const cats = state.quiz.config.categories;
    const idx = cats.indexOf(key);
    if (idx > -1) {
        if (cats.length > 1) cats.splice(idx, 1);
    } else {
        cats.push(key);
    }
    chip.classList.toggle('selected');
}

// ============================================================
// QUIZ
// ============================================================
function startQuiz() {
    const cats = state.quiz.config.categories;
    const limit = parseInt(document.getElementById('question-limit').value);
    const order = document.getElementById('question-order').value;

    state.quiz.config.limit = limit;
    state.quiz.config.order = order;

    let pool = QUESTIONS.filter(q => cats.includes(q.category));

    if (order === 'random') {
        pool = shuffle(pool);
    }

    if (limit > 0 && pool.length > limit) {
        pool = pool.slice(0, limit);
    }

    state.quiz.questions = pool;
    state.quiz.currentIndex = 0;
    state.quiz.answers = {};
    state.quiz.correct = 0;
    state.quiz.wrong = 0;
    state.quiz.streak = 0;
    state.quiz.maxStreak = 0;
    state.quiz.active = true;

    saveState();
    showView('quiz');
    renderQuestion();
}

function resumeQuiz() {
    showView('quiz');
    renderQuestion();
}

function checkResume() {
    const banner = document.getElementById('resume-banner');
    if (state.quiz.active && state.quiz.currentIndex < state.quiz.questions.length) {
        const pct = Math.round((state.quiz.currentIndex / state.quiz.questions.length) * 100);
        document.getElementById('resume-progress').textContent =
            `${state.quiz.currentIndex}/${state.quiz.questions.length} (${pct}%)`;
        banner.style.display = 'flex';
    } else {
        banner.style.display = 'none';
    }
}

function clearProgress() {
    state.quiz.active = false;
    saveState();
    checkResume();
}

function renderQuestion() {
    const q = state.quiz.questions[state.quiz.currentIndex];
    const total = state.quiz.questions.length;
    const curr = state.quiz.currentIndex;

    document.getElementById('q-current').textContent = curr + 1;
    document.getElementById('q-total').textContent = total;
    document.getElementById('q-correct').textContent = state.quiz.correct;
    document.getElementById('q-wrong').textContent = state.quiz.wrong;
    document.getElementById('q-streak').textContent = state.quiz.streak;

    const progress = (curr / total) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;

    document.getElementById('q-category').textContent = CATEGORIES[q.category].name;
    document.getElementById('q-text').textContent = q.question;

    const optionsDiv = document.getElementById('q-options');
    optionsDiv.innerHTML = '';

    q.options.forEach((opt, i) => {
        const btn = document.createElement('div');
        btn.className = 'option';
        btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)})</span> ${opt}`;
        btn.addEventListener('click', () => selectOption(i));
        optionsDiv.appendChild(btn);
    });

    document.getElementById('q-explanation').classList.remove('show');
    document.getElementById('btn-next').disabled = true;
    document.getElementById('btn-next').textContent =
        curr < total - 1 ? 'Próxima →' : 'Ver Resultado';

    document.getElementById('question-card').style.animation = 'none';
    requestAnimationFrame(() => {
        document.getElementById('question-card').style.animation = 'fadeIn 0.2s ease';
    });

    saveState();
}

function selectOption(index) {
    if (state.quiz.answers[state.quiz.currentIndex] !== undefined) return;

    state.quiz.answers[state.quiz.currentIndex] = index;
    const q = state.quiz.questions[state.quiz.currentIndex];
    const options = document.querySelectorAll('.option');

    options.forEach(o => o.classList.add('disabled'));

    if (index === q.correct) {
        options[index].classList.add('correct');
        state.quiz.correct++;
        state.quiz.streak++;
        if (state.quiz.streak > state.quiz.maxStreak) {
            state.quiz.maxStreak = state.quiz.streak;
        }
    } else {
        options[index].classList.add('wrong');
        options[q.correct].classList.add('correct');
        state.quiz.wrong++;
        state.quiz.streak = 0;
    }

    document.getElementById('q-correct').textContent = state.quiz.correct;
    document.getElementById('q-wrong').textContent = state.quiz.wrong;
    document.getElementById('q-streak').textContent = state.quiz.streak;

    document.getElementById('exp-text').textContent = q.explanation;
    document.getElementById('exp-tip').textContent = '🔗 ' + q.tip;
    document.getElementById('q-explanation').classList.add('show');

    document.getElementById('btn-next').disabled = false;
    saveState();
}

function nextQuestion() {
    state.quiz.currentIndex++;

    if (state.quiz.currentIndex >= state.quiz.questions.length) {
        finishQuiz();
    } else {
        renderQuestion();
    }
}

function exitQuiz() {
    if (state.quiz.currentIndex < state.quiz.questions.length) {
        saveState();
    }
    showView('inicio');
}

function finishQuiz() {
    const total = state.quiz.questions.length;
    const percent = Math.round((state.quiz.correct / total) * 100);

    // Salvar no histórico
    const attempt = {
        id: Date.now(),
        date: new Date().toISOString(),
        categories: [...state.quiz.config.categories],
        total,
        correct: state.quiz.correct,
        wrong: state.quiz.wrong,
        percent,
        maxStreak: state.quiz.maxStreak
    };
    state.history.unshift(attempt);
    if (state.history.length > 50) state.history = state.history.slice(0, 50);

    state.quiz.active = false;
    saveState();

    // Mostrar resultado
    document.getElementById('res-percent').textContent = `${percent}%`;
    document.getElementById('res-total').textContent = total;
    document.getElementById('res-correct').textContent = state.quiz.correct;
    document.getElementById('res-wrong').textContent = state.quiz.wrong;
    document.getElementById('res-streak').textContent = state.quiz.maxStreak;

    const circle = document.getElementById('result-circle');
    circle.className = 'result-circle';
    if (percent >= 70) {
        circle.classList.add('excellent');
        document.getElementById('res-msg').textContent = 'Excelente! Está pronto!';
        document.getElementById('res-sub').textContent = 'Confiança alta pra call. Vai com tudo!';
    } else if (percent >= 50) {
        circle.classList.add('good');
        document.getElementById('res-msg').textContent = 'Bom progresso!';
        document.getElementById('res-sub').textContent = 'Revise os tópicos que errou e refaça.';
    } else {
        circle.classList.add('bad');
        document.getElementById('res-msg').textContent = 'Continue estudando!';
        document.getElementById('res-sub').textContent = 'Revise o conteúdo de estudo e tente novamente.';
    }

    // Resultado por categoria
    renderResultCategories();

    document.getElementById('progress-fill').style.width = '100%';
    showView('resultado');
}

function renderResultCategories() {
    const container = document.getElementById('res-categories');
    const catStats = {};

    state.quiz.questions.forEach((q, i) => {
        if (!catStats[q.category]) {
            catStats[q.category] = { total: 0, correct: 0 };
        }
        catStats[q.category].total++;
        if (state.quiz.answers[i] === q.correct) {
            catStats[q.category].correct++;
        }
    });

    let html = '<div style="font-weight:600; margin-bottom:0.5rem; font-size:0.85rem; color: var(--text-muted);">Por Categoria</div>';

    Object.entries(catStats).forEach(([cat, stats]) => {
        const pct = Math.round((stats.correct / stats.total) * 100);
        const color = pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--primary)' : 'var(--error)';
        html += `
            <div class="result-cat-row">
                <span>${CATEGORIES[cat].icon} ${CATEGORIES[cat].name}</span>
                <div class="result-cat-bar">
                    <div class="result-cat-fill" style="width:${pct}%; background:${color}"></div>
                </div>
                <span>${stats.correct}/${stats.total} (${pct}%)</span>
            </div>`;
    });

    container.innerHTML = html;
}

// ============================================================
// HISTÓRICO
// ============================================================
function renderHistory() {
    const list = document.getElementById('history-list');
    const summary = document.getElementById('history-summary');
    const empty = document.getElementById('history-empty');
    const btnClear = document.getElementById('btn-clear-history');

    if (state.history.length === 0) {
        list.innerHTML = '';
        summary.innerHTML = '';
        empty.style.display = 'block';
        btnClear.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    btnClear.style.display = 'block';

    // Resumo
    const totalAttempts = state.history.length;
    const avgScore = Math.round(state.history.reduce((a, h) => a + h.percent, 0) / totalAttempts);
    const bestScore = Math.max(...state.history.map(h => h.percent));
    const lastScore = state.history[0].percent;

    summary.innerHTML = `
        <div class="summary-card">
            <span class="summary-value">${totalAttempts}</span>
            <span class="summary-label">Tentativas</span>
        </div>
        <div class="summary-card">
            <span class="summary-value">${avgScore}%</span>
            <span class="summary-label">Média</span>
        </div>
        <div class="summary-card">
            <span class="summary-value">${bestScore}%</span>
            <span class="summary-label">Melhor</span>
        </div>
        <div class="summary-card">
            <span class="summary-value">${lastScore}%</span>
            <span class="summary-label">Última</span>
        </div>`;

    // Lista
    list.innerHTML = '';
    state.history.forEach(h => {
        const date = new Date(h.date);
        const dateStr = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const catNames = h.categories.map(c => CATEGORIES[c]?.icon || '').join(' ');
        const scoreClass = h.percent >= 70 ? 'excellent' : h.percent >= 50 ? 'good' : 'bad';

        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `
            <div class="history-item-left">
                <span class="history-item-date">${dateStr}</span>
                <span class="history-item-categories">${catNames}</span>
            </div>
            <div class="history-item-right">
                <span class="history-score ${scoreClass}">${h.percent}%</span>
                <span class="history-item-detail">${h.correct}/${h.total} acertos</span>
            </div>`;
        list.appendChild(item);
    });
}

function clearHistory() {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
        state.history = [];
        saveState();
        renderHistory();
    }
}

// ============================================================
// ESTUDO
// ============================================================
function setupStudyFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.studyFilter = btn.dataset.filter;
            renderStudyContent();
        });
    });
}

function renderStudyContent() {
    const container = document.getElementById('study-content');
    const filter = state.studyFilter;

    container.innerHTML = '';

    Object.entries(STUDY_CONTENT).forEach(([key, content]) => {
        if (filter !== 'all' && filter !== key) return;

        const card = document.createElement('div');
        card.className = 'study-card';

        let sectionsHTML = '';
        content.sections.forEach(s => {
            sectionsHTML += `
                <div class="study-section">
                    <div class="study-section-title">${s.title}</div>
                    <pre class="study-code">${escapeHTML(s.code)}</pre>
                    ${s.note ? `<div class="study-highlight">${s.note}</div>` : ''}
                </div>`;
        });

        card.innerHTML = `
            <div class="study-card-header" onclick="this.parentElement.classList.toggle('open')">
                <div class="study-card-title">
                    <span class="cat-icon">${content.icon}</span>
                    ${content.title}
                </div>
                <span class="study-card-arrow">▼</span>
            </div>
            <div class="study-card-body">${sectionsHTML}</div>`;

        container.appendChild(card);
    });
}

// ============================================================
// UTILS
// ============================================================
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
