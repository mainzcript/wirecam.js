---
'wirecam': patch
---

fix: update Three.js peer dependency to support newer versions

- Changed peer dependency from `^0.157.0` to `>=0.157.0`
- Allows compatibility with newer Three.js versions (e.g., 0.178.0)
- Resolves ERESOLVE errors when installing with newer Three.js versions
- Users no longer need to use `--legacy-peer-deps` flag
