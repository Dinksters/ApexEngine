import * as THREE from 'three';

const offsetVector = new THREE.Vector3();
const lookAtVector = new THREE.Vector3();

export function updateCamera(camera, chassisBody, chassisVisual, deltaTime) {
    const velocity = chassisBody.velocity.length();
    
    // Dynamic FOV for speed sensation
    const baseFov = 70;
    const targetFov = baseFov + (velocity * 0.5);
    camera.fov += (targetFov - camera.fov) * 5 * deltaTime;
    camera.updateProjectionMatrix();

    // Position camera behind and above
    const distanceBehind = 6 + (velocity * 0.1);
    const heightAbove = 3 + (velocity * 0.02);
    
    offsetVector.set(0, heightAbove, distanceBehind);
    offsetVector.applyQuaternion(chassisVisual.quaternion);
    offsetVector.add(chassisVisual.position);

    // Smooth movement (Lerp)
    camera.position.lerp(offsetVector, 10 * deltaTime);

    // Look at target with forward anticipation
    lookAtVector.copy(chassisVisual.position);
    lookAtVector.y += 1;
    
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(chassisVisual.quaternion);
    lookAtVector.add(forward.multiplyScalar(velocity * 0.2)); 
    
    camera.lookAt(lookAtVector);
}
