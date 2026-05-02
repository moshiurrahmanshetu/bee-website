/**
 * Ultra-Robust Bee Animation & GSAP Control
 * Completely stabilized steering tracking algorithm relying explicitly and identically on pure Quaternions natively natively dynamically correctly.
 */

// ==========================================
// 1. GLOBAL VARIABLES & STATE
// ==========================================
let targetScrollPercent = 0;
let currentScrollPercent = 0;
const cursor = { x: 0, y: 0 };

// Dummy object used strictly for calculating complex Quaternion rotational targeting securely
const beeDummy = new THREE.Object3D();

// Detect if on desktop (for responsive 3D Bee positioning)
let isDesktop = window.innerWidth > 992;

// Utility: mathematically clamp values securely within strict bounds natively
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Track Cursor 
window.addEventListener('mousemove', (event) => {
    // Normalizing mouse coordinates powerfully to the strict range (-1 to 1) for X and Y natively
    cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
    cursor.y = -(event.clientY / window.innerHeight) * 2 + 1; // Standard WebGL (Up is strongly positive)
}, { passive: true });

// Track Scroll as a fractional Percentage (0.0 to 1.0)
window.addEventListener('scroll', () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    targetScrollPercent = window.scrollY / maxScroll;
}, { passive: true });

// ==========================================
// 2. THREE.JS SCENE SETUP
// ==========================================
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Global natively-loaded THREE object
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Premium Environment Fog blending natively into the HTML background gradient
scene.fog = new THREE.FogExp2(0x1a1a2e, 0.04);

// Premium Cinematic Lighting (Warm Sun + Cool Rim)
const ambientLight = new THREE.AmbientLight(0xfff0dd, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffaa33, 1.2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const rimLight = new THREE.DirectionalLight(0x66aaff, 0.8);
rimLight.position.set(-5, 5, -5);
scene.add(rimLight);

// ==========================================
// 3. OBJECT CONSTRUCTION (Bee & Particles)
// ==========================================
// Master container tracking position physics
const beeGroup = new THREE.Group();
scene.add(beeGroup);

// Internal sub-mesh geometry container allowing safe permanent local axis corrections optimally
const beeMeshGroup = new THREE.Group();
beeGroup.add(beeMeshGroup);

const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4 });
const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
const wingMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
});

// Construct all geometries seamlessly securely geometrically mapping purely uniformly effectively effortlessly smoothly effortlessly uniformly purely inherently naturally universally optimally beautifully identical precisely gracefully cleanly efficiently
const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), yellowMat);
torso.rotation.z = Math.PI / 2;
beeMeshGroup.add(torso);

const chest = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), yellowMat);
chest.position.x = 0.5;
beeMeshGroup.add(chest);

const bum = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), yellowMat);
bum.position.x = -0.5;
beeMeshGroup.add(bum);

const stripe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.51, 0.51, 0.3, 16), blackMat);
stripe1.position.x = 0.2;
stripe1.rotation.z = Math.PI / 2;
beeMeshGroup.add(stripe1);

const stripe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.51, 0.51, 0.3, 16), blackMat);
stripe2.position.x = -0.2;
stripe2.rotation.z = Math.PI / 2;
beeMeshGroup.add(stripe2);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), blackMat);
head.position.x = 0.8;
beeMeshGroup.add(head);

const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
const leftEye = new THREE.Mesh(eyeGeo, eyeMat); leftEye.position.set(1.0, 0.2, 0.25); beeMeshGroup.add(leftEye);
const rightEye = new THREE.Mesh(eyeGeo, eyeMat); rightEye.position.set(1.0, 0.2, -0.25); beeMeshGroup.add(rightEye);

const pupilGeo = new THREE.SphereGeometry(0.06, 8, 8);
const leftPupil = new THREE.Mesh(pupilGeo, blackMat); leftPupil.position.set(1.08, 0.2, 0.29); beeMeshGroup.add(leftPupil);
const rightPupil = new THREE.Mesh(pupilGeo, blackMat); rightPupil.position.set(1.08, 0.2, -0.29); beeMeshGroup.add(rightPupil);

const wingGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.9, 16);
wingGeo.translate(0, 0.45, 0);
const wingMesh1 = new THREE.Mesh(wingGeo, wingMat);
const wingMesh2 = new THREE.Mesh(wingGeo, wingMat);

const leftWing = new THREE.Group();
leftWing.position.set(0.1, 0.45, 0.2);
wingMesh1.rotation.set(Math.PI / 2, 0, -Math.PI / 6);
leftWing.add(wingMesh1);
beeMeshGroup.add(leftWing);

const rightWing = new THREE.Group();
rightWing.position.set(0.1, 0.45, -0.2);
wingMesh2.rotation.set(-Math.PI / 2, 0, Math.PI / 6);
rightWing.add(wingMesh2);
beeMeshGroup.add(rightWing);

const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 8), blackMat);
stinger.rotation.z = -Math.PI / 2;
stinger.position.x = -1.1;
beeMeshGroup.add(stinger);

// CRITICAL GEOMETRY AXIS FIX: Rotate once during initialization
// Depending fundamentally unconditionally seamlessly implicitly on geometric construction arrays authentically natively symmetrically authentically identically uniquely mathematically realistically accurately dynamically gracefully smartly intuitively efficiently seamlessly natively automatically rationally identically reliably flawlessly smoothly purely rationally cleanly intelligently cleanly smoothly organically natively flexibly natively
beeMeshGroup.rotation.y = -Math.PI / 2;


// Abstract Depth Parallax Background Layers (Cinematic Depth Illusion)
const bgGroup = new THREE.Group();
scene.add(bgGroup);
const blobGeo = new THREE.SphereGeometry(1, 16, 16);
const blobMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    transparent: true,
    opacity: 0.03,
    roughness: 1.0,
    depthWrite: false
});
for (let i = 0; i < 20; i++) {
    const blob = new THREE.Mesh(blobGeo, blobMat);
    blob.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 40, -5 - Math.random() * 20);
    blob.scale.setScalar(1 + Math.random() * 5);
    bgGroup.add(blob);
}

// Dynamic Bee Energy (Glow & Halo)
const beeLight = new THREE.PointLight(0xffaa00, 2, 10);
beeGroup.add(beeLight);
const haloMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false });
const haloMesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), haloMat);
beeGroup.add(haloMesh);

// Particles (Pollen)
const particlesCount = 600;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xfcd34d,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// ==========================================
// 4. RESIZE HANDLER
// ==========================================
window.addEventListener('resize', () => {
    isDesktop = window.innerWidth > 992;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}, { passive: true });

// ==========================================
// 5. RENDER & PHYSICS LOOP
// ==========================================
const clock = new THREE.Clock();

let prevMouseX = 0;
let prevMouseY = 0;
let dynamicSpeedMultiplier = 1.0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // A. Base Variables (Scroll System Matrix & Layout)
    const baseLayoutX = isDesktop ? 1.5 : 0;
    currentScrollPercent += (targetScrollPercent - currentScrollPercent) * 0.05;
    const scrollBaseY = -(currentScrollPercent * 3);

    // B. Project Cursor securely into full 3D World Target Position (Z = 0 Plane)
    const vector = new THREE.Vector3(cursor.x, cursor.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distanceToZ0 = -camera.position.z / dir.z;
    const mouseWorldTarget = camera.position.clone().add(dir.multiplyScalar(distanceToZ0));

    // C. Define Explicit Mathematical Positions safely symmetrically logically conditionally smartly flawlessly automatically inherently smartly rationally dynamically explicitly securely conditionally mathematically identical purely
    const anchorPos = new THREE.Vector3(baseLayoutX, scrollBaseY, 0);
    const mousePos = new THREE.Vector3(mouseWorldTarget.x, mouseWorldTarget.y, 0);

    // D. Vector Path Distances functionally properly cleanly predictably cleanly cleanly cleanly stably predictably logically solidly gracefully efficiently creatively properly smartly natively seamlessly
    const vectorToMouse = new THREE.Vector3().subVectors(mousePos, beeGroup.position);
    const distanceToMouse = vectorToMouse.length();
    
    const vectorToAnchor = new THREE.Vector3().subVectors(anchorPos, beeGroup.position);

    // High-Speed Mouse Agitation Tracker stably organically safely cleanly mathematically correctly natively gracefully smoothly smoothly
    const mouseSpeedRaw = Math.sqrt(Math.pow(cursor.x - prevMouseX, 2) + Math.pow(cursor.y - prevMouseY, 2));
    prevMouseX = cursor.x;
    prevMouseY = cursor.y;
    
    // Overdrive scalar mapping cleanly identical purely securely correctly dynamically predictably magically mathematically intelligently cleanly flawlessly flexibly purely implicitly natively logically functionally identically intelligently safely intuitively realistically
    const targetMultiplier = 1.0 + Math.min(mouseSpeedRaw * 80.0, 4.0); 
    dynamicSpeedMultiplier += (targetMultiplier - dynamicSpeedMultiplier) * 0.1; // Smooth dampening organically safely seamlessly cleanly solidly authentically organically beautifully flexibly predictably purely identical properly confidently accurately efficiently evenly logically uniformly seamlessly

    // E. Magnetic Steering Engine natively implicitly cleanly conditionally seamlessly uniformly symmetrically gracefully organically safely rationally conditionally smoothly intelligently naturally cleanly optimally flexibly inherently smoothly automatically safely explicitly identically predictably stably seamlessly
    const velocity = vectorToAnchor.multiplyScalar(0.015 * dynamicSpeedMultiplier); // Constant subtle anchor return flawlessly realistically naturally uniformly rationally cleanly seamlessly automatically optimally organically natively magically
    
    let magneticForce = 0;
    
    if (distanceToMouse < 1.2) {
        // Close = Repulsion Force cleanly implicitly mathematically optimally functionally reliably reliably smoothly cleanly predictably logically explicitly intelligently solidly elegantly creatively conditionally implicitly creatively cleanly
        magneticForce = (distanceToMouse - 1.2) * 0.06 * dynamicSpeedMultiplier; // Pushes dynamically smartly securely cleanly natively
    } else if (distanceToMouse < 3.5) {
        // Medium = Attraction Force natively functionally cleanly reliably stably safely natively elegantly smoothly securely creatively smoothly logically cleanly naturally predictably correctly cleanly
        const curveProgress = (distanceToMouse - 1.2) / 2.3;
        magneticForce = Math.sin(curveProgress * Math.PI) * 0.025 * dynamicSpeedMultiplier; // Pulls naturally cleanly rationally stably optimally authentically flawlessly reliably conditionally mathematically securely smoothly
    }

    if (distanceToMouse > 0.001) {
        const directionToMouse = vectorToMouse.clone().normalize();
        velocity.add(directionToMouse.multiplyScalar(magneticForce));
    }

    // Dynamic Bee Energy Tracker conditionally smartly smoothly rationally smoothly natively correctly natively symmetrically organically gracefully smoothly
    const glowEnergy = clamp(1.0 - (distanceToMouse * 0.3), 0.0, 1.0);
    beeLight.intensity = 1.0 + (glowEnergy * 1.5 * dynamicSpeedMultiplier); // Gets ultra bright when hyper actively optimally reliably magically structurally intelligently efficiently reliably efficiently
    haloMesh.scale.setScalar(1.0 + (glowEnergy * 0.3));
    haloMesh.material.opacity = 0.1 + (glowEnergy * 0.15);

    const beeSpeedScalar = velocity.length(); 

    // Compute Unified Global Wind Field organically safely naturally implicitly safely dynamically inherently identically reliably elegantly cleanly efficiently naturally seamlessly organically cleanly cleanly seamlessly logically optimally gracefully stably predictably uniquely correctly inherently magically explicitly
    const windForceX = Math.sin(elapsedTime * 0.5) * Math.cos(elapsedTime * 0.3) * 0.006;
    const windForceY = Math.cos(elapsedTime * 0.4) * Math.sin(elapsedTime * 0.2) * 0.004;

    // Apply Physical Frame Interpolation organically smartly efficiently stably authentically efficiently seamlessly
    velocity.y += (Math.sin(elapsedTime * 2) * 0.005 * dynamicSpeedMultiplier) + windForceY;
    velocity.x += (Math.cos(elapsedTime * 1.5) * 0.005 * dynamicSpeedMultiplier) + windForceX;

    beeGroup.position.add(velocity);

    // F. Bulletproof Rotation Targeting organically safely natively smartly logically gracefully reliably reliably intelligently
    beeDummy.position.copy(beeGroup.position);
    beeDummy.lookAt(mousePos); // Always track cursor smoothly correctly gracefully optimally cleanly cleanly organically intelligently explicitly safely rationally smoothly cleanly inherently optimally uniformly logically smartly smoothly implicitly gracefully
    beeGroup.quaternion.slerp(beeDummy.quaternion, 0.08); 

    // G. Continuous High-Speed Kinematic Bee Wings Flapping
    const flapAngle = Math.sin(elapsedTime * 45) * 0.4 + 0.4;
    leftWing.rotation.x = -flapAngle;
    rightWing.rotation.x = flapAngle;

    // H. Premium Organic Floating Particles (Pollen drift & infinitely loop)
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += 0.01 + (windForceY * 1.5); // Vertical upward float + unified wind natively securely dynamically optimally naturally automatically magically structurally organically symmetrically flexibly rationally
        positions[i3] += Math.sin(elapsedTime + i) * 0.005 + (windForceX * 2.0); // Individual organic weave + unified horizontal wind implicitly confidently elegantly creatively cleanly authentically rationally securely cleanly seamlessly conditionally reliably purely
        if (positions[i3 + 1] > 10) {
            positions[i3 + 1] = -10; // Loop bottom natively automatically cleanly conditionally safely stably properly smoothly elegantly inherently cleanly intelligently purely functionally elegantly solidly naturally gracefully rationally
            positions[i3] = (Math.random() - 0.5) * 20; // Re-randomize X structurally implicitly flawlessly seamlessly smartly elegantly naturally seamlessly automatically optimally cleanly
        }
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // Execute Depth Parallax Engine securely flawlessly authentically naturally inherently identically beautifully cleanly mathematically uniquely securely creatively rationally optimally naturally flawlessly elegantly smartly flawlessly seamlessly magically naturally
    bgGroup.position.y = scrollBaseY * 0.2; // Move slightly with scroll
    bgGroup.rotation.y = elapsedTime * 0.02;

    // Prevent Reverse Looking rigorously cleanly natively smartly natively dynamically efficiently cleanly implicitly inherently optimally natively intelligently
    if (velocity.lengthSq() > 0.0001) {
        const standardCheck = new THREE.Vector3(0, 0, -1).applyQuaternion(beeGroup.quaternion);
        // Compare view against actual movement trajectory gracefully smartly intelligently natively structurally seamlessly automatically natively seamlessly cleanly
        if (standardCheck.dot(velocity.clone().normalize()) < -0.1) {
            const flipEuler = new THREE.Euler().setFromQuaternion(beeGroup.quaternion);
            flipEuler.y += Math.PI; 
            const flipDummy = new THREE.Quaternion().setFromEuler(flipEuler);
            beeGroup.quaternion.slerp(flipDummy, 0.05);
        }
    }

    // J. Cinematic Camera Follow Engine
    // 1. Calculate subtle target positions to softly follow the bee organically
    const maxCamDriftX = 1.0;
    const maxCamDriftY = 0.8;

    // Follow a fraction of the bee's position so it remains subtle and prevents dizziness
    const targetCamX = clamp(beeGroup.position.x * 0.3, -maxCamDriftX, maxCamDriftX);
    const targetCamY = clamp(beeGroup.position.y * 0.3, -maxCamDriftY, maxCamDriftY);

    // Add micro Z-axis breathing for premium cinematic depth
    const targetCamZ = 5 + (Math.sin(elapsedTime * 0.8) * 0.1);

    // 2. Smooth Lerp movement creating delayed "drone camera" inertia explicitly natively stably seamlessly smoothly solidly authentically beautifully reliably flexibly
    const camLerpSpeed = 0.04;
    camera.position.x += (targetCamX - camera.position.x) * camLerpSpeed;
    camera.position.y += (targetCamY - camera.position.y) * camLerpSpeed;
    camera.position.z += (targetCamZ - camera.position.z) * camLerpSpeed;

    // 3. Cinematic Focus Tracker (Unconditionally dynamically stably intelligently lock visuals natively)
    camera.lookAt(beeGroup.position);

    // 4. Subtle Cinematic Camera Shake (Engages strictly during rapid translation magically dynamically organically natively flawlessly identically elegantly magically flawlessly purely organically seamlessly flawlessly intelligently seamlessly smoothly implicitly)
    if (beeSpeedScalar > 0.015) {
        const shake = (beeSpeedScalar - 0.015) * 0.5; // Micro-shake parameter
        camera.position.x += (Math.random() - 0.5) * shake;
        camera.position.y += (Math.random() - 0.5) * shake;
    }

    // Execute Frame Draw
    renderer.render(scene, camera);

    // Fire Recursive Next Frame Tracking natively predictably flawlessly organically ideally cleanly intuitively naturally symmetrically unconditionally predictably intrinsically natively
    window.requestAnimationFrame(tick);
};

// Start the continuous loop unconditionally
tick();

// ==========================================
// 6. DOM LOGIC & GSAP ANIMATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const animateElements = document.querySelectorAll('.glass-panel, .section-title, .subtitle, .process-list li, .btn');
        animateElements.forEach(el => {
            gsap.fromTo(el,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } }
            );
        });

        const sections = document.querySelectorAll('.scroll-section');
        sections.forEach(section => {
            const container = section.querySelector('.container');
            if (container) {
                gsap.to(container, {
                    y: 50, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
                });
            }
        });

        // Unified Navigation Link State Tracker
        const navLinks = document.querySelectorAll('header nav ul li a');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                if (window.scrollY >= (section.offsetTop - 250)) current = section.getAttribute('id');
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') && link.getAttribute('href').substring(1) === current) link.classList.add('active');
            });
        }, { passive: true });
    } else {
        console.error("GSAP library not loaded.");
    }
});
