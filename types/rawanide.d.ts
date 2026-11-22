/** Typed public subset for SDK 1.1.0 / host API 1.1; older APIs remain compatible. */
export interface EditorSelection { text?: string; start?: number; end?: number; }
export interface EditorContext { filePath?: string; selection?: EditorSelection; }
export interface CommandContext { editor?: EditorContext; [key: string]: unknown; }
export interface PanelMessage { type?: string; action?: string; [key: string]: unknown; }
export type ExtensionCommandHandler = (context?: CommandContext) => unknown;
export interface Disposable { dispose(): void; }
export interface CommandApi { registerCommand(id: string, title: string, handler: ExtensionCommandHandler): Disposable; }
export interface WindowApi { showToast(message: string): void; showInformationMessage(message: string): void; showWarningMessage(message: string): void; showErrorMessage(message: string): void; openFile(path: string): Promise<unknown>; }
export interface PanelConfig { title: string; html: string; placement?: string; icon?: string; [key: string]: unknown; }
export interface PanelApi { registerPanel(id: string, config: PanelConfig): Disposable; showPanel(id: string): void; hidePanel(id: string): void; updatePanel(id: string, html: string, title?: string): void; postMessage(id: string, payload: unknown): void; onMessage(id: string, callback: (message: PanelMessage) => void): Disposable; }
export interface NetworkRequest { method?: string; headers?: Record<string, string>; body?: string; }
export interface NetworkResponse { ok: boolean; status: number; text: string; }
export interface NetworkApi { fetch(url: string, options?: NetworkRequest): NetworkResponse; }
/** Editor offsets and expected-text semantics are host-dependent; test against your installed RawanIDE build. */
export interface Edit { start: number; end: number; newText: string; expected?: string; }
export interface EditResult { ok: boolean; error?: string; }
export interface EditorApi { applyEdits(edits: Edit[], options?: { filePath?: string }): Promise<EditResult>; }
export interface RawanIDEHost { commands: CommandApi; workspace?: WorkspaceApi; window: WindowApi; ui?: PanelApi; network?: NetworkApi; editor?: EditorApi; env?: { language?: string; [key: string]: unknown }; i18n?: { t(key: string, fallback?: string): string }; [key: string]: unknown; }
declare global { const rawanide: RawanIDEHost; }
export {};

/** Structural AbortSignal subset; DOM AbortController.signal is assignable without requiring lib.dom. */
export interface WorkspaceAbortSignal {
 readonly aborted: boolean;
 addEventListener(type: 'abort', listener: () => void, options?: {once?: boolean}): void;
 removeEventListener(type: 'abort', listener: () => void): void;
}
/** API 1.1: read-only search of saved files, not unsaved editor buffers. Requires FILE_READ. */
export interface WorkspaceSearchOptions {
 include?: string[]; exclude?: string[];
 /** Default 100; range 1..200. */ maxResults?: number;
 /** Default 10000; range 1..20000 visited files/directories. */ maxEntries?: number;
 signal?: WorkspaceAbortSignal;
}
export interface WorkspaceTextSearchOptions extends WorkspaceSearchOptions {
 /** Default true. Query is literal, not a regular expression. */ caseSensitive?: boolean;
 /** Default 262144; range 1..1048576 bytes per UTF-8 file. */ maxFileBytes?: number;
}
export interface WorkspaceFile { path: string; size: number; }
export interface WorkspaceTextMatch {
 path: string; line: number; column: number; endColumn: number;
 /** Zero-based UTF-16 offsets in the original decoded file; exclusive end. */
 offset: number; endOffset: number; text: string; preview: string; previewStartColumn: number;
}
export interface WorkspaceSearchResult {
 ok: boolean; error?: string; code?: 'INVALID_OPTIONS'|'PERMISSION_DENIED'|'NO_PROJECT'|'BUSY'|'PROJECT_CHANGED'|'IO_ERROR'|'BRIDGE_ERROR'|'TIMEOUT';
 files: WorkspaceFile[]; matches: WorkspaceTextMatch[];
 truncated: boolean; cancelled: boolean;
 limitReason: 'maxResults'|'maxEntries'|'maxBytes'|'timeout'|'cancelled'|null;
 visitedEntries: number; scannedFiles: number; skippedFiles: number; readBytes: number;
}
export interface WorkspaceApi {
 readFile(path: string): string; writeFile(path: string, text: string): boolean;
 exists(path: string): boolean; listDirectory(path?: string): Array<{name: string; isDirectory: boolean}>;
 getRootPath(): string;
 /** @since 1.1; supports *, ? and ** in project-relative include/exclude globs. */
 findFiles(options?: WorkspaceSearchOptions): Promise<WorkspaceSearchResult>;
 /** @since 1.1; query is a non-empty single-line literal of at most 256 UTF-16 units. */
 findText(query: string, options?: WorkspaceTextSearchOptions): Promise<WorkspaceSearchResult>;
}
