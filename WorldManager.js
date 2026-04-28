import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function buildWorld(scene, world) {
    const mapSize = 2000;
    
    // VISIBLE GROUND (Essential for perspective)
    const floorGeo = new THREE.PlaneGeometry(mapSize, mapSize);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // NEON GRID
    const grid = new THREE.GridHelper(mapSize, 40, 0x00ffcc, 0x222222);
    grid.position.y = 0.1;
    scene.add(grid);

    // OPTIMIZED BUILDINGS
    const bldgGeo = new THREE.BoxGeometry(1, 1, 1);
    const bldgMat = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 0.5 });
    const mesh = new THREE.InstancedMesh(bldgGeo, bldgMat, 400); // Reduced count for FPS
    const dummy = new THREE.Object3D();

    for (let i = 0; i < 400; i++) {
        const x = (Math.random() - 0.5) * mapSize;
        const z = (Math.random() - 0.5) * mapSize;
        if (Math.abs(x) < 50 && Math.abs(z) < 50) continue;

        const w = 10 + Math.random() * 20;
        const h = 20 + Math.random() * 100;
        const d = 10 + Math.random() * 20;

        dummy.position.set(x, h/2, z);
        dummy.scale.set(w, h, d);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        // Static Physics
        const body = new CANNON.Body({ mass: 0 });
        body.addShape(new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2)));
        body.position.set(x, h/2, z);
        world.addBody(body);
    }
    scene.add(mesh);
}
