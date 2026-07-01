import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const recipes = JSON.parse(readFileSync(join(root, 'data/recipes.json'), 'utf8'));
const recipeMap = Object.fromEntries(recipes.map(r => [r.slug, r]));

const SITE = 'https://matbakhtounsi.tn';
const MONETAG = '<script src="https://quge5.com/88/tag.min.js" data-zone="255314" async data-cfasync="false"></script>';

function diffClass(d) {
  if (d === 'سهلة') return 'easy';
  if (d === 'صعبة') return 'hard';
  return 'medium';
}

function buildJsonLd(r) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: r.title,
    description: r.description,
    image: r.image,
    author: { '@type': 'Organization', name: 'مطبخنا التونسي' },
    datePublished: r.datePublished,
    prepTime: `PT${r.prepTime}M`,
    cookTime: `PT${r.cookTime}M`,
    totalTime: `PT${r.totalTime}M`,
    recipeYield: r.yield,
    recipeCategory: r.categoryLabel,
    recipeCuisine: 'Tunisian',
    keywords: r.keywords,
    recipeIngredient: r.ingredients.map(([n, q]) => `${q} ${n}`),
    recipeInstructions: r.steps.map((text, i) => ({
      '@type': 'HowToStep', text, position: i + 1
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: r.rating,
      ratingCount: r.ratingCount
    }
  }, null, 2);
}

function relatedHtml(r) {
  return (r.related || [])
    .map(slug => recipeMap[slug])
    .filter(Boolean)
    .map(rel => `
            <li><a href="${rel.slug}.html" style="display:flex;gap:0.75rem;align-items:center">
              <span style="font-size:1.5rem">${rel.emoji}</span>
              <span><strong>${rel.title}</strong><br><small style="color:var(--gray)">${rel.totalTime} دقيقة</small></span>
            </a></li>`).join('');
}

function commentsHtml(r) {
  const defaults = r.comments?.length ? r.comments : [];
  return defaults.map(c => `
            <div class="comment-item">
              <div class="comment-author">${c.author}</div>
              <div class="comment-date">${c.date}</div>
              <div class="comment-text">${c.text}</div>
            </div>`).join('');
}

function generateRecipePage(r) {
  const dc = diffClass(r.difficulty);
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${r.description}">
  <meta name="keywords" content="${r.keywords}, مطبخ تونسي, وصفات تونسية">
  <meta name="author" content="مطبخنا التونسي">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE}/wasfat/${r.slug}.html">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${r.title} — وصفة كاملة بالدارجة">
  <meta property="og:description" content="${r.subtitle}">
  <meta property="og:url" content="${SITE}/wasfat/${r.slug}.html">
  <meta property="og:image" content="${r.image}">
  <meta property="og:locale" content="ar_TN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${r.title}">
  <meta name="twitter:image" content="${r.image}">
  <title>${r.title} — وصفة كاملة | مطبخنا التونسي</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍲</text></svg>">
  <script type="application/ld+json">${buildJsonLd(r)}</script>
</head>
<body data-recipe-slug="${r.slug}">
  <header class="site-header">
    <div class="container header-inner">
      <a href="../" class="logo">
        <div class="logo-icon" aria-hidden="true">🍲</div>
        <div class="logo-text"><strong>مطبخنا التونسي</strong><small>Wasfat Tounsia</small></div>
      </a>
      <div class="search-box">
        <label for="site-search" class="sr-only">قلّب على وصفة</label>
        <input type="search" id="site-search" placeholder="قلّب على وصفة..." autocomplete="off">
        <button type="button" aria-label="بحث">🔍</button>
        <div class="search-results" id="search-results" hidden></div>
      </div>
      <button class="theme-toggle" aria-label="الوضع الليلي" title="الوضع الليلي">🌙</button>
      <button class="nav-toggle" aria-label="فتح القائمة" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="main-nav" aria-label="القائمة الرئيسية">
        <ul>
          <li><a href="../">الرئيسية</a></li>
          <li><a href="./" class="active">الوصفات</a></li>
          <li><a href="../men-matbakhekum/">من مطبخكم</a></li>
          <li><a href="../blog/">المدونة</a></li>
          <li><a href="../adawat/">أدوات</a></li>
        </ul>
      </nav>
    </div>
    <div class="container">
      <div class="ad-slot ad-header" id="monetag-header-banner" data-ad-type="banner" data-size="728x90" role="complementary" aria-label="إعلان"></div>
    </div>
  </header>

  <main>
    <div class="recipe-hero" style="background-image:linear-gradient(0deg,rgba(0,0,0,.75) 0%,transparent 60%),url('${r.image}')">
      <div class="container recipe-hero-content">
        <nav class="breadcrumb" aria-label="مسار التنقل">
          <a href="../">الرئيسية</a> › <a href="./">الوصفات</a> › <a href="./?cat=${r.category}">${r.categoryLabel}</a> › ${r.title}
        </nav>
        <h1>${r.title} ${r.emoji}</h1>
        <p>${r.subtitle}</p>
      </div>
    </div>

    <div class="container recipe-layout">
      <article class="recipe-main">
        <div class="recipe-info-bar">
          <div class="info-item"><span>⏱</span> التحضير: <strong>${r.prepTime} دقيقة</strong></div>
          <div class="info-item"><span>🍳</span> الطبخ: <strong>${r.cookTime} دقيقة</strong></div>
          <div class="info-item"><span>👥</span> لـ: <strong>${r.yield} أشخاص</strong></div>
          <div class="info-item"><span>⭐</span> الصعوبة: <strong style="color:var(--${dc === 'easy' ? 'green' : dc === 'hard' ? 'red' : 'gold'})">${r.difficulty}</strong></div>
          <div class="info-item"><span>🏷️</span> التصنيف: <strong>${r.categoryLabel}</strong></div>
        </div>

        <img src="${r.image}" alt="${r.imageAlt}" width="800" height="500" loading="eager"
          style="width:100%;border-radius:12px;margin-bottom:1.5rem;box-shadow:var(--shadow)">

        <section class="ingredients-list" aria-labelledby="ingredients-title">
          <h2 id="ingredients-title">🧂 المكونات</h2>
          <ul>${r.ingredients.map(([n, q]) => `<li><span>${n}</span><span class="qty">${q}</span></li>`).join('')}</ul>
        </section>

        <div class="ad-slot ad-incontent" id="monetag-recipe-mid" data-ad-type="banner" data-size="728x90" role="complementary" aria-label="إعلان"></div>

        <section class="steps-list" aria-labelledby="steps-title">
          <h2 id="steps-title">👨‍🍳 خطوات التحضير</h2>
          <ol>${r.steps.map(s => `<li>${s}</li>`).join('')}</ol>
        </section>

        <aside class="tips-box" aria-label="نصيحة تونسية">
          <h2>💡 نصيحة تونسية</h2>
          <p>"${r.tip}"</p>
        </aside>

        <section class="video-embed mb-1" aria-label="فيديو الوصفة">
          <h2 style="margin-bottom:1rem;color:var(--green)">🎥 شوف الفيديو</h2>
          <div class="video-wrapper">
            <iframe src="https://www.youtube.com/embed/${r.youtube}" title="فيديو ${r.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
          </div>
        </section>

        <section class="share-section" aria-labelledby="share-title">
          <h2 id="share-title">📤 شارك الوصفة</h2>
          <div class="share-buttons">
            <button class="share-btn share-facebook" data-share="facebook" type="button">📘 فيسبوك</button>
            <button class="share-btn share-whatsapp" data-share="whatsapp" type="button">💬 واتساب</button>
            <button class="share-btn share-tiktok" data-share="tiktok" type="button">🎵 تيك توك</button>
            <button class="share-btn share-print" data-print type="button">🖨️ طباعة</button>
          </div>
        </section>

        <div class="ad-slot ad-incontent" id="monetag-pre-comments" data-ad-type="banner" data-size="728x90" role="complementary" aria-label="إعلان"></div>

        <section class="comments-section" aria-labelledby="comments-title">
          <h2 id="comments-title">💬 تعليقاتكم</h2>
          <form class="comment-form">
            <textarea placeholder="قولنا كيفاش طلع معاك... 🇹🇳" required></textarea>
            <button type="submit" class="btn btn-primary">أرسل التعليق</button>
          </form>
          <div class="comments-list mt-1">${commentsHtml(r)}</div>
        </section>
      </article>

      <aside class="recipe-sidebar">
        <div class="ad-slot ad-sidebar" id="monetag-sidebar" data-ad-type="banner" data-size="300x250" role="complementary" aria-label="إعلان" style="margin-bottom:1.5rem"></div>
        <div class="sidebar-card">
          <h3>وصفات مشابهة</h3>
          <ul>${relatedHtml(r)}</ul>
        </div>
      </aside>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="ad-slot ad-footer" id="monetag-footer-banner" data-ad-type="banner" data-size="728x90" role="complementary" aria-label="إعلان"></div>
      <div class="footer-bottom"><p>© 2026 مطبخنا التونسي — Wasfat Tounsia. 🇹🇳</p></div>
    </div>
  </footer>

  <script src="../js/recipes-data.js" defer></script>
  <script src="../js/main.js" defer></script>
  ${MONETAG}
</body>
</html>`;
}

recipes.forEach(r => {
  const out = join(root, 'wasfat', `${r.slug}.html`);
  writeFileSync(out, generateRecipePage(r), 'utf8');
  console.log('✓', r.slug);
});

// Export browser-friendly recipes data
const jsOut = `/* Auto-generated from data/recipes.json */\nwindow.RECIPES = ${JSON.stringify(recipes.map(r => ({
  slug: r.slug, title: r.title, emoji: r.emoji, category: r.category,
  categoryLabel: r.categoryLabel, totalTime: r.totalTime, yield: r.yield,
  difficulty: r.difficulty, image: r.image, imageAlt: r.imageAlt, featured: r.featured
})), null, 2)};\n`;
writeFileSync(join(root, 'js', 'recipes-data.js'), jsOut, 'utf8');
console.log('✓ js/recipes-data.js');

// Sitemap
const urls = [
  { loc: '/', pri: '1.0' },
  { loc: '/wasfat/', pri: '0.9' },
  ...recipes.map(r => ({ loc: `/wasfat/${r.slug}.html`, pri: '0.8' }))
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u.loc}</loc><priority>${u.pri}</priority><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;
writeFileSync(join(root, 'sitemap.xml'), sitemap, 'utf8');
console.log('✓ sitemap.xml');