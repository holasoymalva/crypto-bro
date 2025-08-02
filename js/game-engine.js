/**
 * Game Engine - Handles game state, time progression, and UI updates
 */
class GameEngine {
    constructor(canvas, dataManager, chartRenderer) {
        this.canvas = canvas;
        this.dataManager = dataManager;
        this.chartRenderer = chartRenderer;
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.gameSpeed = 1; // days per second
        this.currentDateIndex = 0;
        this.startDateIndex = 0;
        this.endDateIndex = 0;
        
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
        
        // UI elements
        this.uiElements = {
            currentDate: document.getElementById('current-date'),
            currentPrice: document.getElementById('current-price'),
            portfolioValue: document.getElementById('portfolio-value')
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
                this.startBuying();
            }
        });

        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) { // Left mouse button
                this.stopBuying();
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
                    if (!this.isBuying) {
                        this.startBuying();
                    }
                    break;
                case 'KeyR':
                    e.preventDefault();
                    this.restart();
                    break;
                case 'KeyP':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });

        // Keyboard events for selling
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.isBuying) {
                    this.stopBuying();
                }
            }
        });
    }

    /**
     * Start the game loop
     */
    start() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
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

        // Update game state based on time progression
        const daysToAdvance = this.accumulatedTime * this.gameSpeed;
        if (daysToAdvance >= 1) {
            this.advanceTime(Math.floor(daysToAdvance));
            this.accumulatedTime -= Math.floor(daysToAdvance);
        }

        // Update trading logic
        this.updateTrading();

        // Update UI
        this.updateUI();

        // Render chart
        this.renderChart();
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
            
            console.log(`Bought ${bitcoinToBuy.toFixed(8)} BTC at $${currentPrice.toFixed(2)}`);
        }
    }

    /**
     * Start buying Bitcoin
     */
    startBuying() {
        if (this.isPaused) return;
        
        this.isBuying = true;
        console.log('Started buying Bitcoin...');
    }

    /**
     * Stop buying and sell all Bitcoin
     */
    stopBuying() {
        if (!this.isBuying) return;
        
        this.isBuying = false;
        
        const currentDataPoint = this.dataManager.bitcoinData[this.currentDateIndex];
        if (!currentDataPoint) return;

        const currentPrice = currentDataPoint.price;
        
        if (this.portfolio.bitcoin > 0) {
            const cashFromSale = this.portfolio.bitcoin * currentPrice;
            this.portfolio.cash = cashFromSale;
            
            // Record trade
            this.tradeHistory.push({
                date: currentDataPoint.date,
                action: 'sell',
                price: currentPrice,
                bitcoin: this.portfolio.bitcoin,
                value: cashFromSale
            });
            
            this.portfolio.bitcoin = 0;
            
            console.log(`Sold ${this.portfolio.bitcoin.toFixed(8)} BTC at $${currentPrice.toFixed(2)} for $${cashFromSale.toFixed(2)}`);
        }
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