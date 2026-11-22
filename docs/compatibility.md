# Compatibility

SDK 1.1.0 targets host API 1.1. `.r1` format stays at 1. Same-major extensions requiring API 1.0 remain supported. Canonical API versions use major.minor; legacy zero-patch spellings such as 1.0.0 normalize to 1.0. Newer minor requirements and other major versions are rejected.

Existing five templates use API 1.0 because they need only baseline interfaces. The new hosted-js-project-search template requires API 1.1. SDK version and host API version advance together for public capability changes; extension package versions are independent.

New APIs: workspace.findFiles(options) and workspace.findText(query, options). Both require FILE_READ. See workspace-search-1.1.md and workspace-search-1.1.ar.md for precise result, cancellation and coordinate semantics.

Existing permissions, archive limits, runtimes and .r1 conventions are retained. Type declarations cover a reviewed subset, now including the search contract; they do not declare every legacy host method. Static CLI checks and Node/JVM bridge tests do not substitute for on-device Android verification.
