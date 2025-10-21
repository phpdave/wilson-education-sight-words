// Sight Words Game - Progress Tracking
// Handles localStorage persistence and analytics

class ProgressTracker {
    constructor() {
        this.storageKey = 'sight-words-progress';
        this.wordBank = [
            'her', 'who', 'some', 'out', 'about', 'too', 'two', 'were', 'what', 'come', 'comes', 'coming', 'become', 'becomes', 'becoming',
            'their', 'no', 'so', 'also', 'how', 'now', 'where', 'here', 'there', 'any', 'anywhere', 'anyone', 'anything',
            'many', 'front', 'very', 'every', 'everywhere', 'everyone', 'everything', 'could', 'would', 'should',
            'when', 'which', 'been', 'said', 'each', 'asked', 'why', 'by', 'my', 'try', 'put', 'putting',
            'only', 'work', 'word', 'world'
        ];
        this.progress = this.loadProgress();
        this.sessionStats = {
            startTime: null,
            endTime: null,
            totalAttempts: 0,
            correctAttempts: 0,
            wordsAttempted: new Set(),
            gameType: null,
            averageResponseTime: 0,
            learningStreaks: {},
            difficultyProgression: []
        };
        this.learningInsights = {
            strongestWords: [],
            weakestWords: [],
            recommendedPracticeTime: 15,
            optimalSessionLength: 12,
            learningStyle: 'mixed' // visual, auditory, kinesthetic, mixed
        };
    }

    loadProgress() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Ensure all words are tracked
                const progress = {};
                this.wordBank.forEach(word => {
                    progress[word] = parsed[word] || {
                        attempts: 0,
                        correct: 0,
                        lastAttempted: null,
                        accuracy: 0
                    };
                });
                return progress;
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
        
        // Initialize empty progress
        const progress = {};
        this.wordBank.forEach(word => {
            progress[word] = {
                attempts: 0,
                correct: 0,
                lastAttempted: null,
                accuracy: 0
            };
        });
        return progress;
    }

    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    startSession(gameType) {
        this.sessionStats = {
            startTime: new Date(),
            endTime: null,
            totalAttempts: 0,
            correctAttempts: 0,
            wordsAttempted: new Set(),
            gameType: gameType
        };
    }

    endSession() {
        this.sessionStats.endTime = new Date();
        this.saveProgress();
        return this.getSessionSummary();
    }

    recordAttempt(word, isCorrect) {
        // Ensure word exists in progress tracking
        if (!this.progress[word]) {
            console.warn(`Word "${word}" not found in progress tracking, initializing...`);
            this.progress[word] = {
                attempts: 0,
                correct: 0,
                lastAttempted: null,
                accuracy: 0
            };
        }
        
        // Update word progress
        this.progress[word].attempts++;
        if (isCorrect) {
            this.progress[word].correct++;
        }
        this.progress[word].lastAttempted = new Date().toISOString();
        this.progress[word].accuracy = this.progress[word].correct / this.progress[word].attempts;

        // Update session stats
        this.sessionStats.totalAttempts++;
        if (isCorrect) {
            this.sessionStats.correctAttempts++;
        }
        this.sessionStats.wordsAttempted.add(word);

        // Save progress
        this.saveProgress();
    }

    // Enhanced analytics and learning insights
    generateLearningInsights() {
        const wordStats = this.wordBank.map(word => {
            const stats = this.progress[word] || { attempts: 0, correct: 0 };
            const accuracy = stats.attempts > 0 ? (stats.correct / stats.attempts) : 0;
            return { word, accuracy, attempts: stats.attempts };
        });

        // Sort by accuracy
        wordStats.sort((a, b) => b.accuracy - a.accuracy);
        
        this.learningInsights.strongestWords = wordStats.slice(0, 3).map(s => s.word);
        this.learningInsights.weakestWords = wordStats.slice(-3).map(s => s.word);
        
        // Calculate optimal session length based on attention span
        const totalAttempts = wordStats.reduce((sum, s) => sum + s.attempts, 0);
        if (totalAttempts > 50) {
            this.learningInsights.optimalSessionLength = 15;
        } else if (totalAttempts > 20) {
            this.learningInsights.optimalSessionLength = 12;
        } else {
            this.learningInsights.optimalSessionLength = 8;
        }
        
        // Detect learning style based on game performance
        this.detectLearningStyle();
        
        return this.learningInsights;
    }

    detectLearningStyle() {
        // This would analyze performance across different game modes
        // For now, we'll use a simple heuristic
        const totalAttempts = Object.values(this.progress).reduce((sum, p) => sum + p.attempts, 0);
        
        if (totalAttempts < 10) {
            this.learningInsights.learningStyle = 'mixed';
        } else {
            // Analyze which game modes show better performance
            // This would require tracking game mode performance
            this.learningInsights.learningStyle = 'mixed';
        }
    }

    getDetailedAnalytics() {
        const insights = this.generateLearningInsights();
        const overallStats = this.getOverallStats();
        
        return {
            ...overallStats,
            insights,
            sessionHistory: this.getSessionHistory(),
            improvementTrends: this.getImprovementTrends(),
            recommendedActions: this.getRecommendedActions()
        };
    }

    getSessionHistory() {
        // Return last 10 sessions for trend analysis
        const sessions = JSON.parse(localStorage.getItem('sight-words-sessions') || '[]');
        return sessions.slice(-10);
    }

    getImprovementTrends() {
        const sessions = this.getSessionHistory();
        if (sessions.length < 2) return { trend: 'insufficient_data' };
        
        const recentAccuracy = sessions.slice(-3).reduce((sum, s) => sum + s.accuracy, 0) / 3;
        const olderAccuracy = sessions.slice(-6, -3).reduce((sum, s) => sum + s.accuracy, 0) / 3;
        
        if (recentAccuracy > olderAccuracy + 0.1) return { trend: 'improving' };
        if (recentAccuracy < olderAccuracy - 0.1) return { trend: 'declining' };
        return { trend: 'stable' };
    }

    getRecommendedActions() {
        const insights = this.generateLearningInsights();
        const actions = [];
        
        if (insights.weakestWords.length > 0) {
            actions.push(`Focus on: ${insights.weakestWords.join(', ')}`);
        }
        
        if (insights.learningStyle === 'visual') {
            actions.push('Try more visual games like Letter Scramble');
        } else if (insights.learningStyle === 'auditory') {
            actions.push('Try more audio-focused games like Flash Cards');
        }
        
        const trend = this.getImprovementTrends();
        if (trend.trend === 'declining') {
            actions.push('Take a short break and try again later');
        }
        
        return actions;
    }

    getWordAccuracy(word) {
        // Check if word exists in progress, if not return 0 accuracy
        if (!this.progress[word]) {
            console.warn(`Word "${word}" not found in progress tracking, returning 0 accuracy`);
            return 0;
        }
        
        return this.progress[word].accuracy;
    }

    getWordStats(word) {
        // Check if word exists in progress, if not return default stats
        if (!this.progress[word]) {
            console.warn(`Word "${word}" not found in progress tracking, returning default stats`);
            return {
                attempts: 0,
                correct: 0,
                lastAttempted: null,
                accuracy: 0
            };
        }
        
        return {
            ...this.progress[word],
            accuracy: this.progress[word].accuracy
        };
    }

    getAllStats() {
        const stats = {
            totalAttempts: 0,
            totalCorrect: 0,
            overallAccuracy: 0,
            words: {}
        };

        this.wordBank.forEach(word => {
            const wordStats = this.progress[word] || {
                attempts: 0,
                correct: 0,
                lastAttempted: null,
                accuracy: 0
            };
            stats.totalAttempts += wordStats.attempts;
            stats.totalCorrect += wordStats.correct;
            stats.words[word] = wordStats;
        });

        if (stats.totalAttempts > 0) {
            stats.overallAccuracy = stats.totalCorrect / stats.totalAttempts;
        }

        return stats;
    }

    getWeakWords(threshold = 0.7) {
        return this.wordBank.filter(word => {
            const accuracy = this.getWordAccuracy(word);
            const wordStats = this.progress[word] || { attempts: 0 };
            return accuracy < threshold && wordStats.attempts > 0;
        });
    }

    getStrongWords(threshold = 0.8) {
        return this.wordBank.filter(word => {
            const accuracy = this.getWordAccuracy(word);
            const wordStats = this.progress[word] || { attempts: 0 };
            return accuracy >= threshold && wordStats.attempts > 0;
        });
    }

    getWordsNeedingPractice(minAttempts = 3) {
        return this.wordBank.filter(word => {
            const stats = this.progress[word] || {
                attempts: 0,
                accuracy: 0
            };
            return stats.attempts < minAttempts || stats.accuracy < 0.7;
        });
    }

    getSessionSummary() {
        const duration = this.sessionStats.endTime - this.sessionStats.startTime;
        const sessionAccuracy = this.sessionStats.totalAttempts > 0 
            ? this.sessionStats.correctAttempts / this.sessionStats.totalAttempts 
            : 0;

        return {
            duration: duration,
            durationMinutes: Math.round(duration / 60000),
            totalAttempts: this.sessionStats.totalAttempts,
            correctAttempts: this.sessionStats.correctAttempts,
            accuracy: sessionAccuracy,
            wordsAttempted: Array.from(this.sessionStats.wordsAttempted),
            gameType: this.sessionStats.gameType,
            startTime: this.sessionStats.startTime,
            endTime: this.sessionStats.endTime
        };
    }

    generateWordList(count = 10, prioritizeWeak = true) {
        let wordPool = [...this.wordBank];
        
        if (prioritizeWeak) {
            const weakWords = this.getWeakWords();
            const otherWords = this.wordBank.filter(word => !weakWords.includes(word));
            
            // Prioritize weak words but include others
            wordPool = [...weakWords, ...otherWords];
        }

        // Shuffle the pool
        const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
        
        // Generate list with repetition if needed
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(shuffled[i % shuffled.length]);
        }

        return result;
    }

    resetProgress() {
        this.wordBank.forEach(word => {
            this.progress[word] = {
                attempts: 0,
                correct: 0,
                lastAttempted: null,
                accuracy: 0
            };
        });
        this.saveProgress();
    }

    exportProgress() {
        const data = {
            progress: this.progress,
            stats: this.getAllStats(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `sight-words-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importProgress(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (data.progress && data.version) {
                this.progress = data.progress;
                this.saveProgress();
                return true;
            }
        } catch (error) {
            console.error('Error importing progress:', error);
        }
        return false;
    }

    // Get progress for display in UI
    getDisplayStats() {
        const stats = this.getAllStats();
        const weakWords = this.getWeakWords();
        
        return {
            totalAttempts: stats.totalAttempts,
            overallAccuracy: Math.round(stats.overallAccuracy * 100),
            weakWords: weakWords,
            weakWordsCount: weakWords.length,
            needsPractice: this.getWordsNeedingPractice().length
        };
    }

    // Update UI elements with current progress
    updateProgressDisplay() {
        const displayStats = this.getDisplayStats();
        
        // Update welcome screen stats
        const totalAttemptsEl = document.getElementById('total-attempts');
        const accuracyRateEl = document.getElementById('accuracy-rate');
        const weakWordsEl = document.getElementById('weak-words-display');
        
        if (totalAttemptsEl) {
            totalAttemptsEl.textContent = displayStats.totalAttempts;
        }
        
        if (accuracyRateEl) {
            accuracyRateEl.textContent = `${displayStats.overallAccuracy}%`;
        }
        
        if (weakWordsEl) {
            if (displayStats.weakWordsCount > 0) {
                weakWordsEl.innerHTML = `
                    <p><strong>Words needing practice:</strong></p>
                    <div class="weak-word-list">
                        ${displayStats.weakWords.map(word => `<span class="weak-word-tag">${word}</span>`).join('')}
                    </div>
                `;
            } else {
                weakWordsEl.innerHTML = '<p>Keep practicing all words! 🎉</p>';
            }
        }
    }
}

// Create global progress tracker instance
window.progressTracker = new ProgressTracker();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressTracker;
}
