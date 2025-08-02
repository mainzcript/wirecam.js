# Wirecam.js Svelte Example

This example demonstrates how to integrate Wirecam.js with Svelte to create scroll-driven 3D camera animations. The example showcases a beautiful 3D scene with various geometric objects that the camera explores as you scroll through the page.

## Features

- **Scroll-driven 3D camera control** - Camera smoothly transitions between different viewpoints as you scroll
- **Three.js integration** - Full 3D scene with lighting, materials, and geometric objects
- **Responsive design** - Works on both desktop and mobile devices
- **Smooth animations** - Interpolated camera movements between keyframes
- **Modern UI** - Clean, glassmorphism design with Tailwind CSS

## Quick Start

To use Wirecam.js in your own Svelte project, simply copy the `wirecam` components from this example:

1. Copy the `src/lib/components/wirecam/` folder to your project
2. Install the required dependencies:
   ```bash
   npm install wirecam three @types/three
   ```
3. Import and use the components as shown in the example

### Layout Integration

For a full-page experience, you can integrate `W.Viewport` into your layout:

```svelte
<!-- +layout.svelte -->
<script lang="ts">
	import { W } from '$lib/components/wirecam';
</script>

<div class="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600">
	<W.Viewport>
		<slot />
	</W.Viewport>
</div>
```

## How It Works

### Component Structure

The example uses a set of Svelte components that wrap the Wirecam.js library:

- **`W.Root`** - The main container that provides the Wirecam context
- **`W.Canvas`** - Creates and manages the Three.js canvas
- **`W.Keyframe`** - Defines camera positions and targets for scroll-driven animations
- **`W.Viewport`** - A convenient wrapper that combines Root, Canvas, and Content for most use cases
- **`W.Content`** - Wraps content that should be synchronized with camera movements

### Key Concepts

1. **Keyframes**: Each `<W.Keyframe>` component defines a camera position and target that the camera will smoothly transition to as the user scrolls to that section.

2. **Camera Control**: The camera automatically interpolates between keyframes based on scroll position, creating smooth cinematic movements.

3. **3D Scene Setup**: The Three.js scene is set up in the `onMount` lifecycle hook, where you can add your 3D objects, lighting, and materials.

### Example Usage

#### Simple Setup with W.Viewport (Recommended)

For most use cases, `W.Viewport` provides the easiest setup by combining `W.Root`, `W.Canvas`, and `W.Content`:

```svelte
<script lang="ts">
	import { W, useWirecam } from '$lib/components/wirecam';
	import * as THREE from 'three';
	import { onMount } from 'svelte';

	onMount(() => {
		const { managedCanvas } = useWirecam();

		if (managedCanvas) {
			const scene = managedCanvas.getScene();
			setupScene(scene);
		}
	});

	function setupScene(scene: THREE.Scene) {
		// Add your 3D objects here
		const geometry = new THREE.BoxGeometry(2, 2, 2);
		const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
	}
</script>

<W.Viewport>
	<section>
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(0, 2, 10),
				worldTargetPos: new THREE.Vector3(0, 0, 0),
				worldTargetRadius: 5
			}}
		>
			<div>Your content here</div>
		</W.Keyframe>
	</section>
</W.Viewport>
```

#### Advanced Setup with Individual Components

For more control, you can use the components individually:

```svelte
<script lang="ts">
	import { W, useWirecam } from '$lib/components/wirecam';
	import * as THREE from 'three';
	import { onMount } from 'svelte';

	onMount(() => {
		const { managedCanvas } = useWirecam();

		if (managedCanvas) {
			const scene = managedCanvas.getScene();
			setupScene(scene);
		}
	});

	function setupScene(scene: THREE.Scene) {
		// Add your 3D objects here
		const geometry = new THREE.BoxGeometry(2, 2, 2);
		const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
	}
</script>

<W.Root>
	<W.Canvas />

	<section>
		<W.Keyframe
			options={{
				cameraPos: new THREE.Vector3(0, 2, 10),
				worldTargetPos: new THREE.Vector3(0, 0, 0),
				worldTargetRadius: 5
			}}
		>
			<div>Your content here</div>
		</W.Keyframe>
	</section>
</W.Root>
```

## Component Options

### W.Viewport Options

The `W.Viewport` component accepts the same options as `W.Canvas`:

- **`debug`**: `boolean` - Enable debug mode for development
- **`backgroundColor`**: `THREE.ColorRepresentation` - Background color of the canvas (default: `0x000000`)
- **`antialias`**: `boolean` - Enable antialiasing (default: `true`)
- **`alpha`**: `boolean` - Enable alpha channel (default: `true`)
- **`pixelRatio`**: `number` - Device pixel ratio (default: `1`)
- **`autoStart`**: `boolean` - Automatically start rendering (default: `true`)

### W.Keyframe Options

Each `W.Keyframe` component accepts the following options:

- **`cameraPos`**: `THREE.Vector3` - The position where the camera should be located
- **`worldTargetPos`**: `THREE.Vector3` - The point the camera should look at
- **`worldTargetRadius`**: `number` - The radius around the target point for camera positioning

## Dependencies

- **wirecam**: The core library for scroll-driven 3D camera control
- **three**: 3D graphics library for rendering
- **@types/three**: TypeScript definitions for Three.js

## Development

To run this example locally:

```bash
cd examples/svelte
npm install
npm run dev
```

The example will be available at `http://localhost:5173`.

## Customization

You can easily customize this example by:

1. **Changing 3D objects**: Modify the `setupScene` function to add different geometries, materials, and lighting
2. **Adjusting camera paths**: Update the keyframe options to create different camera movements
3. **Styling**: Modify the CSS classes and Tailwind utilities to match your design
4. **Adding interactions**: Implement click handlers, hover effects, or other interactive features

## Browser Support

This example works in all modern browsers that support:

- ES6 modules
- WebGL
- Intersection Observer API
- CSS transforms and animations

## Future Plans

The Svelte components in this example are currently part of the Wirecam.js examples, but there are plans to potentially extract them into dedicated packages:

- **@wirecam/svelte** - Official Svelte integration with Threlte compatibility
- **@wirecam/react** - React integration with Drei compatibility

For now, you can copy the components from this example to use Wirecam.js in your Svelte projects. The components are well-structured and ready for production use.

## License

This example is part of the Wirecam.js project and follows the same license terms.
