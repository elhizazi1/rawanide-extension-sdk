# GitHub distribution / نسخة GitHub

This source tree and its README target **GitHub Packages**, registry `https://npm.pkg.github.com`, package `@elhizazi1/extension-sdk`, SDK **1.1.0**, host API **1.1**. The SDK executable code, templates, type declarations, contract and community rules are unchanged by this documentation/distribution correction. The npmjs distribution must be prepared and reviewed separately with its own README and publication registry. Do not publish this GitHub-specific directory to npmjs.

هذه نسخة جيتهب فقط: سجلها GitHub Packages، وإصدار SDK يبقى 1.1.0 وAPI يبقى 1.1. لم يُغيَّر كود SDK أو القوالب أو تعريفات الأنواع أو عقد API أو قواعد المجتمع. ستُجهَّز نسخة npmjs وتراجع بصورة مستقلة مع توثيقها وسجل نشرها؛ لا تستخدم هذا المجلد لنشر npmjs.

## Prepare and check / التجهيز والفحص

Merge the supplied files into the SDK repository, keeping any personal local credentials out of Git. The main changes are `README.md`, `README.ar.md`, `package.json`, `.github/workflows/publish.yml`, and this guide. All other SDK source files remain as supplied. Source updates alone do not change an already-published package's embedded README.

ادمج الملفات المرفقة في مستودع SDK. تتغير ملفات README باللغتين وpackage.json وسير النشر ويضاف هذا الدليل. تحديث السورس لا يبدّل تلقائيًا README داخل حزمة منشورة.

```sh
node bin/rawanide-sdk.mjs test
node bin/rawanide-sdk.mjs release-check
npm publish --dry-run --registry=https://npm.pkg.github.com
```

A dry run checks the package selected for upload; it does not prove that GitHub will accept publishing an already-used version. Never interpret a green dry run as a completed publication.

الفحص التجريبي يراجع الحزمة المختارة للرفع، ولا يثبت قبول GitHub إعادة نشر رقم سبق استخدامه. نجاحه ليس نشرًا فعليًا.

## Upload corrected source / رفع السورس المصحح

```sh
git add README.md README.ar.md package.json .github/workflows/publish.yml docs/GITHUB_DISTRIBUTION.md &&
git commit -m "docs: specialize SDK GitHub distribution" &&
git push origin main
```

Pushing `main` does not trigger this workflow's tag-based publication. In Actions, open **Publish SDK to GitHub Packages**, select **Run workflow**, choose `main`, and leave **publish** unchecked. This runs tests, release checks and a dry run only. When reproducing this workflow, keep that checkbox false until a real publication is intended. The workflow never deletes packages or tags.

رفع main لا يشغّل النشر المرتبط بالوسوم. افتح Actions ثم Publish SDK to GitHub Packages ثم Run workflow، واختر main واترك خيار publish غير مفعّل. يجري ذلك الاختبارات والفحص التجريبي فقط. لا يحذف سير العمل أي حزمة أو وسم.

## Existing 1.1.0 / الإصدار المنشور 1.1.0

The existing `v1.1.0` tag and its old workflow run still refer to the old commit. Do not rerun that old run to publish the corrected README, and do not force-move/delete the tag. Use the new manual workflow on the corrected `main` instead.

يبقى الوسم v1.1.0 وتشغيل Actions القديم مرتبطين بالمصدر القديم؛ إعادة تشغيله لا تنشر README المصحّح. لا تحرّك الوسم بالقوة أو تحذفه؛ استخدم التشغيل اليدوي الجديد على main المصحّح.

An existing GitHub Packages version cannot be replaced simply by running `npm publish` again. GitHub documents deleting one package version independently and restoring deleted versions subject to its conditions. The reviewed official documentation does not guarantee that the npm registry will accept reusing a deleted name/version combination. No same-version delete-and-republish was performed during preparation, so this delivery does not claim it has succeeded.

لا يكفي تكرار npm publish لاستبدال إصدار موجود. توثّق GitHub حذف إصدار بعينه دون بقية الإصدارات وإمكانية استعادته وفق شروطها. لم نجد في الوثائق الرسمية المراجَعة ضمانًا كافيًا بقبول سجل npm لجيتهب إعادة استخدام الاسم والرقم بعد الحذف، ولم ننفذ تجربة حذف وإعادة نشر فعلية؛ لذلك لا تدّعي هذه الملفات أن العملية نجحت.

If a same-version replacement is attempted after reviewing that limitation, limit any deletion to **1.1.0** through **View and manage all versions**, keep **1.0.0** and the source repository, and retain the original archive/record. Then manually run the corrected main workflow with **publish** enabled. If GitHub rejects reuse, stop; use the package's deleted-version restoration controls where available rather than deleting other versions or inventing a new number. Restoration of the original version would restore its original README, not the correction.

إذا جرت محاولة الاستبدال بنفس الرقم بعد فهم هذا القيد، فالحذف يقتصر على 1.1.0 من قائمة الإصدارات، مع إبقاء 1.0.0 والمستودع المصدري والاحتفاظ بنسخة من الحزمة الأصلية. بعدها يُستخدم تشغيل main المصحّح يدويًا مع تفعيل publish. إذا رفض GitHub إعادة الاستخدام فتوقف؛ استخدم استعادة الإصدار المحذوف حيث تتاح بدل حذف أي إصدارات أخرى أو رفع الرقم. استعادة الإصدار الأصلي تعيد README القديم أيضًا.

A successful publication must be verified from the actual package page/version, publication logs, and the embedded README. The package's **latest** selector should resolve to 1.1.0 after success. Local tests and a dry run alone do not verify this remote state.

بعد نجاح النشر يجب التحقق من سجل النشر وصفحة الحزمة والإصدار وREADME المضمّن فعليًا؛ لا تكفي الاختبارات المحلية أو الفحص التجريبي لإثبات حالة GitHub.

## References / المراجع

- [GitHub npm registry and authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [GitHub package version deletion and restoration](https://docs.github.com/en/packages/learn-github-packages/deleting-and-restoring-a-package)
