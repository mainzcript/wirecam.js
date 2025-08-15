# wirecam

## 0.1.1

### Patch Changes

- 53b7ddd: fix: update Three.js peer dependency to support newer versions
  - Changed peer dependency from `^0.157.0` to `>=0.157.0`
  - Allows compatibility with newer Three.js versions (e.g., 0.178.0)
  - Resolves ERESOLVE errors when installing with newer Three.js versions
  - Users no longer need to use `--legacy-peer-deps` flag

- 798f787: feat: implement scroll-driven 3D camera controller with keyframe system
- 798f787: fix: resolve security vulnerabilities in dependencies
  - Fix esbuild development server vulnerability (moderate)
  - Fix tsup DOM clobbering vulnerabilities (low)
  - Update all dependencies to latest versions
  - Maintain compatibility with existing APIs

- 798f787: nothing has changed - just a changeset for testing purposes

## 0.1.0

### Minor Changes

- 6df24a8: feat: implement scroll-driven 3D camera controller with keyframe system
