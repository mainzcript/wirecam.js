<script lang="ts">
	import { setWirecamContext, type WirecamContext, type WirecamRootProps } from './context.js';
	import type { WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		debug = false,
		backgroundColor = 0x000000,
		antialias = true,
		alpha = true, // Transparent background by default
		pixelRatio = 1,
		autoStart = true,
		children,
		...restProps
	}: WithElementRef<WirecamRootProps & { children?: unknown }> = $props();

	let wirecamState = $state<WirecamContext>({
		managedCanvas: undefined,
		scene: undefined,
		camera: undefined,
		renderer: undefined,
		wirecam: undefined,
		debug,
		backgroundColor,
		antialias,
		alpha,
		pixelRatio,
		autoStart
	});

	setWirecamContext(wirecamState);
</script>

<div bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
