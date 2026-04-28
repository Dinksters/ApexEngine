import * as THREE from 'three';

export let scene, camera, renderer;

export function initGraphics() {
    console.log("Graphics Engine: Initializing 120Hz Render Pipeline...");

    // 1. Scene Setup & Atmosphere
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205); // Deep midnight blue
    scene.fog = new THREE.FogExp2(0x020205, 0.005); // Atmospheric haze

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        2000
    );

    // 3. Renderer Setup (Optimized for 120 FPS)
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Enable Shadows and Tone Mapping for "Pro" look
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;

    document.body.appendChild(renderer.domElement);

    // 4. Lighting Engine
    // Ambient Light: Soft overall visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
    scene.add(ambientLight);

    // Neon Hemispheric Light: Cyan sky color, Purple ground bounce
    const hemiLight = new THREE.HemisphereLight(0x00ffff, 0xff00ff, 0.6);
    scene.add(hemiLight);

    // Sun/Key Light: Creates shadows
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    
    // Shadow Resolution
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    
    scene.add(sunLight);

    // 5. Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}

export function renderGraphics() {
    renderer.render(scene, camera);
}
