# RawanIDE Extension SDK

Official **1.0.0** SDK for creating, validating, inspecting and packaging RawanIDE API 1.0 `.r1` extensions.

## Install from GitHub Packages

GitHub Packages uses the `@elhizazi1` npm scope. Configure npm authentication with a GitHub token that has `read:packages` permission (and repository access if required):

```ini
@elhizazi1:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Save these lines in `~/.npmrc`, set `GITHUB_TOKEN` in your environment, then install:

```sh
npm install -g @elhizazi1/extension-sdk
rawanide-sdk help
```

The SDK can also be used directly from its source directory:

```sh
node bin/rawanide-sdk.mjs test
node bin/rawanide-sdk.mjs init hosted-js-panel my-panel
node bin/rawanide-sdk.mjs validate my-panel
node bin/rawanide-sdk.mjs pack my-panel my-panel.r1
```

After global installation, replace `node bin/rawanide-sdk.mjs` with `rawanide-sdk`:

```sh
rawanide-sdk test
rawanide-sdk init hosted-js-selection-panel my-selection
rawanide-sdk validate my-selection
rawanide-sdk pack my-selection my-selection.r1
rawanide-sdk inspect my-selection
rawanide-sdk audit my-selection
rawanide-sdk release-check
```

`init` creates named projects under `workspace/projects/`, and `pack` writes named `.r1` files under `workspace/dist/`. When using the `rawanide-sdk` CLI, both locations are relative to the current working directory, so globally installed packages do not need write access to the package installation directory. For example: `rawanide-sdk init hosted-js-panel "$HOME/my-panel"` and `rawanide-sdk pack "$HOME/my-panel" "$HOME/my-panel.r1"`.

Five templates are included: `declarative`, `hosted-js`, `hosted-js-panel`, `hosted-js-selection-panel`, and `hosted-js-safe-edit`. Each includes its own manifest, icon, README and license. Context-action templates include a separate action icon.

## Publishing

This repository publishes `@elhizazi1/extension-sdk` to **GitHub Packages** via `.github/workflows/publish.yml` when the `v1.0.0` tag is pushed. GitHub Actions requires `packages: write` and uses `GITHUB_TOKEN`. The workflow runs the SDK tests and release check before publishing. **A local ZIP is not a published package.**

The legacy `rawanide` CLI and `npm test` remain available for compatibility. The official CLI is `rawanide-sdk`.

## Requirements

Node.js 18 or newer; Python 3 is required for creating `.r1` archives. On Android shared storage, npm global installation is preferable to local installation when symlinks are unsupported.

## Scope

Checks validate package structure and manifests; Android runtime behavior depends on the installed RawanIDE app. The SDK does not change the Android application.

MIT licensed. See template licenses and `docs/` for additional details.
