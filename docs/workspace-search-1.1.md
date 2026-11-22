# Workspace search — since API 1.1 / SDK 1.1.0

[العربية](workspace-search-1.1.ar.md)

Declare `apiVersion: "1.1"` and `FILE_READ` when relying on these methods. They run asynchronously on the host IO dispatcher and resolve structured results, including operational failures. They do not open the manual search UI, run commands, change files or search unsaved editor buffers.

```js
const files = await rawanide.workspace.findFiles({ include: ['**/*.js'], maxResults: 100 });
if (files.ok) files.files.forEach(file => console.log(file.path, file.size));

const controller = new AbortController();
const hits = await rawanide.workspace.findText('TODO', {
  include: ['**/*.js', '**/*.ts'], exclude: ['vendor/**'],
  caseSensitive: false, maxResults: 100, signal: controller.signal
});
// controller.abort() requests cooperative cancellation; it does not undo reads already completed.
if (!hits.ok) console.log(hits.code, hits.error);
else for (const hit of hits.matches) console.log(hit.path, hit.line, hit.column, hit.preview);
```

## Options

Both methods accept an optional object. Unknown keys and incorrectly typed/out-of-range values are rejected as `INVALID_OPTIONS`.

| Option | Default | Accepted values |
|---|---|---|
| include | `['**/*']` | 1..20 relative glob strings, each 1..256 UTF-16 units |
| exclude | `[]` | 0..20 additional relative globs |
| maxResults | 100 | integer 1..200 |
| maxEntries | 10000 | integer 1..20000 visited entries, including directories |
| signal | absent | AbortSignal or structurally equivalent signal |
| caseSensitive (findText only) | true | boolean |
| maxFileBytes (findText only) | 262144 | integer 1..1048576 |

Globs support `*` and `?` within a path segment, and `**` across directories. `**/` matches zero directories as well, so `**/*.js` includes `main.js`. Match paths are relative to the project root, case-sensitive and use `/`. Other punctuation is literal, not regex or brace expansion. Absolute patterns, `..` segments and drive-prefixed paths are rejected. Exclude patterns add to the host's directory exclusions.

The host always skips directories named `.git`, `node_modules`, `.gradle`, `.nuxt`, `.output`, `build`, `dist`, `coverage`, `.rawanide`; symlinks are not followed, even if their target is inside the project. Relative result paths longer than 1024 UTF-16 units and directory depth 48 or greater are skipped. The returned `skippedFiles` is a combined skip counter and may include skipped entries/directories; it is not a count of matching files alone.

The text query must be a literal single-line string of 1..256 UTF-16 units; empty, newline, CR and NUL queries are rejected. Text search accepts strict UTF-8 files without NUL bytes; binary, malformed UTF-8, oversized and unreadable files are skipped. Matches do not overlap. Case-insensitive matching uses the host's Unicode character comparison rather than locale-specific/full string folding.

## Results

Both methods resolve the same shape:

```ts
{
 ok: boolean; files: Array<{path:string; size:number}>;
 matches: Array<{path:string; line:number; column:number; endColumn:number;
   offset:number; endOffset:number; text:string; preview:string; previewStartColumn:number}>;
 truncated: boolean; cancelled: boolean;
 limitReason: 'maxResults'|'maxEntries'|'maxBytes'|'timeout'|'cancelled'|null;
 visitedEntries:number; scannedFiles:number; skippedFiles:number; readBytes:number;
 code?:string; error?:string;
}
```

`findFiles` fills `files` (byte size metadata) and leaves `matches` empty; `findText` does the inverse. Lines and columns are **1-based**, offsets **0-based UTF-16 units** and end positions **exclusive**, based on the original decoded file including CRLF. `text` is the actual matched substring. Preview is at most 512 UTF-16 units; `previewStartColumn` locates its start within the original line. CR is removed only from the preview's trailing line ending, not original offsets. Paths are always relative and sorted in returned results; directory enumeration order is unspecified, so capped result subsets can vary.

Check `ok` first, then `cancelled`, `truncated` and `skippedFiles`. `truncated:false` means no overall stop budget fired, not that every project file was searched successfully. Reaching a result cap is conservatively reported as truncated even if it happened to be the last match.

Host budgets: at most 2 concurrent searches per extension; 16 MiB bytes read per text request; a 5-second cooperative scan budget, checked between traversal/read steps. Blocking OS filesystem calls cannot be forcibly interrupted by that budget. The JS bridge also has a 12-second response timeout. No synchronous filesystem walk runs on the app UI thread. Native search waiting is excluded from the command script-time watchdog, while the existing overall command hard cap remains in force.

Abort may return partial results with `ok:true`, `cancelled:true`, `truncated:true` and reason `cancelled`. If the project changes, results are discarded and `PROJECT_CHANGED` is returned; stopping/disabling the runtime cancels its workers. Failure codes: `INVALID_OPTIONS`, `PERMISSION_DENIED`, `NO_PROJECT`, `BUSY`, `PROJECT_CHANGED`, `IO_ERROR`, `BRIDGE_ERROR`, `TIMEOUT`. Errors carry empty arrays and a message; exceptions in client-supplied getters may also become `BRIDGE_ERROR`. Do not assume the installed SDK or host version from an extension's own version.
