// Scroll-triggered fade-in for paper cards and list items.
// Adds .reveal to relevant elements, then toggles .is-visible when they enter the viewport.
(function () {
  if (typeof window === 'undefined') return;

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    var targets = document.querySelectorAll('.paper-box, #main h1, #main h2, #main ul li');
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('reveal'); });

    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
