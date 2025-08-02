/**
 * Character System - Handles pixel art character sprite and animations
 */
class CharacterSystem {
    constructor(canvas, gameEngine) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameEngine = gameEngine;
        
        // Character state
        this.state = 'idle'; // idle, buying, selling, happy, sad
        this.x = 0;
        this.y = 0;
        this.width = 32;
        this.height = 32;
        this.scale = 2; // 2x scale for pixel art
        
        // Animation properties
        this.animationFrame = 0;
        this.animationSpeed = 0.05; // Faster animation (reduced from 0.1)
        this.animationTimer = 0;
        
        // Character sprites (8-bit pixel art)
        this.sprites = {
            idle: this.createIdleSprite(),
            buying: this.createBuyingSprite(),
            selling: this.createSellingSprite(),
            happy: this.createHappySprite(),
            sad: this.createSadSprite()
        };
        
        // Character positioning
        this.updatePosition();
    }

    /**
     * Create idle sprite (simple 8-bit character)
     */
    createIdleSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        // 8-bit character colors
        const colors = {
            skin: '#ffdbac',
            hair: '#8b4513',
            shirt: '#4169e1',
            pants: '#2f4f4f',
            shoes: '#000000',
            outline: '#000000'
        };
        
        // Draw character (simple 8-bit style)
        ctx.fillStyle = colors.outline;
        ctx.fillRect(0, 0, 16, 16);
        
        // Body
        ctx.fillStyle = colors.shirt;
        ctx.fillRect(4, 6, 8, 6);
        
        // Head
        ctx.fillStyle = colors.skin;
        ctx.fillRect(5, 2, 6, 4);
        
        // Hair
        ctx.fillStyle = colors.hair;
        ctx.fillRect(5, 1, 6, 2);
        
        // Arms
        ctx.fillStyle = colors.skin;
        ctx.fillRect(3, 7, 2, 3);
        ctx.fillRect(11, 7, 2, 3);
        
        // Legs
        ctx.fillStyle = colors.pants;
        ctx.fillRect(5, 12, 2, 3);
        ctx.fillRect(9, 12, 2, 3);
        
        // Shoes
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(4, 15, 3, 1);
        ctx.fillRect(9, 15, 3, 1);
        
        return canvas;
    }

    /**
     * Create buying sprite (character with raised arms)
     */
    createBuyingSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        const colors = {
            skin: '#ffdbac',
            hair: '#8b4513',
            shirt: '#4169e1',
            pants: '#2f4f4f',
            shoes: '#000000',
            outline: '#000000'
        };
        
        // Draw character with raised arms
        ctx.fillStyle = colors.outline;
        ctx.fillRect(0, 0, 16, 16);
        
        // Body
        ctx.fillStyle = colors.shirt;
        ctx.fillRect(4, 6, 8, 6);
        
        // Head
        ctx.fillStyle = colors.skin;
        ctx.fillRect(5, 2, 6, 4);
        
        // Hair
        ctx.fillStyle = colors.hair;
        ctx.fillRect(5, 1, 6, 2);
        
        // Raised arms
        ctx.fillStyle = colors.skin;
        ctx.fillRect(2, 4, 2, 4);
        ctx.fillRect(12, 4, 2, 4);
        
        // Legs
        ctx.fillStyle = colors.pants;
        ctx.fillRect(5, 12, 2, 3);
        ctx.fillRect(9, 12, 2, 3);
        
        // Shoes
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(4, 15, 3, 1);
        ctx.fillRect(9, 15, 3, 1);
        
        return canvas;
    }

    /**
     * Create selling sprite (character with money bag)
     */
    createSellingSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        const colors = {
            skin: '#ffdbac',
            hair: '#8b4513',
            shirt: '#4169e1',
            pants: '#2f4f4f',
            shoes: '#000000',
            outline: '#000000',
            money: '#ffd700'
        };
        
        // Draw character with money bag
        ctx.fillStyle = colors.outline;
        ctx.fillRect(0, 0, 16, 16);
        
        // Body
        ctx.fillStyle = colors.shirt;
        ctx.fillRect(4, 6, 8, 6);
        
        // Head
        ctx.fillStyle = colors.skin;
        ctx.fillRect(5, 2, 6, 4);
        
        // Hair
        ctx.fillStyle = colors.hair;
        ctx.fillRect(5, 1, 6, 2);
        
        // Arms holding money bag
        ctx.fillStyle = colors.skin;
        ctx.fillRect(3, 7, 2, 3);
        ctx.fillRect(11, 7, 2, 3);
        
        // Money bag
        ctx.fillStyle = colors.money;
        ctx.fillRect(6, 8, 4, 3);
        
        // Legs
        ctx.fillStyle = colors.pants;
        ctx.fillRect(5, 12, 2, 3);
        ctx.fillRect(9, 12, 2, 3);
        
        // Shoes
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(4, 15, 3, 1);
        ctx.fillRect(9, 15, 3, 1);
        
        return canvas;
    }

    /**
     * Create happy sprite (character with smile)
     */
    createHappySprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        const colors = {
            skin: '#ffdbac',
            hair: '#8b4513',
            shirt: '#4169e1',
            pants: '#2f4f4f',
            shoes: '#000000',
            outline: '#000000'
        };
        
        // Draw happy character
        ctx.fillStyle = colors.outline;
        ctx.fillRect(0, 0, 16, 16);
        
        // Body
        ctx.fillStyle = colors.shirt;
        ctx.fillRect(4, 6, 8, 6);
        
        // Head
        ctx.fillStyle = colors.skin;
        ctx.fillRect(5, 2, 6, 4);
        
        // Hair
        ctx.fillStyle = colors.hair;
        ctx.fillRect(5, 1, 6, 2);
        
        // Happy face (smile)
        ctx.fillStyle = colors.outline;
        ctx.fillRect(6, 4, 1, 1); // left eye
        ctx.fillRect(9, 4, 1, 1); // right eye
        ctx.fillRect(7, 5, 2, 1); // smile
        
        // Arms
        ctx.fillStyle = colors.skin;
        ctx.fillRect(3, 7, 2, 3);
        ctx.fillRect(11, 7, 2, 3);
        
        // Legs
        ctx.fillStyle = colors.pants;
        ctx.fillRect(5, 12, 2, 3);
        ctx.fillRect(9, 12, 2, 3);
        
        // Shoes
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(4, 15, 3, 1);
        ctx.fillRect(9, 15, 3, 1);
        
        return canvas;
    }

    /**
     * Create sad sprite (character with frown)
     */
    createSadSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        
        const colors = {
            skin: '#ffdbac',
            hair: '#8b4513',
            shirt: '#4169e1',
            pants: '#2f4f4f',
            shoes: '#000000',
            outline: '#000000'
        };
        
        // Draw sad character
        ctx.fillStyle = colors.outline;
        ctx.fillRect(0, 0, 16, 16);
        
        // Body
        ctx.fillStyle = colors.shirt;
        ctx.fillRect(4, 6, 8, 6);
        
        // Head
        ctx.fillStyle = colors.skin;
        ctx.fillRect(5, 2, 6, 4);
        
        // Hair
        ctx.fillStyle = colors.hair;
        ctx.fillRect(5, 1, 6, 2);
        
        // Sad face (frown)
        ctx.fillStyle = colors.outline;
        ctx.fillRect(6, 4, 1, 1); // left eye
        ctx.fillRect(9, 4, 1, 1); // right eye
        ctx.fillRect(7, 6, 2, 1); // frown
        
        // Arms
        ctx.fillStyle = colors.skin;
        ctx.fillRect(3, 7, 2, 3);
        ctx.fillRect(11, 7, 2, 3);
        
        // Legs
        ctx.fillStyle = colors.pants;
        ctx.fillRect(5, 12, 2, 3);
        ctx.fillRect(9, 12, 2, 3);
        
        // Shoes
        ctx.fillStyle = colors.shoes;
        ctx.fillRect(4, 15, 3, 1);
        ctx.fillRect(9, 15, 3, 1);
        
        return canvas;
    }

    /**
     * Update character position based on canvas size
     */
    updatePosition() {
        // Position character in bottom-left area of the chart
        this.x = 100;
        this.y = this.canvas.height - 120;
    }

    /**
     * Update character state based on game state
     */
    updateState() {
        const gameState = this.gameEngine.getGameState();
        
        if (gameState.isPaused) {
            this.state = 'idle';
        } else if (gameState.isBuying) {
            this.state = 'buying';
        } else if (gameState.tradeHistory.length > 0) {
            // Check if last trade was profitable
            const lastTrade = gameState.tradeHistory[gameState.tradeHistory.length - 1];
            const portfolio = gameState.portfolio;
            
            if (portfolio.totalValue > 100000) {
                this.state = 'happy';
            } else {
                this.state = 'sad';
            }
        } else {
            this.state = 'idle';
        }
    }

    /**
     * Update animation
     */
    update(deltaTime) {
        this.animationTimer += deltaTime;
        
        if (this.animationTimer >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % 4; // 4-frame animation cycle
            this.animationTimer = 0;
        }
        
        this.updateState();
    }

    /**
     * Render the character
     */
    render() {
        const sprite = this.sprites[this.state];
        if (!sprite) return;
        
        // Save context for transformations
        this.ctx.save();
        
        // Set pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        
        // Apply scale and position
        this.ctx.translate(this.x, this.y);
        this.ctx.scale(this.scale, this.scale);
        
        // Add enhanced animations based on state
        if (this.state === 'idle') {
            const bobOffset = Math.sin(this.animationFrame * 0.5) * 0.5;
            this.ctx.translate(0, bobOffset);
        } else if (this.state === 'buying') {
            // Add buying animation - slight bounce
            const bounceOffset = Math.sin(this.animationFrame * 2) * 1;
            this.ctx.translate(0, bounceOffset);
        } else if (this.state === 'selling') {
            // Add selling animation - money bag shake
            const shakeOffset = Math.sin(this.animationFrame * 3) * 0.5;
            this.ctx.translate(shakeOffset, 0);
        } else if (this.state === 'happy') {
            // Add happy animation - bigger bounce
            const happyOffset = Math.sin(this.animationFrame * 1.5) * 1.5;
            this.ctx.translate(0, happyOffset);
        } else if (this.state === 'sad') {
            // Add sad animation - slight droop
            const sadOffset = Math.sin(this.animationFrame * 0.3) * 0.3;
            this.ctx.translate(0, sadOffset);
        }
        
        // Draw the sprite
        this.ctx.drawImage(sprite, 0, 0);
        
        // Restore context
        this.ctx.restore();
        
        // Draw character name/label
        this.drawCharacterLabel();
    }

    /**
     * Draw character label
     */
    drawCharacterLabel() {
        this.ctx.save();
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 2;
        
        const labelY = this.y - 20;
        this.ctx.fillText('CRYPTO BOY', this.x + (this.width * this.scale) / 2, labelY);
        
        this.ctx.restore();
    }

    /**
     * Get character bounds for interaction
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width * this.scale,
            height: this.height * this.scale
        };
    }
} 