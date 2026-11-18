/** Community-derived API 1.0 subset; not a complete Android host contract. */
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
export interface RawanIDEHost { commands: CommandApi; window: WindowApi; ui?: PanelApi; network?: NetworkApi; editor?: EditorApi; env?: { language?: string; [key: string]: unknown }; i18n?: { t(key: string, fallback?: string): string }; [key: string]: unknown; }
declare global { const rawanide: RawanIDEHost; }
export {};
