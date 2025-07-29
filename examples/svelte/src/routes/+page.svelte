<script lang="ts">
	import { browser } from '$app/environment';
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
		scene.background = new THREE.Color(0x667eea);

		// Camera setup
		camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.set(0, 5, 10);
		camera.lookAt(0, 0, 0);

		// Renderer setup
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		container.appendChild(renderer.domElement);

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

		// Add keyframes for different sections
		wirecam.addKeyframe({
			ref: '#box-section',
			cameraPos: new THREE.Vector3(-4, 3, 5),
			worldTargetPos: new THREE.Vector3(-4, 0, 0),
			worldTargetRadius: 2
		});

		wirecam.addKeyframe({
			ref: '#sphere-section',
			cameraPos: new THREE.Vector3(0, 3, 5),
			worldTargetPos: new THREE.Vector3(0, 0, 0),
			worldTargetRadius: 2
		});

		wirecam.addKeyframe({
			ref: '#cylinder-section',
			cameraPos: new THREE.Vector3(4, 3, 5),
			worldTargetPos: new THREE.Vector3(4, 0, 0),
			worldTargetRadius: 2
		});

		// Animation loop
		function animate() {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		}
		animate();

		// Handle resize
		function handleResize() {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		}
		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
			renderer.dispose();
			wirecam.dispose();
		};
	});
</script>

<!-- Fixed background canvas -->
<div class="fixed inset-0 -z-10" bind:this={container}>
	<!-- Three.js canvas will be inserted here -->
</div>

<!-- Scroll sections with keyframe references -->
<section class="relative flex min-h-screen flex-col justify-center py-20">
	<div id="box-section" class="pointer-events-none absolute inset-0"></div>
	<div
		class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-white/10 p-6 backdrop-blur-md"
	>
		<h2 class="m-0 mb-2.5 text-center text-2xl text-white">Box Section</h2>
		<p class="m-0 text-center leading-relaxed text-white/80">
			This section controls the camera view of the red box. The camera will smoothly transition to
			focus on the box when this section is in view.
		</p>
	</div>
</section>

<section class="relative flex min-h-screen flex-col justify-center py-20">
	<div id="sphere-section" class="pointer-events-none absolute inset-0"></div>
	<div
		class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-white/10 p-6 backdrop-blur-md"
	>
		<h2 class="m-0 mb-2.5 text-center text-2xl text-white">Sphere Section</h2>
		<p class="m-0 text-center leading-relaxed text-white/80">
			This section controls the camera view of the green sphere. The camera will smoothly transition
			to focus on the sphere when this section is in view.
		</p>
	</div>
</section>

<section class="relative flex min-h-screen flex-col justify-center py-20">
	<div id="cylinder-section" class="pointer-events-none absolute inset-0"></div>
	<div
		class="mx-auto max-w-3xl rounded-lg border-2 border-white/30 bg-white/10 p-6 backdrop-blur-md"
	>
		<h2 class="m-0 mb-2.5 text-center text-2xl text-white">Cylinder Section</h2>
		<p class="m-0 text-center leading-relaxed text-white/80">
			This section controls the camera view of the blue cylinder. The camera will smoothly
			transition to focus on the cylinder when this section is in view.
		</p>
	</div>
</section>

<!-- Global styles for body -->
<svelte:head>
	<style>
		body {
			margin: 0;
			padding: 0;
			overflow-x: hidden;
		}
	</style>
</svelte:head>
