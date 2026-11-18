# Release readiness — 0.7.0 Preview

- `npm test` validates the CLI, templates and regression tests.
- `npm pack --dry-run --json` lists files that would be published; this does **not** publish.
- `rawanide inspect <folder>` prints manifest metadata and structural diagnostics.
- `rawanide validate <folder>` and `pack` remain compatible with 0.6.0.
- The GitHub Packages package name is `@elhizazi1/extension-sdk`, scoped to the repository owner. Publishing requires GitHub Actions permissions and successful authentication.
- Android execution tests remain required for new runtime behavior. No new Android runtime behavior is introduced in 0.7.0.
- CLI validation is conservative and not a substitute for the Android host validator.
