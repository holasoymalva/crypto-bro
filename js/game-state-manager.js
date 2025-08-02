/**
 * Game State Manager - Handles game statistics, high scores, and state transitions
 */
class GameStateManager {
    constructor() {
        this.currentState = 'menu'; // menu, playing, paused, gameOver
        this.sessionStats = {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            totalProfit: 0,
            totalLoss: 0,
            highestValue: 100000,
            lowestValue: 100000,
            startTime: null,
            endTime: null,
            sessionDuration: 0
        };
        this.highScores = this.loadHighScores();
        this.settings = this.loadSettings();
    }

    /**
     * Initialize the game state manager
     */
    initialize() {
        this.resetSessionStats();
        this.createMenuElements();
        this.showLoadingScreen();
        
        // Simulate loading time for better UX
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showMenu();
        }, 2000);
    }

    /**
     * Create loading screen
     */
    createLoadingScreen() {
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        this.loadingScreen.innerHTML = `
            <h1>CRYPTO BOY</h1>
            <p>Loading Bitcoin data...</p>
            <div class="loading-bar-container">
                <div id="loading-bar" class="loading-bar"></div>
            </div>
            <p class="loading-tip">Tip: Buy low, sell high to maximize profits!</p>
        `;
        document.body.appendChild(this.loadingScreen);
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        if (!this.loadingScreen) {
            this.createLoadingScreen();
        }
        
        this.loadingScreen.style.display = 'flex';
        
        // Animate loading bar
        const loadingBar = document.getElementById('loading-bar');
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            loadingBar.style.width = progress + '%';
        }, 200);
        
        this.progressInterval = progressInterval;
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        if (this.loadingScreen) {
            const loadingBar = document.getElementById('loading-bar');
            if (loadingBar) {
                loadingBar.style.width = '100%';
            }
            
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
            }
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Create menu UI elements
     */
    createMenuElements() {
        // Create main menu container
        this.menuContainer = document.createElement('div');
        this.menuContainer.className = 'menu-container';
        this.menuContainer.innerHTML = `
            <div class="menu-content">
                <h1 class="game-title">CRYPTO BOY</h1>
                <div class="menu-buttons">
                    <button id="start-game-btn" class="menu-btn">START GAME</button>
                    <button id="high-scores-btn" class="menu-btn">HIGH SCORES</button>
                    <button id="settings-btn" class="menu-btn">SETTINGS</button>
                    <button id="instructions-btn" class="menu-btn">INSTRUCTIONS</button>
                </div>
            </div>
        `;

        // Create high scores modal
        this.highScoresModal = document.createElement('div');
        this.highScoresModal.className = 'modal high-scores-modal';
        this.highScoresModal.innerHTML = `
            <div class="modal-content">
                <h2>HIGH SCORES</h2>
                <div id="high-scores-list"></div>
                <button class="modal-btn" onclick="gameStateManager.closeModal()">CLOSE</button>
            </div>
        `;

        // Create settings modal
        this.settingsModal = document.createElement('div');
        this.settingsModal.className = 'modal settings-modal';
        this.settingsModal.innerHTML = `
            <div class="modal-content">
                <h2>SETTINGS</h2>
                <div class="setting-item">
                    <label>MUSIC VOLUME:</label>
                    <input type="range" id="music-volume" min="0" max="100" value="${this.settings.musicVolume}">
                </div>
                <div class="setting-item">
                    <label>SFX VOLUME:</label>
                    <input type="range" id="sfx-volume" min="0" max="100" value="${this.settings.sfxVolume}">
                </div>
                <div class="setting-item">
                    <label>GAME SPEED:</label>
                    <input type="range" id="game-speed" min="5" max="50" value="${this.settings.gameSpeed}">
                </div>
                <button class="modal-btn" onclick="gameStateManager.saveSettings()">SAVE</button>
                <button class="modal-btn" onclick="gameStateManager.closeModal()">CANCEL</button>
            </div>
        `;

        // Create instructions modal
        this.instructionsModal = document.createElement('div');
        this.instructionsModal.className = 'modal instructions-modal';
        this.instructionsModal.innerHTML = `
            <div class="modal-content">
                <h2>HOW TO PLAY</h2>
                <div class="instructions-content">
                    <p><strong>OBJECTIVE:</strong> Buy low, sell high to maximize your portfolio value in 30 seconds!</p>
                    <p><strong>CONTROLS:</strong></p>
                    <ul>
                        <li>SPACE or LEFT MOUSE: Click to buy Bitcoin</li>
                        <li>SPACE or LEFT MOUSE: Click again to sell all Bitcoin</li>
                        <li>P: Pause/Resume game</li>
                        <li>R: Restart game</li>
                        <li>M: Return to main menu</li>
                        <li>+/-: Adjust game speed</li>
                    </ul>
                    <p><strong>STRATEGY:</strong> Watch the chart and time your trades carefully. You have 30 seconds to make the most profit!</p>
                </div>
                <button class="modal-btn" onclick="gameStateManager.closeModal()">GOT IT!</button>
            </div>
        `;

        // Create game over modal
        this.gameOverModal = document.createElement('div');
        this.gameOverModal.className = 'modal game-over-modal';
        this.gameOverModal.innerHTML = `
            <div class="modal-content">
                <h2>GAME OVER</h2>
                <p class="game-over-subtitle">⏰ Time's up! Here are your results:</p>
                <div id="game-over-stats"></div>
                <div class="game-over-buttons">
                    <button class="modal-btn" onclick="gameStateManager.restartGame()">PLAY AGAIN</button>
                    <button class="modal-btn" onclick="gameStateManager.showMenu()">START MENU</button>
                </div>
            </div>
        `;

        // Add elements to DOM
        document.body.appendChild(this.menuContainer);
        document.body.appendChild(this.highScoresModal);
        document.body.appendChild(this.settingsModal);
        document.body.appendChild(this.instructionsModal);
        document.body.appendChild(this.gameOverModal);

        // Add event listeners
        this.addMenuEventListeners();
    }

    /**
     * Add event listeners for menu buttons
     */
    addMenuEventListeners() {
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('high-scores-btn').addEventListener('click', () => {
            this.showHighScores();
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('instructions-btn').addEventListener('click', () => {
            this.showInstructions();
        });
    }

    /**
     * Show main menu
     */
    showMenu() {
        this.currentState = 'menu';
        this.menuContainer.style.display = 'flex';
        this.hideGameUI();
    }

    /**
     * Hide main menu
     */
    hideMenu() {
        this.menuContainer.style.display = 'none';
    }

    /**
     * Start the game
     */
    startGame() {
        this.currentState = 'playing';
        this.hideMenu();
        this.showGameUI();
        this.resetSessionStats();
        
        // Initialize game if not already done
        if (window.cryptoBoyGame && !window.cryptoBoyGame.isInitialized) {
            window.cryptoBoyGame.initialize();
        } else if (window.cryptoBoyGame) {
            window.cryptoBoyGame.getGameEngine().restart();
        }
    }

    /**
     * Show game UI
     */
    showGameUI() {
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.display = 'flex';
        }
    }

    /**
     * Hide game UI
     */
    hideGameUI() {
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }
    }

    /**
     * Show high scores
     */
    showHighScores() {
        this.updateHighScoresDisplay();
        this.highScoresModal.style.display = 'flex';
    }

    /**
     * Show settings
     */
    showSettings() {
        this.settingsModal.style.display = 'flex';
    }

    /**
     * Show instructions
     */
    showInstructions() {
        this.instructionsModal.style.display = 'flex';
    }

    /**
     * Close modal
     */
    closeModal() {
        this.highScoresModal.style.display = 'none';
        this.settingsModal.style.display = 'none';
        this.instructionsModal.style.display = 'none';
        this.gameOverModal.style.display = 'none';
    }

    /**
     * Save settings
     */
    saveSettings() {
        this.settings.musicVolume = parseInt(document.getElementById('music-volume').value);
        this.settings.sfxVolume = parseInt(document.getElementById('sfx-volume').value);
        this.settings.gameSpeed = parseInt(document.getElementById('game-speed').value);
        
        this.saveSettingsToStorage();
        this.closeModal();
        
        // Apply settings to game
        if (window.cryptoBoyGame && window.cryptoBoyGame.getGameEngine()) {
            const gameEngine = window.cryptoBoyGame.getGameEngine();
            gameEngine.gameSpeed = this.settings.gameSpeed;
            
            if (gameEngine.audioSystem) {
                gameEngine.audioSystem.setVolume(this.settings.sfxVolume / 100);
            }
        }
    }

    /**
     * Update session statistics
     */
    updateSessionStats(tradeData) {
        this.sessionStats.totalTrades++;
        
        if (tradeData.profit > 0) {
            this.sessionStats.winningTrades++;
            this.sessionStats.totalProfit += tradeData.profit;
        } else if (tradeData.profit < 0) {
            this.sessionStats.losingTrades++;
            this.sessionStats.totalLoss += Math.abs(tradeData.profit);
        }

        const currentValue = tradeData.currentValue;
        if (currentValue > this.sessionStats.highestValue) {
            this.sessionStats.highestValue = currentValue;
        }
        if (currentValue < this.sessionStats.lowestValue) {
            this.sessionStats.lowestValue = currentValue;
        }
    }

    /**
     * Reset session statistics
     */
    resetSessionStats() {
        this.sessionStats = {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            totalProfit: 0,
            totalLoss: 0,
            highestValue: 100000,
            lowestValue: 100000,
            startTime: Date.now(),
            endTime: null,
            sessionDuration: 0
        };
    }

    /**
     * End game session
     */
    endGameSession(finalValue) {
        this.sessionStats.endTime = Date.now();
        this.sessionStats.sessionDuration = this.sessionStats.endTime - this.sessionStats.startTime;
        
        // Calculate final statistics
        const initialValue = 100000;
        const totalProfit = finalValue - initialValue;
        const winRate = this.sessionStats.totalTrades > 0 ? 
            (this.sessionStats.winningTrades / this.sessionStats.totalTrades) * 100 : 0;
        
        // Check for high score
        const score = {
            date: new Date().toLocaleDateString(),
            finalValue: finalValue,
            totalProfit: totalProfit,
            totalTrades: this.sessionStats.totalTrades,
            winRate: winRate,
            sessionDuration: this.sessionStats.sessionDuration
        };
        
        this.addHighScore(score);
        this.showGameOver(score);
    }

    /**
     * Show game over screen
     */
    showGameOver(score) {
        this.currentState = 'gameOver';
        
        const statsHtml = `
            <div class="game-over-stat">
                <span class="stat-label">FINAL VALUE:</span>
                <span class="stat-value">$${this.formatCurrency(score.finalValue)}</span>
            </div>
            <div class="game-over-stat">
                <span class="stat-label">TOTAL PROFIT:</span>
                <span class="stat-value ${score.totalProfit >= 0 ? 'positive' : 'negative'}">
                    ${score.totalProfit >= 0 ? '+' : ''}$${this.formatCurrency(score.totalProfit)}
                </span>
            </div>
            <div class="game-over-stat">
                <span class="stat-label">TOTAL TRADES:</span>
                <span class="stat-value">${score.totalTrades}</span>
            </div>
            <div class="game-over-stat">
                <span class="stat-label">WIN RATE:</span>
                <span class="stat-value">${score.winRate.toFixed(1)}%</span>
            </div>
            <div class="game-over-stat">
                <span class="stat-label">SESSION TIME:</span>
                <span class="stat-value">${this.formatDuration(score.sessionDuration)}</span>
            </div>
        `;
        
        document.getElementById('game-over-stats').innerHTML = statsHtml;
        this.gameOverModal.style.display = 'flex';
    }

    /**
     * Restart game
     */
    restartGame() {
        this.closeModal();
        this.startGame();
    }

    /**
     * Add high score
     */
    addHighScore(score) {
        this.highScores.push(score);
        this.highScores.sort((a, b) => b.finalValue - a.finalValue);
        this.highScores = this.highScores.slice(0, 10); // Keep top 10
        this.saveHighScoresToStorage();
    }

    /**
     * Update high scores display
     */
    updateHighScoresDisplay() {
        const highScoresList = document.getElementById('high-scores-list');
        let html = '';
        
        this.highScores.forEach((score, index) => {
            html += `
                <div class="high-score-item">
                    <span class="rank">#${index + 1}</span>
                    <span class="date">${score.date}</span>
                    <span class="value">$${this.formatCurrency(score.finalValue)}</span>
                    <span class="profit ${score.totalProfit >= 0 ? 'positive' : 'negative'}">
                        ${score.totalProfit >= 0 ? '+' : ''}$${this.formatCurrency(score.totalProfit)}
                    </span>
                </div>
            `;
        });
        
        highScoresList.innerHTML = html;
    }

    /**
     * Load high scores from localStorage
     */
    loadHighScores() {
        try {
            const saved = localStorage.getItem('cryptoBoyHighScores');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Failed to load high scores:', error);
            return [];
        }
    }

    /**
     * Save high scores to localStorage
     */
    saveHighScoresToStorage() {
        try {
            localStorage.setItem('cryptoBoyHighScores', JSON.stringify(this.highScores));
        } catch (error) {
            console.warn('Failed to save high scores:', error);
        }
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('cryptoBoySettings');
            return saved ? JSON.parse(saved) : {
                musicVolume: 30,
                sfxVolume: 50,
                gameSpeed: 20
            };
        } catch (error) {
            console.warn('Failed to load settings:', error);
            return {
                musicVolume: 30,
                sfxVolume: 50,
                gameSpeed: 20
            };
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettingsToStorage() {
        try {
            localStorage.setItem('cryptoBoySettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    /**
     * Format currency for display
     */
    formatCurrency(amount) {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1)}K`;
        } else {
            return amount.toFixed(0);
        }
    }

    /**
     * Format duration for display
     */
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Get current game state
     */
    getCurrentState() {
        return this.currentState;
    }

    /**
     * Get session statistics
     */
    getSessionStats() {
        return { ...this.sessionStats };
    }
} 