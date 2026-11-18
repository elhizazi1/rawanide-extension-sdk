# SDK 0.14.0 — managed workspace

From the SDK root:

```bash
node bin/rawanide.mjs init hosted-js-selection-panel demo
node bin/rawanide.mjs validate demo
node bin/rawanide.mjs pack demo demo.r1
```

- `init <template> <bare-name>` creates `workspace/projects/<bare-name>/`.
- `validate`, `inspect`, `audit`, and `pack` resolve an existing local path first, then a managed project by bare name.
- `pack <bare-name> <bare-file.r1>` creates `workspace/dist/<bare-file.r1>`; without an output argument it uses `<project-name>.r1` there.
- **Explicit paths** (such as `./demo`, `../my-project`, or `/storage/.../demo`) retain their legacy meaning. For an explicit archive output path, use `./demo.r1`.
- Existing root-level projects are not moved or deleted. A root-level project takes precedence over a managed project with the same name.
- Generated workspace files are excluded by `.gitignore` and the npm `files` allowlist.
- The `pack` command still requires Python 3. No Android API or template runtime behavior was changed.
