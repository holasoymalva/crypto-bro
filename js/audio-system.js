/**
 * Audio System - Handles 8-bit sound effects and retro background music
 */
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.sounds = {};
        this.music = null;
        this.isEnabled = true;
        this.volume = 0.3;
        
        this.initializeAudio();
    }

    /**
     * Initialize Web Audio API
     */
    async initializeAudio() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.volume;
            
            // Create sound effects
            this.createSoundEffects();
            
            console.log('🎵 Audio system initialized');
        } catch (error) {
            console.warn('Audio not supported:', error);
            this.isEnabled = false;
        }
    }

    /**
     * Create 8-bit sound effects
     */
    createSoundEffects() {
        this.sounds = {
            buy: this.createBuySound(),
            sell: this.createSellSound(),
            profit: this.createProfitSound(),
            loss: this.createLossSound(),
            click: this.createClickSound(),
            tick: this.createTickSound(),
            success: this.createSuccessSound(),
            error: this.createErrorSound()
        };
    }

    /**
     * Create buy sound (ascending tone)
     */
    createBuySound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    /**
     * Create sell sound (descending tone)
     */
    createSellSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    /**
     * Create profit sound (happy ascending arpeggio)
     */
    createProfitSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const notes = [262, 330, 392, 523]; // C, E, G, C
            const startTime = this.audioContext.currentTime;
            
            notes.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(frequency, startTime);
                gainNode.gain.setValueAtTime(0.05, startTime + index * 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.05 + 0.05);
                
                oscillator.start(startTime + index * 0.05);
                oscillator.stop(startTime + index * 0.05 + 0.05);
            });
        };
    }

    /**
     * Create loss sound (sad descending tone)
     */
    createLossSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        };
    }

    /**
     * Create click sound (short beep)
     */
    createClickSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.025);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.025);
        };
    }

    /**
     * Create tick sound (price update)
     */
    createTickSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.015);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.015);
        };
    }

    /**
     * Create success sound (victory fanfare)
     */
    createSuccessSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const notes = [523, 659, 784, 1047]; // C, E, G, C (higher octave)
            const startTime = this.audioContext.currentTime;
            
            notes.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(frequency, startTime);
                gainNode.gain.setValueAtTime(0.08, startTime + index * 0.075);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.075 + 0.075);
                
                oscillator.start(startTime + index * 0.075);
                oscillator.stop(startTime + index * 0.075 + 0.075);
            });
        };
    }

    /**
     * Create error sound (warning tone)
     */
    createErrorSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime + 0.05);
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        };
    }

    /**
     * Play a sound effect
     */
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    /**
     * Start background music (8-bit loop)
     */
    startBackgroundMusic() {
        if (!this.isEnabled || !this.audioContext) return;
        
        // Create a simple 8-bit background loop
        this.music = {
            oscillator: this.audioContext.createOscillator(),
            gainNode: this.audioContext.createGain(),
            isPlaying: false
        };
        
        this.music.oscillator.connect(this.music.gainNode);
        this.music.gainNode.connect(this.masterGain);
        
        this.music.gainNode.gain.value = 0.02; // Very quiet background
        this.music.oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        this.music.oscillator.type = 'square'; // 8-bit sound
        
        this.music.oscillator.start(this.audioContext.currentTime);
        this.music.isPlaying = true;
        
        // Create a simple melody loop
        this.createMusicLoop();
    }

    /**
     * Create background music loop
     */
    createMusicLoop() {
        if (!this.music || !this.music.isPlaying) return;
        
        const notes = [220, 262, 330, 392, 330, 262]; // Simple melody
        const startTime = this.audioContext.currentTime;
        const noteDuration = 0.25; // Faster music (halved duration)
        
        notes.forEach((frequency, index) => {
            this.music.oscillator.frequency.setValueAtTime(frequency, startTime + index * noteDuration);
        });
        
        // Loop the melody
        setTimeout(() => {
            if (this.music && this.music.isPlaying) {
                this.createMusicLoop();
            }
        }, notes.length * noteDuration * 1000);
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.music && this.music.isPlaying) {
            this.music.isPlaying = false;
            this.music.oscillator.stop();
        }
    }

    /**
     * Set master volume
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }

    /**
     * Toggle audio on/off
     */
    toggleAudio() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled && this.music) {
            this.stopBackgroundMusic();
        }
        return this.isEnabled;
    }

    /**
     * Resume audio context (needed for some browsers)
     */
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
} 