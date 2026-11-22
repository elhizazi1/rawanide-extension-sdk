# 🧩 SDK Selection Panel Example

[العربية](README.ar.md) · **English**

Template type: `hosted-js-selection-panel`. A context action that shows the selected editor text in a read-only panel.

| | |
| :-- | :-- |
| Runtime | `hosted-js` |
| Permissions | `EDITOR_READ`, `UI_ACCESS` |
| Entry point | `src/extension.js` |

> 💡 **Tip:** everything below runs from inside this folder; the SDK is the only thing to install.

<a id="get-started"></a>

## 🚀 Get started

1. Replace `assets/icon.svg` with your own icon, or update the `icon` path in `manifest.json`.
2. Edit `manifest.json`: set a unique `id` (the current one is a placeholder), and update `name`, `version`, `publisher`, `description`, and other metadata.
3. Review the requested permissions and remove any your extension does not need.
4. **Choose your license before distributing.** `LICENSE` contains a sample MIT license with `[YEAR]` and `[COPYRIGHT HOLDER]` placeholders. Replace those placeholders if you select MIT, or replace the entire file and update the `license` manifest field if you select another license.
5. Replace this `README.md` and `README.ar.md` with your extension's own. Every file in this folder is packed into the `.r1`.
6. Edit `src/extension.js`, and keep command IDs in the manifest and in `registerCommand` identical.

<a id="validate-and-package"></a>

## ✅ Validate and package

Install the SDK once (`npm install -g @elhizazi1/extension-sdk`; see the [SDK README](https://github.com/elhizazi1/rawanide-extension-sdk#installation)), then run from inside this folder:

```bash
rawanide-sdk validate .
rawanide-sdk audit .
rawanide-sdk pack . my-extension.r1
```

`pack` creates `my-extension.r1` in the current folder. Working from an SDK source checkout instead? Use `node <path-to-sdk>/bin/rawanide-sdk.mjs` in place of `rawanide-sdk`.

> 💡 Planning to publish in a community repository? Also run `rawanide-sdk validate . --repository`. This template already meets those rules.

<a id="test-in-rawanide"></a>

## 📱 Test in RawanIDE

Install `my-extension.r1` with **Install .r1** in the app, enable it, and open a project. Then select text in the editor and choose the **Inspect selection** context action. The underlying command is hidden, so it will not appear in the command list. Passing `validate` and `audit` does not prove the extension works on Android.

More detail: [selection-panel.md](https://github.com/elhizazi1/rawanide-extension-sdk/blob/HEAD/docs/selection-panel.md).

<a id="publish"></a>

## 🌍 Publish

To share the extension, see **Publish your extension** in the [SDK README](https://github.com/elhizazi1/rawanide-extension-sdk#publish-your-extension). This template already includes the `localizedMetadata` and catalog fields that community repositories require; re-check your changes with `rawanide-sdk validate . --repository`.

<a id="compatibility"></a>

## ⚙️ Compatibility

- Manifest `apiVersion` remains `1.0` to match the current host contract. The SDK package version is independent.
- This is a development template, not a completed extension for publication.
- The icon is a placeholder; replace it before publishing.

<a id="selection-context-action-icon"></a>

### 🖼️ Selection context-action icon

`assets/context-action.svg` is a replaceable placeholder for the editor selection menu icon, separate from the extension icon `assets/icon.svg`. The `contextActions[0].icon` manifest property references it. Replace this SVG with your own icon, and update the manifest path if you rename it.
