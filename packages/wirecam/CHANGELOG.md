# wirecam

## 0.1.4

### Patch Changes

- fix: ensure dist files are built before npm publish
  - Add build step to GitHub Actions release workflow
  - Add build verification to prevent publishing without dist files
  - Add prepublishOnly hook to ensure build runs before publish
  - Add .npmignore to ensure clean package distribution
  - Add local testing instructions to release documentation

## 0.1.3

### Patch Changes

- test: workflow validation
  - Test changeset to validate LEAN release workflow
  - No functional changes, only testing CI pipeline
  - Verifying manual version bump and automated publishing process

## 0.1.2

### Patch Changes

- 18d1d7b: fix: improve Three.js compatibility and fix development dependencies
  - Updated Three.js peer dependency from `^0.157.0` to `>=0.157.0` for better version compatibility
  - Added missing prettier-plugin-svelte dependency to resolve build issues
  - Improved development workflow stability and dependency management
  - Resolves installation issues with newer Three.js versions (0.178.0+)

## 0.1.1

### Patch Changes

- b675738: fix: update dependencies and resolve security vulnerabilities
  - Updated outdated dependencies to latest versions
  - Fixed security vulnerabilities in development dependencies
  - Improved overall package stability

## 0.1.0

### Minor Changes

- 798f787: feat: implement scroll-driven 3D camera controller with keyframe system
