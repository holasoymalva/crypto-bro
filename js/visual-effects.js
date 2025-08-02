/**
 * Visual Effects System - Handles particles, screen shake, and enhanced graphics
 */
class VisualEffectsSystem {
    constructor(canvas, gameEngine) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameEngine = gameEngine;
        
        // Particle system
        this.particles = [];
        this.maxParticles = 30; // Reduced for better performance at higher speeds
        
        // Screen shake
        this.screenShake = {
            intensity: 0,
            duration: 0,
            offsetX: 0,
            offsetY: 0
        };
        
        // Background elements
        this.backgroundElements = [];
        this.createBackgroundElements();
        
        // Price movement effects
        this.priceEffects = [];
        
        // Chart enhancement
        this.chartEnhancements = {
            priceMarkers: [],
            trendLines: [],
            volumeBars: []
        };
    }

    /**
     * Create background elements for scene composition
     */
    createBackgroundElements() {
        // Add some floating 8-bit elements in the background
        for (let i = 0; i < 20; i++) {
            this.backgroundElements.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.3 + 0.1,
                type: Math.floor(Math.random() * 3) // 0: pixel, 1: line, 2: dot
            });
        }
    }

    /**
     * Add screen shake effect
     */
    addScreenShake(intensity = 5, duration = 0.15) { // Faster screen shake (halved duration)
        this.screenShake.intensity = intensity;
        this.screenShake.duration = duration;
    }

    /**
     * Update screen shake
     */
    updateScreenShake(deltaTime) {
        if (this.screenShake.duration > 0) {
            this.screenShake.duration -= deltaTime;
            this.screenShake.offsetX = (Math.random() - 0.5) * this.screenShake.intensity;
            this.screenShake.offsetY = (Math.random() - 0.5) * this.screenShake.intensity;
            
            if (this.screenShake.duration <= 0) {
                this.screenShake.intensity = 0;
                this.screenShake.offsetX = 0;
                this.screenShake.offsetY = 0;
            }
        }
    }

    /**
     * Create particle effect
     */
    createParticleEffect(x, y, type = 'trade') {
        const particleCount = type === 'trade' ? 8 : 4;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                maxLife: 1.0,
                size: Math.random() * 3 + 1,
                color: type === 'buy' ? '#00ff00' : type === 'sell' ? '#ff0000' : '#ffff00',
                type: type
            };
            
            this.particles.push(particle);
        }
        
        // Limit particles
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, this.particles.length - this.maxParticles);
        }
    }

    /**
     * Update particles
     */
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update life
            particle.life -= deltaTime * 4; // Faster particle decay (increased from 2)
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Render particles
     */
    renderParticles() {
        this.ctx.save();
        
        // Apply screen shake offset
        this.ctx.translate(this.screenShake.offsetX, this.screenShake.offsetY);
        
        for (const particle of this.particles) {
            const alpha = particle.life / particle.maxLife;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            
            // Draw particle based on type
            if (particle.type === 'buy') {
                // Green upward arrow
                this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            } else if (particle.type === 'sell') {
                // Red downward arrow
                this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            } else {
                // Yellow sparkle
                this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            }
        }
        
        this.ctx.restore();
    }

    /**
     * Render background elements
     */
    renderBackgroundElements() {
        this.ctx.save();
        
        // Apply screen shake offset
        this.ctx.translate(this.screenShake.offsetX, this.screenShake.offsetY);
        
        for (const element of this.backgroundElements) {
            this.ctx.globalAlpha = element.opacity;
            this.ctx.fillStyle = '#00ff00';
            
            if (element.type === 0) {
                // Pixel
                this.ctx.fillRect(element.x, element.y, element.size, element.size);
            } else if (element.type === 1) {
                // Line
                this.ctx.fillRect(element.x, element.y, element.size * 2, 1);
            } else {
                // Dot
                this.ctx.beginPath();
                this.ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.restore();
    }

    /**
     * Update background elements
     */
    updateBackgroundElements(deltaTime) {
        for (const element of this.backgroundElements) {
            element.y += element.speed * 2; // Faster background movement (doubled speed)
            
            // Wrap around screen
            if (element.y > this.canvas.height) {
                element.y = -element.size;
                element.x = Math.random() * this.canvas.width;
            }
        }
    }

    /**
     * Create price movement effect
     */
    createPriceMovementEffect(price, isUp) {
        const effect = {
            price: price,
            isUp: isUp,
            life: 1.0,
            maxLife: 2.0,
            x: this.canvas.width - 100,
            y: 50
        };
        
        this.priceEffects.push(effect);
    }

    /**
     * Update price effects
     */
    updatePriceEffects(deltaTime) {
        for (let i = this.priceEffects.length - 1; i >= 0; i--) {
            const effect = this.priceEffects[i];
            
            effect.life -= deltaTime;
            effect.y -= deltaTime * 40; // Faster upward movement (doubled speed)
            
            if (effect.life <= 0) {
                this.priceEffects.splice(i, 1);
            }
        }
    }

    /**
     * Render price effects
     */
    renderPriceEffects() {
        this.ctx.save();
        
        // Apply screen shake offset
        this.ctx.translate(this.screenShake.offsetX, this.screenShake.offsetY);
        
        for (const effect of this.priceEffects) {
            const alpha = effect.life / effect.maxLife;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = effect.isUp ? '#00ff00' : '#ff0000';
            this.ctx.font = '12px "Press Start 2P"';
            this.ctx.textAlign = 'right';
            
            const symbol = effect.isUp ? '↗' : '↘';
            this.ctx.fillText(`${symbol} $${effect.price.toFixed(2)}`, effect.x, effect.y);
        }
        
        this.ctx.restore();
    }

    /**
     * Add chart enhancement markers
     */
    addChartEnhancement(type, data) {
        if (type === 'priceMarker') {
            this.chartEnhancements.priceMarkers.push({
                ...data,
                life: 1.0,
                maxLife: 3.0
            });
        }
    }

    /**
     * Update chart enhancements
     */
    updateChartEnhancements(deltaTime) {
        // Update price markers
        for (let i = this.chartEnhancements.priceMarkers.length - 1; i >= 0; i--) {
            const marker = this.chartEnhancements.priceMarkers[i];
            marker.life -= deltaTime;
            
            if (marker.life <= 0) {
                this.chartEnhancements.priceMarkers.splice(i, 1);
            }
        }
    }

    /**
     * Render chart enhancements
     */
    renderChartEnhancements() {
        this.ctx.save();
        
        // Apply screen shake offset
        this.ctx.translate(this.screenShake.offsetX, this.screenShake.offsetY);
        
        // Render price markers
        for (const marker of this.chartEnhancements.priceMarkers) {
            const alpha = marker.life / marker.maxLife;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            
            this.ctx.beginPath();
            this.ctx.moveTo(marker.x, 0);
            this.ctx.lineTo(marker.x, this.canvas.height);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    /**
     * Update all visual effects
     */
    update(deltaTime) {
        this.updateScreenShake(deltaTime);
        this.updateParticles(deltaTime);
        this.updateBackgroundElements(deltaTime);
        this.updatePriceEffects(deltaTime);
        this.updateChartEnhancements(deltaTime);
    }

    /**
     * Render all visual effects
     */
    render() {
        this.renderBackgroundElements();
        this.renderParticles();
        this.renderPriceEffects();
        this.renderChartEnhancements();
    }

    /**
     * Trigger trade effect
     */
    triggerTradeEffect(x, y, type) {
        this.createParticleEffect(x, y, type);
        this.addScreenShake(3, 0.2);
    }

    /**
     * Trigger price movement effect
     */
    triggerPriceMovementEffect(price, isUp) {
        this.createPriceMovementEffect(price, isUp);
    }
} 