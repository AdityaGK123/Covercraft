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

    init() {
        this.loadState();
        this.initDarkMode();
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
        // Tutorial implementation
        console.log('Showing tutorial');
    }

    showDashboard() {
        // Dashboard implementation
        console.log('Showing dashboard');
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
}

// Global functions for onclick handlers
function toggleMenu() {
    console.log('Menu toggled');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CapabilityGym();
});
