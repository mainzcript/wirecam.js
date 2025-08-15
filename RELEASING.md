# Release Guide

## Automated Release Workflow

This project uses an automated release process with Changesets and GitHub Actions for Git-Flow (develop → main → develop).

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

1. **When ready to release:** Create PR from `develop` to `main`
2. **Merge to main** - This triggers the automated release process:
   - Version bump & changelog generation based on consumed `.changeset` files
   - Git tags for all affected packages
   - Publish all changed packages to npm
   - Automatic sync PR from `main` back to `develop`

## Manual Changeset Management

- **Add changeset:** `pnpm changeset add`
- **Check changeset status:** `pnpm changeset status`
- **Preview version changes:** `pnpm changeset version --dry-run`

## Version Bumping

- **Patch:** Bug fixes (0.0.1 → 0.0.2)
- **Minor:** New features (0.0.1 → 0.1.0)
- **Major:** Breaking changes (0.0.1 → 1.0.0)

## Setup Requirements

1. **NPM_TOKEN** secret must be configured in GitHub repository settings
2. Changeset validation runs automatically on PRs to `develop`

## Troubleshooting

- If the sync PR fails, you can manually create a PR from `main` to `develop`
- Check GitHub Actions logs for detailed error information
- Ensure all changesets are properly formatted before merging to `develop`
