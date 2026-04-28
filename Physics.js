import * as CANNON from 'cannon-es';

export let world, groundMaterial;

export function initPhysics() {
    world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });
    world.broadphase = new CANNON.SAPBroadphase(world);
    
    groundMaterial = new CANNON.Material("ground");
    const carMat = new CANNON.Material("car");
    world.addContactMaterial(new CANNON.ContactMaterial(groundMaterial, carMat, { friction: 0.5, restitution: 0.1 }));

    const ground = new CANNON.Body({ mass: 0, material: groundMaterial });
    ground.addShape(new CANNON.Plane());
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);
}

export function stepPhysics(dt) { world.step(1/120, dt, 3); }
