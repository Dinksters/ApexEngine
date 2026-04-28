import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function buildWorld(scene, world) {
    const mapSize = 1000;
    
    // 1. Buildings (Instanced)
    const bldgGeo = new THREE.BoxGeometry(1, 1, 1);
    const bldgMat = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 0.9 });
    const instancedMesh = new THREE.InstancedMesh(bldgGeo, bldgMat, 1000);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * mapSize;
        const z = (Math.random() - 0.5) * mapSize;
        if (Math.abs(x) < 40 && Math.abs(z) < 40) continue;

        const w = 5 + Math.random() * 15, h = 10 + Math.random() * 60, d = 5 + Math.random() * 15;
        dummy.position.set(x, h/2, z);
        dummy.scale.set(w, h, d);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);

        const body = new CANNON.Body({ mass: 0 });
        body.addShape(new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2)));
        body.position.set(x, h/2, z);
        world.addBody(body);
    }
    scene.add(instancedMesh);

    // 2. Neon Streetlights
    for (let i = 0; i < 50; i++) {
        const light = new THREE.PointLight(i % 2 === 0 ? 0x00ffcc : 0xff00ff, 50, 40);
        const lx = (Math.random()-0.5)*400, lz = (Math.random()-0.5)*400;
        light.position.set(lx, 5, lz);
        scene.add(light);
        
        // Visual Pole
        const pole = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 0.5), new THREE.MeshBasicMaterial({color: 0x222222}));
        pole.position.set(lx, 5, lz);
        scene.add(pole);
    }

    const grid = new THREE.GridHelper(mapSize, 100, 0x00ffcc, 0x222222);
    scene.add(grid);
}
