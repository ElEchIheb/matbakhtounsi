/**
 * مسارات نسبية — تعمل محلياً وعلى Netlify
 */
(function () {
  'use strict';
  var depth = parseInt(document.documentElement.getAttribute('data-depth') || '0', 10);
  var base = depth === 0 ? '' : '../'.repeat(depth);
  window.SITE = {
    base: base,
    home: base + 'index.html',
    wasfat: base + 'wasfat/index.html',
    blog: base + 'blog/index.html',
    adawat: base + 'adawat/index.html',
    ugc: base + 'men-matbakhekum/index.html',
    about: base + 'aanna/index.html',
    contact: base + 'ittasil-bina/index.html',
    privacy: base + 'privacy/index.html',
    recipe: function (slug) { return base + 'wasfat/' + slug + '.html'; }
  };
})();