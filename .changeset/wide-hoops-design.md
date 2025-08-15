---
'wirecam': patch
---

fix: improve Three.js compatibility and fix development dependencies

- Updated Three.js peer dependency from `^0.157.0` to `>=0.157.0` for better version compatibility
- Added missing prettier-plugin-svelte dependency to resolve build issues
- Improved development workflow stability and dependency management
- Resolves installation issues with newer Three.js versions (0.178.0+)
