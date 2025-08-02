<script lang="ts">
	import { W } from './index';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils.js';

	export type WirecamDefaultProps = {
		debug?: boolean;
		backgroundColor?: THREE.ColorRepresentation;
		antialias?: boolean;
		alpha?: boolean;
		pixelRatio?: number;
		autoStart?: boolean;
		children?: unknown;
	} & WithElementRef<HTMLAttributes<HTMLDivElement>>;

	let {
		class: className = '',
		debug = false,
		backgroundColor = 0x000000,
		antialias = true,
		alpha = true,
		pixelRatio = 1,
		autoStart = true,
		children,
		...restProps
	}: WirecamDefaultProps = $props();

	const baseStyle = 'isolate relative h-full w-full';
</script>

<W.Root {debug} class={cn(baseStyle, className)} {...restProps}>
	<div class="fixed -z-10 h-screen w-screen">
		<W.Canvas {backgroundColor} {alpha} {antialias} {autoStart} {pixelRatio} />
	</div>
	<W.Content>
		{@render children?.()}
	</W.Content>
</W.Root>
