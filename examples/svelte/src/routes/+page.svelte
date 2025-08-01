<script lang="ts">
	import { W, useWirecam } from '$lib/components/wirecam';
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import { Container } from '$lib/components/ui/container';

	onMount(() => {
		const { managedCanvas } = useWirecam();

		if (managedCanvas) {
			const scene = managedCanvas.getScene();
			return setupScene(scene);
		}
	});

	function setupScene(scene: THREE.Scene) {
		// Add 3D objects to the scene
		const geometry1 = new THREE.BoxGeometry(2, 2, 2);
		const material1 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
		const cube = new THREE.Mesh(geometry1, material1);
		cube.position.set(-4, 0, 0);
		scene.add(cube);

		const geometry2 = new THREE.SphereGeometry(1.5, 32, 32);
		const material2 = new THREE.MeshLambertMaterial({ color: 0x00ffff });
		const sphere = new THREE.Mesh(geometry2, material2);
		sphere.position.set(0, 0, 0);
		scene.add(sphere);

		const geometry3 = new THREE.CylinderGeometry(1, 1, 3, 32);
		const material3 = new THREE.MeshLambertMaterial({ color: 0x0000ff });
		const cylinder = new THREE.Mesh(geometry3, material3);
		cylinder.position.set(4, 0, 0);
		scene.add(cylinder);

		const geometry4 = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
		const material4 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
		const torus = new THREE.Mesh(geometry4, material4);
		torus.position.set(0, 4, 0);
		scene.add(torus);

		const groundGeometry = new THREE.BoxGeometry(20, 0.1, 20);
		const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.position.set(0, -2, 0);
		ground.receiveShadow = true;
		scene.add(ground);

		// Add lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 2);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(10, 10, 5);
		scene.add(directionalLight);

		// return a function to clear the scene
		return () => {
			scene.clear();
		};
	}
</script>

<section>
	<Container class="relative flex min-h-screen items-center justify-center">
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(0, 2, 20),
				worldTargetPos: new THREE.Vector3(0, 2, 0),
				worldTargetRadius: 6
			}}
			class="absolute inset-0"
		></W.Keyframe>
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
	</Container>
</section>

<section>
	<Container class="grid min-h-screen gap-4 py-20 md:grid-cols-2">
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(-4, 3, 5),
				worldTargetPos: new THREE.Vector3(-4, 0, 0),
				worldTargetRadius: 1.25
			}}
			class="order-1 min-h-[400px] md:hidden"
		></W.Keyframe>
		<div class="order-2 flex items-center justify-center">
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
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(-4, 3, 5),
				worldTargetPos: new THREE.Vector3(-4, 0, 0),
				worldTargetRadius: 1.25
			}}
			class="order-3 min-h-[400px]"
		></W.Keyframe>
	</Container>
</section>

<section>
	<Container class="grid min-h-screen gap-4 py-20 md:grid-cols-2">
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(0, 3, 5),
				worldTargetPos: new THREE.Vector3(0, 0, 0),
				worldTargetRadius: 1.5
			}}
			class="order-1 min-h-[400px]"
		></W.Keyframe>
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
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(0, 3, 5),
				worldTargetPos: new THREE.Vector3(0, 0, 0),
				worldTargetRadius: 1.5
			}}
			class="order-3 min-h-[400px] md:hidden"
		></W.Keyframe>
	</Container>
</section>

<section>
	<Container class="grid min-h-screen gap-4 py-20 md:grid-cols-2">
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(4, 3, 5),
				worldTargetPos: new THREE.Vector3(4, 0, 0),
				worldTargetRadius: 1.5
			}}
			class="order-1 min-h-[400px] md:hidden"
		></W.Keyframe>
		<div class="order-2 flex items-center justify-center">
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
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(4, 3, 5),
				worldTargetPos: new THREE.Vector3(4, 0, 0),
				worldTargetRadius: 1.5
			}}
			class="order-3 min-h-[400px]"
		></W.Keyframe>
	</Container>
</section>

<section>
	<Container class="grid min-h-screen gap-4 py-20 md:grid-cols-2">
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(0, 7, 5),
				worldTargetPos: new THREE.Vector3(0, 4, 0),
				worldTargetRadius: 2
			}}
			class="order-1 min-h-[400px]"
		></W.Keyframe>
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
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(0, 7, 5),
				worldTargetPos: new THREE.Vector3(0, 4, 0),
				worldTargetRadius: 2
			}}
			class="order-3 min-h-[400px] md:hidden"
		></W.Keyframe>
	</Container>
</section>
