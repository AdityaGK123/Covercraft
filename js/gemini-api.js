// GeminiAPI Integration for CapabilityGym
class GeminiAPIManager {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
        this.maxTokensPerUser = 10000; // Conservative limit per user
        this.globalTokenLimit = 950000; // Leave buffer from 1M limit
        this.tokenUsage = this.loadTokenUsage();
        this.rateLimiter = new Map(); // For rate limiting per user
    }

    // Initialize with API key
    initialize(apiKey) {
        this.apiKey = apiKey;
        return this.testConnection();
    }

    // Test API connection
    async testConnection() {
        try {
            const response = await this.generateContent("Hello", { maxTokens: 10 });
            return { success: true, message: "API connection successful" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Load token usage from localStorage
    loadTokenUsage() {
        const saved = localStorage.getItem('geminiTokenUsage');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            global: 0,
            users: {},
            dailyUsage: {},
            lastReset: new Date().toDateString()
        };
    }

    // Save token usage to localStorage
    saveTokenUsage() {
        localStorage.setItem('geminiTokenUsage', JSON.stringify(this.tokenUsage));
    }

    // Check if user can make a request
    canUserMakeRequest(userId, estimatedTokens = 500) {
        const today = new Date().toDateString();
        
        // Reset daily usage if new day
        if (this.tokenUsage.lastReset !== today) {
            this.tokenUsage.dailyUsage = {};
            this.tokenUsage.lastReset = today;
        }

        // Check global limit
        if (this.tokenUsage.global + estimatedTokens > this.globalTokenLimit) {
            return { 
                allowed: false, 
                reason: 'Global token limit reached',
                globalUsage: this.tokenUsage.global,
                globalLimit: this.globalTokenLimit
            };
        }

        // Check user limit
        const userUsage = this.tokenUsage.users[userId] || 0;
        if (userUsage + estimatedTokens > this.maxTokensPerUser) {
            return { 
                allowed: false, 
                reason: 'User token limit reached',
                userUsage: userUsage,
                userLimit: this.maxTokensPerUser
            };
        }

        // Check daily rate limit (100 requests per user per day)
        const dailyUsage = this.tokenUsage.dailyUsage[userId] || 0;
        if (dailyUsage >= 100) {
            return { 
                allowed: false, 
                reason: 'Daily request limit reached',
                dailyUsage: dailyUsage
            };
        }

        return { allowed: true };
    }

    // Update token usage after API call
    updateTokenUsage(userId, tokensUsed) {
        const today = new Date().toDateString();
        
        // Update global usage
        this.tokenUsage.global += tokensUsed;
        
        // Update user usage
        if (!this.tokenUsage.users[userId]) {
            this.tokenUsage.users[userId] = 0;
        }
        this.tokenUsage.users[userId] += tokensUsed;
        
        // Update daily usage
        if (!this.tokenUsage.dailyUsage[userId]) {
            this.tokenUsage.dailyUsage[userId] = 0;
        }
        this.tokenUsage.dailyUsage[userId] += 1;
        
        this.saveTokenUsage();
    }

    // Generate content with Gemini API
    async generateContent(prompt, options = {}) {
        const userId = options.userId || 'anonymous';
        const estimatedTokens = this.estimateTokens(prompt);
        
        // Check if request is allowed
        const canRequest = this.canUserMakeRequest(userId, estimatedTokens);
        if (!canRequest.allowed) {
            throw new Error(`Request blocked: ${canRequest.reason}`);
        }

        if (!this.apiKey) {
            throw new Error('Gemini API key not configured');
        }

        try {
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: options.temperature || 0.7,
                    topK: options.topK || 40,
                    topP: options.topP || 0.95,
                    maxOutputTokens: options.maxTokens || 500,
                    stopSequences: options.stopSequences || []
                }
            };

            const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            
            // Extract response text
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            // Calculate actual tokens used (approximate)
            const tokensUsed = this.estimateTokens(prompt + responseText);
            
            // Update usage tracking
            this.updateTokenUsage(userId, tokensUsed);
            
            return {
                text: responseText,
                tokensUsed: tokensUsed,
                usage: this.getUsageStats(userId)
            };

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    // Estimate token count (rough approximation)
    estimateTokens(text) {
        // Rough estimation: ~4 characters per token for English text
        return Math.ceil(text.length / 4);
    }

    // Get usage statistics
    getUsageStats(userId = null) {
        const stats = {
            global: {
                used: this.tokenUsage.global,
                limit: this.globalTokenLimit,
                remaining: this.globalTokenLimit - this.tokenUsage.global,
                percentage: (this.tokenUsage.global / this.globalTokenLimit * 100).toFixed(1)
            }
        };

        if (userId) {
            const userUsage = this.tokenUsage.users[userId] || 0;
            const dailyUsage = this.tokenUsage.dailyUsage[userId] || 0;
            
            stats.user = {
                used: userUsage,
                limit: this.maxTokensPerUser,
                remaining: this.maxTokensPerUser - userUsage,
                percentage: (userUsage / this.maxTokensPerUser * 100).toFixed(1),
                dailyRequests: dailyUsage
            };
        }

        return stats;
    }

    // Generate scenario conversation response
    async generateScenarioResponse(scenarioContext, userMessage, options = {}) {
        const systemPrompt = this.buildScenarioPrompt(scenarioContext, userMessage);
        
        try {
            const response = await this.generateContent(systemPrompt, {
                ...options,
                maxTokens: 300, // Limit response length for scenarios
                temperature: 0.8 // Slightly more creative for conversations
            });
            
            return {
                success: true,
                message: response.text,
                tokensUsed: response.tokensUsed,
                usage: response.usage
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                fallbackMessage: this.getFallbackResponse(scenarioContext)
            };
        }
    }

    // Build scenario-specific prompt
    buildScenarioPrompt(scenarioContext, userMessage) {
        return `You are an AI assistant helping with management training scenarios. 

SCENARIO CONTEXT:
- Title: ${scenarioContext.title}
- Category: ${scenarioContext.category}
- Difficulty: ${scenarioContext.difficulty}
- Context: ${scenarioContext.context}
- Learning Objectives: ${scenarioContext.learningObjectives?.join(', ') || 'General management skills'}

ROLE: You are playing the role of a team member or stakeholder in this management scenario. Respond authentically as that person would, showing realistic emotions, concerns, and reactions.

GUIDELINES:
- Keep responses under 150 words
- Stay in character and scenario context
- Show realistic human emotions and reactions
- Provide opportunities for the manager to practice skills
- Be constructive but realistic about challenges

USER'S RESPONSE: "${userMessage}"

Respond as the team member/stakeholder in this scenario:`;
    }

    // Get fallback response when API fails
    getFallbackResponse(scenarioContext) {
        const fallbacks = {
            'team-leadership': "I appreciate you taking the time to discuss this with me. I'm interested in hearing your thoughts on how we can move forward.",
            'individual-development': "Thank you for the feedback. I'd like to understand better what specific areas I should focus on for improvement.",
            'stakeholder-influence': "I see your point. Can you help me understand how this aligns with our current priorities?",
            'performance-excellence': "I want to make sure I'm meeting expectations. What would success look like in this situation?",
            'default': "I appreciate you bringing this up. Can you tell me more about your perspective on this?"
        };
        
        return fallbacks[scenarioContext.category] || fallbacks.default;
    }

    // Reset usage for testing (admin function)
    resetUsage() {
        this.tokenUsage = {
            global: 0,
            users: {},
            dailyUsage: {},
            lastReset: new Date().toDateString()
        };
        this.saveTokenUsage();
    }

    // Get detailed analytics
    getAnalytics() {
        return {
            totalUsers: Object.keys(this.tokenUsage.users).length,
            averageTokensPerUser: this.tokenUsage.global / Math.max(Object.keys(this.tokenUsage.users).length, 1),
            topUsers: Object.entries(this.tokenUsage.users)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([userId, tokens]) => ({ userId, tokens })),
            globalUsage: this.getUsageStats().global
        };
    }
}

// Export for use in other modules
window.GeminiAPIManager = GeminiAPIManager;
