<div align="center">

# RawanIDE Extension SDK

### Build extensions. Validate with confidence. Package as `.r1`.

**The official developer CLI for RawanIDE API 1.0 extensions.**

<p>
<a href="https://www.npmjs.com/package/@elhizazi1/extension-sdk"><img alt="npm version" src="https://img.shields.io/npm/v/@elhizazi1/extension-sdk?style=for-the-badge&color=19b9ad" /></a>
<a href="https://github.com/elhizazi1/rawanide-extension-sdk/actions"><img alt="Publish workflow" src="https://img.shields.io/github/actions/workflow/status/elhizazi1/rawanide-extension-sdk/publish.yml?style=for-the-badge&label=Publish" /></a>
<a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-555?style=for-the-badge" /></a>
</p>

**[Get started](#-installation)** · **[CLI commands](#-cli-commands)** · **[Extension templates](#-extension-templates)** · **[npm package](https://www.npmjs.com/package/@elhizazi1/extension-sdk)** · **[RawanIDE for Android](https://github.com/elhizazi1/RawanIDE)** · **[Developer docs](https://rawanide.elhizazi.me/developers)**

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

The RawanIDE Extension SDK is distributed through **npmjs** and **GitHub Packages**. Both use the same package name, `@elhizazi1/extension-sdk`. Choose one registry for installation.

### Option 1 — npmjs (recommended)

The public npm registry requires **no GitHub token**.

```sh
npm install -g @elhizazi1/extension-sdk --registry=https://registry.npmjs.org/
rawanide-sdk help
```

To install the SDK locally in a project:

```sh
npm install --save-dev @elhizazi1/extension-sdk --registry=https://registry.npmjs.org/
npx rawanide-sdk help
```

To install a specific version:

```sh
npm install -g @elhizazi1/extension-sdk@1.0.0 --registry=https://registry.npmjs.org/
```

> [!TIP]
> If you previously configured `@elhizazi1` to use GitHub Packages, switch the scope back to npmjs before installing:
>
> ```sh
> npm config set @elhizazi1:registry https://registry.npmjs.org/
> ```

### Option 2 — GitHub Packages (alternative)

GitHub Packages requires authentication for npm package installation. Use a **GitHub personal access token (classic)** with `read:packages` permission, and ensure your account has access to the package.

Configure the scoped registry in your local `~/.npmrc`:

```ini
@elhizazi1:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Set the `GITHUB_TOKEN` environment variable locally to your own token, then install:

```sh
npm install -g @elhizazi1/extension-sdk
rawanide-sdk help
```

For a project-local installation:

```sh
npm install --save-dev @elhizazi1/extension-sdk
npx rawanide-sdk help
```

> [!IMPORTANT]
> `${GITHUB_TOKEN}` is an environment-variable reference, **not an actual token**. Never commit real credentials to the repository or include them in issue reports. Do not commit a project `.npmrc` containing a token.

### Switching between registries

The `@elhizazi1` scope can point to only one default registry at a time in your npm configuration. Check its current setting:

```sh
npm config get @elhizazi1:registry
```

Use npmjs (recommended):

```sh
npm config set @elhizazi1:registry https://registry.npmjs.org/
```

Or use GitHub Packages (with authentication configured as above):

```sh
npm config set @elhizazi1:registry https://npm.pkg.github.com/
```

The compatibility command is also available after installation:

```sh
rawanide --help
```

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

The resulting `.r1` archive can be installed in a compatible RawanIDE application.

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

The SDK is available through **npmjs** (recommended for developers) and **GitHub Packages** (an additional distribution channel).

The existing GitHub Actions workflow at `.github/workflows/publish.yml` publishes to **GitHub Packages** when a matching version tag is pushed. The workflow checks the version, runs SDK tests, and performs a release check before publishing. It does **not** automatically publish to npmjs.

For maintainers, after updating the version, running checks, and reviewing the package contents, publish a new version to npmjs with:

```sh
npm publish --access public --registry=https://registry.npmjs.org/
```

Publishing requires an authorized npm account and the registry's applicable authentication requirements. Every published version is immutable: use a new version for each update (for example, `1.0.1` for a patch or `1.1.0` for a backward-compatible feature). A local ZIP is not a published npm package.

## 🔗 Related projects & resources

| Resource | Link |
| :-- | :-- |
| 📱 RawanIDE Android app | [elhizazi1/RawanIDE](https://github.com/elhizazi1/RawanIDE) |
| 📖 Developer documentation | [rawanide.elhizazi.me/developers](https://rawanide.elhizazi.me/developers) |
| 📦 Official npm package | [@elhizazi1/extension-sdk](https://www.npmjs.com/package/@elhizazi1/extension-sdk) |
| 🐙 GitHub Packages | [GitHub package registry](https://github.com/elhizazi1/rawanide-extension-sdk/packages) |
| 📚 Additional SDK notes | [`docs/`](docs/) |

## ⚖️ License

The SDK is MIT licensed; see [`LICENSE`](LICENSE). Templates include license files intended to be reviewed and customized by extension authors before redistribution.

---

<div align="center">

**Made for the RawanIDE developer community.**

<sub>RawanIDE · Code. Build. Preview. Anywhere.</sub>

</div>
