// Maodi pixel battle animation — wide forest scene with monster encounters.
// Self-contained: finds <canvas id="maodi-canvas"> and runs the loop on it.
(function () {
  if (typeof window === 'undefined') return;

  function init() {
    const cv = document.getElementById('maodi-canvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');

    // ─── PALETTE ─────────────────────────────────────────────
    const PALETTE = {
      sky:    { top: '#cfe7d4', mid: '#e3eec6', low: '#f4ecbe' },
      forest: {
        far:  '#7ba27a', mid: '#52805a', near: '#355d44',
        grass: '#84a754', grassDark: '#5d7a3a', grassHi: '#b8d075',
        trunk: '#5a3a24'
      },
      light:  { ray: 'rgba(255, 240, 180, 0.18)' },
      maodi:  { body: '#1a1a20', eye: '#3ad8e6', collar: '#f4c842' },
      slime:  { body: '#4a6b3a', shade: '#324a25', eye: '#ff5050', highlight: '#7a9a55' },
      mush:   { cap: '#c44a4a', capDark: '#8a2828', spot: '#ffffff', stem: '#e8d4a8', stemShade: '#c4ad7a', eye: '#1a1a20' },
      bat:    { body: '#1a1a20', wing: '#2d2d3a', eye: '#ff4040' },
      ui:     { white: '#ffffff' }
    };

    // ─── GRID ────────────────────────────────────────────────
    const PX = 10;
    const GW = cv.width / PX;   // 72
    const GH = cv.height / PX;  // 36

    function px(gx, gy, col) {
      ctx.fillStyle = col;
      ctx.fillRect(gx * PX, gy * PX, PX, PX);
    }

    // ─── MAODI SPRITE (16×15) ────────────────────────────────
    const MAODI_BODY = {
      width: 16, height: 15,
      data: [
        [ 0,1,1,0,0,0,0,0,0,0, 0, 0, 0, 1, 1, 0],
        [ 0,1,1,1,0,0,0,0,0,0, 0, 0, 1, 1, 1, 0],
        [ 1,1,1,1,0,0,0,0,0,0, 0, 0, 1, 1, 1, 1],
        [ 1,1,1,1,1,1,1,1,1,1, 1, 1, 1, 1, 1, 1],
        [ 1,1,1,1,1,1,1,1,1,1, 1, 1, 1, 1, 1, 1],
        [ 1,1,1,2,2,1,1,1,1,1, 1, 2, 2, 1, 1, 1],
        [ 1,1,1,2,2,1,1,1,1,1, 1, 2, 2, 1, 1, 1],
        [ 1,1,1,1,1,1,1,1,1,1, 1, 1, 1, 1, 1, 1],
        [ 1,1,1,1,1,1,1,1,1,1, 1, 1, 1, 1, 1, 1],
        [ 0,1,1,1,1,1,1,1,1,1, 1, 1, 1, 1, 1, 0],
        [ 0,1,1,1,1,1,1,1,1,1, 1, 1, 1, 1, 1, 0],
        [ 0,1,1,1,1,1,1,1,1,1, 1, 1, 1, 1, 1, 0],
        [ 0,1,1,1,1,1,1,1,1,1, 1, 1, 1, 1, 1, 0],
        [ 0,0,1,1,1,0,0,0,0,0, 0, 1, 1, 1, 0, 0],
        [ 0,0,1,1,1,0,0,0,0,0, 0, 1, 1, 1, 0, 0],
      ],
      anchors: { eyeLeft: { x: 3, y: 5 }, eyeRight: { x: 11, y: 5 } }
    };

    const TAIL = [
      [[0,0,1,0],[0,1,1,0],[0,1,0,0],[1,1,0,0]],
      [[0,1,1,0],[0,1,0,0],[1,1,0,0],[1,0,0,0]],
      [[1,1,0,0],[1,1,0,0],[1,0,0,0],[1,0,0,0]],
      [[0,1,1,0],[0,1,0,0],[1,1,0,0],[1,0,0,0]],
    ];

    const EYES = {
      forward:    { ldx:0, ldy:0, rdx:0, rdy:0 },
      look_right: { ldx:1, ldy:0, rdx:1, rdy:0 },
      look_left:  { ldx:-1,ldy:0, rdx:-1,rdy:0 },
      look_up:    { ldx:0, ldy:-1,rdx:0, rdy:-1 },
      blink:      { type: 'squint' },
      closed:     { type: 'hidden' }
    };

    const SCARF = {
      main: [
        [2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],
        [1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9],[10,9],[11,9],[12,9],[13,9],[14,9],
      ],
      trail: [[13,10],[14,10],[14,11]]
    };

    // ─── MONSTER SPRITES ─────────────────────────────────────

    // Slime — round green blob with red eyes (8×6)
    const SLIME = {
      width: 8, height: 6,
      data: [
        [0,0,1,1,1,1,0,0],
        [0,1,1,3,1,3,1,0],   // 3 = highlight
        [1,1,1,1,1,1,1,1],
        [1,1,2,1,1,2,1,1],   // 2 = red eye
        [1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,0],
      ]
    };

    // Mushroom — red cap with white spots, cream stem (10×9)
    const MUSH = {
      width: 10, height: 9,
      data: [
        //0 1 2 3 4 5 6 7 8 9
        [ 0,0,1,1,1,1,1,1,0,0],   // 1 = cap
        [ 0,1,1,1,1,1,1,1,1,0],
        [ 1,1,1,4,1,1,4,1,1,1],   // 4 = white spot
        [ 1,1,4,4,1,1,4,4,1,1],
        [ 1,1,1,1,1,1,1,1,1,1],
        [ 0,5,5,5,5,5,5,5,5,0],   // 5 = stem
        [ 0,5,2,5,5,5,5,2,5,0],   // 2 = eye
        [ 0,5,5,5,5,5,5,5,5,0],
        [ 0,5,5,5,5,5,5,5,5,0],
      ]
    };

    // Bat — flying creature (10×5)
    const BAT = {
      width: 10, height: 5,
      data: [
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,0,0,0,0,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [0,1,2,1,1,1,1,2,1,0],   // 2 = red eye
        [0,0,1,1,0,0,1,1,0,0],
      ]
    };

    function drawSlime(ox, oy, opts = {}) {
      const wobble = opts.wobble ? Math.sin((opts.frame || 0) * 0.2) * 0.5 : 0;
      const yo = oy + Math.round(wobble);
      for (let r = 0; r < SLIME.height; r++) {
        for (let c = 0; c < SLIME.width; c++) {
          const v = SLIME.data[r][c];
          if (v === 1) px(ox + c, yo + r, PALETTE.slime.body);
          else if (v === 2) px(ox + c, yo + r, PALETTE.slime.eye);
          else if (v === 3) px(ox + c, yo + r, PALETTE.slime.highlight);
        }
      }
    }

    function drawMush(ox, oy, opts = {}) {
      const wobble = opts.wobble ? Math.sin((opts.frame || 0) * 0.15 + 1) * 0.3 : 0;
      const yo = oy + Math.round(wobble);
      for (let r = 0; r < MUSH.height; r++) {
        for (let c = 0; c < MUSH.width; c++) {
          const v = MUSH.data[r][c];
          if (v === 1) px(ox + c, yo + r, PALETTE.mush.cap);
          else if (v === 2) px(ox + c, yo + r, PALETTE.mush.eye);
          else if (v === 4) px(ox + c, yo + r, PALETTE.mush.spot);
          else if (v === 5) px(ox + c, yo + r, PALETTE.mush.stem);
        }
      }
    }

    function drawBat(ox, oy, opts = {}) {
      const flap = Math.sin((opts.frame || 0) * 0.4);
      const yo = oy + Math.round(flap * 1.2);
      // Wing flap: replace top-row outer pixels based on flap phase
      for (let r = 0; r < BAT.height; r++) {
        for (let c = 0; c < BAT.width; c++) {
          const v = BAT.data[r][c];
          if (v === 1) px(ox + c, yo + r, PALETTE.bat.body);
          else if (v === 2) px(ox + c, yo + r, PALETTE.bat.eye);
        }
      }
    }

    // ─── MONSTER STATE ───────────────────────────────────────
    // Each monster: { type, baseX, y, alive, defeatedAt, defeatX, defeatY, hasFlying }
    let monsters = [];

    function resetMonsters() {
      monsters = [
        { type: 'slime', baseX: 42, y: 21, alive: true, defeatedAt: -999, w: 8 },
        { type: 'mush',  baseX: 50, y: 18, alive: true, defeatedAt: -999, w: 10 },
        { type: 'slime', baseX: 60, y: 21, alive: true, defeatedAt: -999, w: 8 },
        { type: 'bat',   baseX: 56, y: 7,  alive: true, defeatedAt: -999, w: 10 },
      ];
    }
    resetMonsters();

    // ─── BACKGROUND (forest, extended to 72 cols) ────────────
    const TREE_SMALL = [
      [0,1,1,1,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],
      [0,1,1,1,0],[0,0,2,0,0],[0,0,2,0,0],
    ];
    const TREE_PINE = [
      [0,1,1,0],[0,1,1,0],[1,1,1,1],[0,1,1,0],
      [1,1,1,1],[0,1,1,0],[0,2,2,0],[0,2,2,0],
    ];
    const TREE_LARGE = [
      [0,1,1,1,1,0],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1],
      [1,1,1,1,1,1],[0,1,1,1,1,0],[0,0,2,2,0,0],[0,0,2,2,0,0],
    ];

    // Far layer — distant horizon trees
    const FAR_TREES = [
      { sprite: TREE_SMALL, x: 0,  y: 13, col: 'far' },
      { sprite: TREE_SMALL, x: 5,  y: 12, col: 'far' },
      { sprite: TREE_LARGE, x: 9,  y: 11, col: 'far' },
      { sprite: TREE_SMALL, x: 14, y: 13, col: 'far' },
      { sprite: TREE_LARGE, x: 18, y: 11, col: 'far' },
      { sprite: TREE_SMALL, x: 24, y: 12, col: 'far' },
      { sprite: TREE_LARGE, x: 28, y: 11, col: 'far' },
      { sprite: TREE_SMALL, x: 34, y: 13, col: 'far' },
      { sprite: TREE_LARGE, x: 38, y: 11, col: 'far' },
      { sprite: TREE_SMALL, x: 44, y: 12, col: 'far' },
      { sprite: TREE_LARGE, x: 48, y: 11, col: 'far' },
      { sprite: TREE_SMALL, x: 54, y: 13, col: 'far' },
      { sprite: TREE_LARGE, x: 58, y: 11, col: 'far' },
      { sprite: TREE_SMALL, x: 64, y: 12, col: 'far' },
      { sprite: TREE_LARGE, x: 68, y: 11, col: 'far' },
    ];
    // Mid layer
    const MID_TREES = [
      { sprite: TREE_PINE,  x: 1,  y: 17, col: 'mid' },
      { sprite: TREE_LARGE, x: 5,  y: 16, col: 'mid' },
      { sprite: TREE_PINE,  x: 14, y: 17, col: 'mid' },
      { sprite: TREE_LARGE, x: 20, y: 16, col: 'mid' },
      { sprite: TREE_PINE,  x: 26, y: 17, col: 'mid' },
      { sprite: TREE_LARGE, x: 30, y: 16, col: 'mid' },
      { sprite: TREE_PINE,  x: 36, y: 17, col: 'mid' },
      { sprite: TREE_LARGE, x: 46, y: 16, col: 'mid' },
      { sprite: TREE_PINE,  x: 56, y: 17, col: 'mid' },
      { sprite: TREE_LARGE, x: 64, y: 16, col: 'mid' },
    ];
    // Foreground corners
    const NEAR_TREES = [
      { sprite: TREE_LARGE, x: -1, y: 24, col: 'near' },
      { sprite: TREE_LARGE, x: 67, y: 24, col: 'near' },
    ];

    function drawTree(tree) {
      const sp = tree.sprite;
      for (let r = 0; r < sp.length; r++) {
        for (let c = 0; c < sp[r].length; c++) {
          if (sp[r][c] === 1) px(tree.x + c, tree.y + r, PALETTE.forest[tree.col]);
          else if (sp[r][c] === 2) px(tree.x + c, tree.y + r, PALETTE.forest.trunk);
        }
      }
    }

    const GRASS_BLADES = (function() {
      const blades = [];
      for (let i = 0; i < 130; i++) {
        blades.push({
          x: i * 0.55 + (i * 17 % 5) * 0.1,
          h: 1 + (i * 13 % 3),
          col: i % 4 === 0 ? 'grassHi' : i % 3 === 0 ? 'grassDark' : 'grass'
        });
      }
      return blades;
    })();

    function drawBg(f) {
      const grad = ctx.createLinearGradient(0, 0, 0, cv.height * 0.8);
      grad.addColorStop(0,   PALETTE.sky.top);
      grad.addColorStop(0.5, PALETTE.sky.mid);
      grad.addColorStop(1,   PALETTE.sky.low);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cv.width, cv.height * 0.78);

      // Sun glow
      const sunX = cv.width * 0.85, sunY = cv.height * 0.16;
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, cv.width * 0.20);
      sunGrad.addColorStop(0,   'rgba(255, 248, 200, 0.55)');
      sunGrad.addColorStop(0.4, 'rgba(255, 245, 180, 0.20)');
      sunGrad.addColorStop(1,   'rgba(255, 245, 180, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, cv.width, cv.height);

      // Diagonal light rays (more of them, scaled to wider canvas)
      ctx.save();
      ctx.fillStyle = PALETTE.light.ray;
      for (let i = 0; i < 6; i++) {
        const sway = Math.sin(f * 0.02 + i) * 8;
        const offset = i * 70 + sway;
        ctx.beginPath();
        ctx.moveTo(cv.width * 0.75 + offset, 0);
        ctx.lineTo(cv.width * 0.50 + offset, cv.height * 0.7);
        ctx.lineTo(cv.width * 0.53 + offset, cv.height * 0.7);
        ctx.lineTo(cv.width * 0.78 + offset, 0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      FAR_TREES.forEach(drawTree);
      MID_TREES.forEach(drawTree);

      // Grass plane
      ctx.fillStyle = PALETTE.forest.grass;
      ctx.fillRect(0, 26 * PX, cv.width, cv.height);
      ctx.fillStyle = PALETTE.forest.grassDark;
      ctx.fillRect(0, 30 * PX, cv.width, cv.height);

      // Grass shadow line
      for (let gx = 0; gx < GW; gx += 2) px(gx, 26, PALETTE.forest.grassHi);

      // Grass blades
      GRASS_BLADES.forEach(b => {
        for (let dy = 0; dy < b.h; dy++) {
          px(Math.floor(b.x), 26 - dy, PALETTE.forest[b.col]);
        }
      });

      NEAR_TREES.forEach(drawTree);
    }

    // ─── AMBIENT FIREFLIES ───────────────────────────────────
    const AMBIENT = (function() {
      const arr = [];
      for (let i = 0; i < 22; i++) {
        arr.push({
          baseX: Math.random() * GW,
          baseY: 4 + Math.random() * 18,
          speed: 0.4 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          bright: Math.random() > 0.7
        });
      }
      return arr;
    })();

    function drawAmbient(f) {
      AMBIENT.forEach(a => {
        const x = a.baseX + Math.sin(f * 0.02 * a.speed + a.phase) * 1.5;
        const y = a.baseY + Math.cos(f * 0.015 * a.speed + a.phase) * 1.0;
        const flick = (Math.sin(f * 0.1 + a.phase * 3) + 1) * 0.5;
        if (flick > 0.4) {
          px(Math.round(x), Math.round(y), a.bright ? '#fff5b8' : '#e8f0c0');
        }
      });
    }

    // ─── DRAW MAODI ──────────────────────────────────────────
    function drawMaodi(ox, oy, opts = {}) {
      const eyeVariant = opts.eyes || 'forward';
      const bodyCol = PALETTE.maodi.body;
      const eyeCol = PALETTE.maodi.eye;
      const ev = EYES[eyeVariant];

      for (let r = 0; r < MAODI_BODY.height; r++) {
        for (let c = 0; c < MAODI_BODY.width; c++) {
          const v = MAODI_BODY.data[r][c];
          if (v === 1) px(ox + c, oy + r, bodyCol);
          else if (v === 2) {
            if (ev && ev.type === 'squint') {
              px(ox + c, oy + r, r === 5 ? eyeCol : bodyCol);
            } else if (ev && ev.type === 'hidden') {
              px(ox + c, oy + r, bodyCol);
            } else if (eyeVariant === 'forward') {
              px(ox + c, oy + r, eyeCol);
            } else {
              px(ox + c, oy + r, bodyCol);
            }
          }
        }
      }

      if (ev && ev.type === undefined && eyeVariant !== 'forward') {
        const el = MAODI_BODY.anchors.eyeLeft;
        const er = MAODI_BODY.anchors.eyeRight;
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            px(ox + el.x + dx + ev.ldx, oy + el.y + dy + ev.ldy, eyeCol);
            px(ox + er.x + dx + ev.rdx, oy + er.y + dy + ev.rdy, eyeCol);
          }
        }
      }

      if (opts.scarf) {
        const scarfCol = PALETTE.maodi.collar;
        const scarfShade = '#d8a520';
        SCARF.main.forEach(p => {
          px(ox + p[0], oy + p[1], p[1] === 9 ? scarfShade : scarfCol);
        });
        SCARF.trail.forEach(p => px(ox + p[0], oy + p[1], scarfCol));
      }

      if (opts.glow) {
        const el = MAODI_BODY.anchors.eyeLeft;
        const er = MAODI_BODY.anchors.eyeRight;
        ctx.fillStyle = 'rgba(58, 216, 230, 0.28)';
        ctx.fillRect((ox + el.x - 1) * PX, (oy + el.y - 1) * PX, 4 * PX, 4 * PX);
        ctx.fillRect((ox + er.x - 1) * PX, (oy + er.y - 1) * PX, 4 * PX, 4 * PX);
      }
    }

    function drawChibiSquashed(ox, oy, scaleY, withScarf = false) {
      ctx.save();
      const bottomY = (oy + MAODI_BODY.height) * PX;
      ctx.translate(0, bottomY);
      ctx.scale(1, scaleY);
      ctx.translate(0, -bottomY);
      drawMaodi(ox, oy, { eyes: 'forward', glow: true, scarf: withScarf });
      ctx.restore();
    }

    function drawBeam(centerX, topY, bottomY, intensity) {
      const beamW = 6;
      const beamX = centerX - beamW / 2;
      const grad = ctx.createLinearGradient(beamX * PX, 0, (beamX + beamW) * PX, 0);
      grad.addColorStop(0,   `rgba(58, 216, 230, 0)`);
      grad.addColorStop(0.5, `rgba(180, 245, 255, ${0.85 * intensity})`);
      grad.addColorStop(1,   `rgba(58, 216, 230, 0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(beamX * PX, topY * PX, beamW * PX, (bottomY - topY) * PX);
      ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * intensity})`;
      ctx.fillRect((centerX - 1) * PX, topY * PX, 2 * PX, (bottomY - topY) * PX);
    }

    function drawTail(ox, oy, frame) {
      const t = TAIL[frame % TAIL.length];
      const col = PALETTE.maodi.body;
      for (let r = 0; r < t.length; r++) {
        for (let c = 0; c < t[r].length; c++) {
          if (t[r][c]) px(ox + c, oy + r, col);
        }
      }
    }

    function drawBubble(bx, by, text) {
      const borderCol = PALETTE.forest.near;
      const tw = text.length + 2;
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < tw; x++) {
          if ((y === 0 || y === 2) && (x === 0 || x === tw - 1)) continue;
          const isEdge = (y === 0 || y === 2 || x === 0 || x === tw - 1);
          px(bx + x, by + y, isEdge ? borderCol : PALETTE.ui.white);
        }
      }
      px(bx + 1, by + 3, borderCol);
      ctx.fillStyle = borderCol;
      const fontSize = Math.max(8, Math.round(PX * 0.65));
      ctx.font = `bold ${fontSize}px Courier New`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(text, (bx + 1) * PX + 3, by * PX + 5);
    }

    // ─── PARTICLES ───────────────────────────────────────────
    let particles = [];

    function addParticle(x, y, col, type='default') {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.6 - 0.2,
        life: 1.0, col, type
      });
    }

    function defeatPuff(cx, cy, col) {
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * 0.7,
          vy: Math.sin(angle) * 0.7 - 0.2,
          life: 1.0, col, type: 'float'
        });
      }
      // Add some white sparkle for impact
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: cx + (Math.random() - 0.5) * 4,
          y: cy + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.3,
          life: 0.7, col: '#ffffff', type: 'float'
        });
      }
    }

    function tickParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.type !== 'float') p.vy += 0.03;
        p.life -= 0.02;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        if (p.life > 0.15) px(Math.round(p.x), Math.round(p.y), p.col);
      }
    }

    // ─── EASING ──────────────────────────────────────────────
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function easeInOut(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2; }
    function lerp(a, b, t) { return a + (b - a) * t; }

    // ─── ANIMATION ───────────────────────────────────────────
    const FPS = 30;
    const DUR = 12;  // 12 seconds for full battle loop
    const TOTAL = FPS * DUR;

    // Phase plan:
    //  walk      0.00–0.10  maodi walks in from left
    //  monsters  0.10–0.20  monsters slide in from right
    //  alert     0.20–0.27  maodi notices, "!"
    //  charge    0.27–0.36  crouch + spiral
    //  squash    0.36–0.39  squashed
    //  flash     0.39–0.42  flash
    //  beam      0.42–0.47  beam reveal
    //  reveal    0.47–0.52  scarved chibi appears with pose
    //  leap      0.52–0.78  leap arc across screen, defeating monsters
    //  land      0.78–0.82  hard landing
    //  victory   0.82–1.00  victory pose with hi~ bubble

    function getPhase(t) {
      if (t < 0.10) return { name: 'walk',     local: t / 0.10 };
      if (t < 0.20) return { name: 'monsters', local: (t - 0.10) / 0.10 };
      if (t < 0.27) return { name: 'alert',    local: (t - 0.20) / 0.07 };
      if (t < 0.36) return { name: 'charge',   local: (t - 0.27) / 0.09 };
      if (t < 0.39) return { name: 'squash',   local: (t - 0.36) / 0.03 };
      if (t < 0.42) return { name: 'flash',    local: (t - 0.39) / 0.03 };
      if (t < 0.47) return { name: 'beam',     local: (t - 0.42) / 0.05 };
      if (t < 0.52) return { name: 'reveal',   local: (t - 0.47) / 0.05 };
      if (t < 0.78) return { name: 'leap',     local: (t - 0.52) / 0.26 };
      if (t < 0.82) return { name: 'land',     local: (t - 0.78) / 0.04 };
      return        { name: 'victory',  local: (t - 0.82) / 0.18 };
    }

    function transformBurst(cx, cy) {
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * 1.0, vy: Math.sin(angle) * 1.0,
          life: 1.0,
          col: i % 3 === 0 ? '#fff5b8' : i % 3 === 1 ? PALETTE.maodi.eye : '#ffffff',
          type: 'float'
        });
      }
    }

    let lastBurstFrame = -10;

    // Reference positions
    const STAGE_X_START = 8;       // maodi default chibi x
    const STAGE_Y       = 12;      // chibi feet on grass
    const STAGE_X_END   = 60;      // landing position after leap
    const BEAM_CENTER   = STAGE_X_START + 8;

    function getMonsterCenter(m) {
      // Returns canvas-grid center of monster sprite
      return { x: m.baseX + Math.floor(m.w / 2), y: m.y + 3 };
    }

    function drawMonster(m, frame) {
      if (!m.alive && frame > m.defeatedAt + 18) return;  // gone
      if (!m.alive) {
        // Brief shrink/fade
        const dt = frame - m.defeatedAt;
        const fade = Math.max(0, 1 - dt / 18);
        if (fade > 0.5) {
          ctx.save();
          ctx.globalAlpha = fade;
          if (m.type === 'slime') drawSlime(m.baseX, m.y, { wobble: false });
          else if (m.type === 'mush') drawMush(m.baseX, m.y, { wobble: false });
          else if (m.type === 'bat') drawBat(m.baseX, m.y, { frame });
          ctx.restore();
        }
        return;
      }
      if (m.type === 'slime') drawSlime(m.baseX, m.y, { wobble: true, frame });
      else if (m.type === 'mush') drawMush(m.baseX, m.y, { wobble: true, frame });
      else if (m.type === 'bat') drawBat(m.baseX, m.y, { frame });
    }

    function checkHit(maodiCx, maodiCy, frame) {
      monsters.forEach(m => {
        if (!m.alive) return;
        const c = getMonsterCenter(m);
        const dx = maodiCx - c.x;
        const dy = maodiCy - c.y;
        if (Math.abs(dx) < 5 && Math.abs(dy) < 6) {
          m.alive = false;
          m.defeatedAt = frame;
          const col = m.type === 'slime' ? PALETTE.slime.body :
                      m.type === 'mush'  ? PALETTE.mush.cap :
                                           PALETTE.bat.body;
          defeatPuff(c.x * PX, c.y * PX, col);
          // Add yellow sparkle for the hit
          for (let i = 0; i < 4; i++) {
            particles.push({
              x: c.x, y: c.y,
              vx: (Math.random() - 0.5) * 0.8,
              vy: (Math.random() - 0.5) * 0.8 - 0.2,
              life: 0.8, col: PALETTE.maodi.collar, type: 'float'
            });
          }
        }
      });
    }

    function render(f) {
      const t = f / TOTAL;
      drawBg(f);
      drawAmbient(f);

      const phase = getPhase(t);

      // Draw monsters in any phase except those before they appear
      const monstersVisible = ['monsters','alert','charge','squash','flash','beam','reveal','leap','land','victory'].includes(phase.name);

      if (phase.name === 'walk') {
        const mx = lerp(-8, STAGE_X_START, easeOut(phase.local));
        const my = STAGE_Y + Math.sin(phase.local * Math.PI * 5) * 0.5;
        drawMaodi(Math.round(mx), Math.round(my), { eyes: 'forward' });
        const tailFrame = Math.floor(f / 4) % TAIL.length;
        drawTail(Math.round(mx) + 14, Math.round(my) + 10, tailFrame);

      } else if (phase.name === 'monsters') {
        // Monsters slide in from right edge
        const slide = easeOut(phase.local);
        monsters.forEach(m => {
          const finalX = m.baseX;
          const startX = GW + 5;
          const cur = Math.round(lerp(startX, finalX, slide));
          if (m.type === 'slime') drawSlime(cur, m.y, { wobble: true, frame: f });
          else if (m.type === 'mush') drawMush(cur, m.y, { wobble: true, frame: f });
          else if (m.type === 'bat') drawBat(cur, m.y, { frame: f });
        });
        drawMaodi(STAGE_X_START, STAGE_Y, { eyes: 'forward' });
        const tailFrame = Math.floor(f / 4) % TAIL.length;
        drawTail(STAGE_X_START + 14, STAGE_Y + 10, tailFrame);

      } else if (phase.name === 'alert') {
        // Maodi looks right with surprise
        const eyes = phase.local < 0.5 ? 'look_right' : 'look_right';
        drawMaodi(STAGE_X_START, STAGE_Y, { eyes, glow: phase.local > 0.3 });
        const tailFrame = Math.floor(f / 4) % TAIL.length;
        drawTail(STAGE_X_START + 14, STAGE_Y + 10, tailFrame);
        // "!" bubble above head
        if (phase.local > 0.2) {
          drawBubble(STAGE_X_START + 16, STAGE_Y - 2, '!!');
        }
        monsters.forEach(m => drawMonster(m, f));

      } else if (phase.name === 'charge') {
        const my = STAGE_Y + Math.round(easeInOut(phase.local) * 1);
        drawMaodi(STAGE_X_START, my, { eyes: 'look_right', glow: true });
        // Spiral particles
        if (f % 2 === 0) {
          const angle = phase.local * Math.PI * 8;
          const radius = 10 * (1 - phase.local);
          particles.push({
            x: BEAM_CENTER + Math.cos(angle) * radius,
            y: my + 7 + Math.sin(angle) * radius * 0.6,
            vx: -Math.cos(angle) * 0.5,
            vy: -Math.sin(angle) * 0.3,
            life: 0.7, col: PALETTE.maodi.eye, type: 'float'
          });
        }
        ctx.fillStyle = `rgba(58, 216, 230, ${0.18 * phase.local})`;
        ctx.beginPath();
        ctx.ellipse(BEAM_CENTER * PX, (STAGE_Y + 14) * PX, PX * 5 * phase.local, PX * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        const tailFrame = Math.floor(f / 4) % TAIL.length;
        drawTail(STAGE_X_START + 14, my + 10, tailFrame);
        monsters.forEach(m => drawMonster(m, f));

      } else if (phase.name === 'squash') {
        const scaleY = lerp(1.0, 0.45, easeInOut(phase.local));
        drawChibiSquashed(STAGE_X_START, STAGE_Y, scaleY);
        ctx.fillStyle = `rgba(58, 216, 230, 0.30)`;
        ctx.beginPath();
        ctx.ellipse(BEAM_CENTER * PX, (STAGE_Y + 14) * PX, PX * 5, PX * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        monsters.forEach(m => drawMonster(m, f));

      } else if (phase.name === 'flash') {
        drawBeam(BEAM_CENTER, 4, 26, 1.0);
        if (f - lastBurstFrame > 8) {
          transformBurst(BEAM_CENTER, STAGE_Y + 8);
          lastBurstFrame = f;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * (1 - phase.local)})`;
        ctx.fillRect(0, 0, cv.width, cv.height);
        monsters.forEach(m => drawMonster(m, f));

      } else if (phase.name === 'beam') {
        const intensity = 1 - phase.local * 0.4;
        drawBeam(BEAM_CENTER, 4, 26, intensity);
        const reveal = Math.min(1, phase.local * 1.6);
        for (let r = 0; r < MAODI_BODY.height; r++) {
          for (let c = 0; c < MAODI_BODY.width; c++) {
            if (MAODI_BODY.data[r][c]) {
              ctx.fillStyle = `rgba(255, 255, 255, ${reveal})`;
              ctx.fillRect((STAGE_X_START + c) * PX, (STAGE_Y + r) * PX, PX, PX);
            }
          }
        }
        if (phase.local > 0.5) {
          SCARF.main.forEach(p => {
            ctx.fillStyle = `rgba(255, 245, 180, ${reveal * 0.7})`;
            ctx.fillRect((STAGE_X_START + p[0]) * PX, (STAGE_Y + p[1]) * PX, PX, PX);
          });
        }
        monsters.forEach(m => drawMonster(m, f));

      } else if (phase.name === 'reveal') {
        const beamFade = 1 - phase.local;
        if (beamFade > 0) drawBeam(BEAM_CENTER, 4, 26, beamFade * 0.6);
        const bob = Math.sin(phase.local * Math.PI) * 0.4;
        drawMaodi(STAGE_X_START, STAGE_Y - Math.round(bob), { eyes: 'look_right', glow: true, scarf: true });
        const tailFrame = Math.floor(f / 4) % TAIL.length;
        drawTail(STAGE_X_START + 14, STAGE_Y + 10 - Math.round(bob), tailFrame);
        if (f % 3 === 0) {
          addParticle(STAGE_X_START + Math.random() * 16, STAGE_Y + Math.random() * 12, '#fff5b8', 'float');
        }
        monsters.forEach(m => drawMonster(m, f));

      } else if (phase.name === 'leap') {
        // Big arc from STAGE_X_START to STAGE_X_END across the battlefield
        const tx = phase.local;
        const arcHeight = 16;
        const cx = lerp(STAGE_X_START, STAGE_X_END, easeInOut(tx));
        const py = STAGE_Y - Math.sin(tx * Math.PI) * arcHeight;
        drawMaodi(Math.round(cx), Math.round(py),
                  { eyes: 'forward', glow: true, scarf: true });
        const tailFrame = Math.floor(f / 3) % TAIL.length;
        drawTail(Math.round(cx) + 14, Math.round(py) + 10, tailFrame);

        // Check hits — maodi center is at cx+8, py+7
        checkHit(Math.round(cx) + 8, Math.round(py) + 7, f);

        // Motion trail
        if (f % 2 === 0) {
          particles.push({
            x: cx + 7 + (Math.random() - 0.5) * 6,
            y: py + 14 + Math.random() * 2,
            vx: -1.0 + (Math.random() - 0.5) * 0.4, vy: 0.15,
            life: 0.6, col: '#a8c8ff', type: 'float'
          });
        }
        // Speed lines on body
        if (f % 2 === 0) {
          for (let i = 0; i < 3; i++) {
            particles.push({
              x: cx - i * 1.5,
              y: py + 7 + (Math.random() - 0.5) * 4,
              vx: -0.8, vy: 0,
              life: 0.4, col: '#ffffff', type: 'float'
            });
          }
        }
        monsters.forEach(m => drawMonster(m, f));

      } else if (phase.name === 'land') {
        const squash = 1 - Math.sin(phase.local * Math.PI) * 0.20;
        ctx.save();
        const bottomY = (STAGE_Y + MAODI_BODY.height) * PX;
        ctx.translate(0, bottomY);
        ctx.scale(1, squash);
        ctx.translate(0, -bottomY);
        drawMaodi(STAGE_X_END, STAGE_Y, { eyes: 'forward', glow: true, scarf: true });
        ctx.restore();
        if (f % 2 === 0) {
          for (let i = -3; i <= 3; i++) {
            addParticle(STAGE_X_END + 7 + i * 1.2, STAGE_Y + 14, PALETTE.forest.grassDark);
          }
        }
        monsters.forEach(m => drawMonster(m, f));

      } else if (phase.name === 'victory') {
        drawMaodi(STAGE_X_END, STAGE_Y, { eyes: 'forward', glow: true, scarf: true });
        if (f % 4 === 0) {
          addParticle(STAGE_X_END + 4 + Math.random() * 8, STAGE_Y - 1, PALETTE.maodi.collar, 'float');
        }
        if (f % 7 === 0) {
          addParticle(STAGE_X_END + Math.random() * 16, STAGE_Y + 10, PALETTE.maodi.eye, 'float');
        }
        const tailFrame = Math.floor(f / 4) % TAIL.length;
        drawTail(STAGE_X_END + 14, STAGE_Y + 10, tailFrame);
        if (phase.local > 0.2 && phase.local < 0.85) {
          drawBubble(STAGE_X_END - 4, STAGE_Y - 2, 'hi~');
        }
        // Defeated monsters fade away (already handled by drawMonster)
        monsters.forEach(m => drawMonster(m, f));
      }

      tickParticles();
    }

    // ─── LOOP ────────────────────────────────────────────────
    let startTime = null;

    function loop(ts) {
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) / 1000;
      const loopT = elapsed % DUR;
      const frame = Math.floor(loopT * FPS);
      // Reset state at start of each loop
      if (loopT < 0.05) {
        particles = [];
        resetMonsters();
      }
      render(frame);
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
