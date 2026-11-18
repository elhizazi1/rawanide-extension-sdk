<div align="center">

# RawanIDE Extension SDK

### Build extensions. Validate with confidence. Package as `.r1`.

**The official developer CLI for RawanIDE API 1.0 extensions.**

<p>
<a href="https://github.com/elhizazi1/rawanide-extension-sdk"><img alt="SDK version" src="https://img.shields.io/badge/SDK-1.0.0-19b9ad?style=for-the-badge" /></a>
<a href="https://github.com/elhizazi1/rawanide-extension-sdk/actions"><img alt="Publish workflow" src="https://img.shields.io/github/actions/workflow/status/elhizazi1/rawanide-extension-sdk/publish.yml?style=for-the-badge&label=Publish" /></a>
<a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-555?style=for-the-badge" /></a>
</p>

**[Get started](#-installation)** · **[CLI commands](#-cli-commands)** · **[Extension templates](#-extension-templates)** · **[RawanIDE for Android](https://github.com/elhizazi1/RawanIDE)** · **[Developer docs](https://rawanide.elhizazi.me/developers)**

</div>

---

## ✨ What you can build

Create `.r1` extensions from ready-to-use templates, check manifests against the RawanIDE API 1.0 contract, inspect packages, and produce installable archives. The SDK is maintained separately from the Android app.

| Capability | Purpose |
| :-- | :-- |
| 🧱 Scaffold | Generate a project from one of five extension templates |
| 🛡 Validate | Check package structure and manifests |
| 📦 Package | Build `.r1` archives for RawanIDE |
| 🔎 Inspect & audit | Examine extension projects and archives |
| 🧪 Test | Run the SDK's automated checks |

## 📦 Installation

Install from **GitHub Packages** under the `@elhizazi1` npm scope. GitHub Packages requires authentication; use a token with `read:packages` permission and repository access if required.

In your local `~/.npmrc` (never commit a real token):

```ini
@elhizazi1:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Set `GITHUB_TOKEN` in your local environment, then run:

```sh
npm install -g @elhizazi1/extension-sdk
rawanide-sdk help
```

> [!IMPORTANT]
> `${GITHUB_TOKEN}` is an environment-variable reference, **not a token value**. Never put credentials in the repository or share them in issue reports.

## ⚡ Quick start

```sh
rawanide-sdk init hosted-js-panel my-panel
rawanide-sdk validate my-panel
rawanide-sdk pack my-panel my-panel.r1
```

Named projects are created in `workspace/projects/`, and named packages are written to `workspace/dist/` relative to the **current working directory**. Explicit paths are also supported:

```sh
rawanide-sdk init hosted-js-panel "$HOME/my-panel"
rawanide-sdk pack "$HOME/my-panel" "$HOME/my-panel.r1"
```

## 🧰 CLI commands

| Command | What it does |
| :-- | :-- |
| `rawanide-sdk help` | Show CLI usage |
| `rawanide-sdk test` | Run SDK tests |
| `rawanide-sdk init <template> <name>` | Create an extension project |
| `rawanide-sdk validate <project>` | Validate an extension |
| `rawanide-sdk pack <project> <output.r1>` | Package an extension |
| `rawanide-sdk inspect <project>` | Inspect extension information |
| `rawanide-sdk audit <project>` | Audit an extension |
| `rawanide-sdk release-check` | Check SDK release readiness |

Run the CLI from the source checkout without global installation:

```sh
node bin/rawanide-sdk.mjs test
node bin/rawanide-sdk.mjs init hosted-js-panel my-panel
node bin/rawanide-sdk.mjs validate my-panel
node bin/rawanide-sdk.mjs pack my-panel my-panel.r1
```

The legacy `rawanide` command and `npm test` remain available for compatibility; **`rawanide-sdk` is the official CLI**.

## 🧩 Extension templates

| Template | Starting point |
| :-- | :-- |
| `declarative` | Manifest-based extension |
| `hosted-js` | Hosted JavaScript entry point |
| `hosted-js-panel` | Extension with a panel |
| `hosted-js-selection-panel` | Selection-oriented panel and context action |
| `hosted-js-safe-edit` | Selection-oriented safe editing workflow |

Each template includes a manifest, icon, README, and license template. Context-action templates include a **separate action icon**.

## ⚙️ Requirements & compatibility

- **Node.js 18+** for SDK tooling.
- **Python 3** for creating `.r1` archives.
- On Android shared storage, global npm installation can avoid local symlink limitations.
- SDK validation covers package structure and manifests; runtime behavior depends on the installed RawanIDE app.

## 🚀 Publishing & releases

The GitHub Actions workflow at `.github/workflows/publish.yml` publishes `@elhizazi1/extension-sdk` to **GitHub Packages** when a matching version tag is pushed. The workflow checks the version, runs SDK tests, and performs a release check before publishing. A local ZIP is not a published npm package.

## 🔗 Related projects & resources

| Resource | Link |
| :-- | :-- |
| 📱 RawanIDE Android app | [elhizazi1/RawanIDE](https://github.com/elhizazi1/RawanIDE) |
| 📖 Developer documentation | [rawanide.elhizazi.me/developers](https://rawanide.elhizazi.me/developers) |
| 📦 Package versions | [GitHub Packages](https://github.com/elhizazi1/rawanide-extension-sdk/packages) |
| 📚 Additional SDK notes | [`docs/`](docs/) |

## ⚖️ License

The SDK is MIT licensed; see [`LICENSE`](LICENSE). Templates include license files intended to be reviewed and customized by extension authors before redistribution.

---

<div align="center">

**Made for the RawanIDE developer community.**

<sub>RawanIDE · Code. Build. Preview. Anywhere.</sub>

</div>
