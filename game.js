// Sight Words Game - Main Game Logic
// Handles game state management, UI interactions, and game flow

class SightWordsGame {
    constructor() {
        this.currentGame = null;
        this.currentWordIndex = 0;
        this.wordList = [];
        this.score = 0;
        this.gameState = 'welcome'; // welcome, playing, results
        this.isGameActive = false;
        this.isFirstFlashCard = true; // Track if this is the first flash card flip
        
        this.wordBank = [
            'her', 'who', 'some', 'out', 'about', 'too', 'two', 'were', 'what', 'come', 'comes', 'coming', 'become', 'becomes', 'becoming',
            'their', 'no', 'so', 'also', 'how', 'now', 'where', 'here', 'there', 'any', 'anywhere', 'anyone', 'anything',
            'many', 'front', 'very', 'every', 'everywhere', 'everyone', 'everything', 'could', 'would', 'should',
            'when', 'which', 'been', 'said', 'each', 'asked', 'why', 'by', 'my', 'try', 'put', 'putting',
            'only', 'work', 'word', 'world'
        ];
        this.distractorWords = [
            'air', 'our', 'doze', 'dose', 'form', 'fro', 'boat', 'bath', 'off', 'if', 
            'you', 'yore', 'went', 'wont', 'ant', 'and', 'the', 'is', 'it', 'in',
            'him', 'how', 'sum', 'oat', 'abut', 'to', 'toe', 'wear', 'whet', 'came',
            'cums', 'cuming', 'becum', 'becums', 'becuming', 'thair', 'know', 'sow',
            'allso', 'now', 'ware', 'hear', 'thare', 'eny', 'enywhere', 'enyone', 'enything',
            'meny', 'frunt', 'vary', 'evry', 'evrywhere', 'evryone', 'evrything', 'cud',
            'wud', 'shud', 'wen', 'wich', 'bean', 'sed', 'ech', 'askd', 'wy', 'bi',
            'mi', 'tri', 'poot', 'pooting', 'onely', 'werk', 'werd', 'werld'
        ];
        
        // Enhanced learning features
        this.wordStories = {
            'her': 'Her name is Sarah.',
            'who': 'Who is at the door?',
            'some': 'I have some cookies.',
            'out': 'Let\'s go out to play.',
            'about': 'Tell me about your day.',
            'too': 'I want to go too!',
            'two': 'I have two cats.',
            'were': 'We were happy yesterday.',
            'what': 'What is your favorite color?',
            'come': 'Come here, please.',
            'comes': 'The bus comes at eight.',
            'coming': 'The train is coming now.',
            'become': 'I want to become a teacher.',
            'becomes': 'She becomes happy when she sings.',
            'becoming': 'The sky is becoming dark.',
            'their': 'Their house is big.',
            'no': 'No, thank you.',
            'so': 'I am so excited!',
            'also': 'I also like pizza.',
            'how': 'How are you today?',
            'now': 'We can play now.',
            'where': 'Where is my book?',
            'here': 'Come here, please.',
            'there': 'The park is over there.',
            'any': 'Do you have any questions?',
            'anywhere': 'We can go anywhere you want.',
            'anyone': 'Anyone can join the game.',
            'anything': 'You can ask me anything.',
            'many': 'There are many flowers.',
            'front': 'The car is in front of the house.',
            'very': 'This cake is very good.',
            'every': 'Every day is special.',
            'everywhere': 'We looked everywhere for the toy.',
            'everyone': 'Everyone is welcome here.',
            'everything': 'Everything will be okay.',
            'could': 'Could you help me, please?',
            'would': 'Would you like some juice?',
            'should': 'You should eat your vegetables.',
            'when': 'When is your birthday?',
            'which': 'Which book do you want?',
            'been': 'I have been waiting for you.',
            'said': 'She said hello to me.',
            'each': 'Each child gets a cookie.',
            'asked': 'He asked a good question.',
            'why': 'Why is the sky blue?',
            'by': 'The book is by my bed.',
            'my': 'My favorite color is blue.',
            'try': 'Try your best!',
            'put': 'Put the toy in the box.',
            'putting': 'I am putting on my shoes.',
            'only': 'Only five minutes left!',
            'work': 'I work hard at school.',
            'word': 'This is a new word.',
            'world': 'The world is beautiful.'
        };
        // Homophone mapping for Reading Practice
        this.homophones = {
            'too': ['two', 'to'],
            'two': ['too', 'to'],
            'to': ['too', 'two'],
            'their': ['there', 'they\'re'],
            'there': ['their', 'they\'re'],
            'they\'re': ['their', 'there'],
            'here': ['hear'],
            'hear': ['here'],
            'no': ['know'],
            'know': ['no'],
            'by': ['buy', 'bye'],
            'buy': ['by', 'bye'],
            'bye': ['by', 'buy'],
            'some': ['sum'],
            'sum': ['some'],
            'so': ['sew'],
            'sew': ['so'],
            'put': ['putt'],
            'putt': ['put'],
            'word': ['were'],
            'were': ['word'],
            'work': ['were'],
            'world': ['were'],
            'where': ['were'],
            'what': ['watt'],
            'watt': ['what'],
            'which': ['witch'],
            'witch': ['which'],
            'when': ['wen'],
            'wen': ['when'],
            'why': ['y'],
            'y': ['why'],
            'my': ['mi'],
            'mi': ['my'],
            'try': ['tri'],
            'tri': ['try'],
            'only': ['onely'],
            'onely': ['only'],
            'said': ['sed'],
            'sed': ['said'],
            'each': ['ech'],
            'ech': ['each'],
            'asked': ['askd'],
            'askd': ['asked'],
            'been': ['bean'],
            'bean': ['been'],
            'come': ['cum'],
            'cum': ['come'],
            'comes': ['cums'],
            'cums': ['comes'],
            'coming': ['cuming'],
            'cuming': ['coming'],
            'become': ['becum'],
            'becum': ['become'],
            'becomes': ['becums'],
            'becums': ['becomes'],
            'becoming': ['becuming'],
            'becuming': ['becoming'],
            'could': ['cud'],
            'cud': ['could'],
            'would': ['wud'],
            'wud': ['would'],
            'should': ['shud'],
            'shud': ['should'],
            'many': ['meny'],
            'meny': ['many'],
            'very': ['vary'],
            'vary': ['very'],
            'every': ['evry'],
            'evry': ['every'],
            'everywhere': ['evrywhere'],
            'evrywhere': ['everywhere'],
            'everyone': ['evryone'],
            'evryone': ['everyone'],
            'everything': ['evrything'],
            'evrything': ['everything'],
            'any': ['eny'],
            'eny': ['any'],
            'anywhere': ['enywhere'],
            'enywhere': ['anywhere'],
            'anyone': ['enyone'],
            'enyone': ['anyone'],
            'anything': ['enything'],
            'enything': ['anything'],
            'front': ['frunt'],
            'frunt': ['front'],
            'how': ['hou'],
            'hou': ['how'],
            'now': ['nou'],
            'nou': ['now'],
            'out': ['oat'],
            'oat': ['out'],
            'about': ['abut'],
            'abut': ['about'],
            'who': ['hoo'],
            'hoo': ['who'],
            'her': ['hur'],
            'hur': ['her']
        };
        
        this.consecutiveCorrect = {};
        this.requiredCorrectStreak = 3;
        this.starsEarned = 0;
        this.achievements = [];
        this.recentlyUsedWords = []; // Track recently used words to prevent immediate repetition
        
        this.init();
    }

    generateAdaptiveWordList() {
        const progress = window.progressTracker.progress;
        const sessionLength = 12;
        
        // If no progress data, use a balanced mix of all words
        if (!progress || Object.keys(progress).length === 0) {
            const shuffled = [...this.wordBank].sort(() => Math.random() - 0.5);
            console.log('No progress data, using random word selection:', shuffled.slice(0, sessionLength));
            return shuffled.slice(0, sessionLength);
        }
        
        const weakWords = [];
        const mediumWords = [];
        const strongWords = [];
        
        // Categorize words based on accuracy with more nuanced categories
        this.wordBank.forEach(word => {
            const wordProgress = progress[word] || { attempts: 0, correct: 0 };
            const accuracy = wordProgress.attempts > 0 ? 
                (wordProgress.correct / wordProgress.attempts) : 0;
            
            if (accuracy < 0.5 || wordProgress.attempts < 2) {
                weakWords.push(word);
            } else if (accuracy < 0.8 || wordProgress.attempts < 4) {
                mediumWords.push(word);
            } else {
                strongWords.push(word);
            }
        });
        
        // Sort by accuracy (lowest first for weak, highest first for strong)
        weakWords.sort((a, b) => {
            const aAccuracy = progress[a] ? (progress[a].correct / progress[a].attempts) : 0;
            const bAccuracy = progress[b] ? (progress[b].correct / progress[b].attempts) : 0;
            return aAccuracy - bAccuracy;
        });
        
        strongWords.sort((a, b) => {
            const aAccuracy = progress[a] ? (progress[a].correct / progress[a].attempts) : 0;
            const bAccuracy = progress[b] ? (progress[b].correct / progress[b].attempts) : 0;
            return bAccuracy - aAccuracy;
        });
        
        // Calculate distribution: 50% weak, 30% medium, 20% strong
        const weakCount = Math.min(Math.ceil(sessionLength * 0.5), weakWords.length);
        const mediumCount = Math.min(Math.ceil(sessionLength * 0.3), mediumWords.length);
        const strongCount = Math.min(sessionLength - weakCount - mediumCount, strongWords.length);
        
        let wordList = [];
        
        // Add words with better distribution to prevent repetition
        const addWordsWithVariety = (wordPool, count) => {
            const added = [];
            const usedInThisSession = new Set();
            
            // First, add words in order (no repetition within this session)
            for (let i = 0; i < Math.min(count, wordPool.length); i++) {
                const word = wordPool[i];
                if (!usedInThisSession.has(word)) {
                    added.push(word);
                    usedInThisSession.add(word);
                }
            }
            
            // If we need more words, add them randomly from the pool (avoiding recent repetition)
            while (added.length < count && wordPool.length > 0) {
                const availableWords = wordPool.filter(word => !usedInThisSession.has(word));
                if (availableWords.length === 0) {
                    // If all words are used, allow repetition but space them out
                    const randomWord = wordPool[Math.floor(Math.random() * wordPool.length)];
                    added.push(randomWord);
                } else {
                    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
                    added.push(randomWord);
                    usedInThisSession.add(randomWord);
                }
            }
            
            return added;
        };
        
        // Add words from each category
        wordList.push(...addWordsWithVariety(weakWords, weakCount));
        wordList.push(...addWordsWithVariety(mediumWords, mediumCount));
        wordList.push(...addWordsWithVariety(strongWords, strongCount));
        
        // If we still don't have enough words, fill with random words from word bank
        if (wordList.length < sessionLength) {
            const usedWords = new Set(wordList);
            const availableWords = this.wordBank.filter(word => !usedWords.has(word));
            
            while (wordList.length < sessionLength && availableWords.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableWords.length);
                wordList.push(availableWords.splice(randomIndex, 1)[0]);
            }
        }
        
        // Shuffle the list to randomize order
        for (let i = wordList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordList[i], wordList[j]] = [wordList[j], wordList[i]];
        }
        
        // Filter out any undefined/null values and return
        const cleanWordList = wordList.filter(word => word && word !== undefined && word !== null);
        
        console.log('Generated word list with variety:', {
            total: cleanWordList.length,
            weak: weakCount,
            medium: mediumCount,
            strong: strongCount,
            words: cleanWordList
        });
        
        return cleanWordList.slice(0, sessionLength);
    }

    // Track recently used words to prevent immediate repetition
    trackWordUsage(word) {
        this.recentlyUsedWords.push(word);
        // Keep only the last 6 words to prevent immediate repetition
        if (this.recentlyUsedWords.length > 6) {
            this.recentlyUsedWords.shift();
        }
    }

    // Check if a word was recently used
    wasRecentlyUsed(word) {
        return this.recentlyUsedWords.includes(word);
    }

    // Micro-celebrations and enhanced feedback
    showMicroCelebration(type, element = null) {
        const celebrations = {
            'letter': '✨',
            'word': '🌟',
            'streak': '🎉',
            'achievement': '🏆'
        };
        
        const emoji = celebrations[type] || '✨';
        const celebration = document.createElement('div');
        celebration.className = 'micro-celebration';
        celebration.textContent = emoji;
        celebration.style.cssText = `
            position: absolute;
            font-size: 2em;
            pointer-events: none;
            z-index: 1000;
            animation: microCelebration 1s ease-out forwards;
        `;
        
        if (element) {
            const rect = element.getBoundingClientRect();
            celebration.style.left = (rect.left + rect.width / 2) + 'px';
            celebration.style.top = (rect.top - 20) + 'px';
        } else {
            celebration.style.left = '50%';
            celebration.style.top = '50%';
            celebration.style.transform = 'translate(-50%, -50%)';
        }
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 1000);
    }

    checkAchievements() {
        const newAchievements = [];
        
        // First correct answer
        if (this.score === 10 && !this.achievements.includes('first-correct')) {
            newAchievements.push('first-correct');
            this.showAchievement('🎯', 'First Success!');
        }
        
        // Perfect streak
        if (this.score >= 50 && !this.achievements.includes('perfect-streak')) {
            newAchievements.push('perfect-streak');
            this.showAchievement('🔥', 'Perfect Streak!');
        }
        
        // Word mastery
        Object.keys(this.consecutiveCorrect).forEach(word => {
            if (this.consecutiveCorrect[word] >= this.requiredCorrectStreak && 
                !this.achievements.includes(`master-${word}`)) {
                newAchievements.push(`master-${word}`);
                this.showAchievement('👑', `${word.toUpperCase()} Master!`);
            }
        });
        
        this.achievements.push(...newAchievements);
    }

    showAchievement(emoji, text) {
        const achievement = document.createElement('div');
        achievement.className = 'achievement-popup';
        achievement.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-emoji">${emoji}</div>
                <div class="achievement-text">${text}</div>
            </div>
        `;
        achievement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #feca57);
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: achievementSlide 0.5s ease-out;
            font-family: 'Comic Sans MS', cursive;
            font-weight: bold;
        `;
        
        document.body.appendChild(achievement);
        
        setTimeout(() => {
            achievement.style.animation = 'achievementSlideOut 0.5s ease-in forwards';
            setTimeout(() => achievement.remove(), 500);
        }, 3000);
    }

    init() {
        this.setupEventListeners();
        this.setupGlobalTyping();
        this.updateProgressDisplay();
        this.populateWordTags();
        this.showScreen('welcome');
    }

    populateWordTags() {
        const container = document.getElementById('word-tags-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.wordBank.forEach(word => {
            const tag = document.createElement('span');
            tag.className = 'word-tag';
            tag.textContent = word;
            container.appendChild(tag);
        });
    }

    setupGlobalTyping() {
        // Set up global typing listener that persists throughout the game
        document.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.key, 'Current game:', this.currentGame, 'Game active:', this.isGameActive);
            
            // Handle refresh shortcuts (Command+R on Mac, Ctrl+R on Windows/Linux)
            if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
                // Allow default browser refresh behavior
                return;
            }
            
            if (this.currentGame === 'spelling' && this.isGameActive) {
                // Find the current input field (it might have been replaced)
                const input = document.getElementById('word-input');
                const checkBtn = document.getElementById('check-spelling');
                
                console.log('Input found:', !!input, 'Check button found:', !!checkBtn, 'Check disabled:', checkBtn?.disabled);
                
                if (input && checkBtn) {
                    // Handle Enter key to submit answer
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!checkBtn.disabled) {
                            console.log('Enter pressed - submitting answer');
                            this.checkSpellingAnswer();
                            this.disableCheckButton();
                        }
                        return;
                    }
                    
                    // If it's a letter, number, or common key, add the character
                    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
                        e.preventDefault();
                        console.log('Processing key:', e.key);
                        
                        if (e.key === 'Backspace') {
                            input.value = input.value.slice(0, -1);
                        } else if (e.key === 'Delete') {
                            input.value = '';
                        } else if (e.key.match(/[a-zA-Z]/)) {
                            // Only allow letters, convert to lowercase
                            input.value += e.key.toLowerCase();
                        }
                        
                        // Trigger input event to update button state
                        input.dispatchEvent(new Event('input'));
                        console.log('Input value after typing:', input.value);
                    }
                }
            }
        });
    }

    setupEventListeners() {
        // Game selection buttons
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameType = e.currentTarget.dataset.game;
                this.startGame(gameType);
            });
        });

        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            // Stop speech recognition session if active
            if (this.speechRecognitionActive) {
                this.stopSpeechRecognitionSession();
            }
            this.endGame();
        });

        // Results screen buttons
        document.getElementById('play-again').addEventListener('click', () => {
            this.startGame(this.currentGame);
        });

        document.getElementById('change-game').addEventListener('click', () => {
            this.showScreen('welcome');
        });

        document.getElementById('view-progress').addEventListener('click', () => {
            this.showParentDashboard();
        });

        // Dashboard back button
        document.getElementById('dashboard-back-btn').addEventListener('click', () => {
            this.showScreen('welcome');
        });

        // Audio buttons
        this.setupAudioButtons();
    }

    showParentDashboard() {
        this.showScreen('parent-dashboard');
        this.populateDashboard();
    }

    populateDashboard() {
        const analytics = window.progressTracker.getDetailedAnalytics();
        
        // Update learning insights
        document.getElementById('strongest-words').textContent = 
            analytics.insights.strongestWords.join(', ') || 'None yet';
        
        document.getElementById('focus-areas').textContent = 
            analytics.insights.weakestWords.join(', ') || 'All mastered!';
        
        document.getElementById('progress-trend').textContent = 
            analytics.improvementTrends.trend === 'improving' ? '📈 Improving' :
            analytics.improvementTrends.trend === 'declining' ? '📉 Needs Focus' :
            analytics.improvementTrends.trend === 'stable' ? '📊 Steady' : '🆕 Getting Started';
        
        document.getElementById('learning-style').textContent = 
            analytics.insights.learningStyle.charAt(0).toUpperCase() + 
            analytics.insights.learningStyle.slice(1);

        // Populate word progress grid
        this.populateWordProgressGrid(analytics);

        // Populate recommendations
        this.populateRecommendations(analytics.recommendedActions);

        // Populate session history
        this.populateSessionHistory(analytics.sessionHistory);
    }

    populateWordProgressGrid(analytics) {
        const grid = document.getElementById('word-progress-grid');
        grid.innerHTML = '';

        this.wordBank.forEach(word => {
            const wordData = analytics.wordStats[word] || { attempts: 0, correct: 0, accuracy: 0 };
            const accuracy = Math.round(wordData.accuracy * 100);
            
            const card = document.createElement('div');
            card.className = `word-progress-card ${accuracy >= 70 ? 'strong' : accuracy < 50 ? 'weak' : ''}`;
            
            card.innerHTML = `
                <div class="word-progress-title">${word.toUpperCase()}</div>
                <div class="word-progress-stats">
                    ${accuracy}% accuracy<br>
                    ${wordData.attempts} attempts
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    populateRecommendations(recommendations) {
        const list = document.getElementById('recommendations-list');
        list.innerHTML = '';

        if (recommendations.length === 0) {
            list.innerHTML = '<div class="recommendation-item">Keep practicing! You\'re doing great! 🌟</div>';
            return;
        }

        recommendations.forEach(rec => {
            const item = document.createElement('div');
            item.className = 'recommendation-item';
            item.textContent = rec;
            list.appendChild(item);
        });
    }

    populateSessionHistory(sessions) {
        const history = document.getElementById('session-history');
        history.innerHTML = '';

        if (sessions.length === 0) {
            history.innerHTML = '<div class="session-item">No sessions yet. Start playing to see your progress!</div>';
            return;
        }

        sessions.slice(-5).reverse().forEach(session => {
            const item = document.createElement('div');
            item.className = 'session-item';
            
            const date = new Date(session.date).toLocaleDateString();
            const accuracy = Math.round(session.accuracy * 100);
            
            item.innerHTML = `
                <div class="session-date">${date}</div>
                <div class="session-stats">${accuracy}% accuracy • ${session.gameType}</div>
            `;
            
            history.appendChild(item);
        });
    }

    setupAudioButtons() {
        // Spelling game audio
        document.getElementById('speak-word').addEventListener('click', () => {
            this.speakCurrentWord();
        });

        // Scramble game audio
        document.getElementById('speak-scramble').addEventListener('click', () => {
            this.speakCurrentWord();
        });

        // Multiple choice audio
        document.getElementById('speak-mc').addEventListener('click', () => {
            this.speakCurrentWord();
        });

        // Flash cards audio
        document.getElementById('speak-flash').addEventListener('click', () => {
            this.speakCurrentWord();
        });

    }

    startGame(gameType) {
        this.currentGame = gameType;
        this.currentWordIndex = 0;
        this.score = 0;
        this.isGameActive = true;
        this.isFirstFlashCard = true; // Reset for new game session
        this.recentlyUsedWords = []; // Reset recently used words for new session
        
        // Unlock audio context for iOS Safari
        if (window.audioController) {
            window.audioController.unlock();
        }
        
        // Generate adaptive word list prioritizing difficult words
        this.wordList = this.generateAdaptiveWordList();
        
        // Validate word list
        if (!this.wordList || this.wordList.length === 0) {
            console.error('Failed to generate valid word list');
            this.wordList = [...this.wordBank]; // Fallback to word bank
        }
        
        // Additional validation: ensure no undefined values
        this.wordList = this.wordList.filter(word => word && word !== undefined && word !== null);
        if (this.wordList.length === 0) {
            console.error('Word list is empty after filtering, using word bank');
            this.wordList = [...this.wordBank];
        }
        
        console.log('Starting game with word list:', this.wordList);
        
        // Start progress tracking session
        window.progressTracker.startSession(gameType);
        
        // Update UI
        this.updateGameHeader();
        this.showScreen('game');
        this.loadCurrentWord(false); // Don't speak yet, wait for instructions
        this.setupGameMode(gameType);
        
        // Speak game instructions first, then the word
        setTimeout(() => {
            this.speakGameInstructions(gameType).then(() => {
                // After instructions finish, speak the first word
                // EXCEPT for flashcards and reading practice - they handle their own word playback
                if (gameType !== 'flashcards' && gameType !== 'reading-practice') {
                    setTimeout(() => {
                        this.speakCurrentWord();
                    }, 500);
                }
            });
        }, 500);
    }

    speakGameInstructions(gameType) {
        const instructions = {
            'spelling': "Welcome to the Spelling Challenge! Listen to the word and type it in the box. Click the speaker button if you need to hear the word again.",
            'scramble': "Welcome to Letter Scramble! Listen to the word and arrange the letters in the correct order. Drag the letters to spell the word.",
            'multiple-choice': "Welcome to Multiple Choice! Listen to the word and click on the correct spelling from the options below.",
            'flashcards': "Welcome to Flash Cards! Look at the word and listen to help you remember it. Click 'Show Next Card' when you're ready.",
            'reading-practice': "Welcome to Reading Practice! Look at the word and try to say it out loud. If you get it wrong, you'll hear the correct pronunciation to help you learn."
        };

        const instruction = instructions[gameType] || "Welcome to the game! Let's start playing.";
        
        return window.audioController.speak(instruction, {
            rate: 0.8,
            pitch: 1.0,
            volume: 0.8
        });
    }

    setupGameMode(gameType) {
        // Hide all game modes
        document.querySelectorAll('.game-mode').forEach(mode => {
            mode.classList.remove('active');
        });

        // Show selected game mode
        const gameModeMap = {
            'spelling': 'spelling-game',
            'scramble': 'scramble-game',
            'multiple-choice': 'multiple-choice-game',
            'flashcards': 'flashcards-game',
            'reading-practice': 'reading-practice-game'
        };

        const activeMode = document.getElementById(gameModeMap[gameType]);
        if (activeMode) {
            activeMode.classList.add('active');
        }

        // Setup game-specific event listeners
        this.setupGameSpecificListeners(gameType);
    }

    setupGameSpecificListeners(gameType) {
        switch (gameType) {
            case 'spelling':
                this.setupSpellingGame();
                break;
            case 'scramble':
                this.setupScrambleGame();
                break;
            case 'multiple-choice':
                this.setupMultipleChoiceGame();
                break;
            case 'flashcards':
                this.setupFlashCardsGame();
                break;
            case 'reading-practice':
                this.setupReadingPracticeGame();
                break;
        }
    }

    setupSpellingGame() {
        const input = document.getElementById('word-input');
        const checkBtn = document.getElementById('check-spelling');

        // Clear input
        input.value = '';
        input.focus();

        // Remove existing listeners to prevent duplicates
        const newCheckBtn = checkBtn.cloneNode(true);
        const newInput = input.cloneNode(true);
        
        checkBtn.parentNode.replaceChild(newCheckBtn, checkBtn);
        input.parentNode.replaceChild(newInput, input);

        // Add event listeners to the new elements
        newCheckBtn.addEventListener('click', () => {
            if (!newCheckBtn.disabled) {
                this.checkSpellingAnswer();
                this.disableCheckButton();
            }
        });

        newInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !newCheckBtn.disabled) {
                this.checkSpellingAnswer();
                this.disableCheckButton();
            }
        });

        // Update check button state on input change
        newInput.addEventListener('input', () => {
            this.updateCheckButtonState();
        });

        // Initial button state
        this.updateCheckButtonState();
    }

    disableCheckButton() {
        const checkBtn = document.getElementById('check-spelling');
        if (checkBtn) {
            checkBtn.disabled = true;
            checkBtn.style.opacity = '0.5';
            checkBtn.style.cursor = 'not-allowed';
            checkBtn.textContent = 'Submitted';
        }
    }

    updateCheckButtonState() {
        const input = document.getElementById('word-input');
        const checkBtn = document.getElementById('check-spelling');
        
        if (input && checkBtn) {
            const hasText = input.value.trim().length > 0;
            checkBtn.disabled = !hasText;
            checkBtn.style.opacity = hasText ? '1' : '0.5';
            checkBtn.style.cursor = hasText ? 'pointer' : 'not-allowed';
        }
    }

    setupScrambleGame() {
        this.generateScrambledLetters();
        this.setupDragAndDrop();
        
        const checkBtn = document.getElementById('check-scramble');

        // Remove existing listeners to prevent duplicates
        const newCheckBtn = checkBtn.cloneNode(true);
        
        checkBtn.parentNode.replaceChild(newCheckBtn, checkBtn);

        newCheckBtn.addEventListener('click', () => {
            if (!newCheckBtn.disabled) {
                this.checkScrambleAnswer();
                this.disableScrambleCheckButton();
            }
        });
    }

    disableScrambleCheckButton() {
        const checkBtn = document.getElementById('check-scramble');
        if (checkBtn) {
            checkBtn.disabled = true;
            checkBtn.style.opacity = '0.5';
            checkBtn.style.cursor = 'not-allowed';
            checkBtn.textContent = 'Submitted';
        }
    }

    resetScrambleCheckButton() {
        const checkBtn = document.getElementById('check-scramble');
        if (checkBtn) {
            checkBtn.disabled = false;
            checkBtn.style.opacity = '1';
            checkBtn.style.cursor = 'pointer';
            checkBtn.textContent = 'Check';
        }
    }

    setupMultipleChoiceGame() {
        this.generateMultipleChoiceOptions();
        this.enableMultipleChoiceOptions();
        
        document.querySelectorAll('.choice-option').forEach(option => {
            option.addEventListener('click', (e) => {
                // Prevent any interaction if already selected or disabled
                if (e.target.classList.contains('selected') || e.target.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                
                this.selectMultipleChoice(e.target.textContent);
                this.disableMultipleChoiceOptions();
            });
            
            // Prevent any other interactions
            option.addEventListener('mousedown', (e) => {
                if (e.target.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            
            option.addEventListener('touchstart', (e) => {
                if (e.target.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, { passive: false });
        });
    }

    disableMultipleChoiceOptions() {
        document.querySelectorAll('.choice-option').forEach(option => {
            option.disabled = true;
            option.style.cursor = 'not-allowed';
            option.style.opacity = '0.7';
            option.style.pointerEvents = 'none'; // Prevent all mouse/touch events
            
            // Remove any hover effects
            option.classList.add('disabled');
        });
    }

    enableMultipleChoiceOptions() {
        document.querySelectorAll('.choice-option').forEach(option => {
            option.disabled = false;
            option.style.cursor = 'pointer';
            option.style.opacity = '1';
            option.style.pointerEvents = 'auto';
            
            // Remove disabled class and any selection classes
            option.classList.remove('disabled', 'selected');
        });
    }

    setupFlashCardsGame() {
        const flipBtn = document.getElementById('flip-card');
        const card = document.getElementById('flash-card');

        // Reset card to unflipped state
        card.classList.remove('flipped');

        // Remove existing listeners to prevent duplicates
        const newFlipBtn = flipBtn.cloneNode(true);
        
        flipBtn.parentNode.replaceChild(newFlipBtn, flipBtn);

        newFlipBtn.addEventListener('click', () => {
            this.flipFlashCard();
        });
    }

    setupReadingPracticeGame() {
        const recordBtn = document.getElementById('record-button');
        const statusDiv = document.getElementById('recording-status');
        const recognizedDiv = document.getElementById('recognized-text');
        const liveTranscriptionDiv = document.getElementById('live-transcription');

        // Initialize speech recognition (only if not already initialized)
        if (!this.speechRecognition) {
            this.speechRecognition = null;
            this.isListening = false;
            this.recognizedText = '';
            this.liveTranscription = '';
            this.speechTimeout = null;
            this.retryCount = 0;
            this.maxRetries = 2;
            this.speechRecognitionActive = false; // Track if recognition is active for the session
            this.microphonePermissionGranted = false; // Track microphone permission state
            this.microphonePermissionRequested = false; // Track if we've already requested permission
        }

        // Check if speech recognition is supported
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            
            this.speechRecognition.continuous = true;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'en-US';
            this.speechRecognition.maxAlternatives = 1;
            
            // Add additional configuration for better speech recognition
            if ('webkitSpeechRecognition' in window) {
                // Webkit-specific settings
                this.speechRecognition.continuous = true;
                this.speechRecognition.interimResults = true;
            }
            
            // Check microphone permission status
            this.checkMicrophonePermission();

            this.speechRecognition.onstart = () => {
                this.isListening = true;
                this.updateRecordingStatus('recording', 'Listening...');
                this.updateRecordButton(true);
                this.showLiveTranscription();
            };

            this.speechRecognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Update live transcription display
                this.liveTranscription = (finalTranscript + interimTranscript).toLowerCase().trim();
                this.updateLiveTranscription(this.liveTranscription);

                // Only process final results and only if we have substantial text
                if (finalTranscript && finalTranscript.trim().length > 0) {
                    console.log('Final transcript received:', finalTranscript);
                    console.log('Current word:', this.wordList[this.currentWordIndex]);
                    console.log('Live transcription:', this.liveTranscription);
                    
                    // Add a delay to give user time to finish speaking
                    setTimeout(() => {
                        if (this.isListening) {
                            console.log('Processing reading result with final transcript:', finalTranscript);
                            this.processReadingResult(finalTranscript);
                        }
                    }, 1500); // Wait 1.5 seconds after final result
                }
            };

            this.speechRecognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                
                let errorMessage = 'Sorry, I couldn\'t hear you. Try again!';
                
                // Handle different types of errors with specific messages
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = 'I didn\'t hear anything. Please speak clearly and try again!';
                        break;
                    case 'audio-capture':
                        errorMessage = 'Microphone not available. Please check your microphone and try again!';
                        break;
                    case 'not-allowed':
                        this.microphonePermissionGranted = false;
                        errorMessage = 'Microphone access denied. Please allow microphone access and try again!';
                        break;
                    case 'network':
                        errorMessage = 'Network error. Please check your connection and try again!';
                        break;
                    case 'aborted':
                        errorMessage = 'Speech recognition was interrupted. Please try again!';
                        break;
                    case 'language-not-supported':
                        errorMessage = 'Language not supported. Please try again!';
                        break;
                    case 'service-not-allowed':
                        errorMessage = 'Speech recognition not allowed. Please try again!';
                        break;
                    default:
                        errorMessage = 'Speech recognition error. Please try again!';
                }
                
                this.updateRecordingStatus('error', errorMessage);
                this.updateRecordButton(false);
                this.isListening = false;
                this.hideLiveTranscription();
                
                // Clear any existing timeout
                if (this.speechTimeout) {
                    clearTimeout(this.speechTimeout);
                    this.speechTimeout = null;
                }
            };

            this.speechRecognition.onend = () => {
                this.isListening = false;
                this.updateRecordButton(false);
                this.hideLiveTranscription();
            };
        } else {
            // Fallback for browsers without speech recognition
            this.updateRecordingStatus('error', 'Speech recognition not supported. Please use a modern browser.');
        }

        // Remove existing listeners to prevent duplicates
        const newRecordBtn = recordBtn.cloneNode(true);
        recordBtn.parentNode.replaceChild(newRecordBtn, recordBtn);

        // Record button event listener - now just toggles listening state
        newRecordBtn.addEventListener('click', () => {
            if (!this.speechRecognitionActive) {
                // Check microphone permission first
                this.checkMicrophonePermission().then(() => {
                    if (this.microphonePermissionGranted) {
                        this.startSpeechRecognitionSession();
                    } else {
                        this.updateRecordingStatus('error', 'Microphone permission needed. Please allow access and try again.');
                    }
                });
            } else if (!this.isListening) {
                // Start listening for current word
                this.startListeningForWord();
            } else {
                // Stop listening for current word (but keep session active)
                this.stopListeningForWord();
            }
        });

        // Reset UI
        this.resetReadingUI();
    }

    async checkMicrophonePermission() {
        // If we already have permission, return immediately
        if (this.microphonePermissionGranted) {
            return Promise.resolve();
        }

        // If we've already requested permission and it was denied, don't ask again
        if (this.microphonePermissionRequested && !this.microphonePermissionGranted) {
            return Promise.reject('Permission already denied');
        }

        try {
            // Request microphone permission using getUserMedia
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.microphonePermissionGranted = true;
            this.microphonePermissionRequested = true;
            
            // Stop the stream immediately as we only needed it for permission
            stream.getTracks().forEach(track => track.stop());
            
            console.log('Microphone permission granted');
            return Promise.resolve();
        } catch (error) {
            console.error('Microphone permission denied:', error);
            this.microphonePermissionGranted = false;
            this.microphonePermissionRequested = true;
            return Promise.reject(error);
        }
    }

    startSpeechRecognitionSession() {
        if (this.speechRecognition && !this.speechRecognitionActive && this.microphonePermissionGranted) {
            this.speechRecognitionActive = true;
            this.recognizedText = '';
            this.clearRecognizedText();
            this.speechRecognition.start();
            
            this.updateRecordingStatus('ready', 'Speech recognition started!');
            this.updateRecordButton(false);
        } else if (!this.microphonePermissionGranted) {
            this.updateRecordingStatus('error', 'Microphone permission needed. Please allow access and try again.');
        }
    }

    startListeningForWord() {
        if (this.speechRecognition && this.speechRecognitionActive && !this.isListening) {
            this.recognizedText = '';
            this.clearRecognizedText();
            this.speechRecognition.start();
            
            // Set a timeout to stop listening after 10 seconds if no speech detected
            this.speechTimeout = setTimeout(() => {
                if (this.isListening) {
                    this.updateRecordingStatus('ready', 'No speech detected. Try again!');
                    this.stopListeningForWord();
                }
            }, 10000);
        }
    }

    stopListeningForWord() {
        if (this.speechRecognition && this.isListening) {
            this.speechRecognition.stop();
        }
        
        // Clear the timeout
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }
    }

    stopSpeechRecognitionSession() {
        if (this.speechRecognition && this.speechRecognitionActive) {
            this.speechRecognition.stop();
            this.speechRecognitionActive = false;
        }
        
        // Clear the timeout
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }
    }

    // Legacy method for backward compatibility
    startSpeechRecognition() {
        this.startListeningForWord();
    }

    stopSpeechRecognition() {
        this.stopListeningForWord();
    }

    processReadingResult(recognizedText) {
        // Stop listening for current word once we have a result
        if (this.isListening) {
            this.stopListeningForWord();
        }

        const currentWord = this.wordList[this.currentWordIndex].toLowerCase();
        
        console.log('processReadingResult called with:');
        console.log('- recognizedText:', recognizedText);
        console.log('- currentWord:', currentWord);
        console.log('- recognizedText type:', typeof recognizedText);
        console.log('- currentWord type:', typeof currentWord);
        
        // Validate recognized text
        if (!recognizedText || typeof recognizedText !== 'string' || recognizedText.trim().length === 0) {
            console.log('Invalid or empty recognized text, treating as incorrect');
            this.displayRecognizedText('I didn\'t hear anything', false);
            this.updateRecordingStatus('ready', 'I didn\'t hear anything. Please speak clearly and try again!');
            
            // Show feedback for no recognition
            setTimeout(() => {
                this.showReadingFeedback(false, currentWord, 'nothing heard');
            }, 1000);
            
            // Move to next word after feedback
            setTimeout(() => {
                this.nextWord();
            }, 3000);
            return;
        }
        
        // Enhanced matching: check exact match first, then homophones
        let isCorrect = false;
        
        // Clean up the recognized text
        const cleanRecognizedText = recognizedText.toLowerCase().trim();
        
        // First check for exact match
        if (cleanRecognizedText.includes(currentWord)) {
            isCorrect = true;
        } else {
            // Check if the recognized text matches any homophones of the current word
            const homophones = this.homophones[currentWord] || [];
            for (const homophone of homophones) {
                if (cleanRecognizedText.includes(homophone)) {
                    isCorrect = true;
                    console.log(`Matched homophone: ${homophone} for ${currentWord}`);
                    break;
                }
            }
        }
        
        console.log('- isCorrect:', isCorrect);
        console.log('- includes check:', cleanRecognizedText, 'includes', currentWord, '=', isCorrect);
        
        // Display what was heard
        this.displayRecognizedText(recognizedText, isCorrect);
        
        // Update recording status
        if (isCorrect) {
            this.updateRecordingStatus('ready', 'Great job!');
        } else {
            this.updateRecordingStatus('ready', 'Try again!');
        }
        
        // Record attempt
        window.progressTracker.recordAttempt(currentWord, isCorrect);
        
        // Update score
        if (isCorrect) {
            this.score += 10;
            this.starsEarned += 1;
            this.showMicroCelebration('word');
        }
        
        // Show feedback and move to next word
        setTimeout(() => {
            this.showReadingFeedback(isCorrect, currentWord, recognizedText);
        }, 2000);
        
        // Move to next word after feedback
        setTimeout(() => {
            this.nextWord();
        }, 4000);
    }

    displayRecognizedText(text, isCorrect) {
        const recognizedDiv = document.getElementById('recognized-text');
        recognizedDiv.textContent = `"${text}"`;
        recognizedDiv.className = `recognized-text ${isCorrect ? 'correct' : 'incorrect'}`;
    }

    clearRecognizedText() {
        const recognizedDiv = document.getElementById('recognized-text');
        recognizedDiv.textContent = '';
        recognizedDiv.className = 'recognized-text';
    }

    showReadingFeedback(isCorrect, correctWord, recognizedText) {
        const feedbackArea = document.getElementById('feedback-area');
        const feedbackMessage = document.getElementById('feedback-message');
        
        if (isCorrect) {
            feedbackMessage.innerHTML = `
                <div class="feedback-text">Perfect! I heard you say "${recognizedText}" and you got it right! 🎉</div>
            `;
            feedbackMessage.className = 'feedback-message correct';
            this.showCelebration();
        } else {
            feedbackMessage.innerHTML = `
                <div class="feedback-text">Good try! I heard you say "${recognizedText}" but the word is "${correctWord}"</div>
            `;
            feedbackMessage.className = 'feedback-message incorrect';
        }
        
        feedbackArea.style.display = 'block';
        
        // Speak simple feedback without sentences for Reading Practice
        if (isCorrect) {
            console.log('Playing encouragement for correct answer');
            window.audioController.speakEncouragement().catch(error => {
                console.error('Error playing encouragement:', error);
            });
        } else {
            // For reading practice, speak the correct word pronunciation when student gets it wrong
            // Use the dynamic phrase handling to avoid double word pronunciation
            console.log('Playing correction audio for incorrect answer');
            window.audioController.speak(`Good try! I heard you say ${recognizedText} but the word is ${correctWord}`, {
                rate: 0.8,
                pitch: 1.0,
                volume: 0.8
            }).catch(error => {
                console.error('Error playing correction:', error);
            });
        }
    }

    resetReadingUI() {
        if (this.speechRecognitionActive && this.microphonePermissionGranted) {
            this.updateRecordingStatus('ready', 'Ready!');
        } else if (!this.microphonePermissionGranted && this.microphonePermissionRequested) {
            this.updateRecordingStatus('error', 'Microphone permission needed');
        } else {
            this.updateRecordingStatus('', '');
        }
        this.updateRecordButton(false);
        this.clearRecognizedText();
        this.hideLiveTranscription();
    }

    updateLiveTranscription(text) {
        const liveTranscriptionDiv = document.getElementById('live-transcription');
        if (text) {
            liveTranscriptionDiv.textContent = `"${text}"`;
            liveTranscriptionDiv.classList.add('active');
        } else {
            liveTranscriptionDiv.textContent = '';
            liveTranscriptionDiv.classList.remove('active');
        }
    }

    showLiveTranscription() {
        const liveTranscriptionDiv = document.getElementById('live-transcription');
        liveTranscriptionDiv.style.display = 'block';
        liveTranscriptionDiv.textContent = '...';
        liveTranscriptionDiv.classList.add('active');
    }

    hideLiveTranscription() {
        const liveTranscriptionDiv = document.getElementById('live-transcription');
        liveTranscriptionDiv.style.display = 'none';
        liveTranscriptionDiv.classList.remove('active');
    }

    updateRecordingStatus(type, message) {
        const statusDiv = document.getElementById('recording-status');
        statusDiv.className = `recording-status ${type}`;
        statusDiv.textContent = message;
    }

    updateRecordButton(listening) {
        const recordBtn = document.getElementById('record-button');
        const recordText = recordBtn.querySelector('.record-text');
        
        if (listening) {
            recordBtn.classList.add('recording');
            recordText.textContent = 'Stop';
        } else {
            recordBtn.classList.remove('recording');
            recordText.textContent = 'Say the Word';
        }
    }

    loadCurrentWord(shouldSpeak = false) {
        // Check if we have a valid word list
        if (!this.wordList || this.wordList.length === 0) {
            console.error('No word list available');
            this.endGame();
            return;
        }
        
        if (this.currentWordIndex >= this.wordList.length) {
            this.endGame();
            return;
        }

        const currentWord = this.wordList[this.currentWordIndex];
        
        // Track word usage to prevent immediate repetition
        this.trackWordUsage(currentWord);
        
        // Update word displays with enhanced visual elements
        document.querySelectorAll('#scramble-word-display').forEach(el => {
            // Don't show sentence in scramble game - kids could copy the word
            el.innerHTML = `
                <div class="word-display-enhanced">
                    <span class="word-text">Click the speaker button to hear the word</span>
                </div>
            `;
        });

        // Update spelling and multiple choice displays without sentences
        document.querySelectorAll('#current-word-display, #mc-word-display').forEach(el => {
            el.innerHTML = `
                <div class="word-display-enhanced">
                    <span class="word-text">Click the speaker button to hear the word</span>
                </div>
            `;
        });

        // Special handling for flash card - show the actual word on front
        const flashWordDisplay = document.getElementById('flash-word-display');
        if (flashWordDisplay && currentWord) {
            flashWordDisplay.innerHTML = `
                <div class="word-display-enhanced">
                    <span class="word-text">${currentWord}</span>
                </div>
            `;
        }

        // Special handling for reading practice - show the actual word
        const readingWordDisplay = document.getElementById('reading-word-display');
        if (readingWordDisplay && currentWord) {
            readingWordDisplay.innerHTML = `
                <div class="word-display-enhanced">
                    <span class="word-text">${currentWord}</span>
                </div>
            `;
        }

        // Update the spelling on the back of the flash card
        const wordSpelling = document.getElementById('word-spelling');
        if (wordSpelling && currentWord) {
            wordSpelling.textContent = currentWord;
        }

        // Update progress
        this.updateGameHeader();
        
        // Reset game state
        this.clearFeedback();
        
        // Speak the word if requested (for initial load)
        // Note: Reading practice doesn't speak the word automatically - students try first
        if (shouldSpeak && this.currentGame !== 'reading-practice') {
            setTimeout(() => {
                this.speakCurrentWord();
            }, 500);
        }
        
        // Reset game-specific content for current game mode
        if (this.currentGame === 'scramble') {
            this.generateScrambledLetters();
        } else if (this.currentGame === 'spelling') {
            // Clear the input field for spelling challenge
            const input = document.getElementById('word-input');
            if (input) {
                input.value = '';
                input.disabled = false;
                input.style.opacity = '1';
                input.style.cursor = 'text';
            }
            
            // Reset the check button
            const checkBtn = document.getElementById('check-spelling');
            if (checkBtn) {
                checkBtn.disabled = true;
                checkBtn.style.opacity = '0.5';
                checkBtn.style.cursor = 'not-allowed';
                checkBtn.textContent = 'Check';
            }
        } else if (this.currentGame === 'multiple-choice') {
            // Regenerate multiple choice options and re-attach event listeners
            this.setupMultipleChoiceGame();
        } else if (this.currentGame === 'reading-practice') {
            // Reset reading practice UI
            this.resetReadingUI();
            // If speech recognition session is active, prepare for next word
            if (this.speechRecognitionActive && this.microphonePermissionGranted) {
                this.updateRecordingStatus('ready', 'Ready!');
                this.updateRecordButton(false);
            } else if (!this.microphonePermissionGranted && this.microphonePermissionRequested) {
                this.updateRecordingStatus('error', 'Microphone permission needed');
            }
        }
    }

    speakCurrentWord() {
        // Always speak the word, even if game is not active (for speaker button clicks)
        if (!this.wordList || this.wordList.length === 0 || 
            this.currentWordIndex >= this.wordList.length) {
            console.log('No word available to speak');
            return;
        }
        
        const currentWord = this.wordList[this.currentWordIndex];
        if (!currentWord) {
            console.log('Current word is undefined or empty');
            return;
        }
        
        console.log('Speaking word:', currentWord);
        window.audioController.speakWord(currentWord).catch(error => {
            console.error('Error speaking word:', error);
        });
    }

    // Spelling Game Methods
    checkSpellingAnswer() {
        const input = document.getElementById('word-input');
        if (!input) return;
        
        // Check if game is active
        if (!this.isGameActive) {
            console.log('Game not active, ignoring checkSpellingAnswer call');
            return;
        }
        
        // Check if we have a valid word list and current word index
        if (!this.wordList || this.wordList.length === 0 || 
            this.currentWordIndex >= this.wordList.length || 
            this.currentWordIndex < 0) {
            console.error('Invalid word list or current word index');
            return;
        }
        
        const userAnswer = input.value.trim().toLowerCase();
        const correctWord = this.wordList[this.currentWordIndex].toLowerCase();
        
        // Check for exact match first, then homophones
        let isCorrect = false;
        
        // First check for exact match
        if (userAnswer === correctWord) {
            isCorrect = true;
        } else {
            // Check if the user's answer matches any homophones of the correct word
            const homophones = this.homophones[correctWord] || [];
            for (const homophone of homophones) {
                if (userAnswer === homophone.toLowerCase()) {
                    isCorrect = true;
                    console.log(`Matched homophone: ${homophone} for ${correctWord}`);
                    break;
                }
            }
        }
        this.handleAnswer(isCorrect, correctWord, userAnswer);
    }

    // Scramble Game Methods
    generateScrambledLetters() {
        // Check if we have a valid word list and current word index
        if (!this.wordList || this.wordList.length === 0 || 
            this.currentWordIndex >= this.wordList.length || 
            this.currentWordIndex < 0) {
            console.error('Invalid word list or current word index in generateScrambledLetters');
            return;
        }
        
        const currentWord = this.wordList[this.currentWordIndex];
        
        // Check if current word is valid
        if (!currentWord || currentWord === undefined || currentWord === null || typeof currentWord !== 'string') {
            console.error('Current word is invalid in generateScrambledLetters:', {
                currentWord,
                wordList: this.wordList,
                currentWordIndex: this.currentWordIndex,
                wordListLength: this.wordList?.length
            });
            return;
        }
        
        const letters = currentWord.split('');
        
        // Shuffle letters
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }

        const letterBank = document.getElementById('letter-bank');
        const wordSlot = document.getElementById('word-slot');
        
        // Clear existing content
        letterBank.innerHTML = '';
        wordSlot.innerHTML = '';
        
        // Create letter tiles - each letter appears exactly once
        letters.forEach((letter, index) => {
            const tile = document.createElement('div');
            tile.className = 'letter-tile';
            tile.textContent = letter.toUpperCase();
            tile.draggable = true;
            tile.dataset.letter = letter.toLowerCase();
            tile.dataset.originalIndex = index; // Track original position
            letterBank.appendChild(tile);
        });

        // Create word slots - exactly the number of letters in the word
        for (let i = 0; i < currentWord.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.dataset.position = i;
            wordSlot.appendChild(slot);
        }
    }

    setupDragAndDrop() {
        const letterBank = document.getElementById('letter-bank');
        const wordSlot = document.getElementById('word-slot');
        let draggedTile = null;

        // Letter tiles
        letterBank.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('letter-tile')) {
                draggedTile = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.letter);
            }
        });

        letterBank.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            draggedTile = null;
        });

        // Word slots
        wordSlot.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        wordSlot.addEventListener('drop', (e) => {
            e.preventDefault();
            const letter = e.dataTransfer.getData('text/plain');
            const slot = e.target.closest('.slot');
            
            if (slot && draggedTile) {
                // If slot already has a tile, move it back to bank
                if (slot.hasChildNodes()) {
                    const existingTile = slot.querySelector('.letter-tile');
                    if (existingTile) {
                        letterBank.appendChild(existingTile);
                        slot.classList.remove('filled');
                    }
                }
                
                // Check if we already have this letter in another slot
                const existingSlots = wordSlot.querySelectorAll('.slot.filled');
                let canPlace = true;
                
                existingSlots.forEach(existingSlot => {
                    const existingLetter = existingSlot.querySelector('.letter-tile')?.dataset.letter;
                    if (existingLetter === letter) {
                        canPlace = false;
                    }
                });
                
                if (canPlace) {
                    // Move the dragged tile to the slot
                    slot.appendChild(draggedTile);
                    slot.classList.add('filled');
                    draggedTile.classList.remove('dragging');
                } else {
                    // If letter already exists, move the dragged tile back to bank
                    letterBank.appendChild(draggedTile);
                    draggedTile.classList.remove('dragging');
                }
            }
        });

        // Allow dragging tiles back from slots to bank
        wordSlot.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('letter-tile')) {
                draggedTile = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.letter);
            }
        });

        wordSlot.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            draggedTile = null;
        });

        // Allow dropping tiles back to bank
        letterBank.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        letterBank.addEventListener('drop', (e) => {
            e.preventDefault();
            
            if (draggedTile) {
                // Move the dragged tile back to bank
                letterBank.appendChild(draggedTile);
                draggedTile.classList.remove('dragging');
                
                // Remove filled class from the slot it came from
                const slot = draggedTile.closest('.slot');
                if (slot) {
                    slot.classList.remove('filled');
                }
            }
        });

        // Touch support
        this.setupTouchSupport();
    }

    setupTouchSupport() {
        let draggedElement = null;
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        // Touch start - begin drag
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('letter-tile')) {
                draggedElement = e.target;
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                isDragging = false;
                
                // Add visual feedback
                draggedElement.style.opacity = '0.7';
                draggedElement.style.transform = 'scale(1.1)';
                draggedElement.style.zIndex = '1000';
                
                e.preventDefault();
            }
        }, { passive: false });

        // Touch move - handle drag
        document.addEventListener('touchmove', (e) => {
            if (draggedElement) {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - startX);
                const deltaY = Math.abs(touch.clientY - startY);
                
                // Start dragging if moved more than 10px
                if (deltaX > 10 || deltaY > 10) {
                    isDragging = true;
                    draggedElement.style.position = 'fixed';
                    draggedElement.style.left = (touch.clientX - 25) + 'px';
                    draggedElement.style.top = (touch.clientY - 25) + 'px';
                    draggedElement.style.pointerEvents = 'none';
                }
                
                e.preventDefault();
            }
        }, { passive: false });

        // Touch end - complete drop
        document.addEventListener('touchend', (e) => {
            if (draggedElement) {
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const slot = elementBelow?.closest('.slot');
                const letterBank = document.getElementById('letter-bank');
                const wordSlot = document.getElementById('word-slot');
                
                // Reset visual state
                draggedElement.style.opacity = '';
                draggedElement.style.transform = '';
                draggedElement.style.zIndex = '';
                draggedElement.style.position = '';
                draggedElement.style.left = '';
                draggedElement.style.top = '';
                draggedElement.style.pointerEvents = '';
                
                if (isDragging && slot) {
                    const letter = draggedElement.dataset.letter;
                    
                    // If slot already has a tile, move it back to bank
                    if (slot.hasChildNodes()) {
                        const existingTile = slot.querySelector('.letter-tile');
                        if (existingTile) {
                            letterBank.appendChild(existingTile);
                            slot.classList.remove('filled');
                        }
                    }
                    
                    // Check if we already have this letter in another slot
                    const existingSlots = wordSlot.querySelectorAll('.slot.filled');
                    let canPlace = true;
                    
                    existingSlots.forEach(existingSlot => {
                        const existingLetter = existingSlot.querySelector('.letter-tile')?.dataset.letter;
                        if (existingLetter === letter) {
                            canPlace = false;
                        }
                    });
                    
                    if (canPlace) {
                        // Move the dragged tile to the slot
                        slot.appendChild(draggedElement);
                        slot.classList.add('filled');
                    } else {
                        // Move back to bank if duplicate
                        letterBank.appendChild(draggedElement);
                    }
                } else if (isDragging && letterBank.contains(elementBelow)) {
                    // Dropped back to bank
                    letterBank.appendChild(draggedElement);
                    
                    // Remove filled class from any slot it came from
                    const slot = draggedElement.closest('.slot');
                    if (slot) {
                        slot.classList.remove('filled');
                    }
                }
                
                draggedElement = null;
                isDragging = false;
            }
        }, { passive: false });

        // Handle clicks on letter tiles for mobile (fallback)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('letter-tile') && !isDragging) {
                const letterBank = document.getElementById('letter-bank');
                const wordSlot = document.getElementById('word-slot');
                const slots = wordSlot.querySelectorAll('.slot');
                
                // Find first empty slot
                let emptySlot = null;
                for (const slot of slots) {
                    if (!slot.hasChildNodes()) {
                        emptySlot = slot;
                        break;
                    }
                }
                
                if (emptySlot) {
                    const letter = e.target.dataset.letter;
                    
                    // Check if we already have this letter in another slot
                    const existingSlots = wordSlot.querySelectorAll('.slot.filled');
                    let canPlace = true;
                    
                    existingSlots.forEach(existingSlot => {
                        const existingLetter = existingSlot.querySelector('.letter-tile')?.dataset.letter;
                        if (existingLetter === letter) {
                            canPlace = false;
                        }
                    });
                    
                    if (canPlace) {
                        // Move tile to empty slot
                        emptySlot.appendChild(e.target);
                        emptySlot.classList.add('filled');
                    }
                }
            }
        });
    }


    checkScrambleAnswer() {
        const wordSlot = document.getElementById('word-slot');
        const slots = Array.from(wordSlot.children);
        const userAnswer = slots.map(slot => {
            const tile = slot.querySelector('.letter-tile');
            return tile ? tile.dataset.letter : '';
        }).join('');
        
        const correctWord = this.wordList[this.currentWordIndex].toLowerCase();
        const isCorrect = userAnswer === correctWord;
        
        // Pass userAnswer as userWord so it can be used in correction feedback
        this.handleAnswer(isCorrect, correctWord, userAnswer);
    }

    // Multiple Choice Methods
    generateMultipleChoiceOptions() {
        // Check if we have a valid word list and current word index
        if (!this.wordList || this.wordList.length === 0 || 
            this.currentWordIndex >= this.wordList.length || 
            this.currentWordIndex < 0) {
            console.error('Invalid word list or current word index in generateMultipleChoiceOptions');
            return;
        }
        
        const currentWord = this.wordList[this.currentWordIndex];
        
        // Enhanced debugging and safety check
        if (!currentWord || currentWord === undefined || currentWord === null) {
            console.error('Current word is undefined/null:', {
                wordList: this.wordList,
                currentWordIndex: this.currentWordIndex,
                wordListLength: this.wordList?.length,
                wordAtIndex: this.wordList[this.currentWordIndex],
                wordListContents: this.wordList.map((word, index) => ({ index, word, type: typeof word }))
            });
            
            // Try to find a valid word in the list
            const validWord = this.wordList.find(word => word && word !== undefined && word !== null);
            if (validWord) {
                console.warn('Using fallback word:', validWord);
                this.wordList[this.currentWordIndex] = validWord;
            } else {
                console.error('No valid words found in word list');
                return;
            }
        }
        
        // Use the current word (either original or fallback)
        const finalCurrentWord = this.wordList[this.currentWordIndex];
        const choices = [finalCurrentWord];
        
        // Add distractor words
        const distractors = this.distractorWords.filter(word => 
            word.length === finalCurrentWord.length && word !== finalCurrentWord
        );
        
        // Shuffle and take 2-3 distractors
        const shuffledDistractors = distractors.sort(() => Math.random() - 0.5);
        choices.push(...shuffledDistractors.slice(0, 3));
        
        // Shuffle all choices
        const shuffledChoices = choices.sort(() => Math.random() - 0.5);
        
        const choiceArea = document.getElementById('choice-options');
        choiceArea.innerHTML = '';
        
        shuffledChoices.forEach(choice => {
            const option = document.createElement('div');
            option.className = 'choice-option';
            option.textContent = choice;
            choiceArea.appendChild(option);
        });
    }

    selectMultipleChoice(selectedWord) {
        const correctWord = this.wordList[this.currentWordIndex];
        const isCorrect = selectedWord === correctWord;
        
        // Highlight selected option
        document.querySelectorAll('.choice-option').forEach(option => {
            option.classList.remove('selected');
            if (option.textContent === selectedWord) {
                option.classList.add('selected');
            }
        });
        
        // Handle answer with user's selection
        this.handleAnswer(isCorrect, correctWord, selectedWord);
    }

    // Flash Cards Methods
    flipFlashCard() {
        // Disable button to prevent multiple clicks
        const flipBtn = document.getElementById('flip-card');
        flipBtn.disabled = true;
        flipBtn.textContent = 'Loading...';
        
        const card = document.getElementById('flash-card');
        const wordSpelling = document.getElementById('word-spelling');
        
        // Flip the card to show the current word
        card.classList.add('flipped');
        wordSpelling.textContent = this.wordList[this.currentWordIndex];
        
        // Only explain the purpose on the first flash card flip
        if (this.isFirstFlashCard) {
            window.audioController.speak("Look at the word and listen to help you remember it. The word is " + this.wordList[this.currentWordIndex], {
                rate: 0.8,
                pitch: 1.0,
                volume: 0.8
            }).then(() => {
                // After explaining, move to next word
                setTimeout(() => {
                    this.advanceFlashCard();
                }, 1000);
            });
            this.isFirstFlashCard = false;
        } else {
            // For subsequent cards, just speak the word and move on
            window.audioController.speakWord(this.wordList[this.currentWordIndex]).then(() => {
                setTimeout(() => {
                    this.advanceFlashCard();
                }, 1000);
            });
        }
    }
    
    advanceFlashCard() {
        // Move to next word
        this.nextWord();
        
        // Re-enable button for next card
        const flipBtn = document.getElementById('flip-card');
        flipBtn.disabled = false;
        flipBtn.textContent = 'Show Next Card';
        
        // Reset card to front (unflipped) state
        const card = document.getElementById('flash-card');
        card.classList.remove('flipped');
    }

    // Answer Handling
    handleAnswer(isCorrect, correctWord, userWord = null) {
        // Check if we have a valid word list and current word index
        if (!this.wordList || this.wordList.length === 0 || 
            this.currentWordIndex >= this.wordList.length || 
            this.currentWordIndex < 0) {
            console.error('Invalid word list or current word index in handleAnswer');
            return;
        }
        
        const currentWord = this.wordList[this.currentWordIndex];
        
        // Record attempt
        window.progressTracker.recordAttempt(currentWord, isCorrect);
        
        // Update score and consecutive correct tracking
        if (isCorrect) {
            this.score += 10;
            this.starsEarned += 1;
            this.consecutiveCorrect[currentWord] = (this.consecutiveCorrect[currentWord] || 0) + 1;
            
            // Show micro-celebration
            this.showMicroCelebration('word');
            
            // Check for achievements
            this.checkAchievements();
        } else {
            // Reset consecutive count for this word
            this.consecutiveCorrect[currentWord] = 0;
        }
        
        // Show feedback
        this.showFeedback(isCorrect, correctWord, userWord);
        
        // Determine context based on current game mode
        let context = 'typed'; // default for spelling game
        if (this.currentGame === 'multiple-choice') {
            context = 'selected';
        } else if (this.currentGame === 'scramble') {
            context = 'arranged';
        }
        
        // Speak feedback and then move to next word
        if (isCorrect) {
            // Add highlighting for multiple choice during audio
            if (this.currentGame === 'multiple-choice') {
                this.highlightSelectedChoice(true);
            }
            
            window.audioController.speakEncouragement().then(() => {
                // Read the sentence for context
                return window.audioController.speakWordStory(currentWord);
            }).then(() => {
                // Remove highlighting after audio finishes
                if (this.currentGame === 'multiple-choice') {
                    this.highlightSelectedChoice(false);
                }
                setTimeout(() => {
                    this.nextWord();
                }, 1000);
            });
        } else {
            // Add highlighting for multiple choice during audio
            if (this.currentGame === 'multiple-choice') {
                this.highlightSelectedChoice(true);
            }
            
            window.audioController.speakCorrection(correctWord, userWord, context).then(() => {
                // Read the sentence for context
                return window.audioController.speakWordStory(currentWord);
            }).then(() => {
                // Remove highlighting after audio finishes
                if (this.currentGame === 'multiple-choice') {
                    this.highlightSelectedChoice(false);
                }
                setTimeout(() => {
                    this.nextWord();
                }, 1000);
            });
        }
    }

    highlightSelectedChoice(highlight) {
        const selectedOption = document.querySelector('.choice-option.selected');
        if (selectedOption) {
            if (highlight) {
                selectedOption.classList.add('highlighted');
            } else {
                selectedOption.classList.remove('highlighted');
            }
        }
    }

    showFeedback(isCorrect, correctWord, userWord = null) {
        const feedbackArea = document.getElementById('feedback-area');
        const feedbackMessage = document.getElementById('feedback-message');
        const currentWord = this.wordList[this.currentWordIndex];
        
        if (isCorrect) {
            // Check if user wrote a homophone
            const homophones = this.homophones[currentWord] || [];
            const isHomophone = userWord && homophones.some(homophone => 
                userWord.toLowerCase() === homophone.toLowerCase()
            );
            
            if (isHomophone) {
                feedbackMessage.innerHTML = `
                    <div class="feedback-text">Great! "${userWord}" is correct too! 🎉</div>
                    <div class="feedback-text">The word we're practicing is "${correctWord}"</div>
                    <div class="feedback-sentence">${this.wordStories[currentWord]}</div>
                `;
            } else {
                feedbackMessage.innerHTML = `
                    <div class="feedback-text">Correct! 🎉</div>
                    <div class="feedback-sentence">${this.wordStories[currentWord]}</div>
                `;
            }
            feedbackMessage.className = 'feedback-message correct';
            this.showCelebration();
        } else {
            feedbackMessage.innerHTML = `
                <div class="feedback-text">Not quite. The correct spelling is "${correctWord}"</div>
                <div class="feedback-sentence">${this.wordStories[currentWord]}</div>
            `;
            feedbackMessage.className = 'feedback-message incorrect';
        }
        
        feedbackArea.style.display = 'block';
    }

    clearFeedback() {
        const feedbackArea = document.getElementById('feedback-area');
        const feedbackMessage = document.getElementById('feedback-message');
        
        feedbackArea.style.display = 'none';
        feedbackMessage.textContent = '';
        feedbackMessage.className = 'feedback-message';
        
        // Clear celebration
        const celebration = document.getElementById('celebration');
        celebration.innerHTML = '';
    }

    nextWord() {
        this.currentWordIndex++;
        this.clearFeedback();
        
        // Reset button states for all game modes
        this.resetScrambleCheckButton();
        
        if (this.currentWordIndex >= this.wordList.length) {
            this.endGame();
        } else {
            this.loadCurrentWord(); // Don't speak here, handle separately
            // Automatically speak the next word (except for Reading Practice and Flash Cards)
            // Reading practice: students try to say the word first, then hear correct pronunciation if wrong
            // Flash Cards: word is spoken when user flips the card, not automatically
            if (this.currentGame !== 'reading-practice' && this.currentGame !== 'flashcards') {
                setTimeout(() => {
                    this.speakCurrentWord();
                }, 500);
            }
        }
    }

    endGame() {
        this.isGameActive = false;
        
        // Stop speech recognition session if active
        if (this.speechRecognitionActive) {
            this.stopSpeechRecognitionSession();
        }
        
        // End progress tracking session
        const sessionSummary = window.progressTracker.endSession();
        
        // Show results
        this.showResults(sessionSummary);
    }

    showResults(sessionSummary) {
        this.showScreen('results');
        
        // Update result stats
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-accuracy').textContent = `${Math.round(sessionSummary.accuracy * 100)}%`;
        document.getElementById('words-completed').textContent = sessionSummary.wordsAttempted.length;
        
        // Show word-by-word results
        this.displayWordResults();
    }

    displayWordResults() {
        const wordResults = document.getElementById('word-results');
        wordResults.innerHTML = '<h3>Word Results:</h3>';
        
        this.wordList.forEach(word => {
            const stats = window.progressTracker.getWordStats(word);
            const resultDiv = document.createElement('div');
            resultDiv.className = 'word-result';
            
            const accuracyClass = stats.accuracy >= 0.8 ? 'high' : 
                                 stats.accuracy >= 0.6 ? 'medium' : 'low';
            
            resultDiv.innerHTML = `
                <span class="word">${word}</span>
                <span class="accuracy ${accuracyClass}">${Math.round(stats.accuracy * 100)}%</span>
            `;
            
            wordResults.appendChild(resultDiv);
        });
    }

    updateGameHeader() {
        document.getElementById('game-title').textContent = this.getGameTitle();
        document.getElementById('current-word').textContent = `Word ${this.currentWordIndex + 1} of ${this.wordList.length}`;
        document.getElementById('score').textContent = `Score: ${this.score}`;
        
        const progressPercent = (this.currentWordIndex / this.wordList.length) * 100;
        document.getElementById('session-progress').style.width = `${progressPercent}%`;
    }

    getGameTitle() {
        const titles = {
            'spelling': '✍️ Spelling Challenge',
            'scramble': '🔤 Letter Scramble',
            'multiple-choice': '🎯 Multiple Choice',
            'flashcards': '⚡ Flash Cards',
            'reading-practice': '🎤 Reading Practice'
        };
        return titles[this.currentGame] || 'Game';
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.gameState = screenName;
        
        if (screenName === 'welcome') {
            this.updateProgressDisplay();
        }
    }

    updateProgressDisplay() {
        window.progressTracker.updateProgressDisplay();
    }

    showProgressDetails() {
        const stats = window.progressTracker.getAllStats();
        alert(`Progress Details:\n\nTotal Attempts: ${stats.totalAttempts}\nOverall Accuracy: ${Math.round(stats.overallAccuracy * 100)}%\n\nWeak Words: ${window.progressTracker.getWeakWords().join(', ') || 'None!'}`);
    }

    showCelebration() {
        this.createConfetti();
    }

    createConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const confettiPieces = [];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }
        
        // Animate confetti
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            confettiPieces.forEach((piece, index) => {
                piece.x += piece.vx;
                piece.y += piece.vy;
                piece.rotation += piece.rotationSpeed;
                
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation * Math.PI / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size/2, -piece.size/2, piece.size, piece.size);
                ctx.restore();
                
                // Remove pieces that are off screen
                if (piece.y > canvas.height + 10) {
                    confettiPieces.splice(index, 1);
                }
            });
            
            if (confettiPieces.length > 0) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        
        animate();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sightWordsGame = new SightWordsGame();
    
    // Unlock audio context for iOS Safari on any user interaction
    const unlockAudio = () => {
        if (window.audioController) {
            window.audioController.unlock();
        }
        // Remove listeners after first unlock
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    };
    
    // Add listeners for iOS Safari audio unlock
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SightWordsGame;
}
