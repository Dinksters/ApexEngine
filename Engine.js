import * as THREE from 'three';

export let scene, camera, renderer;

export function initGraphics() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205);
    scene.fog = new THREE.FogExp2(0x020205, 0.006); // Thicker fog for urban scale

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2500);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Professional Lighting Settings
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Real-world light simulation
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    document.body.appendChild(renderer.domElement);

    // Deep Purple/Cyan Ambient light
    scene.add(new THREE.HemisphereLight(0x00ffff, 0xff00ff, 0.4));

    // Starfield for the sky
    const starGeo = new THREE.BufferGeometry();
    const starCoords = [];
    for(let i=0; i<3000; i++) {
        starCoords.push((Math.random()-0.5)*2000, 200 + Math.random()*500, (Math.random()-0.5)*2000);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starCoords, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({color: 0xffffff, size: 1.2}));
    scene.add(stars);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

export function renderGraphics() {
    renderer.render(scene, camera);
}
