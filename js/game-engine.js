/**
 * Game Engine - Handles game state, time progression, and UI updates
 */
class GameEngine {
    constructor(canvas, dataManager, chartRenderer) {
        this.canvas = canvas;
        this.dataManager = dataManager;
        this.chartRenderer = chartRenderer;
        this.characterSystem = null; // Will be initialized after character system is loaded
        this.visualEffects = null; // Will be initialized after visual effects system is loaded
        this.audioSystem = null; // Will be initialized after audio system is loaded
        this.gameStateManager = null; // Will be set by main.js
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.gameSpeed = 20; // days per second (increased from 5 to 20 for much faster time progression)
        this.currentDateIndex = 0;
        this.startDateIndex = 0;
        this.endDateIndex = 0;
        this.gameTimeLimit = 30000; // 30 seconds in milliseconds
        this.gameStartTime = 0;
        this.timeRemaining = 30000;
        
        // Portfolio state
        this.portfolio = {
            cash: 100000,
            bitcoin: 0,
            totalValue: 100000
        };
        
        // Trading state
        this.isBuying = false;
        this.lastTradePrice = 0;
        this.tradeHistory = [];
        this.lastTradeTime = 0; // Add timestamp for trade cooldown
        this.bestTrade = 0; // Track best single trade
        this.sessionStartTime = Date.now(); // Track session time
        
        // UI elements
        this.uiElements = {
            currentDate: document.getElementById('current-date'),
            currentPrice: document.getElementById('current-price'),
            portfolioValue: document.getElementById('portfolio-value'),
            bitcoinHoldings: document.getElementById('bitcoin-holdings'),
            cashAmount: document.getElementById('cash-amount'),
            tradingStatus: document.getElementById('trading-status'),
            profitLossValue: document.getElementById('profit-loss-value'),
            profitLossPercentage: document.getElementById('profit-loss-percentage'),
            totalTrades: document.getElementById('total-trades'),
            winRate: document.getElementById('win-rate'),
            bestTrade: document.getElementById('best-trade'),
            sessionTime: document.getElementById('session-time'),
            timeRemaining: document.getElementById('time-remaining')
        };
        
        // Animation
        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
        
        this.initialize();
    }

    /**
     * Initialize the game engine
     */
    async initialize() {
        console.log('Initializing GameEngine...');
        
        // Wait for data to be loaded
        await this.dataManager.initialize();
        
        // Set up game parameters
        this.setupGameParameters();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize character system
        this.characterSystem = new CharacterSystem(this.canvas, this);
        
        // Update chart renderer with game engine reference
        this.chartRenderer.gameEngine = this;
        
        // Initialize visual effects system
        this.visualEffects = new VisualEffectsSystem(this.canvas, this);
        
        // Initialize audio system
        this.audioSystem = new AudioSystem();
        
        // Start background music
        setTimeout(() => {
            if (this.audioSystem) {
                this.audioSystem.startBackgroundMusic();
            }
        }, 1000);
        
        // Start the game loop
        this.start();
    }

    /**
     * Set up initial game parameters
     */
    setupGameParameters() {
        const dataLength = this.dataManager.bitcoinData.length;
        
        // Check if we have data
        if (dataLength === 0) {
            console.error('No Bitcoin data available');
            return;
        }
        
        // Random start date between 2013 and 2025
        const startYear = 2013;
        const endYear = 2025;
        const startDate = new Date(startYear, 0, 1);
        const endDate = new Date(endYear, 11, 31);
        
        // Find the closest data point to a random date
        const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
        const randomDate = new Date(randomTime);
        
        // Find the closest data point
        let closestIndex = 0;
        let minDiff = Infinity;
        
        this.dataManager.bitcoinData.forEach((point, index) => {
            const diff = Math.abs(point.date.getTime() - randomDate.getTime());
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = index;
            }
        });
        
        this.startDateIndex = closestIndex;
        this.currentDateIndex = closestIndex;
        this.endDateIndex = dataLength - 1;
        
        if (this.dataManager.bitcoinData[closestIndex]) {
            console.log(`Game starting at: ${this.dataManager.bitcoinData[closestIndex].formattedDate}`);
        } else {
            console.log('Game starting with sample data');
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Mouse events for trading
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left mouse button
                this.toggleTrading();
            }
        });

        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Keyboard events for trading
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.toggleTrading();
                    break;
                case 'KeyR':
                    e.preventDefault();
                    this.restart();
                    break;
                case 'KeyP':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    if (this.gameStateManager) {
                        this.gameStateManager.showMenu();
                    }
                    break;
                case 'Equal': // + key
                case 'NumpadAdd':
                    e.preventDefault();
                    this.increaseSpeed();
                    break;
                case 'Minus': // - key
                case 'NumpadSubtract':
                    e.preventDefault();
                    this.decreaseSpeed();
                    break;
            }
        });
    }

    /**
     * Start the game loop
     */
    start() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.gameStartTime = Date.now();
        this.timeRemaining = this.gameTimeLimit;
        this.gameLoop();
    }

    /**
     * Stop the game loop
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Toggle pause state
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        console.log(this.isPaused ? 'Game paused' : 'Game resumed');
    }

    /**
     * Increase game speed
     */
    increaseSpeed() {
        this.gameSpeed = Math.min(this.gameSpeed * 1.5, 20); // Max 20x speed
        console.log(`🚀 Speed increased to ${this.gameSpeed.toFixed(1)}x`);
    }

    /**
     * Decrease game speed
     */
    decreaseSpeed() {
        this.gameSpeed = Math.max(this.gameSpeed / 1.5, 0.5); // Min 0.5x speed
        console.log(`🐌 Speed decreased to ${this.gameSpeed.toFixed(1)}x`);
    }

    /**
     * Update game timer
     */
    updateGameTimer() {
        const elapsed = Date.now() - this.gameStartTime;
        this.timeRemaining = Math.max(0, this.gameTimeLimit - elapsed);
    }

    /**
     * End game due to time limit
     */
    endGame() {
        console.log('⏰ Time is up! Game Over!');
        this.isRunning = false;
        
        // Calculate final statistics
        const finalValue = this.calculatePortfolioValue();
        const initialValue = 100000;
        const profit = finalValue - initialValue;
        const profitPercentage = (profit / initialValue) * 100;
        
        console.log(`Final Portfolio Value: $${this.formatCurrency(finalValue)}`);
        console.log(`Profit/Loss: $${this.formatCurrency(profit)} (${profitPercentage.toFixed(2)}%)`);
        console.log(`Total Trades: ${this.tradeHistory.length}`);
        
        // End game session with game state manager
        if (this.gameStateManager) {
            this.gameStateManager.endGameSession(finalValue);
        }
    }

    /**
     * Restart the game
     */
    restart() {
        console.log('Restarting game...');
        
        // Reset portfolio
        this.portfolio = {
            cash: 100000,
            bitcoin: 0,
            totalValue: 100000
        };
        
        // Reset trading state
        this.isBuying = false;
        this.lastTradePrice = 0;
        this.tradeHistory = [];
        this.lastTradeTime = 0; // Reset trade cooldown
        this.bestTrade = 0; // Reset best trade
        this.sessionStartTime = Date.now(); // Reset session start time
        
        // Reset game timer
        this.gameStartTime = Date.now();
        this.timeRemaining = this.gameTimeLimit;
        
        // Reset game state
        this.setupGameParameters();
        this.isPaused = false;
        
        // Update UI
        this.updateUI();
    }

    /**
     * Main game loop
     */
    gameLoop(currentTime = performance.now()) {
        if (!this.isRunning) return;

        requestAnimationFrame((time) => this.gameLoop(time));

        if (this.isPaused) return;

        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;

        this.accumulatedTime += deltaTime;

        // Update game timer
        this.updateGameTimer();

        // Check if time is up
        if (this.timeRemaining <= 0) {
            this.endGame();
            return;
        }

        // Update game state based on time progression
        const daysToAdvance = this.accumulatedTime * this.gameSpeed;
        if (daysToAdvance >= 1) {
            this.advanceTime(Math.floor(daysToAdvance));
            this.accumulatedTime -= Math.floor(daysToAdvance);
        }

        // Update trading logic
        this.updateTrading();

        // Update character
        if (this.characterSystem) {
            this.characterSystem.update(deltaTime);
        }

        // Update visual effects
        if (this.visualEffects) {
            this.visualEffects.update(deltaTime);
        }

        // Update UI
        this.updateUI();

        // Render chart
        this.renderChart();
        
        // Render visual effects
        if (this.visualEffects) {
            this.visualEffects.render();
        }
        
        // Render character
        if (this.characterSystem) {
            this.characterSystem.render();
        }
    }

    /**
     * Advance time by specified number of days
     */
    advanceTime(days) {
        const newIndex = this.currentDateIndex + days;
        
        if (newIndex <= this.endDateIndex) {
            this.currentDateIndex = newIndex;
        } else {
            // Game over - reached end of data
            this.currentDateIndex = this.endDateIndex;
            this.gameOver();
        }
    }

    /**
     * Update trading logic
     */
    updateTrading() {
        if (!this.isBuying) return;

        const currentDataPoint = this.dataManager.bitcoinData[this.currentDateIndex];
        if (!currentDataPoint) return;

        const currentPrice = currentDataPoint.price;
        
        // Buy Bitcoin with available cash
        if (this.portfolio.cash > 0) {
            const bitcoinToBuy = this.portfolio.cash / currentPrice;
            this.portfolio.bitcoin += bitcoinToBuy;
            this.portfolio.cash = 0;
            
            this.lastTradePrice = currentPrice;
            
            console.log(`💰 Bought ${bitcoinToBuy.toFixed(8)} BTC at $${currentPrice.toFixed(2)}`);
        }
    }

    /**
     * Toggle between buying and selling
     */
    toggleTrading() {
        if (this.isPaused) return;
        
        // Prevent rapid clicking
        const now = Date.now();
        if (now - this.lastTradeTime < 100) return; // 100ms cooldown
        this.lastTradeTime = now;
        
        if (this.isBuying) {
            // Currently buying, so sell
            this.sellBitcoin();
        } else {
            // Not buying, so start buying
            this.startBuying();
        }
    }

    /**
     * Start buying Bitcoin
     */
    startBuying() {
        if (this.isPaused) return;
        
        this.isBuying = true;
        console.log('🟢 Started buying Bitcoin...');
        
        // Play buy sound immediately
        if (this.audioSystem) {
            this.audioSystem.playSound('buy');
        }
        
        // Trigger visual effect
        if (this.visualEffects) {
            this.visualEffects.triggerTradeEffect(this.canvas.width / 2, this.canvas.height / 2, 'buy');
        }
        
        // Update UI immediately to show buying state
        this.updateTradingStatus();
    }

    /**
     * Sell all Bitcoin
     */
    sellBitcoin() {
        if (!this.isBuying) return;
        
        this.isBuying = false;
        
        const currentDataPoint = this.dataManager.bitcoinData[this.currentDateIndex];
        if (!currentDataPoint) return;

        const currentPrice = currentDataPoint.price;
        
        if (this.portfolio.bitcoin > 0) {
            const bitcoinSold = this.portfolio.bitcoin;
            const cashFromSale = bitcoinSold * currentPrice;
            this.portfolio.cash = cashFromSale;
            
            // Record trade
            this.tradeHistory.push({
                date: currentDataPoint.date,
                action: 'sell',
                price: currentPrice,
                bitcoin: bitcoinSold,
                value: cashFromSale
            });
            
            this.portfolio.bitcoin = 0;
            
            console.log(`💸 Sold ${bitcoinSold.toFixed(8)} BTC at $${currentPrice.toFixed(2)} for $${cashFromSale.toFixed(2)}`);
            
            // Show profit/loss for this trade
            if (this.lastTradePrice > 0) {
                const tradePL = cashFromSale - (bitcoinSold * this.lastTradePrice);
                const tradePLPercent = (tradePL / (bitcoinSold * this.lastTradePrice)) * 100;
                const plSign = tradePL >= 0 ? '+' : '';
                console.log(`📊 Trade P/L: ${plSign}$${tradePL.toFixed(2)} (${plSign}${tradePLPercent.toFixed(2)}%)`);
                
                // Track best trade
                if (tradePL > this.bestTrade) {
                    this.bestTrade = tradePL;
                }
                
                // Update session statistics
                if (this.gameStateManager) {
                    this.gameStateManager.updateSessionStats({
                        profit: tradePL,
                        currentValue: this.calculatePortfolioValue()
                    });
                }
                
                // Play appropriate sound based on profit/loss
                if (this.audioSystem) {
                    if (tradePL > 0) {
                        this.audioSystem.playSound('profit');
                    } else if (tradePL < 0) {
                        this.audioSystem.playSound('loss');
                    } else {
                        this.audioSystem.playSound('sell');
                    }
                }
            } else {
                // Play sell sound if no previous trade
                if (this.audioSystem) {
                    this.audioSystem.playSound('sell');
                }
            }
            
            // Trigger visual effect
            if (this.visualEffects) {
                this.visualEffects.triggerTradeEffect(this.canvas.width / 2, this.canvas.height / 2, 'sell');
            }
        } else {
            // No bitcoin to sell, just play a click sound
            if (this.audioSystem) {
                this.audioSystem.playSound('click');
            }
        }
        
        // Update UI immediately to show selling state
        this.updateTradingStatus();
    }

    /**
     * Calculate total portfolio value
     */
    calculatePortfolioValue() {
        const currentDataPoint = this.dataManager.bitcoinData[this.currentDateIndex];
        if (!currentDataPoint) return this.portfolio.cash;

        const bitcoinValue = this.portfolio.bitcoin * currentDataPoint.price;
        return this.portfolio.cash + bitcoinValue;
    }

    /**
     * Update UI elements
     */
    updateUI() {
        const currentDataPoint = this.dataManager.bitcoinData[this.currentDateIndex];
        if (!currentDataPoint) return;

        // Update date
        this.uiElements.currentDate.textContent = currentDataPoint.formattedDate;

        // Update price
        const formattedPrice = this.formatPrice(currentDataPoint.price);
        this.uiElements.currentPrice.textContent = formattedPrice;

        // Update portfolio value
        const totalValue = this.calculatePortfolioValue();
        this.portfolio.totalValue = totalValue;
        const formattedValue = this.formatCurrency(totalValue);
        this.uiElements.portfolioValue.textContent = formattedValue;

        // Update Bitcoin holdings
        const bitcoinFormatted = this.portfolio.bitcoin.toFixed(8);
        this.uiElements.bitcoinHoldings.textContent = bitcoinFormatted;

        // Update cash amount
        const cashFormatted = this.formatCurrency(this.portfolio.cash);
        this.uiElements.cashAmount.textContent = cashFormatted;

        // Update trading status
        this.updateTradingStatus();

        // Update profit/loss
        this.updateProfitLoss();
        
        // Update session statistics
        this.updateSessionStats();
        
        // Update timer display
        this.updateTimerDisplay();
    }

    /**
     * Update trading status display
     */
    updateTradingStatus() {
        // Remove all trading state classes
        this.uiElements.tradingStatus.classList.remove('buying', 'selling', 'idle');
        this.uiElements.portfolioValue.classList.remove('buying', 'selling');
        this.uiElements.bitcoinHoldings.classList.remove('buying', 'selling');
        this.uiElements.cashAmount.classList.remove('buying', 'selling');
        this.canvas.classList.remove('buying', 'selling', 'paused');
        
        if (this.isPaused) {
            this.uiElements.tradingStatus.textContent = 'GAME PAUSED';
            this.uiElements.tradingStatus.classList.add('idle');
            this.canvas.classList.add('paused');
        } else if (this.isBuying) {
            this.uiElements.tradingStatus.textContent = 'BUYING BITCOIN...';
            this.uiElements.tradingStatus.classList.add('buying');
            this.canvas.classList.add('buying');
            
            // Apply buying state colors
            this.uiElements.portfolioValue.classList.add('buying');
            this.uiElements.bitcoinHoldings.classList.add('buying');
            this.uiElements.cashAmount.classList.add('buying');
        } else {
            this.uiElements.tradingStatus.textContent = 'READY TO TRADE';
            this.uiElements.tradingStatus.classList.add('idle');
            this.canvas.classList.add('selling');
            
            // Apply selling state colors (when not buying, we're ready to sell)
            this.uiElements.portfolioValue.classList.add('selling');
            this.uiElements.bitcoinHoldings.classList.add('selling');
            this.uiElements.cashAmount.classList.add('selling');
        }
    }

    /**
     * Update profit/loss display
     */
    updateProfitLoss() {
        const initialValue = 100000;
        const currentValue = this.calculatePortfolioValue();
        const profitLoss = currentValue - initialValue;
        const profitLossPercentage = (profitLoss / initialValue) * 100;

        // Format profit/loss value
        const formattedPL = this.formatCurrency(Math.abs(profitLoss));
        const sign = profitLoss >= 0 ? '+' : '-';
        this.uiElements.profitLossValue.textContent = `${sign}${formattedPL}`;

        // Format percentage
        const formattedPercentage = `(${sign}${profitLossPercentage.toFixed(2)}%)`;
        this.uiElements.profitLossPercentage.textContent = formattedPercentage;

        // Apply color classes
        if (profitLoss > 0) {
            this.uiElements.profitLossValue.className = 'value positive';
            this.uiElements.profitLossPercentage.className = 'percentage positive';
        } else if (profitLoss < 0) {
            this.uiElements.profitLossValue.className = 'value negative';
            this.uiElements.profitLossPercentage.className = 'percentage negative';
        } else {
            this.uiElements.profitLossValue.className = 'value';
            this.uiElements.profitLossPercentage.className = 'percentage';
        }
    }

    /**
     * Update session statistics
     */
    updateSessionStats() {
        if (this.gameStateManager) {
            const stats = this.gameStateManager.getSessionStats();
            
            // Update session time
            const sessionTime = Date.now() - this.sessionStartTime;
            const minutes = Math.floor(sessionTime / (1000 * 60));
            const seconds = Math.floor((sessionTime % (1000 * 60)) / 1000);
            this.uiElements.sessionTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Update total trades
            this.uiElements.totalTrades.textContent = stats.totalTrades;
            
            // Update win rate
            const winRate = stats.totalTrades > 0 ? (stats.winningTrades / stats.totalTrades) * 100 : 0;
            this.uiElements.winRate.textContent = `${winRate.toFixed(1)}%`;
            
            // Update best trade
            this.uiElements.bestTrade.textContent = this.formatCurrency(this.bestTrade);
        }
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / (1000 * 60));
        const seconds = Math.floor((this.timeRemaining % (1000 * 60)) / 1000);
        this.uiElements.timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update timer color based on remaining time
        this.uiElements.timeRemaining.classList.remove('warning', 'danger');
        
        if (this.timeRemaining <= 5000) { // 5 seconds or less
            this.uiElements.timeRemaining.classList.add('danger');
        } else if (this.timeRemaining <= 10000) { // 10 seconds or less
            this.uiElements.timeRemaining.classList.add('warning');
        }
    }

    /**
     * Render the chart
     */
    renderChart() {
        const visibleDataPoints = this.chartRenderer.getVisibleDataPoints(
            this.currentDateIndex, 
            this.chartRenderer.visibleDays
        );
        
        const currentDataPoint = this.dataManager.bitcoinData[this.currentDateIndex];
        this.chartRenderer.render(currentDataPoint, visibleDataPoints);
    }

    /**
     * Game over handler
     */
    gameOver() {
        console.log('Game Over!');
        this.isRunning = false;
        
        // Calculate final statistics
        const finalValue = this.calculatePortfolioValue();
        const initialValue = 100000;
        const profit = finalValue - initialValue;
        const profitPercentage = (profit / initialValue) * 100;
        
        console.log(`Final Portfolio Value: $${this.formatCurrency(finalValue)}`);
        console.log(`Profit/Loss: $${this.formatCurrency(profit)} (${profitPercentage.toFixed(2)}%)`);
        console.log(`Total Trades: ${this.tradeHistory.length}`);
        
        // End game session with game state manager
        if (this.gameStateManager) {
            this.gameStateManager.endGameSession(finalValue);
        }
    }

    /**
     * Format price for display
     */
    formatPrice(price) {
        if (price >= 1000) {
            return `$${(price / 1000).toFixed(1)}K`;
        } else if (price >= 1) {
            return `$${price.toFixed(2)}`;
        } else {
            return `$${price.toFixed(4)}`;
        }
    }

    /**
     * Format currency for display
     */
    formatCurrency(amount) {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        } else {
            return `$${amount.toFixed(0)}`;
        }
    }

    /**
     * Get current game state
     */
    getGameState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            currentDateIndex: this.currentDateIndex,
            portfolio: { ...this.portfolio },
            isBuying: this.isBuying,
            tradeHistory: [...this.tradeHistory]
        };
    }
} 