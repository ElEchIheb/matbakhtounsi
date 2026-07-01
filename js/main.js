/**
 * مطبخنا التونسي — Wasfat Tounsia
 */
(function () {
  'use strict';

  var THEME_KEY = 'mt_theme';

  function getBase() {
    return (window.SITE && window.SITE.base) || '';
  }

  function recipeUrl(slug) {
    if (window.SITE && window.SITE.recipe) return window.SITE.recipe(slug);
    return getBase() + 'wasfat/' + slug + '.html';
  }

  function wasfatIndex() {
    return (window.SITE && window.SITE.wasfat) || getBase() + 'wasfat/index.html';
  }

  /* ── Monetag: Service Worker + fallback banners ── */
  function initMonetag() {
    if ('serviceWorker' in navigator) {
      var swPath = getBase() + 'sw.js';
      navigator.serviceWorker.register(swPath, { scope: getBase() || '/' }).catch(function () {});
    }

    document.querySelectorAll('.ad-slot[data-ad-type="banner"]').forEach(function (slot) {
      var size = slot.dataset.size || '728x90';
      var id = slot.dataset.fallback || size;
      if (!slot.innerHTML.trim()) {
        slot.innerHTML = '<span class="ad-placeholder">Monetag ' + size + '</span>';
      }
      window.setTimeout(function () {
        var hasAd = slot.querySelector('iframe, ins, img[src*="monetag"], img[src*="quge5"], a[href*="quge5"]');
        if (!hasAd && !slot.querySelector('.ad-fallback')) {
          slot.innerHTML =
            '<a href="' + wasfatIndex() + '" class="ad-fallback" data-slot="' + id + '">' +
            '<strong>مطبخنا التونسي 🇹🇳</strong><br>' +
            '<span>اكتشف وصفات تونسية أصيلة بالدارجة</span></a>';
        }
      }, 4000);
    });
  }

  /* ── Global image fallback ── */
  function initImageFallback() {
    var fb = getBase() + 'images/placeholder-recipe.svg';
    document.querySelectorAll('img').forEach(function (img) {
      if (img.dataset.fallbackDone) return;
      img.addEventListener('error', function () {
        if (this.src.indexOf('placeholder-recipe') === -1) {
          this.src = fb;
          this.dataset.fallbackDone = '1';
        }
      });
    });
  }

  /* ── Mobile Navigation ── */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        nav.classList.remove('open');
        if (toggle) toggle.classList.remove('active');
        document.body.style.overflow = '';
        hideSearchResults();
      }
    });
  }

  function initTheme() {
    if (localStorage.getItem(THEME_KEY) === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      if (document.documentElement.getAttribute('data-theme') === 'dark') btn.textContent = '☀️';
      btn.addEventListener('click', function () {
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (dark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem(THEME_KEY, 'light');
          btn.textContent = '🌙';
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem(THEME_KEY, 'dark');
          btn.textContent = '☀️';
        }
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        var h = document.querySelector('.site-header');
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (h ? h.offsetHeight : 64), behavior: 'smooth' });
      });
    });
  }

  function initPrintButton() {
    document.querySelectorAll('[data-print]').forEach(function (btn) {
      btn.addEventListener('click', function () { window.print(); });
    });
  }

  function initShareButtons() {
    document.querySelectorAll('[data-share]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = this.dataset.share;
        var url = encodeURIComponent(location.href);
        var title = encodeURIComponent(document.title);
        if (p === 'facebook') window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'noopener,width=600,height=400');
        else if (p === 'whatsapp') window.open('https://wa.me/?text=' + title + '%20' + url, '_blank', 'noopener');
        else if (p === 'tiktok' && navigator.clipboard) {
          navigator.clipboard.writeText(location.href);
          showToast('الرابط تنسخ! الصقوه في تيك توك 📋');
        }
      });
    });
  }

  function showToast(msg) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('toast-hide'); setTimeout(function () { t.remove(); }, 300); }, 3000);
  }

  function highlightToday() {
    var days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    var today = days[new Date().getDay()];
    document.querySelectorAll('.day-card').forEach(function (c) {
      if (c.dataset.day === today) c.classList.add('today');
    });
  }

  var searchResultsEl;

  function hideSearchResults() {
    if (searchResultsEl) searchResultsEl.hidden = true;
  }

  function initSearch() {
    var input = document.querySelector('#site-search');
    searchResultsEl = document.querySelector('#search-results');
    if (!input || !window.RECIPES) return;

    function filter(q) {
      q = q.trim().toLowerCase();
      if (!q) return [];
      return window.RECIPES.filter(function (r) {
        return r.title.toLowerCase().indexOf(q) !== -1 ||
          r.categoryLabel.toLowerCase().indexOf(q) !== -1 ||
          r.slug.indexOf(q) !== -1;
      }).slice(0, 6);
    }

    function render(items) {
      if (!searchResultsEl) return;
      if (!items.length) {
        searchResultsEl.innerHTML = '<div class="search-empty">ما لقيناش وصفة</div>';
        searchResultsEl.hidden = false;
        return;
      }
      searchResultsEl.innerHTML = items.map(function (r) {
        return '<a class="search-result-item" href="' + recipeUrl(r.slug) + '">' +
          '<img src="' + r.image + '" alt="" width="40" height="40" loading="lazy">' +
          '<span><strong>' + r.emoji + ' ' + r.title + '</strong><small>' + r.categoryLabel + '</small></span></a>';
      }).join('');
      searchResultsEl.hidden = false;
    }

    input.addEventListener('input', function () {
      if (this.value.trim().length < 2) { hideSearchResults(); return; }
      render(filter(this.value));
    });

    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var items = filter(this.value);
      if (items.length) location.href = recipeUrl(items[0].slug);
      else if (this.value.trim()) location.href = wasfatIndex() + '?q=' + encodeURIComponent(this.value.trim());
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-box')) hideSearchResults();
    });
  }

  function initWasfatPage() {
    var grid = document.querySelector('#recipes-grid');
    if (!grid || !window.RECIPES) return;
    var params = new URLSearchParams(location.search);
    var cat = params.get('cat');
    var q = params.get('q');

    function render(list) {
      if (!list.length) {
        grid.innerHTML = '<p class="no-results">ما لقيناش وصفات</p>';
        return;
      }
      grid.innerHTML = list.map(function (r) {
        return '<a href="' + r.slug + '.html" class="recipe-card">' +
          '<img class="recipe-card-img" src="' + r.image + '" alt="' + r.imageAlt + '" loading="lazy">' +
          '<div class="recipe-card-body"><span class="card-category">' + r.categoryLabel + '</span>' +
          '<h3>' + r.emoji + ' ' + r.title + '</h3>' +
          '<div class="card-meta">⏱ ' + r.totalTime + ' د · 👥 ' + r.yield + '</div></div></a>';
      }).join('');
    }

    var list = window.RECIPES.slice();
    if (cat) list = list.filter(function (r) { return r.category === cat; });
    if (q) {
      var ql = q.toLowerCase();
      list = list.filter(function (r) {
        return r.title.toLowerCase().indexOf(ql) !== -1 || r.categoryLabel.toLowerCase().indexOf(ql) !== -1;
      });
    }
    render(list);

    document.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        var c = this.dataset.cat;
        document.querySelectorAll('.filter-chip').forEach(function (x) { x.classList.remove('active'); });
        this.classList.add('active');
        render(c === 'all' ? window.RECIPES : window.RECIPES.filter(function (r) { return r.category === c; }));
      });
    });

    if (q) {
      var si = document.querySelector('#site-search');
      if (si) si.value = q;
    }
  }

  function initForms() {
    document.querySelectorAll('.comment-form, .contact-form, #ugc-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        showToast('تسجّلت رسالتك! شكراً 🇹🇳 (demo — لا backend بعد)');
        form.reset();
      });
    });
  }

  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function init() {
    initMonetag();
    initImageFallback();
    initMobileNav();
    initTheme();
    initSmoothScroll();
    initPrintButton();
    initShareButtons();
    highlightToday();
    initSearch();
    initWasfatPage();
    initForms();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();