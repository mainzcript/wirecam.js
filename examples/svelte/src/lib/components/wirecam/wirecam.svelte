<script lang="ts">
	import { setWirecamContext, type WirecamContext } from './context.js';
	import type { WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		debug = false,
		children,
		...restProps
	}: WithElementRef<{ debug?: boolean; children?: unknown }> = $props();

	let wirecamState = $state<WirecamContext>({
		managedCanvas: undefined,
		scene: undefined,
		camera: undefined,
		renderer: undefined,
		wirecam: undefined,
		debug
	});

	setWirecamContext(wirecamState);
</script>

<div bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
