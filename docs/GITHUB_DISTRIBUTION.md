# GitHub Packages distribution

This guide is for SDK maintainers. Extension developers should use the installation and extension-development instructions in the main README.

Package: `@elhizazi1/extension-sdk` · SDK **1.1.0** · host API **1.1**.
Registry: `https://npm.pkg.github.com`.

## Validate the source distribution

Run these commands from a complete SDK source checkout:

```sh
node bin/rawanide-sdk.mjs test
node bin/rawanide-sdk.mjs release-check
npm publish --dry-run --registry=https://npm.pkg.github.com
```

Confirm that `package.json` identifies the intended package, version and registry before publishing. A dry run inspects the publication contents; it does not publish a package or establish that an existing version can be replaced.

## Publication workflow

The repository workflow supports version tags and manual execution. A release tag must match the package version. For manual execution, select the intended source branch and leave **publish** unchecked to run validation and a publication dry run. Enable **publish** only for an intended registry publication. The workflow uses `GITHUB_TOKEN` with package-write permission.

Publishing source commits does not update the README embedded in an existing registry package. Verify actual registry publications using their package version page and publication logs. Keep source documentation and published-package contents distinct when reporting a documentation correction.

## دليل نسخة GitHub Packages

هذا الدليل لمشرفي SDK. يجد مطوّر الإضافات تعليمات التثبيت وتطوير الإضافات في README الرئيسي.

الحزمة `@elhizazi1/extension-sdk`، وإصدار SDK هو **1.1.0** وإصدار API هو **1.1**. سجل هذه النسخة هو `https://npm.pkg.github.com`.

تُشغّل أوامر التحقق أعلاه من نسخة السورس الكاملة. يجب التحقق من اسم الحزمة وإصدارها وسجلها في `package.json`. الفحص التجريبي لا ينشر الحزمة ولا يثبت إمكانية استبدال إصدار منشور.

يدعم سير العمل وسوم الإصدارات والتشغيل اليدوي. يجب تطابق الوسم مع إصدار الحزمة. عند التشغيل اليدوي، يُترك خيار **publish** غير مفعّل للتحقق فقط، ويُفعّل عند قصد نشر إصدار في السجل. يستخدم سير العمل `GITHUB_TOKEN` بصلاحية كتابة الحزم.

تحديث ملفات السورس لا يغيّر README المضمّن داخل إصدار منشور. يُتحقق من النشر الفعلي عبر صفحة إصدار الحزمة وسجل عملية النشر.
