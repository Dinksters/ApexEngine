export let speedElement;

export function initUI() {
    console.log("Initializing Telemetry HUD...");
    // This matches the id="speed" we put in index.html
    speedElement = document.getElementById('speed');
}

export function updateUI(chassisBody) {
    if (!speedElement) return;
    
    // Convert meters per second to KM/H
    const velocity = chassisBody.velocity.length();
    const kmh = Math.round(velocity * 3.6);
    
    // Optimization: Only update the HTML if the speed actually changed
    // This saves CPU cycles for the 120FPS physics
    if (speedElement.innerText !== kmh.toString()) {
        speedElement.innerText = kmh;
    }
}
