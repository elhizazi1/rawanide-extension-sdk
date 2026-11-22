# البحث في المشروع — API ‏1.1 وSDK ‏1.1.0

[English](workspace-search-1.1.md)

أعلن apiVersion بالقيمة 1.1 وصلاحية FILE_READ عندما تعتمد على هاتين الدالتين. البحث غير متزامن ويعمل على IO، ويعيد Promise بنتيجة منظمة حتى عند الفشل التشغيلي. لا يفتح واجهة البحث اليدوي ولا ينفّذ أوامر أو يكتب ملفات، ولا يشمل تعديلات المحرر غير المحفوظة.

```js
const files = await rawanide.workspace.findFiles({ include: ['**/*.js'], maxResults: 100 });
const controller = new AbortController();
const result = await rawanide.workspace.findText('TODO', {
  include: ['**/*.js', '**/*.ts'], exclude: ['vendor/**'],
  caseSensitive: false, maxResults: 100, signal: controller.signal
});
// controller.abort() يطلب الإلغاء التعاوني
if (!result.ok) console.log(result.code, result.error);
else for (const hit of result.matches) console.log(hit.path, hit.line, hit.column, hit.preview);
```

## الخيارات

| الخيار | الافتراضي | النطاق |
|---|---|---|
| include | `['**/*']` | من 1 إلى 20 نمطًا نسبيًا؛ طول الواحد حتى 256 وحدة UTF-16 |
| exclude | `[]` | حتى 20 نمط استثناء إضافيًا |
| maxResults | 100 | عدد صحيح من 1 إلى 200 |
| maxEntries | 10000 | عدد صحيح من 1 إلى 20000، ويشمل عناصر المجلدات |
| signal | غير محدد | AbortSignal أو كائن متوافق معه بنيويًا |
| caseSensitive، للنص فقط | true | قيمة منطقية |
| maxFileBytes، للنص فقط | 262144 | عدد صحيح من 1 إلى 1048576 بايت |

تُرفض المفاتيح غير المعروفة والأنواع والقيم غير الصحيحة. الأنماط تدعم * و? داخل جزء المسار، و** عبر المجلدات. النمط **/ يمكن أن يطابق صفر مجلدات؛ لذلك **/*.js يشمل main.js في الجذر. بقية الرموز حرفية وليست Regex أو توسعة أقواس. الأنماط حساسة لحالة الأحرف وتطابق مسارات نسبية تستخدم /. تُرفض المسارات المطلقة ومقاطع .. وبادئات أقراص Windows.

يتجاهل المضيف دائمًا مجلدات .git وnode_modules و.gradle و.nuxt و.output وbuild وdist وcoverage و.rawanide. لا يتبع الروابط الرمزية حتى لو كانت داخل المشروع. يتجاهل المسارات الأطول من 1024 وحدة UTF-16 والمجلدات عند عمق 48 أو أكثر. عداد skippedFiles يجمع العناصر المتجاوزة وقد يشمل مجلدات؛ ليس عدد الملفات المطابقة فقط.

استعلام النص حرفي من سطر واحد وطوله 1–256 وحدة UTF-16؛ لا يقبل النص الفارغ أو LF أو CR أو NUL. البحث في UTF-8 صالح بلا NUL؛ الملفات الثنائية وغير الصالحة والكبيرة وغير المقروءة تُتجاوز. التطابقات غير متداخلة. المقارنة غير الحساسة للحالة تستخدم مقارنة أحرف Unicode في المضيف، وليست تحويلًا لغويًا كاملًا للنص.

## النتيجة والإحداثيات

تعيد الدالتان ok وfiles وmatches وtruncated وcancelled وlimitReason وvisitedEntries وscannedFiles وskippedFiles وreadBytes، ومع الفشل code وerror. findFiles يملأ files بعناصر path وsize بالبايت؛ findText يملأ matches ويترك files فارغة.

التطابق يحتوي path وline وcolumn وendColumn وoffset وendOffset وtext وpreview وpreviewStartColumn. السطر والعمود يبدأان من 1؛ الإزاحات من 0 بوحدات UTF-16، والنهاية حصرية. تُحسب الإحداثيات على النص الأصلي المحفوظ بما فيه CRLF؛ ولا تُحذف CR إلا من نهاية المعاينة عند الحاجة. طول المعاينة حتى 512 وحدة. previewStartColumn يحدد بداية المعاينة في السطر الأصلي. text هو النص المطابق الفعلي.

تُرتب النتائج المعادة حسب المسار ثم الإزاحة، لكن ترتيب استعراض المجلدات غير محدد؛ لذلك يمكن أن تختلف مجموعة النتائج الجزئية عند بلوغ الحد.

افحص ok أولًا ثم cancelled وtruncated وskippedFiles. القيمة truncated:false تعني أن حد التوقف العام لم يُفعّل، ولا تثبت قراءة كل الملفات. بلوغ عدد النتائج يُعلَن كاقتطاع تحفّظًا، حتى لو صادف آخر تطابق.

الحدود العامة: بحثان متزامنان لكل إضافة، و16 MiB مقروءة لكل بحث نصي، وميزانية تعاونية 5 ثوانٍ تُفحص بين خطوات الاستعراض والقراءة. لا يمكنها قطع استدعاء نظام ملفات عالق بالقوة. مهلة انتظار جسر JavaScript هي 12 ثانية. لا يُنفَّذ الاستعراض المتزامن على خيط واجهة التطبيق. انتظار البحث الأصلي لا يُحتسب من ميزانية وقت شيفرة الأمر، مع بقاء الحد الكلي للأمر ساريًا.

قد يعيد الإلغاء نتائج جزئية مع ok:true وcancelled:true وtruncated:true وlimitReason:'cancelled'. عند تغيير المشروع تُحذف النتائج ويعود PROJECT_CHANGED؛ وتعطيل الإضافة أو إيقافها يلغي أعمالها. رموز الفشل هي INVALID_OPTIONS وPERMISSION_DENIED وNO_PROJECT وBUSY وPROJECT_CHANGED وIO_ERROR وBRIDGE_ERROR وTIMEOUT. تحمل الأخطاء مصفوفتين فارغتين ورسالة، وقد تُحوّل أخطاء getters المرسلة من الإضافة إلى BRIDGE_ERROR.
