/**
 * APEX ENGINE v1.0.4 - MAIN BOOTSTRAP
 * Coordinates Graphics, Physics, and Audio Modules.
 */

import { scene, camera, initGraphics, renderGraphics } from './Engine.js';
import { world, groundMaterial, initPhysics, stepPhysics } from './Physics.js';
import { inputs, initInput, updateInput } from './Input.js';
import { vehicle, chassisBody, initVehicle, updateVehicle, vehicleStats } from './Vehicle.js';
import { updateCamera } from './CameraRig.js';
import { buildWorld } from './WorldManager.js';
import { initUI, updateUI } from './UIManager.js';
import { initVFX, updateVFX } from './VFX.js';
import { initAudio, updateAudio } from './Audio.js';

// --- LOOP TRACKING ---
let lastTime = 0;
let frameCount = 0;
let isStarted = false;

/**
 * INITIALIZATION CHAIN
 * Runs once at page load.
 */
function boot() {
    console.log("Apex Engine: Initiating Sequence...");

    // 1. Core Systems
    initGraphics();
    initPhysics();
    initInput();
    
    // 2. World & Assets
    buildWorld(scene, world);
    initVehicle(scene, world, groundMaterial);
    
    // 3. HUD & Feedback
    initUI();
    initVFX(scene);
    initAudio();

    console.log("Apex Engine: System Ready. Awaiting User Interaction.");
    
    // Start the requestAnimationFrame loop
    requestAnimationFrame(gameLoop);
}

/**
 * MASTER GAME LOOP
 * Targeted at 120Hz | Processes Input -> Physics -> VFX -> Render
 */
function gameLoop(timestamp) {
    // Calculate Delta Time in seconds
    const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    // 1. INPUT PROCESSING
    // Now uses the high-precision updateInput from your 500-line module
    updateInput(deltaTime);

    // 2. PHYSICS STEPPING
    // Step the Cannon-es world
    stepPhysics(deltaTime);

    // 3. VEHICLE STATE & CONTROL
    // Update car acceleration, steering, and nitro
    updateVehicle(inputs);

    // 4. CAMERA RIG
    // Follow the car with cinematic lerping
    updateCamera(camera, chassisBody, vehicle.chassisBody, deltaTime);

    // 5. VISUAL EFFECTS
    // Tire smoke, sparks, and nitro flames
    updateVFX(vehicle, inputs, deltaTime);

    // 6. UI & HUD TELEMETRY
    // Update speedo, nitro gauges, and FPS counter
    updateUI(chassisBody, inputs, vehicleStats);

    // 7. DYNAMIC AUDIO
    // Modulate engine pitch based on velocity
    updateAudio(chassisBody, inputs);

    // 8. GRAPHICS RENDERING
    // Draw the Three.js scene
    renderGraphics();

    requestAnimationFrame(gameLoop);
}

// Start the ignition
boot();

/**
 * 
 * DEVELOPER NOTES:
 * -----------------
 * DeltaTime: We use timestamp-based delta to decouple physics from framerate.
 * 120FPS Target: Ensure Chrome hardware acceleration is enabled.
 * Physics Sub-stepping: Handled within Physics.js to prevent tunneling.
 */
