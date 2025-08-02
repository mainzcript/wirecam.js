<script lang="ts">
	import '../app.css';
	import { W } from '$lib/components/wirecam';

	let { children } = $props();
</script>

<div class="isolate min-h-screen bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600">
	<W.Viewport debug={false}>
		{@render children()}
	</W.Viewport>
</div>
