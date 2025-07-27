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
        
        // Show appropriate screen based on user state
        if (this.state.onboardingComplete) {
            this.showSkillTree();
        } else {
            this.showWelcomeScreen();
        }
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
        const hasCompletedOnboarding = this.state.onboardingComplete;
        
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
                            ${!hasCompletedOnboarding ? `
                                <button onclick="window.app.startOnboarding()" class="btn-organic btn-primary w-full py-4 text-lg font-semibold">
                                    🚀 Begin Your Journey
                                </button>
                                <button onclick="window.app.showDashboard()" class="btn-organic btn-secondary w-full py-4 text-lg font-semibold">
                                    📚 Continue Learning
                                </button>
                            ` : `
                                <button onclick="window.app.showSkillTree()" class="btn-organic btn-primary w-full py-4 text-lg font-semibold">
                                    🌳 My Learning Journey
                                </button>
                                <button onclick="window.app.showDashboard()" class="btn-organic btn-secondary w-full py-4 text-lg font-semibold">
                                    📊 Dashboard
                                </button>
                            `}
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
            <div id="tutorialScreen" class="screen" style="padding-top: 80px;">
                <div class="container-organic">
                    <div class="text-center mb-12">
                        <h1 class="heading-display mb-4">Welcome to CapabilityGym ✨</h1>
                        <p class="text-handwritten text-xl mb-2">Your personalized management training journey starts here</p>
                        <p class="text-body opacity-80">Let's take 2 minutes to understand how this works and what makes you unique</p>
                    </div>

                    <div class="max-w-4xl mx-auto">
                        <!-- Tutorial Step 1: How It Works -->
                        <div id="tutorialStep1" class="tutorial-step">
                            <div class="card-organic mb-8">
                                <div class="flex items-center mb-6">
                                    <div class="w-16 h-16 bg-gradient-to-br from-moss-gentle to-sage-whisper rounded-full flex items-center justify-center text-white font-bold text-2xl mr-6 shadow-lg">1</div>
                                    <div>
                                        <h2 class="heading-section">How CapabilityGym Works</h2>
                                        <p class="text-body opacity-80">Personalized, AI-powered management training</p>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div class="text-center p-6 bg-gradient-to-br from-moss-gentle/10 to-sage-whisper/10 rounded-2xl border border-moss-gentle/20">
                                        <div class="text-4xl mb-4">🎯</div>
                                        <h3 class="heading-subsection mb-2">Real Scenarios</h3>
                                        <p class="text-body text-sm">Practice authentic management challenges you'll face in your career</p>
                                    </div>
                                    <div class="text-center p-6 bg-gradient-to-br from-sunset-warm/10 to-terracotta-earth/10 rounded-2xl border border-sunset-warm/20">
                                        <div class="text-4xl mb-4">🤖</div>
                                        <h3 class="heading-subsection mb-2">AI Conversations</h3>
                                        <p class="text-body text-sm">Dynamic dialogues that adapt to your management style and decisions</p>
                                    </div>
                                    <div class="text-center p-6 bg-gradient-to-br from-sage-whisper/10 to-moss-gentle/10 rounded-2xl border border-sage-whisper/20">
                                        <div class="text-4xl mb-4">📈</div>
                                        <h3 class="heading-subsection mb-2">Personal Growth</h3>
                                        <p class="text-body text-sm">Get insights, tips, and a clear path to your management goals</p>
                                    </div>
                                </div>
                                
                                <div class="text-center">
                                    <button onclick="window.app.nextTutorialStep()" class="btn-organic btn-primary px-8 py-3">
                                        Next: See It In Action →
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Tutorial Step 2: Interactive Demo -->
                        <div id="tutorialStep2" class="tutorial-step hidden">
                            <div class="card-organic mb-8">
                                <div class="flex items-center mb-6">
                                    <div class="w-16 h-16 bg-gradient-to-br from-sunset-warm to-terracotta-earth rounded-full flex items-center justify-center text-white font-bold text-2xl mr-6 shadow-lg">2</div>
                                    <div>
                                        <h2 class="heading-section">Experience a Conversation</h2>
                                        <p class="text-body opacity-80">Here's how you'll practice real management situations</p>
                                    </div>
                                </div>
                                
                                <div class="bg-gradient-to-br from-stone-50 to-sage-whisper/5 rounded-2xl p-8 mb-8 border border-stone-200">
                                    <div class="mb-4">
                                        <div class="text-sm font-medium text-stone-600 mb-2">📋 Scenario: Team Member Struggling with Deadlines</div>
                                    </div>
                                    
                                    <div class="space-y-4">
                                        <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-stone-300">
                                            <div class="text-sm font-medium text-stone-600 mb-1">Team Member (Sarah)</div>
                                            <div class="text-body">"Hi, I wanted to talk to you about the project deadline. I'm really struggling to keep up with everything and I'm worried I might not deliver on time..."</div>
                                        </div>
                                        
                                        <div class="flex gap-3">
                                            <div class="bg-gradient-to-r from-moss-gentle to-sage-whisper text-white p-4 rounded-xl shadow-sm flex-1">
                                                <div class="text-sm font-medium mb-1">Your Response Option A</div>
                                                <div class="text-sm opacity-90">"I appreciate you bringing this to my attention. Let's discuss what specific support you need to meet the deadline."</div>
                                            </div>
                                        </div>
                                        
                                        <div class="bg-green-50 p-4 rounded-xl border border-green-200">
                                            <div class="text-sm font-medium text-green-800 mb-1">✨ AI Feedback</div>
                                            <div class="text-sm text-green-700">Great empathetic response! You acknowledged the concern and offered support. This builds trust and opens dialogue.</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="text-center">
                                    <button onclick="window.app.nextTutorialStep()" class="btn-organic btn-primary px-8 py-3">
                                        Next: Your Personalized Journey →
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Tutorial Step 3: Personalization Preview -->
                        <div id="tutorialStep3" class="tutorial-step hidden">
                            <div class="card-organic mb-8">
                                <div class="flex items-center mb-6">
                                    <div class="w-16 h-16 bg-gradient-to-br from-sage-whisper to-moss-gentle rounded-full flex items-center justify-center text-white font-bold text-2xl mr-6 shadow-lg">3</div>
                                    <div>
                                        <h2 class="heading-section">Your Personalized Experience</h2>
                                        <p class="text-body opacity-80">Everything adapts to your unique goals and experience</p>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div class="space-y-4">
                                        <h3 class="heading-subsection text-moss-gentle">🎯 What You'll Get</h3>
                                        <div class="space-y-3">
                                            <div class="flex items-start gap-3">
                                                <div class="w-6 h-6 bg-moss-gentle rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div class="font-medium text-soil-rich">Skill Assessment & Gap Analysis</div>
                                                    <div class="text-sm text-stone-soft">Understand exactly where you are and where you need to go</div>
                                                </div>
                                            </div>
                                            <div class="flex items-start gap-3">
                                                <div class="w-6 h-6 bg-moss-gentle rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div class="font-medium text-soil-rich">Visual Skill Tree</div>
                                                    <div class="text-sm text-stone-soft">See your progress and unlock new capabilities as you grow</div>
                                                </div>
                                            </div>
                                            <div class="flex items-start gap-3">
                                                <div class="w-6 h-6 bg-moss-gentle rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div class="font-medium text-soil-rich">Customized Scenarios</div>
                                                    <div class="text-sm text-stone-soft">Practice situations relevant to your industry and role</div>
                                                </div>
                                            </div>
                                            <div class="flex items-start gap-3">
                                                <div class="w-6 h-6 bg-moss-gentle rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div class="font-medium text-soil-rich">Real-World Action Tips</div>
                                                    <div class="text-sm text-stone-soft">Apply your learning immediately in your actual work</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="bg-gradient-to-br from-moss-gentle/10 to-sage-whisper/10 rounded-2xl p-6 border border-moss-gentle/20">
                                        <h3 class="heading-subsection text-center mb-4">Sample Progress Tracking</h3>
                                        <div class="space-y-4">
                                            <div class="flex justify-between items-center">
                                                <span class="text-sm font-medium">Communication Skills</span>
                                                <span class="text-sm text-moss-gentle font-bold">Level 3</span>
                                            </div>
                                            <div class="w-full bg-stone-200 rounded-full h-2">
                                                <div class="bg-gradient-to-r from-moss-gentle to-sage-whisper h-2 rounded-full" style="width: 75%"></div>
                                            </div>
                                            
                                            <div class="flex justify-between items-center">
                                                <span class="text-sm font-medium">Conflict Resolution</span>
                                                <span class="text-sm text-sunset-warm font-bold">Level 2</span>
                                            </div>
                                            <div class="w-full bg-stone-200 rounded-full h-2">
                                                <div class="bg-gradient-to-r from-sunset-warm to-terracotta-earth h-2 rounded-full" style="width: 45%"></div>
                                            </div>
                                            
                                            <div class="flex justify-between items-center">
                                                <span class="text-sm font-medium">Team Building</span>
                                                <span class="text-sm text-stone-400 font-bold">Level 1</span>
                                            </div>
                                            <div class="w-full bg-stone-200 rounded-full h-2">
                                                <div class="bg-gradient-to-r from-stone-400 to-stone-500 h-2 rounded-full" style="width: 20%"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="text-center">
                                    <button onclick="window.app.startProfileCapture()" class="btn-organic btn-primary px-8 py-4 text-lg">
                                        🚀 Start My Personalized Journey
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show tutorial step based on current step
        this.updateTutorialStep();
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
    
    // Show skill tree visualization
    showSkillTree() {
        const mainContent = document.getElementById('mainContent');
        const skillTree = this.generateSkillTree();
        const userProgress = this.calculateUserProgress();
        
        mainContent.innerHTML = `
            <div id="skillTreeScreen" class="screen" style="padding-top: 80px;">
                <div class="container-organic">
                    <!-- Header Section -->
                    <div class="text-center mb-8">
                        <h1 class="heading-display mb-4">Your Learning Journey 🌳</h1>
                        <p class="text-handwritten text-xl mb-6">Navigate your personalized skill development path</p>
                        
                        <!-- Progress Overview -->
                        <div class="bg-gradient-to-r from-moss-gentle to-sage-whisper rounded-2xl p-6 mb-8">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                                <div class="text-center">
                                    <div class="text-3xl font-bold font-montserrat">${this.state.user.level}</div>
                                    <div class="text-sm font-karla opacity-90">Current Level</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-3xl font-bold font-montserrat">${this.state.user.xp}</div>
                                    <div class="text-sm font-karla opacity-90">Experience Points</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-3xl font-bold font-montserrat">${userProgress.completionPercentage}%</div>
                                    <div class="text-sm font-karla opacity-90">Journey Complete</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Skill Tree Levels -->
                    <div class="skill-tree-container">
                        ${skillTree.levels.map((level, levelIndex) => `
                            <div class="skill-level mb-12">
                                <div class="text-center mb-8">
                                    <h2 class="heading-section text-2xl mb-2">${level.name}</h2>
                                    <p class="text-body text-stone-soft">${level.description}</p>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    ${level.modules.map((module, moduleIndex) => {
                                        const isUnlocked = this.isModuleUnlocked(module, levelIndex, moduleIndex);
                                        const isCompleted = this.isModuleCompleted(module.id);
                                        const progress = this.getModuleProgress(module.id);
                                        
                                        return `
                                            <div class="skill-module card-organic ${
                                                isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked'
                                            }" onclick="${isUnlocked ? `window.app.startModule('${module.id}')` : ''}">
                                                <div class="module-icon text-4xl mb-4">${module.icon}</div>
                                                <h3 class="heading-section mb-2">${module.title}</h3>
                                                <p class="text-body text-sm mb-4">${module.description}</p>
                                                
                                                <div class="module-stats text-xs text-stone-soft mb-4">
                                                    <div class="flex justify-between items-center">
                                                        <span>⏱️ ${module.duration}</span>
                                                        <span>🎯 ${module.scenarios} scenarios</span>
                                                    </div>
                                                    <div class="flex justify-between items-center mt-1">
                                                        <span>⭐ ${module.xpReward} XP</span>
                                                        <span class="module-status">
                                                            ${isCompleted ? '✅ Complete' : isUnlocked ? '🔓 Available' : '🔒 Locked'}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                ${progress > 0 && !isCompleted ? `
                                                    <div class="progress-bar bg-stone-soft bg-opacity-20 rounded-full h-2 mb-2">
                                                        <div class="progress-fill bg-moss-gentle h-full rounded-full" style="width: ${progress}%"></div>
                                                    </div>
                                                    <div class="text-xs text-stone-soft text-center">${progress}% complete</div>
                                                ` : ''}
                                                
                                                ${module.prerequisites.length > 0 && !isUnlocked ? `
                                                    <div class="prerequisites mt-2">
                                                        <div class="text-xs text-stone-soft">Requires:</div>
                                                        <div class="text-xs text-stone-soft opacity-75">
                                                            ${module.prerequisites.map(prereq => 
                                                                this.findModuleById(skillTree, prereq)?.title || prereq
                                                            ).join(', ')}
                                                        </div>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="text-center mt-12">
                        <button onclick="window.app.showDashboard()" class="btn-organic btn-secondary mr-4">
                            📊 Dashboard
                        </button>
                        <button onclick="window.app.showScenarioLibrary()" class="btn-organic btn-primary">
                            🎯 Practice Scenarios
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Tutorial step management
    updateTutorialStep() {
        // Hide all tutorial steps
        const steps = document.querySelectorAll('.tutorial-step');
        steps.forEach(step => step.classList.add('hidden'));
        
        // Show current step
        const currentStep = document.getElementById(`tutorialStep${this.state.tutorialStep}`);
        if (currentStep) {
            currentStep.classList.remove('hidden');
        }
    }
    
    nextTutorialStep() {
        this.state.tutorialStep++;
        if (this.state.tutorialStep > 3) {
            this.startProfileCapture();
        } else {
            this.updateTutorialStep();
        }
    }
    
    finishTutorial() {
        this.startProfileCapture();
    }
    
    showModuleOverview(moduleId) {
        const skillTree = this.generateSkillTree();
        const module = this.findModuleById(skillTree, moduleId);
        
        if (!module) {
            console.error('Module not found:', moduleId);
            return;
        }
        
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div id="moduleOverviewScreen" class="screen" style="padding-top: 80px;">
                <div class="container-organic">
                    <div class="max-w-4xl mx-auto">
                        <div class="text-center mb-12">
                            <div class="text-6xl mb-4">${module.icon}</div>
                            <h1 class="heading-display mb-4">${module.title}</h1>
                            <p class="text-handwritten text-xl mb-6">${module.shortDescription}</p>
                            
                            <div class="flex items-center justify-center gap-6 text-sm text-stone-500 mb-8">
                                <span>⏱️ Duration: ${module.duration}</span>
                                <span>•</span>
                                <span>🎯 ${module.scenarios} scenarios</span>
                                <span>•</span>
                                <span>✨ ${module.xpReward} XP reward</span>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div class="card-organic">
                                <h2 class="heading-section mb-4">🎯 What You'll Learn</h2>
                                <div class="space-y-3">
                                    ${this.getModuleLearningObjectives(moduleId).map(objective => `
                                        <div class="flex items-start gap-3">
                                            <div class="w-5 h-5 bg-moss-gentle rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <span class="text-body">${objective}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="card-organic">
                                <h2 class="heading-section mb-4">📝 Real-World Applications</h2>
                                <div class="space-y-3">
                                    ${this.getModuleApplications(moduleId).map(application => `
                                        <div class="flex items-start gap-3">
                                            <div class="text-lg flex-shrink-0">${application.icon}</div>
                                            <div>
                                                <div class="font-medium text-soil-rich">${application.title}</div>
                                                <div class="text-sm text-stone-soft">${application.description}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-center">
                            <button onclick="window.app.startModuleScenarios('${moduleId}')" class="btn-organic btn-primary px-8 py-4 text-lg mr-4">
                                🎆 Start Training
                            </button>
                            <button onclick="window.app.showSkillTree()" class="btn-organic btn-secondary px-6 py-4">
                                ← Back to Skill Tree
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    findModuleById(skillTree, moduleId) {
        for (const level of skillTree.levels) {
            for (const module of level.modules) {
                if (module.id === moduleId) {
                    return module;
                }
            }
        }
        return null;
    }
    
    getModuleLearningObjectives(moduleId) {
        const objectives = {
            'communication-basics': [
                'Master active listening techniques',
                'Structure clear and concise messages',
                'Adapt communication style to different audiences',
                'Handle difficult conversations with confidence'
            ],
            'feedback-essentials': [
                'Give constructive feedback using proven frameworks',
                'Receive feedback gracefully and act on it',
                'Create a culture of continuous improvement',
                'Balance positive reinforcement with growth areas'
            ],
            'team-dynamics': [
                'Understand team formation and development stages',
                'Identify and leverage individual strengths',
                'Foster psychological safety and trust',
                'Facilitate effective team meetings and decisions'
            ],
            'conflict-resolution': [
                'Identify early signs of team conflict',
                'Mediate disputes fairly and effectively',
                'Transform conflict into productive dialogue',
                'Prevent future conflicts through better systems'
            ],
            'performance-management': [
                'Set SMART goals and track progress',
                'Conduct effective performance reviews',
                'Create development plans for team members',
                'Address performance issues constructively'
            ],
            'delegation-mastery': [
                'Identify tasks suitable for delegation',
                'Match tasks to team member capabilities',
                'Provide clear instructions and expectations',
                'Follow up effectively without micromanaging'
            ]
        };
        
        return objectives[moduleId] || ['Complete engaging scenarios', 'Practice real-world situations', 'Receive personalized feedback', 'Apply learnings immediately'];
    }
    
    getModuleApplications(moduleId) {
        const applications = {
            'communication-basics': [
                { icon: '💬', title: 'Team Meetings', description: 'Lead more effective and engaging team meetings' },
                { icon: '📞', title: '1:1 Conversations', description: 'Have meaningful one-on-one discussions with team members' },
                { icon: '📧', title: 'Written Communication', description: 'Write clearer emails and documentation' }
            ],
            'feedback-essentials': [
                { icon: '🎯', title: 'Performance Reviews', description: 'Deliver constructive and motivating performance feedback' },
                { icon: '📊', title: 'Project Debriefs', description: 'Facilitate learning-focused project retrospectives' },
                { icon: '🌱', title: 'Career Development', description: 'Guide team members in their professional growth' }
            ],
            'team-dynamics': [
                { icon: '👥', title: 'Team Building', description: 'Create stronger bonds and collaboration within your team' },
                { icon: '🤝', title: 'Cross-functional Work', description: 'Improve collaboration with other departments' },
                { icon: '🎢', title: 'Remote Teams', description: 'Build connection and engagement in distributed teams' }
            ]
        };
        
        return applications[moduleId] || [
            { icon: '🎯', title: 'Daily Practice', description: 'Apply these skills in your everyday management tasks' },
            { icon: '📈', title: 'Team Growth', description: 'Help your team develop and achieve better results' },
            { icon: '🎆', title: 'Leadership Impact', description: 'Increase your effectiveness as a leader' }
        ];
    }
    
    startModuleScenarios(moduleId) {
        // Initialize module progress tracking
        if (!this.state.user.moduleProgress) {
            this.state.user.moduleProgress = {};
        }
        
        if (!this.state.user.moduleProgress[moduleId]) {
            this.state.user.moduleProgress[moduleId] = {
                currentScenario: 0,
                completedScenarios: [],
                percentage: 0,
                startedAt: new Date().toISOString()
            };
        }
        
        this.state.currentModule = moduleId;
        this.saveState();
        
        // Show the first scenario for this module
        this.showModuleScenario(moduleId, 0);
    }
    
    // Profile capture and skill assessment
    startProfileCapture() {
        this.state.onboardingStep = 1;
        this.showProfileCapture();
    }
    
    showProfileCapture() {
        const mainContent = document.getElementById('mainContent');
        
        if (this.state.onboardingStep === 1) {
            // Step 1: Basic Profile Information
            mainContent.innerHTML = `
                <div id="profileCaptureScreen" class="screen" style="padding-top: 80px;">
                    <div class="container-organic">
                        <div class="max-w-3xl mx-auto">
                            <div class="text-center mb-12">
                                <h1 class="heading-display mb-4">Let's Get to Know You 👋</h1>
                                <p class="text-handwritten text-xl mb-2">Help us personalize your management training journey</p>
                                <div class="flex items-center justify-center gap-2 mb-4">
                                    <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                                    <div class="w-3 h-3 bg-stone-300 rounded-full"></div>
                                    <div class="w-3 h-3 bg-stone-300 rounded-full"></div>
                                    <div class="w-3 h-3 bg-stone-300 rounded-full"></div>
                                </div>
                                <p class="text-body opacity-60">Step 1 of 4: Your Background</p>
                            </div>
                            
                            <div class="card-organic">
                                <form id="profileForm1" class="space-y-8">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-soil-rich mb-3">What's your current role? *</label>
                                            <select name="currentRole" required class="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-moss-gentle focus:border-transparent">
                                                <option value="">Select your role...</option>
                                                <option value="individual-contributor">Individual Contributor</option>
                                                <option value="team-lead">Team Lead</option>
                                                <option value="first-time-manager">First-Time Manager</option>
                                                <option value="experienced-manager">Experienced Manager</option>
                                                <option value="senior-manager">Senior Manager</option>
                                                <option value="director">Director</option>
                                                <option value="vp-executive">VP/Executive</option>
                                                <option value="aspiring-manager">Aspiring Manager</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-soil-rich mb-3">Years of management experience? *</label>
                                            <select name="experience" required class="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-moss-gentle focus:border-transparent">
                                                <option value="">Select experience...</option>
                                                <option value="none">No management experience</option>
                                                <option value="less-than-1">Less than 1 year</option>
                                                <option value="1-2">1-2 years</option>
                                                <option value="3-5">3-5 years</option>
                                                <option value="6-10">6-10 years</option>
                                                <option value="more-than-10">More than 10 years</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-soil-rich mb-3">What industry are you in? *</label>
                                            <select name="industry" required class="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-moss-gentle focus:border-transparent">
                                                <option value="">Select industry...</option>
                                                <option value="technology">Technology</option>
                                                <option value="finance">Finance & Banking</option>
                                                <option value="healthcare">Healthcare</option>
                                                <option value="consulting">Consulting</option>
                                                <option value="retail">Retail & E-commerce</option>
                                                <option value="manufacturing">Manufacturing</option>
                                                <option value="education">Education</option>
                                                <option value="nonprofit">Non-profit</option>
                                                <option value="government">Government</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-soil-rich mb-3">Team size you manage/aspire to manage? *</label>
                                            <select name="teamSize" required class="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-moss-gentle focus:border-transparent">
                                                <option value="">Select team size...</option>
                                                <option value="none">No direct reports</option>
                                                <option value="1-3">1-3 people</option>
                                                <option value="4-7">4-7 people</option>
                                                <option value="8-15">8-15 people</option>
                                                <option value="16-30">16-30 people</option>
                                                <option value="more-than-30">More than 30 people</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="text-center pt-6">
                                        <button type="submit" class="btn-organic btn-primary px-8 py-4">
                                            Next: Your Goals →
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add form submission handler
            document.getElementById('profileForm1').addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                this.state.user.currentRole = formData.get('currentRole');
                this.state.user.experience = formData.get('experience');
                this.state.user.industry = formData.get('industry');
                this.state.user.teamSize = formData.get('teamSize');
                this.saveState();
                this.nextProfileStep();
            });
            
        } else if (this.state.onboardingStep === 2) {
            // Step 2: Goals and Aspirations
            mainContent.innerHTML = `
                <div id="profileCaptureScreen" class="screen" style="padding-top: 80px;">
                    <div class="container-organic">
                        <div class="max-w-3xl mx-auto">
                            <div class="text-center mb-12">
                                <h1 class="heading-display mb-4">What Are Your Goals? 🎯</h1>
                                <p class="text-handwritten text-xl mb-2">Tell us what you want to achieve as a leader</p>
                                <div class="flex items-center justify-center gap-2 mb-4">
                                    <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                                    <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                                    <div class="w-3 h-3 bg-stone-300 rounded-full"></div>
                                    <div class="w-3 h-3 bg-stone-300 rounded-full"></div>
                                </div>
                                <p class="text-body opacity-60">Step 2 of 4: Your Aspirations</p>
                            </div>
                            
                            <div class="card-organic">
                                <form id="profileForm2" class="space-y-8">
                                    <div>
                                        <label class="block text-sm font-medium text-soil-rich mb-4">What are your primary management goals? (Select all that apply) *</label>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label class="flex items-start gap-3 p-4 border border-stone-200 rounded-xl hover:bg-moss-gentle/5 cursor-pointer">
                                                <input type="checkbox" name="goals" value="become-manager" class="mt-1">
                                                <div>
                                                    <div class="font-medium text-soil-rich">Become a Manager</div>
                                                    <div class="text-sm text-stone-soft">Transition from individual contributor to management</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start gap-3 p-4 border border-stone-200 rounded-xl hover:bg-moss-gentle/5 cursor-pointer">
                                                <input type="checkbox" name="goals" value="improve-communication" class="mt-1">
                                                <div>
                                                    <div class="font-medium text-soil-rich">Improve Communication</div>
                                                    <div class="text-sm text-stone-soft">Better team conversations and feedback</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start gap-3 p-4 border border-stone-200 rounded-xl hover:bg-moss-gentle/5 cursor-pointer">
                                                <input type="checkbox" name="goals" value="conflict-resolution" class="mt-1">
                                                <div>
                                                    <div class="font-medium text-soil-rich">Handle Conflicts</div>
                                                    <div class="text-sm text-stone-soft">Navigate team disputes and difficult conversations</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start gap-3 p-4 border border-stone-200 rounded-xl hover:bg-moss-gentle/5 cursor-pointer">
                                                <input type="checkbox" name="goals" value="team-building" class="mt-1">
                                                <div>
                                                    <div class="font-medium text-soil-rich">Build Strong Teams</div>
                                                    <div class="text-sm text-stone-soft">Create cohesive, high-performing teams</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start gap-3 p-4 border border-stone-200 rounded-xl hover:bg-moss-gentle/5 cursor-pointer">
                                                <input type="checkbox" name="goals" value="performance-management" class="mt-1">
                                                <div>
                                                    <div class="font-medium text-soil-rich">Performance Management</div>
                                                    <div class="text-sm text-stone-soft">Set goals, give feedback, manage performance</div>
                                                </div>
                                            </label>
                                            <label class="flex items-start gap-3 p-4 border border-stone-200 rounded-xl hover:bg-moss-gentle/5 cursor-pointer">
                                                <input type="checkbox" name="goals" value="strategic-thinking" class="mt-1">
                                                <div>
                                                    <div class="font-medium text-soil-rich">Strategic Leadership</div>
                                                    <div class="text-sm text-stone-soft">Develop strategic thinking and vision</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-soil-rich mb-3">What's your biggest management challenge right now?</label>
                                        <textarea name="challenge" rows="4" placeholder="Describe your current biggest challenge or concern..." class="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-moss-gentle focus:border-transparent"></textarea>
                                    </div>
                                    
                                    <div class="text-center pt-6">
                                        <button type="submit" class="btn-organic btn-primary px-8 py-4">
                                            Next: Skill Assessment →
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add form submission handler
            document.getElementById('profileForm2').addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                this.state.user.goals = Array.from(formData.getAll('goals'));
                this.state.user.challenge = formData.get('challenge');
                this.saveState();
                this.nextProfileStep();
            });
            
        } else if (this.state.onboardingStep === 3) {
            // Step 3: Skill Assessment
            this.showSkillAssessment();
        } else if (this.state.onboardingStep === 4) {
            // Step 4: Personalized Recommendations
            this.showPersonalizedRecommendations();
        }
    }
    
    nextProfileStep() {
        this.state.onboardingStep++;
        this.showProfileCapture();
    }
    
    showSkillAssessment() {
        const mainContent = document.getElementById('mainContent');
        
        mainContent.innerHTML = `
            <div id="skillAssessmentScreen" class="screen" style="padding-top: 80px;">
                <div class="container-organic">
                    <div class="max-w-4xl mx-auto">
                        <div class="text-center mb-12">
                            <h1 class="heading-display mb-4">Quick Skill Assessment 🎨</h1>
                            <p class="text-handwritten text-xl mb-2">Help us understand your current capabilities</p>
                            <div class="flex items-center justify-center gap-2 mb-4">
                                <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                                <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                                <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                                <div class="w-3 h-3 bg-stone-300 rounded-full"></div>
                            </div>
                            <p class="text-body opacity-60">Step 3 of 4: Rate your current confidence level</p>
                        </div>
                        
                        <div class="card-organic">
                            <form id="skillAssessmentForm" class="space-y-8">
                                <div class="mb-6">
                                    <p class="text-body mb-6">Rate your confidence in each area from 1 (beginner) to 5 (expert):</p>
                                </div>
                                
                                <div class="space-y-6">
                                    ${this.getSkillAssessmentQuestions().map(skill => `
                                        <div class="border border-stone-200 rounded-xl p-6">
                                            <div class="flex justify-between items-start mb-4">
                                                <div class="flex-1">
                                                    <h3 class="font-semibold text-soil-rich mb-2">${skill.name}</h3>
                                                    <p class="text-sm text-stone-soft">${skill.description}</p>
                                                </div>
                                                <div class="text-2xl ml-4">${skill.icon}</div>
                                            </div>
                                            
                                            <div class="flex items-center gap-4">
                                                <span class="text-sm text-stone-soft">Beginner</span>
                                                <div class="flex gap-2">
                                                    ${[1,2,3,4,5].map(level => `
                                                        <label class="cursor-pointer">
                                                            <input type="radio" name="${skill.id}" value="${level}" class="sr-only" required>
                                                            <div class="w-10 h-10 rounded-full border-2 border-stone-300 flex items-center justify-center hover:border-moss-gentle transition-colors skill-rating" data-level="${level}">
                                                                <span class="text-sm font-medium text-stone-400">${level}</span>
                                                            </div>
                                                        </label>
                                                    `).join('')}
                                                </div>
                                                <span class="text-sm text-stone-soft">Expert</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div class="text-center pt-6">
                                    <button type="submit" class="btn-organic btn-primary px-8 py-4">
                                        Get My Personalized Plan →
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add interactive rating functionality
        document.querySelectorAll('.skill-rating').forEach(rating => {
            rating.addEventListener('click', (e) => {
                const level = parseInt(e.currentTarget.dataset.level);
                const skillId = e.currentTarget.closest('.border').querySelector('input[type="radio"]').name;
                
                // Update visual state
                const allRatings = e.currentTarget.closest('.flex').querySelectorAll('.skill-rating');
                allRatings.forEach((r, index) => {
                    const ratingLevel = index + 1;
                    if (ratingLevel <= level) {
                        r.classList.add('bg-moss-gentle', 'border-moss-gentle', 'text-white');
                        r.classList.remove('border-stone-300', 'text-stone-400');
                        r.querySelector('span').classList.add('text-white');
                        r.querySelector('span').classList.remove('text-stone-400');
                    } else {
                        r.classList.remove('bg-moss-gentle', 'border-moss-gentle', 'text-white');
                        r.classList.add('border-stone-300', 'text-stone-400');
                        r.querySelector('span').classList.remove('text-white');
                        r.querySelector('span').classList.add('text-stone-400');
                    }
                });
                
                // Set the radio button value
                e.currentTarget.closest('.border').querySelector(`input[value="${level}"]`).checked = true;
            });
        });
        
        // Add form submission handler
        document.getElementById('skillAssessmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const skillRatings = {};
            
            this.getSkillAssessmentQuestions().forEach(skill => {
                skillRatings[skill.id] = parseInt(formData.get(skill.id));
            });
            
            this.state.user.skillRatings = skillRatings;
            this.saveState();
            this.nextProfileStep();
        });
    }
    
    getSkillAssessmentQuestions() {
        return [
            {
                id: 'communication',
                name: 'Communication & Feedback',
                description: 'Having clear conversations, giving constructive feedback, active listening',
                icon: '💬'
            },
            {
                id: 'conflict-resolution',
                name: 'Conflict Resolution',
                description: 'Managing disagreements, mediating disputes, difficult conversations',
                icon: '🤝'
            },
            {
                id: 'team-building',
                name: 'Team Building & Collaboration',
                description: 'Creating team cohesion, fostering collaboration, building trust',
                icon: '👥'
            },
            {
                id: 'performance-management',
                name: 'Performance Management',
                description: 'Setting goals, tracking progress, performance reviews, coaching',
                icon: '🎢'
            },
            {
                id: 'delegation',
                name: 'Delegation & Empowerment',
                description: 'Assigning tasks effectively, empowering team members, follow-up',
                icon: '🎆'
            },
            {
                id: 'strategic-thinking',
                name: 'Strategic Thinking',
                description: 'Long-term planning, vision setting, decision making, prioritization',
                icon: '🧠'
            },
            {
                id: 'emotional-intelligence',
                name: 'Emotional Intelligence',
                description: 'Self-awareness, empathy, managing emotions, reading team dynamics',
                icon: '❤️'
            },
            {
                id: 'change-management',
                name: 'Change Management',
                description: 'Leading through change, adapting to new situations, resilience',
                icon: '🔄'
            }
        ];
    }
    
    showPersonalizedRecommendations() {
        const mainContent = document.getElementById('mainContent');
        const diagnosis = this.generateSkillDiagnosis();
        const recommendedPath = this.getRecommendedLearningPath();
        
        mainContent.innerHTML = `
            <div id="recommendationsScreen" class="screen" style="padding-top: 80px;">
                <div class="container-organic">
                    <div class="max-w-5xl mx-auto">
                        <div class="text-center mb-12">
                            <h1 class="heading-display mb-4">Your Personalized Journey 🎆</h1>
                            <p class="text-handwritten text-xl mb-2">Based on your profile, here's your custom learning path</p>
                            <div class="flex items-center justify-center gap-2 mb-4">
                                <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                                <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                                <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                                <div class="w-3 h-3 bg-moss-gentle rounded-full"></div>
                            </div>
                            <p class="text-body opacity-60">Step 4 of 4: Your Custom Plan</p>
                        </div>
                        
                        <!-- Skill Diagnosis -->
                        <div class="card-organic mb-8">
                            <h2 class="heading-section mb-6">🎯 Your Skill Profile</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 class="heading-subsection text-moss-gentle mb-4">✨ Your Strengths</h3>
                                    <div class="space-y-3">
                                        ${diagnosis.strengths.map(strength => `
                                            <div class="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                                <div class="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div class="font-medium text-green-800">${strength.name}</div>
                                                    <div class="text-sm text-green-700">Level ${strength.level}/5</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 class="heading-subsection text-sunset-warm mb-4">🎯 Growth Opportunities</h3>
                                    <div class="space-y-3">
                                        ${diagnosis.growthAreas.map(area => `
                                            <div class="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
                                                <div class="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div class="font-medium text-orange-800">${area.name}</div>
                                                    <div class="text-sm text-orange-700">Level ${area.level}/5 - High Impact</div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Recommended Learning Path -->
                        <div class="card-organic mb-8">
                            <h2 class="heading-section mb-6">🗺️ Your Learning Path</h2>
                            <p class="text-body mb-6">Based on your ${this.state.user.currentRole} role and goals, here's your personalized journey:</p>
                            
                            <div class="space-y-4">
                                ${recommendedPath.modules.map((module, index) => `
                                    <div class="flex items-start gap-4 p-6 border border-stone-200 rounded-xl hover:shadow-md transition-shadow">
                                        <div class="w-12 h-12 bg-gradient-to-br from-moss-gentle to-sage-whisper rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                            ${index + 1}
                                        </div>
                                        <div class="flex-1">
                                            <div class="flex items-start justify-between mb-2">
                                                <h3 class="heading-subsection">${module.title}</h3>
                                                <div class="flex items-center gap-2 text-sm text-stone-500">
                                                    <span>⏱️ ${module.duration}</span>
                                                    <span>•</span>
                                                    <span>🎢 ${module.scenarios} scenarios</span>
                                                </div>
                                            </div>
                                            <p class="text-body text-sm mb-3">${module.description}</p>
                                            <div class="flex items-center gap-2">
                                                <span class="text-xs bg-moss-gentle/10 text-moss-gentle px-2 py-1 rounded-full">${module.priority}</span>
                                                <span class="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">${module.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Action Items -->
                        <div class="card-organic mb-8">
                            <h2 class="heading-section mb-6">📝 Real-World Action Items</h2>
                            <p class="text-body mb-6">Start applying these insights in your current role:</p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${diagnosis.actionItems.map(item => `
                                    <div class="p-4 bg-gradient-to-br from-sage-whisper/10 to-moss-gentle/10 rounded-xl border border-sage-whisper/20">
                                        <div class="flex items-start gap-3">
                                            <div class="text-lg">${item.icon}</div>
                                            <div>
                                                <h4 class="font-medium text-soil-rich mb-1">${item.title}</h4>
                                                <p class="text-sm text-stone-soft">${item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="text-center">
                            <button onclick="window.app.completeOnboarding()" class="btn-organic btn-primary px-8 py-4 text-lg">
                                🎆 Start My Training Journey
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateSkillDiagnosis() {
        const skillRatings = this.state.user.skillRatings || {};
        const skillQuestions = this.getSkillAssessmentQuestions();
        
        const strengths = [];
        const growthAreas = [];
        const actionItems = [];
        
        // Analyze skill ratings
        skillQuestions.forEach(skill => {
            const rating = skillRatings[skill.id] || 1;
            if (rating >= 4) {
                strengths.push({ name: skill.name, level: rating, id: skill.id });
            } else if (rating <= 2) {
                growthAreas.push({ name: skill.name, level: rating, id: skill.id });
            }
        });
        
        // Generate personalized action items based on goals and weak areas
        const goals = this.state.user.goals || [];
        
        if (goals.includes('improve-communication') || skillRatings.communication <= 2) {
            actionItems.push({
                icon: '💬',
                title: 'Schedule Weekly 1:1s',
                description: 'Start having regular one-on-one meetings with your team members to practice active listening and feedback.'
            });
        }
        
        if (goals.includes('conflict-resolution') || skillRatings['conflict-resolution'] <= 2) {
            actionItems.push({
                icon: '🤝',
                title: 'Practice the DESC Method',
                description: 'Use Describe, Express, Specify, Consequences framework for difficult conversations this week.'
            });
        }
        
        if (goals.includes('team-building') || skillRatings['team-building'] <= 2) {
            actionItems.push({
                icon: '👥',
                title: 'Organize Team Building',
                description: 'Plan a team activity or retrospective to strengthen relationships and collaboration.'
            });
        }
        
        if (goals.includes('performance-management') || skillRatings['performance-management'] <= 2) {
            actionItems.push({
                icon: '🎢',
                title: 'Set SMART Goals',
                description: 'Work with each team member to establish specific, measurable goals for the next quarter.'
            });
        }
        
        return { strengths, growthAreas, actionItems };
    }
    
    getRecommendedLearningPath() {
        const role = this.state.user.currentRole;
        const experience = this.state.user.experience;
        const goals = this.state.user.goals || [];
        const skillRatings = this.state.user.skillRatings || {};
        
        let modules = [];
        
        // Customize modules based on role and experience
        if (role === 'aspiring-manager' || role === 'individual-contributor') {
            modules = [
                {
                    title: 'Foundations of Management',
                    description: 'Learn the core principles of effective leadership and management fundamentals.',
                    duration: '2-3 weeks',
                    scenarios: 8,
                    priority: 'Essential',
                    difficulty: 'Beginner'
                },
                {
                    title: 'Communication Mastery',
                    description: 'Master the art of clear communication, active listening, and giving feedback.',
                    duration: '3-4 weeks',
                    scenarios: 12,
                    priority: 'High Priority',
                    difficulty: 'Intermediate'
                },
                {
                    title: 'Building Your First Team',
                    description: 'Learn how to recruit, onboard, and build a cohesive high-performing team.',
                    duration: '4-5 weeks',
                    scenarios: 15,
                    priority: 'Medium Priority',
                    difficulty: 'Intermediate'
                }
            ];
        } else if (role === 'first-time-manager' || experience === 'less-than-1') {
            modules = [
                {
                    title: 'New Manager Bootcamp',
                    description: 'Essential skills for your first 90 days as a manager, including team dynamics.',
                    duration: '3-4 weeks',
                    scenarios: 15,
                    priority: 'Essential',
                    difficulty: 'Beginner'
                },
                {
                    title: 'Difficult Conversations',
                    description: 'Navigate challenging discussions with confidence and empathy.',
                    duration: '2-3 weeks',
                    scenarios: 10,
                    priority: 'High Priority',
                    difficulty: 'Intermediate'
                },
                {
                    title: 'Performance Management Basics',
                    description: 'Set goals, track progress, and conduct effective performance reviews.',
                    duration: '3-4 weeks',
                    scenarios: 12,
                    priority: 'High Priority',
                    difficulty: 'Intermediate'
                }
            ];
        } else {
            modules = [
                {
                    title: 'Advanced Leadership Skills',
                    description: 'Develop strategic thinking, vision setting, and advanced team management.',
                    duration: '4-5 weeks',
                    scenarios: 18,
                    priority: 'Essential',
                    difficulty: 'Advanced'
                },
                {
                    title: 'Managing Managers',
                    description: 'Learn to lead through others and build scalable management systems.',
                    duration: '5-6 weeks',
                    scenarios: 20,
                    priority: 'High Priority',
                    difficulty: 'Advanced'
                },
                {
                    title: 'Organizational Change',
                    description: 'Lead transformation initiatives and guide teams through change.',
                    duration: '4-5 weeks',
                    scenarios: 16,
                    priority: 'Medium Priority',
                    difficulty: 'Advanced'
                }
            ];
        }
        
        return { modules };
    }
    
    completeOnboarding() {
        // Mark onboarding as complete
        this.state.onboardingComplete = true;
        
        // Set initial level based on experience and assessment
        this.determineInitialLevel();
        
        // Generate initial XP based on assessment
        this.generateInitialXP();
        
        this.saveState();
        this.showSkillTree();
    }
    
    determineInitialLevel() {
        const experience = this.state.user.experience;
        const skillRatings = this.state.user.skillRatings || {};
        const averageSkill = Object.values(skillRatings).reduce((a, b) => a + b, 0) / Object.keys(skillRatings).length;
        
        if (experience === 'none' || averageSkill < 2) {
            this.state.user.level = 'Aspiring Leader';
        } else if (experience === 'less-than-1' || averageSkill < 3) {
            this.state.user.level = 'Emerging Manager';
        } else if (experience === '1-2' || averageSkill < 4) {
            this.state.user.level = 'Developing Leader';
        } else {
            this.state.user.level = 'Experienced Manager';
        }
    }
    
    generateInitialXP() {
        const skillRatings = this.state.user.skillRatings || {};
        const totalSkillPoints = Object.values(skillRatings).reduce((a, b) => a + b, 0);
        this.state.user.xp = totalSkillPoints * 10; // 10 XP per skill point
    }
    
    showSkillTree() {
        const mainContent = document.getElementById('mainContent');
        const skillTree = this.generateSkillTree();
        const userProgress = this.calculateUserProgress();
        
        mainContent.innerHTML = `
            <div id="skillTreeScreen" class="screen" style="padding-top: 80px;">
                <div class="container-organic">
                    <div class="text-center mb-12">
                        <h1 class="heading-display mb-4">Your Leadership Journey 🌳</h1>
                        <p class="text-handwritten text-xl mb-6">Navigate your personalized skill development path</p>
                        
                        <!-- User Progress Summary -->
                        <div class="max-w-2xl mx-auto mb-8">
                            <div class="card-organic">
                                <div class="grid grid-cols-3 gap-6 text-center">
                                    <div>
                                        <div class="text-3xl font-bold text-moss-gentle">${this.state.user.level}</div>
                                        <div class="text-sm text-stone-soft">Current Level</div>
                                    </div>
                                    <div>
                                        <div class="text-3xl font-bold text-sunset-warm">${this.state.user.xp}</div>
                                        <div class="text-sm text-stone-soft">Total XP</div>
                                    </div>
                                    <div>
                                        <div class="text-3xl font-bold text-sage-whisper">${userProgress.completedModules}/${userProgress.totalModules}</div>
                                        <div class="text-sm text-stone-soft">Modules Complete</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Skill Tree Visualization -->
                    <div class="max-w-6xl mx-auto">
                        <div class="relative">
                            <!-- Connection Lines (SVG overlay) -->
                            <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index: 1;">
                                ${this.generateSkillTreeConnections(skillTree)}
                            </svg>
                            
                            <!-- Skill Nodes -->
                            <div class="relative" style="z-index: 2;">
                                ${skillTree.levels.map((level, levelIndex) => `
                                    <div class="mb-16">
                                        <div class="text-center mb-8">
                                            <h2 class="heading-section text-moss-gentle">${level.title}</h2>
                                            <p class="text-body opacity-80">${level.description}</p>
                                        </div>
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-${Math.min(level.modules.length, 3)} gap-8 justify-items-center">
                                            ${level.modules.map((module, moduleIndex) => {
                                                const isUnlocked = this.isModuleUnlocked(module, levelIndex, moduleIndex);
                                                const isCompleted = this.isModuleCompleted(module.id);
                                                const progress = this.getModuleProgress(module.id);
                                                
                                                return `
                                                    <div class="skill-node relative ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}" 
                                                         onclick="${isUnlocked ? `window.app.startModule('${module.id}')` : ''}">
                                                        <div class="w-48 h-48 rounded-2xl border-4 transition-all duration-300 cursor-pointer relative overflow-hidden
                                                                ${isCompleted ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-100' : 
                                                                  isUnlocked ? 'border-moss-gentle bg-gradient-to-br from-moss-gentle/10 to-sage-whisper/20 hover:shadow-lg hover:scale-105' : 
                                                                  'border-stone-300 bg-stone-100 opacity-60'}">
                                                            
                                                            <!-- Progress Ring -->
                                                            ${progress > 0 ? `
                                                                <div class="absolute inset-2 rounded-xl border-2 border-moss-gentle/30">
                                                                    <div class="w-full h-2 bg-stone-200 rounded-full absolute bottom-4 left-4 right-4">
                                                                        <div class="h-full bg-gradient-to-r from-moss-gentle to-sage-whisper rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                                                                    </div>
                                                                </div>
                                                            ` : ''}
                                                            
                                                            <!-- Module Content -->
                                                            <div class="p-6 h-full flex flex-col justify-center text-center">
                                                                <div class="text-4xl mb-3">${module.icon}</div>
                                                                <h3 class="font-semibold text-soil-rich mb-2">${module.title}</h3>
                                                                <p class="text-sm text-stone-soft mb-3">${module.shortDescription}</p>
                                                                
                                                                <div class="flex items-center justify-center gap-2 text-xs text-stone-400">
                                                                    <span>⏱️ ${module.duration}</span>
                                                                    <span>•</span>
                                                                    <span>🎯 ${module.scenarios} scenarios</span>
                                                                </div>
                                                                
                                                                ${isCompleted ? `
                                                                    <div class="absolute top-2 right-2">
                                                                        <div class="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                                                                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                ` : ''}
                                                                
                                                                ${!isUnlocked ? `
                                                                    <div class="absolute inset-0 flex items-center justify-center bg-stone-200/80 rounded-2xl">
                                                                        <div class="text-center">
                                                                            <div class="text-2xl mb-2">🔒</div>
                                                                            <div class="text-sm font-medium text-stone-600">Complete previous modules</div>
                                                                        </div>
                                                                    </div>
                                                                ` : ''}
                                                            </div>
                                                        </div>
                                                        
                                                        <!-- XP Reward Badge -->
                                                        ${isUnlocked && !isCompleted ? `
                                                            <div class="absolute -top-2 -right-2 bg-sunset-warm text-white text-xs font-bold px-2 py-1 rounded-full">
                                                                +${module.xpReward} XP
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Legend -->
                        <div class="card-organic mt-12">
                            <h3 class="heading-subsection mb-4">Legend</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-6 h-6 border-2 border-moss-gentle bg-moss-gentle/10 rounded"></div>
                                    <span class="text-sm">Available to start</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-6 h-6 border-2 border-green-400 bg-green-100 rounded flex items-center justify-center">
                                        <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                        </svg>
                                    </div>
                                    <span class="text-sm">Completed</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="w-6 h-6 border-2 border-stone-300 bg-stone-100 rounded opacity-60"></div>
                                    <span class="text-sm">Locked</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateSkillTree() {
        const userRole = this.state.user.currentRole;
        const userExperience = this.state.user.experience;
        const recommendedPath = this.getRecommendedLearningPath();
        
        // Create a structured skill tree based on user's path
        const skillTree = {
            levels: [
                {
                    title: "Foundation Level",
                    description: "Essential management fundamentals",
                    modules: [
                        {
                            id: 'communication-basics',
                            title: 'Communication Fundamentals',
                            shortDescription: 'Master clear, effective communication',
                            icon: '💬',
                            duration: '2-3 weeks',
                            scenarios: 8,
                            xpReward: 100,
                            prerequisites: []
                        },
                        {
                            id: 'feedback-essentials',
                            title: 'Feedback Essentials',
                            shortDescription: 'Give and receive constructive feedback',
                            icon: '🎯',
                            duration: '2 weeks',
                            scenarios: 6,
                            xpReward: 80,
                            prerequisites: ['communication-basics']
                        },
                        {
                            id: 'team-dynamics',
                            title: 'Understanding Team Dynamics',
                            shortDescription: 'Learn how teams function and thrive',
                            icon: '👥',
                            duration: '3 weeks',
                            scenarios: 10,
                            xpReward: 120,
                            prerequisites: []
                        }
                    ]
                },
                {
                    title: "Intermediate Level",
                    description: "Advanced management skills",
                    modules: [
                        {
                            id: 'conflict-resolution',
                            title: 'Conflict Resolution',
                            shortDescription: 'Navigate and resolve team conflicts',
                            icon: '🤝',
                            duration: '3-4 weeks',
                            scenarios: 12,
                            xpReward: 150,
                            prerequisites: ['communication-basics', 'team-dynamics']
                        },
                        {
                            id: 'performance-management',
                            title: 'Performance Management',
                            shortDescription: 'Set goals and manage team performance',
                            icon: '🎢',
                            duration: '4 weeks',
                            scenarios: 15,
                            xpReward: 180,
                            prerequisites: ['feedback-essentials']
                        },
                        {
                            id: 'delegation-mastery',
                            title: 'Delegation Mastery',
                            shortDescription: 'Effectively delegate and empower others',
                            icon: '🎆',
                            duration: '3 weeks',
                            scenarios: 10,
                            xpReward: 140,
                            prerequisites: ['team-dynamics', 'feedback-essentials']
                        }
                    ]
                },
                {
                    title: "Advanced Level",
                    description: "Strategic leadership capabilities",
                    modules: [
                        {
                            id: 'strategic-thinking',
                            title: 'Strategic Leadership',
                            shortDescription: 'Develop vision and strategic thinking',
                            icon: '🧠',
                            duration: '5-6 weeks',
                            scenarios: 20,
                            xpReward: 250,
                            prerequisites: ['performance-management', 'conflict-resolution']
                        },
                        {
                            id: 'change-leadership',
                            title: 'Leading Change',
                            shortDescription: 'Guide teams through transformation',
                            icon: '🔄',
                            duration: '4-5 weeks',
                            scenarios: 16,
                            xpReward: 220,
                            prerequisites: ['delegation-mastery', 'strategic-thinking']
                        },
                        {
                            id: 'executive-presence',
                            title: 'Executive Presence',
                            shortDescription: 'Build influence and leadership presence',
                            icon: '🌟',
                            duration: '6 weeks',
                            scenarios: 18,
                            xpReward: 300,
                            prerequisites: ['strategic-thinking', 'change-leadership']
                        }
                    ]
                }
            ]
        };
        
        return skillTree;
    }
    
    generateSkillTreeConnections(skillTree) {
        // Generate SVG paths connecting prerequisite modules
        let connections = '';
        
        skillTree.levels.forEach((level, levelIndex) => {
            level.modules.forEach((module, moduleIndex) => {
                module.prerequisites.forEach(prereqId => {
                    // Find the prerequisite module position
                    const prereqPosition = this.findModulePosition(skillTree, prereqId);
                    const currentPosition = { level: levelIndex, module: moduleIndex };
                    
                    if (prereqPosition) {
                        // Calculate connection line coordinates
                        const startY = (prereqPosition.level * 300) + 150;
                        const endY = (currentPosition.level * 300) + 150;
                        const startX = (prereqPosition.module * 200) + 100;
                        const endX = (currentPosition.module * 200) + 100;
                        
                        connections += `
                            <path d="M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 - 50} ${endX} ${endY}" 
                                  stroke="#a8b5a3" stroke-width="2" fill="none" stroke-dasharray="5,5" opacity="0.6"/>
                        `;
                    }
                });
            });
        });
        
        return connections;
    }
    
    findModulePosition(skillTree, moduleId) {
        for (let levelIndex = 0; levelIndex < skillTree.levels.length; levelIndex++) {
            const level = skillTree.levels[levelIndex];
            for (let moduleIndex = 0; moduleIndex < level.modules.length; moduleIndex++) {
                if (level.modules[moduleIndex].id === moduleId) {
                    return { level: levelIndex, module: moduleIndex };
                }
            }
        }
        return null;
    }
    
    isModuleUnlocked(module, levelIndex, moduleIndex) {
        // First module is always unlocked
        if (levelIndex === 0 && moduleIndex === 0) return true;
        
        // Check if all prerequisites are completed
        if (module.prerequisites.length === 0) return true;
        
        return module.prerequisites.every(prereqId => 
            this.isModuleCompleted(prereqId)
        );
    }
    
    isModuleCompleted(moduleId) {
        return this.state.user.completedModules?.includes(moduleId) || false;
    }
    
    getModuleProgress(moduleId) {
        const progress = this.state.user.moduleProgress?.[moduleId];
        return progress ? progress.percentage : 0;
    }
    
    calculateUserProgress() {
        const skillTree = this.generateSkillTree();
        const totalModules = skillTree.levels.reduce((total, level) => total + level.modules.length, 0);
        const completedModules = this.state.user.completedModules?.length || 0;
        
        return {
            totalModules,
            completedModules,
            completionPercentage: Math.round((completedModules / totalModules) * 100)
        };
    }
    
    startModule(moduleId) {
        // Store current module and show module overview
        this.state.currentModule = moduleId;
        this.saveState();
        this.showModuleOverview(moduleId);
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
