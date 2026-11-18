# 0.8.0 compatibility audit (preview)

This release adds a **static** `audit` command and a read-only manifest field inventory from 22 community extension archives supplied for SDK development. The archives are not bundled or redistributed.

`node bin/rawanide.mjs audit templates/hosted-js-safe-edit`

`audit` checks the same manifest constraints as `validate` and compares literal hosted-JS command registrations against manifest commands. It does not execute JavaScript, emulate Android, validate dynamic command IDs, or guarantee extension runtime behavior.

Type declarations are a community-derived subset, not a complete host API contract. For real compatibility, test the generated `.r1` on RawanIDE.
