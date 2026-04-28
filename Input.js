export const inputs = \{\
    forward: false,\
    reverse: false,\
    left: false,\
    right: false,\
    brake: false\
\};\
\
export function initInput() \{\
    console.log("Initializing Input Listener...");\
    \
    document.addEventListener('keydown', (e) => handleKey(e.key.toLowerCase(), true));\
    document.addEventListener('keyup', (e) => handleKey(e.key.toLowerCase(), false));\
\}\
\
function handleKey(key, isDown) \{\
    if (key === 'w' || key === 'arrowup') inputs.forward = isDown;\
    if (key === 's' || key === 'arrowdown') inputs.reverse = isDown;\
    if (key === 'a' || key === 'arrowleft') inputs.left = isDown;\
    if (key === 'd' || key === 'arrowright') inputs.right = isDown;\
    if (key === ' ') inputs.brake = isDown;\
\}}
