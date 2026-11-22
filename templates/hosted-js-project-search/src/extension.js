'use strict';
rawanide.commands.registerCommand('example.project-search.run', 'Find TODO in project', async function () {
  const ar = rawanide.i18n && /^ar(?:-|$)/i.test(rawanide.i18n.locale || 'en');
  const files = await rawanide.workspace.findFiles({ include: ['**/*.js'], maxResults: 50 });
  const result = await rawanide.workspace.findText('TODO', { include: ['**/*.js'], maxResults: 50 });
  if (!files.ok || !result.ok) return { message: (ar ? 'تعذّر البحث: ' : 'Search failed: ') + (files.error || result.error) };
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const title = ar ? 'نتائج بحث المشروع' : 'Project search results';
  const rows = result.matches.map(hit => '<li><code dir="ltr">' + escape(hit.path + ':' + hit.line + ':' + hit.column) + '</code><pre>' + escape(hit.preview) + '</pre></li>').join('');
  const note = result.cancelled || result.truncated || files.truncated ? (ar ? 'نتائج جزئية؛ راجع حدود البحث.' : 'Partial results; review search limits.') : (ar ? 'ملفات محفوظة على القرص فقط.' : 'Saved files on disk only.');
  const html = '<!doctype html><html dir="' + (ar?'rtl':'ltr') + '"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:14px system-ui;padding:14px;background:var(--rawan-surface,#fff);color:var(--rawan-on-surface,#222)}pre,code{white-space:pre-wrap;overflow-wrap:anywhere}li{margin:12px 0}</style><h2>' + escape(title) + '</h2><p>' + files.files.length + ' JS · ' + result.matches.length + ' TODO</p><p>' + escape(note) + '</p><ol>' + rows + '</ol></html>';
  rawanide.ui.registerPanel('example.project-search.results', { title, html, placement:'bottom' });
  rawanide.ui.showPanel('example.project-search.results');
  return { message: title };
});
