{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww38200\viewh20880\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Engine.js\
import * as THREE from 'three';\
\
export let scene, camera, renderer;\
\
export function initGraphics() \{\
    console.log("Initializing 120Hz Graphics Engine...");\
\
    scene = new THREE.Scene();\
    scene.background = new THREE.Color(0x050508);\
    // Exponential fog hides the render distance popping and saves draw calls\
    scene.fog = new THREE.FogExp2(0x050508, 0.003); \
\
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);\
    \
    renderer = new THREE.WebGLRenderer(\{ \
        antialias: false, // Turned off native AA for raw speed\
        powerPreference: "high-performance",\
        stencil: false, // Disable unused buffers to save memory bandwidth\
        depth: true\
    \});\
    \
    renderer.setSize(window.innerWidth, window.innerHeight);\
    // CRITICAL 120FPS FIX: Don't let high-DPI phones/Macs render at 3x resolution\
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); \
    \
    renderer.shadowMap.enabled = true;\
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;\
    document.body.appendChild(renderer.domElement);\
\
    // Optimized Lighting\
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);\
    scene.add(ambientLight);\
\
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);\
    sunLight.position.set(100, 200, 50);\
    sunLight.castShadow = true;\
    \
    // Tighten the shadow box to only calculate shadows near the player\
    sunLight.shadow.mapSize.width = 1024;\
    sunLight.shadow.mapSize.height = 1024;\
    sunLight.shadow.camera.near = 0.5;\
    sunLight.shadow.camera.far = 300;\
    sunLight.shadow.camera.left = -100;\
    sunLight.shadow.camera.right = 100;\
    sunLight.shadow.camera.top = 100;\
    sunLight.shadow.camera.bottom = -100;\
    scene.add(sunLight);\
\
    // Handle window resizing efficiently\
    window.addEventListener('resize', onWindowResize, false);\
\}\
\
function onWindowResize() \{\
    camera.aspect = window.innerWidth / window.innerHeight;\
    camera.updateProjectionMatrix();\
    renderer.setSize(window.innerWidth, window.innerHeight);\
\}\
\
export function renderGraphics() \{\
    renderer.render(scene, camera);\
\}}