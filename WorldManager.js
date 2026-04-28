import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function buildWorld(scene, world) {
    const buildingCount = 1000;
    const mapSize = 1000;

    const bldgGeo = new THREE.BoxGeometry(1, 1, 1);
    const bldgMat = new THREE.MeshStandardMaterial({ 
        color: 0x111122, 
        roughness: 0.1, 
        metalness: 0.8,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.1 
    });

    const instancedMesh = new THREE.InstancedMesh(bldgGeo, bldgMat, buildingCount);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();

    let builtCount = 0;

    for (let i = 0; i < buildingCount; i++) {
        const x = (Math.random() - 0.5) * mapSize;
        const z = (Math.random() - 0.5) * mapSize;

        if (Math.abs(x) < 30 && Math.abs(z) < 30) continue;

        const width = 5 + Math.random() * 15;
        const depth = 5 + Math.random() * 15;
        const height = 10 + Math.random() * 50;

        dummy.position.set(x, height / 2, z);
        dummy.scale.set(width, height, depth);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(builtCount, dummy.matrix);

        const bldgBody = new CANNON.Body({ mass: 0 });
        const scaledShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        bldgBody.addShape(scaledShape);
        bldgBody.position.set(x, height / 2, z);
        world.addBody(bldgBody);

        builtCount++;
    }

    instancedMesh.count = builtCount;
    scene.add(instancedMesh);

    const grid = new THREE.GridHelper(mapSize, 100, 0x00ffcc, 0x222222);
    grid.position.y = 0.01;
    scene.add(grid);
}
