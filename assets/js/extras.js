// Extras: progress bar, greeting, spotlight, paper expand+bibtex, citations, ⌘K palette.
(function () {
  if (typeof window === 'undefined') return;

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  // 1. Reading progress bar (B)
  // ============================================================
  function initProgressBar() {
    var bar = document.getElementById('reading-progress');
    if (!bar) return;
    function update() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // ============================================================
  // 2. Time-based greeting (P)
  // ============================================================
  function initGreeting() {
    var el = document.querySelector('.greeting');
    if (!el) return;
    var hour = new Date().getHours();
    var greet;
    if (hour < 5)       greet = 'Hello night owl';
    else if (hour < 12) greet = 'Good morning';
    else if (hour < 14) greet = 'Good noon';
    else if (hour < 18) greet = 'Good afternoon';
    else if (hour < 22) greet = 'Good evening';
    else                greet = 'Hello night owl';
    el.textContent = greet;
  }

  // ============================================================
  // 3. Mouse spotlight on paper cards (I)
  //    (also reuses for tilt --mouse-x/--mouse-y if desired)
  // ============================================================
  function initSpotlight() {
    var cards = document.querySelectorAll('.paper-box');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  // ============================================================
  // 4. Paper card expand + auto BibTeX (D)
  // ============================================================
  function slugify(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 12);
  }
  function getFirstAuthorLast(authorLine) {
    // Take the part before the first comma, then last word
    var first = (authorLine || '').split(',')[0].trim();
    // Strip markers like (co-first author)
    first = first.replace(/\(.*?\)/g, '').trim();
    var parts = first.split(/\s+/);
    return parts[parts.length - 1] || 'unknown';
  }
  function buildBibTeX(card) {
    var textBox = card.querySelector('.paper-box-text');
    if (!textBox) return '';
    // Title: from the first <a> link, or first <p>'s text
    var titleEl = textBox.querySelector('a');
    var title = titleEl ? titleEl.textContent.trim() : '';
    if (!title) {
      var p = textBox.querySelector('p');
      title = p ? p.textContent.trim() : 'Untitled';
    }
    // Authors: find a <p> that contains "Yue Fang" or just any <p> after title
    var authorLine = '';
    var paragraphs = textBox.querySelectorAll('p');
    for (var i = 0; i < paragraphs.length; i++) {
      var t = paragraphs[i].textContent;
      if (t.indexOf('Fang') !== -1 || t.indexOf(',') !== -1 && t.length > 30) {
        authorLine = t.trim();
        break;
      }
    }
    // Strip markers like (co-first author)
    var cleanAuthors = authorLine.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
    var authors = cleanAuthors.split(/,\s*/).filter(function (a) { return a; }).join(' and ');
    // Venue: from badge
    var badge = card.querySelector('.badge, .badge-red');
    var venue = badge ? badge.textContent.trim() : '';
    // Year: from data-year
    var year = card.getAttribute('data-year') || '';
    // Build key
    var lastName = getFirstAuthorLast(authorLine);
    var key = lastName.toLowerCase() + year + slugify(title);
    // Determine entry type
    var lc = venue.toLowerCase();
    var entryType = (lc.indexOf('arxiv') !== -1) ? '@article' :
                    (lc.indexOf('protocol') !== -1 || lc.indexOf('journal') !== -1) ? '@article' :
                    '@inproceedings';
    var venueField = (entryType === '@article') ? 'journal' : 'booktitle';

    return entryType + '{' + key + ',\n' +
      '  title     = {' + title + '},\n' +
      '  author    = {' + authors + '},\n' +
      '  ' + venueField + ' = {' + venue + '},\n' +
      '  year      = {' + year + '}\n' +
      '}';
  }
  function initExpand() {
    var cards = document.querySelectorAll('.paper-box');
    cards.forEach(function (card) {
      // Toggle button
      var btn = document.createElement('button');
      btn.className = 'paper-expand-toggle';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Show BibTeX');
      btn.title = 'Show BibTeX';
      btn.textContent = '+';
      card.appendChild(btn);

      // Panel
      var panel = document.createElement('div');
      panel.className = 'paper-expand-panel';
      var bib = buildBibTeX(card);
      panel.innerHTML =
        '<span class="panel-label">BibTeX</span>' +
        '<pre>' + bib.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>' +
        '<button class="copy-btn" type="button">Copy BibTeX</button>';
      card.appendChild(panel);

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        card.classList.toggle('is-expanded');
      });

      var copyBtn = panel.querySelector('.copy-btn');
      copyBtn.addEventListener('click', function () {
        var text = bib;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            copyBtn.textContent = '✓ Copied';
            copyBtn.classList.add('copied');
            setTimeout(function () {
              copyBtn.textContent = 'Copy BibTeX';
              copyBtn.classList.remove('copied');
            }, 1600);
          });
        }
      });
    });
  }

  // ============================================================
  // 5. Command Palette ⌘K (A)
  // ============================================================
  function initCmdK() {
    // Build commands list from DOM
    function buildCommands() {
      var cmds = [];

      // Sections (h1 in main content)
      var headings = document.querySelectorAll('#main h1');
      headings.forEach(function (h) {
        var label = h.textContent.trim();
        var id = h.id || (h.querySelector('a') && h.querySelector('a').id);
        cmds.push({
          icon: '§',
          label: label,
          meta: 'Section',
          group: 'Sections',
          run: function () { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
      });

      // Papers
      var cards = document.querySelectorAll('.paper-box');
      cards.forEach(function (card) {
        var titleLink = card.querySelector('.paper-box-text a');
        var title = titleLink ? titleLink.textContent.trim() : (card.querySelector('.paper-box-text p') || {}).textContent;
        if (!title) return;
        var venue = (card.querySelector('.badge, .badge-red') || {}).textContent || '';
        cmds.push({
          icon: '📄',
          label: title,
          meta: venue.trim(),
          group: 'Publications',
          run: function () {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('is-expanded');
            setTimeout(function () { card.classList.remove('is-expanded'); }, 2400);
          }
        });
        // Also add direct link command if available
        if (titleLink && titleLink.href && titleLink.href !== '#') {
          cmds.push({
            icon: '↗',
            label: 'Open paper: ' + title,
            meta: 'Link',
            group: 'Publications',
            run: function () { window.open(titleLink.href, '_blank'); }
          });
        }
      });

      // Static commands
      cmds.push({
        icon: '☾',
        label: 'Toggle dark mode',
        meta: 'Theme',
        group: 'Actions',
        run: function () {
          var t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', t);
          try { localStorage.setItem('theme', t); } catch (e) {}
        }
      });
      cmds.push({
        icon: '↑',
        label: 'Back to top',
        meta: 'Navigation',
        group: 'Actions',
        run: function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }
      });

      return cmds;
    }

    // Build modal HTML
    var overlay = document.createElement('div');
    overlay.className = 'cmdk-overlay';
    overlay.innerHTML =
      '<div class="cmdk-modal" role="dialog" aria-modal="true">' +
      '  <input class="cmdk-input" type="text" placeholder="Search sections, papers, actions..." spellcheck="false" />' +
      '  <ul class="cmdk-list"></ul>' +
      '  <div class="cmdk-footer">' +
      '    <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>' +
      '    <span><kbd>↵</kbd> select</span>' +
      '    <span><kbd>esc</kbd> close</span>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('.cmdk-input');
    var list = overlay.querySelector('.cmdk-list');
    var allCommands = [];
    var filtered = [];
    var selectedIndex = 0;

    function fuzzyMatch(query, text) {
      query = query.toLowerCase().trim();
      text = text.toLowerCase();
      if (!query) return true;
      // simple subsequence match
      var qi = 0;
      for (var ti = 0; ti < text.length && qi < query.length; ti++) {
        if (text[ti] === query[qi]) qi++;
      }
      return qi === query.length;
    }
    function score(query, text) {
      query = query.toLowerCase().trim();
      text = text.toLowerCase();
      if (!query) return 0;
      var idx = text.indexOf(query);
      if (idx === 0) return 1000;        // prefix match
      if (idx > 0) return 500 - idx;     // substring match
      return 100;                         // fuzzy
    }

    function render() {
      list.innerHTML = '';
      if (!filtered.length) {
        list.innerHTML = '<li class="cmdk-empty">No matches.</li>';
        return;
      }
      var lastGroup = null;
      filtered.forEach(function (cmd, i) {
        if (cmd.group !== lastGroup) {
          var label = document.createElement('li');
          label.className = 'cmdk-section-label';
          label.textContent = cmd.group;
          list.appendChild(label);
          lastGroup = cmd.group;
        }
        var li = document.createElement('li');
        li.className = 'cmdk-item' + (i === selectedIndex ? ' is-selected' : '');
        li.innerHTML =
          '<span class="cmdk-item-icon">' + cmd.icon + '</span>' +
          '<span class="cmdk-item-label"></span>' +
          '<span class="cmdk-item-meta"></span>';
        li.querySelector('.cmdk-item-label').textContent = cmd.label;
        li.querySelector('.cmdk-item-meta').textContent = cmd.meta || '';
        li.addEventListener('mouseenter', function () {
          selectedIndex = i;
          updateSelection();
        });
        li.addEventListener('click', function () { execute(cmd); });
        list.appendChild(li);
      });
    }

    function updateSelection() {
      var items = list.querySelectorAll('.cmdk-item');
      items.forEach(function (el, i) {
        el.classList.toggle('is-selected', i === selectedIndex);
        if (i === selectedIndex) el.scrollIntoView({ block: 'nearest' });
      });
    }

    function filter() {
      var q = input.value;
      if (!q.trim()) {
        filtered = allCommands.slice();
      } else {
        filtered = allCommands
          .filter(function (c) { return fuzzyMatch(q, c.label); })
          .sort(function (a, b) { return score(q, b.label) - score(q, a.label); });
      }
      selectedIndex = 0;
      render();
    }

    function execute(cmd) {
      close();
      // Defer so close animation runs
      setTimeout(function () { cmd.run(); }, 50);
    }

    function open() {
      allCommands = buildCommands();
      filtered = allCommands.slice();
      selectedIndex = 0;
      input.value = '';
      render();
      overlay.classList.add('is-open');
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
      overlay.classList.remove('is-open');
    }

    input.addEventListener('input', filter);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filtered.length) selectedIndex = (selectedIndex + 1) % filtered.length;
        updateSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filtered.length) selectedIndex = (selectedIndex - 1 + filtered.length) % filtered.length;
        updateSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) execute(filtered[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
      var isMod = e.metaKey || e.ctrlKey;
      if (isMod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (overlay.classList.contains('is-open')) close();
        else open();
      }
    });
  }

  function init() {
    initProgressBar();
    initGreeting();
    initSpotlight();
    initExpand();
    initCmdK();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
