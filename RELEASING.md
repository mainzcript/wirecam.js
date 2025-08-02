# Release Guide

## Using Changesets

1. **Add changeset** when making changes:

   ```bash
   pnpm changeset add
   ```

   Follow the prompts to describe your changes and select version bump type.

2. **Apply changesets** when ready to release:
   ```bash
   pnpm changeset version
   ```
   This bumps versions and generates changelogs.

## Manual Release Process

1. **Apply changesets:**

   ```bash
   pnpm changeset version
   ```

2. **Build the package:**

   ```bash
   cd packages/wirecam
   npm run build
   ```

3. **Publish to npm:**
   ```bash
   npm login  # if not already logged in
   npm publish
   ```

## Git Workflow

1. **Make changes** on feature branch
2. **Add changeset** with `pnpm changeset add`
3. **Create PR** to `develop`
4. **Merge to develop**
5. **When ready to release:** Create PR from `develop` to `main`
6. **Merge to main**
7. **Apply changesets** with `pnpm changeset version`
8. **Release manually** with `npm publish`

## Version Bumping

- **Patch:** Bug fixes (0.0.1 → 0.0.2)
- **Minor:** New features (0.0.1 → 0.1.0)
- **Major:** Breaking changes (0.0.1 → 1.0.0)

No complex GitHub Actions, just simple changesets + manual releases.
