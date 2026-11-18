# SDK Selection Panel Example

Template type: `hosted-js-selection-panel`. A context action that displays selected editor text.

## Get started

1. Replace `assets/icon.svg` with your own icon, or update the `icon` path in `manifest.json`.
2. Update the extension ID, publisher, name, version, description, and other metadata in `manifest.json`.
3. Review the requested permissions and remove any not required by your extension.
4. **Choose your license before distributing.** `LICENSE` contains a sample MIT license with `[YEAR]` and `[COPYRIGHT HOLDER]` placeholders. Replace those placeholders if you select MIT, or replace the entire file and update the `license` manifest field if you select another license.
5. Edit the implementation files as needed.

## Validate and package

From the SDK root (replace `<extension-folder>` with your project path):

```bash
node bin/rawanide.mjs validate <extension-folder>
node bin/rawanide.mjs audit <extension-folder>
node bin/rawanide.mjs pack <extension-folder> my-extension.r1
```

## Compatibility

- Manifest `apiVersion` remains `1.0` to match the current host contract. The SDK package version is independent.
- This is a development template, not a completed extension for publication.
- The icon is a placeholder; replace it before publishing.

### Selection context-action icon

`assets/context-action.svg` is a replaceable placeholder for the editor selection menu icon, separate from the extension icon `assets/icon.svg`. The `contextActions[0].icon` manifest property references it. Replace this SVG with your own icon, and update the manifest path if you rename it.
