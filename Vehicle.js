import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export let vehicle, chassisBody;
export let vehicleStats = { speed: 0, nitroLevel: 100 }; // Keeps UI from breaking
let chassisVisual, wheelVisuals = [];

export function initVehicle(scene, world, groundMaterial) {
    // 1. Chassis
    chassisBody = new CANNON.Body({ mass: 1500 });
    chassisBody.addShape(new CANNON.Box(new CANNON.Vec3(1.1, 0.4, 2.4)));
    chassisBody.position.set(0, 5, 0); // Drop from sky
    
    chassisVisual = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 4.8), new THREE.MeshStandardMaterial({ color: 0xff0055 }));
    scene.add(chassisVisual);

    // 2. Raycast Vehicle Setup
    vehicle = new CANNON.RaycastVehicle({
        chassisBody: chassisBody,
        indexRightAxis: 0, indexUpAxis: 1, indexForwardAxis: 2
    });

    const wheelOptions = {
        radius: 0.45, directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 40, suspensionRestLength: 0.4,
        frictionSlip: 5, dampingRelaxation: 2.3, dampingCompression: 4.4,
        maxSuspensionForce: 100000, rollInfluence: 0.01, axleLocal: new CANNON.Vec3(-1, 0, 0),
        chassisConnectionPointLocal: new CANNON.Vec3()
    };

    const wX = 1.15, wZ = 1.6, wY = -0.2;
    wheelOptions.chassisConnectionPointLocal.set(wX, wY, wZ); vehicle.addWheel(wheelOptions);
    wheelOptions.chassisConnectionPointLocal.set(-wX, wY, wZ); vehicle.addWheel(wheelOptions);
    wheelOptions.chassisConnectionPointLocal.set(wX, wY, -wZ); vehicle.addWheel(wheelOptions);
    wheelOptions.chassisConnectionPointLocal.set(-wX, wY, -wZ); vehicle.addWheel(wheelOptions);

    vehicle.addToWorld(world);

    // 3. Wheel Visuals
    const wGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 24); 
    wGeo.rotateZ(Math.PI / 2);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

    for (let i = 0; i < 4; i++) {
        const wMesh = new THREE.Mesh(wGeo, wMat);
        scene.add(wMesh); 
        wheelVisuals.push(wMesh);
    }
}

export function updateVehicle(inputs) {
    const ENGINE_FORCE = inputs.shift ? 8000 : 3500;
    const MAX_STEER = 0.5;

    // Acceleration
    if (inputs.forward) {
        vehicle.applyEngineForce(ENGINE_FORCE, 0); vehicle.applyEngineForce(ENGINE_FORCE, 1);
        vehicle.applyEngineForce(ENGINE_FORCE, 2); vehicle.applyEngineForce(ENGINE_FORCE, 3);
    } else if (inputs.reverse) {
        vehicle.applyEngineForce(-ENGINE_FORCE / 2, 0); vehicle.applyEngineForce(-ENGINE_FORCE / 2, 1);
        vehicle.applyEngineForce(-ENGINE_FORCE / 2, 2); vehicle.applyEngineForce(-ENGINE_FORCE / 2, 3);
    } else {
        vehicle.applyEngineForce(0, 0); vehicle.applyEngineForce(0, 1);
        vehicle.applyEngineForce(0, 2); vehicle.applyEngineForce(0, 3);
    }

    // Steering (Left is Left, Right is Right)
    if (inputs.left) {
        vehicle.setSteeringValue(MAX_STEER, 0); vehicle.setSteeringValue(MAX_STEER, 1);
    } else if (inputs.right) {
        vehicle.setSteeringValue(-MAX_STEER, 0); vehicle.setSteeringValue(-MAX_STEER, 1);
    } else {
        vehicle.setSteeringValue(0, 0); vehicle.setSteeringValue(0, 1);
    }

    // Braking
    if (inputs.brake) {
        vehicle.setBrake(100, 2); vehicle.setBrake(100, 3);
    } else {
        vehicle.setBrake(0, 2); vehicle.setBrake(0, 3);
    }

    // Update 3D Models to match Physics
    chassisVisual.position.copy(chassisBody.position);
    chassisVisual.quaternion.copy(chassisBody.quaternion);
    for (let i = 0; i < 4; i++) {
        vehicle.updateWheelTransform(i);
        wheelVisuals[i].position.copy(vehicle.wheelInfos[i].worldTransform.position);
        wheelVisuals[i].quaternion.copy(vehicle.wheelInfos[i].worldTransform.quaternion);
    }
}
