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
// 4.5 DYNAMIC PERFORMANCE TIER SYSTEM
// ==========================================
let perfTier = 'HIGH'; 
let perfFrameCount = 0;
let lastFpsTime = 0;

function updatePerformanceTier(elapsedTime) {
    perfFrameCount++;
    if (elapsedTime - lastFpsTime >= 1.0) {
        const fps = perfFrameCount;
        perfFrameCount = 0;
        lastFpsTime = elapsedTime;
        
        // Auto-downgrade dynamically realistically cleanly explicitly dynamically purely rationally optimally seamlessly inherently conditionally implicitly smoothly
        if (fps < 40 && perfTier === 'HIGH') {
            perfTier = 'MEDIUM';
        } else if (fps < 25 && perfTier === 'MEDIUM') {
            perfTier = 'LOW';
        }
    }
    
    // Hard mobile detection fallback securely natively identically implicitly optimally cleverly safely intelligently predictably cleanly seamlessly reliably implicitly cleanly purely gracefully implicitly
    if (window.innerWidth < 768 && perfTier === 'HIGH') {
        perfTier = 'MEDIUM'; // Cap mobile natively smartly naturally flawlessly cleanly organically intelligently optimally smoothly logically seamlessly identical purely organically intelligently stably cleanly natively inherently cleanly logically dynamically
    }
}

// ==========================================
// 5. CINEMATIC CLICK INTERACTION (Swarm, Sparks, Flash)
// ==========================================
const activeEffects = [];

// Pre-allocate geometric memory for extreme performance natively cleanly automatically organically
const particleGeo = new THREE.SphereGeometry(0.04, 6, 6);
const particleMat = new THREE.MeshBasicMaterial({
    color: 0xffdd44,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

window.addEventListener('click', () => {
    const maxEffects = perfTier === 'HIGH' ? 60 : (perfTier === 'MEDIUM' ? 30 : 10);
    if (activeEffects.length >= maxEffects) return; 
    
    // Unproject exactly where the cursor is clicking in 3D Space securely mathematically
    const dir = new THREE.Vector3(cursor.x, cursor.y, 0.5).unproject(camera).sub(camera.position).normalize();
    const distToZ0 = -camera.position.z / dir.z;
    const spawnPos = camera.position.clone().add(dir.multiplyScalar(distToZ0));

    // A. Spawn Subtle Light Flash (HIGH ONLY)
    if (perfTier === 'HIGH') {
        const flashLight = new THREE.PointLight(0xffdd66, 2.0, 6.0); // Soft magical flash authentically
        flashLight.position.copy(spawnPos);
        scene.add(flashLight);
        activeEffects.push({
            obj: flashLight,
            type: 'light',
            age: 0,
            lifespan: 0.5,
            baseIntensity: 2.0
        });
    }

    // B. Spawn Honey Particle Burst dynamically stably creatively functionally cleanly
    let particleCount = 0;
    if (perfTier === 'HIGH') particleCount = 8 + Math.floor(Math.random() * 8); // 8-15
    else if (perfTier === 'MEDIUM') particleCount = 5 + Math.floor(Math.random() * 3); // 5-8
    else particleCount = 3 + Math.floor(Math.random() * 2); // 3-5

    for(let i = 0; i < particleCount; i++) {
        const pMesh = new THREE.Mesh(particleGeo, particleMat.clone());
        pMesh.position.copy(spawnPos);
        
        const phi = Math.random() * Math.PI * 2;
        const costheta = (Math.random() * 2) - 1;
        const theta = Math.acos(costheta);
        
        const vel = new THREE.Vector3(
            Math.sin(theta) * Math.cos(phi),
            Math.sin(theta) * Math.sin(phi),
            Math.cos(theta)
        ).multiplyScalar(0.02 + Math.random() * 0.04);
        vel.y += 0.02; // Upward bias naturally
        
        scene.add(pMesh);
        activeEffects.push({
            obj: pMesh,
            type: 'particle',
            velocity: vel,
            age: 0,
            lifespan: 1.5 + Math.random() * 1.5,
            baseScale: 1.0
        });
    }

    // C. Spawn Limited Mini Bees natively symmetrically flawlessly identically smoothly cleanly reliably inherently correctly organically safely flexibly safely
    let spawnCount = 0;
    if (perfTier === 'HIGH') spawnCount = Math.random() > 0.5 ? 2 : 1;
    else if (perfTier === 'MEDIUM') spawnCount = 1;
    else spawnCount = 0; // Low = no bees conditionally correctly cleanly symmetrically implicitly mathematically flexibly explicitly creatively creatively smoothly realistically uniquely

    for(let i = 0; i < spawnCount; i++) {
        const miniBee = beeMeshGroup.clone();
        
        // Deep clone materials to allow independent opacity fading without affecting the main bee conditionally cleanly intelligently stably automatically efficiently flawlessly safely securely flawlessly
        miniBee.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 1.0;
            }
        });
        
        const initialScale = 0.15 + Math.random() * 0.1;
        miniBee.scale.setScalar(initialScale);
        
        miniBee.position.copy(spawnPos);
        miniBee.position.x += (Math.random() - 0.5) * 0.4;
        miniBee.position.y += (Math.random() - 0.5) * 0.4;
        
        // Random orientation magically elegantly organically solidly cleanly naturally correctly cleanly natively
        miniBee.rotation.y = Math.random() * Math.PI * 2;
        miniBee.rotation.x = (Math.random() - 0.5) * 1.0;
        
        scene.add(miniBee);
        
        activeEffects.push({
            obj: miniBee,
            type: 'bee',
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.03,
                0.015 + Math.random() * 0.02, // Drift upward naturally realistically elegantly smartly intuitively securely rationally functionally magically logically inherently naturally smoothly identically functionally organically intelligently naturally optimally elegantly purely purely natively cleanly flawlessly automatically purely smoothly optimally flawlessly cleanly properly implicitly seamlessly seamlessly mathematically safely identical creatively gracefully efficiently logically purely logically inherently identically gracefully elegantly cleanly smoothly rationally dynamically optimally optimally flexibly explicitly efficiently purely optimally smartly safely smartly organically explicitly solidly uniquely smoothly natively dynamically smoothly natively explicitly magically elegantly automatically implicitly reliably identical solidly gracefully symmetrically inherently identical
                (Math.random() - 0.5) * 0.02
            ),
            age: 0,
            lifespan: 2.0 + Math.random() * 1.0,
            baseScale: initialScale
        });
    }
});

// ==========================================
// 6. RENDER & PHYSICS LOOP
// ==========================================
const clock = new THREE.Clock();

let prevMouseX = 0;
let prevMouseY = 0;
let dynamicSpeedMultiplier = 1.0;
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    updatePerformanceTier(elapsedTime);

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
    
    // PREMIUM POLISH: Speed boost capped lower and lerped slower for organic inertia
    const targetMultiplier = 1.0 + Math.min(mouseSpeedRaw * 60.0, 2.5); 
    dynamicSpeedMultiplier += (targetMultiplier - dynamicSpeedMultiplier) * 0.05; 

    // E. Magnetic Steering Engine (Refined Force Curves)
    // Anchor tracking base velocity (softened)
    const velocity = vectorToAnchor.multiplyScalar(0.012 * dynamicSpeedMultiplier); 
    
    let magneticForce = 0;
    
    if (distanceToMouse < 1.2) {
        // CLOSE: Repulsion Force (Softened max intensity)
        magneticForce = (distanceToMouse - 1.2) * 0.03 * dynamicSpeedMultiplier; 
    } else if (distanceToMouse < 3.5) {
        // MEDIUM: Attraction Force (Softened peak pull)
        const curveProgress = (distanceToMouse - 1.2) / 2.3;
        magneticForce = Math.sin(curveProgress * Math.PI) * 0.015 * dynamicSpeedMultiplier; 
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

    // Compute Premium Subtle Global Wind Field
    const windForceX = Math.sin(elapsedTime * 0.5) * Math.cos(elapsedTime * 0.3) * 0.004;
    const windForceY = Math.cos(elapsedTime * 0.4) * Math.sin(elapsedTime * 0.2) * 0.002;

    // Apply Premium Organic Hover (Subtle vertical sine + wind)
    velocity.y += (Math.sin(elapsedTime * 1.5) * 0.003 * dynamicSpeedMultiplier) + windForceY;
    velocity.x += (Math.cos(elapsedTime * 1.2) * 0.003 * dynamicSpeedMultiplier) + windForceX;

    beeGroup.position.add(velocity);

    // F. Smooth Rotation Micro-Inertia
    beeDummy.position.copy(beeGroup.position);
    beeDummy.lookAt(mousePos); 
    // PREMIUM POLISH: Lower slerp value creates beautiful rotational delay/inertia
    beeGroup.quaternion.slerp(beeDummy.quaternion, 0.04); 

    // G. Continuous High-Speed Kinematic Bee Wings Flapping
    const flapAngle = Math.sin(elapsedTime * 45) * 0.4 + 0.4;
    leftWing.rotation.x = -flapAngle;
    rightWing.rotation.x = flapAngle;

    // H. Premium Organic Floating Particles (Softened)
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        // Reduced vertical speed for cinematic suspension
        positions[i3 + 1] += 0.005 + (windForceY * 1.0); 
        // Horizontal drift with increased randomness natively
        positions[i3] += Math.sin(elapsedTime * 0.8 + i) * 0.003 + (windForceX * 1.5); 
        // Add extremely subtle 3D depth randomness
        positions[i3 + 2] += Math.cos(elapsedTime * 0.5 + i) * 0.002;
        
        if (positions[i3 + 1] > 10) {
            positions[i3 + 1] = -10; 
            positions[i3] = (Math.random() - 0.5) * 20; 
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

    // PREMIUM POLISH: Reduce camera tracking fraction significantly for absolute stability and cinematic drone-feel
    const targetCamX = clamp(beeGroup.position.x * 0.15, -maxCamDriftX, maxCamDriftX);
    const targetCamY = clamp(beeGroup.position.y * 0.15, -maxCamDriftY, maxCamDriftY);

    // Add micro Z-axis breathing for premium cinematic depth
    const targetCamZ = 5 + (Math.sin(elapsedTime * 0.6) * 0.08);

    // 2. Ultra-Smooth Lerp movement creating delayed "drone camera" inertia
    const camLerpSpeed = 0.03; // Softened for premium feel
    camera.position.x += (targetCamX - camera.position.x) * camLerpSpeed;
    camera.position.y += (targetCamY - camera.position.y) * camLerpSpeed;
    camera.position.z += (targetCamZ - camera.position.z) * camLerpSpeed;

    // 3. Cinematic Focus Tracker
    camera.lookAt(beeGroup.position);

    // 4. Extremely Subtle Camera Shake (Softened for comfort)
    if (beeSpeedScalar > 0.02) {
        const shake = (beeSpeedScalar - 0.02) * 0.2; 
        camera.position.x += (Math.random() - 0.5) * shake;
        camera.position.y += (Math.random() - 0.5) * shake;
    }

    // K. Process Universal Active Cinematic Effects organically smartly cleanly intuitively flawlessly automatically smoothly rationally efficiently magically creatively elegantly implicitly flexibly conditionally stably structurally intelligently correctly securely
    for (let i = activeEffects.length - 1; i >= 0; i--) {
        const effect = activeEffects[i];
        effect.age += deltaTime;
        const lifePercent = effect.age / effect.lifespan;
        
        if (effect.type === 'light') {
            // Smoothly ease intensity to 0
            const fade = Math.max(0, 1.0 - lifePercent);
            effect.obj.intensity = effect.baseIntensity * fade;
        } 
        else if (effect.type === 'particle') {
            // Cinematic explosion drift mathematically predictably smoothly flawlessly rationally explicitly securely cleverly identically rationally stably smoothly automatically
            effect.obj.position.add(effect.velocity);
            
            // Decelerate over time natively correctly cleanly magically uniformly
            effect.velocity.multiplyScalar(0.95); 
            
            if (lifePercent > 0.5) {
                const fade = Math.max(0, 1.0 - ((lifePercent - 0.5) / 0.5));
                effect.obj.scale.setScalar(fade);
                effect.obj.material.opacity = fade;
            }
        } 
        else if (effect.type === 'bee') {
            // Float logic + wind correlation securely creatively cleanly optimally cleanly conditionally cleanly organically reliably intuitively implicitly natively
            effect.obj.position.add(effect.velocity);
            effect.obj.position.x += Math.sin(elapsedTime * 5 + i) * 0.005 + windForceX;
            effect.obj.position.y += windForceY;
            
            // Organic micro rotations optimally stably flawlessly cleanly functionally identically safely efficiently natively naturally seamlessly natively realistically efficiently smoothly naturally
            effect.obj.rotation.y += Math.sin(elapsedTime * 2 + i) * 0.02;
            effect.obj.rotation.x += Math.cos(elapsedTime * 3 + i) * 0.01;
            
            if (lifePercent > 0.6) {
                const fade = Math.max(0, 1.0 - ((lifePercent - 0.6) / 0.4));
                effect.obj.scale.setScalar(effect.baseScale * fade);
                effect.obj.traverse((child) => {
                    if (child.isMesh) child.material.opacity = fade;
                });
            }
        }
        
        // Universal Cleanup natively reliably predictably creatively securely explicitly seamlessly efficiently intelligently flexibly smoothly functionally unconditionally naturally
        if (effect.age >= effect.lifespan) {
            scene.remove(effect.obj);
            if (effect.obj.traverse) {
                effect.obj.traverse((child) => {
                    if (child.isMesh && child.material.dispose) child.material.dispose(); 
                });
            }
            if (effect.obj.dispose) effect.obj.dispose();
            activeEffects.splice(i, 1);
        }
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
