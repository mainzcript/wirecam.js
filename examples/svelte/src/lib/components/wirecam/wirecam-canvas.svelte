<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import { getWirecamContext, type WirecamCanvasProps } from './context.js';
	import { ManagedCanvas } from 'wirecam';
	import type { WithElementRef } from '$lib/utils.js';

	let {
		class: className = '',
		ref = $bindable(null),
		backgroundColor = 0x000000,
		antialias = true,
		alpha = true,
		pixelRatio = 1,
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
			debug: context.debug,
			backgroundColor,
			antialias,
			alpha,
			pixelRatio
		});

		// Update context with managedCanvas
		context.managedCanvas = managedCanvas;

		return () => {
			if (managedCanvas) {
				managedCanvas.dispose();
			}
		};
	});
</script>

<div bind:this={ref} {...restProps} class={cn(baseStyle, className)}>
	<!-- Canvas will be rendered here -->
</div>
