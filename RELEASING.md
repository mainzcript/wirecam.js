## GitHub Actions Workflows

- **Changeset Check:** Every PR to `develop` or `main` must include a changeset if packages are changed. The workflow will fail if missing.
- **Manual Release:** Maintainers can trigger a release manually via GitHub Actions ("Manual Release" workflow) on `main`.
- **Next Release (Snapshot):** Every push to `main` (except release commits) will publish a snapshot to npm with the `next` tag.

## Version bump via pnpx changeset version

Before triggering a manual release, always run:

```sh
pnpx changeset version
```

This will update all relevant package.json files and changelogs. Commit and push these changes to main before running the manual release workflow.

## Branch Protection

Only Pull Requests are allowed to merge into `main`. Direct pushes are prohibited. Ensure branch protection rules are enabled in your repository settings.
