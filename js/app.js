// CapabilityGym - Main Application
class CapabilityGym {
    constructor() {
        this.state = {
            user: {
                experience: '',
                industry: '',
                teamSize: '',
                goals: [],
                level: 'Aspiring',
                xp: 0,
                streak: 0,
                completedScenarios: 0
            },
            currentScenario: null,
            conversationHistory: [],
            scenarioStep: 0,
            tutorialStep: 1,
            onboardingStep: 1
        };
        
        this.init();
    }

    async init() {
        this.loadState();
        this.initDarkMode();
        
        // Initialize configuration manager
        if (window.configManager) {
            await window.configManager.initialize();
        }
        
        this.showWelcomeScreen();
        this.updateUI();
    }

    loadState() {
        const savedState = localStorage.getItem('capabilityGymState');
        if (savedState) {
            this.state = { ...this.state, ...JSON.parse(savedState) };
        }
    }

    saveState() {
        localStorage.setItem('capabilityGymState', JSON.stringify(this.state));
    }

    initDarkMode() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });
    }

    showWelcomeScreen() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div id="welcomeScreen" class="screen">
                <div class="gradient-bg min-h-screen flex items-center justify-center px-4">
                    <div class="welcome-content bounce-in">
                        <div class="mb-8">
                            <h1 class="font-display text-6xl font-bold mb-4">CapabilityGym</h1>
                            <div class="tagline font-accent text-2xl mb-8">First you aspire, then you soar ✨</div>
                            <p class="text-body text-lg opacity-90 mb-8 max-w-2xl mx-auto text-white">
                                Practice real management scenarios with AI-powered simulations. 
                                Build confidence, develop skills, and unlock your leadership potential.
                            </p>
                        </div>
                        
                        <div class="welcome-actions">
                            <button onclick="window.app.startOnboarding()" class="btn-organic btn-primary w-full py-4 text-lg font-semibold">
                                🚀 Begin Your Journey
                            </button>
                            <button onclick="window.app.showDashboard()" class="btn-organic btn-secondary w-full py-4 text-lg font-semibold">
                                📚 Continue Learning
                            </button>
                            <button onclick="window.app.showScenarioLibrary()" class="btn-organic btn-ghost w-full py-3 text-white border-white">
                                🎯 Browse Scenarios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    startOnboarding() {
        this.showTutorial();
    }

    showTutorial() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div id="tutorialScreen" class="screen">
                <div class="max-w-4xl mx-auto px-4 py-8">
                    <div class="text-center mb-8">
                        <h2 class="font-montserrat text-3xl font-bold mb-4">Welcome to Your Management Journey</h2>
                        <p class="font-karla text-gray-600 dark:text-gray-400">Let's take a quick tour to get you started</p>
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-hipo-grey p-8">
                        <div id="tutorialStep1" class="tutorial-step">
                            <div class="flex items-center mb-6">
                                <div class="w-12 h-12 bg-hipo-blue rounded-full flex items-center justify-center text-white font-montserrat font-bold text-xl mr-4">1</div>
                                <h3 class="font-montserrat text-xl font-semibold">Choose Your Scenarios</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <h4 class="font-montserrat font-semibold mb-2">Real Situations</h4>
                                    <p class="font-karla text-sm text-gray-600 dark:text-gray-400">Practice with authentic management challenges you'll face in your career</p>
                                </div>
                                <div class="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <h4 class="font-montserrat font-semibold mb-2">AI-Powered</h4>
                                    <p class="font-karla text-sm text-gray-600 dark:text-gray-400">Dynamic conversations that adapt to your management style</p>
                                </div>
                            </div>
                            <button onclick="window.app.nextTutorialStep()" class="btn-organic btn-primary mt-6">
                                Next: See How It Works
                            </button>
                        </div>

                        <div id="tutorialStep2" class="tutorial-step hidden">
                            <div class="flex items-center mb-6">
                                <div class="w-12 h-12 bg-hipo-coral rounded-full flex items-center justify-center text-white font-montserrat font-bold text-xl mr-4">2</div>
                                <h3 class="font-montserrat text-xl font-semibold">Practice Conversations</h3>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
                                <div class="space-y-4">
                                    <div class="bg-white dark:bg-gray-600 p-4 rounded-lg">
                                        <div class="text-sm font-medium mb-1">Team Member</div>
                                        <div class="font-karla">"I've been struggling with the new project deadlines..."</div>
                                    </div>
                                    <div class="bg-hipo-blue text-white p-4 rounded-lg ml-8">
                                        <div class="text-sm font-medium mb-1">You</div>
                                        <div class="font-karla">"I appreciate you bringing this to my attention. Let's discuss what support you need."</div>
                                    </div>
                                </div>
                            </div>
                            <button onclick="window.app.nextTutorialStep()" class="btn-organic btn-primary">
                                Next: Get Feedback
                            </button>
                        </div>

                        <div id="tutorialStep3" class="tutorial-step hidden">
                            <div class="flex items-center mb-6">
                                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-montserrat font-bold text-xl mr-4">3</div>
                                <h3 class="font-montserrat text-xl font-semibold">Learn & Improve</h3>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div class="text-2xl font-bold text-hipo-blue font-montserrat">+50 XP</div>
                                    <div class="text-sm font-karla text-gray-600 dark:text-gray-400">Points Earned</div>
                                </div>
                                <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div class="text-2xl font-bold text-hipo-coral font-montserrat">85%</div>
                                    <div class="text-sm font-karla text-gray-600 dark:text-gray-400">Performance</div>
                                </div>
                                <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div class="text-2xl font-bold text-green-500 font-montserrat">A+</div>
                                    <div class="text-sm font-karla text-gray-600 dark:text-gray-400">Feedback Grade</div>
                                </div>
                            </div>
                            <button onclick="window.app.finishTutorial()" class="btn-organic btn-primary">
                                Start My Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showDashboard() {
        const mainContent = document.getElementById('mainContent');
        const aiEnabled = window.configManager?.isAIEnabled() || false;
        
        mainContent.innerHTML = `
            <div id="dashboardScreen" class="screen" style="padding-top: 80px;">
                <div class="container-organic">
                    <!-- Welcome Banner -->
                    <div class="gradient-bg text-white rounded-2xl p-8 mb-8">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h1 class="heading-display text-white mb-2">Welcome back! Ready to soar higher?</h1>
                                <p class="text-handwritten text-white opacity-90">Continue your management skill development journey</p>
                            </div>
                            <div class="mt-4 md:mt-0">
                                <div class="bg-white bg-opacity-20 rounded-xl p-4">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold font-montserrat text-white">${this.state.user.level}</div>
                                        <div class="text-sm font-karla opacity-90 text-white">Current Level</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- AI Feature Status -->
                    ${!aiEnabled ? `
                    <div class="card-organic mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400">
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <span class="text-2xl">🚀</span>
                                </div>
                            </div>
                            <div class="flex-1">
                                <h3 class="heading-section text-yellow-800 mb-2">Unlock AI-Powered Learning</h3>
                                <p class="text-body text-yellow-700 mb-4">
                                    Enable AI to unlock dynamic scenario conversations, personalized coaching, and adaptive learning experiences.
                                </p>
                                <button onclick="window.configManager?.showApiKeySetup()" class="btn-organic btn-accent">
                                    🚀 Setup AI Features
                                </button>
                            </div>
                        </div>
                    </div>
                    ` : `
                    <div class="card-organic mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400">
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                                    <span class="text-2xl">✨</span>
                                </div>
                            </div>
                            <div class="flex-1">
                                <h3 class="heading-section text-green-800 mb-2">AI Features Active</h3>
                                <p class="text-body text-green-700 mb-4">
                                    AI-powered scenarios and coaching are ready! Start practicing with dynamic conversations.
                                </p>
                                <div class="flex gap-3">
                                    <button onclick="window.configManager?.showUsageStats()" class="btn-organic btn-secondary">
                                        📊 View Usage Stats
                                    </button>
                                    <button onclick="window.app.showScenarioLibrary()" class="btn-organic btn-primary">
                                        🎯 Start Practicing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `}
                    
                    <!-- Stats Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="card-organic">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-body text-stone-soft">Scenarios Completed</h3>
                                    <p class="heading-section text-soil-rich">${this.state.user.completedScenarios}</p>
                                </div>
                                <div class="w-12 h-12 bg-moss-gentle bg-opacity-20 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-moss-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="card-organic">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-body text-stone-soft">Current Streak</h3>
                                    <p class="heading-section text-soil-rich">${this.state.user.streak} days</p>
                                </div>
                                <div class="w-12 h-12 bg-sunset-warm bg-opacity-20 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-sunset-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="card-organic">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-body text-stone-soft">Total XP</h3>
                                    <p class="heading-section text-soil-rich">${this.state.user.xp}</p>
                                </div>
                                <div class="w-12 h-12 bg-moss-gentle bg-opacity-20 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-moss-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="card-organic">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-body text-stone-soft">Achievement Level</h3>
                                    <p class="heading-section text-soil-rich">${this.state.user.level}</p>
                                </div>
                                <div class="w-12 h-12 bg-sunset-warm bg-opacity-20 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-sunset-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="card-organic hover:shadow-lg transition-shadow cursor-pointer" onclick="window.app.showScenarioLibrary()">
                            <div class="text-center py-6">
                                <div class="text-4xl mb-4">🎯</div>
                                <h3 class="heading-section mb-2">Practice Scenarios</h3>
                                <p class="text-body text-stone-soft">Dive into realistic management challenges</p>
                            </div>
                        </div>
                        <div class="card-organic hover:shadow-lg transition-shadow cursor-pointer" onclick="window.app.showProgress()">
                            <div class="text-center py-6">
                                <div class="text-4xl mb-4">📈</div>
                                <h3 class="heading-section mb-2">Track Progress</h3>
                                <p class="text-body text-stone-soft">Monitor your skill development journey</p>
                            </div>
                        </div>
                        <div class="card-organic hover:shadow-lg transition-shadow cursor-pointer" onclick="window.app.showTutorial()">
                            <div class="text-center py-6">
                                <div class="text-4xl mb-4">📚</div>
                                <h3 class="heading-section mb-2">Learn Basics</h3>
                                <p class="text-body text-stone-soft">Review fundamental management concepts</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recommended Scenarios -->
                    <div class="card-organic">
                        <h2 class="heading-section mb-6">Recommended for You</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${this.getRecommendedScenarios().map(scenario => `
                                <div class="border border-stone-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="window.app.startScenario('${scenario.id}')">
                                    <div class="flex items-start gap-3">
                                        <div class="w-10 h-10 bg-moss-gentle bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span class="text-lg">${scenario.icon}</span>
                                        </div>
                                        <div class="flex-1">
                                            <h3 class="font-semibold text-soil-rich mb-1">${scenario.title}</h3>
                                            <p class="text-sm text-stone-soft mb-2">${scenario.description}</p>
                                            <div class="flex items-center gap-2 text-xs text-stone-400">
                                                <span>⏱️ ${scenario.duration}</span>
                                                <span>•</span>
                                                <span>📊 ${scenario.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateUI() {
        // Update streak and XP counters
        const streakElement = document.getElementById('streakCount');
        const xpElement = document.getElementById('xpCount');
        
        if (streakElement) streakElement.textContent = this.state.user.streak;
        if (xpElement) xpElement.textContent = `${this.state.user.xp} XP`;
    }

    showAlert(message) {
        // Simple alert for now - can be enhanced with custom modal
        alert(message);
    }

    // Get current user ID for token tracking
    getCurrentUserId() {
        if (!this.state.userId) {
            this.state.userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            this.saveState();
        }
        return this.state.userId;
    }

    // Called when AI features are enabled
    onAIEnabled() {
        this.updateUI();
        this.showDashboard(); // Refresh dashboard to show AI status
    }

    // Get recommended scenarios based on user profile
    getRecommendedScenarios() {
        const scenarios = [
            {
                id: 'feedback-basics',
                title: 'Giving Constructive Feedback',
                description: 'Learn the fundamentals of delivering effective feedback',
                difficulty: 'beginner',
                xp: 50,
                category: 'individual-development'
            },
            {
                id: 'team-conflict',
                title: 'Resolving Team Conflicts',
                description: 'Navigate disagreements between team members',
                difficulty: 'intermediate',
                xp: 75,
                category: 'team-leadership'
            }
        ];

        return scenarios.map(scenario => `
            <div class="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-xl scenario-card">
                <div>
                    <h4 class="font-montserrat font-semibold mb-1">${scenario.title}</h4>
                    <p class="font-karla text-sm text-gray-600 dark:text-gray-400 mb-2">${scenario.description}</p>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs font-karla bg-hipo-blue text-white px-2 py-1 rounded-full">${scenario.difficulty}</span>
                        <span class="text-xs font-karla text-hipo-blue">+${scenario.xp} XP</span>
                    </div>
                </div>
                <button onclick="window.app.startScenario('${scenario.id}')" class="btn-organic btn-primary">
                    Start
                </button>
            </div>
        `).join('');
    }
    
    // Show loading state
    showLoadingState(message = 'Loading...') {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="screen flex items-center justify-center min-h-screen">
                <div class="text-center">
                    <div class="loading-dots mb-4">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p class="text-body text-lg">${message}</p>
                </div>
            </div>
        `;
    }
    
    // Show scenario library
    showScenarioLibrary() {
        // Show loading state first
        this.showLoadingState('Loading scenario library...');
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            const mainContent = document.getElementById('mainContent');
            const aiEnabled = window.configManager?.isAIEnabled() || false;
            
            mainContent.innerHTML = `
                <div id="scenarioLibraryScreen" class="screen" style="padding-top: 80px;">
                    <div class="container-organic">
                        <!-- Mobile-optimized header -->
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                            <div>
                                <h2 class="heading-display">Scenario Library</h2>
                                <p class="text-handwritten">Practice real management situations with ${aiEnabled ? 'AI-powered' : 'structured'} simulations</p>
                            </div>
                            <button onclick="window.app.showDashboard()" class="btn-organic btn-secondary w-full sm:w-auto">
                                ← Back to Dashboard
                            </button>
                        </div>

                    ${!aiEnabled ? `
                    <div class="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 mb-8">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-montserrat font-semibold text-blue-800 dark:text-blue-200 mb-1">Enhanced Experience Available</h3>
                                <p class="font-karla text-sm text-blue-700 dark:text-blue-300">Enable AI features for dynamic, personalized conversations in each scenario.</p>
                            </div>
                            <button onclick="window.configManager?.showApiKeySetup()" class="btn-organic btn-primary">
                                Enable AI
                            </button>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Scenario Categories -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${this.getScenarioCategories()}
                    </div>
                </div>
            </div>
        `;
        }, 300); // Close setTimeout
    }

    // Get scenario categories
    getScenarioCategories() {
        const categories = [
            {
                id: 'team-leadership',
                title: 'Team Leadership',
                description: 'Build and guide high-performing teams',
                icon: '👥',
                color: 'bg-hipo-blue',
                scenarios: 8
            },
            {
                id: 'individual-development',
                title: 'Individual Development',
                description: 'Coach and develop team members',
                icon: '🎯',
                color: 'bg-hipo-coral',
                scenarios: 6
            },
            {
                id: 'stakeholder-influence',
                title: 'Stakeholder Influence',
                description: 'Build networks and influence others',
                icon: '🤝',
                color: 'bg-green-500',
                scenarios: 5
            },
            {
                id: 'performance-excellence',
                title: 'Performance Excellence',
                description: 'Drive consistent high-quality execution',
                icon: '⚡',
                color: 'bg-yellow-500',
                scenarios: 7
            },
            {
                id: 'self-management',
                title: 'Self Management',
                description: 'Manage personal effectiveness and growth',
                icon: '🧘',
                color: 'bg-purple-500',
                scenarios: 4
            },
            {
                id: 'inclusive-leadership',
                title: 'Inclusive Leadership',
                description: 'Lead diverse teams effectively',
                icon: '🌍',
                color: 'bg-cyan-500',
                scenarios: 5
            }
        ];

        return categories.map(category => `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-hipo-grey p-6 card-hover cursor-pointer" onclick="app.showCategoryScenarios('${category.id}')">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-3xl">${category.icon}</div>
                    <div class="${category.color} text-white text-xs font-montserrat font-medium px-2 py-1 rounded-full">
                        ${category.scenarios} scenarios
                    </div>
                </div>
                <h3 class="font-montserrat font-bold text-lg mb-2">${category.title}</h3>
                <p class="font-karla text-sm text-gray-600 dark:text-gray-400 mb-4">${category.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-sm font-karla text-gray-500">Click to explore</span>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        `).join('');
    }

    // Show scenarios for a specific category
    showCategoryScenarios(categoryId) {
        const mainContent = document.getElementById('mainContent');
        const category = this.getScenarioCategories().find(cat => cat.id === categoryId);
        
        if (!category) {
            this.showAlert('Category not found');
            return;
        }
        
        const scenarios = this.getScenariosByCategory(categoryId);
        const aiEnabled = window.configManager?.isAIEnabled() || false;
        
        mainContent.innerHTML = `
            <div id="categoryScreen" class="screen" style="padding-top: 80px;">
                <div class="container-organic">
                    <!-- Header with breadcrumb -->
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <nav class="text-sm mb-2">
                                <button onclick="window.app.showScenarioLibrary()" class="text-moss-gentle hover:text-soil-rich">
                                    Scenarios
                                </button>
                                <span class="mx-2 text-stone-soft">&gt;</span>
                                <span class="text-soil-rich font-semibold">${category.title}</span>
                            </nav>
                            <h1 class="heading-display">${category.title}</h1>
                            <p class="text-handwritten">${category.description}</p>
                        </div>
                        <button onclick="window.app.showScenarioLibrary()" class="btn-organic btn-secondary">
                            ← Back to Library
                        </button>
                    </div>
                    
                    <!-- Scenarios Grid -->
                    <div class="scenario-grid">
                        ${scenarios.map(scenario => `
                            <div class="scenario-card">
                                <div class="scenario-icon">
                                    ${scenario.icon}
                                </div>
                                <h3 class="scenario-title">${scenario.title}</h3>
                                <p class="scenario-description">${scenario.description}</p>
                                <div class="scenario-meta">
                                    <span class="text-xs font-medium">${scenario.difficulty}</span>
                                    <span class="text-xs">+${scenario.xp} XP</span>
                                </div>
                                <div class="mt-4">
                                    <button onclick="window.app.startScenario('${scenario.id}')" class="btn-organic btn-primary w-full">
                                        ${aiEnabled ? '🚀 Start AI Practice' : '📝 Start Practice'}
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${scenarios.length === 0 ? `
                        <div class="card-organic text-center py-16">
                            <div class="text-6xl mb-4">🚧</div>
                            <h2 class="heading-section mb-4">Scenarios Coming Soon!</h2>
                            <p class="text-body mb-8">We're building amazing scenarios for this category.</p>
                            <button onclick="window.app.showScenarioLibrary()" class="btn-organic btn-primary">
                                Explore Other Categories
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Get scenarios by category
    getScenariosByCategory(categoryId) {
        const allScenarios = [
            {
                id: 'team-conflict-1',
                title: 'Resolving Team Conflict',
                description: 'Navigate a heated disagreement between two high-performing team members.',
                category: 'team-leadership',
                difficulty: 'Intermediate',
                xp: 150,
                icon: '⚖️'
            },
            {
                id: 'team-motivation-1',
                title: 'Motivating Underperformer',
                description: 'Help a struggling team member regain confidence and productivity.',
                category: 'team-leadership',
                difficulty: 'Beginner',
                xp: 100,
                icon: '💪'
            },
            {
                id: 'coaching-session-1',
                title: 'Career Development Coaching',
                description: 'Guide a team member through their career growth aspirations.',
                category: 'individual-development',
                difficulty: 'Intermediate',
                xp: 120,
                icon: '🎯'
            },
            {
                id: 'feedback-delivery-1',
                title: 'Delivering Difficult Feedback',
                description: 'Provide constructive criticism while maintaining team morale.',
                category: 'individual-development',
                difficulty: 'Advanced',
                xp: 200,
                icon: '💬'
            },
            {
                id: 'stakeholder-meeting-1',
                title: 'Executive Presentation',
                description: 'Present quarterly results to senior leadership.',
                category: 'stakeholder-influence',
                difficulty: 'Advanced',
                xp: 250,
                icon: '📊'
            },
            {
                id: 'performance-review-1',
                title: 'Performance Review Process',
                description: 'Conduct fair and effective performance evaluations.',
                category: 'performance-excellence',
                difficulty: 'Intermediate',
                xp: 180,
                icon: '📋'
            },
            {
                id: 'time-management-1',
                title: 'Managing Competing Priorities',
                description: 'Balance multiple urgent projects with limited resources.',
                category: 'self-management',
                difficulty: 'Beginner',
                xp: 90,
                icon: '⏰'
            },
            {
                id: 'diversity-initiative-1',
                title: 'Leading Diversity Initiative',
                description: 'Champion inclusive practices across your organization.',
                category: 'inclusive-leadership',
                difficulty: 'Advanced',
                xp: 220,
                icon: '🌍'
            }
        ];
        
        return allScenarios.filter(scenario => scenario.category === categoryId);
    }

    // Start a specific scenario
    startScenario(scenarioId) {
        const aiEnabled = window.configManager?.isAIEnabled() || false;
        
        if (aiEnabled) {
            this.startAIScenario(scenarioId);
        } else {
            this.startStaticScenario(scenarioId);
        }
    }

    // Start AI-powered scenario
    async startAIScenario(scenarioId) {
        // Get scenario details
        const scenario = this.getScenarioById(scenarioId);
        if (!scenario) {
            this.showAlert('Scenario not found');
            return;
        }

        this.state.currentScenario = scenario;
        this.state.conversationHistory = [];
        this.saveState();

        // Show scenario interface
        this.showScenarioInterface(scenario, true);
    }

    // Start static scenario (without AI)
    startStaticScenario(scenarioId) {
        const scenario = this.getScenarioById(scenarioId);
        if (!scenario) {
            this.showAlert('Scenario not found');
            return;
        }

        this.state.currentScenario = scenario;
        this.saveState();

        // Show static scenario interface
        this.showScenarioInterface(scenario, false);
    }

    // Get scenario by ID
    getScenarioById(scenarioId) {
        const scenarios = {
            'feedback-basics': {
                id: 'feedback-basics',
                title: 'Giving Constructive Feedback',
                category: 'individual-development',
                difficulty: 'beginner',
                description: 'Learn the fundamentals of delivering effective feedback',
                context: 'A team member has been making small mistakes in their work. You want to address this constructively while maintaining their confidence.',
                initialMessage: 'Thanks for meeting with me today. I wanted to discuss some observations about the recent project work.',
                learningObjectives: [
                    'Deliver feedback in a constructive manner',
                    'Focus on specific behaviors rather than personality',
                    'Create action plans for improvement'
                ],
                xpReward: 50
            },
            'team-conflict': {
                id: 'team-conflict',
                title: 'Resolving Team Conflicts',
                category: 'team-leadership',
                difficulty: 'intermediate',
                description: 'Navigate disagreements between team members',
                context: 'Two team members have different approaches to a project and their disagreement is affecting team morale.',
                initialMessage: 'I appreciate both of you taking time for this meeting. I know there have been some different perspectives on the project approach.',
                learningObjectives: [
                    'Mediate between conflicting viewpoints',
                    'Find common ground and shared goals',
                    'Establish clear next steps'
                ],
                xpReward: 75
            }
        };

        return scenarios[scenarioId];
    }

    // Show scenario interface
    showScenarioInterface(scenario, aiEnabled) {
        const mainContent = document.getElementById('mainContent');
        
        mainContent.innerHTML = `
            <div id="scenarioInterface" class="screen">
                <div class="max-w-4xl mx-auto px-4 py-8">
                    <!-- Scenario Header -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-hipo-grey p-6 mb-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h2 class="font-montserrat text-2xl font-bold mb-2">${scenario.title}</h2>
                                <div class="flex items-center space-x-3 mb-3">
                                    <span class="text-xs font-karla bg-hipo-blue text-white px-2 py-1 rounded-full">${scenario.difficulty}</span>
                                    <span class="text-xs font-karla text-hipo-blue">+${scenario.xpReward} XP</span>
                                    <span class="text-xs font-karla text-gray-500">${scenario.category}</span>
                                </div>
                                <p class="font-karla text-gray-600 dark:text-gray-400">${scenario.description}</p>
                            </div>
                            <button onclick="window.app.showScenarioLibrary()" class="btn-organic btn-ghost text-sm">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Context -->
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                            <h4 class="font-montserrat font-semibold mb-2">Scenario Context</h4>
                            <p class="font-karla text-sm text-gray-600 dark:text-gray-400">${scenario.context}</p>
                        </div>

                        <!-- Learning Objectives -->
                        <div>
                            <h4 class="font-montserrat font-semibold mb-2">Learning Objectives</h4>
                            <ul class="list-disc list-inside font-karla text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                ${scenario.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
                            </ul>
                        </div>
                    </div>

                    <!-- Chat Interface -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-hipo-grey">
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 class="font-montserrat font-semibold">Conversation</h3>
                            <p class="font-karla text-sm text-gray-600 dark:text-gray-400">Practice your management approach in this scenario</p>
                        </div>
                        
                        <div id="chatContainer" class="chat-container p-6 min-h-96">
                            <!-- Initial AI message -->
                            <div class="message ai">
                                <div class="message-bubble">
                                    ${scenario.initialMessage}
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-6 border-t border-gray-200 dark:border-gray-700">
                            <div class="flex space-x-4">
                                <input 
                                    type="text" 
                                    id="messageInput" 
                                    placeholder="Type your response..." 
                                    class="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-karla text-sm focus:ring-2 focus:ring-hipo-blue focus:border-transparent"
                                    onkeypress="if(event.key==='Enter') app.sendMessage()"
                                >
                                <button 
                                    onclick="window.app.sendMessage()" 
                                    class="bg-hipo-blue text-white font-montserrat font-medium px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                                    ${!aiEnabled ? 'disabled' : ''}
                                >
                                    ${aiEnabled ? 'Send' : 'AI Required'}
                                </button>
                            </div>
                            ${!aiEnabled ? `
                            <p class="text-xs text-gray-500 mt-2">
                                Enable AI features to have dynamic conversations in this scenario.
                            </p>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('messageInput');
            if (input) input.focus();
        }, 100);
    }

    // Send message in scenario
    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        this.addMessageToChat(message, 'user');
        input.value = '';
        
        // Show loading
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await window.geminiAPI.generateScenarioResponse(
                this.state.currentScenario,
                message,
                { userId: this.getCurrentUserId() }
            );
            
            this.hideTypingIndicator();
            
            if (response.success) {
                this.addMessageToChat(response.message, 'ai');
                
                // Update conversation history
                this.state.conversationHistory.push(
                    { role: 'user', message: message },
                    { role: 'ai', message: response.message }
                );
                this.saveState();
            } else {
                this.addMessageToChat(response.fallbackMessage || 'Sorry, I had trouble responding. Please try again.', 'ai');
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessageToChat('Sorry, there was an error. Please try again.', 'ai');
            console.error('Scenario message error:', error);
        }
    }

    // Add message to chat interface
    addMessageToChat(message, sender) {
        const chatContainer = document.getElementById('chatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${message}
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Show typing indicator
    showTypingIndicator() {
        const chatContainer = document.getElementById('chatContainer');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Hide typing indicator
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Show progress screen
    showProgress() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div id="progressScreen" class="screen" style="padding-top: 80px;">
                <div class="container-organic">
                    <div class="text-center mb-8">
                        <h1 class="heading-display">Your Progress</h1>
                        <p class="text-handwritten">Track your leadership journey</p>
                    </div>
                    
                    <div class="card-organic text-center py-16">
                        <div class="text-6xl mb-4">📊</div>
                        <h2 class="heading-section mb-4">Progress Tracking Coming Soon!</h2>
                        <p class="text-body mb-8">We're building detailed analytics and progress tracking features.</p>
                        <button onclick="window.app.showDashboard()" class="btn-organic btn-primary">
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Add missing tutorial navigation functions
    nextTutorialStep() {
        this.state.tutorialStep++;
        if (this.state.tutorialStep > 3) {
            this.finishTutorial();
        } else {
            this.showTutorial();
        }
    }
    
    finishTutorial() {
        this.showDashboard();
    }
}

// Global functions for onclick handlers
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CapabilityGym();
});
