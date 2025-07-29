<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		class: className = '',
		children,
		as = 'div', // Standardmäßig ein <div>, kann aber überschrieben werden
		...restProps
	} = $props();

	const baseStyle = 'container mx-auto px-6 lg:px-8';
</script>

<svelte:element this={as} class={cn(baseStyle, className)} {...restProps}>
	{@render children()}
</svelte:element>
