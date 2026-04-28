let audioCtx;
let engineOsc;
let gainNode;
let isUnlocked = false;

export function initAudio() {
    console.log("Initializing V8 Audio Engine...");
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('mousedown', unlockAudio, { once: true });
}

function unlockAudio() {
    if (isUnlocked) return;
    
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    engineOsc = audioCtx.createOscillator();
    engineOsc.type = 'sawtooth';
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.05;

    engineOsc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    engineOsc.frequency.value = 40;
    engineOsc.start();
    
    isUnlocked = true;
    console.log("Audio Engine Live!");
}

export function updateAudio(chassisBody, inputs) {
    if (!isUnlocked) return;
    
    const speed = chassisBody.velocity.length();
    let targetFreq = 40 + (speed * 1.5);
    
    if (inputs.forward) {
        targetFreq += 20; 
        gainNode.gain.setTargetAtTime(0.1, audioCtx.currentTime, 0.1);
    } else {
        gainNode.gain.setTargetAtTime(0.05, audioCtx.currentTime, 0.1);
    }

    engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
}
