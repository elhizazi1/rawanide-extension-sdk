// Offline example; no network calls or editor modifications.
(function () {
  'use strict';
  var PANEL = 'local.sdk-panel.main';
  rawanide.ui.registerPanel(PANEL, { title: 'SDK Panel', placement: 'sheet', html: '<div style="padding:16px">Hello from the SDK panel</div>' });
  rawanide.commands.registerCommand('local.sdk-panel.open', 'SDK Panel: Open', function () {
    rawanide.ui.showPanel(PANEL);
  });
}());
