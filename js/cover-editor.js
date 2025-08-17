/**
 * CoverCraft Post-Recording Editor
 * Professional editing suite for user covers
 */

class CoverEditor {
    constructor() {
        this.isOpen = false;
        this.currentVideo = null;
        this.currentAudio = null;
        this.editHistory = [];
        this.currentEditIndex = -1;
        this.canvas = null;
        this.ctx = null;
        this.videoElement = null;
        this.audioContext = null;
        this.onComplete = null;
        
        this.effects = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0,
            blur: 0,
            vignette: 0
        };
        
        this.audioEffects = {
            volume: 100,
            reverb: 0,
            autotune: 0,
            eq: {
                bass: 0,
                mid: 0,
                treble: 0
            }
        };
        
        this.textOverlays = [];
        this.stickers = [];
        this.specialEffects = [];
        
        this.createModal();
    }

    open(videoBlob, audioBlob, onComplete) {
        this.currentVideo = videoBlob;
        this.currentAudio = audioBlob;
        this.onComplete = onComplete;
        this.showModal();
        this.loadVideo();
    }

    showModal() {
        if (!this.modal) this.createModal();
        this.modal.style.display = 'flex';
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            this.isOpen = false;
            document.body.style.overflow = 'auto';
        }
    }

    loadVideo() {
        if (this.currentVideo) {
            const videoUrl = URL.createObjectURL(this.currentVideo);
            this.videoElement.src = videoUrl;
        }
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'editor-modal';
        this.modal.innerHTML = `
            <div class="editor-modal-content">
                <div class="editor-header">
                    <h2>🎬 Edit Your Cover</h2>
                    <div class="editor-controls">
                        <button class="editor-btn undo-btn">↶ Undo</button>
                        <button class="editor-btn redo-btn">↷ Redo</button>
                        <button class="editor-btn reset-btn">🔄 Reset</button>
                        <button class="close-editor">×</button>
                    </div>
                </div>
                
                <div class="editor-workspace">
                    <div class="video-preview-section">
                        <div class="video-container">
                            <canvas class="editor-canvas"></canvas>
                            <video class="editor-video" style="display: none;"></video>
                            <div class="playback-overlay">
                                <button class="play-pause-btn">▶️</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="editing-panels">
                        <div class="panel-tabs">
                            <button class="panel-tab active" data-panel="video">🎨 Video</button>
                            <button class="panel-tab" data-panel="audio">🔊 Audio</button>
                            <button class="panel-tab" data-panel="text">📝 Text</button>
                            <button class="panel-tab" data-panel="stickers">😀 Stickers</button>
                        </div>
                        
                        <div class="panel-content">
                            <div class="panel video-panel active">
                                <h4>Video Effects</h4>
                                <div class="effect-controls">
                                    <label>Brightness: <input type="range" class="brightness-slider" min="0" max="200" value="100"></label>
                                    <label>Contrast: <input type="range" class="contrast-slider" min="0" max="200" value="100"></label>
                                    <label>Saturation: <input type="range" class="saturation-slider" min="0" max="200" value="100"></label>
                                </div>
                            </div>
                            
                            <div class="panel audio-panel">
                                <h4>Audio Effects</h4>
                                <div class="effect-controls">
                                    <label>Volume: <input type="range" class="volume-slider" min="0" max="200" value="100"></label>
                                    <label>Reverb: <input type="range" class="reverb-slider" min="0" max="100" value="0"></label>
                                </div>
                            </div>
                            
                            <div class="panel text-panel">
                                <h4>Add Text</h4>
                                <input type="text" class="text-input" placeholder="Enter your text...">
                                <button class="add-text-btn">Add Text</button>
                            </div>
                            
                            <div class="panel stickers-panel">
                                <h4>Stickers</h4>
                                <div class="sticker-grid">
                                    <button class="sticker-btn" data-sticker="🎵">🎵</button>
                                    <button class="sticker-btn" data-sticker="⭐">⭐</button>
                                    <button class="sticker-btn" data-sticker="❤️">❤️</button>
                                    <button class="sticker-btn" data-sticker="🔥">🔥</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="editor-footer">
                    <button class="save-draft-btn">💾 Save Draft</button>
                    <button class="export-btn">🚀 Export & Share</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.canvas = this.modal.querySelector('.editor-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.videoElement = this.modal.querySelector('.editor-video');
    }

    setupEventListeners() {
        // Close button
        this.modal.querySelector('.close-editor').addEventListener('click', () => {
            this.hideModal();
        });

        // Panel tabs
        this.modal.querySelectorAll('.panel-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const panel = e.target.dataset.panel;
                this.switchPanel(panel);
            });
        });

        // Effect sliders
        this.modal.querySelector('.brightness-slider')?.addEventListener('input', (e) => {
            this.effects.brightness = e.target.value;
            this.applyEffects();
        });

        this.modal.querySelector('.contrast-slider')?.addEventListener('input', (e) => {
            this.effects.contrast = e.target.value;
            this.applyEffects();
        });

        // Export button
        this.modal.querySelector('.export-btn').addEventListener('click', () => {
            this.exportVideo();
        });

        // Play/pause
        this.modal.querySelector('.play-pause-btn')?.addEventListener('click', () => {
            this.togglePlayback();
        });
    }

    switchPanel(panelName) {
        this.modal.querySelectorAll('.panel-tab').forEach(tab => tab.classList.remove('active'));
        this.modal.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
        
        this.modal.querySelector(`[data-panel="${panelName}"]`).classList.add('active');
        this.modal.querySelector(`.${panelName}-panel`).classList.add('active');
    }

    applyEffects() {
        if (!this.canvas || !this.videoElement) return;
        
        this.ctx.filter = `brightness(${this.effects.brightness}%) contrast(${this.effects.contrast}%) saturate(${this.effects.saturation}%)`;
        this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);
    }

    togglePlayback() {
        if (this.videoElement.paused) {
            this.videoElement.play();
            this.modal.querySelector('.play-pause-btn').textContent = '⏸️';
        } else {
            this.videoElement.pause();
            this.modal.querySelector('.play-pause-btn').textContent = '▶️';
        }
    }

    exportVideo() {
        if (this.onComplete) {
            // Create a simple blob for demo purposes
            const blob = new Blob(['edited video data'], { type: 'video/mp4' });
            this.onComplete(blob);
        }
        this.hideModal();
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('close-editor')?.addEventListener('click', () => this.closeEditor());
        document.getElementById('play-pause-btn')?.addEventListener('click', () => this.togglePlayback());
        document.getElementById('timeline-slider')?.addEventListener('input', (e) => this.seekTo(parseFloat(e.target.value)));

        // Panel tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchPanel(e.target.dataset.panel));
        });

        // Video controls
        ['brightness', 'contrast', 'saturation'].forEach(control => {
            document.getElementById(`${control}-slider`)?.addEventListener('input', (e) => {
                this.updateVideoFilter(control, parseFloat(e.target.value));
            });
        });

        // Audio controls
        ['volume', 'reverb', 'autotune'].forEach(control => {
            document.getElementById(`${control}-slider`)?.addEventListener('input', (e) => {
                this.updateAudioEffect(control, parseFloat(e.target.value));
            });
        });

        // Text controls
        document.getElementById('add-text-btn')?.addEventListener('click', () => this.addText());

        // Sticker controls
        document.querySelectorAll('.sticker-item').forEach(item => {
            item.addEventListener('click', (e) => this.addSticker(e.target.dataset.sticker));
        });

        // Effect buttons
        document.querySelectorAll('.effect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyEffect(e.target.dataset.effect));
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.preset));
        });

        // History controls
        document.getElementById('undo-edit')?.addEventListener('click', () => this.undo());
        document.getElementById('redo-edit')?.addEventListener('click', () => this.redo());
        document.getElementById('reset-edits')?.addEventListener('click', () => this.resetAllEdits());

        // Export controls
        document.getElementById('preview-changes')?.addEventListener('click', () => this.previewChanges());
        document.getElementById('save-draft')?.addEventListener('click', () => this.saveDraft());
        document.getElementById('export-cover')?.addEventListener('click', () => this.exportAndShare());
    }

    initializeAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    openEditor(coverData) {
        this.currentCover = coverData;
        this.resetEditor();
        
        const modal = document.getElementById('cover-editor-modal');
        modal.style.display = 'flex';
        
        this.loadCoverIntoEditor();
    }

    closeEditor() {
        const modal = document.getElementById('cover-editor-modal');
        modal.style.display = 'none';
        
        if (this.videoElement) {
            this.videoElement.pause();
        }
    }

    loadCoverIntoEditor() {
        const video = document.getElementById('editor-video');
        const canvas = document.getElementById('editor-canvas');
        
        this.videoElement = video;
        this.canvasElement = canvas;
        this.ctx = canvas.getContext('2d');
        
        video.src = this.currentCover.videoURL;
        video.onloadedmetadata = () => {
            this.duration = video.duration;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            this.updateTimeDisplay();
            this.startRenderLoop();
        };
    }

    startRenderLoop() {
        const render = () => {
            if (this.videoElement && this.canvasElement) {
                this.renderFrame();
                requestAnimationFrame(render);
            }
        };
        render();
    }

    renderFrame() {
        if (!this.videoElement || !this.ctx) return;
        
        const { width, height } = this.canvasElement;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw video frame
        this.ctx.drawImage(this.videoElement, 0, 0, width, height);
        
        // Apply filters
        this.applyCanvasFilters();
        
        // Render text and stickers
        this.renderTextElements();
        this.renderStickers();
        
        // Update timeline
        if (this.isPlaying) {
            this.currentTime = this.videoElement.currentTime;
            this.updateTimelinePosition();
        }
    }

    applyCanvasFilters() {
        const { brightness, contrast, saturation, hue, blur } = this.filters;
        
        let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg)`;
        
        if (blur > 0) {
            filterString += ` blur(${blur}px)`;
        }
        
        this.ctx.filter = filterString;
    }

    renderTextElements() {
        if (!this.currentCover.textElements) return;
        
        this.currentCover.textElements.forEach(textEl => {
            this.ctx.font = `${textEl.fontSize}px ${textEl.fontFamily}`;
            this.ctx.fillStyle = textEl.color;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(textEl.text, textEl.x, textEl.y);
        });
    }

    renderStickers() {
        if (!this.currentCover.stickers) return;
        
        this.currentCover.stickers.forEach(sticker => {
            this.ctx.font = `${sticker.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(sticker.sticker, sticker.x, sticker.y);
        });
    }

    updateVideoFilter(filterName, value) {
        this.filters[filterName] = value;
        this.updateValueDisplay(`${filterName}-slider`, value, '%');
        this.saveToHistory(`Update ${filterName}`, { filters: { ...this.filters } });
    }

    updateAudioEffect(effectName, value) {
        this.audioEffects[effectName] = value;
        this.updateValueDisplay(`${effectName}-slider`, value, '%');
        this.saveToHistory(`Update ${effectName}`, { audioEffects: { ...this.audioEffects } });
    }

    addText() {
        const textInput = document.getElementById('text-input');
        const text = textInput.value.trim();
        
        if (!text) return;
        
        const textElement = {
            id: Date.now(),
            text: text,
            x: this.canvasElement.width / 2,
            y: this.canvasElement.height / 2,
            fontSize: 24,
            fontFamily: 'Arial',
            color: '#ffffff'
        };
        
        this.currentCover.textElements = this.currentCover.textElements || [];
        this.currentCover.textElements.push(textElement);
        
        textInput.value = '';
        this.saveToHistory('Add text', { textElements: [...this.currentCover.textElements] });
    }

    addSticker(sticker) {
        const stickerElement = {
            id: Date.now(),
            sticker: sticker,
            x: this.canvasElement.width / 2,
            y: this.canvasElement.height / 2,
            size: 48
        };
        
        this.currentCover.stickers = this.currentCover.stickers || [];
        this.currentCover.stickers.push(stickerElement);
        
        this.saveToHistory('Add sticker', { stickers: [...this.currentCover.stickers] });
    }

    applyEffect(effectName) {
        // Apply special effects like sparkles, hearts, etc.
        const effect = {
            id: Date.now(),
            type: effectName,
            duration: 2000, // 2 seconds
            startTime: this.currentTime
        };
        
        this.currentCover.effects = this.currentCover.effects || [];
        this.currentCover.effects.push(effect);
        
        this.saveToHistory(`Add ${effectName} effect`, { effects: [...this.currentCover.effects] });
    }

    applyPreset(presetName) {
        const presets = {
            vintage: { brightness: 90, contrast: 110, saturation: 80 },
            dramatic: { brightness: 85, contrast: 130, saturation: 120 },
            warm: { brightness: 105, contrast: 105, saturation: 110 },
            cool: { brightness: 95, contrast: 105, saturation: 90 },
            natural: { volume: 100, reverb: 10 },
            studio: { volume: 105, reverb: 25, autotune: 15 },
            concert: { volume: 110, reverb: 40 }
        };
        
        const preset = presets[presetName];
        if (preset) {
            Object.keys(preset).forEach(key => {
                if (this.filters.hasOwnProperty(key)) {
                    this.filters[key] = preset[key];
                    document.getElementById(`${key}-slider`).value = preset[key];
                    this.updateValueDisplay(`${key}-slider`, preset[key], '%');
                } else if (this.audioEffects.hasOwnProperty(key)) {
                    this.audioEffects[key] = preset[key];
                    document.getElementById(`${key}-slider`).value = preset[key];
                    this.updateValueDisplay(`${key}-slider`, preset[key], '%');
                }
            });
            
            this.saveToHistory(`Apply ${presetName} preset`, { 
                filters: { ...this.filters }, 
                audioEffects: { ...this.audioEffects } 
            });
        }
    }

    switchPanel(panelName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-panel="${panelName}"]`).classList.add('active');
        
        // Update panels
        document.querySelectorAll('.editing-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(`${panelName}-panel`).classList.add('active');
    }

    togglePlayback() {
        if (this.isPlaying) {
            this.videoElement.pause();
            this.isPlaying = false;
            document.getElementById('play-pause-btn').textContent = '▶️';
        } else {
            this.videoElement.play();
            this.isPlaying = true;
            document.getElementById('play-pause-btn').textContent = '⏸️';
        }
    }

    seekTo(percentage) {
        if (this.videoElement && this.duration) {
            this.currentTime = (percentage / 100) * this.duration;
            this.videoElement.currentTime = this.currentTime;
            this.updateTimeDisplay();
        }
    }

    updateTimelinePosition() {
        if (this.duration > 0) {
            const percentage = (this.currentTime / this.duration) * 100;
            document.getElementById('timeline-slider').value = percentage;
            this.updateTimeDisplay();
        }
    }

    updateTimeDisplay() {
        document.getElementById('current-time').textContent = this.formatTime(this.currentTime);
        document.getElementById('total-duration').textContent = this.formatTime(this.duration);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateValueDisplay(sliderId, value, unit) {
        const slider = document.getElementById(sliderId);
        const display = slider?.parentElement.querySelector('.value-display');
        if (display) {
            display.textContent = `${value}${unit}`;
        }
    }

    saveToHistory(action, state) {
        if (this.currentHistoryIndex < this.editHistory.length - 1) {
            this.editHistory = this.editHistory.slice(0, this.currentHistoryIndex + 1);
        }
        
        this.editHistory.push({
            action,
            state: JSON.parse(JSON.stringify(state)),
            timestamp: Date.now()
        });
        
        this.currentHistoryIndex = this.editHistory.length - 1;
        
        if (this.editHistory.length > 50) {
            this.editHistory.shift();
            this.currentHistoryIndex--;
        }
        
        this.updateHistoryButtons();
    }

    undo() {
        if (this.currentHistoryIndex > 0) {
            this.currentHistoryIndex--;
            this.applyHistoryState(this.editHistory[this.currentHistoryIndex]);
            this.updateHistoryButtons();
        }
    }

    redo() {
        if (this.currentHistoryIndex < this.editHistory.length - 1) {
            this.currentHistoryIndex++;
            this.applyHistoryState(this.editHistory[this.currentHistoryIndex]);
            this.updateHistoryButtons();
        }
    }

    updateHistoryButtons() {
        document.getElementById('undo-edit').disabled = this.currentHistoryIndex <= 0;
        document.getElementById('redo-edit').disabled = this.currentHistoryIndex >= this.editHistory.length - 1;
    }

    resetEditor() {
        this.filters = { brightness: 100, contrast: 100, saturation: 100, hue: 0, blur: 0, vignette: 0 };
        this.audioEffects = { volume: 100, reverb: 0, echo: 0, autotune: 0, equalizer: { bass: 0, mid: 0, treble: 0 } };
        this.editHistory = [];
        this.currentHistoryIndex = -1;
    }

    resetAllEdits() {
        this.resetEditor();
        this.updateAllSliders();
        this.currentCover.textElements = [];
        this.currentCover.stickers = [];
        this.currentCover.effects = [];
    }

    updateAllSliders() {
        Object.keys(this.filters).forEach(key => {
            const slider = document.getElementById(`${key}-slider`);
            if (slider) {
                slider.value = this.filters[key];
                this.updateValueDisplay(`${key}-slider`, this.filters[key], '%');
            }
        });
        
        Object.keys(this.audioEffects).forEach(key => {
            if (key !== 'equalizer') {
                const slider = document.getElementById(`${key}-slider`);
                if (slider) {
                    slider.value = this.audioEffects[key];
                    this.updateValueDisplay(`${key}-slider`, this.audioEffects[key], '%');
                }
            }
        });
    }

    previewChanges() {
        // Generate preview with all current edits applied
        this.showMessage('🎬 Generating preview...', 'info');
        // Implementation would render the edited video
    }

    saveDraft() {
        const draftData = {
            originalCover: this.currentCover,
            filters: this.filters,
            audioEffects: this.audioEffects,
            textElements: this.currentCover.textElements || [],
            stickers: this.currentCover.stickers || [],
            effects: this.currentCover.effects || [],
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`covercraft_draft_${Date.now()}`, JSON.stringify(draftData));
        this.showMessage('💾 Draft saved successfully!', 'success');
    }

    async exportAndShare() {
        this.showMessage('🚀 Exporting your edited cover...', 'info');
        
        try {
            // Generate final video with all edits applied
            const editedVideoBlob = await this.generateFinalVideo();
            
            // Update cover data with edited version
            const editedCover = {
                ...this.currentCover,
                videoBlob: editedVideoBlob,
                videoURL: URL.createObjectURL(editedVideoBlob),
                edited: true,
                editedAt: new Date().toISOString()
            };
            
            // Close editor and open social sharing
            this.closeEditor();
            
            // Open social integration with edited cover
            if (window.socialIntegration) {
                window.socialIntegration.showSocialModal(editedCover);
            }
            
            this.showMessage('✅ Cover exported successfully!', 'success');
            
        } catch (error) {
            console.error('Export failed:', error);
            this.showMessage('❌ Export failed. Please try again.', 'error');
        }
    }

    async generateFinalVideo() {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.canvasElement.width;
            canvas.height = this.canvasElement.height;
            
            const stream = canvas.captureStream(30);
            const recorder = new MediaRecorder(stream);
            
            const chunks = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };
            
            recorder.start();
            
            // Render video with all effects applied
            this.videoElement.currentTime = 0;
            this.videoElement.play();
            
            const renderWithEffects = () => {
                if (!this.videoElement.ended) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
                    
                    // Apply all filters and effects
                    this.applyCanvasFilters();
                    this.renderTextElements();
                    this.renderStickers();
                    
                    requestAnimationFrame(renderWithEffects);
                } else {
                    recorder.stop();
                }
            };
            
            renderWithEffects();
        });
    }

    showMessage(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, duration);
    }
}

// Initialize cover editor
window.coverEditor = new CoverEditor();
