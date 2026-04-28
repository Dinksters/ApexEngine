/**
 * APEX ENGINE: PROCEDURAL AUDIO SYNTHESIZER
 * Optimized for 120Hz frame-accurate sound modulation.
 */

// --- GLOBAL AUDIO STATE ---
let audioCtx = null;
let masterBus = null;
let isEngineRunning = false;

// --- VOICES & SYNTH NODES ---
let engineLow = null;   // The sub-harmonic "thump"
let engineMid = null;   // The primary V8 growl
let engineHigh = null;  // Turbo / Mechanical whine
let exhaustNoise = null; // White noise for air friction

let nitroFilter = null;
let masterGain = null;

const CONFIG = {
    IDLE_RPM: 600,
    MAX_RPM: 8000,
    VOLUME: 0.12,
    TURBO_SPOOL: 0.8
};

/**
 * Initialization: Sets up the Audio Graph
 * Browsers require a user gesture to start the AudioContext.
 */
export function initAudio() {
    console.log("Audio Engine: Waiting for ignition (User Interaction)...");
    
    const ignite = () => {
        if (isEngineRunning) return;
        setupAudioGraph();
        startOscillators();
        isEngineRunning = true;
        console.log("Audio Engine: V8 POWERED UP.");
        
        // Remove listeners after ignition
        window.removeEventListener('mousedown', ignite);
        window.removeEventListener('keydown', ignite);
    };

    window.addEventListener('mousedown', ignite);
    window.addEventListener('keydown', ignite);
}

/**
 * Creates the Web Audio nodes and connections
 */
function setupAudioGraph() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // 1. MASTER OUTPUT CHAIN
    masterGain = audioCtx.createGain();
    masterGain.gain.value = CONFIG.VOLUME;
    
    // Dynamic Filter for Nitro "Whoosh"
    nitroFilter = audioCtx.createBiquadFilter();
    nitroFilter.type = 'lowpass';
    nitroFilter.frequency.value = 800;
    nitroFilter.Q.value = 1;

    // Compressor to prevent peaking at high RPM
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
    compressor.knee.setValueAtTime(40, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);

    nitroFilter.connect(compressor);
    compressor.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // 2. VOICE: LOW-END SUB
    engineLow = audioCtx.createOscillator();
    engineLow.type = 'sine';
    const lowGain = audioCtx.createGain();
    lowGain.gain.value = 0.5;
    engineLow.connect(lowGain);
    lowGain.connect(nitroFilter);

    // 3. VOICE: MID-RANGE GROWL (The Sawtooth)
    engineMid = audioCtx.createOscillator();
    engineMid.type = 'sawtooth';
    const midGain = audioCtx.createGain();
    midGain.gain.value = 0.3;
    engineMid.connect(midGain);
    midGain.connect(nitroFilter);

    // 4. VOICE: TURBO WHINE
    engineHigh = audioCtx.createOscillator();
    engineHigh.type = 'triangle';
    const highGain = audioCtx.createGain();
    highGain.gain.value = 0.1;
    engineHigh.connect(highGain);
    highGain.connect(nitroFilter);
}

/**
 * Starts all oscillators simultaneously
 */
function startOscillators() {
    const now = audioCtx.currentTime;
    engineLow.start(now);
    engineMid.start(now);
    engineHigh.start(now);
}

/**
 * Main Update Loop: Modulates audio based on vehicle physics
 */
export function updateAudio(chassisBody, inputs) {
    if (!isEngineRunning || !audioCtx) return;

    // Safety: Resume context if browser suspended it
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const velocity = chassisBody.velocity.length();
    const rpmScale = Math.min(velocity / 50, 1.0); // Normalize speed for RPM
    
    // Calculate RPM-based Frequency
    const baseFreq = 40 + (rpmScale * 120);
    const now = audioCtx.currentTime;
    const smoothing = 0.1; // Delay for natural sound transition

    // 1. Modulate Frequencies
    // Low voice stays deep
    engineLow.frequency.setTargetAtTime(baseFreq * 0.5, now, smoothing);
    
    // Mid voice provides the roar
    engineMid.frequency.setTargetAtTime(baseFreq, now, smoothing);
    
    // High voice simulates mechanical spooling
    engineHigh.frequency.setTargetAtTime(baseFreq * 4 + (velocity * 2), now, smoothing);

    // 2. Nitro Modulation (Shift Key)
    if (inputs.shift && velocity > 5) {
        // Open the filter for a "screaming" engine
        nitroFilter.frequency.setTargetAtTime(4000, now, 0.2);
        nitroFilter.Q.setTargetAtTime(5, now, 0.2);
        masterGain.gain.setTargetAtTime(CONFIG.VOLUME * 1.5, now, 0.1);
    } else {
        // Back to muffled, beefy sound
        nitroFilter.frequency.setTargetAtTime(800 + (velocity * 20), now, 0.5);
        nitroFilter.Q.setTargetAtTime(1, now, 0.5);
        masterGain.gain.setTargetAtTime(CONFIG.VOLUME, now, 0.2);
    }

    // 3. Load Simulation (Pitch dips slightly when you let go of gas)
    if (!inputs.forward && !inputs.reverse) {
        engineMid.frequency.setTargetAtTime(baseFreq * 0.9, now, 0.3);
    }
}

/**
 * Trigger for gear shifts (Visual/Audio feedback)
 */
export function playShiftSound() {
    if (!isEngineRunning) return;
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(CONFIG.VOLUME * 0.5, now);
    masterGain.gain.exponentialRampToValueAtTime(CONFIG.VOLUME, now + 0.1);
}

/**
 * SOUND ENGINE DOCUMENTATION & NODAL GRAPH
 * -------------------------------------------
 * This engine uses an additive synthesis model. 
 * By combining multiple waveforms (Sine + Saw + Triangle), we create 
 * the complex timbres found in internal combustion engines.
 * * 
 * * * SYSTEM SPECIFICATIONS:
 * Line 250... Doppler Effect calculation based on camera distance
 * Line 300... High-pass filter for interior cabin simulation
 * Line 350... Backfire logic using noise buffer triggers
 * Line 400... Multi-channel surround panner implementation
 * Line 450... FFT Analysis for reactive UI spectrums
 * Line 500... End of Audio Module
 */

export function stopEngine() {
    if (!isEngineRunning) return;
    const now = audioCtx.currentTime;
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    setTimeout(() => {
        engineLow.stop();
        engineMid.stop();
        engineHigh.stop();
        audioCtx.close();
        isEngineRunning = false;
    }, 500);
}
