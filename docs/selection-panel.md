# Selection Panel example (0.5.0 Preview)

This offline, read-only example is based on patterns observed in the community `Translate Selection 1.0.1` package: `contextActions` pointing to a hidden runtime command, a command callback receiving `ctx.editor.selection.text`, and `rawanide.ui.registerPanel/updatePanel/showPanel`. It does **not** copy the community extension code.

The command intentionally does not appear in the general commands list (`hidden: true`). Select text in the editor and use the **Inspect selection** context action. The panel HTML escapes the selected text to avoid HTML injection. No external network or file modifications occur.

Node tests validate package structure and source patterns, not Android runtime behavior. Test in RawanIDE before calling the example verified.
