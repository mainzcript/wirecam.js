<script lang="ts">
	import { W } from '$lib/components/wirecam';

	let { children } = $props();
</script>

<W.Default debug={false}>
	{@render children()}
</W.Default>
