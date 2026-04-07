// Academic data viz: stats counters, papers-per-year sparkline, co-author network.
(function () {
  if (typeof window === 'undefined') return;

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  //  Helpers
  // ============================================================
  function svgEl(name, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);
    if (attrs) for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }
  function animateCounter(el, target, duration) {
    if (prefersReduced) { el.textContent = target; return; }
    var start = 0;
    var t0 = performance.now();
    function tick(t) {
      var p = Math.min(1, (t - t0) / duration);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ============================================================
  // 1. Stats counters
  // ============================================================
  function collectStats() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.paper-box'));
    var papers = cards.length;
    var firstAuthor = 0;
    var venueSet = {};
    var yearSet = {};
    cards.forEach(function (card) {
      // First-author detection
      var authorP = null;
      var ps = card.querySelectorAll('.paper-box-text p');
      ps.forEach(function (p) {
        if (!authorP && p.textContent.indexOf('Fang') !== -1 && p.textContent.indexOf(',') !== -1) {
          authorP = p;
        }
      });
      if (authorP) {
        var raw = authorP.textContent.replace(/\(.*?\)/g, '').replace(/\*/g, '').trim();
        var names = raw.split(/,\s*/);
        var meIdx = -1;
        for (var i = 0; i < names.length; i++) {
          if (/Yue\s*Fang/i.test(names[i])) { meIdx = i; break; }
        }
        var hasCoFirst = /co.{0,2}first/i.test(authorP.textContent);
        if (meIdx === 0 || (hasCoFirst && meIdx >= 0 && meIdx < 4)) firstAuthor++;
      }
      var venue = card.getAttribute('data-venue');
      var year = card.getAttribute('data-year');
      if (venue) venueSet[venue] = 1;
      if (year) yearSet[year] = 1;
    });
    return {
      papers: papers,
      firstAuthor: firstAuthor,
      venues: Object.keys(venueSet).length,
      years: Object.keys(yearSet).length
    };
  }

  function initStatCounters() {
    var stats = collectStats();
    var papersEl = document.querySelector('.stat-card[data-stat="papers"] .stat-value');
    var firstEl  = document.querySelector('.stat-card[data-stat="first-author"] .stat-value');
    var venuesEl = document.querySelector('.stat-card[data-stat="venues"] .stat-value');
    var yearsEl  = document.querySelector('.stat-card[data-stat="years"] .stat-value');

    // Run when stats strip enters viewport
    var strip = document.querySelector('.stats-strip');
    var fired = false;
    function fire() {
      if (fired) return; fired = true;
      if (papersEl) animateCounter(papersEl, stats.papers, 1100);
      if (firstEl)  animateCounter(firstEl,  stats.firstAuthor, 1100);
      if (venuesEl) animateCounter(venuesEl, stats.venues, 1100);
      if (yearsEl)  animateCounter(yearsEl,  stats.years, 1100);
    }
    if ('IntersectionObserver' in window && strip) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { fire(); io.disconnect(); } });
      }, { threshold: 0.2 });
      io.observe(strip);
    } else {
      fire();
    }
  }

  // ============================================================
  // 2. Papers-per-year sparkline
  // ============================================================
  function initSparkline() {
    var svg = document.querySelector('.sparkline');
    if (!svg) return;
    var cards = document.querySelectorAll('.paper-box[data-year]');
    var counts = {};
    cards.forEach(function (c) {
      var y = c.getAttribute('data-year');
      if (!y) return;
      counts[y] = (counts[y] || 0) + 1;
    });
    var years = Object.keys(counts).sort();
    if (!years.length) return;
    // Ensure continuous range
    var minY = +years[0], maxY = +years[years.length - 1];
    var data = [];
    for (var y = minY; y <= maxY; y++) data.push({ year: y, count: counts[y] || 0 });

    var W = 320, H = 80, padX = 18, padY = 18;
    var maxCount = Math.max.apply(null, data.map(function (d) { return d.count; }));
    var stepX = data.length > 1 ? (W - padX * 2) / (data.length - 1) : 0;
    var scaleY = function (v) { return H - padY - (v / Math.max(1, maxCount)) * (H - padY * 2); };

    // Defs for gradients
    var defs = svgEl('defs');
    defs.innerHTML =
      '<linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">' +
      '  <stop offset="0%" stop-color="#4a7dff" stop-opacity="0.45"/>' +
      '  <stop offset="100%" stop-color="#4a7dff" stop-opacity="0"/>' +
      '</linearGradient>' +
      '<linearGradient id="sparkLineGradient" x1="0" y1="0" x2="1" y2="0">' +
      '  <stop offset="0%" stop-color="#00369f"/>' +
      '  <stop offset="50%" stop-color="#4a7dff"/>' +
      '  <stop offset="100%" stop-color="#c44ad6"/>' +
      '</linearGradient>';
    svg.appendChild(defs);

    // Build line + area
    var pts = data.map(function (d, i) {
      return [padX + i * stepX, scaleY(d.count)];
    });
    var lineD = pts.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]; }).join(' ');
    var areaD = lineD + ' L' + pts[pts.length - 1][0] + ',' + (H - padY) +
                ' L' + pts[0][0] + ',' + (H - padY) + ' Z';

    svg.appendChild(svgEl('path', { class: 'spark-area', d: areaD }));
    svg.appendChild(svgEl('path', { class: 'spark-line', d: lineD }));

    pts.forEach(function (p, i) {
      var dot = svgEl('circle', { class: 'spark-dot', cx: p[0], cy: p[1], r: 3.5 });
      var title = svgEl('title');
      title.textContent = data[i].year + ': ' + data[i].count + ' paper' + (data[i].count === 1 ? '' : 's');
      dot.appendChild(title);
      svg.appendChild(dot);
      // Year label below
      var label = svgEl('text', { class: 'spark-label', x: p[0], y: H - 4 });
      label.textContent = data[i].year;
      svg.appendChild(label);
      // Value above
      var val = svgEl('text', { class: 'spark-value', x: p[0], y: p[1] - 7 });
      val.textContent = data[i].count;
      svg.appendChild(val);
    });
  }

  function init() {
    initStatCounters();
    initSparkline();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
