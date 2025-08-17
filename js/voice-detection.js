// Voice Detection Engine - Web Audio API (No AI costs)
class VoiceDetector {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.canvas = null;
        this.canvasContext = null;
        this.isRecording = false;
        this.frequencies = [];
        this.detectedNotes = [];
        
        // Note frequency mapping (simplified)
        this.noteFrequencies = {
            'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81,
            'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00,
            'A#3': 233.08, 'B3': 246.94, 'C4': 261.63, 'C#4': 277.18, 'D4': 293.66,
            'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
            'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88, 'C5': 523.25
        };
    }

    async start() {
        try {
            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            
            // Configure analyser
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Connect audio nodes
            this.microphone.connect(this.analyser);
            
            // Initialize data array
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            // Setup canvas for visualization
            this.setupCanvas();
            
            this.isRecording = true;
            this.frequencies = [];
            this.detectedNotes = [];
            
            // Start analysis loop
            this.analyzeAudio();
            
            return true;
        } catch (error) {
            console.error('Voice detection failed:', error);
            return false;
        }
    }

    stop() {
        this.isRecording = false;
        
        if (this.microphone) {
            this.microphone.disconnect();
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // Analyze collected data
        return this.calculateVoiceRange();
    }

    setupCanvas() {
        this.canvas = document.getElementById('voice-canvas');
        this.canvasCtx = this.canvas.getContext('2d');
        this.canvas.width = 300;
        this.canvas.height = 150;
        
        // Initialize music bubbles
        this.musicBubbles = [];
        this.noteSymbols = ['♪', '♫', '♬', '♩', '♭', '♯', '𝄞'];
        this.colors = ['#3b82f6', '#8b5cf6', '#06d6a0', '#f59e0b', '#ef4444', '#ec4899'];
    }

    analyzeAudio() {
        if (!this.isRecording) return;
        
        // Get frequency data
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // Find dominant frequency
        const dominantFreq = this.findDominantFrequency();
        
        if (dominantFreq > 80 && dominantFreq < 1000) { // Human voice range
            this.frequencies.push(dominantFreq);
            
            // Convert to note
            const note = this.frequencyToNote(dominantFreq);
            if (note) {
                this.detectedNotes.push(note);
                this.updateUI(note, dominantFreq);
            }
        }
        
        // Draw visualization
        if (this.canvas && this.canvasCtx) {
            this.drawVisualization();
        }
        
        // Continue analysis
        requestAnimationFrame(() => this.analyzeAudio());
    }

    findDominantFrequency() {
        let maxIndex = 0;
        let maxValue = 0;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            if (this.dataArray[i] > maxValue) {
                maxValue = this.dataArray[i];
                maxIndex = i;
            }
        }
        
        // Convert bin index to frequency
        const nyquist = this.audioContext.sampleRate / 2;
        const frequency = (maxIndex * nyquist) / this.dataArray.length;
        
        return frequency;
    }

    frequencyToNote(frequency) {
        let closestNote = null;
        let minDifference = Infinity;
        
        for (const [note, noteFreq] of Object.entries(this.noteFrequencies)) {
            const difference = Math.abs(frequency - noteFreq);
            if (difference < minDifference) {
                minDifference = difference;
                closestNote = note;
            }
        }
        
        // Only return if reasonably close (within 10 Hz)
        return minDifference < 10 ? closestNote : null;
    }

    updateUI(note, frequency) {
        const noteElement = document.getElementById('detected-note');
        const freqElement = document.getElementById('detected-frequency');
        
        if (noteElement) noteElement.textContent = note;
        if (freqElement) freqElement.textContent = Math.round(frequency) + ' Hz';
    }

    drawVisualization() {
        if (!this.isRecording || !this.analyser || !this.canvas || !this.canvasCtx) return;

        this.analyser.getByteFrequencyData(this.dataArray);

        // Clear canvas with gradient background
        const gradient = this.canvasCtx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        this.canvasCtx.fillStyle = gradient;
        this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate average volume for bubble generation
        const average = this.dataArray.reduce((sum, value) => sum + value, 0) / this.dataArray.length;
        
        // Generate new bubbles based on audio intensity
        if (average > 30) {
            this.generateMusicBubbles(average);
        }

        // Draw and update existing bubbles
        this.updateMusicBubbles();

        // Draw frequency blocks (tetris-style)
        this.drawFrequencyBlocks();
    }

    generateMusicBubbles(intensity) {
        if (Math.random() < 0.3) { // 30% chance to generate bubble
            const bubble = {
                x: Math.random() * this.canvas.width,
                y: this.canvas.height,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 2 + 1,
                symbol: this.noteSymbols[Math.floor(Math.random() * this.noteSymbols.length)],
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: 1,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            };
            this.musicBubbles.push(bubble);
        }

        // Limit number of bubbles
        if (this.musicBubbles.length > 15) {
            this.musicBubbles.shift();
        }
    }

    updateMusicBubbles() {
        this.musicBubbles = this.musicBubbles.filter(bubble => {
            // Update position
            bubble.y -= bubble.speed;
            bubble.rotation += bubble.rotationSpeed;
            bubble.opacity -= 0.008;

            // Draw bubble
            this.canvasCtx.save();
            this.canvasCtx.globalAlpha = bubble.opacity;
            this.canvasCtx.translate(bubble.x, bubble.y);
            this.canvasCtx.rotate(bubble.rotation);
            
            // Draw bubble background
            this.canvasCtx.fillStyle = bubble.color;
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(0, 0, bubble.size, 0, Math.PI * 2);
            this.canvasCtx.fill();
            
            // Draw music symbol
            this.canvasCtx.fillStyle = 'white';
            this.canvasCtx.font = `${bubble.size}px Arial`;
            this.canvasCtx.textAlign = 'center';
            this.canvasCtx.textBaseline = 'middle';
            this.canvasCtx.fillText(bubble.symbol, 0, 0);
            
            this.canvasCtx.restore();

            return bubble.opacity > 0 && bubble.y > -bubble.size;
        });
    }

    drawFrequencyBlocks() {
        const blockWidth = 8;
        const blockHeight = 6;
        const gap = 2;
        const cols = Math.floor(this.canvas.width / (blockWidth + gap));
        const rows = Math.floor(this.canvas.height / (blockHeight + gap));

        for (let i = 0; i < Math.min(cols, this.dataArray.length); i++) {
            const value = this.dataArray[i];
            const blockCount = Math.floor((value / 255) * rows);
            
            for (let j = 0; j < blockCount; j++) {
                const x = i * (blockWidth + gap);
                const y = this.canvas.height - (j + 1) * (blockHeight + gap);
                
                // Color based on frequency and intensity
                const hue = (i / cols) * 360;
                const saturation = 70;
                const lightness = 50 + (j / rows) * 30;
                
                this.canvasCtx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
                this.canvasCtx.fillRect(x, y, blockWidth, blockHeight);
                
                // Add glow effect
                this.canvasCtx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                this.canvasCtx.shadowBlur = 3;
                this.canvasCtx.fillRect(x, y, blockWidth, blockHeight);
                this.canvasCtx.shadowBlur = 0;
            }
        }
    }

    calculateVoiceRange() {
        if (this.frequencies.length === 0) {
            return {
                minFreq: 0,
                maxFreq: 0,
                minNote: 'Unknown',
                maxNote: 'Unknown',
                preferredKey: 'C Major',
                confidence: 0
            };
        }
        
        // Filter out outliers
        const sortedFreqs = this.frequencies.sort((a, b) => a - b);
        const q1Index = Math.floor(sortedFreqs.length * 0.25);
        const q3Index = Math.floor(sortedFreqs.length * 0.75);
        
        const minFreq = sortedFreqs[q1Index];
        const maxFreq = sortedFreqs[q3Index];
        
        // Convert to notes
        const minNote = this.frequencyToNote(minFreq) || 'C3';
        const maxNote = this.frequencyToNote(maxFreq) || 'G4';
        
        // Determine preferred key based on most common notes
        const preferredKey = this.calculatePreferredKey();
        
        return {
            minFreq: Math.round(minFreq),
            maxFreq: Math.round(maxFreq),
            minNote,
            maxNote,
            preferredKey,
            confidence: Math.min(this.frequencies.length / 50, 1) // 0-1 based on sample count
        };
    }

    calculatePreferredKey() {
        // Count note occurrences
        const noteCounts = {};
        this.detectedNotes.forEach(note => {
            const baseNote = note.replace(/\d+/, ''); // Remove octave
            noteCounts[baseNote] = (noteCounts[baseNote] || 0) + 1;
        });
        
        // Find most common note
        let mostCommonNote = 'C';
        let maxCount = 0;
        
        for (const [note, count] of Object.entries(noteCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommonNote = note;
            }
        }
        
        // Map to major key
        const keyMapping = {
            'C': 'C Major', 'C#': 'C# Major', 'D': 'D Major', 'D#': 'D# Major',
            'E': 'E Major', 'F': 'F Major', 'F#': 'F# Major', 'G': 'G Major',
            'G#': 'G# Major', 'A': 'A Major', 'A#': 'A# Major', 'B': 'B Major'
        };
        
        return keyMapping[mostCommonNote] || 'C Major';
    }
}

// Global instance
window.VoiceDetector = new VoiceDetector();
