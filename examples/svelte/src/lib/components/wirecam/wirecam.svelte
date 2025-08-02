<script lang="ts">
	import { setWirecamContext, type WirecamContext } from './context.js';
	import type { WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<{ children?: unknown }> = $props();

	let wirecamState = $state<WirecamContext>({
		managedCanvas: undefined,
		scene: undefined,
		camera: undefined,
		renderer: undefined,
		wirecam: undefined
	});

	setWirecamContext(wirecamState);
</script>

<div bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
