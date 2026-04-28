import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export let vehicle;
export let chassisBody;

let chassisVisual;
let wheelVisuals = [];

const ENGINE_FORCE = 3000;
const MAX_STEER = 0.4;
const BRAKE_FORCE = 100;

export function initVehicle(scene, world, groundMaterial) {
    const chassisShape = new CANNON.Box(new CANNON.Vec3(1.1, 0.4, 2.4));
    chassisBody = new CANNON.Body({ mass: 1500 });
    chassisBody.addShape(chassisShape);
    chassisBody.position.set(0, 5, 0);
    
    const carMat = new THREE.MeshStandardMaterial({ color: 0xff3366, roughness: 0.2, metalness: 0.7 });
    chassisVisual = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 4.8), carMat);
    chassisVisual.castShadow = true;
    scene.add(chassisVisual);

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
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence: 0.01,
        axleLocal: new CANNON.Vec3(-1, 0, 0),
        maxSuspensionTravel: 0.3,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true,
        chassisConnectionPointLocal: new CANNON.Vec3()
    };

    const wheelX = 1.15;
    const wheelZ = 1.6;
    const wheelY = -0.1;
    
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
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

    for (let i = 0; i < 4; i++) {
        const wMesh = new THREE.Mesh(wheelGeo, wheelMat);
        wMesh.castShadow = true;
        scene.add(wMesh);
        wheelVisuals.push(wMesh);
    }
}

export function updateVehicle(inputs) {
    if (inputs.forward) {
        vehicle.applyEngineForce(-ENGINE_FORCE, 0); vehicle.applyEngineForce(-ENGINE_FORCE, 1);
        vehicle.applyEngineForce(-ENGINE_FORCE, 2); vehicle.applyEngineForce(-ENGINE_FORCE, 3);
    } else if (inputs.reverse) {
        vehicle.applyEngineForce(ENGINE_FORCE / 2, 0); vehicle.applyEngineForce(ENGINE_FORCE / 2, 1);
        vehicle.applyEngineForce(ENGINE_FORCE / 2, 2); vehicle.applyEngineForce(ENGINE_FORCE / 2, 3);
    } else {
        vehicle.applyEngineForce(0, 0); vehicle.applyEngineForce(0, 1);
        vehicle.applyEngineForce(0, 2); vehicle.applyEngineForce(0, 3);
    }

    if (inputs.left) {
        vehicle.setSteeringValue(MAX_STEER, 0); vehicle.setSteeringValue(MAX_STEER, 1);
    } else if (inputs.right) {
        vehicle.setSteeringValue(-MAX_STEER, 0); vehicle.setSteeringValue(-MAX_STEER, 1);
    } else {
        vehicle.setSteeringValue(0, 0); vehicle.setSteeringValue(0, 1);
    }

    if (inputs.brake) {
        vehicle.setBrake(BRAKE_FORCE, 2); vehicle.setBrake(BRAKE_FORCE, 3);
        vehicle.wheelInfos[2].frictionSlip = 1.2;
        vehicle.wheelInfos[3].frictionSlip = 1.2;
    } else {
        vehicle.setBrake(0, 2); vehicle.setBrake(0, 3);
        vehicle.wheelInfos[2].frictionSlip = 5;
        vehicle.wheelInfos[3].frictionSlip = 5;
    }

    chassisVisual.position.copy(chassisBody.position);
    chassisVisual.quaternion.copy(chassisBody.quaternion);

    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
        vehicle.updateWheelTransform(i);
        const t = vehicle.wheelInfos[i].worldTransform;
        wheelVisuals[i].position.copy(t.position);
        wheelVisuals[i].quaternion.copy(t.quaternion);
    }
}
