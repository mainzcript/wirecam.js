# Release Guide

## LEAN Release Workflow

This project uses a simplified release process with manual version management and automated NPM publishing.

## Development Workflow

1. **Make changes** on feature branch
2. **Add changeset** when making changes:

   ```bash
   pnpm changeset add
   ```

   Follow the prompts to describe your changes and select version bump type.

3. **Create PR** to `develop`
4. **Merge to develop** (Changeset validation runs automatically)

## Release Process

1. **Manual version bump in develop:**

   ```bash
   pnpm version
   ```

   This applies changesets, bumps versions, and updates changelogs.

2. **Create PR** from `develop` to `main`
3. **Merge to main** - This triggers the automated NPM publishing process:
   - **Build all packages** (`pnpm build`)
   - **Verify build output** (check dist files exist)
   - **Test package locally** (`npm pack`)
   - **Publish all changed packages to npm**
   - No automatic version bumping (done manually)
   - No sync back to develop (not needed)

## Manual Changeset Management

- **Add changeset:** `pnpm changeset add`
- **Apply changesets:** `pnpm version`
- **Check changeset status:** `pnpm changeset status`
- **Preview version changes:** `pnpm changeset version --dry-run`

## Local Testing

Before releasing, test the package locally:

```bash
# Build and test the package
cd packages/wirecam
npm run build
npm run test

# Create a local package for testing
npm pack

# Test installation in a new directory
mkdir test-install
cd test-install
npm init -y
npm install ../wirecam-0.1.3.tgz
```

This ensures the package works correctly before publishing.

## Version Bumping

- **Patch:** Bug fixes (0.0.1 → 0.0.2)
- **Minor:** New features (0.0.1 → 0.1.0)
- **Major:** Breaking changes (0.0.1 → 1.0.0)

## Setup Requirements

1. **NPM_TOKEN** secret must be configured in GitHub repository settings
2. Changeset validation runs automatically on PRs to `develop`

## Benefits of LEAN Workflow

- **Simpler:** No complex sync operations
- **More control:** Manual version management in develop
- **Reliable:** Fewer moving parts in CI pipeline
- **Transparent:** Clear separation between versioning and publishing
