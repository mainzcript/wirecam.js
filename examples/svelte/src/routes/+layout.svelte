<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="isolate bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600">
	{@render children()}
</div>
