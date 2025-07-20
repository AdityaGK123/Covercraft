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
                    <div class="max-w-4xl mx-auto text-center text-white">
                        <div class="mb-8 bounce-in">
                            <img src="https://pfst.cf2.poecdn.net/base/image/eb63654998c09d616a58479f033d1e8a4cb3e9b87fef05ddc3f9c53f41d82a5d?w=3391&h=760" alt="HiPo Logo" class="h-20 w-auto mx-auto mb-6 brightness-0 invert">
                            <h1 class="font-montserrat text-4xl md:text-6xl font-bold mb-4">CapabilityGym</h1>
                            <div class="typewriter font-karla text-xl opacity-90 mb-8">First you aspire, then you soar</div>
                            <p class="font-karla text-lg opacity-90 mb-8 max-w-2xl mx-auto">Practice real management scenarios with AI-powered simulations. Build confidence, develop skills, and unlock your leadership potential.</p>
                        </div>
                        
                        <div class="space-y-4 max-w-md mx-auto">
                            <button onclick="app.startOnboarding()" class="w-full bg-white text-hipo-blue font-montserrat font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105">
                                Begin Your Journey
                            </button>
                            <button onclick="app.showDashboard()" class="w-full border-2 border-white text-white font-montserrat font-semibold py-4 px-8 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all">
                                Continue Learning
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
                            <button onclick="app.nextTutorialStep()" class="mt-6 bg-hipo-blue text-white font-montserrat font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
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
                            <button onclick="app.nextTutorialStep()" class="bg-hipo-blue text-white font-montserrat font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
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
                            <button onclick="app.finishTutorial()" class="bg-hipo-blue text-white font-montserrat font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
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
            <div id="dashboardScreen" class="screen">
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <!-- Welcome Banner -->
                    <div class="gradient-bg text-white rounded-2xl p-8 mb-8">
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h1 class="font-montserrat text-3xl font-bold mb-2">Welcome back! Ready to soar higher?</h1>
                                <p class="font-karla opacity-90">Continue your management skill development journey</p>
                            </div>
                            <div class="mt-4 md:mt-0">
                                <div class="bg-white bg-opacity-20 rounded-xl p-4">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold font-montserrat">${this.state.user.level}</div>
                                        <div class="text-sm font-karla opacity-90">Current Level</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- AI Status Banner -->
                    ${!aiEnabled ? `
                    <div class="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-8">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                                    <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-montserrat font-semibold text-yellow-800 dark:text-yellow-200">AI Features Disabled</h3>
                                    <p class="font-karla text-sm text-yellow-700 dark:text-yellow-300">Enable AI-powered scenarios for interactive conversations</p>
                                </div>
                            </div>
                            <button onclick="window.configManager.showApiKeySetup()" class="bg-yellow-600 hover:bg-yellow-700 text-white font-montserrat font-medium px-4 py-2 rounded-lg transition-colors">
                                Setup AI
                            </button>
                        </div>
                    </div>
                    ` : `
                    <div class="bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-8">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                                    <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-montserrat font-semibold text-green-800 dark:text-green-200">AI Features Enabled</h3>
                                    <p class="font-karla text-sm text-green-700 dark:text-green-300">Interactive AI-powered scenarios are ready</p>
                                </div>
                            </div>
                            <button onclick="window.configManager.showUsageStats()" class="bg-green-600 hover:bg-green-700 text-white font-montserrat font-medium px-4 py-2 rounded-lg transition-colors">
                                View Usage
                            </button>
                        </div>
                    </div>
                    `}

                    <!-- Progress Overview -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-hipo-grey card-hover">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-karla text-sm font-medium text-gray-600 dark:text-gray-400">Scenarios Completed</h3>
                                    <p class="font-montserrat text-2xl font-bold text-gray-900 dark:text-gray-100">${this.state.user.completedScenarios}</p>
                                </div>
                                <div class="w-12 h-12 bg-hipo-blue bg-opacity-10 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-hipo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-hipo-grey card-hover">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-karla text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</h3>
                                    <p class="font-montserrat text-2xl font-bold text-hipo-coral">${this.state.user.streak} days</p>
                                </div>
                                <div class="w-12 h-12 bg-hipo-coral bg-opacity-10 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-hipo-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-hipo-grey card-hover">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-karla text-sm font-medium text-gray-600 dark:text-gray-400">Total XP</h3>
                                    <p class="font-montserrat text-2xl font-bold text-green-500">${this.state.user.xp}</p>
                                </div>
                                <div class="w-12 h-12 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-hipo-grey card-hover">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-karla text-sm font-medium text-gray-600 dark:text-gray-400">Next Milestone</h3>
                                    <p class="font-montserrat text-sm font-bold text-gray-900 dark:text-gray-100">Level Up</p>
                                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                                        <div class="bg-hipo-blue rounded-full h-2" style="width: ${Math.min((this.state.user.xp % 1000) / 10, 100)}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <button onclick="app.showScenarioLibrary()" class="gradient-bg text-white p-8 rounded-2xl hover:opacity-90 transition-all transform hover:scale-105 text-left">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-montserrat font-bold text-xl mb-2">Practice Scenarios</h3>
                                    <p class="font-karla opacity-90">Start a new simulation and build skills</p>
                                </div>
                                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </button>
                        
                        <button onclick="app.showProgress()" class="bg-white dark:bg-gray-800 border-2 border-hipo-grey p-8 rounded-2xl hover:border-hipo-blue hover:shadow-lg transition-all text-left">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-montserrat font-bold text-xl mb-2">View Progress</h3>
                                    <p class="font-karla text-gray-600 dark:text-gray-400">Track your skill development</p>
                                </div>
                                <svg class="w-10 h-10 text-hipo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                        </button>
                        
                        <button onclick="window.configManager.showApiKeySetup()" class="bg-gradient-to-r from-hipo-coral to-orange-500 text-white p-8 rounded-2xl hover:shadow-lg transition-all transform hover:scale-105 text-left">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-montserrat font-bold text-xl mb-2">${aiEnabled ? 'AI Settings' : 'Enable AI'}</h3>
                                    <p class="font-karla opacity-90">${aiEnabled ? 'Manage AI configuration' : 'Unlock AI-powered scenarios'}</p>
                                </div>
                                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                        </button>
                    </div>

                    <!-- Recommended Scenarios -->
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-hipo-grey p-8">
                        <h3 class="font-montserrat text-xl font-bold mb-6">Recommended for You</h3>
                        <div id="recommendedScenarios" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            ${this.getRecommendedScenarios()}
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
                <button onclick="app.startScenario('${scenario.id}')" class="bg-hipo-blue text-white font-montserrat font-medium px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                    Start
                </button>
            </div>
        `).join('');
    }

    // Show scenario library
    showScenarioLibrary() {
        const mainContent = document.getElementById('mainContent');
        const aiEnabled = window.configManager?.isAIEnabled() || false;
        
        mainContent.innerHTML = `
            <div id="scenarioLibraryScreen" class="screen">
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <h2 class="font-montserrat text-3xl font-bold mb-2">Scenario Library</h2>
                            <p class="font-karla text-gray-600 dark:text-gray-400">Practice real management situations with ${aiEnabled ? 'AI-powered' : 'structured'} simulations</p>
                        </div>
                        <button onclick="app.showDashboard()" class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-montserrat font-medium px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Back to Dashboard
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
                            <button onclick="window.configManager.showApiKeySetup()" class="bg-blue-600 hover:bg-blue-700 text-white font-montserrat font-medium px-4 py-2 rounded-lg transition-colors">
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
        console.log('Showing scenarios for category:', categoryId);
        // This would show detailed scenarios for the category
        this.showAlert('Category scenarios coming soon!');
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
                            <button onclick="app.showScenarioLibrary()" class="text-gray-400 hover:text-gray-600">
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
                                    onclick="app.sendMessage()" 
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
        this.showAlert('Progress tracking coming soon!');
    }
}

// Global functions for onclick handlers
function toggleMenu() {
    console.log('Menu toggled');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CapabilityGym();
});
