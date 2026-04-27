{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww38200\viewh20880\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Vehicle.js\
import * as THREE from 'three';\
import * as CANNON from 'cannon-es';\
\
export let vehicle;\
export let chassisBody;\
\
let chassisVisual;\
let wheelVisuals = [];\
\
// Tuning limits\
const ENGINE_FORCE = 3000;\
const MAX_STEER = 0.4;\
const BRAKE_FORCE = 100;\
\
export function initVehicle(scene, world, groundMaterial) \{\
    console.log("Assembling Vehicle...");\
\
    // 1. Chassis Physics\
    const chassisShape = new CANNON.Box(new CANNON.Vec3(1.1, 0.4, 2.4));\
    chassisBody = new CANNON.Body(\{ mass: 1500 \}); // 1500kg\
    chassisBody.addShape(chassisShape);\
    chassisBody.position.set(0, 5, 0); // Drop from the sky\
    \
    // 2. Chassis Visuals\
    const carMat = new THREE.MeshStandardMaterial(\{ color: 0xff3366, roughness: 0.2, metalness: 0.7 \});\
    chassisVisual = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 4.8), carMat);\
    chassisVisual.castShadow = true;\
    scene.add(chassisVisual);\
\
    // 3. Raycast Vehicle Setup\
    vehicle = new CANNON.RaycastVehicle(\{\
        chassisBody: chassisBody,\
        indexRightAxis: 0, \
        indexUpAxis: 1, \
        indexForwardAxis: 2\
    \});\
\
    // Suspension Tuning\
    const wheelOptions = \{\
        radius: 0.45,\
        directionLocal: new CANNON.Vec3(0, -1, 0),\
        suspensionStiffness: 40,\
        suspensionRestLength: 0.4,\
        frictionSlip: 5,\
        dampingRelaxation: 2.3,\
        dampingCompression: 4.4,\
        maxSuspensionForce: 100000,\
        rollInfluence: 0.01, // Low number keeps the car from flipping easily\
        axleLocal: new CANNON.Vec3(-1, 0, 0),\
        maxSuspensionTravel: 0.3,\
        customSlidingRotationalSpeed: -30,\
        useCustomSlidingRotationalSpeed: true\
    \};\
\
    // Add 4 Wheels (Front-Left, Front-Right, Back-Left, Back-Right)\
    const wheelX = 1.15, wheelZ = 1.6, wheelY = -0.1;\
    \
    wheelOptions.chassisConnectionPointLocal.set(wheelX, wheelY, wheelZ);\
    vehicle.addWheel(wheelOptions);\
    wheelOptions.chassisConnectionPointLocal.set(-wheelX, wheelY, wheelZ);\
    vehicle.addWheel(wheelOptions);\
    wheelOptions.chassisConnectionPointLocal.set(wheelX, wheelY, -wheelZ);\
    vehicle.addWheel(wheelOptions);\
    wheelOptions.chassisConnectionPointLocal.set(-wheelX, wheelY, -wheelZ);\
    vehicle.addWheel(wheelOptions);\
\
    vehicle.addToWorld(world);\
\
    // 4. Wheel Visuals\
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 24);\
    wheelGeo.rotateZ(Math.PI / 2); // Lay cylinder flat to look like a tire\
    const wheelMat = new THREE.MeshStandardMaterial(\{ color: 0x111111, roughness: 0.9 \});\
\
    for (let i = 0; i < 4; i++) \{\
        const wMesh = new THREE.Mesh(wheelGeo, wheelMat);\
        wMesh.castShadow = true;\
        scene.add(wMesh);\
        wheelVisuals.push(wMesh);\
        \
        // Add fake physics bodies for wheels to handle edge-case collisions\
        const wheelPhysMat = new CANNON.Material("wheel");\
        const wheelContactMat = new CANNON.ContactMaterial(groundMaterial, wheelPhysMat, \{ friction: 0.8, restitution: 0 \});\
        world.addContactMaterial(wheelContactMat);\
    \}\
\}\
\
export function updateVehicle(inputs) \{\
    // 1. Apply Engine & Brakes (All-Wheel Drive setup)\
    if (inputs.forward) \{\
        vehicle.applyEngineForce(-ENGINE_FORCE, 0); vehicle.applyEngineForce(-ENGINE_FORCE, 1);\
        vehicle.applyEngineForce(-ENGINE_FORCE, 2); vehicle.applyEngineForce(-ENGINE_FORCE, 3);\
    \} else if (inputs.reverse) \{\
        vehicle.applyEngineForce(ENGINE_FORCE / 2, 0); vehicle.applyEngineForce(ENGINE_FORCE / 2, 1);\
        vehicle.applyEngineForce(ENGINE_FORCE / 2, 2); vehicle.applyEngineForce(ENGINE_FORCE / 2, 3);\
    \} else \{\
        vehicle.applyEngineForce(0, 0); vehicle.applyEngineForce(0, 1);\
        vehicle.applyEngineForce(0, 2); vehicle.applyEngineForce(0, 3);\
    \}\
\
    // 2. Apply Steering (Front wheels only)\
    if (inputs.left) \{\
        vehicle.setSteeringValue(MAX_STEER, 0); vehicle.setSteeringValue(MAX_STEER, 1);\
    \} else if (inputs.right) \{\
        vehicle.setSteeringValue(-MAX_STEER, 0); vehicle.setSteeringValue(-MAX_STEER, 1);\
    \} else \{\
        vehicle.setSteeringValue(0, 0); vehicle.setSteeringValue(0, 1);\
    \}\
\
    // 3. Handbrake\
    if (inputs.brake) \{\
        vehicle.setBrake(BRAKE_FORCE, 2); vehicle.setBrake(BRAKE_FORCE, 3);\
        vehicle.wheelInfos[2].frictionSlip = 1.2; // Drift mode\
        vehicle.wheelInfos[3].frictionSlip = 1.2;\
    \} else \{\
        vehicle.setBrake(0, 2); vehicle.setBrake(0, 3);\
        vehicle.wheelInfos[2].frictionSlip = 5; // Grip mode\
        vehicle.wheelInfos[3].frictionSlip = 5;\
    \}\
\
    // 4. Sync Visuals to Physics (120Hz Fast Path)\
    chassisVisual.position.copy(chassisBody.position);\
    chassisVisual.quaternion.copy(chassisBody.quaternion);\
\
    for (let i = 0; i < vehicle.wheelInfos.length; i++) \{\
        vehicle.updateWheelTransform(i);\
        const t = vehicle.wheelInfos[i].worldTransform;\
        wheelVisuals[i].position.copy(t.position);\
        wheelVisuals[i].quaternion.copy(t.quaternion);\
    \}\
\}}