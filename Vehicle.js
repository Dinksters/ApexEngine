import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export let vehicle;
export let chassisBody;

let chassisVisual;
let wheelVisuals = [];

const ENGINE_FORCE = 3000;
const MAX_STEER = 0.5; // Slightly more steering for better drift
const BRAKE_FORCE = 100;

export function initVehicle(scene, world, groundMaterial) {
    // 1. Chassis Physics
    const chassisShape = new CANNON.Box(new CANNON.Vec3(1.1, 0.4, 2.4));
    chassisBody = new CANNON.Body({ mass: 1500 });
    chassisBody.addShape(chassisShape);
    chassisBody.position.set(0, 5, 0);
    
    // 2. Chassis Visuals
    const carMat = new THREE.MeshStandardMaterial({ color: 0xff3366, roughness: 0.2, metalness: 0.7 });
    chassisVisual = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 4.8), carMat);
    chassisVisual.castShadow = true;
    scene.add(chassisVisual);

    // 3. Vehicle Setup
    vehicle = new CANNON.RaycastVehicle({
        chassisBody: chassisBody,
        indexRightAxis: 0, 
        indexUpAxis: 1, 
        indexForwardAxis: 2
    });

    const wheelOptions = {
        radius: 0.45,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 40,
        suspensionRestLength: 0.4,
        frictionSlip: 5,
        axleLocal: new CANNON.Vec3(-1, 0, 0),
        chassisConnectionPointLocal: new CANNON.Vec3()
    };

    // Wheel placement
    const wheelX = 1.15;
    const wheelZ = 1.6;
    const wheelY = -0.2;
    
    // Front Left, Front Right, Rear Left, Rear Right
    wheelOptions.chassisConnectionPointLocal.set(wheelX, wheelY, wheelZ);
    vehicle.addWheel(wheelOptions);
    wheelOptions.chassisConnectionPointLocal.set(-wheelX, wheelY, wheelZ);
    vehicle.addWheel(wheelOptions);
    wheelOptions.chassisConnectionPointLocal.set(wheelX, wheelY, -wheelZ);
    vehicle.addWheel(wheelOptions);
    wheelOptions.chassisConnectionPointLocal.set(-wheelX, wheelY, -wheelZ);
    vehicle.addWheel(wheelOptions);

    vehicle.addToWorld(world);

    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 24);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

    for (let i = 0; i < 4; i++) {
        const wMesh = new THREE.Mesh(wheelGeo, wheelMat);
        scene.add(wMesh);
        wheelVisuals.push(wMesh);
    }
}

export function updateVehicle(inputs) {
    // FIX: Flipped Engine Force (Negative was Forward, now Positive is Forward)
    if (inputs.forward) {
        vehicle.applyEngineForce(ENGINE_FORCE, 0); 
        vehicle.applyEngineForce(ENGINE_FORCE, 1);
        vehicle.applyEngineForce(ENGINE_FORCE, 2); 
        vehicle.applyEngineForce(ENGINE_FORCE, 3);
    } else if (inputs.reverse) {
        vehicle.applyEngineForce(-ENGINE_FORCE / 2, 0); 
        vehicle.applyEngineForce(-ENGINE_FORCE / 2, 1);
        vehicle.applyEngineForce(-ENGINE_FORCE / 2, 2); 
        vehicle.applyEngineForce(-ENGINE_FORCE / 2, 3);
    } else {
        vehicle.applyEngineForce(0, 0); 
        vehicle.applyEngineForce(0, 1);
        vehicle.applyEngineForce(0, 2); 
        vehicle.applyEngineForce(0, 3);
    }

    // FIX: Flipped Steering (Right was Left, now Left is Left)
    if (inputs.left) {
        vehicle.setSteeringValue(-MAX_STEER, 0); 
        vehicle.setSteeringValue(-MAX_STEER, 1);
    } else if (inputs.right) {
        vehicle.setSteeringValue(MAX_STEER, 0); 
        vehicle.setSteeringValue(MAX_STEER, 1);
    } else {
        vehicle.setSteeringValue(0, 0); 
        vehicle.setSteeringValue(0, 1);
    }

    // Braking & Drifting
    if (inputs.brake) {
        vehicle.setBrake(BRAKE_FORCE, 2); 
        vehicle.setBrake(BRAKE_FORCE, 3);
    } else {
        vehicle.setBrake(0, 2); 
        vehicle.setBrake(0, 3);
    }

    // Sync Graphics to Physics
    chassisVisual.position.copy(chassisBody.position);
    chassisVisual.quaternion.copy(chassisBody.quaternion);

    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
        vehicle.updateWheelTransform(i);
        const t = vehicle.wheelInfos[i].worldTransform;
        wheelVisuals[i].position.copy(t.position);
        wheelVisuals[i].quaternion.copy(t.quaternion);
    }
}
