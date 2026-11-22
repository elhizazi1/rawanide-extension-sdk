# 🧩 لوحة إضافة — مثال RawanIDE

**العربية** · [English](README.md)

نوع القالب: `hosted-js-panel`. يسجّل أمرًا يفتح لوحة HTML داخل التطبيق (دون اتصال بالشبكة).

| | |
| :-- | :-- |
| بيئة التشغيل (runtime) | `hosted-js` |
| الصلاحيات | `UI_ACCESS` |
| نقطة الدخول | `src/extension.js` |

> 💡 **نصيحة:** كل ما يلي يُنفَّذ من داخل هذا المجلد؛ والـ SDK هو الشيء الوحيد الذي تحتاج لتثبيته.

<a id="البدء"></a>

## 🚀 البدء

1. استبدل `assets/icon.svg` بأيقونتك أو حدّث مسار `icon` في `manifest.json`.
2. عدّل `manifest.json`: حدّد `id` فريدًا (المعرّف الحالي مؤقت)، وحدّث `name` و`version` و`publisher` و`description` وباقي البيانات.
3. راجع الصلاحيات المطلوبة واحذف غير الضروري منها.
4. **اختر الترخيص قبل التوزيع.** يحتوي `LICENSE` على نموذج MIT مع موضعَي `[YEAR]` و`[COPYRIGHT HOLDER]`. استبدلهما إذا اخترت MIT، أو استبدل الملف كله وعدّل حقل `license` في Manifest إذا اخترت ترخيصًا آخر.
5. استبدل ملفَّي `README.md` و`README.ar.md` هذين بملفات خاصة بإضافتك. فكل ملف في هذا المجلد يُضمّ إلى حزمة `.r1`.
6. عدّل `src/extension.js`، وأبقِ معرّفات الأوامر في Manifest وفي `registerCommand` متطابقة.

<a id="التحقق-والتغليف"></a>

## ✅ التحقق والتغليف

ثبّت SDK مرة واحدة (`npm install -g @elhizazi1/extension-sdk`؛ راجع [README الخاص بـ SDK](https://github.com/elhizazi1/rawanide-extension-sdk#installation))، ثم شغّل الأوامر من داخل هذا المجلد:

```bash
rawanide-sdk validate .
rawanide-sdk audit .
rawanide-sdk pack . my-extension.r1
```

ينشئ `pack` الملف `my-extension.r1` في المجلد الحالي. وإن كنت تعمل من المشروع المصدري لـ SDK فاستخدم `node <path-to-sdk>/bin/rawanide-sdk.mjs` بدل `rawanide-sdk`.

> 💡 تنوي النشر في مستودع مجتمع؟ شغّل أيضًا `rawanide-sdk validate . --repository`. هذا القالب يحقق تلك القواعد أصلًا.

<a id="الاختبار-في-rawanide"></a>

## 📱 الاختبار في RawanIDE

ثبّت `my-extension.r1` بزر **تثبيت .r1** في التطبيق، وفعّل الإضافة، وافتح مشروعًا. ثم شغّل الأمر **SDK Panel: Open** من **Extension Commands**. نجاح `validate` و`audit` لا يثبت أن الإضافة تعمل على Android.

<a id="النشر"></a>

## 🌍 النشر

لمشاركة الإضافة، راجع قسم **انشر إضافتك** في [README الخاص بـ SDK](https://github.com/elhizazi1/rawanide-extension-sdk#publish-your-extension). ويتضمن هذا القالب أصلًا `localizedMetadata` وحقول الفهرس التي تشترطها مستودعات المجتمع؛ أعد فحص تعديلاتك بالأمر `rawanide-sdk validate . --repository`.

<a id="التوافق"></a>

## ⚙️ التوافق

- تبقى قيمة `apiVersion` في Manifest هي `1.0` للتوافق مع التطبيق؛ وهي مستقلة عن إصدار حزمة SDK.
- هذا قالب تطوير وليس إضافة مكتملة جاهزة للنشر.
- الأيقونة مؤقتة ويجب استبدالها قبل النشر.
