<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { Wirecam } from 'wirecam';

	let canvasElement: HTMLElement;
	let camera: THREE.PerspectiveCamera;
	let scene: THREE.Scene;
	let wirecam: Wirecam;

	onMount(() => {
		console.log('Page mounted');

		// Get canvas element from DOM
		canvasElement = document.querySelector('canvas') as HTMLElement;
		console.log('Canvas element:', canvasElement);

		// Wait for Threlte to initialize
		setTimeout(() => {
			console.log('Timeout executed');
			console.log('Camera:', camera);
			console.log('Scene:', scene);

			if (canvasElement && camera && scene) {
				try {
					// Initialize Wirecam with existing Threlte resources
					wirecam = new Wirecam({
						scene: scene,
						camera: camera,
						container: canvasElement,
						debug: true,
						autoStart: true
					});
					console.log('Wirecam initialized successfully');

					// Add some keyframes for demonstration
					wirecam.addKeyframe({
						ref: '#box-section',
						cameraPos: new THREE.Vector3(-8, 5, 8),
						worldTargetPos: new THREE.Vector3(-4, 0, 0),
						worldTargetRadius: 1.5
					});

					wirecam.addKeyframe({
						ref: '#sphere-section',
						cameraPos: new THREE.Vector3(0, 5, 8),
						worldTargetPos: new THREE.Vector3(0, 0, 0),
						worldTargetRadius: 1.5
					});

					wirecam.addKeyframe({
						ref: '#cylinder-section',
						cameraPos: new THREE.Vector3(8, 5, 8),
						worldTargetPos: new THREE.Vector3(4, 0, 0),
						worldTargetRadius: 1.5
					});
					console.log('Keyframes added successfully');
				} catch (error) {
					console.error('Error initializing Wirecam:', error);
				}
			} else {
				console.error('Missing required elements:', { canvasElement, camera, scene });
			}
		}, 100);

		return () => {
			if (wirecam) {
				wirecam.dispose();
			}
		};
	});
</script>

<div class="scene-container">
	<Canvas>
		<!-- Lighting -->
		<T.AmbientLight intensity={0.4}></T.AmbientLight>
		<T.DirectionalLight position={[10, 10, 5]} intensity={1} castShadow></T.DirectionalLight>
		<T.PointLight position={[-10, -10, -10]} intensity={0.5}></T.PointLight>

		<!-- Geometric Shapes -->
		<T.Mesh position={[-4, 0, 0]}>
			<T.BoxGeometry args={[2, 2, 2]}></T.BoxGeometry>
			<T.MeshStandardMaterial color="#ff6b6b"></T.MeshStandardMaterial>
		</T.Mesh>

		<T.Mesh position={[0, 0, 0]}>
			<T.SphereGeometry args={[1.5]}></T.SphereGeometry>
			<T.MeshStandardMaterial color="#4ecdc4"></T.MeshStandardMaterial>
		</T.Mesh>

		<T.Mesh position={[4, 0, 0]}>
			<T.CylinderGeometry args={[1, 1, 3]}></T.CylinderGeometry>
			<T.MeshStandardMaterial color="#45b7d1"></T.MeshStandardMaterial>
		</T.Mesh>

		<T.Mesh position={[0, 4, 0]}>
			<T.TorusGeometry args={[1.5, 0.5]}></T.TorusGeometry>
			<T.MeshStandardMaterial color="#96ceb4"></T.MeshStandardMaterial>
		</T.Mesh>

		<!-- Ground Plane -->
		<T.Mesh position={[0, -2, 0]}>
			<T.BoxGeometry args={[20, 0.1, 20]}></T.BoxGeometry>
			<T.MeshStandardMaterial color="#f0f0f0"></T.MeshStandardMaterial>
		</T.Mesh>

		<!-- Camera -->
		<T.PerspectiveCamera
			position={[10, 10, 10]}
			oncreate={(ref) => {
				camera = ref;
				// Get scene from camera's parent
				if (ref.parent && ref.parent.type === 'Scene') {
					scene = ref.parent as THREE.Scene;
				}
				ref.lookAt(0, 0, 0);
			}}
		></T.PerspectiveCamera>
	</Canvas>
</div>

<!-- HTML sections for keyframes -->
<div class="sections">
	<div id="box-section" class="section">
		<h2>Box Section</h2>
		<p>This section controls the camera view of the red box.</p>
	</div>

	<div id="sphere-section" class="section">
		<h2>Sphere Section</h2>
		<p>This section controls the camera view of the green sphere.</p>
	</div>

	<div id="cylinder-section" class="section">
		<h2>Cylinder Section</h2>
		<p>This section controls the camera view of the blue cylinder.</p>
	</div>
</div>

<style>
	.scene-container {
		width: 100%;
		height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.sections {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		pointer-events: none;
		z-index: 1;
	}

	.section {
		position: absolute;
		width: 300px;
		height: 200px;
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 8px;
		padding: 20px;
		pointer-events: auto;
		backdrop-filter: blur(10px);
	}

	#box-section {
		top: 20%;
		left: 10%;
	}

	#sphere-section {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	#cylinder-section {
		top: 20%;
		right: 10%;
	}

	.section h2 {
		margin: 0 0 10px 0;
		color: white;
		font-size: 1.2em;
	}

	.section p {
		margin: 0;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.9em;
		line-height: 1.4;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
