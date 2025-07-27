// CapabilityGym API Key Configuration Script
// Run this in your browser console to automatically configure the provided API key
// This script should be run in the browser console or included in the HTML

console.log('🔑 Configuring Gemini API Key for CapabilityGym...');

// Auto-configure when page loads
if (typeof window !== 'undefined') {
    // Wait for the page to load and managers to be available
    function configureAPI() {
        // Check if managers are available
        if (!window.configManager) {
            console.log('⏳ Waiting for ConfigManager to load...');
            setTimeout(configureAPI, 1000);
            return;
        }
        
        if (!window.GeminiAPIManager) {
            console.log('⏳ Waiting for GeminiAPIManager to load...');
            setTimeout(configureAPI, 1000);
            return;
        }
        
        // Your Gemini API Key
        const API_KEY = 'AIzaSyDuoZUE-bNwuo4oJHMnx4jqDjVp0sYwQGo';
        
        console.log('🚀 Setting up Gemini API...');
        
        try {
            // Initialize the config manager if not already done
            if (!window.configManager.isAIEnabled()) {
                // Set the API key directly
                window.configManager.setGeminiApiKey(API_KEY);
                
                // Initialize Gemini API Manager
                window.geminiAPI = new GeminiAPIManager();
                window.geminiAPI.initialize(API_KEY).then(result => {
                    if (result.success) {
                        console.log('✅ Gemini API configured successfully!');
                        console.log('🎯 AI features are now enabled!');
                        
                        // Trigger UI update if app is available
                        if (window.app && window.app.onAIEnabled) {
                            window.app.onAIEnabled();
                        }
                        
                        // Show success message
                        if (window.app && window.app.showAlert) {
                            window.app.showAlert('🎉 AI features enabled! You can now have dynamic conversations in scenarios.');
                        }
                    } else {
                        console.error('❌ Failed to configure Gemini API:', result.error);
                    }
                }).catch(error => {
                    console.error('❌ Error configuring Gemini API:', error);
                });
            } else {
                console.log('✅ Gemini API already configured!');
            }
        } catch (error) {
            console.error('❌ Error during API configuration:', error);
        }
    }
    
    // Start configuration when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', configureAPI);
    } else {
        configureAPI();
    }
} else {
    console.log('⚠️  This script is designed to run in a browser environment.');
}
