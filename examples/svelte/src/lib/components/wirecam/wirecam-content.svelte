<script lang="ts">
	import type { WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement> & { children?: unknown }> = $props();
</script>

<div bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
