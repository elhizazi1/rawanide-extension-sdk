<div align="center">

# RawanIDE Extension SDK

<p>
<a href="https://www.npmjs.com/package/@elhizazi1/extension-sdk"><img alt="npm version" src="https://img.shields.io/npm/v/@elhizazi1/extension-sdk?style=for-the-badge&color=19b9ad" /></a>
<a href="https://github.com/elhizazi1/rawanide-extension-sdk/actions"><img alt="Publish workflow" src="https://img.shields.io/github/actions/workflow/status/elhizazi1/rawanide-extension-sdk/publish.yml?style=for-the-badge&label=Publish" /></a>
<a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-555?style=for-the-badge" /></a>
</p>

### ✨ أنشئ الإضافات، وتحقق من سلامتها، وحوّلها إلى حزم `.r1`.

**أدوات المطورين لواجهة إضافات RawanIDE API 1.1 · إصدار SDK 1.1.0**

**العربية** · [English](README.md)

[اختر مسارك](#اختر-مسارك) · [التثبيت](#التثبيت) · [بداية سريعة](#بداية-سريعة) · [الأوامر](#أوامر-سطر-الأوامر) · [القوالب](#قوالب-الإضافات) · [النشر](#انشر-إضافتك) · [المساهمة](#المساهمة-والصيانة)

</div>

---

<a id="نظرة-عامة"></a>

## 🌟 نظرة عامة

يُستخدم SDK لإنشاء إضافات RawanIDE بصيغة `.r1` والتحقق منها وفحصها وتدقيقها وتغليفها. وهو **ليس** تطبيق RawanIDE لنظام Android، وليس قالب مستودع مجتمع GitHub أو GitLab. ولا يرفع شيئًا ولا يسجّله ولا يثبّته: تبني الإضافة وتفحصها هنا، ثم توزّعها بنفسك (راجع [انشر إضافتك](#انشر-إضافتك)).

- 🧱 **أنشئ** من ستة قوالب جاهزة
- ✅ **تحقق وأجرِ تدقيقًا** لـ Manifest وبنية المشروع
- 📦 **غلّف** إلى `.r1` بأمر واحد
- 📱 **شغّل** النتيجة داخل RawanIDE على Android

<a id="اختر-مسارك"></a>

## 🧭 اختر مسارك

| أنت… | تريد… | اذهب إلى |
| :-- | :-- | :-- |
| 👤 مستخدم RawanIDE | تثبيت إضافة | من التطبيق: **الإضافات ← المستودعات ← إضافة مستودع**، أو زر **تثبيت .r1** لملف `.r1`. لا تحتاج إلى SDK. |
| 🧑‍💻 مطوّر إضافات | إنشاء إضافة واختبارها وتغليفها | [بداية سريعة](#بداية-سريعة) |
| 🗂️ ناشر مستودع | استضافة فهرس (موقع + `repository.json`) لإضافاتك | [انشر إضافتك](#انشر-إضافتك) ← مستودع مجتمع |
| 🤝 مساهم في SDK أو مشرف عليه | تعديل SDK أو اختباره أو إصداره | [المساهمة والصيانة](#المساهمة-والصيانة) |

<a id="التثبيت"></a>

## 📦 التثبيت

**المتطلبات:** Node.js 18 أو أحدث. الأمر الموحد هو **`rawanide-sdk`** على Termux وWindows وmacOS وLinux. على Termux تضبط خطوة ما بعد التثبيت مشغّلات الأوامر، ولا تفعل شيئًا على الأنظمة الأخرى.

### من npm

```sh
npm install -g @elhizazi1/extension-sdk --registry=https://registry.npmjs.org/
rawanide-sdk help
```

### من حزمة npm محلية (`.tgz`)

للتثبيت من ملف `.tgz` منزَّل (مثلًا دون اتصال)، استخدم مساره الفعلي. اسم ملف الحزمة `elhizazi1-extension-sdk-<version>.tgz`. على Termux:

```sh
npm install -g /sdcard/Download/elhizazi1-extension-sdk-<version>.tgz
rawanide-sdk help
```

على Windows أو macOS أو Linux:

```sh
npm install -g ./elhizazi1-extension-sdk-<version>.tgz
rawanide-sdk help
```

للتثبيت داخل مشروع من npm، استخدم `npm install --save-dev @elhizazi1/extension-sdk` ثم `npx rawanide-sdk help`.

### من المشروع المصدري

```sh
node bin/rawanide-sdk.mjs help
```

<a id="بداية-سريعة"></a>

## ⚡ بداية سريعة

```sh
rawanide-sdk init hosted-js-panel my-panel
rawanide-sdk validate my-panel
rawanide-sdk audit my-panel
rawanide-sdk pack my-panel my-panel.r1
```

أين تُحفظ الملفات (نسبةً إلى المجلد الذي شغّلت منه الأمر):

| الأمر | النتيجة |
| :-- | :-- |
| `init <template> <name>` | الاسم المجرد ينشئ `./workspace/projects/<name>/`. أما مسار مثل `./name` أو `/abs/path` فيُستخدم كما هو. |
| `validate` و`audit` و`inspect` و`pack <project>` | `<project>` مسار موجود (يُفحص أولًا) أو اسم مجرد لمشروع داخل `workspace/projects/`. وعند عدم تحديده يُستخدم المجلد الحالي. |
| `pack <project>` | يكتب `<project-name>.r1` **داخل مجلد المشروع**. |
| `pack <project> <file.r1>` | يكتب `<file.r1>` نسبةً إلى المجلد الحالي، و**لا** يضعه في `workspace/dist/`. |

يتحقق `pack` أولًا، ثم ينشئ أرشيفًا حتميًا (ترتيب ثابت وطوابع زمنية ثابتة، وتُطبع بصمة SHA-256) يضم كل ملفات مجلد المشروع عدا `.git` و`.hg` و`.svn` و`node_modules` و`.DS_Store` و`*.r1` و`*.tmp`. ويشمل ذلك `README` و`LICENSE` الخاصين بالقالب، فاستبدلهما بملفاتك قبل التغليف. يجب أن ينتهي اسم الملف الناتج بـ `.r1`، وتُرفض الروابط الرمزية. ويُستثنى `workspace/` من Git ومن حزمة npm.

> 💡 **نصيحة:** من داخل مجلد المشروع يكفي أن تكتب `rawanide-sdk validate .` و`rawanide-sdk pack . my-panel.r1`.

ثم اختبر ملف `.r1` في التطبيق: **تثبيت .r1**، فعّل الإضافة، افتح مشروعًا، ثم شغّل أمرها أو إجراءها. نجاح `pack` لا يثبت أن الإضافة تعمل على Android.

<a id="أوامر-سطر-الأوامر"></a>

## 🧰 أوامر سطر الأوامر

| الأمر | الوظيفة |
| :-- | :-- |
| `rawanide-sdk help` | عرض المساعدة |
| `rawanide-sdk init <template> <name>` | إنشاء مشروع إضافة من قالب |
| `rawanide-sdk validate <project> [--official] [--repository]` | التحقق من Manifest وبنية المشروع |
| `rawanide-sdk audit <project> [--official] [--repository]` | التحقق مع فحوص ثابتة وتحذيرات (تقرير JSON) |
| `rawanide-sdk inspect <project> [--official] [--repository]` | عرض معلومات الإضافة (تقرير JSON) |
| `rawanide-sdk pack <project> [output.r1] [--official] [--repository]` | التحقق ثم إنشاء حزمة `.r1` |
| `rawanide-sdk test` | تشغيل اختبارات SDK نفسها. **للمشروع المصدري فقط**؛ مجلد `tests/` غير مرفق في حزمة npm. |
| `rawanide-sdk release-check` | فحص جاهزية إصدار SDK (للمشرفين) |

تنتهي الأوامر برمز خروج غير صفري عند الفشل، فيمكن استخدامها في CI. يعامل الخيار `--official` الإضافة على أنها من مصدر رسمي، فيسمح بصلاحية `PROJECT_ACCESS`؛ ولا ينبغي لإضافات المجتمع استخدامه. ويطبّق `--repository` أيضًا قواعد مستودعات المجتمع (راجع [انشر إضافتك](#انشر-إضافتك)). بقي الاسمان `rawanide` و`rawanide-sdk-desktop` للتوافق مع الإصدارات السابقة، لكن يُنصح باعتماد **`rawanide-sdk`** في كل توثيق جديد.

<a id="قوالب-الإضافات"></a>

## 🧩 قوالب الإضافات

| القالب | ما يوضحه | الصلاحيات |
| :-- | :-- | :-- |
| `declarative` | Manifest تعريفي بسيط؛ أضف المساهمات التي تحتاجها | لا شيء |
| `hosted-js` | أمر يسجّله JavaScript (يعرض رسالة Toast) | `UI_ACCESS` |
| `hosted-js-panel` | أمر يفتح لوحة HTML | `UI_ACCESS` |
| `hosted-js-selection-panel` | إجراء في القائمة السياقية للنص المحدد يفتح لوحة للقراءة فقط | `EDITOR_READ` و`UI_ACCESS` |
| `hosted-js-safe-edit` | استبدال النص المحدد بعد تأكيد صريح فقط | `EDITOR_READ` و`EDITOR_WRITE` و`UI_ACCESS` |
| `hosted-js-project-search` | البحث للقراءة فقط في ملفات المشروع عبر API 1.1 | `FILE_READ` و`UI_ACCESS` |

يحتوي كل قالب على `manifest.json` و`assets/icon.svg` وملف `README` (بالعربية والإنجليزية) ونموذج ترخيص MIT `LICENSE` مع موضعَي `[YEAR]` و`[COPYRIGHT HOLDER]`. ويضم القالبان المعتمدان على النص المحدد أيضًا `assets/context-action.svg`، وهي أيقونة منفصلة لإجراء القائمة السياقية في المحرر. معرّفات الإضافات مثل `local.sdk-panel` مؤقتة: اختر معرّفًا فريدًا، وراجع الصلاحيات، واستبدل الأيقونات المؤقتة ونص الترخيص قبل النشر.

<a id="انشر-إضافتك"></a>

## 🚀 انشر إضافتك

لا يرفع SDK أي شيء. وهناك طريقتان لتوزيع ما تبنيه.

**١. مشاركة ملف `.r1` مباشرة.** يثبّته المستخدمون بزر **تثبيت .r1** في التطبيق.

**٢. النشر عبر مستودع مجتمع (GitHub أو GitLab).** استخدم قالب مستودع المجتمع الخاص بـ GitHub أو GitLab، وهما مشروعان منفصلان عن SDK. أهم النقاط:

- تحقق من القواعد أولًا: الأمر `rawanide-sdk validate . --repository` يطبّق القواعد نفسها التي تفرضها أداة بناء المستودع. وقوالب SDK تحققها أصلًا.
  - وجود `localizedMetadata.en` في Manifest (ويستخدم `localizedMetadata.ar` في الصفحات العربية)، ووجود ملف `icon` فعلي.
  - أن يكون runtime هو `declarative` أو `hosted-js` (أو بلا runtime). ويقبل `validate` العادي القيمة `preview-js` لكن مستودعات المجتمع لا تقبلها.
  - عدم استخدام `TERMINAL_ACCESS` أو `PROCESS_EXECUTION` أو `DEVICE_FILES_READ` أو `DEVICE_FILES_WRITE`.
  - رقم `version` جديد لكل إصدار: فلا يُعاد كتابة `.r1` منشور أبدًا.
- ضع **مجلد مصدر** الإضافة في `extension-src/<name>/` داخل المستودع. لا حاجة إلى إضافة ملف `.r1`؛ فأداة بناء المستودع تغلّف المجلد بنفسها بالمغلِّف نفسه الذي يستخدمه `rawanide-sdk pack` (الملفات نفسها وبالترتيب نفسه والطوابع الزمنية نفسها)، وتسجّل بصمة SHA-256.
- املأ `publisher` و`description` و`category`، فهي تظهر في الفهرس (ويذكّرك بها `rawanide-sdk audit . --repository`).
- إذا كتبت Manifest من الصفر فأضف البيانات المترجمة:

  ```json
  "localizedMetadata": {
    "en": { "name": "My Extension", "description": "What it does." },
    "ar": { "name": "إضافتي", "description": "ماذا تفعل." }
  }
  ```

- أدرج الإضافة في `repo.config.json` الخاص بالمستودع (`src` و`releaseDate` و`changelog.en` و`tags`) ثم شغّل `node tools/build.mjs`. ولتشغيل `rawanide-sdk validate` على كل إضافة قبل ذلك، ثبّت SDK واستخدم `RAWANIDE_SDK_VALIDATE=1 node tools/build.mjs` (واجهات POSIX ومنها Termux).

وتشرح ملفات README الخاصة بقوالب المستودعات الخطوات كاملة.

<a id="الجودة-والأمان"></a>

## 🛡️ الجودة والأمان

| الفحص | ما يؤكده | ما لا يؤكده |
| :-- | :-- | :-- |
| `validate` | اجتياز قواعد البنية وManifest المدعومة | سلامة السلوك أثناء التشغيل، أو قبول المستودع للإضافة |
| `audit` | عدم ظهور مشكلات مانعة وفق قواعد تدقيق SDK | مراجعة أمنية مستقلة وشاملة |
| `pack` | إمكانية إنتاج ملف `.r1` | قبول Marketplace أو التوافق مع Android |

تعامل بحذر مع واجهات المضيف والصلاحيات وبيانات المستخدم، ولا تطلب إلا الصلاحيات التي تحتاجها.

<a id="التوافق-والحدود"></a>

## ⚙️ التوافق والحدود

- SDK ‏`1.1.0` متزامن مع API ‏`1.1`. تبقى إضافات `1.0` متوافقة؛ القوالب السابقة تحافظ على أقل API تحتاجه (`1.0`)، وقالب بحث المشروع الجديد يعلن `1.1`.
- تغطي تعريفات TypeScript (`@elhizazi1/extension-sdk/types`) مجموعة جزئية مراجَعة من واجهة المضيف لا كلها؛ راجع [`docs/type-contract-0.11.md`](docs/type-contract-0.11.md). وحدود عقد المضيف (`@elhizazi1/extension-sdk/contract`) ملخصة في [`docs/compatibility.md`](docs/compatibility.md).
- التحقق والتدقيق والتغليف فحوص ثابتة ومتحفظة؛ فهي لا تنفّذ JavaScript ولا تحاكي Android. اختبر كل إضافة داخل تطبيق RawanIDE.
- لا تُعِد استخدام معرّفات المستودعات المنشورة أو رموز التوثيق، ولا تغيّر بايتات حزم `.r1` المنشورة.

<a id="المساهمة-والصيانة"></a>

## 🤝 المساهمة والصيانة

لمن يعدّل SDK نفسه أو يصدره.

**شغّل الفحوص** من المشروع المصدري:

```sh
npm test                    # كل اختبارات SDK (node --test tests/*.test.mjs)
npm run check:release       # release-check على كل القوالب
npm run check:types         # اختبارات عقد الأنواع
npm run check:types:compile # يتطلب مترجم TypeScript (tsc)
npm run check:archives      # يتطلب python3
npm run check:package       # npm pack --dry-run
```

**مشترك مع قوالب المستودعات.** الملفان `lib/zip.mjs` (المغلِّف) و`community-rules.json` يُنسخان بايتًا ببايت إلى قوالب مستودعات المجتمع (`tools/lib/zip.mjs` و`tools/community-rules.json`). عدّلهما هنا أولًا ثم حدّث القوالب؛ ويحرس الاختبار `tests/repository-rules.test.mjs` بصمة المغلِّف.

**التوثيق.** الفهرس هو [`docs/README.md`](docs/README.md). الملفات التي يحمل اسمها أو عنوانها رقم إصدار هي ملاحظات هندسية تاريخية.

**الإبلاغ عن المشكلات.** أرفق إصدار SDK والمنصة والأمر المستخدم ومخرجات الخطأ بعد إزالة البيانات الحساسة.

<a id="الموارد"></a>

## 🔗 الموارد

| المورد | الرابط |
| :-- | :-- |
| تطبيق RawanIDE لنظام Android | [RawanIDE](https://github.com/elhizazi1/RawanIDE) |
| مشروع SDK المصدري | [rawanide-extension-sdk](https://github.com/elhizazi1/rawanide-extension-sdk) |
| حزمة npm | [@elhizazi1/extension-sdk](https://www.npmjs.com/package/@elhizazi1/extension-sdk) |
| وثائق المطورين | [RawanIDE Developers](https://rawanide.elhizazi.me/developers) |
| فهرس وثائق SDK | [`docs/README.md`](docs/README.md) |

<a id="الترخيص"></a>

## 📄 الترخيص

يستخدم SDK ترخيص MIT؛ راجع [LICENSE](LICENSE). التراخيص داخل قوالب الإضافات أمثلة يجب على أصحاب الإضافات مراجعتها وتخصيصها.

---

<div align="center">

💚 **صُنع من أجل مجتمع مطوري RawanIDE.**

<sub>RawanIDE · Code. Build. Preview. Anywhere.</sub>

</div>

## البحث البرمجي في المشروع — API 1.1

الدالتان الجديدتان `workspace.findFiles` و`workspace.findText` تبحثان في الملفات المحفوظة، بما فيها المغلقة، دون استخدام واجهة البحث اليدوية أو الكتابة في المشروع. تتطلبان `FILE_READ` وتعيدان Promise بنتائج ذات حدود وإلغاء صريح. راجع [توثيق البحث العربي](docs/workspace-search-1.1.ar.md) و[الإنجليزي](docs/workspace-search-1.1.md).

```sh
rawanide-sdk init hosted-js-project-search my-project-search
```
