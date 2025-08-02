<script lang="ts">
	import { setWirecamContext, type WirecamContext, type WirecamRootProps } from './context.js';
	import type { WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		debug = false,
		children,
		...restProps
	}: WithElementRef<WirecamRootProps & { children?: unknown }> = $props();

	let wirecamState = $state<WirecamContext>({
		managedCanvas: undefined,
		debug
	});

	setWirecamContext(wirecamState);
</script>

<div bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
