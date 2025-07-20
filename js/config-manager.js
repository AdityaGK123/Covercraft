// Configuration Manager for CapabilityGym
class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
        this.isConfigured = false;
    }

    // Load configuration from localStorage
    loadConfig() {
        const saved = localStorage.getItem('capabilityGymConfig');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            geminiApiKey: '',
            userSettings: {
                enableAI: true,
                maxTokensPerSession: 1000,
                preferredDifficulty: 'beginner'
            },
            features: {
                aiScenarios: false,
                analytics: true,
                darkMode: 'auto'
            }
        };
    }

    // Save configuration
    saveConfig() {
        localStorage.setItem('capabilityGymConfig', JSON.stringify(this.config));
    }

    // Set Gemini API key
    setGeminiApiKey(apiKey) {
        this.config.geminiApiKey = apiKey;
        this.config.features.aiScenarios = !!apiKey;
        this.isConfigured = !!apiKey;
        this.saveConfig();
        return this.isConfigured;
    }

    // Get Gemini API key
    getGeminiApiKey() {
        return this.config.geminiApiKey;
    }

    // Check if AI features are enabled
    isAIEnabled() {
        return this.config.features.aiScenarios && this.config.geminiApiKey;
    }

    // Update user settings
    updateUserSettings(settings) {
        this.config.userSettings = { ...this.config.userSettings, ...settings };
        this.saveConfig();
    }

    // Get user settings
    getUserSettings() {
        return this.config.userSettings;
    }

    // Show API key setup modal
    showApiKeySetup() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-hipo-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-hipo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2m3 0a2 2 0 012 2v1M9 7h6"></path>
                        </svg>
                    </div>
                    <h3 class="font-montserrat text-xl font-bold mb-2">Setup Gemini AI</h3>
                    <p class="font-karla text-gray-600 dark:text-gray-400 text-sm">
                        To enable AI-powered scenarios, you'll need a free Gemini API key
                    </p>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block font-karla text-sm font-medium mb-2">Gemini API Key</label>
                        <input 
                            type="password" 
                            id="geminiApiKey" 
                            placeholder="Enter your Gemini API key"
                            class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-karla text-sm focus:ring-2 focus:ring-hipo-blue focus:border-transparent"
                        >
                        <p class="text-xs text-gray-500 mt-1">
                            Your API key is stored locally and never shared
                        </p>
                    </div>

                    <div class="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg p-4">
                        <h4 class="font-montserrat font-semibold text-sm mb-2">How to get your API key:</h4>
                        <ol class="text-xs font-karla text-gray-600 dark:text-gray-400 space-y-1">
                            <li>1. Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" class="text-hipo-blue hover:underline">Google AI Studio</a></li>
                            <li>2. Click "Create API Key"</li>
                            <li>3. Copy the generated key</li>
                            <li>4. Paste it above</li>
                        </ol>
                    </div>

                    <div class="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 rounded-lg p-4">
                        <div class="flex items-start space-x-2">
                            <svg class="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                            <div>
                                <p class="text-xs font-karla text-yellow-800 dark:text-yellow-200">
                                    <strong>Token Usage:</strong> We track usage to stay within Gemini's 1M free token limit. Each user gets up to 10,000 tokens.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex space-x-3 mt-6">
                    <button 
                        onclick="configManager.cancelApiKeySetup()"
                        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-montserrat font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Skip for Now
                    </button>
                    <button 
                        onclick="configManager.saveApiKey()"
                        class="flex-1 px-4 py-2 bg-hipo-blue text-white font-montserrat font-medium rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Save & Test
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('geminiApiKey').focus();
        }, 100);

        // Handle Enter key
        document.getElementById('geminiApiKey').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        });
    }

    // Save API key from modal
    async saveApiKey() {
        const apiKeyInput = document.getElementById('geminiApiKey');
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showError('Please enter a valid API key');
            return;
        }

        // Show loading state
        const saveButton = event.target;
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Testing...';
        saveButton.disabled = true;

        try {
            // Initialize Gemini API and test connection
            const geminiManager = new GeminiAPIManager();
            const testResult = await geminiManager.initialize(apiKey);
            
            if (testResult.success) {
                // Save the API key
                this.setGeminiApiKey(apiKey);
                
                // Initialize the global gemini manager
                window.geminiAPI = geminiManager;
                
                // Show success and close modal
                this.showSuccess('API key configured successfully!');
                this.closeModal();
                
                // Refresh the app to enable AI features
                if (window.app) {
                    window.app.onAIEnabled();
                }
            } else {
                this.showError(`API test failed: ${testResult.message}`);
                saveButton.textContent = originalText;
                saveButton.disabled = false;
            }
        } catch (error) {
            this.showError(`Configuration failed: ${error.message}`);
            saveButton.textContent = originalText;
            saveButton.disabled = false;
        }
    }

    // Cancel API key setup
    cancelApiKeySetup() {
        this.closeModal();
    }

    // Close modal
    closeModal() {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) {
            modal.remove();
        }
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
        
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="font-karla text-sm">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('translate-x-full');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Show usage statistics
    showUsageStats() {
        if (!window.geminiAPI) {
            this.showError('AI features not configured');
            return;
        }

        const stats = window.geminiAPI.getUsageStats(window.app?.getCurrentUserId());
        const analytics = window.geminiAPI.getAnalytics();

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-montserrat text-xl font-bold">Token Usage Statistics</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="space-y-6">
                    <!-- Global Usage -->
                    <div>
                        <h4 class="font-montserrat font-semibold mb-3">Global Usage</h4>
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-karla text-sm">Total Tokens Used</span>
                                <span class="font-montserrat font-bold">${stats.global.used.toLocaleString()}</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                                <div class="bg-hipo-blue rounded-full h-2" style="width: ${stats.global.percentage}%"></div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                <span>${stats.global.remaining.toLocaleString()} remaining</span>
                                <span>${stats.global.percentage}% used</span>
                            </div>
                        </div>
                    </div>

                    ${stats.user ? `
                    <!-- User Usage -->
                    <div>
                        <h4 class="font-montserrat font-semibold mb-3">Your Usage</h4>
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-karla text-sm">Your Tokens Used</span>
                                <span class="font-montserrat font-bold">${stats.user.used.toLocaleString()}</span>
                            </div>
                            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                                <div class="bg-hipo-coral rounded-full h-2" style="width: ${stats.user.percentage}%"></div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                <span>${stats.user.remaining.toLocaleString()} remaining</span>
                                <span>${stats.user.percentage}% used</span>
                            </div>
                            <div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                Daily requests: ${stats.user.dailyRequests}/100
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Analytics -->
                    <div>
                        <h4 class="font-montserrat font-semibold mb-3">Analytics</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                                <div class="font-montserrat font-bold text-lg">${analytics.totalUsers}</div>
                                <div class="font-karla text-xs text-gray-600 dark:text-gray-400">Total Users</div>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                                <div class="font-montserrat font-bold text-lg">${Math.round(analytics.averageTokensPerUser)}</div>
                                <div class="font-karla text-xs text-gray-600 dark:text-gray-400">Avg Tokens/User</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p class="text-xs text-gray-500 dark:text-gray-400 font-karla">
                        Usage resets daily. Contact support if you need higher limits.
                    </p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Initialize configuration on app start
    async initialize() {
        // Check if API key is already configured
        if (this.getGeminiApiKey()) {
            try {
                // Initialize Gemini API
                window.geminiAPI = new GeminiAPIManager();
                const testResult = await window.geminiAPI.initialize(this.getGeminiApiKey());
                
                if (testResult.success) {
                    this.isConfigured = true;
                    return true;
                } else {
                    console.warn('Gemini API test failed:', testResult.message);
                    return false;
                }
            } catch (error) {
                console.error('Failed to initialize Gemini API:', error);
                return false;
            }
        }
        return false;
    }
}

// Create global instance
window.configManager = new ConfigManager();
