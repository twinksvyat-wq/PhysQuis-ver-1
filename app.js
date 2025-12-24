class PhysicsQuiz {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentTopic = null;
        this.currentQuestion = null;
        this.questionIndex = 0;
        this.lives = 3;
        this.streak = 0;
        this.maxStreak = 0;
        this.totalCorrect = 0;
        this.totalQuestions = 0;
        this.answered = false;
        this.isCorrect = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.nickname = localStorage.getItem('nickname') || '';
        this.leaderboardKey = 'physics_leaderboard';

        this.applyTheme(this.currentTheme);
        this.showMenu();
    }

    applyTheme(theme) {
        document.body.className = `${theme}-theme`;
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    showMenu() {
        const app = document.getElementById('app');
        const formulas = ['v = a·t', 'F = m·a', 'E = mc²', 'P = U·I', 'Q = m·c·ΔT', 'λ·f = v', 'ρ = m/V', 'W = F·s', 'η = Aп/Aз', 'R = U/I'];
        
        let formulasHTML = '<div class="floating-formulas">';
        for (let i = 0; i < 20; i++) {
            const formula = formulas[Math.floor(Math.random() * formulas.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 25;
            const duration = 20 + Math.random() * 15;
            formulasHTML += `<div class="formula-float" style="left: ${left}%; animation-delay: ${delay}s; animation-duration: ${duration}s;">${formula}</div>`;
        }
        formulasHTML += '</div>';

        app.innerHTML = `
            ${formulasHTML}
            <div class="header">
                <h1>Физика</h1>
                <div class="header-right">
                    <button class="theme-selector" id="themeSelect" title="Переключить тему">
                        ${this.currentTheme === 'light' ? 'L' : 'D'}
                    </button>
                </div>
            </div>
            <div class="screen">
                <div class="start-screen">
                    <div class="menu-title">Физика</div>
                    <div class="menu-subtitle">Освой формулы</div>
                    <div class="input-group" style="margin-top: 8px;">
                        <label class="input-label">Никнейм:</label>
                        <input
                            type="text"
                            class="formula-input"
                            id="nicknameInput"
                            placeholder="введи свой ник"
                        />
                    </div>
                    <div class="button-group" style="margin-top: 16px;">
                        <button class="menu-btn" id="startBtn">Начать</button>
                        <button class="menu-btn" id="leaderboardBtn">Лидерборд</button>
                    </div>
                </div>
            </div>
        `;

        const themeBtn = document.getElementById('themeSelect');
        const nicknameInput = document.getElementById('nicknameInput');
        const startBtn = document.getElementById('startBtn');
        const leaderboardBtn = document.getElementById('leaderboardBtn');

        nicknameInput.value = this.nickname;
        this.updateStartButtonState(startBtn, nicknameInput.value);

        nicknameInput.addEventListener('input', e => {
            this.updateStartButtonState(startBtn, e.target.value);
        });

        themeBtn.addEventListener('click', () => {
            const themes = ['light', 'dark'];
            const currentIndex = themes.indexOf(this.currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            this.applyTheme(nextTheme);
            this.showMenu();
        });

        startBtn.addEventListener('click', () => {
            const value = nicknameInput.value.trim();
            if (!value) return;
            this.nickname = value;
            localStorage.setItem('nickname', value);
            this.showTopicMenu();
        });

        leaderboardBtn.addEventListener('click', () => {
            this.showLeaderboard();
        });
    }

    showTopicMenu() {
        const app = document.getElementById('app');
        const formulas = ['v = a·t', 'F = m·a', 'E = mc²', 'P = U·I', 'Q = m·c·ΔT', 'λ·f = v', 'ρ = m/V', 'W = F·s', 'η = Aп/Aз', 'R = U/I'];
        
        let formulasHTML = '<div class="floating-formulas">';
        for (let i = 0; i < 20; i++) {
            const formula = formulas[Math.floor(Math.random() * formulas.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 25;
            const duration = 20 + Math.random() * 15;
            formulasHTML += `<div class="formula-float" style="left: ${left}%; animation-delay: ${delay}s; animation-duration: ${duration}s;">${formula}</div>`;
        }
        formulasHTML += '</div>';

        app.innerHTML = `
            ${formulasHTML}
            <div class="header">
                <h1>Физика</h1>
                <div class="header-right">
                    <button class="theme-selector" id="themeSelect" title="Переключить тему">
                        ${this.currentTheme === 'light' ? 'L' : 'D'}
                    </button>
                </div>
            </div>
            <div class="screen">
                <div class="menu-container">
                    <div class="menu-title">Выбери раздел</div>
                    <div class="theme-buttons">
                        <button class="menu-btn" data-topic="mechanics">Механика</button>
                        <button class="menu-btn" data-topic="thermodynamics">Термодинамика</button>
                        <button class="menu-btn" data-topic="electricity">Электричество</button>
                        <button class="menu-btn" data-topic="optics">Оптика</button>
                    </div>
                </div>
            </div>
        `;

        const themeBtn = document.getElementById('themeSelect');
        themeBtn.addEventListener('click', () => {
            const themes = ['light', 'dark'];
            const currentIndex = themes.indexOf(this.currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            this.applyTheme(nextTheme);
            this.showTopicMenu();
        });

        document.querySelectorAll('[data-topic]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.startQuiz(e.target.dataset.topic);
            });
        });
    }

    updateStartButtonState(button, value) {
        if (!button) return;
        const trimmed = (value || '').trim();
        button.disabled = !trimmed;
    }

    startQuiz(topic) {
        this.currentTopic = topic;
        this.questionIndex = 0;
        this.lives = 3;
        this.streak = 0;
        this.maxStreak = 0;
        this.totalCorrect = 0;
        this.totalQuestions = 0;
        this.nextQuestion();
    }

    nextQuestion() {
        const questions = quizData[this.currentTopic];
        const randomIndex = Math.floor(Math.random() * questions.length);
        
        this.currentQuestion = questions[randomIndex];
        this.answered = false;
        this.isCorrect = false;
        this.totalQuestions++;
        this.showQuestion();
    }

    showQuestion() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="header">
                <h1>Физика</h1>
                <div class="header-right">
                    <div class="stats">
                        <div class="stat-item">
                            <span class="stat-icon">
                                <img src="ui/heart.png" style="width: 20px; height: 20px; display: inline-block; margin-right: 2px;" alt="life">
                                x${this.lives}
                            </span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">Серия</span>
                            <span>${this.streak}</span>
                        </div>
                    </div>
                    <button class="theme-selector" id="themeSelect" title="Переключить тему">
                        ${this.currentTheme === 'light' ? 'L' : 'D'}
                    </button>
                </div>
            </div>
            <div class="screen">
                <div class="quiz-container">
                    <div class="swipe-container" id="swipeContainer">
                        <div class="card">
                            <div>
                                <div class="problem-title">${this.currentQuestion.title}</div>
                                <div class="problem-text">${this.currentQuestion.problem}</div>
                                <div class="formula-box" id="formulaBox">???</div>
                                <div class="lives-container">
                                    ${Array.from({length: 3}, (_, i) => `
                                        <div class="life ${i < this.lives ? 'active' : 'inactive'}"><img src="ui/heart.png" style="width: 24px; height: 24px;" alt="life"></div>
                                    `).join('')}
                                </div>
                                <div class="streak-counter">Серия: ${this.streak}</div>
                                <div class="input-group">
                                    <label class="input-label">Введи формулу (без точек умножения):</label>
                                    <input 
                                        type="text" 
                                        class="formula-input" 
                                        id="formulaInput" 
                                        placeholder="например, v = at или E = mv^2/2"
                                        ${this.answered ? 'disabled' : ''}
                                    />
                                </div>
                                ${this.answered ? this.getFeedbackHTML() : ''}
                            </div>
                            <div>
                                <div class="button-group">
                                    <button class="btn btn-submit" id="submitBtn" ${this.answered ? 'disabled' : ''}>Ответить</button>
                                    <button class="btn btn-skip" id="skipBtn" ${this.answered ? 'disabled' : ''}>Пропустить</button>
                                    ${!this.answered ? '<div class="skip-text" id="skipText">Пропустить</div>' : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="swipe-indicator">← Свайп →</div>
                </div>
            </div>
        `;

        const themeBtn = document.getElementById('themeSelect');
        themeBtn.addEventListener('click', () => {
            const themes = ['light', 'dark'];
            const currentIndex = themes.indexOf(this.currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            this.applyTheme(nextTheme);
            this.showQuestion();
        });

        const formulaInput = document.getElementById('formulaInput');
        const submitBtn = document.getElementById('submitBtn');
        const skipBtn = document.getElementById('skipBtn');
        const swipeContainer = document.getElementById('swipeContainer');

        if (!this.answered) {
            formulaInput.focus();
            formulaInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.checkAnswer(formulaInput.value);
                }
            });

            submitBtn.addEventListener('click', () => {
                this.checkAnswer(formulaInput.value);
            });

            const skipText = document.getElementById('skipText');
            if (skipText) {
                skipText.addEventListener('click', () => {
                    this.skipQuestion();
                });
            }
        }

        swipeContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        swipeContainer.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.nextQuestion();
            } else {
                this.previousQuestion();
            }
        }
    }

    previousQuestion() {
        if (this.questionIndex > 1) {
            this.questionIndex -= 2;
            this.nextQuestion();
        }
    }

    normalizeFormula(formula) {
        return formula
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '')
            .replace(/[×·]/g, '')
            .replace(/\*/g, '')
            .replace(/÷/g, '/')
            .replace(/π/g, 'pi')
            .replace(/²/g, '^2')
            .replace(/³/g, '^3')
            .replace(/₁/g, '1')
            .replace(/₂/g, '2')
            .replace(/ᵢ/g, 'i')
            .replace(/ₐ/g, 'a');
    }

    checkAnswer(userAnswer) {
        if (this.answered) return;

        const normalized = this.normalizeFormula(userAnswer);
        const correct = this.normalizeFormula(this.currentQuestion.answer);
        
        this.isCorrect = normalized === correct;
        this.answered = true;

        if (this.isCorrect) {
            this.totalCorrect++;
            this.streak++;
            if (this.streak > this.maxStreak) {
                this.maxStreak = this.streak;
            }
        } else {
            this.lives--;
            this.streak = 0;
            
            if (this.lives <= 0) {
                setTimeout(() => this.showGameOver(), 1000);
                return;
            }
        }

        this.showQuestion();
    }

    skipQuestion() {
        this.lives--;
        this.streak = 0;
        
        if (this.lives <= 0) {
            setTimeout(() => this.showGameOver(), 1000);
            return;
        }
        
        this.nextQuestion();
    }

    getFeedbackHTML() {
        if (this.isCorrect) {
            return `
                <div class="feedback correct">Верно!</div>
                <div class="explanation">
                    <strong>Формула:</strong> ${this.currentQuestion.formula}<br>
                    <strong>Объяснение:</strong> ${this.currentQuestion.explanation}
                </div>
                <div class="button-group">
                    <button class="btn btn-submit" id="nextBtn" onclick="window.quizInstance.nextQuestion()">Далее</button>
                </div>
            `;
        } else {
            return `
                <div class="feedback incorrect">Неправильно!</div>
                <div class="explanation">
                    <strong>Правильная формула:</strong> ${this.currentQuestion.formula}<br>
                    <strong>Объяснение:</strong> ${this.currentQuestion.explanation}
                </div>
                <div class="button-group">
                    <button class="btn btn-submit" id="nextBtn" onclick="window.quizInstance.nextQuestion()">Далее</button>
                </div>
            `;
        }
    }

    getLeaderboard() {
        const raw = localStorage.getItem(this.leaderboardKey);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    saveLeaderboard(list) {
        localStorage.setItem(this.leaderboardKey, JSON.stringify(list));
    }

    updateLeaderboard(accuracy) {
        if (!this.nickname) return;
        const list = this.getLeaderboard();
        const existing = list.find(item => item.name === this.nickname);
        if (existing) {
            if (this.maxStreak > existing.bestStreak) existing.bestStreak = this.maxStreak;
            if (accuracy > existing.bestAccuracy) existing.bestAccuracy = accuracy;
            existing.games += 1;
        } else {
            list.push({
                name: this.nickname,
                bestStreak: this.maxStreak,
                bestAccuracy: accuracy,
                games: 1
            });
        }
        list.sort((a, b) => {
            if (b.bestStreak !== a.bestStreak) return b.bestStreak - a.bestStreak;
            if (b.bestAccuracy !== a.bestAccuracy) return b.bestAccuracy - a.bestAccuracy;
            return a.name.localeCompare(b.name);
        });
        this.saveLeaderboard(list.slice(0, 20));
    }

    showLeaderboard() {
        const app = document.getElementById('app');
        const list = this.getLeaderboard();

        app.innerHTML = `
            <div class="header">
                <h1>Физика</h1>
                <div class="header-right">
                    <button class="theme-selector" id="themeSelect" title="Переключить тему">
                        ${this.currentTheme === 'light' ? 'L' : 'D'}
                    </button>
                </div>
            </div>
            <div class="screen">
                <div class="game-over-container">
                    <div class="game-over-title">Лидерборд</div>
                    <div class="game-over-stats">
                        ${list.length === 0 ? '<div class="stat-row">Пока нет результатов</div>' : list.map((item, index) => `
                            <div class="stat-row">
                                <strong>${index + 1}. ${item.name}</strong><br>
                                Лучший стрик: ${item.bestStreak} · Точность: ${item.bestAccuracy}% · Игр: ${item.games}
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-submit restart-btn" id="backToMenuBtn">В меню</button>
                </div>
            </div>
        `;

        const themeBtn = document.getElementById('themeSelect');
        themeBtn.addEventListener('click', () => {
            const themes = ['light', 'dark'];
            const currentIndex = themes.indexOf(this.currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            this.applyTheme(nextTheme);
            this.showLeaderboard();
        });

        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.showMenu();
        });
    }

    showGameOver() {
        const app = document.getElementById('app');
        const accuracy = this.totalQuestions > 0 
            ? Math.round((this.totalCorrect / this.totalQuestions) * 100) 
            : 0;

        this.updateLeaderboard(accuracy);

        app.innerHTML = `
            <div class="header">
                <h1>Физика</h1>
                <div class="header-right">
                    <button class="theme-selector" id="themeSelect" title="Переключить тему">
                        ${this.currentTheme === 'light' ? 'L' : 'D'}
                    </button>
                </div>
            </div>
            <div class="screen">
                <div class="game-over-container">
                    <div class="game-over-title">Конец игры!</div>
                    <div class="game-over-stats">
                        <div class="stat-row">
                            <strong>Правильные ответы:</strong> ${this.totalCorrect}/${this.totalQuestions}
                        </div>
                        <div class="stat-row">
                            <strong>Точность:</strong> ${accuracy}%
                        </div>
                        <div class="stat-row">
                            <strong>Макс. серия:</strong> ${this.maxStreak}
                        </div>
                    </div>
                    <button class="btn btn-submit restart-btn" id="restartBtn">В меню</button>
                </div>
            </div>
        `;

        const themeBtn = document.getElementById('themeSelect');
        themeBtn.addEventListener('click', () => {
            const themes = ['light', 'dark'];
            const currentIndex = themes.indexOf(this.currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            this.applyTheme(nextTheme);
            this.showGameOver();
        });

        document.getElementById('restartBtn').addEventListener('click', () => {
            this.showMenu();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.quizInstance = new PhysicsQuiz();
});
