# Releasing Guide

## GitHub Actions Workflows

- **Changeset Check:** Every PR to `develop` or `main` must include a changeset if packages are changed. The workflow will fail if missing.
- **Manual Release:** Maintainers trigger a release manually via GitHub Actions ("Manual Release" workflow) on `main`.
- **Next Release (Snapshot):** Every push to `main` (except release commits) publishes a snapshot to npm with the `next` tag.

## Version bump via pnpx changeset version

Before triggering a manual release, always run:

```sh
pnpx changeset version
```

This updates all relevant `package.json` files and changelogs. Commit and push these changes to `main` before running the manual release workflow.

## Workflow: develop vs. main

- On `develop`, only add changesets (with `pnpx changeset`).
- **Do not run `pnpx changeset version` or create release commits on `develop`.**
- When merging to `main`, run `pnpx changeset version` to bump versions and generate the release commit.
- This ensures all changesets are released together and versioning stays consistent.

## Branch Protection

Only Pull Requests are allowed to merge into `main`. Direct pushes are prohibited. Make sure branch protection rules are enabled in your repository settings.
