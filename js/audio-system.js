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
     * Create buy sound (ascending tone with success feel)
     */
    createBuySound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const startTime = this.audioContext.currentTime;
            
            // Create main buy sound (ascending arpeggio)
            const buyNotes = [300, 400, 500, 600];
            buyNotes.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(frequency, startTime + index * 0.05);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.08, startTime + index * 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.05 + 0.08);
                
                oscillator.start(startTime + index * 0.05);
                oscillator.stop(startTime + index * 0.05 + 0.08);
            });
            
            // Add a success chime
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }, 200);
        };
    }

    /**
     * Create sell sound (descending tone with cash register feel)
     */
    createSellSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const startTime = this.audioContext.currentTime;
            
            // Create main sell sound (descending arpeggio)
            const sellNotes = [600, 500, 400, 300];
            sellNotes.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(frequency, startTime + index * 0.05);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.08, startTime + index * 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.05 + 0.08);
                
                oscillator.start(startTime + index * 0.05);
                oscillator.stop(startTime + index * 0.05 + 0.08);
            });
            
            // Add cash register "ding" sound
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.06, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }, 200);
        };
    }

    /**
     * Create profit sound (happy ascending arpeggio with celebration)
     */
    createProfitSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const startTime = this.audioContext.currentTime;
            
            // Create happy ascending arpeggio
            const profitNotes = [262, 330, 392, 523, 659, 784]; // C major scale
            profitNotes.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(frequency, startTime + index * 0.08);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.06, startTime + index * 0.08);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.08 + 0.1);
                
                oscillator.start(startTime + index * 0.08);
                oscillator.stop(startTime + index * 0.08 + 0.1);
            });
            
            // Add celebration chime
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(1047, this.audioContext.currentTime); // High C
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.2);
            }, 480);
        };
    }

    /**
     * Create loss sound (sad descending tone with warning)
     */
    createLossSound() {
        return () => {
            if (!this.isEnabled || !this.audioContext) return;
            
            const startTime = this.audioContext.currentTime;
            
            // Create sad descending arpeggio
            const lossNotes = [523, 466, 415, 370, 330, 294]; // Descending minor scale
            lossNotes.forEach((frequency, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(frequency, startTime + index * 0.1);
                oscillator.type = 'sawtooth'; // More aggressive sound for loss
                
                gainNode.gain.setValueAtTime(0.05, startTime + index * 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.1 + 0.12);
                
                oscillator.start(startTime + index * 0.1);
                oscillator.stop(startTime + index * 0.1 + 0.12);
            });
            
            // Add warning tone
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime + 0.05);
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime + 0.1);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.15);
            }, 600);
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
        
        // Create a more dynamic 8-bit background music system
        this.music = {
            bassOscillator: this.audioContext.createOscillator(),
            melodyOscillator: this.audioContext.createOscillator(),
            harmonyOscillator: this.audioContext.createOscillator(),
            bassGain: this.audioContext.createGain(),
            melodyGain: this.audioContext.createGain(),
            harmonyGain: this.audioContext.createGain(),
            isPlaying: false,
            currentPattern: 0
        };
        
        // Connect oscillators to their gain nodes
        this.music.bassOscillator.connect(this.music.bassGain);
        this.music.melodyOscillator.connect(this.music.melodyGain);
        this.music.harmonyOscillator.connect(this.music.harmonyGain);
        
        // Connect gain nodes to master
        this.music.bassGain.connect(this.masterGain);
        this.music.melodyGain.connect(this.masterGain);
        this.music.harmonyGain.connect(this.masterGain);
        
        // Set initial volumes
        this.music.bassGain.gain.value = 0.03;
        this.music.melodyGain.gain.value = 0.02;
        this.music.harmonyGain.gain.value = 0.015;
        
        // Set oscillator types for 8-bit sound
        this.music.bassOscillator.type = 'square';
        this.music.melodyOscillator.type = 'square';
        this.music.harmonyOscillator.type = 'triangle';
        
        // Start oscillators
        this.music.bassOscillator.start(this.audioContext.currentTime);
        this.music.melodyOscillator.start(this.audioContext.currentTime);
        this.music.harmonyOscillator.start(this.audioContext.currentTime);
        
        this.music.isPlaying = true;
        
        // Create dynamic music patterns
        this.createDynamicMusicLoop();
    }

    /**
     * Create dynamic background music loop with multiple patterns
     */
    createDynamicMusicLoop() {
        if (!this.music || !this.music.isPlaying) return;
        
        const patterns = [
            // Pattern 0: Upbeat trading theme
            {
                bass: [110, 110, 146, 146, 110, 110, 146, 146],
                melody: [220, 262, 330, 392, 330, 262, 220, 196],
                harmony: [330, 392, 440, 523, 440, 392, 330, 293],
                duration: 0.2
            },
            // Pattern 1: Intense trading
            {
                bass: [146, 146, 174, 174, 146, 146, 174, 174],
                melody: [262, 330, 392, 523, 392, 330, 262, 220],
                harmony: [392, 440, 523, 659, 523, 440, 392, 330],
                duration: 0.15
            },
            // Pattern 2: Calm period
            {
                bass: [110, 110, 130, 130, 110, 110, 130, 130],
                melody: [196, 220, 262, 330, 262, 220, 196, 174],
                harmony: [330, 392, 440, 523, 440, 392, 330, 293],
                duration: 0.25
            },
            // Pattern 3: Bull run
            {
                bass: [174, 174, 196, 196, 174, 174, 196, 196],
                melody: [330, 392, 440, 523, 659, 523, 440, 392],
                harmony: [440, 523, 659, 784, 659, 523, 440, 392],
                duration: 0.12
            }
        ];
        
        const currentPattern = patterns[this.music.currentPattern];
        const startTime = this.audioContext.currentTime;
        
        // Play bass line
        currentPattern.bass.forEach((frequency, index) => {
            this.music.bassOscillator.frequency.setValueAtTime(
                frequency, 
                startTime + index * currentPattern.duration
            );
        });
        
        // Play melody line
        currentPattern.melody.forEach((frequency, index) => {
            this.music.melodyOscillator.frequency.setValueAtTime(
                frequency, 
                startTime + index * currentPattern.duration
            );
        });
        
        // Play harmony line
        currentPattern.harmony.forEach((frequency, index) => {
            this.music.harmonyOscillator.frequency.setValueAtTime(
                frequency, 
                startTime + index * currentPattern.duration
            );
        });
        
        // Change pattern every few cycles for variety
        const patternDuration = currentPattern.bass.length * currentPattern.duration;
        const cyclesBeforeChange = 4; // Change pattern every 4 cycles
        
        setTimeout(() => {
            if (this.music && this.music.isPlaying) {
                // Randomly change pattern or continue with next
                if (Math.random() < 0.3) { // 30% chance to change pattern
                    this.music.currentPattern = (this.music.currentPattern + 1) % patterns.length;
                }
                this.createDynamicMusicLoop();
            }
        }, patternDuration * cyclesBeforeChange * 1000);
    }

    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.music && this.music.isPlaying) {
            this.music.isPlaying = false;
            this.music.bassOscillator.stop();
            this.music.melodyOscillator.stop();
            this.music.harmonyOscillator.stop();
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