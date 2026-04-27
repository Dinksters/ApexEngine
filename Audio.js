{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww38200\viewh20880\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Audio.js\
let audioCtx;\
let engineOsc;\
let gainNode;\
let isUnlocked = false;\
\
export function initAudio() \{\
    console.log("Initializing Audio Engine...");\
    \
    // Listen for any keypress to unlock the audio (Browser Security Policy)\
    window.addEventListener('keydown', unlockAudio, \{ once: true \});\
\}\
\
function unlockAudio() \{\
    if (isUnlocked) return;\
    \
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();\
    \
    // Create a Sawtooth wave (sounds raspy like an engine)\
    engineOsc = audioCtx.createOscillator();\
    engineOsc.type = 'sawtooth';\
    \
    // Create a Lowpass filter to muffle it like an exhaust pipe\
    const filter = audioCtx.createBiquadFilter();\
    filter.type = 'lowpass';\
    filter.frequency.value = 300; // Muffled bass\
\
    // Create volume control\
    gainNode = audioCtx.createGain();\
    gainNode.gain.value = 0.05; // Keep it quiet at first\
\
    // Wire it up: Oscillator -> Filter -> Volume -> Speakers\
    engineOsc.connect(filter);\
    filter.connect(gainNode);\
    gainNode.connect(audioCtx.destination);\
    \
    engineOsc.frequency.value = 40; // Idle RPM\
    engineOsc.start();\
    \
    isUnlocked = true;\
    console.log("Audio Unlocked!");\
\}\
\
export function updateAudio(chassisBody, inputs) \{\
    if (!isUnlocked) return;\
    \
    const speed = chassisBody.velocity.length();\
    \
    // Calculate fake RPM\
    let targetFreq = 40 + (speed * 1.5);\
    \
    // Make the engine rev higher when pressing the gas\
    if (inputs.forward) \{\
        targetFreq += 20; \
        gainNode.gain.setTargetAtTime(0.1, audioCtx.currentTime, 0.1); // Louder\
    \} else \{\
        gainNode.gain.setTargetAtTime(0.05, audioCtx.currentTime, 0.1); // Quieter\
    \}\
\
    // Smoothly transition pitch\
    engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);\
\}}