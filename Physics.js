{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww38200\viewh20880\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Physics.js\
import * as CANNON from 'cannon-es';\
\
export let world;\
export let groundMaterial;\
\
// Run physics at 120 ticks per second\
const TIME_STEP = 1 / 120; \
const MAX_SUB_STEPS = 3;\
\
export function initPhysics() \{\
    console.log("Initializing SAP Physics World...");\
\
    world = new CANNON.World(\{\
        gravity: new CANNON.Vec3(0, -9.81, 0)\
    \});\
\
    // CRITICAL 120FPS FIX: Sweep and Prune Broadphase is vastly faster than Naive\
    world.broadphase = new CANNON.SAPBroadphase(world);\
    world.solver.iterations = 10; // Balance between accuracy and performance\
    \
    // Default materials\
    groundMaterial = new CANNON.Material("ground");\
    const defaultMaterial = new CANNON.Material("default");\
    \
    const defaultContactMaterial = new CANNON.ContactMaterial(groundMaterial, defaultMaterial, \{\
        friction: 0.5,\
        restitution: 0.1\
    \});\
    world.addContactMaterial(defaultContactMaterial);\
\
    // Infinite invisible physics floor\
    const groundBody = new CANNON.Body(\{ mass: 0, material: groundMaterial \});\
    const groundShape = new CANNON.Plane();\
    groundBody.addShape(groundShape);\
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);\
    world.addBody(groundBody);\
\}\
\
export function stepPhysics(deltaTime) \{\
    // Cannon-es uses internal interpolation to smoothly match the monitor's frame rate\
    world.step(TIME_STEP, deltaTime, MAX_SUB_STEPS);\
\}// Physics.js\
import * as CANNON from 'cannon-es';\
\
export let world;\
export let groundMaterial;\
\
// Run physics at 120 ticks per second\
const TIME_STEP = 1 / 120; \
const MAX_SUB_STEPS = 3;\
\
export function initPhysics() \{\
    console.log("Initializing SAP Physics World...");\
\
    world = new CANNON.World(\{\
        gravity: new CANNON.Vec3(0, -9.81, 0)\
    \});\
\
    // CRITICAL 120FPS FIX: Sweep and Prune Broadphase is vastly faster than Naive\
    world.broadphase = new CANNON.SAPBroadphase(world);\
    world.solver.iterations = 10; // Balance between accuracy and performance\
    \
    // Default materials\
    groundMaterial = new CANNON.Material("ground");\
    const defaultMaterial = new CANNON.Material("default");\
    \
    const defaultContactMaterial = new CANNON.ContactMaterial(groundMaterial, defaultMaterial, \{\
        friction: 0.5,\
        restitution: 0.1\
    \});\
    world.addContactMaterial(defaultContactMaterial);\
\
    // Infinite invisible physics floor\
    const groundBody = new CANNON.Body(\{ mass: 0, material: groundMaterial \});\
    const groundShape = new CANNON.Plane();\
    groundBody.addShape(groundShape);\
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);\
    world.addBody(groundBody);\
\}\
\
export function stepPhysics(deltaTime) \{\
    // Cannon-es uses internal interpolation to smoothly match the monitor's frame rate\
    world.step(TIME_STEP, deltaTime, MAX_SUB_STEPS);\
\}}