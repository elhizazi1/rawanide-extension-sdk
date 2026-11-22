/// <reference path="../types/rawanide.d.ts" />
const cmd = rawanide.commands.registerCommand('local.demo.run', 'Run', (ctx) => { void ctx?.editor?.selection?.text; });
cmd.dispose();
rawanide.window.showInformationMessage('ready');
rawanide.window.showErrorMessage('error');
rawanide.window.openFile('/tmp/example').then(() => {});
const ui = rawanide.ui;
if (ui) {
  const panel = ui.registerPanel('local.panel', {title: 'Panel', html: '<p>Hi</p>', placement: 'bottom'});
  ui.onMessage('local.panel', (message) => { void message.action; }).dispose();
  ui.updatePanel('local.panel', '<p>Updated</p>', 'New title');
  ui.postMessage('local.panel', {action: 'hello'});
  ui.hidePanel('local.panel');
  panel.dispose();
}
rawanide.editor?.applyEdits([{start: 0, end: 5, newText: 'Hello', expected: 'hello'}], {filePath:'/tmp/example'}).then(result => { if (!result.ok) console.log(result.error); });
// @ts-expect-error: edit offsets must be numbers
rawanide.editor?.applyEdits([{start:'0',end:1,newText:'x'}]);
// @ts-expect-error: handler must be callable
rawanide.commands.registerCommand('local.invalid', 'Invalid', 'not-a-function');
// @ts-expect-error: showToast takes a string
rawanide.window.showToast(42);

const workspace = rawanide.workspace;
if (workspace) {
 workspace.findFiles({include:['**/*.js'],maxResults:100}).then(result => { if(result.ok) result.files.forEach(file => { void file.path; void file.size; }); });
 workspace.findText('TODO',{caseSensitive:false,signal:new AbortController().signal}).then(result => { result.matches.forEach(match => { void match.line; void match.offset; }); });
 // @ts-expect-error: query is text
 workspace.findText(42);
 // @ts-expect-error: include globs are strings
 workspace.findFiles({include:[42]});
 // @ts-expect-error: maxFileBytes is only a text-search option
 workspace.findFiles({maxFileBytes:1000});
}
