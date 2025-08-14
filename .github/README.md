# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated releases and development processes.

## Workflows

### Release Workflow (`.github/workflows/release.yml`)

**Trigger:** Push to `main` branch

**Purpose:** Automated release process that:

1. Bumps versions and generates changelogs based on changesets
2. Creates git tags for all affected packages
3. Publishes packages to npm
4. Creates a sync PR from `main` back to `develop`

**Requirements:**

- `NPM_TOKEN` secret must be configured in repository settings
- Changesets must be present in the repository

### Changeset Check (`.github/workflows/changeset-check.yml`)

**Trigger:** Pull requests to `develop` branch

**Purpose:** Validates that changesets are included when making changes

**What it does:**

- Runs `pnpm changeset status` to check for pending changesets
- Fails if no changesets are found (ensures proper release documentation)

## Setup Instructions

### 1. Configure NPM Token

1. Go to your npm account settings
2. Generate an access token with publish permissions
3. Add the token as a repository secret named `NPM_TOKEN`:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm access token

### 2. Configure Branch Protection (Optional)

Branch protection rules can be enabled later if needed:

**For `main` branch:**

- Require pull request reviews before merging
- Require status checks to pass before merging

**For `develop` branch:**

- Require pull request reviews before merging
- Require status checks to pass before merging

### 3. Verify Changeset Configuration

Ensure `.changeset/config.json` has:

- `baseBranch: "develop"`
- `access: "public"`

## Workflow Process

1. **Development:** Changes are made on feature branches with changesets
2. **Integration:** PRs are merged to `develop` (changeset validation runs)
3. **Release:** PR from `develop` to `main` triggers automated release
4. **Sync:** Automatic PR from `main` back to `develop` keeps branches in sync

## Troubleshooting

- **Release fails:** Check GitHub Actions logs for detailed error messages
- **Sync PR fails:** Manually create a PR from `main` to `develop`
- **Missing changesets:** Add changesets using `pnpm changeset add`
- **NPM publish fails:** Verify `NPM_TOKEN` is correctly configured
