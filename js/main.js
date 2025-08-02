/**
 * Main entry point for Crypto Boy game
 */
class CryptoBoyGame {
    constructor() {
        this.canvas = null;
        this.dataManager = null;
        this.chartRenderer = null;
        this.gameEngine = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the game
     */
    async initialize() {
        console.log('🚀 Initializing Crypto Boy...');
        
        try {
            // Get canvas element
            this.canvas = document.getElementById('gameCanvas');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }

            // Initialize components
            this.dataManager = new DataManager();
            this.chartRenderer = new ChartRenderer(this.canvas, this.dataManager);
            this.gameEngine = new GameEngine(this.canvas, this.dataManager, this.chartRenderer);

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
            <p>SPACE: Buy/Sell | P: Pause | R: Restart</p>
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

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎮 Crypto Boy - 8-Bit Bitcoin Trading Game');
    console.log('📊 Loading historical Bitcoin data...');
    
    // Create loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0f0f23;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Press Start 2P', monospace;
            color: #00ff00;
        ">
            <h1 style="margin-bottom: 20px; text-shadow: 2px 2px 0px #000000;">CRYPTO BOY</h1>
            <p style="margin-bottom: 10px; text-shadow: 2px 2px 0px #000000;">Loading Bitcoin data...</p>
            <div style="
                width: 200px;
                height: 4px;
                background: #333333;
                border: 1px solid #00ff00;
                overflow: hidden;
            ">
                <div id="loading-bar" style="
                    width: 0%;
                    height: 100%;
                    background: #00ff00;
                    transition: width 0.3s ease;
                "></div>
            </div>
        </div>
    `;
    document.body.appendChild(loadingScreen);

    // Simulate loading progress
    const loadingBar = document.getElementById('loading-bar');
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 90) progress = 90;
        loadingBar.style.width = progress + '%';
    }, 200);

    try {
        // Initialize the game
        cryptoBoyGame = new CryptoBoyGame();
        await cryptoBoyGame.initialize();
        
        // Complete loading
        clearInterval(progressInterval);
        loadingBar.style.width = '100%';
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 500);
        
    } catch (error) {
        console.error('Failed to start game:', error);
        clearInterval(progressInterval);
        loadingScreen.remove();
    }
});

// Export for debugging
window.cryptoBoyGame = cryptoBoyGame; 