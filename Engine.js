import * as THREE from 'three';

export let scene, camera, renderer;

export function initGraphics() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205);
    // Fixed Fog: Increased near plane so things don't disappear immediately
    scene.fog = new THREE.FogExp2(0x020205, 0.002); 

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    
    renderer = new THREE.WebGLRenderer({ 
        antialias: false, // Turn off for FPS boost
        powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // Lock to 1 to stop the lag in your screenshot
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.body.appendChild(renderer.domElement);

    // Global Lights
    const hemi = new THREE.HemisphereLight(0x00ffff, 0xff00ff, 0.6);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(100, 200, 100);
    scene.add(sun);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

export function renderGraphics() {
    renderer.render(scene, camera);
}
