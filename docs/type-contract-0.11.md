# RawanIDE 0.11 Type Contract Review

Source checked: `RawanIDE_build.zip`, `HostedJsHarness.kt`, functions `commands.registerCommand`, `window.showInformationMessage/showWarningMessage/showErrorMessage/showToast/openFile`, `ui.registerPanel/updatePanel/showPanel/hidePanel/postMessage/onMessage`, and `editor.applyEdits`.

The declarations now reflect disposables for registrations, asynchronous `editor.applyEdits` and `window.openFile`, and the third optional `title` argument for `ui.updatePanel`. The `typing-smoke.ts` test includes both valid calls and intentional invalid calls guarded by `@ts-expect-error`.

**Limitations:** This is a reviewed subset, not the full host API. The community inventory is read-only and does not establish execution compatibility. TypeScript compiler availability is optional for `npm test` and required for `npm run check:types:compile`. No APK or API version was changed.
