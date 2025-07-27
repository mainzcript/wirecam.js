# Contributing

Thank you for your interest in contributing!

## How to contribute

1. **Fork** this repository on GitHub.
2. **Create a feature branch** in your fork (e.g. `feature/my-cool-change`).
3. **Make your changes** (add tests if possible).
4. **If you change any code in `packages/`, you must add a changeset:**
   ```sh
   pnpx changeset
   ```
   Follow the prompts to describe your change and select affected packages. This will create a Markdown file in `.changeset/`.
5. **Push your branch** to your fork.
6. **Create a Pull Request** against the `develop` branch of this repository.

Your PR will fail CI if a changeset is missing for package changes.

Thank you for helping to improve this project!
