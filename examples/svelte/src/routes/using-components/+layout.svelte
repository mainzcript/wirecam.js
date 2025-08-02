<script lang="ts">
	import { W } from '$lib/components/wirecam';

	let { children } = $props();
</script>

<W.Root debug={false}>
	{@render children()}
</W.Root>
