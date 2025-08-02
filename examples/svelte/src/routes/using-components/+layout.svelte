<script lang="ts">
	import { W } from '$lib/components/wirecam';

	let { children } = $props();
</script>

<W.Root debug={false} backgroundColor={0x000000} alpha={true} antialias={true} autoStart={true}>
	{@render children()}
</W.Root>
