let audioCtx;
let engineOsc;
let gainNode;
let isUnlocked = false;

export function initAudio() {
    console.log("Audio System: Standby. Click to Start Engine.");
    // We listen for a click anywhere on the page to ignite the engine
    window.addEventListener('mousedown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
}

function unlockAudio() {
    if (isUnlocked) return;
    
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create an Oscillator for the 'growl'
    engineOsc = audioCtx.createOscillator();
    engineOsc.type = 'sawtooth'; 
    
    // Lowpass filter to make it sound "beefy" and internal
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.1; // 10% Volume

    engineOsc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    engineOsc.frequency.value = 50; // Idle RPM
    engineOsc.start();
    
    isUnlocked = true;
    console.log("V8 ENGINE IGNITED.");
}

export function updateAudio(chassisBody, inputs) {
    if (!isUnlocked || !audioCtx) return;
    
    const speed = chassisBody.velocity.length();
    
    // Pitch math: Base + Speed + Revving
    let targetFreq = 50 + (speed * 1.8);
    
    if (inputs.forward) {
        targetFreq *= 1.2; // High-pitched whine when flooring it
        gainNode.gain.setTargetAtTime(0.15, audioCtx.currentTime, 0.1);
    } else {
        gainNode.gain.setTargetAtTime(0.08, audioCtx.currentTime, 0.2);
    }

    engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
}
