# SDK documentation index / فهرس وثائق SDK

[← SDK README](../README.md) · [العربية](../README.ar.md)

This folder holds the **current reference notes** for the SDK. Notes written during earlier previews live in the source repository under [`docs/history/`](https://github.com/elhizazi1/rawanide-extension-sdk/tree/HEAD/docs/history); they are not part of the npm package. Most files are in English.

<a id="current-reference"></a>

## 📗 Current reference

| File | What it covers |
| :-- | :-- |
| [`workspace-0.14.md`](workspace-0.14.md) | The managed `workspace/` folder, and where `init` and `pack` write files |
| [`template-assets-0.10.md`](template-assets-0.10.md) | Files every template contains, and the license placeholders |
| [`context-action-icons-0.13.md`](context-action-icons-0.13.md) | Extension icon versus context-action icon |
| [`selection-panel.md`](selection-panel.md) | The `hosted-js-selection-panel` template |
| [`safe-edit.md`](safe-edit.md) | The `hosted-js-safe-edit` template, and what must be verified on a device |
| [`type-contract-0.11.md`](type-contract-0.11.md) | What the TypeScript declarations cover (a reviewed subset) |
| [`compatibility.md`](compatibility.md) | Host contract limits confirmed from the app source |
| [`archive-integration-0.12.md`](archive-integration-0.12.md) | Local packaging tests (`npm run check:archives`) |

<a id="historical-notes"></a>

## 🕰️ Historical notes

Kept in the source repository for traceability. They describe earlier previews, not instructions for the current release.

`command-fix.md` (why commands must be declared in the manifest) · `compatibility-0.8.md` (introduction of `audit`) · `release-readiness.md` (0.7.0) · `release-candidate-0.9.md` (0.9.0) · three JSON inventories of community extension archives (read-only, no extension code).

---

## بالعربية

تضم هذه المجلدات **المراجع الحالية** لـ SDK. أما الملاحظات التي كُتبت أثناء الإصدارات التجريبية السابقة فمكانها `docs/history/` في المستودع المصدري، وهي ليست جزءًا من حزمة npm. معظم الملفات بالإنجليزية.

**المراجع الحالية:** `workspace-0.14.md` (مجلد workspace وأماكن كتابة `init` و`pack`) · `template-assets-0.10.md` (ملفات القوالب وعناصر الترخيص المؤقتة) · `context-action-icons-0.13.md` (أيقونة الإضافة مقابل أيقونة الإجراء السياقي) · `selection-panel.md` و`safe-edit.md` (قالبان) · `type-contract-0.11.md` (ما تغطيه تعريفات TypeScript) · `compatibility.md` (حدود عقد المضيف) · `archive-integration-0.12.md` (اختبارات التغليف المحلية).

## API 1.1 project search

- [Workspace search contract](workspace-search-1.1.md)
- [توثيق البحث في المشروع](workspace-search-1.1.ar.md)

## Distribution maintainers / مشرفو التوزيع

- [GitHub Packages distribution](GITHUB_DISTRIBUTION.md)
- [npm distribution](NPM_DISTRIBUTION.md)

These guides cover SDK distribution maintenance. Extension developers should follow the main README to build and publish their own extensions.

تخص هذه الأدلة صيانة توزيع SDK. يتبع مطوّر الإضافات README الرئيسي لبناء إضافاته ونشرها.
