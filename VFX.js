import * as THREE from 'three';\
\
const POOL_SIZE = 50;\
const smokePool = [];\
let poolIndex = 0;\
\
export function initVFX(scene) \{\
    console.log("Initializing VFX Object Pool...");\
\
    const smokeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);\
    const smokeMat = new THREE.MeshBasicMaterial(\{ \
        color: 0xdddddd, \
        transparent: true, \
        opacity: 0.5 \
    \});\
\
    // Pre-allocate 50 smoke particles and hide them under the map\
    for (let i = 0; i < POOL_SIZE; i++) \{\
        const smoke = new THREE.Mesh(smokeGeo, smokeMat.clone());\
        smoke.position.set(0, -100, 0); // Hide below ground\
        smoke.userData = \{ active: false, life: 0 \};\
        scene.add(smoke);\
        smokePool.push(smoke);\
    \}\
\}\
\
export function updateVFX(vehicle, inputs, deltaTime) \{\
    const speed = vehicle.chassisBody.velocity.length();\
    \
    // Trigger smoke if handbrake is pulled AND we are moving fast\
    if (inputs.brake && speed > 5) \{\
        spawnSmoke(vehicle);\
    \}\
\
    // Animate active smoke particles\
    for (let i = 0; i < POOL_SIZE; i++) \{\
        const p = smokePool[i];\
        if (p.userData.active) \{\
            p.userData.life -= deltaTime * 1.5; // Fade out over time\
            p.position.y += deltaTime * 2; // Drift upwards\
            p.scale.setScalar(p.userData.life * 2); // Shrink\
            p.material.opacity = p.userData.life * 0.5;\
\
            // Reset particle when it dies\
            if (p.userData.life <= 0) \{\
                p.userData.active = false;\
                p.position.set(0, -100, 0); // Hide again\
            \}\
        \}\
    \}\
\}\
\
function spawnSmoke(vehicle) \{\
    // Grab the next available smoke particle from the pool\
    const p = smokePool[poolIndex];\
    \
    // Position it at the back wheels\
    const offset = new THREE.Vector3((Math.random() - 0.5), 0, -1.5);\
    // Convert local offset to world coordinates based on car's rotation\
    const worldOffset = vehicle.chassisBody.quaternion.vmult(offset);\
    \
    p.position.copy(vehicle.chassisBody.position);\
    p.position.vadd(worldOffset, p.position);\
    p.position.y = 0.2; // Right above the ground\
\
    // Activate it\
    p.userData.active = true;\
    p.userData.life = 1.0;\
    \
    // Cycle the pool index\
    poolIndex = (poolIndex + 1) % POOL_SIZE;\
\}}
