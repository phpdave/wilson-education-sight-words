// Sight Words Game - Audio System (kid-clear iOS/Chrome tuning)

class AudioController {
    constructor() {
      this.synthesis = window.speechSynthesis;
      this.utterance = null;
      this.isSupported = 'speechSynthesis' in window;
      this.voice = null;
  
      // Kid-friendly defaults (tuned by platform in initializeVoice)
      this.rate = 0.7;   // global default; adjusted per platform later
      this.pitch = 1.05; // slightly brighter helps articulation
      this.volume = 1.0;
  
      // Pauses to frame single words (ms)
      this.prePauseMs = 120;
      this.postPauseMs = 140;
  
      // Detect platform
      const ua = navigator.userAgent || '';
      this.isIOS = /iPhone|iPad|iPod/.test(ua);
      this.isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
      this.isChrome = /Chrome|CriOS/.test(ua);
  
      this._voicesLoaded = false;
      this._voiceLoadTries = 0;
      this._maxVoiceLoadTries = 8;
  
      this.initializeVoice();
    }
  
    // Call this once after any user tap/click on iOS Safari
    unlock() {
      if (!this.isSupported) return;
      try {
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0; // silent nudge unlock
        this.synthesis.speak(u);
      } catch (_) {}
    }
  
    initializeVoice() {
      if (!this.isSupported) {
        console.warn('Speech synthesis not supported');
        return;
      }
  
      const loadVoices = () => {
        const voices = this.synthesis.getVoices() || [];
        if (!voices.length && this._voiceLoadTries < this._maxVoiceLoadTries) {
          this._voiceLoadTries++;
          // Some browsers fire voiceschanged late; poll a bit
          setTimeout(loadVoices, 150);
          return;
        }
        this._voicesLoaded = true;
  
        // Load saved preference if it exists
        const savedVoice = localStorage.getItem('sight-words-game-voice');
        if (savedVoice) {
          this.voice = voices.find(v => v.name === savedVoice) || null;
        }
  
        // Select best voice if none
        if (!this.voice) this.selectDefaultVoice(voices);
  
        // Platform-specific tuning
        if (this.isIOS) {
          // iOS voices tend to run a bit faster; slow them a touch more
          this.rate = 0.62;
          this.pitch = 1.06;
        } else if (this.isChrome) {
          // Chrome Google voices are clear at ~0.68–0.72
          this.rate = 0.68;
          this.pitch = 1.04;
        } else {
          this.rate = 0.7;
          this.pitch = 1.05;
        }
      };
  
      if ((this.synthesis.getVoices() || []).length > 0) {
        loadVoices();
      } else {
        this.synthesis.addEventListener('voiceschanged', loadVoices, { once: true });
        // Fallback polling in case the event never fires (some iOS)
        setTimeout(loadVoices, 250);
      }
    }
  
    isRoboticVoice(voice) {
      const name = (voice?.name || '').toLowerCase();
      const bad = [
        'espeak','pico','festival','zarvox','boing','bubbles','whisper','bad','good','cellos',
        'albert','alex','bruce','fred','junior','ralph' // novelty/sfx voices
      ];
      return bad.some(k => name.includes(k));
    }
  
    selectDefaultVoice(voices) {
      // Prefer English, non-robotic
      const en = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
      const pool = en.filter(v => !this.isRoboticVoice(v));
  
      const byName = (substrs) =>
        pool.find(v => substrs.some(s => (v.name || '').toLowerCase().includes(s.toLowerCase())));
  
      let chosen = null;
  
      if (this.isIOS) {
        // Prefer Enhanced voices if available (parents may need to download in Settings ▸ Accessibility ▸ Spoken Content ▸ Voices)
        chosen =
          byName(['samantha (enhanced)']) ||
          byName(['samantha']) ||
          byName(['karen']) ||
          byName(['moira']) ||
          byName(['tessa']) ||
          byName(['google us english']) || // Chrome on iOS (CriOS)
          pool.find(v => v.default) || pool[0];
      } else if (this.isChrome) {
        // Chrome desktop/Android
        chosen =
          byName(['google us english']) ||
          byName(['google uk english female']) ||
          byName(['google uk english']) ||
          byName(['samantha']) ||
          pool.find(v => v.default) || pool[0];
      } else {
        // Other browsers (Edge/Firefox/etc.)
        chosen =
          byName(['microsoft aria','microsoft zira','microsoft guy','microsoft hazel']) ||
          byName(['samantha']) ||
          pool.find(v => v.default) || pool[0];
      }
  
      this.voice = chosen || voices[0] || null;
      if (this.voice) localStorage.setItem('sight-words-game-voice', this.voice.name);
      console.log('Selected voice:', this.voice?.name, this.voice?.lang);
    }
  
    // Core speak with safe defaults and optional framing pauses
    speak(text, options = {}) {
      if (!this.isSupported) {
        console.warn('Speech synthesis not supported');
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        this.stop();
  
        // Optional pre-pause (frames the audio for kids)
        const prePause = options.prePauseMs ?? this.prePauseMs;
        const postPause = options.postPauseMs ?? this.postPauseMs;
  
        const doSpeak = () => {
          const u = new SpeechSynthesisUtterance(text);
          if (this.voice) u.voice = this.voice;
  
          u.rate = (options.rate ?? this.rate);
          u.pitch = (options.pitch ?? this.pitch);
          u.volume = (options.volume ?? this.volume);
          u.lang = options.lang || (this.voice?.lang || 'en-US');
  
          u.onend = () => {
            // Post pause after finishing
            if (postPause > 0) {
              setTimeout(resolve, postPause);
            } else {
              resolve();
            }
          };
          u.onerror = (e) => {
            console.error('Speech error:', e?.error || e);
            resolve(); // resolve to avoid locking the UI on iOS errors
          };
  
          this.utterance = u;
          this.synthesis.speak(u);
        };
  
        if (prePause > 0) {
          setTimeout(doSpeak, prePause);
        } else {
          doSpeak();
        }
      });
    }
  
    // Extra clear single word: slower, slightly higher pitch, framed by pauses
    speakWord(word) {
      return this.speak(word, {
        rate: Math.max(0.5, this.rate - 0.12), // slower for articulation
        pitch: (this.pitch + 0.05),
        prePauseMs: this.prePauseMs,
        postPauseMs: this.postPauseMs
      });
    }
  
    speakPhrase(phrase) {
      return this.speak(phrase, {
        rate: this.rate,
        pitch: this.pitch,
        prePauseMs: 80,
        postPauseMs: 100
      });
    }
  
    speakEncouragement() {
      const encouragements = [
        "Great job!","Excellent!","Well done!","Perfect!","Amazing!","Fantastic!",
        "Great!","Keep it up!","Wonderful!","Outstanding!","So good!","Awesome!",
        "Correct!","Nice job!","You got it!"
      ];
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      return this.speak(msg, {
        rate: this.rate + 0.06,
        pitch: this.pitch + 0.1,
        volume: 0.95,
        prePauseMs: 60,
        postPauseMs: 90
      });
    }
  
    speakCorrection(correctWord, userWord = null, context = 'typed') {
      const corrections = [
        `The correct word is ${correctWord}.`,
        `Try again. The word is ${correctWord}.`,
        `Not quite. It's ${correctWord}.`,
        `The word is ${correctWord}.`
      ];
      const msg = corrections[Math.floor(Math.random() * corrections.length)];
      return this.speak(msg, {
        rate: this.rate - 0.04,
        pitch: this.pitch,
        volume: 0.9
      })
        .then(() => this.spellWord(correctWord))
        .then(() => {
          if (userWord && userWord.trim()) {
            const actionText = context === 'selected' ? 'selected'
              : context === 'arranged' ? 'arranged' : 'typed';
            return this.speak(`You ${actionText} ${userWord}.`, {
              rate: this.rate - 0.02,
              pitch: this.pitch,
              volume: 0.9
            });
          }
        });
    }
  
    spellWord(word) {
      const letters = word.split('');
      let i = 0;
      this.createLetterDisplay(word);
  
      const next = () => {
        if (i < letters.length) {
          this.highlightLetter(i);
          return this.speak(letters[i], {
            rate: Math.max(0.5, this.rate - 0.18),
            pitch: this.pitch + 0.08,
            volume: 0.95,
            prePauseMs: 40,
            postPauseMs: 80
          }).then(() => {
            this.removeLetterHighlight(i);
            i++;
            return new Promise(r => setTimeout(r, 120));
          }).then(next);
        } else {
          return this.speakWord(word).then(() => this.removeLetterDisplay());
        }
      };
      return next();
    }
  
    // ===== UI helpers (unchanged visuals) =====
    createLetterDisplay(word) {
      this.removeLetterDisplay();
      const letters = word.split('');
      const letterContainer = document.createElement('div');
      letterContainer.id = 'letter-spelling-display';
      letterContainer.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        display: flex; gap: 10px; z-index: 1000; background: rgba(255,255,255,0.95);
        padding: 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 3px solid #4ecdc4;
      `;
      letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter.toUpperCase();
        span.dataset.index = index;
        span.style.cssText = `
          font-size: 2.5em; font-weight: bold; color: #2d3748; padding: 10px 15px;
          border-radius: 10px; background: #f7fafc; border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
          font-family: 'Comic Sans MS','Marker Felt','Bradley Hand','Chalkduster','Comic Neue',cursive,sans-serif;
        `;
        letterContainer.appendChild(span);
      });
      document.body.appendChild(letterContainer);
    }
  
    highlightLetter(index) {
      const el = document.querySelector(`#letter-spelling-display span[data-index="${index}"]`);
      if (el) {
        el.style.cssText = `
          font-size: 2.5em; font-weight: bold; color: white; padding: 10px 15px;
          border-radius: 10px; background: #4ecdc4; border: 2px solid #45b7d1;
          transition: all 0.3s ease; transform: scale(1.1);
          box-shadow: 0 5px 15px rgba(78,205,196,0.4);
          font-family: 'Comic Sans MS','Marker Felt','Bradley Hand','Chalkduster','Comic Neue',cursive,sans-serif;
        `;
      }
    }
  
    removeLetterHighlight(index) {
      const el = document.querySelector(`#letter-spelling-display span[data-index="${index}"]`);
      if (el) {
        el.style.cssText = `
          font-size: 2.5em; font-weight: bold; color: #2d3748; padding: 10px 15px;
          border-radius: 10px; background: #f7fafc; border: 2px solid #e2e8f0;
          transition: all 0.3s ease; transform: scale(1);
          font-family: 'Comic Sans MS','Marker Felt','Bradley Hand','Chalkduster','Comic Neue',cursive,sans-serif;
        `;
      }
    }
  
    removeLetterDisplay() {
      const el = document.getElementById('letter-spelling-display');
      if (el) el.remove();
    }
  
    stop() {
      try {
        if (this.synthesis.speaking || this.synthesis.pending) this.synthesis.cancel();
      } catch (_) {}
    }
    pause() { if (this.synthesis.speaking) this.synthesis.pause(); }
    resume() { if (this.synthesis.paused) this.synthesis.resume(); }
    getVoices() { return this.synthesis.getVoices(); }
  
    setVoice(voiceName) {
      const voices = this.synthesis.getVoices();
      const v = voices.find(v => v.name === voiceName);
      if (v) {
        this.voice = v;
        localStorage.setItem('sight-words-game-voice', v.name);
      }
    }
    setRate(rate) { this.rate = Math.max(0.1, Math.min(2.0, rate)); }
    setPitch(pitch) { this.pitch = Math.max(0.0, Math.min(2.0, pitch)); }
    setVolume(volume) { this.volume = Math.max(0.0, Math.min(1.0, volume)); }
  
    isSpeaking() { return this.synthesis.speaking; }
    isPaused() { return this.synthesis.paused; }
  
    testVoice() {
      return this.speak("Hello! This is how I sound. I hope you like my voice!", {
        rate: this.rate, pitch: this.pitch, volume: 0.9, prePauseMs: 0, postPauseMs: 0
      });
    }
  
    formatVoiceName(voice) {
      if (!voice) return 'No voice';
      let name = voice.name
        .replace(/Microsoft\s+/i,'')
        .replace(/Google\s+/i,'')
        .replace(/\s+Desktop/i,'')
        .replace(/\s+Enhanced/i,'')
        .replace(/\s+Neural/i,'');
      if (voice.lang.includes('US')) name += ' 🇺🇸';
      else if (voice.lang.includes('UK')) name += ' 🇬🇧';
      else if (voice.lang.includes('AU')) name += ' 🇦🇺';
      return name;
    }
  
    getCurrentVoiceInfo() {
      return this.voice ? this.formatVoiceName(this.voice) : 'No voice selected';
    }
  }
  
  // Create global instance
  window.audioController = new AudioController();
  
  // Export for modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioController;
  }
  