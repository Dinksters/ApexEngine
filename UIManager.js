// UIManager.js\
export let speedElement;\
\
export function initUI() \{\
    console.log("Initializing HUD...");\
    // Grab the span element we made in index.html\
    speedElement = document.getElementById('speed');\
\}\
\
export function updateUI(chassisBody) \{\
    if (!speedElement) return;\
    \
    // chassisBody.velocity.length() gives us meters per second. \
    // Multiply by 3.6 to get KM/H\
    const velocity = chassisBody.velocity.length();\
    const kmh = Math.round(velocity * 3.6);\
    \
    speedElement.innerText = kmh;\
\}}
