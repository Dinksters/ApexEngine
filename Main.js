{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww38200\viewh20880\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // main.js\
import \{ scene, camera, initGraphics, renderGraphics \} from './Engine.js';\
import \{ world, groundMaterial, initPhysics, stepPhysics \} from './Physics.js';\
import \{ inputs, initInput \} from './Input.js';\
import \{ vehicle, chassisBody, initVehicle, updateVehicle \} from './Vehicle.js';\
import \{ updateCamera \} from './CameraRig.js';\
import \{ buildWorld \} from './WorldManager.js';\
import \{ initUI, updateUI \} from './UIManager.js';\
import \{ initVFX, updateVFX \} from './VFX.js';\
import \{ initAudio, updateAudio \} from './Audio.js';\
\
let isRunning = true;\
let lastTime = 0;\
\
function boot() \{\
    console.log("System Booting...");\
    \
    // Initialize Core Engines\
    initGraphics();\
    initPhysics();\
    initInput();\
    \
    // Build World & Entities\
    buildWorld(scene, world);\
    initVehicle(scene, world, groundMaterial);\
    \
    // Initialize Polish (UI, VFX, Sound)\
    initUI();\
    initVFX(scene);\
    initAudio();\
    \
    console.log("Engine Ready. Starting Loop.");\
    requestAnimationFrame(gameLoop);\
\}\
\
function gameLoop(timestamp) \{\
    if (!isRunning) return;\
    \
    // Calculate Delta Time in seconds\
    const deltaTime = (timestamp - lastTime) / 1000;\
    lastTime = timestamp;\
\
    // 1. Math & Logic\
    stepPhysics(deltaTime);\
    updateVehicle(inputs); \
    \
    // 2. Camera & Polish\
    updateCamera(camera, chassisBody, vehicle.chassisBody, deltaTime);\
    updateUI(chassisBody);\
    updateVFX(vehicle, inputs, deltaTime);\
    updateAudio(chassisBody, inputs);\
    \
    // 3. Render GPU Frame\
    renderGraphics();\
\
    requestAnimationFrame(gameLoop);\
\}\
\
// Ignition\
boot();}