// AI-Powered Backing Track Generation Engine
// Handles Gemini API integration with token management and cost control

class AIEngine {
    constructor() {
        this.tokenUsage = this.loadTokenUsage();
        this.userQuotas = this.loadUserQuotas();
        this.cache = new Map();
        this.rateLimits = new Map();
        
        // Load configuration (in production, this would come from server)
        this.config = {
            MONTHLY_TOKEN_LIMIT: 1000000,
            DAILY_TOKEN_LIMIT: 33333,
            USER_DAILY_LIMIT: 100,
            FREE_TRACKS_PER_USER: 3,
            REQUESTS_PER_MINUTE: 10,
            CACHE_DURATION: 24 * 60 * 60 * 1000,
            FALLBACK_THRESHOLD: 0.9
        };
    }

    async generateBackingTrack(songData, mood, genre, userKey, userId = 'anonymous') {
        try {
            // Check user quotas and rate limits
            if (!this.checkUserQuota(userId)) {
                throw new Error('Daily quota exceeded. Please try again tomorrow or upgrade to premium.');
            }

            if (!this.checkRateLimit(userId)) {
                throw new Error('Too many requests. Please wait a moment before trying again.');
            }

            // Check global token limits
            if (this.shouldUseFallback()) {
                console.log('Using fallback generation due to token limits');
                return this.generateFallbackTrack(songData, mood, genre, userKey);
            }

            // Generate cache key
            const cacheKey = this.generateCacheKey(songData, mood, genre, userKey);
            
            // Check cache first
            if (this.cache.has(cacheKey)) {
                const cached = this.cache.get(cacheKey);
                if (Date.now() - cached.timestamp < this.config.CACHE_DURATION) {
                    console.log('Returning cached result');
                    return cached.data;
                }
                this.cache.delete(cacheKey);
            }

            // Generate AI-powered backing track
            const aiResult = await this.callGeminiAPI(songData, mood, genre, userKey);
            
            // Update usage tracking
            this.updateTokenUsage(aiResult.tokensUsed, userId);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: aiResult.backingTrack,
                timestamp: Date.now()
            });

            return aiResult.backingTrack;

        } catch (error) {
            console.error('AI generation failed:', error);
            // Fallback to Web Audio API generation
            return this.generateFallbackTrack(songData, mood, genre, userKey);
        }
    }

    async callGeminiAPI(songData, mood, genre, userKey) {
        const prompt = this.buildOptimizedPrompt(songData, mood, genre, userKey);
        
        // Simulate API call (in production, this would be a real server-side call)
        const response = await this.simulateGeminiCall(prompt);
        
        return {
            backingTrack: this.parseAIResponse(response),
            tokensUsed: this.estimateTokens(prompt + response)
        };
    }

    buildOptimizedPrompt(songData, mood, genre, userKey) {
        // Highly optimized prompt to minimize token usage
        return `Generate backing track config for:
Song: ${songData.title}
Key: ${userKey}
Mood: ${mood}
Genre: ${genre}

Return JSON:
{
  "tempo": <bpm>,
  "instruments": {
    "drums": {"pattern": "<pattern>", "intensity": <0-1>},
    "bass": {"notes": [<notes>], "rhythm": "<rhythm>"},
    "melody": {"progression": [<chords>], "style": "<style>"},
    "harmony": {"type": "<type>", "complexity": <0-1>}
  },
  "structure": ["intro", "verse", "chorus", "bridge", "outro"]
}`;
    }

    async simulateGeminiCall(prompt) {
        // Simulate API processing time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Mock AI response based on prompt analysis
        const mockResponse = `{
  "tempo": 120,
  "instruments": {
    "drums": {"pattern": "standard-rock", "intensity": 0.7},
    "bass": {"notes": ["C", "F", "G", "Am"], "rhythm": "quarter-notes"},
    "melody": {"progression": ["C", "Am", "F", "G"], "style": "acoustic-guitar"},
    "harmony": {"type": "strings", "complexity": 0.6}
  },
  "structure": ["intro", "verse", "chorus", "verse", "chorus", "bridge", "chorus", "outro"]
}`;
        
        return mockResponse;
    }

    parseAIResponse(response) {
        try {
            const config = JSON.parse(response);
            return {
                tempo: config.tempo || 120,
                instruments: config.instruments || {},
                structure: config.structure || ['intro', 'verse', 'chorus', 'outro'],
                aiGenerated: true
            };
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return this.getDefaultConfig();
        }
    }

    generateFallbackTrack(songData, mood, genre, userKey) {
        // Use existing Web Audio API generation as fallback
        return {
            tempo: this.getTempoForMood(mood),
            instruments: this.getInstrumentsForGenre(genre),
            structure: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'outro'],
            aiGenerated: false,
            fallback: true
        };
    }

    // Token Management Methods
    checkUserQuota(userId) {
        const today = new Date().toDateString();
        const userUsage = this.userQuotas.get(userId) || { date: today, tokens: 0, tracks: 0 };
        
        // Reset if new day
        if (userUsage.date !== today) {
            userUsage.date = today;
            userUsage.tokens = 0;
            userUsage.tracks = 0;
        }
        
        // Check free track limit
        if (userUsage.tracks >= this.config.FREE_TRACKS_PER_USER) {
            return false;
        }
        
        // Check daily token limit
        return userUsage.tokens < this.config.USER_DAILY_LIMIT;
    }

    checkRateLimit(userId) {
        const now = Date.now();
        const userLimits = this.rateLimits.get(userId) || { requests: [], lastReset: now };
        
        // Clean old requests (older than 1 minute)
        userLimits.requests = userLimits.requests.filter(time => now - time < 60000);
        
        // Check rate limit
        if (userLimits.requests.length >= this.config.REQUESTS_PER_MINUTE) {
            return false;
        }
        
        // Add current request
        userLimits.requests.push(now);
        this.rateLimits.set(userId, userLimits);
        
        return true;
    }

    shouldUseFallback() {
        const usage = this.getCurrentMonthUsage();
        return usage / this.config.MONTHLY_TOKEN_LIMIT > this.config.FALLBACK_THRESHOLD;
    }

    updateTokenUsage(tokens, userId) {
        const today = new Date().toDateString();
        
        // Update global usage
        if (!this.tokenUsage.has(today)) {
            this.tokenUsage.set(today, 0);
        }
        this.tokenUsage.set(today, this.tokenUsage.get(today) + tokens);
        
        // Update user usage
        const userUsage = this.userQuotas.get(userId) || { date: today, tokens: 0, tracks: 0 };
        userUsage.tokens += tokens;
        userUsage.tracks += 1;
        this.userQuotas.set(userId, userUsage);
        
        // Save to localStorage
        this.saveTokenUsage();
        this.saveUserQuotas();
    }

    // Utility Methods
    generateCacheKey(songData, mood, genre, userKey) {
        return `${songData.title}-${mood}-${genre}-${userKey}`.toLowerCase().replace(/\s+/g, '-');
    }

    estimateTokens(text) {
        // Rough estimation: ~4 characters per token
        return Math.ceil(text.length / 4);
    }

    getCurrentMonthUsage() {
        const currentMonth = new Date().getMonth();
        let total = 0;
        
        for (const [date, usage] of this.tokenUsage) {
            const dateObj = new Date(date);
            if (dateObj.getMonth() === currentMonth) {
                total += usage;
            }
        }
        
        return total;
    }

    getTempoForMood(mood) {
        const tempos = {
            'chill': 90,
            'emotional': 75,
            'energetic': 140,
            'romantic': 80
        };
        return tempos[mood] || 120;
    }

    getInstrumentsForGenre(genre) {
        const instruments = {
            'indian-indie': { guitar: true, tabla: true, harmonium: true },
            'bollywood': { strings: true, tabla: true, flute: true },
            'indian-classical': { sitar: true, tabla: true, tanpura: true },
            'western-pop': { piano: true, drums: true, bass: true }
        };
        return instruments[genre] || { piano: true, drums: true };
    }

    getDefaultConfig() {
        return {
            tempo: 120,
            instruments: { piano: true, drums: true, bass: true },
            structure: ['intro', 'verse', 'chorus', 'outro'],
            aiGenerated: false
        };
    }

    // Storage Methods
    loadTokenUsage() {
        try {
            const stored = localStorage.getItem('covercraft_token_usage');
            return stored ? new Map(JSON.parse(stored)) : new Map();
        } catch {
            return new Map();
        }
    }

    saveTokenUsage() {
        try {
            localStorage.setItem('covercraft_token_usage', JSON.stringify([...this.tokenUsage]));
        } catch (error) {
            console.error('Failed to save token usage:', error);
        }
    }

    loadUserQuotas() {
        try {
            const stored = localStorage.getItem('covercraft_user_quotas');
            return stored ? new Map(JSON.parse(stored)) : new Map();
        } catch {
            return new Map();
        }
    }

    saveUserQuotas() {
        try {
            localStorage.setItem('covercraft_user_quotas', JSON.stringify([...this.userQuotas]));
        } catch (error) {
            console.error('Failed to save user quotas:', error);
        }
    }

    // Admin Methods for Monitoring
    getUsageStats() {
        return {
            monthlyUsage: this.getCurrentMonthUsage(),
            monthlyLimit: this.config.MONTHLY_TOKEN_LIMIT,
            percentageUsed: (this.getCurrentMonthUsage() / this.config.MONTHLY_TOKEN_LIMIT) * 100,
            cacheSize: this.cache.size,
            activeUsers: this.userQuotas.size
        };
    }
}
