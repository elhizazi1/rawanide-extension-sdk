// SDK 0.6.0: offline, explicit-confirmation edit example.
(function () {
  'use strict';
  var PANEL = 'local.sdk-safe-edit.panel';
  var pending = null;
  var busy = false;
  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function render(message) {
    var original = pending ? pending.original : '';
    return '<main style="font:14px sans-serif;padding:16px">' +
      '<h3>Safe selection edit</h3><p>Selected text (unchanged until you confirm):</p>' +
      '<pre style="white-space:pre-wrap;overflow-wrap:anywhere">' + esc(original) + '</pre>' +
      '<label for="replacement">Replacement text</label>' +
      '<textarea id="replacement" style="width:100%;box-sizing:border-box;min-height:90px">' + esc(original) + '</textarea>' +
      '<p><button id="apply" type="button">Confirm replacement</button></p>' +
      '<p role="status">' + esc(message || 'No changes have been made.') + '</p>' +
      '<script>document.getElementById("apply").addEventListener("click",function(){' +
      'RawanIDEPanel.postMessage(JSON.stringify({type:"apply",text:document.getElementById("replacement").value}));' +
      '});<\\/script>'.replace('<\\/script>','</script>') + '</main>';
  }
  rawanide.ui.registerPanel(PANEL, {title:'SDK Safe Edit',placement:'sheet',html:render('')});
  rawanide.commands.registerCommand('local.sdk-safe-edit.open', 'SDK Safe Edit: Open', function (ctx) {
    var editor = ctx && ctx.editor;
    var s = editor && editor.selection;
    if (!editor || !editor.filePath || !s || !Number.isInteger(s.start) ||
        !Number.isInteger(s.end) || s.start < 0 || s.end <= s.start || typeof s.text !== 'string' || !s.text.length) {
      rawanide.window.showWarningMessage('Select text in a saved file first.');
      return;
    }
    pending = {filePath:editor.filePath,start:s.start,end:s.end,original:s.text};
    rawanide.ui.updatePanel(PANEL,render('Review the replacement, then confirm.'));
    rawanide.ui.showPanel(PANEL);
  });
  rawanide.ui.onMessage(PANEL,function (message) {
    if (!message || message.type !== 'apply' || !pending || busy || typeof message.text !== 'string') return;
    if (message.text === pending.original) {
      rawanide.ui.updatePanel(PANEL,render('No change: replacement equals original.'));
      return;
    }
    if (!rawanide.editor || typeof rawanide.editor.applyEdits !== 'function') {
      rawanide.ui.updatePanel(PANEL,render('Editor write API is unavailable.'));
      return;
    }
    busy = true;
    var request = pending;
    // expected guards against overwriting changed text; host decides atomicity.
    Promise.resolve().then(function(){
      return rawanide.editor.applyEdits([{
        start:request.start,end:request.end,newText:message.text,expected:request.original
      }],{filePath:request.filePath});
    }).then(function (result) {
      if (result && result.ok) {
        pending = null; // prevent replay of a successful edit
        rawanide.ui.updatePanel(PANEL,'<div style="padding:16px;font-family:sans-serif">Replacement applied. Re-select text to edit again.</div>');
      } else {
        rawanide.ui.updatePanel(PANEL,render('Edit not applied: '+String(result && result.error || 'host rejected edit')));
      }
    }).catch(function (error) {
      rawanide.ui.updatePanel(PANEL,render('Edit failed: '+String(error && error.message || error)));
    }).then(function(){busy=false;});
  });
}());
