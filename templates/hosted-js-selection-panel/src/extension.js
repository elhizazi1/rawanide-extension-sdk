// Offline, read-only context action based on verified community extension patterns.
(function () {
  'use strict';
  var PANEL_ID = 'local.sdk-selection-panel.panel';
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function render(text) {
    return '<div style="padding:16px;font-family:sans-serif">' +
      '<h3>Selected editor text</h3><pre style="white-space:pre-wrap;overflow-wrap:anywhere">' +
      escapeHtml(text) + '</pre><p>Read-only SDK example; no network or file writes.</p></div>';
  }
  rawanide.ui.registerPanel(PANEL_ID, {
    title: 'SDK Selection', placement: 'sheet', html: render('')
  });
  rawanide.commands.registerCommand('local.sdk-selection-panel.open', 'SDK Selection: Inspect', function (ctx) {
    var selection = ctx && ctx.editor && ctx.editor.selection;
    var selected = selection && selection.text ? String(selection.text) : '';
    if (!selected.trim()) {
      rawanide.window.showWarningMessage('Select text in the editor first.');
      return;
    }
    rawanide.ui.updatePanel(PANEL_ID, render(selected));
    rawanide.ui.showPanel(PANEL_ID);
  });
}());
