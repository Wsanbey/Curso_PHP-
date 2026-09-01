// ============================================================
// APP.JS — PHP Interview Prep
// ============================================================

// ============================================================
// STATE
// ============================================================
let state = {
    currentView: 'dashboard',
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
// PERSISTENCE
// ============================================================
function saveState() {
    const toSave = {
        quiz: {
            active: state.quiz.active,
            questions: state.quiz.questions,
            currentIndex: state.quiz.currentIndex,
            answers: state.quiz.answers,
            correct: state.quiz.correct,
            wrong: state.quiz.wrong,
            streak: state.quiz.streak,
            maxStreak: state.quiz.maxStreak,
            config: state.quiz.config
        },
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
                if (parsed.quiz.active && parsed.quiz.questions && parsed.quiz.currentIndex < parsed.quiz.questions.length) {
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
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    lucide.createIcons();
    setupNavigation();
    setupSidebar();
    renderCategories();
    renderConfigCategories();
    renderStudyContent();
    renderDashboard();
    checkResume();
    setupStudyFilters();
});

// ============================================================
// NAVIGATION
// ============================================================
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            showView(view);
            closeSidebar();
        });
    });

    document.querySelectorAll('.bottom-nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            showView(view);
        });
    });
}

function showView(view) {
    state.currentView = view;

    document.querySelectorAll('.view').forEach(v => {
        v.style.display = 'none';
        v.classList.remove('active');
    });

    const target = document.getElementById(`view-${view}`);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
    }

    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-item[data-view="${view}"]`)?.classList.add('active');

    document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
    document.querySelector(`.bottom-nav-item[data-view="${view}"]`)?.classList.add('active');

    if (view === 'dashboard') renderDashboard();
    if (view === 'historico') renderHistory();
    if (view === 'estudo') renderStudyContent();
    if (view === 'quiz-config') checkResume();

    window.scrollTo(0, 0);
}

// ============================================================
// SIDEBAR (Mobile)
// ============================================================
function setupSidebar() {
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('sidebar-close');
    const overlay = document.getElementById('sidebar-overlay');

    menuBtn?.addEventListener('click', openSidebar);
    closeBtn?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);
}

function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
    const totalAnswered = state.history.reduce((a, h) => a + h.total, 0);
    const totalCorrect = state.history.reduce((a, h) => a + h.correct, 0);
    const avgScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const bestStreak = state.history.length > 0 ? Math.max(...state.history.map(h => h.maxStreak)) : 0;

    document.getElementById('dash-total').textContent = totalAnswered;
    document.getElementById('dash-correct').textContent = avgScore + '%';
    document.getElementById('dash-streak').textContent = bestStreak;
    document.getElementById('dash-attempts').textContent = state.history.length;

    // Continue card
    const continueCard = document.getElementById('continue-card');
    if (state.quiz.active && state.quiz.currentIndex < state.quiz.questions.length) {
        const pct = Math.round((state.quiz.currentIndex / state.quiz.questions.length) * 100);
        document.getElementById('continue-title').textContent = `Quiz em andamento`;
        document.getElementById('continue-sub').textContent = `${state.quiz.currentIndex}/${state.quiz.questions.length} questões (${pct}%)`;
        continueCard.style.display = 'flex';
    } else {
        continueCard.style.display = 'none';
    }

    renderCategories();
    lucide.createIcons();
}

// ============================================================
// CATEGORIES
// ============================================================
function renderCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = '';

    Object.entries(CATEGORIES).forEach(([key, cat]) => {
        const count = QUESTIONS.filter(q => q.category === key).length;
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-card-icon">${cat.icon}</div>
            <div class="category-card-name">${cat.name}</div>
            <div class="category-card-count">${count} questões</div>`;
        card.addEventListener('click', () => {
            state.quiz.config.categories = [key];
            showView('quiz-config');
        });
        grid.appendChild(card);
    });
}

function renderConfigCategories() {
    const container = document.getElementById('config-categories');
    if (!container) return;
    container.innerHTML = '';

    Object.entries(CATEGORIES).forEach(([key, cat]) => {
        const chip = document.createElement('button');
        chip.className = 'config-category-chip' + (state.quiz.config.categories.includes(key) ? ' selected' : '');
        chip.innerHTML = `<span>${cat.icon}</span> ${cat.name}`;
        chip.addEventListener('click', () => toggleConfigCategory(key, chip));
        container.appendChild(chip);
    });
}

function toggleConfigCategory(key, chip) {
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
    if (order === 'random') pool = shuffle(pool);
    if (limit > 0 && pool.length > limit) pool = pool.slice(0, limit);

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
    if (!banner) return;
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

    document.getElementById('progress-fill').style.width = `${(curr / total) * 100}%`;
    document.getElementById('q-category').textContent = CATEGORIES[q.category].name;
    document.getElementById('q-text').textContent = q.question;

    const optionsDiv = document.getElementById('q-options');
    optionsDiv.innerHTML = '';

    q.options.forEach((opt, i) => {
        const btn = document.createElement('div');
        btn.className = 'option';
        btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + i)}</span><span>${opt}</span>`;
        btn.addEventListener('click', () => selectOption(i));
        optionsDiv.appendChild(btn);
    });

    document.getElementById('q-explanation').classList.remove('show');
    document.getElementById('btn-next').disabled = true;
    document.getElementById('btn-next').innerHTML = curr < total - 1
        ? 'Próxima <i data-lucide="arrow-right"></i>'
        : 'Ver Resultado <i data-lucide="check"></i>';

    lucide.createIcons();
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
    saveState();
    showView('dashboard');
}

function finishQuiz() {
    const total = state.quiz.questions.length;
    const percent = Math.round((state.quiz.correct / total) * 100);

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

    document.getElementById('res-percent').textContent = `${percent}%`;
    document.getElementById('res-total').textContent = total;
    document.getElementById('res-correct').textContent = state.quiz.correct;
    document.getElementById('res-wrong').textContent = state.quiz.wrong;
    document.getElementById('res-streak').textContent = state.quiz.maxStreak;

    const circle = document.getElementById('result-circle');
    circle.className = 'result-circle';
    if (percent >= 70) {
        circle.classList.add('excellent');
        document.getElementById('res-msg').textContent = 'Excelente!';
        document.getElementById('res-sub').textContent = 'Você está pronto para a entrevista.';
    } else if (percent >= 50) {
        circle.classList.add('good');
        document.getElementById('res-msg').textContent = 'Bom progresso!';
        document.getElementById('res-sub').textContent = 'Revise os tópicos e refaça.';
    } else {
        circle.classList.add('bad');
        document.getElementById('res-msg').textContent = 'Continue estudando!';
        document.getElementById('res-sub').textContent = 'Revise o conteúdo e tente novamente.';
    }

    renderResultCategories();
    document.getElementById('progress-fill').style.width = '100%';
    showView('resultado');
    lucide.createIcons();
}

function renderResultCategories() {
    const container = document.getElementById('res-categories');
    const catStats = {};

    state.quiz.questions.forEach((q, i) => {
        if (!catStats[q.category]) catStats[q.category] = { total: 0, correct: 0 };
        catStats[q.category].total++;
        if (state.quiz.answers[i] === q.correct) catStats[q.category].correct++;
    });

    let html = '<div style="font-weight:600; margin-bottom:0.5rem; font-size:0.82rem; color: var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">Por Categoria</div>';

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
// HISTORY
// ============================================================
function renderHistory() {
    const list = document.getElementById('history-list');
    const summary = document.getElementById('history-summary');
    const empty = document.getElementById('history-empty');
    const btnClear = document.getElementById('btn-clear-history');

    if (state.history.length === 0) {
        if (list) list.innerHTML = '';
        if (summary) summary.innerHTML = '';
        if (empty) empty.style.display = 'block';
        if (btnClear) btnClear.style.display = 'none';
        return;
    }

    if (empty) empty.style.display = 'none';
    if (btnClear) btnClear.style.display = 'block';

    const totalAttempts = state.history.length;
    const avgScore = Math.round(state.history.reduce((a, h) => a + h.percent, 0) / totalAttempts);
    const bestScore = Math.max(...state.history.map(h => h.percent));
    const lastScore = state.history[0].percent;

    if (summary) {
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
    }

    if (list) {
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
}

function clearHistory() {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
        state.history = [];
        saveState();
        renderHistory();
    }
}

// ============================================================
// STUDY
// ============================================================
function setupStudyFilters() {
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.studyFilter = btn.dataset.filter;
            renderStudyContent();
        });
    });
}

function renderStudyContent() {
    const container = document.getElementById('study-content');
    if (!container) return;
    container.innerHTML = '';

    Object.entries(STUDY_CONTENT).forEach(([key, content]) => {
        if (state.studyFilter !== 'all' && state.studyFilter !== key) return;

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
                    <span>${content.icon}</span>
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
