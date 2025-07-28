# wirecam.js

An advanced scroll-driven camera controller for Three.js with an intelligent keyframe system.

## Features

- 🎥 **Intelligent Camera Control** - Automatic camera positioning based on HTML elements
- 🎯 **Keyframe System** - Link HTML elements with ideal camera positions
- 🔄 **Smooth Interpolation** - Seamless transitions between keyframes with easing functions
- 🎨 **Framework Agnostic** - Works with any framework or vanilla JavaScript
- 📦 **TypeScript Support** - Full type definitions included
- 🐛 **Debug Mode** - Visual indicators for development and debugging
- 🚀 **Performance Optimized** - Efficient calculations and rendering

## Installation

```bash
npm install wirecam
# or
yarn add wirecam
# or
pnpm add wirecam
```

## Quick Start

```typescript
import { Wirecam } from 'wirecam';
import * as THREE from 'three';

// Create Three.js scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

// Initialize Wirecam with Three.js resources
const controller = new Wirecam({
  scene: scene,
  camera: camera,
  container: document.body,
  debug: true,
  autoStart: true,
});

// Add keyframes - link HTML elements with camera positions
const keyframeId1 = controller.addKeyframe({
  ref: '#section-1', // CSS selector or HTMLElement
  cameraPos: new THREE.Vector3(0, 0, 5),
  worldTargetPos: new THREE.Vector3(0, 0, 0),
  worldTargetRadius: 2,
  cameraUp: new THREE.Vector3(0, 1, 0),
});

const keyframeId2 = controller.addKeyframe({
  ref: '#section-2',
  cameraPos: new THREE.Vector3(5, 2, 0),
  worldTargetPos: new THREE.Vector3(0, 0, 0),
  worldTargetRadius: 1.5,
  easeIn: true,
  easeOut: true,
});

// Camera starts automatically - scroll to see the animation!
```

## Concept

wirecam.js uses an intelligent system that links HTML elements with ideal camera positions:

1. **HTML Elements as Reference** - Each keyframe is linked to an HTML element
2. **Automatic Positioning** - The camera automatically positions itself to optimally show the element
3. **Scroll-based Animation** - Keyframes are seamlessly interpolated when scrolling
4. **Intelligent Calculations** - FOV, position, and rotation are automatically calculated

## API Reference

### Wirecam

The main class for camera control.

#### Constructor

```typescript
new Wirecam(options: WirecamOptions)
```

#### WirecamOptions

```typescript
interface WirecamOptions {
  container?: HTMLElement; // Container element (default: document.body)
  renderer?: THREE.WebGLRenderer; // Three.js renderer (optional)
  scene?: THREE.Scene; // Three.js scene (optional)
  camera?: THREE.PerspectiveCamera; // Three.js camera (optional)
  autoStart?: boolean; // Start automatically (default: true)
  debug?: boolean; // Enable debug mode (default: false)
}
```

#### Properties

- `settings.debug: boolean` - Enable/disable debug mode
- `defaults.keyframe: LinkedKeyframe` - Default values for keyframes
- `scene: THREE.Scene` - The Three.js scene
- `camera: THREE.PerspectiveCamera` - The Three.js camera

#### Methods

- `addKeyframe(keyframe: Partial<Keyframe>): string | null` - Add a keyframe
- `removeKeyframe(id: string): void` - Remove a keyframe
- `start(): void` - Start camera animation
- `stop(): void` - Stop camera animation
- `clear(): void` - Reset all keyframes and callbacks
- `dispose(): void` - Completely clean up the controller
- `registerUpdateCallback(fn: () => void): string` - Register an update callback
- `unregisterUpdateCallback(id: string): void` - Remove an update callback
- `updateViewport(): void` - Update viewport calculations
- `updateDebugMode(): void` - Update debug mode display

### Inspector

Development tool for debugging and monitoring.

#### Constructor

```typescript
new Inspector(document: Document, wirecam: Wirecam, debug?: boolean)
```

#### Methods

- `showGuiControls(): void` - Show the GUI controls panel
- `hideGuiControls(): void` - Hide the GUI controls panel
- `dispose(): void` - Clean up the inspector
- `setDebug(debug: boolean): void` - Set debug mode

### Keyframe Interface

```typescript
interface Keyframe {
  ref: string | HTMLElement; // HTML element or CSS selector
  cameraPos?: THREE.Vector3; // Camera position
  cameraUp?: THREE.Vector3; // Camera up vector
  worldTargetPos?: THREE.Vector3; // Target point in 3D scene
  worldTargetRadius?: number; // Radius of the target object
  easeIn?: boolean; // Easing when fading in
  easeOut?: boolean; // Easing when fading out
  onUpdate?: (liveValues: KeyframeLiveValues) => void; // Update callback
}

interface KeyframeLiveValues {
  activity: number; // Activity level (0-1) of the keyframe
}

interface LiveKeyframe extends Partial<LinkedKeyframe> {
  ref: HTMLElement;
  liveValues: KeyframeLiveValues;
  onUpdate?: (liveValues: KeyframeLiveValues) => void;
}
```

## Advanced Usage

### Custom Update Callbacks

```typescript
// Register callback for every frame
const callbackId = controller.registerUpdateCallback(() => {
  // Execute your own logic here
  console.log('Camera updated');
});

// Remove callback later
controller.unregisterUpdateCallback(callbackId);
```

### Keyframe Update Callbacks

```typescript
const keyframeId = controller.addKeyframe({
  ref: '#my-element',
  cameraPos: new THREE.Vector3(0, 0, 5),
  onUpdate: (liveValues) => {
    // liveValues.activity contains the activity (0-1)
    console.log('Keyframe activity:', liveValues.activity);
  },
});
```

### Debug Mode

```typescript
// Enable debug mode for visual indicators
controller.settings.debug = true;

// Shows:
// - Red reference indicators
// - Yellow target position indicators
// - Magenta look-at indicators
// - Green highlighting of active HTML elements
```

### Inspector (Development Tool)

The Inspector provides a GUI for development and debugging:

```typescript
import { Wirecam, Inspector } from 'wirecam';

// Create Wirecam instance
const controller = new Wirecam({
  scene: scene,
  camera: camera,
  container: document.body,
  debug: true,
});

// Create Inspector for development tools
const inspector = new Inspector(document, controller, true);

// Show GUI controls (FPS, camera info, position helper)
inspector.showGuiControls();

// Hide GUI controls
inspector.hideGuiControls();

// Clean up when done
inspector.dispose();
```

The Inspector provides:

- **FPS Monitor** - Real-time performance statistics
- **Debug Toggle** - Enable/disable debug mode
- **Camera Information** - Live position and FOV data
- **Position Helper** - Click anywhere to get 3D coordinates for placing objects

## HTML Structure

```html
<div id="camera-container"></div>

<div id="section-1" style="height: 100vh;">
  <h1>First Section</h1>
</div>

<div id="section-2" style="height: 100vh;">
  <h2>Second Section</h2>
</div>

<div id="section-3" style="height: 100vh;">
  <h3>Third Section</h3>
</div>
```

## Development

This is a pnpm monorepo. To get started:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build core package only
pnpm --filter wirecam build

# Linting
pnpm lint

# Tests
pnpm test

# Start development server (Svelte example)
cd examples/svelte && pnpm dev
```

### Project Structure

```
wirecam.js/
├── packages/
│   └── wirecam/          # Core package
│       ├── src/
│       │   ├── Wirecam.ts    # Main class
│       │   ├── Inspector.ts  # Development tools
│       │   ├── types.ts      # TypeScript types
│       │   ├── utils/        # Utility functions
│       │   │   ├── PositionSpy.ts     # Element position tracking
│       │   │   └── ...                # More utility functions
│       │   └── index.ts      # Exports
│       ├── package.json
│       └── tsup.config.ts
├── examples/
│   └── svelte/           # SvelteKit example
├── .github/workflows/    # CI/CD workflows
└── package.json          # Root package.json
```

## Technical Details

### PositionSpy

Tracks the position and size of HTML elements in the viewport and calculates ROIs (Regions of Interest).

### Mathematical Calculations

- **FOV Calculation**: Automatic calculation of optimal field of view
- **Look-At Point**: Intelligent calculation of the look-at point
- **Interpolation**: Smooth transitions between keyframes

### Performance

- Efficient ROI calculations
- Optimized render loops
- Intelligent update callbacks
- Browser-compatible UUID generation

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute, including how to fork, create a feature branch, and submit a Pull Request. If you change any code in `packages/`, you must add a changeset. All details for contributors are in that file.

## License

MIT License - see LICENSE file for details.

## Authors

- Marius Klein
- Danny Staus

## Release & Versioning

This project uses [changesets](https://github.com/changesets/changesets) for versioning and release management in a pnpm monorepo.

- All changes to packages require a changeset. See [CONTRIBUTING.md](./CONTRIBUTING.md) for details (for contributors).
- Releases are managed by maintainers: changes are collected on the `develop` branch and merged into `main` via Pull Request.
- Maintainers trigger releases manually via GitHub Actions (see [RELEASING.md](./RELEASING.md) for maintainers).
- Snapshots are published automatically to npm with the `next` tag on every push to `main` (except release commits).

For more information:

- [RELEASING.md](./RELEASING.md) — Release workflow and best practices (for maintainers)
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guidelines and changeset requirements (for contributors)
