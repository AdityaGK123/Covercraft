// Configuration for CoverCraft AI Features
// This file should be kept secure and not exposed to client-side

const CONFIG = {
    // AI Configuration
    GEMINI_API_KEY: 'AIzaSyBqEXzZvi4evhzWdHPGMwILYLVLeQoibOg',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Token Management
    MONTHLY_TOKEN_LIMIT: 1000000, // 1 million tokens per month
    DAILY_TOKEN_LIMIT: 33333,     // ~1M/30 days
    USER_DAILY_LIMIT: 100,        // Max tokens per user per day
    FREE_TRACKS_PER_USER: 3,      // Free tracks before requiring payment
    
    // Rate Limiting
    REQUESTS_PER_MINUTE: 10,      // Max requests per user per minute
    REQUESTS_PER_HOUR: 50,        // Max requests per user per hour
    
    // Caching
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    MAX_CACHE_SIZE: 1000,         // Maximum cached responses
    
    // Fallback Settings
    ENABLE_FALLBACK: true,        // Use Web Audio API when quota exceeded
    FALLBACK_THRESHOLD: 0.9       // Switch to fallback at 90% quota usage
};

// Export for server-side use only
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
