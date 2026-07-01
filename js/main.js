/**
 * مطبخنا التونسي — Wasfat Tounsia
 * Main JavaScript — minimal, performance-focused
 */

(function () {
  'use strict';

  const THEME_KEY = 'mt_theme';
  const basePath = document.querySelector('body[data-recipe-slug]') ? '../' : '';

  /* ── Mobile Navigation ── */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        nav.classList.remove('open');
        toggle?.classList.remove('active');
        document.body.style.overflow = '';
        hideSearchResults();
      }
    });
  }

  /* ── Dark Mode ── */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem(THEME_KEY, 'light');
          btn.textContent = '🌙';
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem(THEME_KEY, 'dark');
          btn.textContent = '☀️';
        }
      });
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        btn.textContent = '☀️';
      }
    });
  }

  /* ── Smooth Scroll ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const headerH = document.querySelector('.site-header')?.offsetHeight || 64;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - headerH,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ── Print ── */
  function initPrintButton() {
    document.querySelectorAll('[data-print]').forEach(function (btn) {
      btn.addEventListener('click', function () { window.print(); });
    });
  }

  /* ── Share Buttons ── */
  function initShareButtons() {
    document.querySelectorAll('[data-share]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const platform = this.dataset.share;
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        let shareUrl = '';

        switch (platform) {
          case 'facebook':
            shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
            break;
          case 'whatsapp':
            shareUrl = 'https://wa.me/?text=' + title + '%20' + url;
            break;
          case 'tiktok':
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              showToast('الرابط تنسخ! الصقوه في تيك توك 📋');
            }
            return;
        }
        if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400,noopener');
      });
    });
  }

  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('toast-hide');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  /* ── Weekly Plan: Highlight Today ── */
  function highlightToday() {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const today = days[new Date().getDay()];
    document.querySelectorAll('.day-card').forEach(function (card) {
      if (card.dataset.day === today) card.classList.add('today');
    });
  }

  /* ── Search with Autocomplete ── */
  function initSearch() {
    const input = document.querySelector('#site-search');
    const results = document.querySelector('#search-results');
    if (!input || !window.RECIPES) return;

    const wasfatBase = basePath + 'wasfat/';

    function filterRecipes(q) {
      q = q.trim().toLowerCase();
      if (!q) return [];
      return window.RECIPES.filter(function (r) {
        return r.title.toLowerCase().includes(q) ||
          r.categoryLabel.toLowerCase().includes(q) ||
          r.slug.includes(q);
      }).slice(0, 6);
    }

    function renderResults(items) {
      if (!items.length) {
        results.innerHTML = '<div class="search-empty">ما لقيناش وصفة — جرّب كلمة أخرى</div>';
        results.hidden = false;
        return;
      }
      results.innerHTML = items.map(function (r) {
        return '<a class="search-result-item" href="' + wasfatBase + r.slug + '.html">' +
          '<img src="' + r.image + '" alt="" width="40" height="40" loading="lazy">' +
          '<span><strong>' + r.emoji + ' ' + r.title + '</strong><small>' + r.categoryLabel + ' · ' + r.totalTime + ' د</small></span></a>';
      }).join('');
      results.hidden = false;
    }

    function hideSearchResults() {
      if (results) results.hidden = true;
    }

    input.addEventListener('input', function () {
      const items = filterRecipes(this.value);
      if (this.value.trim().length < 2) { hideSearchResults(); return; }
      renderResults(items);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const items = filterRecipes(this.value);
        if (items.length) window.location.href = wasfatBase + items[0].slug + '.html';
        else if (this.value.trim()) window.location.href = wasfatBase + '?q=' + encodeURIComponent(this.value.trim());
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-box')) hideSearchResults();
    });
  }

  /* ── Wasfat page: filter & search from URL ── */
  function initWasfatPage() {
    const grid = document.querySelector('#recipes-grid');
    if (!grid || !window.RECIPES) return;

    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    const q = params.get('q');

    function render(cards) {
      if (!cards.length) {
        grid.innerHTML = '<p class="no-results">ما لقيناش وصفات — جرّب تصنيف آخر</p>';
        return;
      }
      grid.innerHTML = cards.map(function (r) {
        return '<a href="' + r.slug + '.html" class="recipe-card" data-category="' + r.category + '">' +
          '<img class="recipe-card-img" src="' + r.image + '" alt="' + r.imageAlt + '" width="300" height="200" loading="lazy">' +
          '<div class="recipe-card-body">' +
          '<span class="card-category">' + r.categoryLabel + '</span>' +
          '<h3>' + r.emoji + ' ' + r.title + '</h3>' +
          '<div class="card-meta">⏱ ' + r.totalTime + ' د · 👥 ' + r.yield + ' · ⭐ ' + r.difficulty + '</div>' +
          '</div></a>';
      }).join('');
    }

    let filtered = window.RECIPES.slice();
    if (cat) filtered = filtered.filter(function (r) { return r.category === cat; });
    if (q) {
      const ql = q.toLowerCase();
      filtered = filtered.filter(function (r) {
        return r.title.toLowerCase().includes(ql) || r.categoryLabel.toLowerCase().includes(ql);
      });
    }
    render(filtered);

    document.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        const c = this.dataset.cat;
        document.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('active'); });
        this.classList.add('active');
        const list = c === 'all' ? window.RECIPES : window.RECIPES.filter(function (r) { return r.category === c; });
        render(list);
      });
    });

    if (q && document.querySelector('#site-search')) {
      document.querySelector('#site-search').value = q;
    }
  }

  /* ── Comment Form ── */
  function initCommentForm() {
    document.querySelectorAll('.comment-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const textarea = form.querySelector('textarea');
        const text = textarea.value.trim();
        if (!text) return;
        const list = form.parentElement.querySelector('.comments-list');
        if (!list) return;
        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = '<div class="comment-author">زائر</div><div class="comment-date">الآن</div><div class="comment-text"></div>';
        item.querySelector('.comment-text').textContent = text;
        list.prepend(item);
        textarea.value = '';
        showToast('تعليقك تسجّل! شكراً 🇹🇳');
      });
    });
  }

  /* ── Monetag Banner Placeholders ── */
  function initMonetagBanners() {
    document.querySelectorAll('.ad-slot[data-ad-type="banner"]').forEach(function (slot) {
      if (slot.children.length > 0 && !slot.querySelector('span')) return;
      const size = slot.dataset.size || 'auto';
      if (!slot.textContent.trim()) {
        slot.innerHTML = '<span>Monetag Banner ' + size + '</span>';
      }
    });
  }

  /* ── Load recipes-data then init search ── */
  function initWhenReady() {
    initMobileNav();
    initTheme();
    initSmoothScroll();
    initPrintButton();
    initShareButtons();
    highlightToday();
    initSearch();
    initWasfatPage();
    initCommentForm();
    initMonetagBanners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  } else {
    initWhenReady();
  }
})();