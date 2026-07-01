import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SITE, pageShell } from './page-template.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function writePage(folder, filename, html) {
  const dir = join(root, folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, filename), html, 'utf8');
  console.log('✓', folder + '/' + filename);
}

const hero = (title, subtitle) => `<div class="page-hero"><div class="container"><h1>${title}</h1><p>${subtitle}</p></div></div>`;

writePage('.', '404.html', pageShell({
  depth: 0, active: '', title: '404 — الصفحة موش موجودة | مطبخنا التونسي',
  description: 'الصفحة اللي تلوّجها موش موجودة — ارجع للرئيسية أو دور على وصفة.',
  canonical: SITE + '/404.html',
  hero: `<div class="error-hero"><div class="container"><span class="error-code">404</span><h1>الصفحة موش موجودة 🇹🇳</h1><p>يمكن الرابط غلط، أو الصفحة تبدّلت مكانها.</p><div class="hero-actions"><a href="index.html" class="btn btn-primary">الرئيسية</a><a href="wasfat/index.html" class="btn btn-secondary">الوصفات</a></div></div></div>`,
  content: `<div class="error-suggestions"><h2>وصفات مشهورة</h2><ul class="error-links">
    <li><a href="wasfat/lablabi-tounsi.html">🥙 لبلابي تونسي</a></li>
    <li><a href="wasfat/kosksi-djaj.html">🍗 كسكسي بالدجاج</a></li>
    <li><a href="wasfat/brik-tounsi.html">🥟 بريك تونسي</a></li>
  </ul></div>`
}));

writePage('blog', 'index.html', pageShell({
  depth: 1, active: 'blog', title: 'المدونة | مطبخنا التونسي',
  description: 'مقالات عن تاريخ الأكل التونسي، نصائح مطبخ، وذكريات رمضان.',
  canonical: SITE + '/blog/',
  hero: hero('📖 المدونة', 'تاريخ، قصص، ونصائح من المطبخ التونسي'),
  content: `<div class="blog-list">
    <article class="blog-item blog-article"><span class="blog-icon">📜</span><div><h2>تاريخ اللبلابي في تونس</h2><p>من سوق المرسى للعالم — قصة أحبّ أكل شارع تونسي.</p></div></article>
    <article class="blog-item blog-article"><span class="blog-icon">🌾</span><div><h2>كيفاش تختار سميد الكسكسي</h2><p>نصائح من الخبّازين التوانسة لكسكسي فاتح وطري.</p></div></article>
    <article class="blog-item blog-article"><span class="blog-icon">🌙</span><div><h2>ذكريات رمضان في المطبخ التونسي</h2><p>ريحة البريك والمقروض في الليل — أكل وذكريات.</p></div></article>
  </div>`
}));

writePage('adawat', 'index.html', pageShell({
  depth: 1, active: 'adawat', title: 'أدوات المطبخ | مطبخنا التونسي',
  description: 'محول وحدات، قائمة تسوق، حاسبة تكلفة — أدوات تساعدك في المطبخ.',
  canonical: SITE + '/adawat/',
  hero: hero('🛠️ أدوات المطبخ', 'أدوات بسيطة تسهّل الطبخ اليومي'),
  content: `<div class="tools-grid tools-page">
    <div class="tool-card tool-static"><span class="tool-icon">⚖️</span><h3>محول وحدات</h3><p>جرام ↔ ملعقة ↔ كوب</p><p class="tool-note">قريباً — نحضّروه!</p></div>
    <div class="tool-card tool-static"><span class="tool-icon">🛒</span><h3>قائمة تسوق</h3><p>جهّز قائمة من الوصفة</p><p class="tool-note">قريباً</p></div>
    <div class="tool-card tool-static"><span class="tool-icon">💰</span><h3>حاسبة تكلفة</h3><p>احسب تكلفة الوجبة</p><p class="tool-note">قريباً</p></div>
    <div class="tool-card tool-static"><span class="tool-icon">🌤️</span><h3>طقس تونس</h3><p>الجو قبل ما تطبخ برّة</p><p class="tool-note">قريباً</p></div>
  </div>`
}));

writePage('men-matbakhekum', 'index.html', pageShell({
  depth: 1, active: 'ugc', title: 'من مطبخكم | مطبخنا التونسي',
  description: 'أرسل وصفتك التونسية وشاركها مع آلاف التوانسة.',
  canonical: SITE + '/men-matbakhekum/',
  hero: hero('👩‍🍳 من مطبخكم', 'وصفاتكم هي كنز الموقع — شاركوا معانا'),
  content: `<div class="ugc-page">
    <p>باهي برشا الوصفة متاعك؟ أرسلهالنا بالدارجة ونشرها للمجتمع.</p>
    <form class="contact-form" id="ugc-form">
      <label>اسمك والمدينة<input type="text" placeholder="مثال: فاطمة من صفاقس" required></label>
      <label>اسم الوصفة<input type="text" placeholder="مثال: كسكسي بالغلال" required></label>
      <label>الوصفة<textarea rows="8" placeholder="المكونات والخطوات..." required></textarea></label>
      <button type="submit" class="btn btn-primary">أرسل الوصفة</button>
    </form>
    <div class="ugc-grid mt-2">
      <div class="ugc-card"><div class="ugc-avatar">👩</div><div class="ugc-info"><h4>فاطمة من صفاقس</h4><p>كسكسي بالغلال — وصفة جدّتها</p></div></div>
      <div class="ugc-card"><div class="ugc-avatar">👨</div><div class="ugc-info"><h4>أنيس من تونس</h4><p>بريك بالبطاطا والتونة</p></div></div>
    </div>
  </div>`
}));

writePage('aanna', 'index.html', pageShell({
  depth: 1, active: 'about', title: 'عن الموقع | مطبخنا التونسي',
  description: 'مطبخنا التونسي — Wasfat Tounsia. وصفات تونسية بالدارجة للتوانسة في تونس والمهجر.',
  canonical: SITE + '/aanna/',
  hero: hero('🇹🇳 عن مطبخنا التونسي', 'Wasfat Tounsia — أكل أصيل بالدارجة'),
  content: `<p>مطبخنا التونسي موقع وصفات تونسية 100% بالدارجة. هدفنا نخدمو التوانسة في تونس، فرنسا، إيطاليا، كندا وكل مكان.</p>
  <p>نشرحلك الوصفات خطوة بخطوة — لبلابي، كسكسي، بريك، حلويات، وأكل شارع — كيف ما يتعلّموه في الدار.</p>`
}));

writePage('ittasil-bina', 'index.html', pageShell({
  depth: 1, active: 'contact', title: 'اتصل بنا | مطبخنا التونسي',
  description: 'تواصل مع فريق مطبخنا التونسي — اقتراحات، إعلانات، شراكات.',
  canonical: SITE + '/ittasil-bina/',
  hero: hero('📧 اتصل بنا', 'نسمع منكم بكل فرح'),
  content: `<form class="contact-form" id="contact-form">
    <label>الاسم<input type="text" required></label>
    <label>البريد<input type="email" required></label>
    <label>الرسالة<textarea rows="5" required></textarea></label>
    <button type="submit" class="btn btn-primary">أرسل</button>
  </form>
  <p class="mt-1">أو راسلنا على: <strong>contact@matbakhtounsi.tn</strong></p>`
}));

writePage('privacy', 'index.html', pageShell({
  depth: 1, active: '', title: 'سياسة الخصوصية | مطبخنا التونسي',
  description: 'سياسة الخصوصية لموقع مطبخنا التونسي — الإعلانات والكوكيز.',
  canonical: SITE + '/privacy/',
  hero: hero('🔒 سياسة الخصوصية', 'شفافية مع مستخدمينا'),
  content: `<p>نستعمل Monetag لعرض إعلانات. قد تُجمع بيانات تقنية (IP، متصفح) لأغراض الإعلان والتحليل.</p>
  <p>باستخدامك للموقع، توافق على سياسة الخصوصية هاذي. للاستفسار: contact@matbakhtounsi.tn</p>`
}));