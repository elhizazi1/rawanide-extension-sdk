# 0.9.0 release-candidate preparation (not published)

This is a preview, not a certified stable release.

## Local checks

Run from the SDK root:

```sh
npm test
node bin/rawanide.mjs release-check
node bin/rawanide.mjs audit templates/hosted-js-safe-edit
npm pack --dry-run
```

`release-check` statically checks all bundled templates, their manifests, and literal hosted-JS command registrations. It does **not** execute JavaScript inside Android, verify all dynamic commands, run TypeScript's compiler, verify community extensions at runtime, or publish a package.

## Release blockers

- Compare the TypeScript declarations to the actual Android host implementation, including return types and nullability.
- Add a TypeScript compilation fixture and negative type tests.
- Run a full compatibility matrix against community archives without redistributing their code.
- Verify publishing permissions and package scope with the repository owner.
- Preserve the last Android-confirmed SDK 0.6.0 and Termux-confirmed 0.8.0 as rollback references.
