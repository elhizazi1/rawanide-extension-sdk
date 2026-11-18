# Source compatibility review — first pass

**Source:** user-supplied `RawanIDE_build.zip` (Android app source).

Confirmed from `ExtensionContract.kt` and `ExtensionPackageValidator.kt`:
- API version `1.0`; `.r1` ZIP; root `manifest.json` with `extension.json` fallback.
- Runtimes: `declarative`, `hosted-js`, `preview-js`.
- 100 MiB compressed cap, 2,000 ZIP entries, 512 KiB manifest cap, 300 MiB uncompressed cap.
- Manifest fields `id`, `name`, `version`; hosted JS requires existing `entrypoint`.
- `PROCESS_EXECUTION` is declared but reserved; `PROJECT_ACCESS` is official-source-only under standard community policy.
- Network permissions include `allowedDomains` and `unrestrictedNetwork` constraints.
- `HostedJsHarness.kt` exposes `globalThis.rawanide` and several namespaces, including `editor`, `workspace`, `diagnostics`, `extensions`, `env`, `statusBar`, `keybindings`, `window10`, and `languages10`.

**Still to verify before SDK v1.0.0:** full JS method signatures, actual permission enforcement for every API, command/activation semantics, `preview-js` repository policy, documentation-by-documentation parity, archive trust/signature behavior, integration tests with real community packages.

The CLI implements a **conservative subset** of host validation; it is not a substitute for Android installation tests.
