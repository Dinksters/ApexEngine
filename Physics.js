// Physics.js\
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
