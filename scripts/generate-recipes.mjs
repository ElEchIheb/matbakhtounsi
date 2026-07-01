import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SITE, MONETAG_HEAD, navBlock, footerBlock, scriptsBlock, rel } from './page-template.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const recipes = JSON.parse(readFileSync(join(root, 'data/recipes.json'), 'utf8'));
const recipeMap = Object.fromEntries(recipes.map(r => [r.slug, r]));
const depth = 1;

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
    recipeInstructions: r.steps.map((text, i) => ({ '@type': 'HowToStep', text, position: i + 1 })),
    aggregateRating: { '@type': 'AggregateRating', ratingValue: r.rating, ratingCount: r.ratingCount }
  }, null, 2);
}

function imgTag(r) {
  const fallback = rel(depth) + 'images/placeholder-recipe.svg';
  return `<img src="${r.image}" alt="${r.imageAlt}" width="800" height="500" loading="eager"
    onerror="this.onerror=null;this.src='${fallback}'"
    style="width:100%;border-radius:12px;margin-bottom:1.5rem;box-shadow:var(--shadow)">`;
}

function generateRecipePage(r) {
  const dc = diffClass(r.difficulty);
  const rPath = rel(depth);
  const related = (r.related || []).map(s => recipeMap[s]).filter(Boolean).map(rel => `
    <li><a href="${rel.slug}.html" class="related-link">
      <span class="related-emoji">${rel.emoji}</span>
      <span><strong>${rel.title}</strong><small>${rel.totalTime} دقيقة</small></span>
    </a></li>`).join('');

  const comments = (r.comments || []).map(c => `
    <div class="comment-item">
      <div class="comment-author">${c.author}</div>
      <div class="comment-date">${c.date}</div>
      <div class="comment-text">${c.text}</div>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl" data-depth="${depth}">
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
  <title>${r.title} — وصفة كاملة | مطبخنا التونسي</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${rPath}css/style.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍲</text></svg>">
  <script type="application/ld+json">${buildJsonLd(r)}</script>
  ${MONETAG_HEAD}
</head>
<body data-recipe-slug="${r.slug}">
  ${navBlock(depth, 'wasfat')}
  <main>
    <div class="recipe-hero" style="background-image:linear-gradient(0deg,rgba(0,0,0,.75) 0%,transparent 60%),url('${r.image}')">
      <div class="container recipe-hero-content">
        <nav class="breadcrumb">
          <a href="${rPath}index.html">الرئيسية</a> ›
          <a href="index.html">الوصفات</a> ›
          <a href="index.html?cat=${r.category}">${r.categoryLabel}</a> › ${r.title}
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
          <div class="info-item"><span>👥</span> لـ: <strong>${r.yield}</strong></div>
          <div class="info-item"><span>⭐</span> الصعوبة: <strong class="diff-${dc}">${r.difficulty}</strong></div>
          <div class="info-item"><span>🏷️</span> <strong>${r.categoryLabel}</strong></div>
        </div>
        ${imgTag(r)}
        <section class="ingredients-list"><h2>🧂 المكونات</h2><ul>
          ${r.ingredients.map(([n, q]) => `<li><span>${n}</span><span class="qty">${q}</span></li>`).join('')}
        </ul></section>
        <div class="ad-slot ad-incontent" id="monetag-recipe-mid" data-ad-type="banner" data-size="728x90" data-fallback="recipe-mid"></div>
        <section class="steps-list"><h2>👨‍🍳 خطوات التحضير</h2><ol>
          ${r.steps.map(s => `<li>${s}</li>`).join('')}
        </ol></section>
        <aside class="tips-box"><h2>💡 نصيحة تونسية</h2><p>"${r.tip}"</p></aside>
        <section class="video-embed mb-1">
          <h2 class="video-title">🎥 شوف الفيديو</h2>
          <div class="video-wrapper">
            <iframe src="https://www.youtube-nocookie.com/embed/${r.youtube}?rel=0" title="فيديو ${r.title}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>
          </div>
          <p class="video-fallback"><a href="https://www.youtube.com/watch?v=${r.youtube}" target="_blank" rel="noopener">شوف الفيديو على يوتيوب ↗</a></p>
        </section>
        <section class="share-section">
          <h2>📤 شارك الوصفة</h2>
          <div class="share-buttons">
            <button class="share-btn share-facebook" data-share="facebook" type="button">📘 فيسبوك</button>
            <button class="share-btn share-whatsapp" data-share="whatsapp" type="button">💬 واتساب</button>
            <button class="share-btn share-tiktok" data-share="tiktok" type="button">🎵 تيك توك</button>
            <button class="share-btn share-print" data-print type="button">🖨️ طباعة</button>
          </div>
        </section>
        <div class="ad-slot ad-incontent" id="monetag-pre-comments" data-ad-type="banner" data-size="728x90" data-fallback="pre-comments"></div>
        <section class="comments-section">
          <h2>💬 تعليقاتكم</h2>
          <form class="comment-form">
            <textarea placeholder="قولنا كيفاش طلع معاك... 🇹🇳" required></textarea>
            <button type="submit" class="btn btn-primary">أرسل التعليق</button>
          </form>
          <div class="comments-list mt-1">${comments}</div>
        </section>
      </article>
      <aside class="recipe-sidebar">
        <div class="ad-slot ad-sidebar" id="monetag-sidebar" data-ad-type="banner" data-size="300x250" data-fallback="sidebar"></div>
        <div class="sidebar-card"><h3>وصفات مشابهة</h3><ul>${related}</ul></div>
      </aside>
    </div>
  </main>
  ${footerBlock(depth)}
  <button class="back-to-top" id="back-to-top" aria-label="الرجوع للأعلى">↑</button>
  ${scriptsBlock(depth)}
</body>
</html>`;
}

recipes.forEach(r => {
  writeFileSync(join(root, 'wasfat', `${r.slug}.html`), generateRecipePage(r), 'utf8');
  console.log('✓ recipe', r.slug);
});

writeFileSync(join(root, 'js', 'recipes-data.js'),
  `/* Auto-generated */\nwindow.RECIPES = ${JSON.stringify(recipes.map(r => ({
    slug: r.slug, title: r.title, emoji: r.emoji, category: r.category,
    categoryLabel: r.categoryLabel, totalTime: r.totalTime, yield: r.yield,
    difficulty: r.difficulty, image: r.image, imageAlt: r.imageAlt, featured: r.featured
  })), null, 2)};\n`, 'utf8');

const staticPages = [
  '/', '/wasfat/', '/blog/', '/adawat/', '/men-matbakhekum/', '/aanna/',
  '/ittasil-bina/', '/privacy/', ...recipes.map(r => `/wasfat/${r.slug}.html`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url><loc>${SITE}${p}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>`;
writeFileSync(join(root, 'sitemap.xml'), sitemap, 'utf8');
console.log('✓ sitemap.xml');