# Command discovery fix

Compared user-supplied `extension.zip` API Explorer 1.2.0 and Editor Zoom 1.0.2 packages with SDK 0.2.0. Working packages declare commands in `manifest.json` with `id`, `title`, `runtime: true`, and `group`; their JS registers the same command IDs. SDK 0.2.0 only registered a command in JS. This 0.3.0 preview declares it and changes activation to `onCommand`, with `UI_ACCESS` for the toast.

**Test limit:** Static checks do not prove command visibility in the Android app. Test by installing the built `.r1`, enabling it, opening a project, searching Extension Commands for `Hello`, and invoking the command.
