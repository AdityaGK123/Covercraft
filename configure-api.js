// CapabilityGym API Key Configuration Script
// Run this in your browser console to automatically configure the Gemini API key

(function() {
    console.log('🔑 Configuring Gemini API Key for CapabilityGym...');
    
    const apiKey = 'AIzaSyDuoZUE-bNwuo4oJHMnx4jqDjVp0sYwQGo';
    
    // Initialize configuration manager if not already done
    if (!window.configManager) {
        window.configManager = new ConfigManager();
    }
    
    // Set the API key in localStorage
    const config = {
        geminiApiKey: apiKey,
        userSettings: {
            enableAI: true,
            maxTokensPerSession: 1000,
            preferredDifficulty: 'beginner'
        },
        features: {
            aiScenarios: true,
            analytics: true,
            darkMode: 'auto'
        }
    };
    
    localStorage.setItem('capabilityGymConfig', JSON.stringify(config));
    console.log('✅ API key saved to localStorage');
    
    // Initialize Gemini API manager
    if (!window.geminiAPI) {
        window.geminiAPI = new GeminiAPIManager();
    }
    
    // Test the API key
    window.geminiAPI.initialize(apiKey).then(result => {
        if (result.success) {
            console.log('🎉 Gemini API key validated successfully!');
            console.log('✨ AI features are now active');
            
            // Refresh the app to show AI-enabled state
            if (window.app) {
                window.app.onAIEnabled();
                window.app.showDashboard();
            }
            
            // Show success notification
            if (window.configManager) {
                window.configManager.showNotification('🎉 AI Features Activated! Your Gemini API key is working perfectly.', 'success');
            }
        } else {
            console.error('❌ API key validation failed:', result.error);
            alert('API key validation failed. Please check your key and try again.');
        }
    }).catch(error => {
        console.error('❌ Error initializing API:', error);
        alert('Error initializing API. Please check your internet connection and try again.');
    });
    
    console.log('🚀 Configuration complete! Check your dashboard for AI features.');
})();
