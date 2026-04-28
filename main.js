import { scene, camera, initGraphics, renderGraphics } from './Engine.js';
import { world, groundMaterial, initPhysics, stepPhysics } from './Physics.js';
import { inputs, initInput, updateInput } from './Input.js';
import { vehicle, chassisBody, initVehicle, updateVehicle, vehicleStats } from './Vehicle.js';
import { updateCamera } from './CameraRig.js';
import { buildWorld } from './WorldManager.js';
import { initUI, updateUI } from './UIManager.js';
import { initVFX, updateVFX } from './VFX.js';
import { initAudio, updateAudio } from './Audio.js';

let lastTime = 0;

function boot() {
    initGraphics();
    initPhysics();
    initInput();
    buildWorld(scene, world);
    initVehicle(scene, world, groundMaterial);
    initUI();
    initVFX(scene);
    initAudio();
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1); // Prevent huge jumps
    lastTime = timestamp;

    updateInput(dt);
    stepPhysics(dt);
    updateVehicle(inputs);
    updateCamera(camera, chassisBody, vehicle.chassisBody, dt);
    updateVFX(vehicle, inputs, dt);
    updateUI(chassisBody, inputs, vehicleStats);
    updateAudio(chassisBody, inputs);
    
    renderGraphics();

    requestAnimationFrame(gameLoop);
}

boot();
