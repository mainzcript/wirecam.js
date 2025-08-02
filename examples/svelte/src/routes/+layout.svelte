<script lang="ts">
	import '../app.css';
	import { W } from '$lib/components/wirecam';

	let { children } = $props();
</script>

<div class="isolate bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600">
	<W.Default debug={false}>
		{@render children()}
	</W.Default>
</div>
