import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export function buildWorld(scene, world) {
    const mapSize = 2000;
    const blockSize = 80; 
    const roadWidth = 20;

    // 1. Asphalt Ground
    const floorGeo = new THREE.PlaneGeometry(mapSize, mapSize);
    const floorMat = new THREE.MeshStandardMaterial({ 
        color: 0x080808, 
        roughness: 0.9, 
        metalness: 0.1 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // 2. Neon Road Lines
    const grid = new THREE.GridHelper(mapSize, mapSize / blockSize, 0x00ffcc, 0x111111);
    grid.position.y = 0.05;
    scene.add(grid);

    // 3. High-Rise Skyscrapers (Instanced)
    const bldgGeo = new THREE.BoxGeometry(1, 1, 1);
    const bldgMat = new THREE.MeshStandardMaterial({ 
        color: 0x0a0a0f, 
        metalness: 0.9, 
        roughness: 0.2 
    });

    const instancedMesh = new THREE.InstancedMesh(bldgGeo, bldgMat, 1500);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    const dummy = new THREE.Object3D();

    let count = 0;
    for (let x = -mapSize/2; x < mapSize/2; x += blockSize) {
        for (let z = -mapSize/2; z < mapSize/2; z += blockSize) {
            
            // Urban Logic: Keep roads clear for the car
            if (Math.abs(x % (blockSize * 2)) < roadWidth || Math.abs(z % (blockSize * 2)) < roadWidth) continue;
            // Clear spawn point
            if (Math.abs(x) < 50 && Math.abs(z) < 50) continue;

            const w = blockSize * 0.6;
            const d = blockSize * 0.6;
            const h = 30 + Math.random() * 120; // Varied heights

            dummy.position.set(x, h / 2, z);
            dummy.scale.set(w, h, d);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(count, dummy.matrix);

            // Physics Hitboxes
            const body = new CANNON.Body({ mass: 0 });
            body.addShape(new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2)));
            body.position.set(x, h/2, z);
            world.addBody(body);

            // 4. Randomized Building "Signage" (Glow)
            if (Math.random() > 0.8) {
                const color = Math.random() > 0.5 ? 0x00ffff : 0xff00ff;
                const light = new THREE.PointLight(color, 150, 60);
                light.position.set(x, h * 0.7, z);
                scene.add(light);
            }
            count++;
        }
    }
    scene.add(instancedMesh);

    // 5. Street Lamps (The "Runway" Effect)
    for (let i = 0; i < 60; i++) {
        const lx = (Math.random() - 0.5) * mapSize;
        const lz = (Math.random() - 0.5) * mapSize;
        const light = new THREE.PointLight(0xffaa00, 30, 40);
        light.position.set(lx, 12, lz);
        scene.add(light);
        
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 12), new THREE.MeshStandardMaterial({color:0x222222}));
        pole.position.set(lx, 6, lz);
        scene.add(pole);
    }
}
