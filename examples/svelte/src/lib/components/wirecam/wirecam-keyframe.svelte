<script lang="ts">
	import { onMount } from 'svelte';
	import { getWirecamContext, type WirecamKeyframeProps } from './context.js';
	import type { WithElementRef } from '$lib/utils.js';
	import * as THREE from 'three';

	let {
		ref = $bindable(null),
		options,
		children,
		...restProps
	}: WithElementRef<WirecamKeyframeProps & { children?: unknown }> = $props();

	const context = getWirecamContext('W.Keyframe');
	let keyframeId: string | null = null;

	onMount(() => {
		if (!ref || !context.managedCanvas) return;

		const wirecam = context.managedCanvas.getWirecam();
		if (!wirecam) return;

		// Create keyframe with the element reference and default values
		const keyframe = {
			...options,
			cameraUp: options.cameraUp || new THREE.Vector3(0, 1, 0),
			easeIn: options.easeIn ?? true,
			easeOut: options.easeOut ?? true,
			ref: ref
		};

		// Add keyframe to wirecam
		keyframeId = wirecam.addKeyframe(keyframe);

		return () => {
			if (keyframeId && context.managedCanvas) {
				const wirecam = context.managedCanvas.getWirecam();
				if (wirecam) {
					wirecam.removeKeyframe(keyframeId);
				}
			}
		};
	});
</script>

<div bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
