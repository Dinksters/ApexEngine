// WorldManager.js\
import * as THREE from 'three';\
import * as CANNON from 'cannon-es';\
\
export function buildWorld(scene, world) \{\
    console.log("Generating Instanced City...");\
\
    const buildingCount = 1000;\
    const mapSize = 1000;\
\
    // 1. Visuals: 1 Draw Call for 1000 buildings using InstancedMesh\
    const bldgGeo = new THREE.BoxGeometry(1, 1, 1);\
    const bldgMat = new THREE.MeshStandardMaterial(\{ \
        color: 0x111122, \
        roughness: 0.1, \
        metalness: 0.8,\
        emissive: 0x00ffcc,\
        emissiveIntensity: 0.1 // Slight neon glow\
    \});\
\
    const instancedMesh = new THREE.InstancedMesh(bldgGeo, bldgMat, buildingCount);\
    instancedMesh.castShadow = true;\
    instancedMesh.receiveShadow = true;\
\
    const dummy = new THREE.Object3D();\
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)); // Base shape, scaled later\
\
    let builtCount = 0;\
\
    for (let i = 0; i < buildingCount; i++) \{\
        // Random placement\
        const x = (Math.random() - 0.5) * mapSize;\
        const z = (Math.random() - 0.5) * mapSize;\
\
        // Leave a 60x60 empty space in the center so the player doesn't spawn inside a wall\
        if (Math.abs(x) < 30 && Math.abs(z) < 30) continue;\
\
        const width = 5 + Math.random() * 15;\
        const depth = 5 + Math.random() * 15;\
        const height = 10 + Math.random() * 50;\
\
        // Set visual transform\
        dummy.position.set(x, height / 2, z);\
        dummy.scale.set(width, height, depth);\
        dummy.updateMatrix();\
        instancedMesh.setMatrixAt(builtCount, dummy.matrix);\
\
        // 2. Physics: Add static rigid bodies to Cannon-es\
        const bldgBody = new CANNON.Body(\{ mass: 0 \}); // Mass 0 means it never moves\
        // Scale the half-extents for Cannon-es box shape\
        const scaledShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));\
        bldgBody.addShape(scaledShape);\
        bldgBody.position.set(x, height / 2, z);\
        world.addBody(bldgBody);\
\
        builtCount++;\
    \}\
\
    instancedMesh.count = builtCount; // Truncate unused instances\
    scene.add(instancedMesh);\
\
    // Floor Visual Grid\
    const grid = new THREE.GridHelper(mapSize, 100, 0x00ffcc, 0x222222);\
    grid.position.y = 0.01; // Lift slightly to prevent Z-fighting\
    scene.add(grid);\
\}}
