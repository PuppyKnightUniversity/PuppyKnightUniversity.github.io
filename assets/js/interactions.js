// Interactions: author highlight, back-to-top, 3D tilt, publication filter, dark mode toggle.
(function () {
  if (typeof window === 'undefined') return;

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;

  // ----- 1. Author "me" highlight ---------------------------------
  function highlightAuthor() {
    var me = 'Yue Fang';
    var bolds = document.querySelectorAll('.paper-box-text strong');
    bolds.forEach(function (el) {
      if (el.textContent.indexOf(me) !== -1) {
        el.classList.add('me');
      }
    });
  }

  // ----- 2. Back-to-top --------------------------------------------
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    function update() {
      if (window.scrollY > 400) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    }
    window.addEventListener('scroll', update, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
    update();
  }

  // ----- 3. 3D tilt on paper cards ---------------------------------
  function initTilt() {
    if (prefersReduced || isTouch) return;
    var cards = document.querySelectorAll('.paper-box');
    cards.forEach(function (card) {
      card.classList.add('tilt');
      var rect;
      function onEnter() { rect = card.getBoundingClientRect(); }
      function onMove(e) {
        if (!rect) rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;   // 0..1
        var py = (e.clientY - rect.top) / rect.height;   // 0..1
        var rx = (0.5 - py) * 6;  // tilt up/down, max 3deg
        var ry = (px - 0.5) * 8;  // tilt left/right, max 4deg
        card.style.setProperty('--tilt-x', rx.toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', ry.toFixed(2) + 'deg');
      }
      function onLeave() {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        rect = null;
      }
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  // ----- 4. Publication filter -------------------------------------
  function initFilter() {
    var btns = document.querySelectorAll('.pub-filter-btn');
    if (!btns.length) return;
    var cards = document.querySelectorAll('.paper-box');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        btns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        cards.forEach(function (card) {
          var year = card.getAttribute('data-year');
          var venue = card.getAttribute('data-venue');
          var match;
          if (f === 'all') match = true;
          else if (f.indexOf('year-') === 0) match = ('year-' + year) === f;
          else match = (venue === f);

          if (match) card.classList.remove('is-hidden');
          else card.classList.add('is-hidden');
        });
      });
    });
  }

  // ----- 5. Dark mode toggle ---------------------------------------
  function initThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  function init() {
    highlightAuthor();
    initBackToTop();
    initTilt();
    initFilter();
    initThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
