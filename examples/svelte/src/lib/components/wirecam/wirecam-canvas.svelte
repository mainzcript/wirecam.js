<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { onMount, onDestroy } from 'svelte';
	import { getWirecamContext, type WirecamCanvasProps } from './context.js';
	import { ManagedCanvas } from 'wirecam';
	import * as THREE from 'three';
	import type { WithElementRef } from '$lib/utils.js';

	let {
		class: className = '',
		ref = $bindable(null),
		backgroundColor = 0x000000,
		antialias = true,
		alpha = true,
		pixelRatio = 1,
		debug = false,
		autoStart = true,
		...restProps
	}: WithElementRef<WirecamCanvasProps> = $props();

	const baseStyle = 'w-full h-full';

	const context = getWirecamContext('W.Canvas');
	let managedCanvas: ManagedCanvas | undefined;

	onMount(() => {
		if (!ref) return;

		// Create ManagedCanvas
		managedCanvas = new ManagedCanvas({
			container: ref,
			autoStart,
			debug,
			backgroundColor,
			antialias,
			alpha
		});

		// Update context
		context.managedCanvas = managedCanvas;
		context.scene = managedCanvas.getScene();
		context.camera = managedCanvas.getCamera();
		context.renderer = managedCanvas.getRenderer();
		context.wirecam = managedCanvas.getWirecam();

		// Create a simple scene with some 3D objects
		const scene = managedCanvas.getScene();

		// Add some basic lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(10, 10, 5);
		scene.add(directionalLight);

		// Add some 3D objects
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
	});

	onDestroy(() => {
		if (managedCanvas) {
			managedCanvas.dispose();
		}
	});
</script>

<div bind:this={ref} {...restProps} class={cn(baseStyle, className)}>
	<!-- Canvas will be rendered here -->
</div>
