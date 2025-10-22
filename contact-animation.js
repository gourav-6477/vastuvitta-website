// Wait for the document to be ready
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Setup ---
    const canvas = document.getElementById('contact-animation-bg');
    if (!canvas) return; // Stop if canvas isn't found

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true // Make canvas transparent
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // --- 2. Create the "Boxes" (Particles) ---
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    // --- NEW: Array for velocities ---
    const velocities = new Float32Array(particleCount * 3);
    
    // --- MODIFIED: Define the size of the "sphere" (it's a box) ---
    const spawnRadius = 150; 

    const svgSquare = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="#ADD8E6"/></svg>';
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('data:image/svg+xml,' + encodeURIComponent(svgSquare));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xADD8E6, // Light blue
        size: 1.5,
        map: particleTexture,
        transparent: true,
        alphaTest: 0.5,
        opacity: 0.7
    });

    // --- MODIFIED: Create particle positions *all around* the center ---
    for (let i = 0; i < particleCount; i++) {
        // Spread particles randomly inside the spawnRadius
        positions[i * 3]     = (Math.random() - 0.5) * 2 * spawnRadius; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * spawnRadius; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * spawnRadius; // z
        
        // --- NEW: Give each particle a random starting velocity (direction) ---
        const speed = 0.1;
        velocities[i * 3]     = (Math.random() - 0.5) * speed;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);

    // --- MODIFIED: Camera is at the center ---
    camera.position.z = 0;

    // --- 3. Animation Loop (MODIFIED) ---
    function animate() {
        requestAnimationFrame(animate);

        const positions = particlesGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            
            // --- NEW: Apply the random velocity to each particle ---
            positions[i * 3]     += velocities[i * 3];
            positions[i * 3 + 1] += velocities[i * 3 + 1];
            positions[i * 3 + 2] += velocities[i * 3 + 2];

            // --- NEW: Boundary Check ---
            // If a particle goes outside the box, wrap it around to the other side.
            if (positions[i * 3] > spawnRadius || positions[i * 3] < -spawnRadius) {
                velocities[i * 3] *= -1; // Invert velocity (bounce)
            }
            if (positions[i * 3 + 1] > spawnRadius || positions[i * 3 + 1] < -spawnRadius) {
                velocities[i * 3 + 1] *= -1; // Invert velocity (bounce)
            }
            if (positions[i * 3 + 2] > spawnRadius || positions[i * 3 + 2] < -spawnRadius) {
                velocities[i * 3 + 2] *= -1; // Invert velocity (bounce)
            }
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        // --- NEW: Add a slow rotation to the whole scene ---
        scene.rotation.y += 0.0002;
        scene.rotation.x += 0.0001;

        renderer.render(scene, camera);
    }

    // --- 4. Handle Resize ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start the animation
    animate();
});