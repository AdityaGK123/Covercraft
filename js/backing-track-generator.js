// Backing Track Generator - Cost-optimized with cached samples
class BackingTrackGenerator {
    constructor() {
        this.audioContext = null;
        this.sampleLibrary = {};
        this.generatedTracks = new Map();
        this.isInitialized = false;
        
        // Pre-defined instrument samples (URLs would point to your sample library)
        this.instrumentSamples = {
            'indie-acoustic': {
                percussion: '/samples/indie/percussion.wav',
                acoustic: '/samples/indie/acoustic.wav',
                strings: '/samples/indie/strings.wav',
                bass: '/samples/indie/bass.wav'
            },
            'singer-songwriter': {
                percussion: '/samples/singer/percussion.wav',
                piano: '/samples/singer/piano.wav',
                acoustic: '/samples/singer/acoustic.wav',
                strings: '/samples/singer/strings.wav'
            },
            'folk-pop': {
                percussion: '/samples/folk/percussion.wav',
                acoustic: '/samples/folk/acoustic.wav',
                strings: '/samples/folk/strings.wav',
                harmonium: '/samples/folk/harmonium.wav'
            },
            'neo-soul': {
                percussion: '/samples/soul/percussion.wav',
                'electric-piano': '/samples/soul/electric-piano.wav',
                acoustic: '/samples/soul/acoustic.wav',
                strings: '/samples/soul/strings.wav'
            }
        };

        // NPR Tiny Desk style mood templates - stripped down, intimate
        this.moodTemplates = {
            chill: {
                percussion: 0.2,  // Subtle shakers/tambourine
                melody: 0.7,      // Acoustic guitar or soft piano
                strings: 0.4,     // Light string accompaniment
                bass: 0.3         // Minimal bass presence
            },
            emotional: {
                percussion: 0.1,  // Very minimal percussion
                melody: 0.6,      // Piano or fingerpicked guitar
                strings: 0.8,     // Prominent strings for emotion
                bass: 0.2         // Subtle bass support
            },
            energetic: {
                percussion: 0.4,  // Congo and tambourine
                melody: 0.8,      // Strummed acoustic guitar
                strings: 0.3,     // Light string accents
                bass: 0.4         // Moderate bass groove
            },
            romantic: {
                percussion: 0.1,  // Barely there percussion
                melody: 0.5,      // Soft piano or guitar
                strings: 0.7,     // Warm string section
                bass: 0.2         // Minimal bass
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
                    this.generateClassicalPiano(channelData, sampleRate, 'major');
                    break;
                case 'electric-piano':
                    this.generateElectricPiano(channelData, sampleRate, 'major');
                    break;
                case 'percussion':
                    this.generateDrumPattern(channelData, sampleRate);
                    break;
                case 'acoustic':
                    this.generateGuitarStrumming(channelData, sampleRate);
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
        // Organic percussion: Congo, tambourine, shakers
        const beatInterval = sampleRate * 0.5; // 120 BPM
        
        for (let i = 0; i < channelData.length; i++) {
            const beatPosition = i % beatInterval;
            const time = i / sampleRate;
            
            // Congo drum on beats 1 and 3 (warm, woody tone)
            if (beatPosition < 2000 && (Math.floor(i / beatInterval) % 2 === 0)) {
                const congoFreq = 80 + 20 * Math.sin(time * 0.1); // Slight pitch variation
                channelData[i] = Math.sin(2 * Math.PI * congoFreq * i / sampleRate) * 
                                Math.exp(-beatPosition / 800) * 0.6 *
                                (1 + 0.3 * Math.sin(2 * Math.PI * congoFreq * 2 * i / sampleRate)); // Harmonics
            }
            // Tambourine on off-beats (metallic jingle)
            else if (beatPosition < 300 && (Math.floor(i / beatInterval) % 4 === 1)) {
                const jingleFreq = 3000 + 1000 * Math.random();
                channelData[i] += (Math.random() * 2 - 1) * 
                                 Math.exp(-beatPosition / 150) * 0.3 *
                                 Math.sin(2 * Math.PI * jingleFreq * i / sampleRate);
            }
            // Shakers (continuous subtle rhythm)
            else if (Math.random() < 0.02) {
                channelData[i] += (Math.random() * 2 - 1) * 0.15 *
                                 Math.exp(-50 / sampleRate);
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

    generateClassicalPiano(channelData, sampleRate, scale) {
        // Classical piano with natural timbre and dynamics
        const chordDuration = sampleRate * 2; // 2 seconds per chord
        const chords = [
            [261.63, 329.63, 392.00], // C major
            [293.66, 369.99, 440.00], // D minor  
            [329.63, 415.30, 493.88], // E minor
            [349.23, 440.00, 523.25]  // F major
        ];
        
        for (let i = 0; i < channelData.length; i++) {
            const chordIndex = Math.floor(i / chordDuration) % chords.length;
            const chord = chords[chordIndex];
            const chordPosition = i % chordDuration;
            
            let sample = 0;
            chord.forEach((freq, noteIndex) => {
                // Piano attack and decay envelope
                const attack = Math.min(1, chordPosition / (sampleRate * 0.05));
                const decay = Math.exp(-chordPosition / (sampleRate * 1.2));
                const envelope = attack * decay;
                
                // Piano harmonics for natural timbre
                const fundamental = Math.sin(2 * Math.PI * freq * i / sampleRate);
                const harmonic2 = Math.sin(2 * Math.PI * freq * 2 * i / sampleRate) * 0.3;
                const harmonic3 = Math.sin(2 * Math.PI * freq * 3 * i / sampleRate) * 0.1;
                
                sample += (fundamental + harmonic2 + harmonic3) * envelope * (0.8 - noteIndex * 0.1);
            });
            
            channelData[i] = sample * 0.25;
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
        // Light Hollywood strings and violins - warm, cinematic
        const time = channelData.length / sampleRate;
        const chordProgression = [
            [261.63, 329.63, 392.00, 523.25], // C major
            [293.66, 369.99, 440.00, 587.33], // D minor
            [329.63, 415.30, 493.88, 659.25], // E minor  
            [349.23, 440.00, 523.25, 698.46]  // F major
        ];
        
        for (let i = 0; i < channelData.length; i++) {
            const currentTime = i / sampleRate;
            const chordIndex = Math.floor(currentTime / 2) % chordProgression.length;
            const chord = chordProgression[chordIndex];
            
            let sample = 0;
            
            chord.forEach((freq, voiceIndex) => {
                // Slow attack for strings
                const attack = Math.min(1, currentTime / 1.5);
                
                // Subtle vibrato for realism
                const vibrato = 1 + 0.015 * Math.sin(2 * Math.PI * 4.5 * currentTime);
                const vibratoFreq = freq * vibrato;
                
                // String harmonics for warmth
                const fundamental = Math.sin(2 * Math.PI * vibratoFreq * currentTime);
                const harmonic2 = Math.sin(2 * Math.PI * vibratoFreq * 2 * currentTime) * 0.3;
                const harmonic3 = Math.sin(2 * Math.PI * vibratoFreq * 3 * currentTime) * 0.15;
                
                // Bow dynamics simulation
                const bowPressure = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.3 * currentTime);
                
                sample += (fundamental + harmonic2 + harmonic3) * 
                         attack * bowPressure * (0.7 - voiceIndex * 0.1);
            });
            
            // String section ensemble effect (slight detuning)
            const ensemble = 1 + 0.002 * Math.sin(2 * Math.PI * 0.7 * currentTime);
            
            channelData[i] = sample * ensemble * 0.18;
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
        // Realistic acoustic guitar with fretting, strumming, and fingering
        const chordDuration = sampleRate * 1; // 1 second per strum
        const openStrings = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]; // E-A-D-G-B-E
        
        for (let i = 0; i < channelData.length; i++) {
            const strumPosition = i % chordDuration;
            const time = i / sampleRate;
            
            if (strumPosition < chordDuration * 0.15) { // Strum duration
                let sample = 0;
                
                openStrings.forEach((freq, stringIndex) => {
                    const stringDelay = stringIndex * 8; // Realistic strum timing
                    
                    if (strumPosition > stringDelay) {
                        // String pluck attack
                        const pluckEnvelope = Math.exp(-(strumPosition - stringDelay) / 200);
                        
                        // Body resonance and harmonics
                        const fundamental = Math.sin(2 * Math.PI * freq * i / sampleRate);
                        const harmonic2 = Math.sin(2 * Math.PI * freq * 2 * i / sampleRate) * 0.4;
                        const harmonic3 = Math.sin(2 * Math.PI * freq * 3 * i / sampleRate) * 0.2;
                        
                        // String damping and fret buzz simulation
                        const dampening = 1 - (stringIndex * 0.05);
                        const fretBuzz = (Math.random() * 2 - 1) * 0.02 * pluckEnvelope;
                        
                        sample += (fundamental + harmonic2 + harmonic3) * 
                                 pluckEnvelope * dampening * (0.9 - stringIndex * 0.1) + fretBuzz;
                    }
                });
                
                // Body resonance
                const bodyResonance = Math.sin(2 * Math.PI * 100 * i / sampleRate) * 0.1 * 
                                     Math.exp(-strumPosition / 500);
                
                channelData[i] = (sample + bodyResonance) * 0.3;
            }
            // Sustain and natural decay
            else if (strumPosition < chordDuration * 0.8) {
                const sustainPosition = strumPosition - chordDuration * 0.15;
                const sustainDecay = Math.exp(-sustainPosition / (sampleRate * 0.6));
                
                let sustainSample = 0;
                openStrings.forEach((freq, stringIndex) => {
                    sustainSample += Math.sin(2 * Math.PI * freq * i / sampleRate) * 
                                   sustainDecay * (0.3 - stringIndex * 0.03);
                });
                
                channelData[i] = sustainSample * 0.15;
            }
        }
    }

    generateElectricPiano(channelData, sampleRate, scale) {
        // Electric piano with bell-like tone and natural dynamics
        const chordDuration = sampleRate * 2; // 2 seconds per chord
        const chords = [
            [261.63, 329.63, 392.00], // C major
            [293.66, 369.99, 440.00], // D minor  
            [329.63, 415.30, 493.88], // E minor
            [349.23, 440.00, 523.25]  // F major
        ];
        
        for (let i = 0; i < channelData.length; i++) {
            const chordIndex = Math.floor(i / chordDuration) % chords.length;
            const chord = chords[chordIndex];
            const chordPosition = i % chordDuration;
            const time = i / sampleRate;
            
            let sample = 0;
            chord.forEach((freq, noteIndex) => {
                // Electric piano attack and sustain
                const attack = Math.min(1, chordPosition / (sampleRate * 0.02));
                const sustain = Math.exp(-chordPosition / (sampleRate * 2.5));
                const envelope = attack * sustain;
                
                // Bell-like harmonics for electric piano timbre
                const fundamental = Math.sin(2 * Math.PI * freq * time);
                const harmonic2 = Math.sin(2 * Math.PI * freq * 2 * time) * 0.6;
                const harmonic3 = Math.sin(2 * Math.PI * freq * 3 * time) * 0.3;
                const harmonic5 = Math.sin(2 * Math.PI * freq * 5 * time) * 0.1;
                
                // Tremolo effect
                const tremolo = 1 + 0.1 * Math.sin(2 * Math.PI * 6 * time);
                
                sample += (fundamental + harmonic2 + harmonic3 + harmonic5) * 
                         envelope * tremolo * (0.7 - noteIndex * 0.1);
            });
            
            channelData[i] = sample * 0.22;
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
        // Map instrument names to mood template keys for NPR Tiny Desk style
        const instrumentMapping = {
            'drums': 'percussion',
            'tabla': 'percussion', 
            'percussion': 'percussion',
            'piano': 'melody',
            'electric-piano': 'melody',
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
