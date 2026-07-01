/**
 * مطبخنا التونسي — Wasfat Tounsia
 * Main JavaScript — minimal, performance-focused
 */

(function () {
  'use strict';

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
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Smooth Scroll for anchor links ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const headerH = document.querySelector('.site-header')?.offsetHeight || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Lazy Loading images (native + fallback) ── */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) return;

    const images = document.querySelectorAll('img[loading="lazy"]');
    if (!images.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      });
    }, { rootMargin: '200px' });

    images.forEach(function (img) { observer.observe(img); });
  }

  /* ── Print Recipe ── */
  function initPrintButton() {
    document.querySelectorAll('[data-print]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.print();
      });
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
              navigator.clipboard.writeText(decodeURIComponent(url));
              showToast('الرابط تنسخ! الصقوه في تيك توك 📋');
            }
            return;
        }

        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400,noopener');
        }
      });
    });
  }

  /* ── Simple Toast Notification ── */
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = [
      'position:fixed',
      'bottom:2rem',
      'left:50%',
      'transform:translateX(-50%)',
      'background:#006233',
      'color:#fff',
      'padding:0.75rem 1.5rem',
      'border-radius:50px',
      'font-family:Cairo,sans-serif',
      'font-size:0.9rem',
      'z-index:9999',
      'box-shadow:0 4px 20px rgba(0,0,0,0.2)',
      'animation:fadeInUp 0.3s ease'
    ].join(';');

    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  /* ── Weekly Plan: Highlight Today ── */
  function highlightToday() {
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const today = days[new Date().getDay()];
    document.querySelectorAll('.day-card').forEach(function (card) {
      if (card.dataset.day === today) {
        card.classList.add('today');
      }
    });
  }

  /* ── Simple Search (client-side filter on wasfat page) ── */
  function initSearch() {
    const searchInput = document.querySelector('#site-search');
    if (!searchInput) return;

    searchInput.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const query = this.value.trim();
      if (query) {
        window.location.href = '/wasfat/?q=' + encodeURIComponent(query);
      }
    });
  }

  /* ── Comment Form (demo — no backend) ── */
  function initCommentForm() {
    const form = document.querySelector('.comment-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const textarea = form.querySelector('textarea');
      const text = textarea.value.trim();
      if (!text) return;

      const list = document.querySelector('.comments-list');
      if (!list) return;

      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML =
        '<div class="comment-author">زائر</div>' +
        '<div class="comment-date">الآن</div>' +
        '<div class="comment-text">' + escapeHtml(text) + '</div>';

      list.prepend(item);
      textarea.value = '';
      showToast('تعليقك تسجّل! شكراً 🇹🇳');
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ── Monetag Popunder Simulation ── */
  function initMonetagPopunder() {
    /*
     * MONETAG POPUNDER — استبدل هذا القسم بكود Monetag الحقيقي:
     *
     * <script src="https://...monetag.../popunder.js" data-zone="YOUR_ZONE_ID"></script>
     *
     * أو الصق الكود في index.html و lablabi-tounsi.html داخل:
     * <!-- MONETAG POPUNDER CODE HERE -->
     */

    const POPUNDER_DELAY = 45000;
    const POPUNDER_ENABLED = true;
    const STORAGE_KEY = 'mt_popunder_shown';

    if (!POPUNDER_ENABLED) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let triggered = false;

    function triggerPopunder(source) {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem(STORAGE_KEY, '1');

      const slot = document.getElementById('monetag-popunder-slot');
      if (slot) {
        slot.innerHTML =
          '<div style="padding:1rem;text-align:center;font-family:Cairo,sans-serif">' +
          '<strong>Monetag Popunder</strong><br>' +
          '<small>مصدر: ' + source + ' — استبدل بكود Monetag الحقيقي</small>' +
          '</div>';
      }

      console.info('[Monetag] Popunder triggered via:', source);
    }

    setTimeout(function () {
      triggerPopunder('timer-45s');
    }, POPUNDER_DELAY);

    document.addEventListener('mouseleave', function (e) {
      if (e.clientY <= 0) {
        triggerPopunder('exit-intent');
      }
    });
  }

  /* ── Monetag Banner Placeholder Loader ── */
  function initMonetagBanners() {
    /*
     * لكل banner slot، الصق كود Monetag داخل العنصر.
     * مثال:
     * document.getElementById('monetag-header-banner').innerHTML = 'YOUR_BANNER_CODE';
     */
    document.querySelectorAll('.ad-slot[data-ad-type="banner"]').forEach(function (slot) {
      if (slot.children.length > 0) return;
      const size = slot.dataset.size || 'auto';
      slot.innerHTML =
        '<span>Monetag Banner ' + size + '<br>الصق كود الإعلان هنا</span>';
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initSmoothScroll();
    initLazyLoad();
    initPrintButton();
    initShareButtons();
    highlightToday();
    initSearch();
    initCommentForm();
    initMonetagBanners();
    initMonetagPopunder();
  });
})();