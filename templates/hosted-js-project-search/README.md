# Project search example (API 1.1)

[العربية](README.ar.md)

A hosted-js extension that finds JavaScript files and literal TODO matches across saved project files, including closed documents. It opens a read-only results panel. Nothing runs automatically on open; invoke the declared command.

Requires host API 1.1 and FILE_READ. UI_ACCESS shows the panel. Replace assets/icon.svg and edit the ID, publisher, version, translations and LICENSE before publishing.

```sh
rawanide-sdk validate .
rawanide-sdk audit . --repository
rawanide-sdk pack .
```

The `.r1` is created in this project directory by default. See the SDK workspace-search docs for limits, UTF-16 coordinates, cancellations and partial results. The methods resolve structured results: check `ok`, `cancelled`, `truncated` and `skippedFiles`. The example does not read unsaved buffers, execute matches, edit files or make network requests.
