# Contributing

Thank you for contributing!

## Changesets required for package changes

If your Pull Request changes any code in `packages/`, you **must** include a changeset. This ensures versioning and changelogs stay consistent.

To add a changeset, run:

```sh
pnpx changeset
```

Follow the prompts to describe your change and select affected packages. This will create a Markdown file in `.changeset/`.

Your PR will fail CI if a changeset is missing for package changes.
