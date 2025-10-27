// Sight Words Game - High-Quality Audio System (Static Files with Speech Synthesis Fallback)
// Updated: Fixed missing speakWord method - v2.1

class AudioController {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.isSupported = 'speechSynthesis' in window;
        this.voice = null; // Still keep for fallback
        this.rate = 0.7;
        this.pitch = 1.05;
        this.volume = 1.0;

        this.isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent || '');
        this.isChrome = /Chrome|CriOS/.test(navigator.userAgent || '');
        this.isSafari = /Safari/.test(navigator.userAgent || '') && !/Chrome/.test(navigator.userAgent || '');

        this.audioCache = {}; // Cache for Audio objects
        this.currentAudio = null; // Currently playing Audio object
        this.audioUnlocked = false; // Track if audio context is unlocked
        this.pendingAudioQueue = []; // Queue for audio that needs to wait for unlock

        this.initializeVoice(); // Still initialize for fallback
        
        // For iOS Safari, delay preloading until after user interaction
        if (this.isIOS && this.isSafari) {
            console.log('iOS Safari detected - audio preloading delayed until user interaction');
        } else {
            this._preloadCommonAudio();
        }
    }

    // Call this once after any user tap/click on iOS Safari
    unlock() {
        if (!this.isSupported) return;
        
        // Mark audio as unlocked
        this.audioUnlocked = true;
        
        try {
            // Create a silent audio context unlock for iOS Safari
            const silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
            silentAudio.volume = 0;
            silentAudio.play().catch(() => {
                // Fallback to speech synthesis unlock
                const u = new SpeechSynthesisUtterance(' ');
                u.volume = 0; // silent nudge unlock
                this.synthesis.speak(u);
            });
            
            // Now preload common audio for iOS Safari
            if (this.isIOS && this.isSafari) {
                this._preloadCommonAudio();
            }
            
            // Process any pending audio queue
            this._processPendingAudioQueue();
            
        } catch (_) {
            // Fallback to speech synthesis unlock
            const u = new SpeechSynthesisUtterance(' ');
            u.volume = 0; // silent nudge unlock
            this.synthesis.speak(u);
        }
    }

    initializeVoice() {
        if (!this.isSupported) {
            console.warn('Speech synthesis not supported');
            return;
        }

        const loadVoices = () => {
            const voices = this.synthesis.getVoices() || [];
            if (!voices.length) {
                setTimeout(loadVoices, 100);
                return;
            }

            // Prefer woman's voices for children's learning
            const preferredVoices = [
                'Samantha', 'Karen', 'Susan', 'Victoria', 'Moira',
                'Fiona', 'Veena', 'Tessa', 'Amelie', 'Monica'
            ];

            // Find best available voice
            let bestVoice = voices.find(v => preferredVoices.includes(v.name));
            if (!bestVoice) {
                // Fallback to any woman's voice
                bestVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Woman'));
            }
            if (!bestVoice) {
                // Final fallback to first available voice
                bestVoice = voices[0];
            }

            this.voice = bestVoice;
            console.log(`Using voice: ${this.voice?.name || 'Default'}`);
        };

        loadVoices();
    }

    _preloadCommonAudio() {
        // Preload common words for faster playback
        const commonWords = ['her', 'who', 'some', 'out', 'about', 'too', 'two', 'were', 'what', 'come'];
        commonWords.forEach(word => {
            this._preloadAudio(`audio/words/${word}.mp3`);
            this._preloadAudio(`audio/sentences/${word}-story.mp3`);
        });
    }

    _preloadAudio(audioPath) {
        if (this.audioCache[audioPath]) return;
        
        const audio = new Audio();
        // For iOS Safari, don't preload until after user interaction
        if (this.isIOS && this.isSafari && !this.audioUnlocked) {
            console.log(`Deferring preload for iOS Safari: ${audioPath}`);
            return;
        }
        
        audio.preload = 'auto';
        audio.src = audioPath;
        this.audioCache[audioPath] = audio;
    }

    _processPendingAudioQueue() {
        // Process any audio that was queued while waiting for unlock
        while (this.pendingAudioQueue.length > 0) {
            const { audioPath, onEnd, resolve, reject } = this.pendingAudioQueue.shift();
            this._playStaticAudio(audioPath, onEnd).then(resolve).catch(reject);
        }
    }

    _playStaticAudio(audioPath, onEnd) {
        return new Promise((resolve, reject) => {
            // For iOS Safari, queue audio if not unlocked yet
            if (this.isIOS && this.isSafari && !this.audioUnlocked) {
                console.log(`Queuing audio for iOS Safari unlock: ${audioPath}`);
                this.pendingAudioQueue.push({ audioPath, onEnd, resolve, reject });
                return;
            }

            // Stop any currently playing audio
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            }

            let audio = this.audioCache[audioPath];
            
            if (!audio) {
                audio = new Audio(audioPath);
                this.audioCache[audioPath] = audio;
            }

            this.currentAudio = audio;

            const handleEnd = () => {
                audio.removeEventListener('ended', handleEnd);
                audio.removeEventListener('error', handleError);
                if (onEnd) onEnd();
                resolve();
            };

            const handleError = (error) => {
                audio.removeEventListener('ended', handleEnd);
                audio.removeEventListener('error', handleError);
                console.warn(`Failed to play static audio: ${audioPath}`, error);
                reject(error);
            };

            audio.addEventListener('ended', handleEnd);
            audio.addEventListener('error', handleError);

            // iOS requires user interaction to play audio
            if (this.isIOS && !this.audioUnlocked) {
                this.unlock();
            }

            audio.play().catch(error => {
                console.warn(`Audio play failed: ${audioPath}`, error);
                reject(error);
            });
        });
    }

    _playFallbackSpeech(text, onEnd) {
        if (!this.isSupported) {
            console.warn('Speech synthesis not supported');
            if (onEnd) onEnd();
            return;
        }

        // Stop any current speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;

        utterance.onend = () => {
            if (onEnd) onEnd();
        };

        utterance.onerror = (event) => {
            console.warn('Speech synthesis error:', event.error);
            if (onEnd) onEnd();
        };

        this.synthesis.speak(utterance);
    }

    async speak(text, options = {}, onEnd) {
        // Handle different calling patterns - options might be passed as second parameter
        if (typeof options === 'function') {
            onEnd = options;
            options = {};
        }

        // Apply audio options if provided
        if (options.rate !== undefined) this.setRate(options.rate);
        if (options.pitch !== undefined) this.setPitch(options.pitch);
        if (options.volume !== undefined) this.setVolume(options.volume);

        try {
            // Try to match against known phrase templates first
            let audioPath = null;
            
            // Check for specific phrase patterns
            if (text.includes('Welcome to the Spelling Challenge')) {
                audioPath = 'audio/phrases/welcome-spelling.mp3';
            } else if (text.includes('Welcome to Letter Scramble')) {
                audioPath = 'audio/phrases/welcome-scramble.mp3';
            } else if (text.includes('Welcome to Multiple Choice')) {
                audioPath = 'audio/phrases/welcome-multiple-choice.mp3';
            } else if (text.includes('Welcome to Flash Cards')) {
                audioPath = 'audio/phrases/welcome-flashcards.mp3';
            } else if (text.includes('Welcome to Reading Practice')) {
                audioPath = 'audio/phrases/welcome-reading-practice.mp3';
            } else if (text.includes("I didn't hear anything")) {
                audioPath = 'audio/phrases/didnt-hear-anything.mp3';
            } else if (text.includes('Speech recognition is not supported')) {
                audioPath = 'audio/phrases/speech-not-supported.mp3';
            } else if (text.includes('Look at the word and listen')) {
                // This is a dynamic phrase - play template + word
                await this._playStaticAudio('audio/phrases/look-at-word-template.mp3');
                const word = text.split('The word is ')[1];
                if (word) {
                    await this.speakWord(word);
                }
                if (onEnd) onEnd();
                return;
            } else if (text.includes('Good try! I heard you say')) {
                // This is a dynamic phrase - play template parts
                await this._playStaticAudio('audio/phrases/good-try-template.mp3');
                // Extract the recognized text and correct word
                const parts = text.split(' but the word is ');
                if (parts.length === 2) {
                    const recognizedText = parts[0].split('I heard you say ')[1];
                    const correctWord = parts[1];
                    await this._playStaticAudio('audio/phrases/but-the-word-is.mp3');
                    await this.speakWord(correctWord);
                }
                if (onEnd) onEnd();
                return;
            } else if (text.includes('You wrote') && text.includes('but the correct spelling is')) {
                // This is a spelling correction phrase - play template parts
                const parts = text.split(' but the correct spelling is ');
                if (parts.length === 2) {
                    const userWord = parts[0].split('You wrote ')[1];
                    const correctWord = parts[1];
                    await this._playStaticAudio('audio/corrections/you-wrote.mp3');
                    await this.speakWord(userWord);
                    // Spell out the word the user wrote
                    await this.spellWord(userWord);
                    await this._playStaticAudio('audio/corrections/but-the-correct-spelling-is.mp3');
                    await this.speakWord(correctWord);
                    // Spell out the correct word
                    await this.spellWord(correctWord);
                }
                if (onEnd) onEnd();
                return;
            } else if (text.includes('You arranged') && text.includes('but the correct spelling is')) {
                // This is a letter scramble correction phrase - play template parts
                const parts = text.split(' but the correct spelling is ');
                if (parts.length === 2) {
                    const userWord = parts[0].split('You arranged ')[1];
                    const correctWord = parts[1];
                    await this._playStaticAudio('audio/corrections/you-arranged.mp3');
                    await this.speakWord(userWord);
                    // Spell out the word the user arranged
                    await this.spellWord(userWord);
                    await this._playStaticAudio('audio/corrections/but-the-correct-spelling-is.mp3');
                    await this.speakWord(correctWord);
                    // Spell out the correct word
                    await this.spellWord(correctWord);
                }
                if (onEnd) onEnd();
                return;
            } else if (text.includes('You selected') && text.includes('but the correct word is')) {
                // This is a multiple choice correction phrase - play template parts
                const parts = text.split(' but the correct word is ');
                if (parts.length === 2) {
                    const userWord = parts[0].split('You selected ')[1];
                    const correctWord = parts[1];
                    await this.speakWord(userWord);
                    await this._playStaticAudio('audio/corrections/but-the-word-is.mp3');
                    await this.speakWord(correctWord);
                    // Spell out the correct word
                    await this.spellWord(correctWord);
                }
                if (onEnd) onEnd();
                return;
            } else {
                // Try generic phrase matching
                audioPath = `audio/phrases/${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mp3`;
            }

            if (audioPath) {
                await this._playStaticAudio(audioPath, onEnd);
            } else {
                throw new Error('No matching audio file');
            }
        } catch (error) {
            // Fallback to speech synthesis
            console.log(`Using fallback speech for: "${text}"`);
            this._playFallbackSpeech(text, onEnd);
        }
    }

    async speakWord(word, onEnd) {
        try {
            // Try to play static word audio
            const audioPath = `audio/words/${word.toLowerCase()}.mp3`;
            await this._playStaticAudio(audioPath, onEnd);
        } catch (error) {
            // Fallback to speech synthesis
            console.log(`Using fallback speech for word: "${word}"`);
            this._playFallbackSpeech(word, onEnd);
        }
    }

    async speakWordStory(word, onEnd) {
        try {
            // Try to play static word story audio
            const audioPath = `audio/sentences/${word.toLowerCase()}-story.mp3`;
            await this._playStaticAudio(audioPath, onEnd);
        } catch (error) {
            // Fallback to speech synthesis
            console.log(`Using fallback speech for word story: "${word}"`);
            this._playFallbackSpeech(word, onEnd);
        }
    }

    async speakPhrase(phrase, onEnd) {
        try {
            // Try to play static phrase audio
            const audioPath = `audio/phrases/${phrase.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mp3`;
            await this._playStaticAudio(audioPath, onEnd);
        } catch (error) {
            // Fallback to speech synthesis
            console.log(`Using fallback speech for phrase: "${phrase}"`);
            this._playFallbackSpeech(phrase, onEnd);
        }
    }

    async speakEncouragement(encouragement = null, onEnd) {
        // If no specific encouragement provided, pick a random one
        if (!encouragement) {
            const encouragements = [
                'great-job', 'excellent-work', 'perfect', 'amazing', 
                'fantastic', 'wonderful', 'awesome', 'correct', 
                'nice-job', 'well-done', 'outstanding', 'you-got-it'
            ];
            encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        }

        try {
            // Try to play static encouragement audio
            const audioPath = `audio/encouragement/${encouragement.toLowerCase().replace(/[^a-z0-9]/g, '-')}.mp3`;
            await this._playStaticAudio(audioPath, onEnd);
        } catch (error) {
            // Fallback to speech synthesis
            console.log(`Using fallback speech for encouragement: "${encouragement}"`);
            this._playFallbackSpeech(encouragement.replace(/-/g, ' '), onEnd);
        }
    }

    async speakCorrection(correctWord, userWord = null, context = null, onEnd) {
        // Handle different calling patterns from game.js
        let correctionText;
        
        if (typeof correctWord === 'string' && correctWord.includes(' ')) {
            // If correctWord is actually a full correction phrase
            correctionText = correctWord;
        } else {
            // Build correction phrase based on context
            if (context === 'typed') {
                if (userWord && userWord.trim()) {
                    correctionText = `You wrote ${userWord}, but the correct spelling is ${correctWord}`;
                } else {
                    correctionText = `The correct spelling is ${correctWord}`;
                }
            } else if (context === 'selected') {
                if (userWord && userWord.trim()) {
                    correctionText = `You selected ${userWord}, but the correct word is ${correctWord}`;
                } else {
                    correctionText = `The correct word is ${correctWord}`;
                }
            } else if (context === 'arranged') {
                if (userWord && userWord.trim()) {
                    correctionText = `You arranged ${userWord}, but the correct spelling is ${correctWord}`;
                } else {
                    correctionText = `The correct arrangement is ${correctWord}`;
                }
            } else {
                correctionText = `The correct word is ${correctWord}`;
            }
        }

        try {
            // Try to play static correction audio with dynamic phrase handling
            await this.speak(correctionText, {}, onEnd);
        } catch (error) {
            // Fallback to speech synthesis
            console.log(`Using fallback speech for correction: "${correctionText}"`);
            this._playFallbackSpeech(correctionText, onEnd);
        }
    }

    async spellWord(word, onEnd) {
        try {
            // Try to spell using individual letter audio files
            const letters = word.toLowerCase().split('');
            for (let i = 0; i < letters.length; i++) {
                const letter = letters[i];
                const audioPath = `audio/letters/${letter}.mp3`;
                await this._playStaticAudio(audioPath);
                
                // Small pause between letters
                if (i < letters.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
            if (onEnd) onEnd();
        } catch (error) {
            // Fallback to speech synthesis spelling
            console.log(`Using fallback speech for spelling: "${word}"`);
            this._playFallbackSpeech(word, onEnd);
        }
    }

    async spellLetter(letter, onEnd) {
        try {
            // Play individual letter audio
            const audioPath = `audio/letters/${letter.toLowerCase()}.mp3`;
            await this._playStaticAudio(audioPath);
            if (onEnd) onEnd();
        } catch (error) {
            // Fallback to speech synthesis
            console.log(`Using fallback speech for letter: "${letter}"`);
            this._playFallbackSpeech(letter, onEnd);
        }
    }

    // Stop any currently playing audio
    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }
        this.synthesis.cancel();
    }

    // Set speech rate (affects fallback speech synthesis)
    setRate(rate) {
        this.rate = Math.max(0.1, Math.min(2.0, rate));
    }

    // Set speech pitch (affects fallback speech synthesis)
    setPitch(pitch) {
        this.pitch = Math.max(0.0, Math.min(2.0, pitch));
    }

    // Set volume (affects both static audio and fallback speech)
    setVolume(volume) {
        this.volume = Math.max(0.0, Math.min(1.0, volume));
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
    }
}

// Create global instance
window.audioController = new AudioController();
console.log('AudioController created with methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.audioController)));