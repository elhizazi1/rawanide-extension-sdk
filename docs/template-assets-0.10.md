# Template assets in SDK 0.10.0

Every template includes `README.md`, `LICENSE` and `assets/icon.svg`. The placeholder SVG is an original generic icon and may be replaced. The manifest references the icon using the `icon` field. The default MIT license file has `[YEAR]` and `[COPYRIGHT HOLDER]` placeholders; it must be personalized or replaced before redistribution. `release-check` verifies template completeness.

The `apiVersion` value remains `1.0` because the Android host contract is separate from the SDK npm package version.
