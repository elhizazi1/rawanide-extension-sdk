# SDK 0.6.0 — Safe selection edit

Template: `hosted-js-safe-edit`. Requires `EDITOR_READ`, `EDITOR_WRITE`, and `UI_ACCESS`.

Open a saved file, select text, choose **Preview safe replacement**, review the text, then tap **Confirm replacement**. No network requests. The example calls `rawanide.editor.applyEdits` with `expected` original text and the source file path. A successful edit clears the pending selection; errors are shown in the panel.

**Host verification required:** Whether `expected` prevents concurrent changes atomically, how offsets are counted (UTF-16 vs other), and whether panel events work with the target Android version must be tested on-device. Do not use on important unsaved work until confirmed.
