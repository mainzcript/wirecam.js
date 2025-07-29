<script lang="ts">
	import { browser } from '$app/environment';
	import { Container } from '$lib/components/ui/container';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { Wirecam } from 'wirecam';

	let container: HTMLDivElement;
	let wirecam: Wirecam;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;

	onMount(() => {
		if (!browser) return;

		// Scene setup
		scene = new THREE.Scene();

		// Camera setup
		camera = new THREE.PerspectiveCamera();

		// Renderer setup
		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// Lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(10, 10, 5);
		directionalLight.castShadow = true;
		scene.add(directionalLight);

		const pointLight = new THREE.PointLight(0xffffff, 0.5);
		pointLight.position.set(-10, -10, -10);
		scene.add(pointLight);

		// Geometric Shapes
		const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
		const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
		const box = new THREE.Mesh(boxGeometry, boxMaterial);
		box.position.set(-4, 0, 0);
		box.castShadow = true;
		scene.add(box);

		const sphereGeometry = new THREE.SphereGeometry(1.5);
		const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 });
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.set(0, 0, 0);
		sphere.castShadow = true;
		scene.add(sphere);

		const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 3);
		const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x45b7d1 });
		const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
		cylinder.position.set(4, 0, 0);
		cylinder.castShadow = true;
		scene.add(cylinder);

		const torusGeometry = new THREE.TorusGeometry(1.5, 0.5);
		const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x96ceb4 });
		const torus = new THREE.Mesh(torusGeometry, torusMaterial);
		torus.position.set(0, 4, 0);
		torus.castShadow = true;
		scene.add(torus);

		// Ground Plane
		const groundGeometry = new THREE.BoxGeometry(20, 0.1, 20);
		const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.position.set(0, -2, 0);
		ground.receiveShadow = true;
		scene.add(ground);

		// Initialize Wirecam
		wirecam = new Wirecam({
			renderer,
			scene,
			camera
		});

		// Insert canvas into container
		// eslint-disable-next-line
		container.appendChild(renderer.domElement);

		// Add keyframes for different sections
		wirecam.addKeyframe({
			ref: '#hero-keyframe-ref',
			cameraPos: new THREE.Vector3(0, 2, 8),
			worldTargetPos: new THREE.Vector3(0, 0, 0),
			worldTargetRadius: 4
		});

		wirecam.addKeyframe({
			ref: '#box-keyframe-ref',
			cameraPos: new THREE.Vector3(-4, 3, 5),
			worldTargetPos: new THREE.Vector3(-4, 0, 0),
			worldTargetRadius: 1.25
		});

		wirecam.addKeyframe({
			ref: '#sphere-keyframe-ref',
			cameraPos: new THREE.Vector3(0, 3, 5),
			worldTargetPos: new THREE.Vector3(0, 0, 0),
			worldTargetRadius: 1.5
		});

		wirecam.addKeyframe({
			ref: '#cylinder-keyframe-ref',
			cameraPos: new THREE.Vector3(4, 3, 5),
			worldTargetPos: new THREE.Vector3(4, 0, 0),
			worldTargetRadius: 1.5
		});

		wirecam.addKeyframe({
			ref: '#torus-keyframe-ref',
			cameraPos: new THREE.Vector3(0, 7, 5),
			worldTargetPos: new THREE.Vector3(0, 4, 0),
			worldTargetRadius: 2
		});

		// Handle canvas resizing to fit container
		const handleResize = () => {
			const rect = container.getBoundingClientRect();
			renderer.setSize(rect.width, rect.height);
		};
		window.addEventListener('resize', handleResize);
		handleResize();

		// Start animation loop
		let animationId: number;
		const animate = () => {
			animationId = requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};
		animate();

		// Cleanup function
		return () => {
			window.removeEventListener('resize', handleResize);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			renderer.dispose();
			wirecam.dispose();
		};
	});
</script>

<!-- Fixed background canvas container -->
<div class="fixed inset-0 -z-10" bind:this={container}>
	<!-- Three.js canvas will be inserted here -->
</div>

<!-- Scroll sections with keyframe references for camera control -->
<section class="flex min-h-screen items-center justify-center">
	<div id="hero-keyframe-ref" class="absolute inset-0"></div>
	<div class="relative z-10 text-center">
		<div
			class="mx-auto max-w-4xl rounded-lg border-2 border-white/30 bg-black/20 p-8 backdrop-blur-md"
		>
			<h1 class="m-0 mb-4 text-5xl font-bold text-white">Welcome to Wirecam.js</h1>
			<p class="m-0 mb-6 text-xl leading-relaxed text-white/80">
				Experience the magic of scroll-driven 3D camera control. Scroll down to explore each
				geometric wonder up close.
			</p>
			<div class="flex items-center justify-center gap-2 text-white/60">
				<svg class="h-6 w-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 14l-7 7m0 0l-7-7m7 7V3"
					></path>
				</svg>
				<span class="text-sm">Scroll to explore</span>
			</div>
		</div>
	</div>
</section>

<section>
	<Container class="grid min-h-screen grid-cols-2 gap-4 py-20">
		<div class="order-1 flex items-center justify-center">
			<div
				class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-black/20 p-6 backdrop-blur-md"
			>
				<h2 class="m-0 mb-2.5 text-center text-2xl text-white">The Red Cube</h2>
				<p class="m-0 text-center leading-relaxed text-white/80">
					Watch as the camera gracefully swoops in to showcase this vibrant red cube. Perfect
					angles, perfect lighting - every detail matters in 3D storytelling.
				</p>
			</div>
		</div>
		<div id="box-keyframe-ref" class="order-2"></div>
	</Container>
</section>

<section>
	<Container class="grid min-h-screen grid-cols-2 gap-4 py-20">
		<div class="order-2 flex items-center justify-center">
			<div
				class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-black/20 p-6 backdrop-blur-md"
			>
				<h2 class="m-0 mb-2.5 text-center text-2xl text-white">The Teal Sphere</h2>
				<p class="m-0 text-center leading-relaxed text-white/80">
					Behold the mesmerizing teal sphere - a perfect example of geometric beauty. The camera
					dances around it, revealing its smooth, flawless surface from every angle.
				</p>
			</div>
		</div>
		<div id="sphere-keyframe-ref" class="order-1"></div>
	</Container>
</section>

<section>
	<Container class="grid min-h-screen grid-cols-2 gap-4 py-20">
		<div class="order-1 flex items-center justify-center">
			<div
				class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-black/20 p-6 backdrop-blur-md"
			>
				<h2 class="m-0 mb-2.5 text-center text-2xl text-white">The Blue Cylinder</h2>
				<p class="m-0 text-center leading-relaxed text-white/80">
					Meet the elegant blue cylinder - standing tall and proud. The camera captures its majestic
					height and perfect proportions with cinematic precision.
				</p>
			</div>
		</div>
		<div id="cylinder-keyframe-ref" class="order-2"></div>
	</Container>
</section>

<section>
	<Container class="grid min-h-screen grid-cols-2 gap-4 py-20">
		<div class="order-2 flex items-center justify-center">
			<div
				class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-black/20 p-6 backdrop-blur-md"
			>
				<h2 class="m-0 mb-2.5 text-center text-2xl text-white">The Green Torus</h2>
				<p class="m-0 text-center leading-relaxed text-white/80">
					The mysterious green torus - a donut-shaped wonder floating in space. The camera orbits
					around this unique form, showcasing its infinite curves and organic flow.
				</p>
			</div>
		</div>
		<div id="torus-keyframe-ref" class="order-1"></div>
	</Container>
</section>
