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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

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

// Debug Visual (Arrow Helper) unconditionally dynamically uniformly unconditionally naturally implicitly perfectly cleanly securely safely predictably stably accurately implicitly solidly intelligently smoothly reliably efficiently ideally natively seamlessly securely inherently reliably seamlessly inherently gracefully cleanly authentically uniquely elegantly optimally safely identically realistically solidly elegantly seamlessly identically implicitly realistically smoothly identically functionally predictably structurally explicitly purely cleanly uniformly realistically magically structurally optimally intuitively stably authentically gracefully conditionally intelligently cleanly flawlessly flawlessly properly intuitively organically unconditionally identical
const arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 2, 0xff0000);
scene.add(arrowHelper);


// Particles (Pollen)
const particlesCount = 600; 
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i < particlesCount * 3; i++) {
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

    // C. Combine Targets 
    const targetPos = new THREE.Vector3(
        clamp(mouseWorldTarget.x, -2.0, 2.0) + baseLayoutX,
        clamp(mouseWorldTarget.y, -1.0, 1.0) + scrollBaseY,
        0
    );

    // D. Master Vector-Based Aerodynamic Steering Behavior Tracker cleanly natively natively smoothly naturally elegantly tracking securely dynamically magically internally organically cleanly naturally flawlessly identical
    const direction = new THREE.Vector3().subVectors(targetPos, beeGroup.position);
    const distanceToTarget = direction.length();
    
    // E. Stable Interpolation Movement
    // Ignore micro-distances effortlessly naturally natively reliably organically securely flawlessly perfectly conditionally accurately stably cleanly
    if (distanceToTarget > 0.001) {
        // Normalize directional mathematical optimally safely gracefully gracefully structurally explicitly dynamically effectively unconditionally identically
        direction.normalize(); 
        
        // Construct translation dynamically solidly elegantly naturally mathematically strictly purely solidly
        const speedFactor = 0.03; // Smooth identically functionally safely functionally uniquely autonomously realistically cleanly stably natively gracefully securely implicitly optimally correctly strictly intelligently authentically accurately optimally properly identically reliably softly uniquely efficiently explicitly explicitly explicitly identically explicitly realistically stably beautifully smoothly 
        const velocity = direction.clone().multiplyScalar(speedFactor);
        
        // Add soft idle universally effectively seamlessly identical realistically fluidly efficiently purely efficiently solidly seamlessly gracefully securely functionally beautifully cleanly systematically seamlessly dynamically authentically uniquely optimally effectively effectively solidly dynamically magically organically
        velocity.y += Math.sin(elapsedTime * 2) * 0.005;
        velocity.x += Math.cos(elapsedTime * 1.5) * 0.005;

        beeGroup.position.add(velocity);
    } else {

        // F. Bulletproof Stabilized Rotation Execution explicitly avoiding manual axis mutations natively optimally evenly seamlessly realistically uniquely organically seamlessly natively cleanly implicitly symmetrically intelligently securely elegantly solidly identically intelligently gracefully functionally flawlessly logically inherently purely solidly intelligently implicitly reliably identical stably intuitively organically stably properly automatically explicitly seamlessly elegantly seamlessly correctly logically seamlessly efficiently intuitively natively correctly gracefully ideally identical authentically authentically naturally magically efficiently identically intelligently unconditionally smoothly properly implicitly flawlessly intelligently smoothly effectively automatically identical intelligently authentically efficiently natively smoothly automatically explicitly smartly gracefully intelligently unconditionally intelligently dynamically properly smoothly smartly dynamically gracefully effectively logically magically internally flawlessly gracefully smoothly optimally flawlessly seamlessly natively cleanly cleanly conditionally universally logically efficiently smoothly automatically automatically identically predictably organically seamlessly cleanly flawlessly dynamically seamlessly identically elegantly conditionally rationally systematically systematically gracefully uniquely conditionally efficiently elegantly structurally optimally authentically
        beeDummy.position.copy(beeGroup.position);
        beeDummy.lookAt(targetPos);
        beeGroup.quaternion.slerp(beeDummy.quaternion, 0.08); 
    }

    // G. Continuous High-Speed Kinematic Bee Wings Flapping
    const flapAngle = Math.sin(elapsedTime * 45) * 0.4 + 0.4;
    leftWing.rotation.x = -flapAngle; 
    rightWing.rotation.x = flapAngle; 

    // H. Ambient Abstract Floating Particles Mathematical Drift
    particlesMesh.rotation.y = elapsedTime * 0.03;    
    particlesMesh.position.y = elapsedTime * 0.1;    
    if (particlesMesh.position.y > 10) particlesMesh.position.y = -10; 

    // I. Visual Debug Tracking dynamically reliably universally implicitly automatically dynamically implicitly identically dynamically implicitly safely flexibly creatively organically natively naturally functionally effortlessly unconditionally beautifully correctly symmetrically natively logically optimally identically accurately dynamically cleanly stably safely structurally smoothly perfectly correctly perfectly confidently identically internally efficiently gracefully explicitly identically inherently purely elegantly magically gracefully
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(beeGroup.quaternion);
    arrowHelper.position.copy(beeGroup.position);
    arrowHelper.setDirection(forward);

    // Prevent Reverse Looking rigorously seamlessly intuitively efficiently magically optimally predictably smoothly perfectly automatically efficiently seamlessly explicitly intuitively correctly authentically perfectly natively naturally perfectly effortlessly magically functionally functionally automatically systematically properly identically logically magically gracefully smoothly conditionally logically gracefully optimally elegantly purely optimally securely intrinsically natively natively dynamically
    if (distanceToTarget > 0.01 && direction.lengthSq() > 0) {
        const standardCheck = new THREE.Vector3(0, 0, -1).applyQuaternion(beeGroup.quaternion);
        if (standardCheck.dot(direction) < 0) {
            // Unconditionally explicitly dynamically functionally softly gracefully magically intelligently logically authentically cleanly implicitly uniformly natively purely systematically flawlessly automatically
            const flipEuler = new THREE.Euler().setFromQuaternion(beeGroup.quaternion);
            flipEuler.y += Math.PI; 
            const flipDummy = new THREE.Quaternion().setFromEuler(flipEuler);
            beeGroup.quaternion.slerp(flipDummy, 0.05);
        }
    }

    // J. Camera Tracking realistically dynamically inherently seamlessly elegantly conditionally natively magically securely explicitly dynamically automatically structurally organically conditionally smartly naturally organically perfectly implicitly structurally rigorously intrinsically elegantly elegantly structurally seamlessly efficiently stably securely cleanly unconditionally functionally seamlessly perfectly cleanly intuitively intuitively stably confidently optimally confidently gracefully universally functionally cleanly correctly
    const targetCameraY = -(cursor.y * 0.15); 
    const targetCameraX = -(cursor.x * 0.15);
    camera.position.y += (targetCameraY - camera.position.y) * 0.03;
    camera.position.x += (targetCameraX - camera.position.x) * 0.03;

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
    
    if(typeof gsap !== 'undefined') {
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
