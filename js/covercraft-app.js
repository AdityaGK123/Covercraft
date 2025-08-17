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
        this.backingTrack = null;
        this.recordedAudio = null;
        this.recordedVideo = null;
        
        // Initialize audio engines
        this.voiceDetection = window.VoiceDetector;
        this.audioEngine = window.AudioEngine;
        this.backingTrackGenerator = window.BackingTrackGenerator;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoadingScreen();
        
        setTimeout(() => {
            this.showScreen('welcome-screen');
        }, 2000);
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
        const processYouTubeBtn = document.getElementById('process-youtube');
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
        document.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.selectedMood = e.currentTarget.getAttribute('data-mood');
                this.updateGenerateButton();
            });
        });

        document.querySelectorAll('.genre-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.genre-option').forEach(o => o.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.selectedGenre = e.currentTarget.getAttribute('data-genre');
                this.updateGenerateButton();
            });
        });

        const generateBtn = document.getElementById('generate-backing-track');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateBackingTrack());
        }
    }

    setupTrackCustomization() {
        document.querySelectorAll('.track-toggle').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const track = e.target.getAttribute('data-track');
                this.toggleTrack(track, e.target.checked);
            });
        });

        const tempoSlider = document.getElementById('tempo-slider');
        const tempoValue = document.getElementById('tempo-value');
        
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

        const createAnotherBtn = document.getElementById('create-another-cover');
        if (createAnotherBtn) createAnotherBtn.addEventListener('click', () => this.createAnotherCover());
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
            this.userProfile.voiceRange = { min: results.minNote, max: results.maxNote };
            this.userProfile.preferredKey = results.preferredKey;
        } else {
            // Fallback values for poor detection
            this.userProfile.voiceRange = { min: 'C3', max: 'G4' };
            this.userProfile.preferredKey = 'C Major';
        }
        
        // Translate to Indian scales
        const scaleTranslations = this.translateToIndianScales(this.userProfile.preferredKey);
        
        document.getElementById('user-key').textContent = this.userProfile.preferredKey;
        document.getElementById('user-range').textContent = `${this.userProfile.voiceRange.min} - ${this.userProfile.voiceRange.max}`;
        document.getElementById('hindustani-scale').textContent = scaleTranslations.hindustani;
        document.getElementById('carnatic-scale').textContent = scaleTranslations.carnatic;
        document.getElementById('calibration-result').style.display = 'block';
        
        // Auto-proceed after 3 seconds for simplified UX
        setTimeout(() => {
            this.showScreen('song-upload-screen');
        }, 3000);
    }

    switchUploadMethod(method) {
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(method + '-form');
        if (targetSection) targetSection.classList.add('active');
    }

    processYouTubeUrl(url) {
        this.showMessage('Processing YouTube video...', 'info');
        
        setTimeout(() => {
            this.currentSong = {
                title: 'Sample Song',
                artist: 'Sample Artist',
                duration: '3:45',
                audioUrl: '#'
            };
            this.showSongPreview();
        }, 2000);
    }

    processAudioFile(file) {
        this.showMessage('Processing audio file...', 'info');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentSong = {
                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: 'Unknown Artist',
                duration: '0:00',
                audioUrl: e.target.result
            };
            this.showSongPreview();
        };
        reader.readAsDataURL(file);
    }

    showSongPreview() {
        const preview = document.getElementById('song-preview');
        if (preview && this.currentSong) {
            document.getElementById('song-title').textContent = this.currentSong.title;
            document.getElementById('song-artist').textContent = this.currentSong.artist;
            document.getElementById('song-duration').textContent = `Duration: ${this.currentSong.duration}`;
            document.getElementById('song-audio').src = this.currentSong.audioUrl;
            preview.style.display = 'block';
        }
    }

    updateGenerateButton() {
        const generateBtn = document.getElementById('generate-backing-track');
        if (generateBtn && this.selectedMood && this.selectedGenre) {
            generateBtn.disabled = false;
        }
    }

    async generateBackingTrack() {
        this.showScreen('track-generation-screen');
        
        try {
            // Use real backing track generator
            const backingTrack = await this.backingTrackGenerator.generateBackingTrack(
                this.currentSong,
                this.selectedMood,
                this.selectedGenre,
                this.userProfile.preferredKey
            );
            
            this.backingTrack = backingTrack;
            this.completeTrackGeneration();
        } catch (error) {
            console.error('Backing track generation failed:', error);
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
        this.backingTrack = {
            drums: true,
            melody: true,
            strings: true,
            bass: true,
            tempo: 100
        };
        this.showScreen('track-customization-screen');
    }

    toggleTrack(track, enabled) {
        if (this.backingTrack) this.backingTrack[track] = enabled;
    }

    updateTempo(value) {
        if (this.backingTrack) this.backingTrack.tempo = parseInt(value);
    }

    previewBackingTrack() {
        this.showMessage('Playing preview...', 'success');
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
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.coverCraftApp = new CoverCraftApp();
});
