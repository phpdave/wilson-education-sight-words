// Sight Words Game - Audio System
// Handles text-to-speech functionality using Web Speech API

class AudioController {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.utterance = null;
        this.isSupported = 'speechSynthesis' in window;
        this.voice = null;
        this.rate = 0.8; // Slower rate for children
        this.pitch = 1.0;
        this.volume = 1.0;
        
        this.initializeVoice();
    }

    initializeVoice() {
        if (!this.isSupported) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Wait for voices to load
        const loadVoices = () => {
            const voices = this.synthesis.getVoices();
            
            // Load saved voice preference
            const savedVoice = localStorage.getItem('sight-words-game-voice');
            if (savedVoice) {
                this.voice = voices.find(voice => voice.name === savedVoice);
            }
            
            // If no saved preference or saved voice not found, use default selection
            if (!this.voice) {
                this.selectDefaultVoice(voices);
            }
        };

        if (this.synthesis.getVoices().length > 0) {
            loadVoices();
        } else {
            this.synthesis.addEventListener('voiceschanged', loadVoices);
        }
    }


    isRoboticVoice(voice) {
        const roboticKeywords = [
            'robotic', 'synthetic', 'artificial', 'computer', 'system',
            'machine', 'automated', 'generated', 'tts', 'text-to-speech',
            'espeak', 'festival', 'pico', 'svox', 'ivona'
        ];
        
        const soundEffectKeywords = [
            'bahh', 'bells', 'boing', 'bubbles', 'whisper', 'echo',
            'deranged', 'hysterical', 'princess', 'trinoids', 'veena',
            'albert', 'alex', 'bruce', 'fred', 'junior', 'ralph',
            'victoria', 'cellos', 'good', 'bad', 'zarvox'
        ];
        
        const voiceName = voice.name.toLowerCase();
        
        // Check for robotic keywords
        const isRobotic = roboticKeywords.some(keyword => voiceName.includes(keyword));
        
        // Check for sound effect keywords
        const isSoundEffect = soundEffectKeywords.some(keyword => voiceName.includes(keyword));
        
        return isRobotic || isSoundEffect;
    }

    formatVoiceName(voice) {
        // Clean up voice names for better display
        let name = voice.name;
        
        // Remove common prefixes/suffixes
        name = name.replace(/Microsoft\s+/i, '');
        name = name.replace(/Google\s+/i, '');
        name = name.replace(/\s+Desktop/i, '');
        name = name.replace(/\s+Enhanced/i, '');
        name = name.replace(/\s+Neural/i, '');
        
        // Add helpful indicators
        if (voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman')) {
            name += ' 👩';
        } else if (voice.name.toLowerCase().includes('male') || 
                   voice.name.toLowerCase().includes('man')) {
            name += ' 👨';
        }
        
        // Add language indicator
        if (voice.lang.includes('US')) {
            name += ' 🇺🇸';
        } else if (voice.lang.includes('UK')) {
            name += ' 🇬🇧';
        } else if (voice.lang.includes('AU')) {
            name += ' 🇦🇺';
        }
        
        return name;
    }

    selectDefaultVoice(voices) {
        // Filter out robotic voices first
        const naturalVoices = voices.filter(voice => 
            voice.lang.startsWith('en') && 
            voice.name &&
            !this.isRoboticVoice(voice)
        );
        
        // Detect device type for specific voice selection
        const isIPhone = /iPhone/.test(navigator.userAgent);
        const isIPad = /iPad/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        let preferredVoices;
        
        if (isIPhone && isSafari) {
            // iPhone Safari - prioritize the smoothest, most natural voices
            preferredVoices = [
                'Samantha',                    // Usually the smoothest iOS voice
                'Karen',                       // Very natural alternative
                'Moira',                       // Irish accent - often clearer
                'Tessa',                       // South African accent - often clearer
                'Daniel',                      // Sometimes available and natural
                'Google US English Female',    // Fallback to Google if available
                'Google UK English Female'     // UK alternative
            ];
        } else if (isIPad) {
            // iPad - use similar to iPhone but with more options
            preferredVoices = [
                'Samantha',
                'Karen', 
                'Moira',
                'Tessa',
                'Google US English Female',
                'Google UK English Female',
                'Microsoft Zira Desktop',
                'Microsoft Hazel Desktop'
            ];
        } else {
            // Desktop/Android - use original priority
            preferredVoices = [
                'Google US English',           // Primary preference
                'Google US English Female',    // Alternative Google US
                'Google UK English Female',     // UK alternative
                'Microsoft Zira Desktop',      // Windows alternative
                'Microsoft Hazel Desktop',     // Windows alternative
                'Microsoft Susan Desktop',     // Windows alternative
                'Samantha',                    // iOS natural voice
                'Karen',                       // iOS alternative
                'Moira',                       // iOS Irish accent
                'Tessa'                        // iOS South African accent
            ];
        }
        
        // Try to find voices in priority order
        for (const preferredVoice of preferredVoices) {
            this.voice = naturalVoices.find(voice => 
                voice.name.toLowerCase().includes(preferredVoice.toLowerCase())
            );
            if (this.voice) break;
        }
        
        // If no preferred voice found, find the best available natural voice
        if (!this.voice && naturalVoices.length > 0) {
            if (isIPhone) {
                // For iPhone, prioritize voices that are known to be smoother
                this.voice = naturalVoices.find(voice => 
                    voice.name.toLowerCase().includes('samantha') ||
                    voice.name.toLowerCase().includes('karen') ||
                    voice.name.toLowerCase().includes('moira') ||
                    voice.name.toLowerCase().includes('tessa')
                ) || naturalVoices.find(voice => 
                    voice.name.toLowerCase().includes('female')
                ) || naturalVoices[0];
            } else {
                // For other devices, use general prioritization
                this.voice = naturalVoices.find(voice => 
                    voice.name.toLowerCase().includes('female') && 
                    voice.lang.includes('US')
                ) || naturalVoices.find(voice => 
                    voice.name.toLowerCase().includes('female')
                ) || naturalVoices.find(voice => 
                    voice.lang.includes('US')
                ) || naturalVoices[0];
            }
        }
        
        // Final fallback to any English voice
        if (!this.voice) {
            this.voice = voices.find(voice => 
                voice.lang.startsWith('en') && voice.default
            ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        }
        
        // Save the default selection
        if (this.voice) {
            localStorage.setItem('sight-words-game-voice', this.voice.name);
        }
        
        // Log the selected voice for debugging
        console.log('Selected voice for', isIPhone ? 'iPhone Safari' : isIPad ? 'iPad' : 'Desktop/Android', ':', this.voice?.name);
    }

    speak(text, options = {}) {
        if (!this.isSupported) {
            console.warn('Speech synthesis not supported');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            // Cancel any ongoing speech
            this.stop();
            
            this.utterance = new SpeechSynthesisUtterance(text);
            
            // Configure voice settings
            if (this.voice) {
                this.utterance.voice = this.voice;
            }
            
            this.utterance.rate = options.rate || this.rate;
            this.utterance.pitch = options.pitch || this.pitch;
            this.utterance.volume = options.volume || this.volume;
            this.utterance.lang = 'en-US';
            
            // Event handlers
            this.utterance.onstart = () => {
                console.log('Speech started');
            };
            
            this.utterance.onend = () => {
                console.log('Speech ended');
                resolve();
            };
            
            this.utterance.onerror = (event) => {
                console.error('Speech error:', event.error);
                reject(event.error);
            };
            
            // Speak the text
            this.synthesis.speak(this.utterance);
        });
    }

    speakWord(word) {
        return this.speak(word, {
            rate: 0.7, // Even slower for individual words
            pitch: 1.1 // Slightly higher pitch for clarity
        });
    }

    speakPhrase(phrase) {
        return this.speak(phrase, {
            rate: 0.8,
            pitch: 1.0
        });
    }

    speakEncouragement() {
        const encouragements = [
            "Great job!",
            "Excellent!",
            "Well done!",
            "Perfect!",
            "Amazing!",
            "Fantastic!",
            "Great!",
            "Keep it up!",
            "Wonderful!",
            "Outstanding!",
            // New additions:
            "So Good!",
            "Awesome!",
            "Correct!",
            "Nice job!",
            "You got it!",
          ];
          
        
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        return this.speak(randomEncouragement, {
            rate: 0.9,
            pitch: 1.2,
            volume: 0.9
        });
    }

    speakCorrection(correctWord, userWord = null, context = 'typed') {
        const corrections = [
            `The correct spelling is ${correctWord}`,
            `Try again. The word is ${correctWord}`,
            `Not quite. It's spelled ${correctWord}`,
            `The word is ${correctWord}`
        ];
        
        const randomCorrection = corrections[Math.floor(Math.random() * corrections.length)];
        return this.speak(randomCorrection, {
            rate: 0.8,
            pitch: 1.0,
            volume: 0.8
        }).then(() => {
            // Spell out the word letter by letter
            return this.spellWord(correctWord);
        }).then(() => {
            // If user provided a word, pronounce what they did
            if (userWord && userWord.trim() !== '') {
                const actionText = context === 'selected' ? 'selected' : 
                                 context === 'arranged' ? 'arranged' : 'typed';
                
                return this.speak(`You ${actionText} ${userWord}`, {
                    rate: 0.8,
                    pitch: 1.0,
                    volume: 0.8
                });
            }
        });
    }

    spellWord(word) {
        const letters = word.split('');
        let currentIndex = 0;
        
        // Create visual letter display
        this.createLetterDisplay(word);
        
        const spellNextLetter = () => {
            if (currentIndex < letters.length) {
                // Highlight current letter
                this.highlightLetter(currentIndex);
                
                return this.speak(letters[currentIndex], {
                    rate: 0.6,
                    pitch: 1.2,
                    volume: 0.9
                }).then(() => {
                    // Remove highlight
                    this.removeLetterHighlight(currentIndex);
                    currentIndex++;
                    return new Promise(resolve => setTimeout(resolve, 200)); // Small pause between letters
                }).then(() => {
                    return spellNextLetter();
                });
            } else {
                // Say the complete word at the end
                return this.speakWord(word).then(() => {
                    // Clean up letter display
                    this.removeLetterDisplay();
                });
            }
        };
        
        return spellNextLetter();
    }

    createLetterDisplay(word) {
        // Remove any existing letter display
        this.removeLetterDisplay();
        
        const letters = word.split('');
        const letterContainer = document.createElement('div');
        letterContainer.id = 'letter-spelling-display';
        letterContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            gap: 10px;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 3px solid #4ecdc4;
        `;
        
        letters.forEach((letter, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = letter.toUpperCase();
            letterSpan.dataset.index = index;
            letterSpan.style.cssText = `
                font-size: 2.5em;
                font-weight: bold;
                color: #2d3748;
                padding: 10px 15px;
                border-radius: 10px;
                background: #f7fafc;
                border: 2px solid #e2e8f0;
                transition: all 0.3s ease;
                font-family: 'Comic Sans MS', 'Marker Felt', 'Bradley Hand', 'Chalkduster', 'Comic Neue', cursive, sans-serif;
            `;
            letterContainer.appendChild(letterSpan);
        });
        
        document.body.appendChild(letterContainer);
    }

    highlightLetter(index) {
        const letterSpan = document.querySelector(`#letter-spelling-display span[data-index="${index}"]`);
        if (letterSpan) {
            letterSpan.style.cssText = `
                font-size: 2.5em;
                font-weight: bold;
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                background: #4ecdc4;
                border: 2px solid #45b7d1;
                transition: all 0.3s ease;
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
                font-family: 'Comic Sans MS', 'Marker Felt', 'Bradley Hand', 'Chalkduster', 'Comic Neue', cursive, sans-serif;
            `;
        }
    }

    removeLetterHighlight(index) {
        const letterSpan = document.querySelector(`#letter-spelling-display span[data-index="${index}"]`);
        if (letterSpan) {
            letterSpan.style.cssText = `
                font-size: 2.5em;
                font-weight: bold;
                color: #2d3748;
                padding: 10px 15px;
                border-radius: 10px;
                background: #f7fafc;
                border: 2px solid #e2e8f0;
                transition: all 0.3s ease;
                transform: scale(1);
                font-family: 'Comic Sans MS', 'Marker Felt', 'Bradley Hand', 'Chalkduster', 'Comic Neue', cursive, sans-serif;
            `;
        }
    }

    removeLetterDisplay() {
        const existingDisplay = document.getElementById('letter-spelling-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
    }

    stop() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
    }

    pause() {
        if (this.synthesis.speaking) {
            this.synthesis.pause();
        }
    }

    resume() {
        if (this.synthesis.paused) {
            this.synthesis.resume();
        }
    }

    // Get available voices for debugging
    getVoices() {
        return this.synthesis.getVoices();
    }

    // Set voice preferences
    setVoice(voiceName) {
        const voices = this.synthesis.getVoices();
        this.voice = voices.find(voice => voice.name === voiceName) || this.voice;
    }

    // Adjust speech rate
    setRate(rate) {
        this.rate = Math.max(0.1, Math.min(2.0, rate));
    }

    // Adjust pitch
    setPitch(pitch) {
        this.pitch = Math.max(0.0, Math.min(2.0, pitch));
    }

    // Adjust volume
    setVolume(volume) {
        this.volume = Math.max(0.0, Math.min(1.0, volume));
    }

    // Check if currently speaking
    isSpeaking() {
        return this.synthesis.speaking;
    }

    // Check if currently paused
    isPaused() {
        return this.synthesis.paused;
    }

    // Test the currently selected voice
    testVoice() {
        const testText = "Hello! This is how I sound. I hope you like my voice!";
        return this.speak(testText, {
            rate: 0.8,
            pitch: 1.0,
            volume: 0.8
        });
    }

    // Get current voice info for display
    getCurrentVoiceInfo() {
        if (!this.voice) return 'No voice selected';
        return this.formatVoiceName(this.voice);
    }
}

// Create global audio controller instance
window.audioController = new AudioController();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioController;
}
