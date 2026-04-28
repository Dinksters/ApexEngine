// CameraRig.js\
import * as THREE from 'three';\
\
const offsetVector = new THREE.Vector3();\
const lookAtVector = new THREE.Vector3();\
\
export function updateCamera(camera, chassisBody, chassisVisual, deltaTime) \{\
    // 1. Calculate vehicle speed\
    const velocity = chassisBody.velocity.length();\
    \
    // 2. Dynamic Field of View (FOV)\
    const baseFov = 70;\
    const targetFov = baseFov + (velocity * 0.5); // Stretches out as you go faster\
    camera.fov += (targetFov - camera.fov) * 5 * deltaTime;\
    camera.updateProjectionMatrix();\
\
    // 3. Calculate target camera position (behind and above the car)\
    // We offset further back when moving fast\
    const distanceBehind = 6 + (velocity * 0.1);\
    const heightAbove = 3 + (velocity * 0.02);\
    \
    offsetVector.set(0, heightAbove, distanceBehind);\
    offsetVector.applyQuaternion(chassisVisual.quaternion);\
    offsetVector.add(chassisVisual.position);\
\
    // 4. Smoothly Lerp (Interpolate) the camera to the target position\
    // Using 10 * deltaTime ensures the smoothing is consistent across all refresh rates (60hz, 120hz, 144hz)\
    camera.position.lerp(offsetVector, 10 * deltaTime);\
\
    // 5. Look slightly ahead of the car based on velocity\
    lookAtVector.copy(chassisVisual.position);\
    lookAtVector.y += 1; // Look at the roof, not the tires\
    \
    // Create a forward vector to look into the distance\
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(chassisVisual.quaternion);\
    lookAtVector.add(forward.multiplyScalar(velocity * 0.2)); \
    \
    camera.lookAt(lookAtVector);\
\}}
