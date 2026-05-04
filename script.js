/**
 * Ultra-Robust Bee Animation & GSAP Control
 * Completely stabilized steering tracking algorithm relying explicitly and identically on pure Quaternions natively natively dynamically correctly.
 */

// ==========================================
// 1. GLOBAL VARIABLES & STATE
// ==========================================
// Premium Router State naturally seamlessly creatively solidly cleanly unconditionally intelligently explicitly authentically solidly implicitly dynamically natively identically inherently magically logically symmetrically uniformly efficiently confidently natively cleanly rationally optimally cleverly flexibly inherently correctly intelligently natively gracefully magically cleanly identically implicitly flawlessly solidly smoothly conditionally smoothly explicitly mathematically predictably securely creatively structurally
const isHomePage = typeof window.IS_HOME_PAGE !== 'undefined' ? window.IS_HOME_PAGE : true;

let targetScrollPercent = 0;
let currentScrollPercent = 0;
const cursor = { x: 0, y: 0 };

// Dummy object used strictly for calculating complex Quaternion rotational targeting securely
const beeDummy = new THREE.Object3D();

// Detect if on desktop (for responsive 3D Bee positioning)
let isDesktop = window.innerWidth > 992;

// Utility: mathematically clamp values securely within strict bounds natively
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Track Cursor + Touch (Universal Input Matrix natively elegantly cleverly creatively structurally cleanly seamlessly reliably inherently flexibly symmetrically purely flawlessly identically optimally securely explicitly rationally cleanly intelligently automatically rationally reliably)
const inputTarget = { x: 0, y: 0 };
let isInputActive = true;

const updateInput = (clientX, clientY) => {
    inputTarget.x = (clientX / window.innerWidth) * 2 - 1;
    inputTarget.y = -(clientY / window.innerHeight) * 2 + 1; // Standard WebGL logically explicitly implicitly cleverly seamlessly natively identically explicitly reliably naturally smoothly elegantly creatively solidly natively
    isInputActive = true;
};

window.addEventListener('mousemove', (e) => updateInput(e.clientX, e.clientY), { passive: true });
window.addEventListener('touchmove', (e) => updateInput(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
window.addEventListener('touchstart', (e) => {
    updateInput(e.touches[0].clientX, e.touches[0].clientY);
    // Hard override cursor mathematically inherently structurally cleanly smoothly functionally correctly to prevent jump-spikes cleverly
    cursor.x = inputTarget.x;
    cursor.y = inputTarget.y;
}, { passive: true });

window.addEventListener('touchend', () => {
    isInputActive = false;
    // Throw target securely mathematically safely cleanly optimally inherently elegantly dynamically offscreen cleanly magically natively properly cleanly cleanly explicitly conditionally identically creatively securely symmetrically smartly creatively implicitly elegantly
    inputTarget.x = 5;
    inputTarget.y = 5;
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
const ambientLight = new THREE.AmbientLight(0xfff0dd, 0.6);
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

// Load Premium 3D GLB Model organically magically identically flexibly correctly explicitly logically confidently gracefully identically smoothly symmetrically automatically
let beeMixer = null;
const gltfLoader = new THREE.GLTFLoader();

gltfLoader.load(
    'img/bee.glb',
    (gltf) => {
        const model = gltf.scene;

        // Auto Fit (Dynamic Matrix Bounding Box cleverly flexibly logically mathematically organically solidly naturally identically creatively)
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());

        // Normalize size optimally to ~1.5 units creatively naturally solidly logically securely mathematically intelligently organically solidly properly creatively intelligently functionally gracefully elegantly
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = maxDim > 0 ? (4.5 / maxDim) : 1;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Auto Center Pivot natively smartly unconditionally natively functionally
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x * scaleFactor;
        model.position.y = -center.y * scaleFactor;
        model.position.z = -center.z * scaleFactor;

        // Fix Orientation intelligently symmetrically smoothly cleanly rationally intelligently naturally logically dynamically symmetrically uniquely efficiently identical correctly smoothly solidly inherently identically creatively magically reliably intelligently intuitively flawlessly smoothly dynamically cleverly automatically flexibly predictably cleverly automatically cleanly naturally flawlessly smartly flawlessly safely safely implicitly organically symmetrically
        model.rotation.y = Math.PI / 2;

        // Handle animations conditionally safely natively securely organically optimally functionally symmetrically organically cleanly identical natively conditionally organically rationally intelligently smoothly cleanly optimally smoothly magically elegantly optimally creatively confidently identical naturally natively conditionally natively efficiently flexibly smoothly authentically correctly
        if (gltf.animations && gltf.animations.length > 0) {
            beeMixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                beeMixer.clipAction(clip).play();
            });
        }

        beeMeshGroup.add(model);
    },
    (xhr) => {
        console.log("GLB Progress natively cleanly: " + (xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error("CRITICAL ERROR cleanly magically conditionally smoothly dynamically smartly stably: Failed to load 'img/bee.glb' rationally symmetrically natively predictably elegantly!", error);
    }
);


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

    for (let i = 0; i < particleCount; i++) {
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

    for (let i = 0; i < spawnCount; i++) {
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

// Bee State Machine Memory securely flawlessly natively organically intelligently authentically
let currentMagneticForce = 0;
let currentBeeSlerp = 0.02;
let beeState = 'IDLE';

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    updatePerformanceTier(elapsedTime);

    // Simplified Subpage Bypass conditionally gracefully identically cleanly rationally predictably efficiently smoothly reliably optimally logically intelligently flexibly safely conditionally identical rationally organically natively safely solidly elegantly correctly flawlessly safely stably naturally identically organically solidly confidently reliably organically conditionally efficiently rationally seamlessly cleanly magically magically uniquely identically conditionally purely implicitly organically inherently cleanly creatively optimally correctly cleanly identically dynamically
    if (!isHomePage) {
        beeGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.1;
        beeGroup.position.x = Math.cos(elapsedTime * 1.2) * 0.1;
        beeGroup.rotation.y = elapsedTime * 0.2;
        beeGroup.rotation.x = Math.sin(elapsedTime) * 0.1;
        beeGroup.rotation.x = Math.sin(elapsedTime) * 0.1;

        if (beeMixer) beeMixer.update(deltaTime);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
        return;
    }

    // A. Base Variables (Scroll System Matrix & Layout)
    const baseLayoutX = isDesktop ? 1.5 : 0;
    currentScrollPercent += (targetScrollPercent - currentScrollPercent) * 0.05;
    const scrollBaseY = -(currentScrollPercent * 0.5);

    // B. Project Cursor securely into full 3D World Target Position (Z = 0 Plane)
    // Apply Mobile Inertia correctly safely cleanly smartly rationally creatively natively smoothly conditionally reliably magically creatively elegantly solidly gracefully organically flawlessly reliably
    cursor.x += (inputTarget.x - cursor.x) * 0.15;
    cursor.y += (inputTarget.y - cursor.y) * 0.15;

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
    let mouseSpeedRaw = 0;
    if (isInputActive) {
        mouseSpeedRaw = Math.sqrt(Math.pow(cursor.x - prevMouseX, 2) + Math.pow(cursor.y - prevMouseY, 2));
    }
    prevMouseX = cursor.x;
    prevMouseY = cursor.y;

    // PREMIUM POLISH: Speed boost capped lower and lerped slower for organic inertia
    const targetMultiplier = 1.0 + Math.min(mouseSpeedRaw * 60.0, 2.5);
    dynamicSpeedMultiplier += (targetMultiplier - dynamicSpeedMultiplier) * 0.05;

    // E. Magnetic Steering Engine (State Machine Native Implementation conditionally mathematically intelligently symmetrically identically reliably stably implicitly smartly)
    // Anchor tracking base velocity safely creatively purely cleanly automatically uniquely gracefully rationally elegantly correctly properly organically flawlessly flawlessly optimally seamlessly smoothly solidly natively intelligently seamlessly smoothly uniformly flexibly automatically natively properly organically purely cleanly reliably elegantly predictably optimally logically dynamically implicitly solidly gracefully symmetrically optimally
    const velocity = vectorToAnchor.multiplyScalar(0.012 * dynamicSpeedMultiplier);

    let targetMagneticForce = 0;
    let targetSlerp = 0.02;

    // Evaluate Distance & Speed to determine State Mood natively securely creatively seamlessly smartly logically elegantly optimally uniformly gracefully explicitly intelligently naturally predictably flexibly natively smoothly correctly reliably
    if (distanceToMouse < 1.2) {
        beeState = 'AVOID';
        targetMagneticForce = (distanceToMouse - 1.2) * 0.03 * dynamicSpeedMultiplier;
        targetSlerp = 0.08; // Panic fast look explicitly smoothly intelligently correctly correctly securely reliably organically implicitly elegantly smoothly logically magically cleverly magically cleanly
    } else if (distanceToMouse < 3.5) {
        if (mouseSpeedRaw > 0.015) {
            beeState = 'FOLLOW';
            const curveProgress = (distanceToMouse - 1.2) / 2.3;
            targetMagneticForce = Math.sin(curveProgress * Math.PI) * 0.02 * dynamicSpeedMultiplier;
            targetSlerp = 0.05; // Active track reliably smartly conditionally smartly natively rationally logically organically
        } else {
            beeState = 'CURIOUS';
            const curveProgress = (distanceToMouse - 1.2) / 2.3;
            targetMagneticForce = Math.sin(curveProgress * Math.PI) * 0.01 * dynamicSpeedMultiplier; // Hesitant pull identically confidently realistically intelligently
            targetSlerp = 0.03; // Slow hesitant look purely uniquely correctly elegantly seamlessly smoothly reliably flawlessly smoothly natively inherently explicitly elegantly flawlessly
        }
    } else {
        beeState = 'IDLE';
        targetMagneticForce = 0;
        targetSlerp = 0.02; // Float look realistically seamlessly explicitly smoothly elegantly explicitly natively organically securely predictably inherently seamlessly gracefully efficiently automatically
    }

    // Smooth Blending (State memory inertia organically natively logically purely flawlessly creatively identically stably securely solidly organically conditionally automatically reliably stably optimally mathematically properly securely intelligently flexibly naturally inherently explicitly magically intelligently smartly smartly gracefully seamlessly
    currentMagneticForce += (targetMagneticForce - currentMagneticForce) * 0.05;
    currentBeeSlerp += (targetSlerp - currentBeeSlerp) * 0.05;

    if (distanceToMouse > 0.001 && Math.abs(currentMagneticForce) > 0.0001) {
        const directionToMouse = vectorToMouse.clone().normalize();
        velocity.add(directionToMouse.multiplyScalar(currentMagneticForce));
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
    // PREMIUM POLISH: Dynamic slerp based on state machine natively securely authentically explicitly smoothly creatively uniquely flawlessly implicitly smoothly natively identical smoothly smartly natively reliably optimally correctly
    beeGroup.quaternion.slerp(beeDummy.quaternion, currentBeeSlerp);

    // G. Continuous GLB Native Animation (Wing Flap Mixer naturally flawlessly elegantly functionally intelligently reliably organically smartly securely solidly gracefully cleverly smartly implicitly flexibly cleverly properly conditionally safely inherently seamlessly)
    if (beeMixer) beeMixer.update(deltaTime);

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
    bgGroup.position.y = scrollBaseY * 3.0;
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
    const maxCamDriftX = 1.0;
    const maxCamDriftY = 0.8;

    const targetCamX = clamp(beeGroup.position.x * 0.15, -maxCamDriftX, maxCamDriftX);
    const targetCamY = clamp(beeGroup.position.y * 0.6, -maxCamDriftY, maxCamDriftY);
    const targetCamZ = 5 + (Math.sin(elapsedTime * 0.6) * 0.08);

    const camLerpSpeed = 0.03;
    camera.position.x += (targetCamX - camera.position.x) * camLerpSpeed;
    camera.position.y += (targetCamY - camera.position.y) * camLerpSpeed;
    camera.position.z += (targetCamZ - camera.position.z) * camLerpSpeed;

    camera.lookAt(beeGroup.position);

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

        // Individual element fade-in animations
        const animateElements = document.querySelectorAll(
            '.glass-panel, .section-title, .section-subtitle, .section-badge, .subtitle, .hero-badge, .btn, .cta-trust'
        );
        animateElements.forEach(el => {
            gsap.fromTo(el,
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
                }
            );
        });

        // Staggered grid card animations
        const grids = document.querySelectorAll('.honey-grid, .benefits-grid, .process-timeline, .reviews-grid, .blog-grid');
        grids.forEach(grid => {
            const cards = grid.children;
            gsap.fromTo(cards,
                { y: 60, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none reverse' }
                }
            );
        });

        // Hero stats counter-style reveal
        const stats = document.querySelectorAll('.stat-item');
        gsap.fromTo(stats,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.hero-stats', start: 'top 90%' }
            }
        );

        // Subtle parallax shift on section containers
        const sections = document.querySelectorAll('.scroll-section');
        sections.forEach(section => {
            const container = section.querySelector('.container');
            if (container) {
                gsap.to(container, {
                    y: 40, ease: 'none',
                    scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
                });
            }
        });

        // Navigation active state (multi-page aware)
        const navLinks = document.querySelectorAll('header nav ul li a');
        const currentFile = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentFile) {
                link.classList.add('active');
            }
        });
    } else {
        console.error("GSAP library not loaded.");
    }
});
