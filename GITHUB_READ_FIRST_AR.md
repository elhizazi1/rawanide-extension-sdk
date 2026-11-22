# نسخة GitHub المصححة — SDK 1.1.0

هذه ملفات GitHub فقط. يتضمن تحديث الدمج README.md وREADME.ar.md وpackage.json و.github/workflows/publish.yml ودليل docs/GITHUB_DISTRIBUTION.md. انسخها فوق مستودع SDK الحالي. لم يتغيّر كود SDK أو القوالب أو تعريفات الأنواع أو عقد API أو رقم الإصدار.

ملفا README يخصّصان التثبيت لسجل GitHub Packages، مع تعليمات المصادقة المطلوبة وروابط واضحة للسورس والتوثيق. يوجّه package.json النشر إلى GitHub Packages فقط. لذلك لا تستخدم هذا المجلد لنشر npmjs؛ ستبقى نسخة npmjs مستقلة.

## الخطوة التالية فقط

بعد نسخ الملفات شغّل من جذر مستودع SDK:

```bash
git add README.md README.ar.md package.json .github/workflows/publish.yml docs/GITHUB_DISTRIBUTION.md &&
git commit -m "docs: specialize SDK GitHub distribution" &&
git push origin main
```

رفع main يحدّث السورس ولا يشغّل النشر. بعدها يتوفر Run workflow تحت Publish SDK to GitHub Packages في Actions. اختر main واترك publish غير مفعّل لإجراء الفحص التجريبي فقط. لا تعِد تشغيل عملية نشر الوسم القديم، لأنها تستخدم الملفات القديمة.

لا تحذف الإصدار المنشور خلال خطوة تجهيز ورفع السورس. وجود زر Delete يؤكد إمكانية اختيار إصدار بعينه، لكنه لا يثبت قبول إعادة نشر الرقم ذاته بعد الحذف. لم ننفذ حذفًا أو إعادة نشر فعلية إلى GitHub أثناء إعداد هذه الملفات. دليل النشر يوضح القيد وخيار الاستعادة وفق شروط GitHub. الإصدار يبقى 1.1.0 ولا يوجد سكربت يغيّر الوسم أو يحذف حزمًا.

## نتائج التحقق

- اختبارات SDK: 71 ناجح، اختبار واحد متجاوز، صفر فشل.
- release-check: القوالب الستة دون أخطاء.
- تم إنشاء حزمة حقيقية محليًا وفحص README.md وREADME.ar.md وpackage.json داخلها؛ تطابقت مع النسخة المصححة.
- npm publish --dry-run اتجه إلى GitHub Packages دون نشر فعلي.
- فُحص YAML وshell وشروط التشغيل اليدوي؛ publish غير مفعّل افتراضيًا.
- جميع ملفات الكود والقوالب والأنواع وعقد API وقواعد المجتمع مطابقة للملفات التي أرسلتها.
- لم يُختبر تثبيت الحزمة من سجل GitHub أو النشر عن بعد في هذه الجولة؛ يحتاج ذلك حسابك وسير العمل الفعلي.
