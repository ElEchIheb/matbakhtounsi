export const SITE = 'https://matbakhtounsi.tn';
export const MONETAG_HEAD = `<script src="https://quge5.com/88/tag.min.js" data-zone="255314" async data-cfasync="false"></script>`;

export function rel(depth) {
  return depth === 0 ? '' : '../'.repeat(depth);
}

export function headBlock({ depth, title, description, canonical, ogImage }) {
  const r = rel(depth);
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta name="author" content="مطبخنا التونسي">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Couscous-2.jpg/800px-Couscous-2.jpg'}">
  <meta property="og:locale" content="ar_TN">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${r}css/style.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍲</text></svg>">
  ${MONETAG_HEAD}`;
}

export function navBlock(depth, active) {
  const r = rel(depth);
  const items = [
    ['home', 'الرئيسية', r + 'index.html'],
    ['wasfat', 'الوصفات', r + 'wasfat/index.html'],
    ['ugc', 'من مطبخكم', r + 'men-matbakhekum/index.html'],
    ['blog', 'المدونة', r + 'blog/index.html'],
    ['adawat', 'أدوات', r + 'adawat/index.html'],
    ['about', 'عنّا', r + 'aanna/index.html'],
    ['contact', 'اتصل بنا', r + 'ittasil-bina/index.html'],
  ];
  return `<header class="site-header">
    <div class="container header-inner">
      <a href="${r}index.html" class="logo">
        <div class="logo-icon" aria-hidden="true">🍲</div>
        <div class="logo-text"><strong>مطبخنا التونسي</strong><small>Wasfat Tounsia</small></div>
      </a>
      <div class="search-box">
        <label for="site-search" class="sr-only">قلّب على وصفة</label>
        <input type="search" id="site-search" placeholder="قلّب على وصفة..." autocomplete="off">
        <button type="button" aria-label="بحث">🔍</button>
        <div class="search-results" id="search-results" hidden></div>
      </div>
      <button class="theme-toggle" aria-label="الوضع الليلي">🌙</button>
      <button class="nav-toggle" aria-label="فتح القائمة" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="main-nav" aria-label="القائمة الرئيسية">
        <ul>${items.map(([key, label, href]) =>
    `<li><a href="${href}"${active === key ? ' class="active"' : ''}>${label}</a></li>`
  ).join('')}</ul>
      </nav>
    </div>
    <div class="container">
      <div class="ad-slot ad-header" id="monetag-header-banner" data-ad-type="banner" data-size="728x90" data-fallback="728x90" role="complementary" aria-label="إعلان"></div>
    </div>
  </header>`;
}

export function footerBlock(depth) {
  const r = rel(depth);
  return `<footer class="site-footer">
    <div class="container">
      <div class="ad-slot ad-footer" id="monetag-footer-banner" data-ad-type="banner" data-size="728x90" data-fallback="728x90" role="complementary" aria-label="إعلان"></div>
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="${r}index.html" class="logo">
            <div class="logo-icon">🍲</div>
            <div class="logo-text"><strong>مطبخنا التونسي</strong><small>Wasfat Tounsia</small></div>
          </a>
          <p>وصفات تونسية بالدارجة — من مطبخنا لبيتكم 🇹🇳</p>
        </div>
        <div class="footer-links">
          <h4>روابط</h4>
          <ul>
            <li><a href="${r}wasfat/index.html">الوصفات</a></li>
            <li><a href="${r}blog/index.html">المدونة</a></li>
            <li><a href="${r}adawat/index.html">أدوات</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>المزيد</h4>
          <ul>
            <li><a href="${r}aanna/index.html">عن الموقع</a></li>
            <li><a href="${r}ittasil-bina/index.html">اتصل بنا</a></li>
            <li><a href="${r}privacy/index.html">سياسة الخصوصية</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom"><p>© 2026 مطبخنا التونسي — Wasfat Tounsia. 🇹🇳</p></div>
    </div>
  </footer>`;
}

export function scriptsBlock(depth) {
  const r = rel(depth);
  return `<script src="${r}js/paths.js"></script>
  <script src="${r}js/recipes-data.js" defer></script>
  <script src="${r}js/main.js" defer></script>`;
}

export function pageShell({ depth, active, title, description, canonical, ogImage, hero, content }) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl" data-depth="${depth}">
<head>
  ${headBlock({ depth, title, description, canonical, ogImage })}
</head>
<body>
  ${navBlock(depth, active)}
  <main>
    ${hero || ''}
    <section><div class="container page-content">${content}</div></section>
  </main>
  ${footerBlock(depth)}
  <button class="back-to-top" id="back-to-top" aria-label="الرجوع للأعلى">↑</button>
  ${scriptsBlock(depth)}
</body>
</html>`;
}