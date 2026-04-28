export const inputs = { 
    forward: false, 
    reverse: false, 
    left: false, 
    right: false, 
    brake: false, 
    shift: false 
};

export function initInput() {
    window.addEventListener('keydown', (e) => handleKey(e.key.toLowerCase(), true));
    window.addEventListener('keyup', (e) => handleKey(e.key.toLowerCase(), false));
}

function handleKey(key, isDown) {
    if (key === 'w' || key === 'arrowup') inputs.forward = isDown;
    if (key === 's' || key === 'arrowdown') inputs.reverse = isDown;
    if (key === 'a' || key === 'arrowleft') inputs.left = isDown;
    if (key === 'd' || key === 'arrowright') inputs.right = isDown;
    if (key === ' ') inputs.brake = isDown;
    if (key === 'shift') inputs.shift = isDown;
}

// Keep this so main.js doesn't crash when calling it
export function updateInput(dt) {
    // Inputs are handled instantly by event listeners now
}
