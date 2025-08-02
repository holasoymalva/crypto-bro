/**
 * Main entry point for Crypto Boy game
 */
class CryptoBoyGame {
    constructor() {
        this.canvas = null;
        this.dataManager = null;
        this.chartRenderer = null;
        this.gameEngine = null;
        this.gameStateManager = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the game
     */
    async initialize() {
        console.log('🚀 Initializing Crypto Boy...');
        
        try {
            // Initialize game state manager first
            this.gameStateManager = new GameStateManager();
            this.gameStateManager.initialize();
            gameStateManager = this.gameStateManager; // Set global reference
            
            // Get canvas element
            this.canvas = document.getElementById('gameCanvas');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }

            // Initialize components
            this.dataManager = new DataManager();
            this.chartRenderer = new ChartRenderer(this.canvas, this.dataManager);
            this.gameEngine = new GameEngine(this.canvas, this.dataManager, this.chartRenderer);
            
            // Connect game state manager to game engine
            this.gameEngine.gameStateManager = this.gameStateManager;

            // Wait for all components to initialize
            await this.gameEngine.initialize();
            
            // Check if we have data
            if (this.dataManager.bitcoinData.length === 0) {
                throw new Error('No Bitcoin data available');
            }
            
            this.isInitialized = true;
            console.log('✅ Crypto Boy initialized successfully!');
            
            // Add loading screen removal
            this.removeLoadingScreen();
            
            // Add keyboard controls info
            this.addControlsInfo();
            
        } catch (error) {
            console.error('❌ Failed to initialize Crypto Boy:', error);
            this.showErrorMessage(`Failed to load game: ${error.message}. The game will use sample data instead.`);
        }
    }

    /**
     * Remove loading screen if it exists
     */
    removeLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.remove();
        }
    }

    /**
     * Add controls information
     */
    addControlsInfo() {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'controls-info';
        controlsDiv.innerHTML = `
            <p>SPACE: Buy/Sell | P: Pause | R: Restart | +/-: Speed</p>
        `;
        controlsDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
            color: #00ff00;
            text-shadow: 2px 2px 0px #000000;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border: 1px solid #00ff00;
            z-index: 1000;
        `;
        document.body.appendChild(controlsDiv);
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <h2>Error Loading Game</h2>
            <p>${message}</p>
            <button onclick="location.reload()">Retry</button>
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000000;
            color: #ff0000;
            padding: 20px;
            border: 2px solid #ff0000;
            font-family: 'Press Start 2P', monospace;
            text-align: center;
            z-index: 1000;
        `;
        document.body.appendChild(errorDiv);
    }

    /**
     * Get game instance
     */
    getGameEngine() {
        return this.gameEngine;
    }

    /**
     * Get data manager
     */
    getDataManager() {
        return this.dataManager;
    }

    /**
     * Get chart renderer
     */
    getChartRenderer() {
        return this.chartRenderer;
    }
}

// Global game instance
let cryptoBoyGame;
let gameStateManager; // Global reference for modal buttons

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 Crypto Boy - 8-Bit Bitcoin Trading Game');
    console.log('📊 Loading historical Bitcoin data...');
    
    try {
        // Initialize the game
        cryptoBoyGame = new CryptoBoyGame();
        await cryptoBoyGame.initialize();
        
    } catch (error) {
        console.error('Failed to start game:', error);
    }
});

// Export for debugging
window.cryptoBoyGame = cryptoBoyGame; 