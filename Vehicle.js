import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// --- CONFIGURATION & CONSTANTS ---
const CONFIG = {
    CHASSIS: {
        mass: 1500,
        width: 2.2,
        height: 0.8,
        depth: 4.8,
        color: 0xff0055
    },
    WHEEL: {
        radius: 0.45,
        width: 0.4,
        stiffness: 40,
        restLength: 0.4,
        friction: 5,
        damping: 2.3
    },
    PHYSICS: {
        engineForce: 3500,
        nitroMultiplier: 3.5,
        maxSteer: 0.5,
        brakeForce: 150,
        downforceScale: 0.5
    }
};

// --- GLOBAL EXPORTS ---
export let vehicle;
export let chassisBody;
export let vehicleStats = {
    speed: 0,
    nitroLevel: 100,
    isNitroActive: false,
    damage: 0
};

// --- PRIVATE REFRENCES ---
let chassisVisual;
let wheelVisuals = [];
let headlightL, headlightR;
let nitroLight;
let underglow;

/**
 * Main Initialization for the High-Fidelity Vehicle
 */
export function initVehicle(scene, world, groundMaterial) {
    console.log("Vehicle Engineering: Constructing Chassis...");

    // 1. PHYSICAL BODY SETUP
    const shape = new CANNON.Box(new CANNON.Vec3(
        CONFIG.CHASSIS.width / 2, 
        CONFIG.CHASSIS.height / 2, 
        CONFIG.CHASSIS.depth / 2
    ));
    
    chassisBody = new CANNON.Body({ mass: CONFIG.CHASSIS.mass });
    chassisBody.addShape(shape);
    chassisBody.position.set(0, 5, 0); // Spawn in air
    chassisBody.angularDamping = 0.5; // Prevent excessive flipping

    // 2. VISUAL CHASSIS CONSTRUCTION
    const carGroup = new THREE.Group();
    
    // Main Body
    const bodyGeo = new THREE.BoxGeometry(
        CONFIG.CHASSIS.width, 
        CONFIG.CHASSIS.height, 
        CONFIG.CHASSIS.depth
    );
    const bodyMat = new THREE.MeshStandardMaterial({ 
        color: CONFIG.CHASSIS.color, 
        roughness: 0.1, 
        metalness: 0.9 
    });
    
    chassisVisual = new THREE.Mesh(bodyGeo, bodyMat);
    chassisVisual.castShadow = true;
    carGroup.add(chassisVisual);

    // Add a "Cockpit" piece
    const cockpitGeo = new THREE.BoxGeometry(1.8, 0.6, 1.8);
    const cockpit = new THREE.Mesh(cockpitGeo, bodyMat);
    cockpit.position.set(0, 0.6, -0.2);
    chassisVisual.add(cockpit);

    // Add a Spoiler
    const spoilerPostGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const postL = new THREE.Mesh(spoilerPostGeo, bodyMat);
    const postR = new THREE.Mesh(spoilerPostGeo, bodyMat);
    postL.position.set(0.8, 0.4, 2.2);
    postR.position.set(-0.8, 0.4, 2.2);
    chassisVisual.add(postL, postR);

    const wingGeo = new THREE.BoxGeometry(2.4, 0.1, 0.8);
    const wing = new THREE.Mesh(wingGeo, bodyMat);
    wing.position.set(0, 0.6, 2.2);
    chassisVisual.add(wing);

    // 3. LIGHTING SYSTEMS
    // Headlights
    const lightGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    lightGeo.rotateX(Math.PI / 2);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    headlightL = new THREE.Mesh(lightGeo, lightMat);
    headlightR = new THREE.Mesh(lightGeo, lightMat);
    headlightL.position.set(0.7, 0, -2.41);
    headlightR.position.set(-0.7, 0, -2.41);
    chassisVisual.add(headlightL, headlightR);

    const spotL = new THREE.SpotLight(0xffffff, 20, 100, 0.5);
    spotL.position.set(0.7, 0, -2.5);
    spotL.target.position.set(0.7, -1, -50);
    chassisVisual.add(spotL, spotL.target);

    // Nitro Thruster Light
    nitroLight = new THREE.PointLight(0xff00ff, 0, 10);
    nitroLight.position.set(0, 0, 2.5);
    chassisVisual.add(nitroLight);

    // Cyberpunk Underglow
    underglow = new THREE.RectAreaLight(0x00ffff, 5, 2, 4);
    underglow.position.set(0, -0.41, 0);
    underglow.rotation.x = -Math.PI / 2;
    chassisVisual.add(underglow);

    scene.add(carGroup);

    // 4. RAYCAST VEHICLE LOGIC
    vehicle = new CANNON.RaycastVehicle({
        chassisBody: chassisBody,
        indexRightAxis: 0,
        indexUpAxis: 1,
        indexForwardAxis: 2
    });

    const wheelOptions = {
        radius: CONFIG.WHEEL.radius,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: CONFIG.WHEEL.stiffness,
        suspensionRestLength: CONFIG.WHEEL.restLength,
        frictionSlip: CONFIG.WHEEL.friction,
        dampingRelaxation: CONFIG.WHEEL.damping,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence: 0.01,
        axleLocal: new CANNON.Vec3(-1, 0, 0),
        chassisConnectionPointLocal: new CANNON.Vec3()
    };

    // Correcting Wheel Placement
    const wX = CONFIG.CHASSIS.width / 2;
    const wZ = 1.6;
    
    // Front Left
    wheelOptions.chassisConnectionPointLocal.set(wX, -0.2, -wZ);
    vehicle.addWheel(wheelOptions);
    // Front Right
    wheelOptions.chassisConnectionPointLocal.set(-wX, -0.2, -wZ);
    vehicle.addWheel(wheelOptions);
    // Rear Left
    wheelOptions.chassisConnectionPointLocal.set(wX, -0.2, wZ);
    vehicle.addWheel(wheelOptions);
    // Rear Right
    wheelOptions.chassisConnectionPointLocal.set(-wX, -0.2, wZ);
    vehicle.addWheel(wheelOptions);

    vehicle.addToWorld(world);

    // 5. WHEEL VISUALS
    const wheelGeo = new THREE.CylinderGeometry(
        CONFIG.WHEEL.radius, 
        CONFIG.WHEEL.radius, 
        CONFIG.WHEEL.width, 
        24
    );
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        roughness: 0.8 
    });

    for (let i = 0; i < 4; i++) {
        const mesh = new THREE.Mesh(wheelGeo, wheelMat);
        mesh.castShadow = true;
        scene.add(mesh);
        wheelVisuals.push(mesh);
    }

    // 6. COLLISION DAMAGE LISTENER
    chassisBody.addEventListener("collide", (e) => {
        const impact = e.contact.getImpactVelocityAlongNormal();
        if (impact > 10) {
            handleDamage(impact);
        }
    });
}

/**
 * Processes impact damage and visual feedback
 */
function handleDamage(impact) {
    vehicleStats.damage += impact * 0.1;
    console.warn(`IMPACT DETECTED: Damage at ${Math.round(vehicleStats.damage)}%`);
    
    // Flash red on damage
    chassisVisual.material.emissive.setHex(0xff0000);
    setTimeout(() => {
        chassisVisual.material.emissive.setHex(0x000000);
    }, 100);
}

/**
 * Main per-frame update loop for vehicle systems
 */
export function updateVehicle(inputs) {
    const dt = 1/120;
    const speed = chassisBody.velocity.length();
    vehicleStats.speed = Math.round(speed * 3.6);

    // 1. ENGINE & NITRO LOGIC
    let currentForce = 0;
    vehicleStats.isNitroActive = false;

    if (inputs.forward) {
        currentForce = CONFIG.PHYSICS.engineForce;
        
        // Nitro Boost
        if (inputs.shift && vehicleStats.nitroLevel > 0) {
            currentForce *= CONFIG.PHYSICS.nitroMultiplier;
            vehicleStats.nitroLevel -= 0.5;
            vehicleStats.isNitroActive = true;
            nitroLight.intensity = 20;
        } else {
            nitroLight.intensity = 0;
            if (vehicleStats.nitroLevel < 100) vehicleStats.nitroLevel += 0.1;
        }

        // Apply force to rear wheels (indices 2 and 3)
        vehicle.applyEngineForce(-currentForce, 2);
        vehicle.applyEngineForce(-currentForce, 3);
    } else if (inputs.reverse) {
        vehicle.applyEngineForce(CONFIG.PHYSICS.engineForce / 2, 2);
        vehicle.applyEngineForce(CONFIG.PHYSICS.engineForce / 2, 3);
    } else {
        vehicle.applyEngineForce(0, 0);
        vehicle.applyEngineForce(0, 1);
        vehicle.applyEngineForce(0, 2);
        vehicle.applyEngineForce(0, 3);
    }

    // 2. STEERING LOGIC
    const steerVal = inputs.left ? CONFIG.PHYSICS.maxSteer : inputs.right ? -CONFIG.PHYSICS.maxSteer : 0;
    vehicle.setSteeringValue(steerVal, 0);
    vehicle.setSteeringValue(steerVal, 1);

    // 3. BRAKING & DRIFTING
    if (inputs.brake) {
        vehicle.setBrake(CONFIG.PHYSICS.brakeForce, 0);
        vehicle.setBrake(CONFIG.PHYSICS.brakeForce, 1);
        vehicle.setBrake(CONFIG.PHYSICS.brakeForce, 2);
        vehicle.setBrake(CONFIG.PHYSICS.brakeForce, 3);
        // Reduce rear friction for drifting
        vehicle.wheelInfos[2].frictionSlip = 1.5;
        vehicle.wheelInfos[3].frictionSlip = 1.5;
    } else {
        vehicle.setBrake(0, 0);
        vehicle.setBrake(0, 1);
        vehicle.setBrake(0, 2);
        vehicle.setBrake(0, 3);
        vehicle.wheelInfos[2].frictionSlip = CONFIG.WHEEL.friction;
        vehicle.wheelInfos[3].frictionSlip = CONFIG.WHEEL.friction;
    }

    // 4. AERODYNAMIC DOWNFORCE
    // Pushes the car down more as it goes faster to prevent flying
    const downforce = new CANNON.Vec3(0, -speed * CONFIG.PHYSICS.downforceScale, 0);
    const worldDownforce = chassisBody.quaternion.vmult(downforce);
    chassisBody.applyForce(worldDownforce, chassisBody.position);

    // 5. SYNC VISUALS
    chassisVisual.position.copy(chassisBody.position);
    chassisVisual.quaternion.copy(chassisBody.quaternion);

    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
        vehicle.updateWheelTransform(i);
        const t = vehicle.wheelInfos[i].worldTransform;
        wheelVisuals[i].position.copy(t.position);
        wheelVisuals[i].quaternion.copy(t.quaternion);
    }

    // Dynamic Underglow color based on Nitro
    if (vehicleStats.isNitroActive) {
        underglow.color.setHex(0xff00ff);
    } else {
        underglow.color.setHex(0x00ffff);
    }
}

/**
 * Resets the vehicle if it flips over
 */
export function resetVehicle() {
    chassisBody.position.y += 2;
    const euler = new CANNON.Vec3();
    chassisBody.quaternion.toEuler(euler);
    chassisBody.quaternion.setFromEuler(0, euler.y, 0);
    chassisBody.velocity.set(0,0,0);
    chassisBody.angularVelocity.set(0,0,0);
}
