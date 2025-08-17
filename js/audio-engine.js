// Audio Recording & Mixing Engine - Client-side processing (no server costs)
class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.backingTrackAudio = null;
        this.mixedAudio = null;
        this.isRecording = false;
        
        // Audio processing nodes
        this.microphoneSource = null;
        this.backingTrackSource = null;
        this.gainNode = null;
        this.compressorNode = null;
        this.filterNode = null;
        this.reverbNode = null;
        
        // Recording settings
        this.recordingSettings = {
            sampleRate: 44100,
            channelCount: 2,
            bitDepth: 16
        };
    }

    async initialize() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: this.recordingSettings.sampleRate
            });
            
            // Create audio processing nodes
            this.setupAudioNodes();
            
            return true;
        } catch (error) {
            console.error('Audio engine initialization failed:', error);
            return false;
        }
    }

    setupAudioNodes() {
        // Gain control
        this.gainNode = this.audioContext.createGain();
        
        // Dynamic range compressor
        this.compressorNode = this.audioContext.createDynamicsCompressor();
        this.compressorNode.threshold.value = -24;
        this.compressorNode.knee.value = 30;
        this.compressorNode.ratio.value = 12;
        this.compressorNode.attack.value = 0.003;
        this.compressorNode.release.value = 0.25;
        
        // EQ Filter
        this.filterNode = this.audioContext.createBiquadFilter();
        this.filterNode.type = 'highpass';
        this.filterNode.frequency.value = 80; // Remove low-end rumble
        
        // Simple reverb using convolver
        this.reverbNode = this.audioContext.createConvolver();
        this.createReverbImpulse();
    }

    createReverbImpulse() {
        // Create a simple reverb impulse response
        const length = this.audioContext.sampleRate * 2; // 2 seconds
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const decay = Math.pow(1 - i / length, 2);
                channelData[i] = (Math.random() * 2 - 1) * decay * 0.1;
            }
        }
        
        this.reverbNode.buffer = impulse;
    }

    async startRecording(backingTrackUrl = null, recordVideo = true) {
        try {
            // Get user media
            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false,
                    sampleRate: this.recordingSettings.sampleRate
                },
                video: recordVideo ? {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                } : false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Setup microphone source
            this.microphoneSource = this.audioContext.createMediaStreamSource(stream);
            
            // Connect audio processing chain
            this.microphoneSource
                .connect(this.filterNode)
                .connect(this.compressorNode)
                .connect(this.gainNode);

            // Setup backing track if provided
            if (backingTrackUrl) {
                await this.loadBackingTrack(backingTrackUrl);
            }

            // Create destination for recording
            const destination = this.audioContext.createMediaStreamDestination();
            this.gainNode.connect(destination);
            
            // If backing track exists, mix it in
            if (this.backingTrackSource) {
                this.backingTrackSource.connect(destination);
            }

            // Setup MediaRecorder
            const recordingStream = recordVideo ? 
                new MediaStream([...destination.stream.getAudioTracks(), ...stream.getVideoTracks()]) :
                destination.stream;

            this.mediaRecorder = new MediaRecorder(recordingStream, {
                mimeType: this.getSupportedMimeType()
            });

            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.finalizeRecording();
            };

            // Start recording
            this.mediaRecorder.start(100); // Collect data every 100ms
            this.isRecording = true;
            
            // Start backing track playback if available
            if (this.backingTrackAudio) {
                this.backingTrackAudio.currentTime = 0;
                this.backingTrackAudio.play();
            }

            return true;
        } catch (error) {
            console.error('Recording start failed:', error);
            return false;
        }
    }

    async loadBackingTrack(url) {
        try {
            this.backingTrackAudio = new Audio(url);
            this.backingTrackAudio.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
                this.backingTrackAudio.oncanplaythrough = resolve;
                this.backingTrackAudio.onerror = reject;
                this.backingTrackAudio.load();
            });

            // Create audio source from backing track
            this.backingTrackSource = this.audioContext.createMediaElementSource(this.backingTrackAudio);
            
            return true;
        } catch (error) {
            console.error('Backing track load failed:', error);
            return false;
        }
    }

    stopRecording() {
        if (!this.isRecording) return;

        this.isRecording = false;
        
        // Stop MediaRecorder
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        // Stop backing track
        if (this.backingTrackAudio) {
            this.backingTrackAudio.pause();
        }

        // Disconnect audio nodes
        if (this.microphoneSource) {
            this.microphoneSource.disconnect();
        }
        
        if (this.backingTrackSource) {
            this.backingTrackSource.disconnect();
        }
    }

    finalizeRecording() {
        const blob = new Blob(this.recordedChunks, {
            type: this.getSupportedMimeType()
        });

        // Create object URL for playback
        const recordingUrl = URL.createObjectURL(blob);
        
        // Store the recording
        this.mixedAudio = {
            blob: blob,
            url: recordingUrl,
            duration: this.calculateDuration(),
            size: blob.size
        };

        // Trigger callback if set
        if (this.onRecordingComplete) {
            this.onRecordingComplete(this.mixedAudio);
        }
    }

    getSupportedMimeType() {
        const types = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm',
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/wav'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        
        return 'audio/webm'; // Fallback
    }

    calculateDuration() {
        // Estimate duration based on chunks (simplified)
        return this.recordedChunks.length * 0.1; // Assuming 100ms chunks
    }

    // Audio Enhancement Methods
    async enhanceAudio(audioBlob, enhancements = {}) {
        try {
            const audioBuffer = await this.blobToAudioBuffer(audioBlob);
            let processedBuffer = audioBuffer;

            // Apply enhancements
            if (enhancements.noiseReduction) {
                processedBuffer = this.applyNoiseReduction(processedBuffer);
            }

            if (enhancements.eqEnhancement) {
                processedBuffer = this.applyEQEnhancement(processedBuffer);
            }

            if (enhancements.compression) {
                processedBuffer = this.applyCompression(processedBuffer);
            }

            if (enhancements.autotune) {
                processedBuffer = this.applyAutotune(processedBuffer);
            }

            if (enhancements.reverb) {
                processedBuffer = this.applyReverb(processedBuffer);
            }

            if (enhancements.echo) {
                processedBuffer = this.applyEcho(processedBuffer);
            }

            // Convert back to blob
            const enhancedBlob = await this.audioBufferToBlob(processedBuffer);
            return enhancedBlob;
        } catch (error) {
            console.error('Audio enhancement failed:', error);
            return audioBlob; // Return original on failure
        }
    }

    async blobToAudioBuffer(blob) {
        const arrayBuffer = await blob.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    async audioBufferToBlob(audioBuffer) {
        // Create offline context for rendering
        const offlineContext = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
        );

        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        source.start();

        const renderedBuffer = await offlineContext.startRendering();
        
        // Convert to WAV blob (simplified)
        return this.audioBufferToWav(renderedBuffer);
    }

    audioBufferToWav(buffer) {
        const length = buffer.length;
        const numberOfChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
        const view = new DataView(arrayBuffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * numberOfChannels * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numberOfChannels * 2, true);
        view.setUint16(32, numberOfChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * numberOfChannels * 2, true);

        // Convert float samples to 16-bit PCM
        let offset = 44;
        for (let i = 0; i < length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
                view.setInt16(offset, sample * 0x7FFF, true);
                offset += 2;
            }
        }

        return new Blob([arrayBuffer], { type: 'audio/wav' });
    }

    // Audio Processing Methods (Simplified implementations)
    applyNoiseReduction(audioBuffer) {
        // Simple noise gate implementation
        const threshold = 0.01;
        
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            for (let i = 0; i < channelData.length; i++) {
                if (Math.abs(channelData[i]) < threshold) {
                    channelData[i] *= 0.1; // Reduce noise floor
                }
            }
        }
        
        return audioBuffer;
    }

    applyEQEnhancement(audioBuffer) {
        // Simple high-pass filter to remove low-end rumble
        const cutoffFreq = 80;
        const sampleRate = audioBuffer.sampleRate;
        const rc = 1.0 / (cutoffFreq * 2 * Math.PI);
        const dt = 1.0 / sampleRate;
        const alpha = dt / (rc + dt);

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            let prevOutput = 0;
            let prevInput = 0;

            for (let i = 0; i < channelData.length; i++) {
                const output = alpha * (prevOutput + channelData[i] - prevInput);
                prevOutput = output;
                prevInput = channelData[i];
                channelData[i] = output;
            }
        }

        return audioBuffer;
    }

    applyCompression(audioBuffer) {
        // Simple dynamic range compression
        const threshold = 0.7;
        const ratio = 4;

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            for (let i = 0; i < channelData.length; i++) {
                const sample = channelData[i];
                const magnitude = Math.abs(sample);
                
                if (magnitude > threshold) {
                    const excess = magnitude - threshold;
                    const compressedExcess = excess / ratio;
                    const newMagnitude = threshold + compressedExcess;
                    channelData[i] = (sample / magnitude) * newMagnitude;
                }
            }
        }

        return audioBuffer;
    }

    applyAutotune(audioBuffer) {
        // Simplified pitch correction (basic implementation)
        // In a real app, you'd use more sophisticated algorithms
        const windowSize = 1024;
        
        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            
            // Apply subtle pitch smoothing
            for (let i = windowSize; i < channelData.length - windowSize; i++) {
                let sum = 0;
                for (let j = -windowSize/2; j < windowSize/2; j++) {
                    sum += channelData[i + j];
                }
                channelData[i] = channelData[i] * 0.9 + (sum / windowSize) * 0.1;
            }
        }

        return audioBuffer;
    }

    applyReverb(audioBuffer) {
        // Simple reverb using delay and feedback
        const delayTime = 0.1; // 100ms delay
        const feedback = 0.3;
        const wetLevel = 0.2;
        
        const delaySamples = Math.floor(delayTime * audioBuffer.sampleRate);

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            const delayBuffer = new Float32Array(channelData.length);
            
            for (let i = delaySamples; i < channelData.length; i++) {
                delayBuffer[i] = channelData[i - delaySamples] * feedback + delayBuffer[i - delaySamples] * feedback;
                channelData[i] = channelData[i] * (1 - wetLevel) + delayBuffer[i] * wetLevel;
            }
        }

        return audioBuffer;
    }

    applyEcho(audioBuffer) {
        // Simple echo effect
        const delayTime = 0.25; // 250ms delay
        const feedback = 0.4;
        const wetLevel = 0.3;
        
        const delaySamples = Math.floor(delayTime * audioBuffer.sampleRate);

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
            const channelData = audioBuffer.getChannelData(channel);
            
            for (let i = delaySamples; i < channelData.length; i++) {
                const delayed = channelData[i - delaySamples] * feedback;
                channelData[i] = channelData[i] * (1 - wetLevel) + delayed * wetLevel;
            }
        }

        return audioBuffer;
    }

    // Utility methods
    downloadAudio(blob, filename = 'cover.wav') {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    cleanup() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        if (this.mixedAudio && this.mixedAudio.url) {
            URL.revokeObjectURL(this.mixedAudio.url);
        }
    }
}

// Global instance
window.AudioEngine = new AudioEngine();
