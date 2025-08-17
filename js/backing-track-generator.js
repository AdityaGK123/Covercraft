// Backing Track Generator - Cost-optimized with cached samples
class BackingTrackGenerator {
    constructor() {
        this.audioContext = null;
        this.sampleLibrary = {};
        this.generatedTracks = new Map();
        this.isInitialized = false;
        
        // Pre-defined instrument samples (URLs would point to your sample library)
        this.instrumentSamples = {
            'indian-indie': {
                drums: '/samples/indian-indie/drums.wav',
                acoustic: '/samples/indian-indie/acoustic.wav',
                tabla: '/samples/indian-indie/tabla.wav',
                strings: '/samples/indian-indie/strings.wav'
            },
            'bollywood': {
                drums: '/samples/bollywood/drums.wav',
                piano: '/samples/bollywood/piano.wav',
                strings: '/samples/bollywood/strings.wav',
                harmonium: '/samples/bollywood/harmonium.wav'
            },
            'indian-classical': {
                tabla: '/samples/classical/tabla.wav',
                sitar: '/samples/classical/sitar.wav',
                tanpura: '/samples/classical/tanpura.wav',
                violin: '/samples/classical/violin.wav'
            },
            'western-pop': {
                drums: '/samples/western/drums.wav',
                piano: '/samples/western/piano.wav',
                guitar: '/samples/western/guitar.wav',
                bass: '/samples/western/bass.wav'
            }
        };

        // Mood-based mixing templates
        this.moodTemplates = {
            chill: {
                drums: 0.3,
                melody: 0.8,
                strings: 0.6,
                bass: 0.4
            },
            emotional: {
                drums: 0.2,
                melody: 0.5,
                strings: 0.9,
                bass: 0.3
            },
            energetic: {
                drums: 0.9,
                melody: 0.7,
                strings: 0.5,
                bass: 0.8
            },
            romantic: {
                drums: 0.2,
                melody: 0.7,
                strings: 0.8,
                bass: 0.3
            }
        };
    }

    async initialize() {
        if (this.isInitialized) return true;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Pre-load essential samples for demo
            await this.loadDemoSamples();
            
            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Backing track generator initialization failed:', error);
            return false;
        }
    }

    async loadDemoSamples() {
        // For demo purposes, we'll create synthetic samples
        // In production, these would be pre-recorded professional samples
        
        const sampleRate = 44100;
        const duration = 30; // 30 seconds
        const length = sampleRate * duration;

        // Create demo samples for each genre
        for (const [genre, instruments] of Object.entries(this.instrumentSamples)) {
            this.sampleLibrary[genre] = {};
            
            for (const [instrument, url] of Object.entries(instruments)) {
                this.sampleLibrary[genre][instrument] = this.createSyntheticSample(
                    instrument, 
                    length, 
                    sampleRate
                );
            }
        }
    }

    createSyntheticSample(instrument, length, sampleRate) {
        // Create synthetic audio samples for demo
        const buffer = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            
            switch (instrument) {
                case 'drums':
                    this.generateDrumPattern(channelData, sampleRate);
                    break;
                case 'tabla':
                    this.generateTablaPattern(channelData, sampleRate);
                    break;
                case 'piano':
                case 'acoustic':
                    this.generateChordProgression(channelData, sampleRate, 'major');
                    break;
                case 'sitar':
                    this.generateSitarMelody(channelData, sampleRate);
                    break;
                case 'tanpura':
                    this.generateTanpuraDrone(channelData, sampleRate);
                    break;
                case 'strings':
                case 'violin':
                    this.generateStringSection(channelData, sampleRate);
                    break;
                case 'harmonium':
                    this.generateHarmoniumChords(channelData, sampleRate);
                    break;
                case 'bass':
                    this.generateBassLine(channelData, sampleRate);
                    break;
                case 'guitar':
                    this.generateGuitarStrumming(channelData, sampleRate);
                    break;
                default:
                    this.generateSineWave(channelData, sampleRate, 440);
            }
        }
        
        return buffer;
    }

    generateDrumPattern(channelData, sampleRate) {
        const beatInterval = sampleRate * 0.5; // 120 BPM
        
        for (let i = 0; i < channelData.length; i++) {
            const beatPosition = i % beatInterval;
            
            // Kick on beats 1 and 3
            if (beatPosition < 1000 && (Math.floor(i / beatInterval) % 2 === 0)) {
                channelData[i] = Math.sin(2 * Math.PI * 60 * i / sampleRate) * 
                                Math.exp(-beatPosition / 500) * 0.8;
            }
            // Snare on beats 2 and 4
            else if (beatPosition < 500 && (Math.floor(i / beatInterval) % 2 === 1)) {
                channelData[i] = (Math.random() * 2 - 1) * 
                                Math.exp(-beatPosition / 200) * 0.6;
            }
            // Hi-hat
            else if (beatPosition < 100) {
                channelData[i] += (Math.random() * 2 - 1) * 
                                 Math.exp(-beatPosition / 50) * 0.2;
            }
        }
    }

    generateTablaPattern(channelData, sampleRate) {
        const beatInterval = sampleRate * 0.375; // Tabla rhythm
        
        for (let i = 0; i < channelData.length; i++) {
            const beatPosition = i % beatInterval;
            const beatNumber = Math.floor(i / beatInterval) % 8;
            
            // Tabla strokes pattern
            if (beatPosition < 800) {
                let frequency = 150;
                if (beatNumber === 0 || beatNumber === 4) frequency = 120; // Dha
                if (beatNumber === 2 || beatNumber === 6) frequency = 200; // Ti
                
                channelData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 
                                Math.exp(-beatPosition / 400) * 0.7;
            }
        }
    }

    generateChordProgression(channelData, sampleRate, scale) {
        const chordDuration = sampleRate * 2; // 2 seconds per chord
        const chords = [261.63, 329.63, 392.00, 261.63]; // C-E-G-C progression
        
        for (let i = 0; i < channelData.length; i++) {
            const chordIndex = Math.floor(i / chordDuration) % chords.length;
            const baseFreq = chords[chordIndex];
            
            // Generate chord (root + third + fifth)
            const root = Math.sin(2 * Math.PI * baseFreq * i / sampleRate);
            const third = Math.sin(2 * Math.PI * baseFreq * 1.25 * i / sampleRate);
            const fifth = Math.sin(2 * Math.PI * baseFreq * 1.5 * i / sampleRate);
            
            channelData[i] = (root + third * 0.7 + fifth * 0.5) * 0.3;
        }
    }

    generateSitarMelody(channelData, sampleRate) {
        // Sitar-like melody with microtonal bends
        const baseFreq = 220; // A3
        
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            const noteFreq = baseFreq * (1 + 0.1 * Math.sin(time * 0.5)); // Slow bend
            const vibrato = 1 + 0.02 * Math.sin(time * 6); // Vibrato
            
            channelData[i] = Math.sin(2 * Math.PI * noteFreq * vibrato * time) * 
                            Math.exp(-((i % (sampleRate * 2)) / (sampleRate * 0.5))) * 0.4;
        }
    }

    generateTanpuraDrone(channelData, sampleRate) {
        // Continuous drone with harmonics
        const fundamentals = [130.81, 196.00, 261.63, 130.81]; // C3, G3, C4, C3
        
        for (let i = 0; i < channelData.length; i++) {
            let sample = 0;
            
            fundamentals.forEach((freq, index) => {
                const phase = 2 * Math.PI * freq * i / sampleRate;
                sample += Math.sin(phase) * 0.25;
                sample += Math.sin(phase * 2) * 0.1; // 2nd harmonic
                sample += Math.sin(phase * 3) * 0.05; // 3rd harmonic
            });
            
            channelData[i] = sample * 0.3;
        }
    }

    generateStringSection(channelData, sampleRate) {
        // Lush string pad
        const chordFreqs = [261.63, 329.63, 392.00, 523.25]; // C major chord
        
        for (let i = 0; i < channelData.length; i++) {
            let sample = 0;
            
            chordFreqs.forEach(freq => {
                const envelope = 1 - Math.exp(-i / (sampleRate * 0.5));
                sample += Math.sin(2 * Math.PI * freq * i / sampleRate) * envelope;
            });
            
            channelData[i] = sample * 0.2;
        }
    }

    generateHarmoniumChords(channelData, sampleRate) {
        // Harmonium-style sustained chords
        const progression = [
            [261.63, 329.63, 392.00], // C major
            [293.66, 369.99, 440.00], // D minor
            [329.63, 415.30, 493.88], // E minor
            [261.63, 329.63, 392.00]  // C major
        ];
        
        const chordDuration = sampleRate * 2;
        
        for (let i = 0; i < channelData.length; i++) {
            const chordIndex = Math.floor(i / chordDuration) % progression.length;
            const chord = progression[chordIndex];
            
            let sample = 0;
            chord.forEach(freq => {
                sample += Math.sin(2 * Math.PI * freq * i / sampleRate);
            });
            
            channelData[i] = sample * 0.25;
        }
    }

    generateBassLine(channelData, sampleRate) {
        const bassNotes = [65.41, 73.42, 82.41, 65.41]; // C2, D2, E2, C2
        const noteDuration = sampleRate * 1;
        
        for (let i = 0; i < channelData.length; i++) {
            const noteIndex = Math.floor(i / noteDuration) % bassNotes.length;
            const freq = bassNotes[noteIndex];
            const envelope = Math.exp(-((i % noteDuration) / (sampleRate * 0.3)));
            
            channelData[i] = Math.sin(2 * Math.PI * freq * i / sampleRate) * envelope * 0.6;
        }
    }

    generateGuitarStrumming(channelData, sampleRate) {
        const chordDuration = sampleRate * 0.5;
        const chordFreqs = [82.41, 110.00, 146.83, 196.00]; // Guitar chord
        
        for (let i = 0; i < channelData.length; i++) {
            const strumPosition = i % chordDuration;
            
            if (strumPosition < chordDuration * 0.1) {
                let sample = 0;
                chordFreqs.forEach((freq, index) => {
                    const delay = index * 20; // Slight strum delay
                    if (strumPosition > delay) {
                        sample += Math.sin(2 * Math.PI * freq * i / sampleRate) * 
                                 Math.exp(-(strumPosition - delay) / 1000);
                    }
                });
                channelData[i] = sample * 0.4;
            }
        }
    }

    generateSineWave(channelData, sampleRate, frequency) {
        for (let i = 0; i < channelData.length; i++) {
            channelData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3;
        }
    }

    async generateBackingTrack(songData, mood, genre, userKey = 'C') {
        if (!this.isInitialized) {
            await this.initialize();
        }

        // Create cache key
        const cacheKey = `${songData.title}-${mood}-${genre}-${userKey}`;
        
        // Check if already generated
        if (this.generatedTracks.has(cacheKey)) {
            return this.generatedTracks.get(cacheKey);
        }

        try {
            // Get samples for the genre
            const samples = this.sampleLibrary[genre];
            if (!samples) {
                throw new Error(`Genre ${genre} not supported`);
            }

            // Get mood template
            const moodTemplate = this.moodTemplates[mood];
            if (!moodTemplate) {
                throw new Error(`Mood ${mood} not supported`);
            }

            // Create mixed backing track
            const backingTrack = await this.mixTracks(samples, moodTemplate, userKey);
            
            // Cache the result
            this.generatedTracks.set(cacheKey, backingTrack);
            
            return backingTrack;
        } catch (error) {
            console.error('Backing track generation failed:', error);
            throw error;
        }
    }

    async mixTracks(samples, moodTemplate, userKey) {
        const mixedBuffer = this.audioContext.createBuffer(
            2, 
            samples[Object.keys(samples)[0]].length, 
            this.audioContext.sampleRate
        );

        // Mix all tracks according to mood template
        for (let channel = 0; channel < 2; channel++) {
            const mixedData = mixedBuffer.getChannelData(channel);
            
            Object.entries(samples).forEach(([instrument, buffer]) => {
                const sourceData = buffer.getChannelData(channel);
                const volume = this.getVolumeForInstrument(instrument, moodTemplate);
                
                for (let i = 0; i < mixedData.length; i++) {
                    mixedData[i] += sourceData[i] * volume;
                }
            });
        }

        // Convert to blob for playback
        const blob = await this.audioBufferToBlob(mixedBuffer);
        const url = URL.createObjectURL(blob);

        return {
            audioBuffer: mixedBuffer,
            blob: blob,
            url: url,
            tracks: Object.keys(samples),
            mood: moodTemplate,
            duration: mixedBuffer.duration
        };
    }

    getVolumeForInstrument(instrument, moodTemplate) {
        // Map instrument names to mood template keys
        const instrumentMapping = {
            'drums': 'drums',
            'tabla': 'drums',
            'piano': 'melody',
            'acoustic': 'melody',
            'sitar': 'melody',
            'guitar': 'melody',
            'strings': 'strings',
            'violin': 'strings',
            'harmonium': 'strings',
            'tanpura': 'strings',
            'bass': 'bass'
        };

        const templateKey = instrumentMapping[instrument] || 'melody';
        return moodTemplate[templateKey] || 0.5;
    }

    async audioBufferToBlob(audioBuffer) {
        // Convert AudioBuffer to WAV blob
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

    // Utility methods
    clearCache() {
        this.generatedTracks.clear();
    }

    getCacheSize() {
        return this.generatedTracks.size;
    }

    getSupportedGenres() {
        return Object.keys(this.instrumentSamples);
    }

    getSupportedMoods() {
        return Object.keys(this.moodTemplates);
    }
}

// Global instance
window.BackingTrackGenerator = new BackingTrackGenerator();
