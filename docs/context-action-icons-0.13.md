# Context action icons (0.13.0)

The extension icon (`manifest.icon`) and editor selection action icon (`manifest.contextActions[].icon`) are separate. Both selection-enabled templates now include a distinct replaceable `assets/context-action.svg`. The manifest references the SVG and validation checks the path. This matches the pattern used by the working community Translate Selection extension.

This is an SDK template-only change; it does not alter the Android host. Existing generated projects are unchanged until their manifest and assets are updated.
