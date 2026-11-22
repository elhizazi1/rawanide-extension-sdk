<div align="center">

# RawanIDE Extension SDK

<p>
<a href="https://www.npmjs.com/package/@elhizazi1/extension-sdk"><img alt="npm version" src="https://img.shields.io/npm/v/@elhizazi1/extension-sdk?style=for-the-badge&color=19b9ad" /></a>
<a href="https://github.com/elhizazi1/rawanide-extension-sdk/actions"><img alt="Publish workflow" src="https://img.shields.io/github/actions/workflow/status/elhizazi1/rawanide-extension-sdk/publish.yml?style=for-the-badge&label=Publish" /></a>
<a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-555?style=for-the-badge" /></a>
</p>

### ✨ Build extensions. Validate with confidence. Package as `.r1`.

**Developer tools for RawanIDE Extension API 1.1 · SDK version 1.1.0**

[العربية](README.ar.md) · **English**

[Choose your path](#choose-your-path) · [Installation](#installation) · [Quick start](#quick-start) · [Commands](#cli-commands) · [Templates](#extension-templates) · [Publish](#publish-your-extension) · [Contributing](#contributing-and-maintenance)

</div>

---

<a id="overview"></a>

## 🌟 Overview

The SDK creates, validates, inspects, audits, and packages `.r1` extensions for RawanIDE. It is **not** the RawanIDE Android application, and it is **not** a GitHub/GitLab community repository template. It does not upload, register, or install anything: you build and check an extension here, then distribute it yourself (see [Publish your extension](#publish-your-extension)).

- 🧱 **Create** from six ready-made templates
- ✅ **Validate and audit** manifests and project structure
- 📦 **Package** to `.r1` with a single command
- 📱 **Run** the result inside RawanIDE on Android

<a id="choose-your-path"></a>

## 🧭 Choose your path

| You are… | You want to… | Go to |
| :-- | :-- | :-- |
| 👤 A RawanIDE user | Install an extension | In the app: **Extensions → Repositories → Add repository**, or the **Install .r1** button for a `.r1` file. The SDK is not needed. |
| 🧑‍💻 An extension developer | Create, test, and package an extension | [Quick start](#quick-start) |
| 🗂️ A repository publisher | Host a catalog (website + `repository.json`) of your extensions | [Publish your extension](#publish-your-extension) → community repository |
| 🤝 An SDK contributor or maintainer | Change, test, or release the SDK | [Contributing and maintenance](#contributing-and-maintenance) |

<a id="installation"></a>

## 📦 Installation

**Requirements:** Node.js 18 or newer. The main command is **`rawanide-sdk`** on Termux, Windows, macOS, and Linux. On Termux, a postinstall step configures the command launchers; it does nothing on other systems.

### From npm

```sh
npm install -g @elhizazi1/extension-sdk --registry=https://registry.npmjs.org/
rawanide-sdk help
```

### From a local npm package (`.tgz`)

To install from a downloaded `.tgz` (for example offline), use the file's actual path. The package file is named `elhizazi1-extension-sdk-<version>.tgz`. On Termux:

```sh
npm install -g /sdcard/Download/elhizazi1-extension-sdk-<version>.tgz
rawanide-sdk help
```

On Windows, macOS, or Linux:

```sh
npm install -g ./elhizazi1-extension-sdk-<version>.tgz
rawanide-sdk help
```

For a project-local install from npm, use `npm install --save-dev @elhizazi1/extension-sdk`, then `npx rawanide-sdk help`.

### From a source checkout

```sh
node bin/rawanide-sdk.mjs help
```

<a id="quick-start"></a>

## ⚡ Quick start

```sh
rawanide-sdk init hosted-js-panel my-panel
rawanide-sdk validate my-panel
rawanide-sdk audit my-panel
rawanide-sdk pack my-panel my-panel.r1
```

Where things go (relative to the directory you run the command from):

| Command | Result |
| :-- | :-- |
| `init <template> <name>` | A bare name creates `./workspace/projects/<name>/`. A path such as `./name` or `/abs/path` is used as given. |
| `validate`, `audit`, `inspect`, `pack <project>` | `<project>` is an existing path (checked first) or the bare name of a project in `workspace/projects/`. With no argument, the current directory is used. |
| `pack <project>` | Writes `<project-name>.r1` **inside the project folder**. |
| `pack <project> <file.r1>` | Writes `<file.r1>` relative to the current directory. It is **not** placed in `workspace/dist/`. |

`pack` validates first, then writes a deterministic archive (sorted entries, fixed timestamps, SHA-256 printed) of every file in the project folder except `.git`, `.hg`, `.svn`, `node_modules`, `.DS_Store`, `*.r1`, and `*.tmp`. That includes the template's `README` and `LICENSE`, so replace them with your own before packing. The output name must end in `.r1`, and symbolic links are rejected. `workspace/` is excluded from Git and from the npm package.

> 💡 **Tip:** from inside a project folder you can simply run `rawanide-sdk validate .` and `rawanide-sdk pack . my-panel.r1`.

Then test the `.r1` in the app: **Install .r1**, enable the extension, open a project, and run its command or action. A successful `pack` does not prove the extension runs on Android.

<a id="cli-commands"></a>

## 🧰 CLI commands

| Command | Purpose |
| :-- | :-- |
| `rawanide-sdk help` | Show usage |
| `rawanide-sdk init <template> <name>` | Create an extension project from a template |
| `rawanide-sdk validate <project> [--official] [--repository]` | Validate the manifest and structure |
| `rawanide-sdk audit <project> [--official] [--repository]` | Validate and add static checks and warnings (JSON report) |
| `rawanide-sdk inspect <project> [--official] [--repository]` | Print extension information (JSON report) |
| `rawanide-sdk pack <project> [output.r1] [--official] [--repository]` | Validate, then create a `.r1` archive |
| `rawanide-sdk test` | Run the SDK's own tests. **Source checkout only**; the `tests/` folder is not in the npm package. |
| `rawanide-sdk release-check` | Check SDK release readiness (maintainers) |

Commands exit with a non-zero status on failure, so they can run in CI. `--official` treats the extension as coming from an official source, which allows the `PROJECT_ACCESS` permission; community extensions should not use it. `--repository` also applies the community repository rules (see [Publish your extension](#publish-your-extension)). The older `rawanide` and `rawanide-sdk-desktop` names remain as compatibility aliases; use **`rawanide-sdk`** in new instructions.

<a id="extension-templates"></a>

## 🧩 Extension templates

| Template | What it demonstrates | Permissions |
| :-- | :-- | :-- |
| `declarative` | A minimal declarative manifest; add the contributions you need | none |
| `hosted-js` | A command registered by JavaScript (shows a toast) | `UI_ACCESS` |
| `hosted-js-panel` | A command that opens an HTML panel | `UI_ACCESS` |
| `hosted-js-selection-panel` | A context action on selected text that opens a read-only panel | `EDITOR_READ`, `UI_ACCESS` |
| `hosted-js-safe-edit` | Replacing selected text only after explicit confirmation | `EDITOR_READ`, `EDITOR_WRITE`, `UI_ACCESS` |
| `hosted-js-project-search` | Read-only project-wide file/text search using API 1.1 | `FILE_READ`, `UI_ACCESS` |

Each template contains `manifest.json`, `assets/icon.svg`, a `README` (English and Arabic), and a sample MIT `LICENSE` with `[YEAR]` and `[COPYRIGHT HOLDER]` placeholders. The two selection templates also contain `assets/context-action.svg`, a separate icon for the editor context action. Extension IDs such as `local.sdk-panel` are placeholders: choose a unique ID, review the permissions, and replace the placeholder icons and license text before publishing.

<a id="publish-your-extension"></a>

## 🚀 Publish your extension

The SDK never uploads anything. There are two ways to distribute what you build.

**1. Share the `.r1` file directly.** Users install it with **Install .r1** in the app.

**2. Publish through a community repository (GitHub or GitLab).** Use the GitHub or GitLab community repository template; both are separate projects from this SDK. Key points:

- Check the rules first: `rawanide-sdk validate . --repository` applies the same rules the repository builder enforces. The SDK templates already satisfy them.
  - `localizedMetadata.en` in the manifest (`localizedMetadata.ar` is used by the Arabic pages) and an existing `icon` file.
  - Runtime `declarative` or `hosted-js` (or none). A plain `validate` also accepts `preview-js`, but community repositories do not.
  - None of `TERMINAL_ACCESS`, `PROCESS_EXECUTION`, `DEVICE_FILES_READ`, `DEVICE_FILES_WRITE`.
  - A new `version` for every release: a published `.r1` is never rewritten.
- Put the extension's **source folder** in the repository's `extension-src/<name>/`. You do not need to add a `.r1`: the repository builder packs the folder itself, with the same packer as `rawanide-sdk pack` (same files, order, and timestamps), and records its SHA-256.
- Fill in `publisher`, `description`, and `category`: they are shown in the catalog (`rawanide-sdk audit . --repository` reminds you).
- If you write a manifest from scratch, add the localized metadata:

  ```json
  "localizedMetadata": {
    "en": { "name": "My Extension", "description": "What it does." },
    "ar": { "name": "إضافتي", "description": "ماذا تفعل." }
  }
  ```

- List the extension in the repository's `repo.config.json` (`src`, `releaseDate`, `changelog.en`, `tags`), then run `node tools/build.mjs`. To run `rawanide-sdk validate` on every extension first, install the SDK and use `RAWANIDE_SDK_VALIDATE=1 node tools/build.mjs` (POSIX shells, including Termux).

The repository templates' own README files describe the full steps.

<a id="quality-and-security"></a>

## 🛡️ Quality and security

| Check | What it establishes | What it does not establish |
| :-- | :-- | :-- |
| `validate` | Supported manifest and structure rules pass | Runtime behavior is correct, or a repository will accept the extension |
| `audit` | The SDK's audit rules report no blocking findings | A complete independent security review |
| `pack` | A `.r1` archive can be produced | Marketplace acceptance or Android compatibility |

Treat host APIs, permissions, and user data access as security-sensitive, and request only the permissions you need.

<a id="compatibility-and-limitations"></a>

## ⚙️ Compatibility and limitations

- SDK `1.1.0` is aligned with host API `1.1`. Existing API `1.0` extensions remain compatible; old templates keep their lowest required API `1.0`, and the new project-search template declares `1.1`.
- The TypeScript declarations (`@elhizazi1/extension-sdk/types`) cover a reviewed subset of the host API, not all of it; see [`docs/type-contract-0.11.md`](docs/type-contract-0.11.md). The host contract limits (`@elhizazi1/extension-sdk/contract`) are summarized in [`docs/compatibility.md`](docs/compatibility.md).
- Validation, audit, and packaging are static and conservative. They do not execute JavaScript or emulate Android. Test every extension in the RawanIDE app.
- Do not reuse published repository IDs or verification tokens, and do not modify the bytes of a published `.r1`.

<a id="contributing-and-maintenance"></a>

## 🤝 Contributing and maintenance

For people changing or releasing the SDK itself.

**Run the checks** from a source checkout:

```sh
npm test                    # all SDK tests (node --test tests/*.test.mjs)
npm run check:release       # release-check on all templates
npm run check:types         # typing contract tests
npm run check:types:compile # needs the TypeScript compiler (tsc)
npm run check:archives      # needs python3
npm run check:package       # npm pack --dry-run
```

**Shared with the repository templates.** `lib/zip.mjs` (the packer) and `community-rules.json` are copied byte for byte into the community repository templates (`tools/lib/zip.mjs`, `tools/community-rules.json`). Change them here first, then update the templates; `tests/repository-rules.test.mjs` guards the packer's fingerprint.

**Documentation.** [`docs/README.md`](docs/README.md) is the index. Files with a version number in their name or title are historical engineering notes.

**Reporting problems.** Include the SDK version, platform, CLI command, and the error output with sensitive data removed.

<a id="resources"></a>

## 🔗 Resources

| Resource | Link |
| :-- | :-- |
| RawanIDE Android app | [RawanIDE](https://github.com/elhizazi1/RawanIDE) |
| SDK source | [rawanide-extension-sdk](https://github.com/elhizazi1/rawanide-extension-sdk) |
| npm package | [@elhizazi1/extension-sdk](https://www.npmjs.com/package/@elhizazi1/extension-sdk) |
| Developer documentation | [RawanIDE Developers](https://rawanide.elhizazi.me/developers) |
| SDK documentation index | [`docs/README.md`](docs/README.md) |

<a id="license"></a>

## 📄 License

The SDK uses the MIT license; see [LICENSE](LICENSE). The license files inside extension templates are examples that their authors must review and customize.

---

<div align="center">

💚 **Made for the RawanIDE developer community.**

<sub>RawanIDE · Code. Build. Preview. Anywhere.</sub>

</div>

## Programmatic project search — API 1.1

New `workspace.findFiles` and `workspace.findText` search saved files, including closed files, without using the manual search UI or writing to the project. Both require `FILE_READ`, return Promises with explicit limits/cancellation, and run native filesystem work off the UI thread. See [search contract](docs/workspace-search-1.1.md) and [Arabic documentation](docs/workspace-search-1.1.ar.md).

```sh
rawanide-sdk init hosted-js-project-search my-project-search
```
