import * as CANNON from 'cannon-es';

export let world;
export let groundMaterial;

const TIME_STEP = 1 / 120; 
const MAX_SUB_STEPS = 3;

export function initPhysics() {
    world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0)
    });

    world.broadphase = new CANNON.SAPBroadphase(world);
    world.solver.iterations = 10;
    
    groundMaterial = new CANNON.Material("ground");
    const defaultMaterial = new CANNON.Material("default");
    
    const defaultContactMaterial = new CANNON.ContactMaterial(groundMaterial, defaultMaterial, {
        friction: 0.5,
        restitution: 0.1
    });
    world.addContactMaterial(defaultContactMaterial);

    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    const groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);
}

export function stepPhysics(deltaTime) {
    world.step(TIME_STEP, deltaTime, MAX_SUB_STEPS);
}
