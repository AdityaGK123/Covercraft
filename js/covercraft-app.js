// CoverCraft - Main Application Controller
class CoverCraftApp {
    constructor() {
        this.currentScreen = 'loading-screen';
        this.userProfile = {
            voiceRange: null,
            preferredKey: null,
            tracksUsed: 0,
            maxFreeTrack: 3
        };
        this.currentSong = null;
        this.selectedMood = null;
        this.selectedGenre = null;
        this.selectedTempo = 120;
        this.backingTrack = null;
        this.recordedAudio = null;
        this.recordedVideo = null;
        
        // Initialize components
        this.voiceDetector = new VoiceDetector();
        this.backingTrackGenerator = new BackingTrackGenerator();
        this.aiEngine = new AIEngine();
        this.audioEngine = window.AudioEngine;
        
        // Initialize social integration and editor
        this.socialIntegration = new SocialIntegration();
        this.coverEditor = new CoverEditor();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoadingScreen();
        // Go back to welcome screen
        this.showScreen('welcome-screen');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.getAttribute('data-target');
                if (target) this.showScreen(target);
            });
        });

        // Welcome screen
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                this.showScreen('voice-calibration-screen');
            });
        }

        this.setupVoiceCalibration();
        this.setupSongUpload();
        this.setupStyleSelection();
        this.setupTrackCustomization();
        this.setupRecording();
        this.setupAudioEnhancement();
        this.setupExportSharing();
    }

    setupVoiceCalibration() {
        const startBtn = document.getElementById('start-calibration');
        const stopBtn = document.getElementById('stop-calibration');
        // Event listeners
        document.getElementById('get-started-btn').addEventListener('click', () => {
            this.showScreen('voice-calibration-screen');
        });

        document.getElementById('start-calibration').addEventListener('click', () => {
            this.startVoiceCalibration();
        });

        document.getElementById('stop-calibration').addEventListener('click', () => {
            this.stopVoiceCalibration();
        });

        document.getElementById('manual-scale-btn').addEventListener('click', () => {
            this.showManualScaleSelection();
        });

        document.getElementById('confirm-manual-scale').addEventListener('click', () => {
            this.selectManualScale();
        });

        document.getElementById('play-scale-sample').addEventListener('click', () => {
            const selectedScale = document.getElementById('western-scale-select').value;
            this.playScaleSample(selectedScale);
        });

        document.getElementById('play-detected-scale').addEventListener('click', () => {
            const detectedScale = this.userVocalRange?.detectedKey || this.userProfile.preferredKey || 'C Major';
            this.playScaleSample(detectedScale);
        });
        const proceedBtn = document.getElementById('proceed-to-upload');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => this.showScreen('song-upload-screen'));
        }
    }

    setupSongUpload() {
        // Upload method selection
        document.querySelectorAll('.upload-method').forEach(method => {
            method.addEventListener('click', (e) => {
                document.querySelectorAll('.upload-method').forEach(m => m.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                const methodType = e.currentTarget.getAttribute('data-method');
                this.switchUploadMethod(methodType);
            });
        });

        // YouTube processing
        const youtubeInput = document.getElementById('youtube-url');
        const processYouTubeBtn = document.getElementById('process-youtube');
        
        if (youtubeInput) {
            // Real-time URL processing on input change
            youtubeInput.addEventListener('input', (e) => {
                const url = e.target.value.trim();
                if (url && this.isValidYouTubeUrl(url)) {
                    this.processYouTubeUrl(url);
                } else if (url) {
                    this.clearSongPreview();
                }
            });
            
            // Also process on paste
            youtubeInput.addEventListener('paste', (e) => {
                setTimeout(() => {
                    const url = e.target.value.trim();
                    if (url && this.isValidYouTubeUrl(url)) {
                        this.processYouTubeUrl(url);
                    }
                }, 100);
            });
        }
        
        if (processYouTubeBtn) {
            processYouTubeBtn.addEventListener('click', () => {
                const url = document.getElementById('youtube-url').value;
                if (url) this.processYouTubeUrl(url);
            });
        }

        // File upload
        const fileInput = document.getElementById('audio-file');
        const dropZone = document.getElementById('file-drop-zone');
        
        if (dropZone) {
            dropZone.addEventListener('click', () => fileInput.click());
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) this.processAudioFile(files[0]);
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) this.processAudioFile(e.target.files[0]);
            });
        }

        const proceedToStyleBtn = document.getElementById('proceed-to-style');
        if (proceedToStyleBtn) {
            proceedToStyleBtn.addEventListener('click', () => {
                const agreement = document.getElementById('non-commercial-agreement');
                if (agreement && agreement.checked) {
                    this.showScreen('style-selection-screen');
                } else {
                    this.showError('Please confirm non-commercial use agreement');
                }
            });
        }
    }

    setupStyleSelection() {
        // Mood selection with enhanced feedback
        document.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.selectedMood = e.currentTarget.getAttribute('data-mood');
                this.updateGenerateButton();
                this.showMessage(`Selected ${this.selectedMood} mood`, 'info');
            });
        });

        // Genre selection with enhanced feedback
        document.querySelectorAll('.genre-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.genre-option').forEach(opt => opt.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.selectedGenre = e.currentTarget.getAttribute('data-genre');
                this.updateGenerateButton();
                this.showMessage(`Selected ${this.selectedGenre} style`, 'info');
            });
        });

        // Enhanced preview buttons with realistic samples
        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const style = e.currentTarget.getAttribute('data-style');
                this.previewRealisticStyle(style);
            });
        });

        // Generate button with proper validation
        document.getElementById('generate-backing-track')?.addEventListener('click', () => {
            if (this.selectedMood && this.selectedGenre) {
                this.generateBackingTrack();
            } else {
                this.showMessage('Please select both mood and style before generating', 'error');
            }
        });
        
        if (tempoSlider && tempoValue) {
            tempoSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                tempoValue.textContent = value + '%';
                this.updateTempo(value);
            });
        }

        const previewBtn = document.getElementById('preview-track');
        const proceedBtn = document.getElementById('proceed-to-record');

        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewBackingTrack());
        }
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => this.showScreen('recording-screen'));
        }
    }

    setupRecording() {
        document.querySelectorAll('.mode-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-option').forEach(o => o.classList.remove('active'));
                e.currentTarget.classList.add('active');
                const mode = e.currentTarget.getAttribute('data-mode');
                this.setRecordingMode(mode);
            });
        });

        const startBtn = document.getElementById('start-recording');
        const stopBtn = document.getElementById('stop-recording');
        const playBtn = document.getElementById('play-recording');
        const retakeBtn = document.getElementById('retake-recording');
        const proceedBtn = document.getElementById('proceed-to-mix');

        if (startBtn) startBtn.addEventListener('click', () => this.startRecording());
        if (stopBtn) stopBtn.addEventListener('click', () => this.stopRecording());
        if (playBtn) playBtn.addEventListener('click', () => this.playRecording());
        if (retakeBtn) retakeBtn.addEventListener('click', () => this.retakeRecording());
        if (proceedBtn) proceedBtn.addEventListener('click', () => this.showScreen('audio-enhancement-screen'));
    }

    setupAudioEnhancement() {
        const originalBtn = document.getElementById('preview-original');
        const enhancedBtn = document.getElementById('preview-enhanced');
        const applyBtn = document.getElementById('apply-enhancements');

        if (originalBtn) originalBtn.addEventListener('click', () => this.previewOriginalAudio());
        if (enhancedBtn) enhancedBtn.addEventListener('click', () => this.previewEnhancedAudio());
        if (applyBtn) applyBtn.addEventListener('click', () => this.applyEnhancements());
    }

    setupExportSharing() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.currentTarget.getAttribute('data-platform');
                this.shareToSocialMedia(platform);
            });
        });

        const downloadBtn = document.getElementById('download-cover');
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadCover());

        // Export screen
        document.getElementById('download-cover')?.addEventListener('click', () => this.downloadCover());
        document.getElementById('create-another-cover')?.addEventListener('click', () => this.createAnotherCover());
        document.getElementById('edit-cover')?.addEventListener('click', () => this.openCoverEditor());
        document.getElementById('quick-share')?.addEventListener('click', () => this.openSocialShare());
    }

    // Core Methods
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
    }

    showLoadingScreen() {
        this.showScreen('loading-screen');
    }

    async startVoiceCalibration() {
        const startBtn = document.getElementById('start-calibration');
        const stopBtn = document.getElementById('stop-calibration');
        const timer = document.getElementById('recording-timer');
        const timerSeconds = document.getElementById('timer-seconds');
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        // Show timer
        timer.style.display = 'block';
        
        // Initialize voice detection
        this.voiceDetection = window.VoiceDetector;
        const success = await this.voiceDetection.start();
        
        if (success) {
            // Start 10-second countdown
            let timeLeft = 10;
            timerSeconds.textContent = timeLeft;
            
            const countdown = setInterval(() => {
                timeLeft--;
                timerSeconds.textContent = timeLeft;
                
                // Update timer circle animation
                const circle = document.querySelector('.timer-circle');
                const progress = ((10 - timeLeft) / 10) * 100;
                circle.style.background = `conic-gradient(var(--primary-color) ${progress}%, var(--bg-secondary) ${progress}%)`;
                
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    this.completeVoiceCalibration();
                }
            }, 1000);
            
            // Store countdown for manual stop
            this.calibrationCountdown = countdown;
        } else {
            this.showError('Microphone access denied. Please allow microphone permissions and try again.');
            startBtn.disabled = false;
            stopBtn.disabled = true;
            timer.style.display = 'none';
        }
    }

    stopVoiceCalibration() {
        const startBtn = document.getElementById('start-calibration');
        const stopBtn = document.getElementById('stop-calibration');
        const timer = document.getElementById('recording-timer');
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        timer.style.display = 'none';
        
        // Clear countdown if running
        if (this.calibrationCountdown) {
            clearInterval(this.calibrationCountdown);
            this.calibrationCountdown = null;
        }
        
        if (this.voiceDetection) {
            this.voiceDetection.stop();
        }
    }

    completeVoiceCalibration() {
        const timer = document.getElementById('recording-timer');
        const startBtn = document.getElementById('start-calibration');
        const stopBtn = document.getElementById('stop-calibration');
        
        // Hide timer and reset UI
        timer.style.display = 'none';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        
        // Clear countdown if running
        if (this.calibrationCountdown) {
            clearInterval(this.calibrationCountdown);
            this.calibrationCountdown = null;
        }
        
        // Get real results from voice detection engine
        const results = this.voiceDetection.stop();
        
        if (results && results.confidence > 0.2) {
            this.userVocalRange = {
                detectedKey: results.preferredKey,
                range: `${results.minNote} - ${results.maxNote}`,
                confidence: results.confidence
            };
            this.userProfile.voiceRange = { min: results.minNote, max: results.maxNote };
            this.userProfile.preferredKey = results.preferredKey;
            
            // Update UI with actual detected results
            document.getElementById('user-key').textContent = results.preferredKey;
            document.getElementById('user-range').textContent = `${results.minNote} - ${results.maxNote}`;
            
            // Show Indian scale translations
            const translations = this.translateToIndianScales(results.preferredKey);
            document.getElementById('hindustani-scale').textContent = translations.hindustani;
            document.getElementById('carnatic-scale').textContent = translations.carnatic;
            
            // Show result
            document.getElementById('calibration-result').style.display = 'block';
        } else {
            this.showMessage('Voice detection failed. Please try again or select manually.', 'error');
        }
    }

    switchUploadMethod(method) {
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(method + '-form');
        if (targetSection) targetSection.classList.add('active');
    }

    processYouTubeUrl(url) {
        // Show loading state
        this.showLoadingState('youtube-processing', 'Processing YouTube link...');
        
        const videoId = this.extractYouTubeVideoId(url);
        if (!videoId) {
            this.hideLoadingState('youtube-processing');
            this.showError('Invalid YouTube URL. Please check and try again.');
            return;
        }

        // Simulate processing delay with progress
        this.simulateYouTubeProcessing(videoId);
    }
    
    simulateYouTubeProcessing(videoId) {
        const progressSteps = [
            { progress: 20, message: 'Fetching video info...' },
            { progress: 50, message: 'Extracting audio data...' },
            { progress: 80, message: 'Preparing preview...' },
            { progress: 100, message: 'Complete!' }
        ];
        
        let currentStep = 0;
        const processStep = () => {
            if (currentStep < progressSteps.length) {
                const step = progressSteps[currentStep];
                this.updateLoadingProgress('youtube-processing', step.progress, step.message);
                currentStep++;
                setTimeout(processStep, 800);
            } else {
                // Complete processing with actual YouTube metadata
                this.fetchYouTubeMetadata(videoId).then(metadata => {
                    const songData = {
                        title: metadata.title || 'YouTube Video',
                        artist: metadata.channelTitle || 'Unknown Artist', 
                        duration: metadata.duration || '0:00',
                        videoId: videoId,
                        isYouTube: true,
                        thumbnailUrl: metadata.thumbnailUrl
                    };
                    
                    this.hideLoadingState('youtube-processing');
                    this.displaySongPreview(songData);
                });
            }
        };
        
        processStep();
    }

    async fetchYouTubeMetadata(videoId) {
        try {
            // Use YouTube oEmbed API for basic metadata
            const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
            const data = await response.json();
            
            return {
                title: data.title,
                channelTitle: data.author_name,
                thumbnailUrl: data.thumbnail_url,
                duration: '0:00' // oEmbed doesn't provide duration
            };
        } catch (error) {
            console.warn('Failed to fetch YouTube metadata:', error);
            return {
                title: 'YouTube Video',
                channelTitle: 'Unknown Artist',
                duration: '0:00'
            };
        }
    }

    processAudioFile(file) {
        this.showMessage('Processing audio file...', 'info');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentSong = {
        };
        this.displaySongPreview(this.currentSong);
    };
    reader.readAsDataURL(file);
}

    displaySongPreview(songData) {
        this.currentSong = songData;
        
        // Update preview UI
        document.getElementById('song-title').textContent = songData.title;
        document.getElementById('song-artist').textContent = songData.artist;
        document.getElementById('song-duration').textContent = `Duration: ${songData.duration}`;
        
        // Show YouTube preview if applicable
        if (songData.isYouTube && songData.videoId) {
            const iframe = document.getElementById('youtube-iframe');
            const youtubePreview = document.getElementById('youtube-preview');
            
            // Set iframe src with proper parameters for embedding
            iframe.src = `https://www.youtube.com/embed/${songData.videoId}?enablejsapi=1&origin=${window.location.origin}`;
            iframe.style.display = 'block';
            youtubePreview.style.display = 'block';
            
            // Hide audio controls for YouTube
            document.getElementById('song-audio').style.display = 'none';
        } else if (songData.audioUrl) {
            // Show audio controls for uploaded files
            const audioElement = document.getElementById('song-audio');
            audioElement.src = songData.audioUrl;
            audioElement.style.display = 'block';
            document.getElementById('youtube-preview').style.display = 'none';
        }
        
        // Show preview section
        document.getElementById('song-preview').style.display = 'block';
    }

    setupYouTubePreview(videoId) {
        const youtubePreview = document.getElementById('youtube-preview');
        const iframe = document.getElementById('youtube-iframe');
        
        // Show loading state for iframe
        this.showLoadingState('iframe-loading', 'Loading video preview...');
        
        // Set up iframe with load event handling
        iframe.onload = () => {
            this.hideLoadingState('iframe-loading');
            youtubePreview.style.display = 'block';
        };
        
        iframe.onerror = () => {
            this.hideLoadingState('iframe-loading');
            this.showError('Failed to load YouTube preview');
        };
        
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?start=30&autoplay=0&rel=0&modestbranding=1`;
        document.getElementById('song-audio').style.display = 'none';
    }

    isValidYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;
        return youtubeRegex.test(url);
    }

    extractYouTubeVideoId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    clearSongPreview() {
        document.getElementById('song-preview').style.display = 'none';
        document.getElementById('youtube-preview').style.display = 'none';
        document.getElementById('song-audio').style.display = 'none';
    }

    showLoadingState(id, message) {
        let loader = document.getElementById(id);
        if (!loader) {
            loader = document.createElement('div');
            loader.id = id;
            loader.className = 'loading-overlay';
            loader.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-message">${message}</div>
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">0%</div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    updateLoadingProgress(id, progress, message) {
        const loader = document.getElementById(id);
        if (loader) {
            const progressFill = loader.querySelector('.progress-fill');
            const progressText = loader.querySelector('.progress-text');
            const messageEl = loader.querySelector('.loading-message');
            
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${progress}%`;
            if (messageEl) messageEl.textContent = message;
        }
    }

    hideLoadingState(id) {
        const loader = document.getElementById(id);
        if (loader) {
            loader.style.display = 'none';
        }
    }

    updateGenerateButton() {
        const generateBtn = document.getElementById('generate-backing-track');
        if (generateBtn && this.selectedMood && this.selectedGenre) {
            generateBtn.disabled = false;
        }
    }

    async generateBackingTrack() {
        if (!this.selectedMood || !this.selectedGenre) {
            this.showMessage('Please select both mood and style', 'error');
            return;
        }
        
        if (!this.currentSong) {
            this.showMessage('Please select a song first', 'error');
            return;
        }
        
        this.showScreen('track-generation-screen');
        
        try {
            // Generate unique user ID for quota tracking
            const userId = this.generateUserId();
            
            // Use AI Engine for intelligent backing track generation
            const backingTrack = await this.aiEngine.generateBackingTrack(
                this.currentSong,
                this.selectedMood,
                this.selectedGenre,
                this.userProfile.preferredKey,
                userId
            );
            
            this.backingTrack = backingTrack;
            
            // Show usage stats to user
            this.displayUsageInfo();
            
            this.completeTrackGeneration();
        } catch (error) {
            console.error('AI backing track generation failed:', error);
            
            // Show error message to user
            if (error.message.includes('quota exceeded')) {
                this.showQuotaExceededMessage();
            } else if (error.message.includes('Too many requests')) {
                this.showRateLimitMessage();
            }
            
            // Fallback to simulation
            this.simulateTrackGeneration();
        }
    }

    simulateTrackGeneration() {
        const progressBar = document.getElementById('generation-progress');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += 25;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => this.completeTrackGeneration(), 1000);
            }
        }, 1000);
    }

    completeTrackGeneration() {
        this.showScreen('track-customization-screen');
        this.setupTrackCustomization();
    }

    generateUserId() {
        // Generate or retrieve persistent user ID for quota tracking
        let userId = localStorage.getItem('covercraft_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('covercraft_user_id', userId);
        }
        return userId;
    }

    displayUsageInfo() {
        const stats = this.aiEngine.getUsageStats();
        const usageInfo = document.getElementById('usage-info');
        
        if (usageInfo) {
            usageInfo.innerHTML = `
                <div class="usage-stats">
                    <h4>🤖 AI Generation Active</h4>
                    <p>Monthly Usage: ${stats.percentageUsed.toFixed(1)}% (${stats.monthlyUsage}/${stats.monthlyLimit} tokens)</p>
                    <div class="usage-bar">
                        <div class="usage-fill" style="width: ${Math.min(stats.percentageUsed, 100)}%"></div>
                    </div>
                    ${stats.percentageUsed > 90 ? '<p class="usage-warning">⚠️ High usage - switching to fallback mode soon</p>' : ''}
                </div>
            `;
        }
    }

    showQuotaExceededMessage() {
        this.showMessage('Upgrade to premium for unlimited covers!', 'info');
    }

    showRateLimitMessage() {
        this.showMessage('Slow down there! Try again in a minute.', 'warning');
    }

    toggleTrack(track, enabled) {
        if (this.backingTrack) this.backingTrack[track] = enabled;
    }

    updateTempo(value) {
        if (this.backingTrack) this.backingTrack.tempo = parseInt(value);
    }

    previewBackingTrack() {
        // Generate preview based on current settings
        this.showMessage('Generating preview...', 'info');
        
        // Get current track settings
        const enabledTracks = [];
        document.querySelectorAll('.track-toggle:checked').forEach(toggle => {
            enabledTracks.push(toggle.getAttribute('data-track'));
        });
        
        const tempo = document.getElementById('tempo-slider').value;
        
        // Generate backing track preview using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.generateBackingTrackPreview(audioContext, enabledTracks, tempo);
        
        this.showMessage('Preview ready! Playing...', 'success');
    }

    generateBackingTrackPreview(audioContext, enabledTracks, tempo) {
        const baseTempo = 120; // BPM
        const adjustedTempo = (baseTempo * tempo) / 100;
        const beatDuration = 60 / adjustedTempo;
        
        // Generate different instrument tracks
        if (enabledTracks.includes('drums')) {
            this.generateDrumTrack(audioContext, beatDuration);
        }
        
        if (enabledTracks.includes('melody')) {
            this.generateMelodyTrack(audioContext, beatDuration);
        }
        
        if (enabledTracks.includes('strings')) {
            this.generateStringsTrack(audioContext, beatDuration);
        }
        
        if (enabledTracks.includes('bass')) {
            this.generateBassTrack(audioContext, beatDuration);
        }
    }

    generateDrumTrack(audioContext, beatDuration) {
        // Kick drum pattern
        for (let i = 0; i < 8; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * beatDuration);
            gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + i * beatDuration + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * beatDuration + 0.1);
            
            oscillator.start(audioContext.currentTime + i * beatDuration);
            oscillator.stop(audioContext.currentTime + i * beatDuration + 0.2);
        }
    }

    generateMelodyTrack(audioContext, beatDuration) {
        // Piano melody
        const melodyNotes = [261.63, 293.66, 329.63, 392.00]; // C, D, E, G
        
        for (let i = 0; i < 8; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(melodyNotes[i % 4], audioContext.currentTime);
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * beatDuration);
            gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + i * beatDuration + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * beatDuration + beatDuration * 0.8);
            
            oscillator.start(audioContext.currentTime + i * beatDuration);
            oscillator.stop(audioContext.currentTime + i * beatDuration + beatDuration);
        }
    }

    generateStringsTrack(audioContext, beatDuration) {
        // String pad
        const stringNotes = [196.00, 246.94, 293.66]; // G, B, D
        
        for (let i = 0; i < 4; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(stringNotes[i % 3], audioContext.currentTime);
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * beatDuration * 2);
            gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + i * beatDuration * 2 + 0.3);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * beatDuration * 2 + beatDuration * 1.8);
            
            oscillator.start(audioContext.currentTime + i * beatDuration * 2);
            oscillator.stop(audioContext.currentTime + i * beatDuration * 2 + beatDuration * 2);
        }
    }

    generateBassTrack(audioContext, beatDuration) {
        // Bass line
        const bassNotes = [82.41, 98.00, 110.00]; // E, G, A
        
        for (let i = 0; i < 8; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(bassNotes[i % 3], audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * beatDuration);
            gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + i * beatDuration + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * beatDuration + beatDuration * 0.6);
            
            oscillator.start(audioContext.currentTime + i * beatDuration);
            oscillator.stop(audioContext.currentTime + i * beatDuration + beatDuration * 0.8);
        }
    }

    setRecordingMode(mode) {
        const videoPreview = document.getElementById('video-preview');
        if (mode === 'audio-only') {
            videoPreview.style.display = 'none';
        } else {
            videoPreview.style.display = 'block';
            this.initializeCamera();
        }
    }

    async initializeCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const video = document.getElementById('camera-preview');
            if (video) video.srcObject = stream;
        } catch (error) {
            this.showError('Camera access required for video recording');
        }
    }

    async startRecording() {
        const startBtn = document.getElementById('start-recording');
        const stopBtn = document.getElementById('stop-recording');
        const indicator = document.getElementById('recording-indicator');
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        indicator.classList.add('active');
        
        try {
            // Initialize audio engine if not already done
            if (!this.audioEngine.audioContext) {
                await this.audioEngine.initialize();
            }
            
            // Determine recording mode
            const videoMode = document.querySelector('.mode-option[data-mode="audio-video"]').classList.contains('active');
            
            // Start recording with backing track
            const success = await this.audioEngine.startRecording(
                this.backingTrack?.url,
                videoMode
            );
            
            if (success) {
                this.recordingStartTime = Date.now();
                this.updateRecordingTimer();
            } else {
                throw new Error('Recording failed to start');
            }
        } catch (error) {
            this.showError('Recording failed. Please check microphone permissions.');
            startBtn.disabled = false;
            stopBtn.disabled = true;
            indicator.classList.remove('active');
        }
    }

    stopRecording() {
        const startBtn = document.getElementById('start-recording');
        const stopBtn = document.getElementById('stop-recording');
        const playBtn = document.getElementById('play-recording');
        const indicator = document.getElementById('recording-indicator');
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        playBtn.disabled = false;
        indicator.classList.remove('active');
        
        // Stop audio engine recording
        this.audioEngine.stopRecording();
        
        // Set up callback for when recording is complete
        this.audioEngine.onRecordingComplete = (recordingData) => {
            this.recordedAudio = recordingData;
            this.showRecordingResult();
        };
        
        clearInterval(this.recordingTimer);
    }

    updateRecordingTimer() {
        this.recordingTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('recording-time').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    showRecordingResult() {
        document.getElementById('recording-result').style.display = 'block';
    }

    playRecording() {
        this.showMessage('Playing recording...', 'info');
    }

    retakeRecording() {
        document.getElementById('recording-result').style.display = 'none';
        document.getElementById('recording-time').textContent = '00:00';
    }

    previewOriginalAudio() {
        this.showMessage('Playing original...', 'info');
    }

    previewEnhancedAudio() {
        this.showMessage('Playing enhanced version...', 'info');
    }

    async applyEnhancements() {
        this.showMessage('Applying enhancements...', 'info');
        
        if (this.recordedAudio && this.audioEngine) {
            try {
                // Get selected enhancements
                const enhancements = {
                    noiseReduction: document.getElementById('noise-reduction').checked,
                    eqEnhancement: document.getElementById('eq-enhancement').checked,
                    compression: document.getElementById('compression').checked,
                    autotune: document.getElementById('autotune').checked,
                    reverb: document.getElementById('reverb').checked,
                    echo: document.getElementById('echo').checked
                };
                
                // Apply enhancements
                const enhancedBlob = await this.audioEngine.enhanceAudio(
                    this.recordedAudio.blob,
                    enhancements
                );
                
                // Update recorded audio with enhanced version
                this.recordedAudio.enhancedBlob = enhancedBlob;
                this.recordedAudio.enhancedUrl = URL.createObjectURL(enhancedBlob);
                
                setTimeout(() => this.showScreen('export-screen'), 1000);
            } catch (error) {
                this.showError('Enhancement failed. Using original recording.');
                setTimeout(() => this.showScreen('export-screen'), 1000);
            }
        } else {
            setTimeout(() => this.showScreen('export-screen'), 2000);
        }
    }

    shareToSocialMedia(platform) {
        this.showMessage(`Sharing to ${platform}...`, 'success');
    }

    downloadCover() {
        if (this.recordedAudio && this.audioEngine) {
            const audioToDownload = this.recordedAudio.enhancedBlob || this.recordedAudio.blob;
            const filename = `${this.currentSong?.title || 'cover'}_${Date.now()}.wav`;
            this.audioEngine.downloadAudio(audioToDownload, filename);
            this.showMessage('Download started...', 'success');
        } else {
            this.showMessage('No recording available to download', 'error');
        }
    }

    createAnotherCover() {
        this.userProfile.tracksUsed++;
        if (this.userProfile.tracksUsed >= this.userProfile.maxFreeTrack) {
            this.showPremiumModal();
        } else {
            this.showScreen('voice-calibration-screen');
        }
    }

    // Social Media & Editor Integration
    openCoverEditor() {
        if (this.recordedVideo || this.recordedAudio) {
            const videoBlob = this.recordedVideo;
            const audioBlob = this.recordedAudio;
            
            this.coverEditor.open(videoBlob, audioBlob, (editedVideo) => {
                // After editing is complete, open social sharing
                this.socialIntegration.open(editedVideo);
            });
        } else {
            this.showMessage('No recorded cover found to edit', 'error');
        }
    }

    openSocialShare() {
        if (this.recordedVideo || this.recordedAudio) {
            const finalVideo = this.recordedVideo;
            this.socialIntegration.open(finalVideo);
        } else {
            this.showMessage('No recorded cover found to share', 'error');
        }
    }

    showPremiumModal() {
        this.showMessage('Upgrade to premium for unlimited covers!', 'info');
    }

    showMessage(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    // Indian Scale Translation System
    translateToIndianScales(westernKey) {
        const scaleMap = {
            'C Major': { 
                hindustani: 'Bilawal Thaat (Sa Re Ga Ma Pa Dha Ni)', 
                carnatic: 'Shankarabharanam (Sa Ri Ga Ma Pa Dha Ni)' 
            },
            'D Major': { 
                hindustani: 'Khamaj Thaat (Sa Re Ga Ma Pa Dha ni)', 
                carnatic: 'Harikambhoji (Sa Ri Ga Ma Pa Dha ni)' 
            },
            'E Major': { 
                hindustani: 'Kalyan Thaat (Sa Re Ga ma Pa Dha Ni)', 
                carnatic: 'Kalyani (Sa Ri Ga ma Pa Dha Ni)' 
            },
            'F Major': { 
                hindustani: 'Bhairav Thaat (Sa ra Ga Ma Pa dha Ni)', 
                carnatic: 'Mayamalavagowla (Sa ra Ga Ma Pa dha Ni)' 
            },
            'G Major': { 
                hindustani: 'Kafi Thaat (Sa Re ga Ma Pa Dha ni)', 
                carnatic: 'Kharaharapriya (Sa Ri ga Ma Pa Dha ni)' 
            },
            'A Major': { 
                hindustani: 'Yaman Thaat (Sa Re Ga ma Pa Dha Ni)', 
                carnatic: 'Kalyani (Sa Ri Ga ma Pa Dha Ni)' 
            },
            'B Major': { 
                hindustani: 'Marwa Thaat (Sa ra Ga ma Pa Dha Ni)', 
                carnatic: 'Gamanashrama (Sa ra Ga ma Pa Dha Ni)' 
            }
        };

        return scaleMap[westernKey] || { 
            hindustani: 'Bilawal Thaat (Sa Re Ga Ma Pa Dha Ni)', 
            carnatic: 'Shankarabharanam (Sa Ri Ga Ma Pa Dha Ni)' 
        };
    }

    // Manual Scale Selection for Advanced Users
    showManualScaleSelection() {
        const modal = document.getElementById('manual-scale-modal');
        if (modal) {
            modal.style.display = 'block';
            this.populateScaleOptions();
        }
    }

    populateScaleOptions() {
        const westernSelect = document.getElementById('western-scale-select');
        const hindustaniSelect = document.getElementById('hindustani-scale-select');
        const carnaticSelect = document.getElementById('carnatic-scale-select');

        if (westernSelect) {
            westernSelect.innerHTML = `
                <option value="C Major">C Major</option>
                <option value="D Major">D Major</option>
                <option value="E Major">E Major</option>
                <option value="F Major">F Major</option>
                <option value="G Major">G Major</option>
                <option value="A Major">A Major</option>
                <option value="B Major">B Major</option>
            `;
        }

        if (hindustaniSelect) {
            hindustaniSelect.innerHTML = `
                <option value="Bilawal">Bilawal Thaat</option>
                <option value="Khamaj">Khamaj Thaat</option>
                <option value="Kalyan">Kalyan Thaat</option>
                <option value="Bhairav">Bhairav Thaat</option>
                <option value="Kafi">Kafi Thaat</option>
                <option value="Yaman">Yaman Thaat</option>
                <option value="Marwa">Marwa Thaat</option>
            `;
        }

        if (carnaticSelect) {
            carnaticSelect.innerHTML = `
                <option value="Shankarabharanam">Shankarabharanam</option>
                <option value="Harikambhoji">Harikambhoji</option>
                <option value="Kalyani">Kalyani</option>
                <option value="Mayamalavagowla">Mayamalavagowla</option>
                <option value="Kharaharapriya">Kharaharapriya</option>
            `;
        }
    }

    selectManualScale() {
        const selectedScale = document.getElementById('western-scale-select').value;
        this.userProfile.preferredKey = selectedScale;
        
        // Set default range based on scale
        this.userProfile.voiceRange = { min: 'C3', max: 'G4' };
        
        // Update display
        const scaleTranslations = this.translateToIndianScales(selectedScale);
        document.getElementById('user-key').textContent = selectedScale;
        document.getElementById('user-range').textContent = `${this.userProfile.voiceRange.min} - ${this.userProfile.voiceRange.max}`;
        document.getElementById('hindustani-scale').textContent = scaleTranslations.hindustani;
        document.getElementById('carnatic-scale').textContent = scaleTranslations.carnatic;
        document.getElementById('calibration-result').style.display = 'block';
        
        // Close modal
        document.getElementById('manual-scale-modal').style.display = 'none';
        
        // Play sample for selected scale
        this.playScaleSample(selectedScale);
    }

    playScaleSample(scale) {
        // Create a simple scale sample using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const scaleFrequencies = {
            'C Major': [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
            'D Major': [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33],
            'E Major': [329.63, 369.99, 415.30, 440.00, 493.88, 554.37, 622.25, 659.25],
            'F Major': [349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 659.25, 698.46],
            'G Major': [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99],
            'A Major': [440.00, 493.88, 554.37, 587.33, 659.25, 739.99, 830.61, 880.00],
            'B Major': [493.88, 554.37, 622.25, 659.25, 739.99, 830.61, 932.33, 987.77]
        };

        const frequencies = scaleFrequencies[scale] || scaleFrequencies['C Major'];
        
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + index * 0.5 + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + index * 0.5 + 0.4);
            
            oscillator.start(audioContext.currentTime + index * 0.5);
            oscillator.stop(audioContext.currentTime + index * 0.5 + 0.5);
        });
    }

    playStylePreview(style) {
        // Stop any currently playing preview
        if (this.currentPreviewContext) {
            this.currentPreviewContext.close();
        }
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.currentPreviewContext = audioContext;
        
        // Show preview feedback
        this.showMessage(`🎵 Playing ${style} preview...`, 'info', 3000);
        
        // Full musical section previews (30-second integrated demos)
        const stylePatterns = {
            'chill': this.generateChillSection(audioContext, this.selectedTempo || 120),
            'emotional': this.generateEmotionalSection(audioContext, this.selectedTempo || 120),
            'energetic': this.generateEnergeticSection(audioContext, this.selectedTempo || 120),
            'romantic': this.generateRomanticSection(audioContext, this.selectedTempo || 120),
            'indie-acoustic': this.generateIndieAcousticSection(audioContext, this.selectedTempo || 120),
            'bollywood': this.generateBollywoodSection(audioContext, this.selectedTempo || 120),
            'singer-songwriter': this.generateSingerSongwriterSection(audioContext, this.selectedTempo || 120),
            'folk-pop': this.generateFolkPopSection(audioContext, this.selectedTempo || 120),
            'neo-soul': this.generateNeoSoulSection(audioContext, this.selectedTempo || 120)
        };

        const pattern = stylePatterns[style] || stylePatterns['chill'];
        pattern();
        
        // Auto-stop after 30 seconds
        setTimeout(() => {
            if (this.currentPreviewContext) {
                this.currentPreviewContext.close();
                this.currentPreviewContext = null;
            }
        }, 30000);
    }

    previewCurrentStyleWithTempo() {
        const selectedStyle = this.getSelectedStyle();
        if (selectedStyle) {
            this.playStylePreview(selectedStyle);
        } else {
            this.showMessage('Please select a mood and style first', 'warning', 3000);
        }
    }

    getSelectedStyle() {
        // Combine mood and genre to determine style
        if (this.selectedMood && this.selectedGenre) {
            return `${this.selectedMood}-${this.selectedGenre}`;
        } else if (this.selectedMood) {
            return this.selectedMood;
        } else if (this.selectedGenre) {
            return this.selectedGenre;
        }
        return null;
    }

    generateChillSection(audioContext, tempo) {
        return () => {
            const beatDuration = 60 / tempo;
            const totalDuration = 30;
            
            // Chill: Soft electric piano + Subtle shakers + Warm strings
            this.createChillElectricPiano(audioContext, beatDuration, totalDuration);
            this.createChillPercussion(audioContext, beatDuration, totalDuration);
            this.createChillStrings(audioContext, beatDuration, totalDuration);
        };
    }

    generateEmotionalPattern(audioContext) {
        return () => {
            // String-based emotional pattern
            const stringNotes = [220.00, 246.94, 293.66, 329.63]; // A, B, D, E
            
            for (let i = 0; i < 6; i++) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(stringNotes[i % 4], audioContext.currentTime);
                oscillator.type = 'sawtooth';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 3);
                gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + i * 3 + 0.5);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * 3 + 2.5);
                
                oscillator.start(audioContext.currentTime + i * 3);
                oscillator.stop(audioContext.currentTime + i * 3 + 3);
            }
        };
    }

    generateEnergeticPattern(audioContext) {
        return () => {
            // Drum and bass pattern
            const bassNotes = [82.41, 110.00, 146.83]; // E, A, D
            
            for (let i = 0; i < 10; i++) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(bassNotes[i % 3], audioContext.currentTime);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 2);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + i * 2 + 0.05);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * 2 + 0.5);
                
                oscillator.start(audioContext.currentTime + i * 2);
                oscillator.stop(audioContext.currentTime + i * 2 + 1);
            }
        };
    }

    generateRomanticPattern(audioContext) {
        return () => {
            // Soft piano and strings
            const romanticNotes = [261.63, 293.66, 329.63, 392.00, 440.00];
            
            for (let i = 0; i < 8; i++) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(romanticNotes[i % 5], audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 2.5);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + i * 2.5 + 0.3);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * 2.5 + 2);
                
                oscillator.start(audioContext.currentTime + i * 2.5);
                oscillator.stop(audioContext.currentTime + i * 2.5 + 2.5);
            }
        };
    }

    generateIndieAcousticSection(audioContext, tempo) {
        return () => {
            const beatDuration = 60 / tempo;
            const totalDuration = 30;
            
            // Indie acoustic: Fingerpicked guitar + Soft percussion + Light strings
            this.createIndieAcousticGuitar(audioContext, beatDuration, totalDuration);
            this.createIndiePercussion(audioContext, beatDuration, totalDuration);
            this.createIndieStrings(audioContext, beatDuration, totalDuration);
        };
    }

    generateBollywoodSection(audioContext, tempo) {
        return () => {
            const beatDuration = 60 / tempo;
            const totalDuration = 30;
            
            // Full Bollywood arrangement with tabla, harmonium, strings, and melody
            this.createBollywoodTabla(audioContext, beatDuration, totalDuration);
            this.createBollywoodHarmonium(audioContext, beatDuration, totalDuration);
            this.createBollywoodStrings(audioContext, beatDuration, totalDuration);
            this.createBollywoodMelody(audioContext, beatDuration, totalDuration);
        };
    }

    generateClassicalPattern(audioContext) {
        return () => {
            // Sitar-like pattern
            const classicalNotes = [146.83, 164.81, 196.00, 220.00, 246.94];
            
            for (let i = 0; i < 10; i++) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(classicalNotes[i % 5], audioContext.currentTime);
                oscillator.type = 'sawtooth';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 2);
                gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + i * 2 + 0.3);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * 2 + 1.5);
                
                oscillator.start(audioContext.currentTime + i * 2);
                oscillator.stop(audioContext.currentTime + i * 2 + 2);
            }
        };
    }

    generateWesternPopPattern(audioContext) {
        return () => {
            // Standard pop progression
            const popNotes = [261.63, 329.63, 392.00, 440.00];
            
            for (let i = 0; i < 8; i++) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(popNotes[i % 4], audioContext.currentTime);
                oscillator.type = 'square';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 2.5);
                gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + i * 2.5 + 0.1);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * 2.5 + 2);
                
                oscillator.start(audioContext.currentTime + i * 2.5);
                oscillator.stop(audioContext.currentTime + i * 2.5 + 2.5);
            }
        };
    }

    // Full musical section generators for integrated demos
    createBollywoodTabla(audioContext, beatDuration, totalDuration) {
        const beats = Math.floor(totalDuration / beatDuration);
        for (let beat = 0; beat < beats; beat++) {
            const startTime = audioContext.currentTime + beat * beatDuration;
            
            // Dha (bass stroke)
            if (beat % 4 === 0 || beat % 4 === 2) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(120, startTime);
                osc.type = 'triangle';
                gain.gain.setValueAtTime(0.4, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
                
                osc.start(startTime);
                osc.stop(startTime + 0.3);
            }
            
            // Ti (treble stroke)
            if (beat % 8 === 3 || beat % 8 === 7) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(200, startTime);
                osc.type = 'sawtooth';
                gain.gain.setValueAtTime(0.3, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
                
                osc.start(startTime);
                osc.stop(startTime + 0.2);
            }
        }
    }

    createBollywoodHarmonium(audioContext, beatDuration, totalDuration) {
        const chordProgression = [
            [261.63, 329.63, 392.00], // C major
            [293.66, 369.99, 440.00], // D minor
            [329.63, 415.30, 493.88], // E minor
            [261.63, 329.63, 392.00]  // C major
        ];
        
        const chordDuration = beatDuration * 4;
        const chords = Math.floor(totalDuration / chordDuration);
        
        for (let c = 0; c < chords; c++) {
            const chord = chordProgression[c % 4];
            const startTime = audioContext.currentTime + c * chordDuration;
            
            chord.forEach((freq, noteIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'sawtooth';
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.15 - noteIndex * 0.02, startTime + 0.5);
                gain.gain.linearRampToValueAtTime(0.1 - noteIndex * 0.02, startTime + chordDuration - 0.5);
                gain.gain.linearRampToValueAtTime(0, startTime + chordDuration);
                
                osc.start(startTime);
                osc.stop(startTime + chordDuration);
            });
        }
    }

    createBollywoodStrings(audioContext, beatDuration, totalDuration) {
        const stringNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const phraseDuration = beatDuration * 8;
        const phrases = Math.floor(totalDuration / phraseDuration);
        
        for (let p = 0; p < phrases; p++) {
            const startTime = audioContext.currentTime + p * phraseDuration;
            
            stringNotes.forEach((freq, noteIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime + noteIndex * beatDuration);
                osc.type = 'sawtooth';
                
                const noteStart = startTime + noteIndex * beatDuration;
                gain.gain.setValueAtTime(0, noteStart);
                gain.gain.linearRampToValueAtTime(0.08, noteStart + 0.3);
                gain.gain.linearRampToValueAtTime(0.05, noteStart + beatDuration * 1.5);
                gain.gain.linearRampToValueAtTime(0, noteStart + beatDuration * 2);
                
                osc.start(noteStart);
                osc.stop(noteStart + beatDuration * 2);
            });
        }
    }

    createBollywoodMelody(audioContext, beatDuration, totalDuration) {
        const melodyNotes = [392.00, 440.00, 493.88, 523.25, 587.33, 659.25]; // G4-E5
        const noteDuration = beatDuration * 0.75;
        const totalNotes = Math.floor(totalDuration / noteDuration);
        
        for (let n = 0; n < totalNotes; n++) {
            if (Math.random() > 0.3) { // 70% chance to play note
                const freq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
                const startTime = audioContext.currentTime + n * noteDuration;
                
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'triangle';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.12, startTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
                
                osc.start(startTime);
                osc.stop(startTime + noteDuration);
            }
        }
    }

    createIndieAcousticGuitar(audioContext, beatDuration, totalDuration) {
        const chords = [
            [82.41, 110.00, 146.83, 196.00], // Em
            [110.00, 146.83, 196.00, 246.94], // Am
            [98.00, 130.81, 164.81, 196.00], // G
            [87.31, 116.54, 146.83, 174.61]  // D
        ];
        
        const strumPattern = [1, 0, 1, 0, 1, 1, 0, 1]; // Down-up pattern
        const chordDuration = beatDuration * 8;
        const totalChords = Math.floor(totalDuration / chordDuration);
        
        for (let c = 0; c < totalChords; c++) {
            const chord = chords[c % 4];
            const chordStart = audioContext.currentTime + c * chordDuration;
            
            strumPattern.forEach((strum, beatIndex) => {
                if (strum) {
                    const strumTime = chordStart + beatIndex * beatDuration;
                    
                    chord.forEach((freq, stringIndex) => {
                        const osc = audioContext.createOscillator();
                        const gain = audioContext.createGain();
                        osc.connect(gain).connect(audioContext.destination);
                        
                        osc.frequency.setValueAtTime(freq, strumTime + stringIndex * 0.01);
                        osc.type = 'sawtooth';
                        
                        gain.gain.setValueAtTime(0, strumTime);
                        gain.gain.linearRampToValueAtTime(0.15 - stringIndex * 0.02, strumTime + 0.05);
                        gain.gain.exponentialRampToValueAtTime(0.01, strumTime + beatDuration * 0.8);
                        
                        osc.start(strumTime);
                        osc.stop(strumTime + beatDuration);
                    });
                }
            });
        }
    }

    createIndiePercussion(audioContext, beatDuration, totalDuration) {
        const beats = Math.floor(totalDuration / beatDuration);
        
        for (let beat = 0; beat < beats; beat++) {
            const startTime = audioContext.currentTime + beat * beatDuration;
            
            // Shaker on every beat
            if (Math.random() > 0.2) {
                const noise = audioContext.createBufferSource();
                const buffer = audioContext.createBuffer(1, 1024, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < 1024; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                noise.buffer = buffer;
                
                const gain = audioContext.createGain();
                noise.connect(gain).connect(audioContext.destination);
                
                gain.gain.setValueAtTime(0.08, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
                
                noise.start(startTime);
                noise.stop(startTime + 0.1);
            }
        }
    }

    createIndieStrings(audioContext, beatDuration, totalDuration) {
        const stringChords = [
            [196.00, 246.94, 293.66, 349.23], // G-B-D-F
            [220.00, 277.18, 329.63, 415.30], // A-C#-E-G#
        ];
        
        const phraseDuration = beatDuration * 16;
        const phrases = Math.floor(totalDuration / phraseDuration);
        
        for (let p = 0; p < phrases; p++) {
            const chord = stringChords[p % 2];
            const startTime = audioContext.currentTime + p * phraseDuration;
            
            chord.forEach((freq, noteIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'sawtooth';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.06 - noteIndex * 0.01, startTime + 2);
                gain.gain.linearRampToValueAtTime(0.04 - noteIndex * 0.01, startTime + phraseDuration - 2);
                gain.gain.linearRampToValueAtTime(0, startTime + phraseDuration);
                
                osc.start(startTime);
                osc.stop(startTime + phraseDuration);
            });
        }
    }

    createChillElectricPiano(audioContext, beatDuration, totalDuration) {
        const chords = [
            [261.63, 329.63, 392.00, 523.25], // Cmaj7
            [246.94, 311.13, 369.99, 493.88], // Bm7
            [220.00, 277.18, 329.63, 440.00], // Am7
            [196.00, 246.94, 293.66, 392.00]  // Gm7
        ];
        
        const chordDuration = beatDuration * 4;
        const totalChords = Math.floor(totalDuration / chordDuration);
        
        for (let c = 0; c < totalChords; c++) {
            const chord = chords[c % 4];
            const startTime = audioContext.currentTime + c * chordDuration;
            
            chord.forEach((freq, noteIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'sine';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.08 - noteIndex * 0.01, startTime + 0.3);
                gain.gain.linearRampToValueAtTime(0.05 - noteIndex * 0.01, startTime + chordDuration - 0.5);
                gain.gain.linearRampToValueAtTime(0, startTime + chordDuration);
                
                osc.start(startTime);
                osc.stop(startTime + chordDuration);
            });
        }
    }

    createChillPercussion(audioContext, beatDuration, totalDuration) {
        const beats = Math.floor(totalDuration / beatDuration);
        
        for (let beat = 0; beat < beats; beat++) {
            const startTime = audioContext.currentTime + beat * beatDuration;
            
            // Soft shaker every 2 beats
            if (beat % 2 === 0 && Math.random() > 0.3) {
                const noise = audioContext.createBufferSource();
                const buffer = audioContext.createBuffer(1, 512, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < 512; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                noise.buffer = buffer;
                
                const gain = audioContext.createGain();
                noise.connect(gain).connect(audioContext.destination);
                
                gain.gain.setValueAtTime(0.04, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
                
                noise.start(startTime);
                noise.stop(startTime + 0.2);
            }
        }
    }

    createChillStrings(audioContext, beatDuration, totalDuration) {
        const pad = [392.00, 493.88, 587.33, 698.46]; // G-B-D-F
        const startTime = audioContext.currentTime;
        
        pad.forEach((freq, noteIndex) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain).connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, startTime);
            osc.type = 'sawtooth';
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.03 - noteIndex * 0.005, startTime + 3);
            gain.gain.linearRampToValueAtTime(0.02 - noteIndex * 0.005, startTime + totalDuration - 3);
            gain.gain.linearRampToValueAtTime(0, startTime + totalDuration);
            
            osc.start(startTime);
            osc.stop(startTime + totalDuration);
        });
    }

    // Additional style section generators
    generateEmotionalSection(audioContext, tempo) {
        return () => {
            const beatDuration = 60 / tempo;
            const totalDuration = 30;
            
            // Emotional: Strings + Soft piano + Light percussion
            this.createEmotionalStrings(audioContext, beatDuration, totalDuration);
            this.createEmotionalPiano(audioContext, beatDuration, totalDuration);
            this.createEmotionalPercussion(audioContext, beatDuration, totalDuration);
        };
    }

    generateEnergeticSection(audioContext, tempo) {
        return () => {
            const beatDuration = 60 / tempo;
            const totalDuration = 30;
            
            // Energetic: Driving guitar + Strong percussion + Bass
            this.createEnergeticGuitar(audioContext, beatDuration, totalDuration);
            this.createEnergeticPercussion(audioContext, beatDuration, totalDuration);
            this.createEnergeticBass(audioContext, beatDuration, totalDuration);
        };
    }

    generateRomanticSection(audioContext, tempo) {
        return () => {
            const beatDuration = 60 / tempo;
            const totalDuration = 30;
            
            // Romantic: Soft strings + Gentle piano + Subtle percussion
            this.createRomanticStrings(audioContext, beatDuration, totalDuration);
            this.createRomanticPiano(audioContext, beatDuration, totalDuration);
            this.createRomanticPercussion(audioContext, beatDuration, totalDuration);
        };
    }

    generateSingerSongwriterSection(audioContext, tempo) {
        return () => {
            const beatDuration = 60 / tempo;
            const totalDuration = 30;
            
            // Singer-songwriter: Fingerpicked guitar + Soft strings + Minimal percussion
            this.createSingerSongwriterGuitar(audioContext, beatDuration, totalDuration);
            this.createSingerSongwriterStrings(audioContext, beatDuration, totalDuration);
            this.createSingerSongwriterPercussion(audioContext, beatDuration, totalDuration);
        };
    }

    generateFolkPopSection(audioContext, tempo) {
        return () => {
            const beatDuration = 60 / tempo;
            const totalDuration = 30;
            
            // Folk-pop: Acoustic guitar + Light strings + Organic percussion
            this.createFolkPopGuitar(audioContext, beatDuration, totalDuration);
            this.createFolkPopStrings(audioContext, beatDuration, totalDuration);
            this.createFolkPopPercussion(audioContext, beatDuration, totalDuration);
        };
    }

    generateNeoSoulSection(audioContext, tempo) {
        return () => {
            const beatDuration = 60 / tempo;
            const totalDuration = 30;
            
            // Neo-soul: Electric piano + Smooth bass + Groove percussion
            this.createNeoSoulPiano(audioContext, beatDuration, totalDuration);
            this.createNeoSoulBass(audioContext, beatDuration, totalDuration);
            this.createNeoSoulPercussion(audioContext, beatDuration, totalDuration);
        };
    }

    // Emotional style components
    createEmotionalStrings(audioContext, beatDuration, totalDuration) {
        const emotionalChords = [
            [220.00, 277.18, 329.63, 415.30], // Am7
            [196.00, 246.94, 293.66, 369.99], // Gm7
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [174.61, 220.00, 261.63, 329.63]  // Fm7
        ];
        
        const chordDuration = beatDuration * 8;
        const totalChords = Math.floor(totalDuration / chordDuration);
        
        for (let c = 0; c < totalChords; c++) {
            const chord = emotionalChords[c % 4];
            const startTime = audioContext.currentTime + c * chordDuration;
            
            chord.forEach((freq, noteIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'sawtooth';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.06 - noteIndex * 0.01, startTime + 2);
                gain.gain.linearRampToValueAtTime(0.04 - noteIndex * 0.01, startTime + chordDuration - 2);
                gain.gain.linearRampToValueAtTime(0, startTime + chordDuration);
                
                osc.start(startTime);
                osc.stop(startTime + chordDuration);
            });
        }
    }

    createEmotionalPiano(audioContext, beatDuration, totalDuration) {
        const melodyNotes = [329.63, 369.99, 415.30, 466.16, 523.25]; // E-F#-G#-A#-C
        const noteDuration = beatDuration * 2;
        const totalNotes = Math.floor(totalDuration / noteDuration);
        
        for (let n = 0; n < totalNotes; n++) {
            if (Math.random() > 0.4) { // 60% chance to play note
                const freq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
                const startTime = audioContext.currentTime + n * noteDuration;
                
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'triangle';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.08, startTime + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
                
                osc.start(startTime);
                osc.stop(startTime + noteDuration);
            }
        }
    }

    createEmotionalPercussion(audioContext, beatDuration, totalDuration) {
        const beats = Math.floor(totalDuration / beatDuration);
        
        for (let beat = 0; beat < beats; beat++) {
            const startTime = audioContext.currentTime + beat * beatDuration;
            
            // Soft tambourine every 4 beats
            if (beat % 4 === 0 && Math.random() > 0.3) {
                const noise = audioContext.createBufferSource();
                const buffer = audioContext.createBuffer(1, 256, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < 256; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                noise.buffer = buffer;
                
                const gain = audioContext.createGain();
                noise.connect(gain).connect(audioContext.destination);
                
                gain.gain.setValueAtTime(0.05, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
                
                noise.start(startTime);
                noise.stop(startTime + 0.3);
            }
        }
    }

    // Energetic style components
    createEnergeticGuitar(audioContext, beatDuration, totalDuration) {
        const powerChords = [
            [82.41, 164.81], // E power chord
            [110.00, 220.00], // A power chord
            [146.83, 293.66], // D power chord
            [98.00, 196.00]   // G power chord
        ];
        
        const chordDuration = beatDuration * 2;
        const totalChords = Math.floor(totalDuration / chordDuration);
        
        for (let c = 0; c < totalChords; c++) {
            const chord = powerChords[c % 4];
            const startTime = audioContext.currentTime + c * chordDuration;
            
            chord.forEach((freq, noteIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'sawtooth';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2 - noteIndex * 0.05, startTime + 0.1);
                gain.gain.linearRampToValueAtTime(0.15 - noteIndex * 0.05, startTime + chordDuration - 0.1);
                gain.gain.linearRampToValueAtTime(0, startTime + chordDuration);
                
                osc.start(startTime);
                osc.stop(startTime + chordDuration);
            });
        }
    }

    createEnergeticPercussion(audioContext, beatDuration, totalDuration) {
        const beats = Math.floor(totalDuration / beatDuration);
        
        for (let beat = 0; beat < beats; beat++) {
            const startTime = audioContext.currentTime + beat * beatDuration;
            
            // Strong kick on 1 and 3
            if (beat % 4 === 0 || beat % 4 === 2) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(60, startTime);
                osc.type = 'triangle';
                gain.gain.setValueAtTime(0.3, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
                
                osc.start(startTime);
                osc.stop(startTime + 0.2);
            }
            
            // Snare on 2 and 4
            if (beat % 4 === 1 || beat % 4 === 3) {
                const noise = audioContext.createBufferSource();
                const buffer = audioContext.createBuffer(1, 2048, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < 2048; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                noise.buffer = buffer;
                
                const gain = audioContext.createGain();
                noise.connect(gain).connect(audioContext.destination);
                
                gain.gain.setValueAtTime(0.15, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
                
                noise.start(startTime);
                noise.stop(startTime + 0.1);
            }
        }
    }

    createEnergeticBass(audioContext, beatDuration, totalDuration) {
        const bassNotes = [82.41, 110.00, 146.83, 98.00]; // E-A-D-G
        const noteDuration = beatDuration;
        const totalNotes = Math.floor(totalDuration / noteDuration);
        
        for (let n = 0; n < totalNotes; n++) {
            const freq = bassNotes[n % 4];
            const startTime = audioContext.currentTime + n * noteDuration;
            
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain).connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, startTime);
            osc.type = 'triangle';
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.18, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration * 0.8);
            
            osc.start(startTime);
            osc.stop(startTime + noteDuration);
        }
    }

    // Romantic style components
    createRomanticStrings(audioContext, beatDuration, totalDuration) {
        const romanticPad = [261.63, 329.63, 392.00, 493.88, 587.33]; // C-E-G-B-D
        const startTime = audioContext.currentTime;
        
        romanticPad.forEach((freq, noteIndex) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain).connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, startTime);
            osc.type = 'sawtooth';
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.04 - noteIndex * 0.005, startTime + 4);
            gain.gain.linearRampToValueAtTime(0.03 - noteIndex * 0.005, startTime + totalDuration - 4);
            gain.gain.linearRampToValueAtTime(0, startTime + totalDuration);
            
            osc.start(startTime);
            osc.stop(startTime + totalDuration);
        });
    }

    createRomanticPiano(audioContext, beatDuration, totalDuration) {
        const romanticChords = [
            [261.63, 329.63, 392.00], // C major
            [220.00, 277.18, 329.63], // A minor
            [196.00, 246.94, 293.66], // G major
            [174.61, 220.00, 261.63]  // F major
        ];
        
        const chordDuration = beatDuration * 6;
        const totalChords = Math.floor(totalDuration / chordDuration);
        
        for (let c = 0; c < totalChords; c++) {
            const chord = romanticChords[c % 4];
            const startTime = audioContext.currentTime + c * chordDuration;
            
            chord.forEach((freq, noteIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'triangle';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.06 - noteIndex * 0.01, startTime + 1);
                gain.gain.linearRampToValueAtTime(0.04 - noteIndex * 0.01, startTime + chordDuration - 1);
                gain.gain.linearRampToValueAtTime(0, startTime + chordDuration);
                
                osc.start(startTime);
                osc.stop(startTime + chordDuration);
            });
        }
    }

    createRomanticPercussion(audioContext, beatDuration, totalDuration) {
        const beats = Math.floor(totalDuration / beatDuration);
        
        for (let beat = 0; beat < beats; beat++) {
            const startTime = audioContext.currentTime + beat * beatDuration;
            
            // Very soft shaker every 8 beats
            if (beat % 8 === 0 && Math.random() > 0.5) {
                const noise = audioContext.createBufferSource();
                const buffer = audioContext.createBuffer(1, 128, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < 128; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                noise.buffer = buffer;
                
                const gain = audioContext.createGain();
                noise.connect(gain).connect(audioContext.destination);
                
                gain.gain.setValueAtTime(0.02, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
                
                noise.start(startTime);
                noise.stop(startTime + 0.4);
            }
        }
    }

    // Singer-songwriter style components
    createSingerSongwriterGuitar(audioContext, beatDuration, totalDuration) {
        const fingerpickingPattern = [
            [196.00, 246.94, 293.66], // G chord fingerpicking
            [261.63, 329.63, 392.00], // C chord fingerpicking
            [220.00, 277.18, 329.63], // Am chord fingerpicking
            [174.61, 220.00, 261.63]  // F chord fingerpicking
        ];
        
        const patternDuration = beatDuration * 4;
        const totalPatterns = Math.floor(totalDuration / patternDuration);
        
        for (let p = 0; p < totalPatterns; p++) {
            const pattern = fingerpickingPattern[p % 4];
            const patternStart = audioContext.currentTime + p * patternDuration;
            
            pattern.forEach((freq, noteIndex) => {
                const noteTime = patternStart + noteIndex * beatDuration;
                
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, noteTime);
                osc.type = 'sawtooth';
                
                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, noteTime + beatDuration * 1.2);
                
                osc.start(noteTime);
                osc.stop(noteTime + beatDuration * 1.5);
            });
        }
    }

    createSingerSongwriterStrings(audioContext, beatDuration, totalDuration) {
        const subtleStrings = [392.00, 493.88, 587.33]; // G-B-D
        const startTime = audioContext.currentTime;
        
        subtleStrings.forEach((freq, noteIndex) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain).connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, startTime);
            osc.type = 'sawtooth';
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.025 - noteIndex * 0.003, startTime + 5);
            gain.gain.linearRampToValueAtTime(0.02 - noteIndex * 0.003, startTime + totalDuration - 5);
            gain.gain.linearRampToValueAtTime(0, startTime + totalDuration);
            
            osc.start(startTime);
            osc.stop(startTime + totalDuration);
        });
    }

    createSingerSongwriterPercussion(audioContext, beatDuration, totalDuration) {
        const beats = Math.floor(totalDuration / beatDuration);
        
        for (let beat = 0; beat < beats; beat++) {
            const startTime = audioContext.currentTime + beat * beatDuration;
            
            // Minimal finger taps every 16 beats
            if (beat % 16 === 0 && Math.random() > 0.6) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(800, startTime);
                osc.type = 'triangle';
                gain.gain.setValueAtTime(0.03, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
                
                osc.start(startTime);
                osc.stop(startTime + 0.05);
            }
        }
    }

    // Folk-pop style components
    createFolkPopGuitar(audioContext, beatDuration, totalDuration) {
        const folkChords = [
            [82.41, 110.00, 146.83, 196.00, 246.94], // Em full
            [110.00, 146.83, 196.00, 246.94, 293.66], // Am full
            [98.00, 130.81, 164.81, 196.00, 246.94], // G full
            [87.31, 116.54, 146.83, 174.61, 220.00]  // D full
        ];
        
        const strumDuration = beatDuration * 2;
        const totalStrums = Math.floor(totalDuration / strumDuration);
        
        for (let s = 0; s < totalStrums; s++) {
            const chord = folkChords[s % 4];
            const strumTime = audioContext.currentTime + s * strumDuration;
            
            chord.forEach((freq, stringIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, strumTime + stringIndex * 0.008);
                osc.type = 'sawtooth';
                
                gain.gain.setValueAtTime(0, strumTime);
                gain.gain.linearRampToValueAtTime(0.1 - stringIndex * 0.015, strumTime + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.01, strumTime + strumDuration * 0.9);
                
                osc.start(strumTime);
                osc.stop(strumTime + strumDuration);
            });
        }
    }

    createFolkPopStrings(audioContext, beatDuration, totalDuration) {
        const folkStrings = [293.66, 369.99, 440.00, 523.25]; // D-F#-A-C
        const phraseDuration = beatDuration * 12;
        const phrases = Math.floor(totalDuration / phraseDuration);
        
        for (let p = 0; p < phrases; p++) {
            const startTime = audioContext.currentTime + p * phraseDuration;
            
            folkStrings.forEach((freq, noteIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'sawtooth';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.05 - noteIndex * 0.008, startTime + 3);
                gain.gain.linearRampToValueAtTime(0.03 - noteIndex * 0.008, startTime + phraseDuration - 3);
                gain.gain.linearRampToValueAtTime(0, startTime + phraseDuration);
                
                osc.start(startTime);
                osc.stop(startTime + phraseDuration);
            });
        }
    }

    createFolkPopPercussion(audioContext, beatDuration, totalDuration) {
        const beats = Math.floor(totalDuration / beatDuration);
        
        for (let beat = 0; beat < beats; beat++) {
            const startTime = audioContext.currentTime + beat * beatDuration;
            
            // Light tambourine every 4 beats
            if (beat % 4 === 0 && Math.random() > 0.4) {
                const noise = audioContext.createBufferSource();
                const buffer = audioContext.createBuffer(1, 512, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < 512; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                noise.buffer = buffer;
                
                const gain = audioContext.createGain();
                noise.connect(gain).connect(audioContext.destination);
                
                gain.gain.setValueAtTime(0.06, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
                
                noise.start(startTime);
                noise.stop(startTime + 0.2);
            }
        }
    }

    // Neo-soul style components
    createNeoSoulPiano(audioContext, beatDuration, totalDuration) {
        const soulChords = [
            [174.61, 220.00, 277.18, 329.63], // Fm7
            [196.00, 246.94, 311.13, 369.99], // Gm7
            [220.00, 277.18, 349.23, 415.30], // Am7
            [146.83, 185.00, 233.08, 277.18]  // Dm7
        ];
        
        const chordDuration = beatDuration * 4;
        const totalChords = Math.floor(totalDuration / chordDuration);
        
        for (let c = 0; c < totalChords; c++) {
            const chord = soulChords[c % 4];
            const startTime = audioContext.currentTime + c * chordDuration;
            
            chord.forEach((freq, noteIndex) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, startTime);
                osc.type = 'sine';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.09 - noteIndex * 0.015, startTime + 0.4);
                gain.gain.linearRampToValueAtTime(0.06 - noteIndex * 0.015, startTime + chordDuration - 0.4);
                gain.gain.linearRampToValueAtTime(0, startTime + chordDuration);
                
                osc.start(startTime);
                osc.stop(startTime + chordDuration);
            });
        }
    }

    createNeoSoulBass(audioContext, beatDuration, totalDuration) {
        const bassLine = [87.31, 98.00, 110.00, 73.42]; // D-G-A-D
        const noteDuration = beatDuration * 2;
        const totalNotes = Math.floor(totalDuration / noteDuration);
        
        for (let n = 0; n < totalNotes; n++) {
            const freq = bassLine[n % 4];
            const startTime = audioContext.currentTime + n * noteDuration;
            
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain).connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(freq, startTime);
            osc.type = 'triangle';
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.16, startTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration * 0.9);
            
            osc.start(startTime);
            osc.stop(startTime + noteDuration);
        }
    }

    createNeoSoulPercussion(audioContext, beatDuration, totalDuration) {
        const beats = Math.floor(totalDuration / beatDuration);
        
        for (let beat = 0; beat < beats; beat++) {
            const startTime = audioContext.currentTime + beat * beatDuration;
            
            // Groove kick pattern
            if (beat % 8 === 0 || beat % 8 === 3 || beat % 8 === 6) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain).connect(audioContext.destination);
                
                osc.frequency.setValueAtTime(65, startTime);
                osc.type = 'triangle';
                gain.gain.setValueAtTime(0.25, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
                
                osc.start(startTime);
                osc.stop(startTime + 0.3);
            }
            
            // Hi-hat pattern
            if (beat % 2 === 1 && Math.random() > 0.3) {
                const noise = audioContext.createBufferSource();
                const buffer = audioContext.createBuffer(1, 256, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < 256; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                noise.buffer = buffer;
                
                const gain = audioContext.createGain();
                noise.connect(gain).connect(audioContext.destination);
                
                gain.gain.setValueAtTime(0.08, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
                
                noise.start(startTime);
                noise.stop(startTime + 0.08);
            }
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.coverCraftApp = new CoverCraftApp();
});
