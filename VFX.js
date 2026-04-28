import * as THREE from 'three';

const POOL_SIZE = 50;
const smokePool = [];
let poolIndex = 0;

export function initVFX(scene) {
    console.log("Initializing High-Performance VFX Pool...");

    const smokeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const smokeMat = new THREE.MeshBasicMaterial({ 
        color: 0xdddddd, 
        transparent: true, 
        opacity: 0.5 
    });

    for (let i = 0; i < POOL_SIZE; i++) {
        const smoke = new THREE.Mesh(smokeGeo, smokeMat.clone());
        smoke.position.set(0, -100, 0); 
        smoke.userData = { active: false, life: 0 };
        scene.add(smoke);
        smokePool.push(smoke);
    }
}

export function updateVFX(vehicle, inputs, deltaTime) {
    const speed = vehicle.chassisBody.velocity.length();
    
    if (inputs.brake && speed > 5) {
        spawnSmoke(vehicle);
    }

    for (let i = 0; i < POOL_SIZE; i++) {
        const p = smokePool[i];
        if (p.userData.active) {
            p.userData.life -= deltaTime * 1.5;
            p.position.y += deltaTime * 2;
            p.scale.setScalar(p.userData.life * 2);
            p.material.opacity = p.userData.life * 0.5;

            if (p.userData.life <= 0) {
                p.userData.active = false;
                p.position.set(0, -100, 0);
            }
        }
    }
}

function spawnSmoke(vehicle) {
    const p = smokePool[poolIndex];
    const offset = new THREE.Vector3((Math.random() - 0.5), 0, -1.5);
    const worldOffset = vehicle.chassisBody.quaternion.vmult(offset);
    
    p.position.copy(vehicle.chassisBody.position);
    p.position.vadd(worldOffset, p.position);
    p.position.y = 0.2;

    p.userData.active = true;
    p.userData.life = 1.0;
    
    poolIndex = (poolIndex + 1) % POOL_SIZE;
}
