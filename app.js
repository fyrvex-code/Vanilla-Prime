'use strict';

/* ── Navbar ── */
(function () {
  const nav = document.getElementById('nav');
  const ham = document.getElementById('navHam');
  const drawer = document.getElementById('navDrawer');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30), { passive: true });
  if (ham && drawer) {
    ham.addEventListener('click', () => {
      const o = drawer.classList.toggle('open');
      ham.classList.toggle('open', o);
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      drawer.classList.remove('open'); ham.classList.remove('open');
    }));
  }
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
})();

/* ── Scroll reveal ── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rev,.rev-l,.rev-r').forEach(el => obs.observe(el));
})();

/* ── Toast ── */
let _tt;
function showToast(msg) {
  const t = document.getElementById('toast'); if (!t) return;
  t.querySelector('#toastTxt').textContent = msg;
  t.classList.add('show'); clearTimeout(_tt);
  _tt = setTimeout(() => t.classList.remove('show'), 2600);
}
window.showToast = showToast;

/* ── Copy ── */
function copyText(text, btn) {
  const orig = btn ? btn.innerHTML : null;
  const ok = () => {
    if (btn) {
      btn.classList.add('ok');
      btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Скопировано`;
      setTimeout(() => { btn.classList.remove('ok'); btn.innerHTML = orig; }, 2400);
    }
    showToast('✓ Скопировано: ' + text);
  };
  navigator.clipboard ? navigator.clipboard.writeText(text).then(ok).catch(() => { _fb(text); ok(); }) : (_fb(text), ok());
}
function _fb(t) {
  const ta = Object.assign(document.createElement('textarea'), { value: t, style: 'position:fixed;opacity:0;' });
  document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
}
window.copyText = copyText;

/* ── FAQ ── */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });
}
window.initFaq = initFaq;

/* ══════════════════════════════════════════════════════════
   CANVAS — Cherry Blossom Night Scene
   Signature element: falling sakura petals over a dark
   Japanese-night landscape with distant pagoda silhouette
══════════════════════════════════════════════════════════ */
function initCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;
  let stars = [], petals = [], branches = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildStars();
    buildBranches();
  }

  /* ── Stars ── */
  function buildStars() {
    stars = [];
    const n = Math.floor(W * H / 3200);
    for (let i = 0; i < n; i++) stars.push({
      x: Math.random() * W, y: Math.random() * H * 0.55,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.55 + 0.2,
      tw: Math.random() * Math.PI * 2,
      spd: Math.random() * 0.016 + 0.004
    });
  }

  /* ── Sakura branches (decorative arcs at edges) ── */
  function buildBranches() {
    branches = [
      { x: 0, y: H * 0.38, angle: 0.5,  side: 'left',  len: Math.min(W * 0.22, 180) },
      { x: W, y: H * 0.32, angle: -0.6, side: 'right', len: Math.min(W * 0.20, 160) },
    ];
  }

  /* ── Spawn petal ── */
  function spawnPetal() {
    if (petals.length >= 90) return;
    const side = Math.random();
    petals.push({
      x: side < 0.7 ? Math.random() * W : (side < 0.85 ? 0 : W),
      y: side < 0.7 ? -14 : Math.random() * H * 0.4,
      vx: (Math.random() - 0.45) * 1.2,
      vy: Math.random() * 1.0 + 0.5,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.055,
      size: Math.random() * 7 + 5,
      alpha: Math.random() * 0.5 + 0.35,
      swing: Math.random() * Math.PI * 2,
      swingSpd: Math.random() * 0.03 + 0.01,
      /* petal shape: 0=round, 1=oval, 2=notched */
      shape: Math.floor(Math.random() * 3),
      hue: 330 + Math.random() * 30,   /* pink-rose range */
      sat: 50 + Math.random() * 30,
      lit: 70 + Math.random() * 20,
    });
  }

  /* ── Draw single petal ── */
  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;

    const color = `hsl(${p.hue},${p.sat}%,${p.lit}%)`;
    ctx.fillStyle = color;
    ctx.strokeStyle = `hsla(${p.hue},${p.sat}%,${p.lit - 15}%,0.4)`;
    ctx.lineWidth = 0.5;

    const s = p.size;
    ctx.beginPath();
    if (p.shape === 0) {
      /* Round petal — heart-like */
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.6, -s * 0.4, -s * 0.9, -s * 1.1, 0, -s * 1.3);
      ctx.bezierCurveTo( s * 0.9, -s * 1.1,  s * 0.6, -s * 0.4, 0, 0);
    } else if (p.shape === 1) {
      /* Oval petal */
      ctx.ellipse(0, -s * 0.6, s * 0.42, s * 0.72, 0, 0, Math.PI * 2);
    } else {
      /* Notched petal (sakura 5-petal look) */
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.35, -s * 0.85, -s * 0.9, -s * 0.15, -s * 1.2);
      ctx.bezierCurveTo(-s * 0.05, -s * 1.35, s * 0.05, -s * 1.35, s * 0.15, -s * 1.2);
      ctx.bezierCurveTo( s * 0.85, -s * 0.9,  s * 0.5, -s * 0.35, 0, 0);
    }
    ctx.fill();
    ctx.stroke();

    /* Subtle vein */
    ctx.strokeStyle = `hsla(${p.hue},${p.sat}%,${p.lit + 10}%,0.25)`;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -s * 1.1);
    ctx.stroke();

    ctx.restore();
  }

  /* ── Draw cherry branch ── */
  function drawBranch(bx, by, angle, depth, len, side) {
    if (depth > 4 || len < 8) return;
    const ex = bx + Math.cos(angle) * len;
    const ey = by + Math.sin(angle) * len;

    ctx.save();
    ctx.strokeStyle = depth === 0 ? '#2D0820' : `rgba(45,8,32,${0.9 - depth * 0.18})`;
    ctx.lineWidth = Math.max(0.5, 3.5 - depth * 0.7);
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.restore();

    /* Blossom clusters at branch tips */
    if (depth >= 3) {
      for (let i = 0; i < 4; i++) {
        const blobX = ex + (Math.random() - 0.5) * 18;
        const blobY = ey + (Math.random() - 0.5) * 18;
        const br = 3 + Math.random() * 5;
        ctx.save();
        ctx.globalAlpha = 0.35 + Math.random() * 0.3;
        ctx.fillStyle = `hsl(${340 + Math.random() * 20},${60 + Math.random() * 25}%,${68 + Math.random() * 18}%)`;
        ctx.beginPath(); ctx.arc(blobX, blobY, br, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }

    /* Recurse */
    const spread = side === 'left' ? 1 : -1;
    drawBranch(ex, ey, angle - 0.35 * spread, depth + 1, len * 0.68, side);
    drawBranch(ex, ey, angle + 0.25 * spread, depth + 1, len * 0.60, side);
    if (depth < 2) drawBranch(ex, ey, angle, depth + 1, len * 0.72, side);
  }

  /* ── Main draw loop ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Sky — deep cherry-night gradient */
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0,    '#08000D');
    sky.addColorStop(0.30, '#0F0010');
    sky.addColorStop(0.60, '#150010');
    sky.addColorStop(1,    '#1C0018');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    /* Subtle radial blossom glow center-right */
    const mg = ctx.createRadialGradient(W * 0.78, H * 0.18, 0, W * 0.78, H * 0.18, H * 0.35);
    mg.addColorStop(0, 'rgba(194,24,91,0.07)');
    mg.addColorStop(1, 'transparent');
    ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);

    /* Stars */
    stars.forEach(s => {
      s.tw += s.spd;
      const a = s.a * (0.5 + 0.5 * Math.sin(s.tw));
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = '#F8BBD0';
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.r > 1.1 ? 2 : 1, s.r > 1.1 ? 2 : 1);
      if (s.r > 1.25) {
        const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 7);
        sg.addColorStop(0, 'rgba(244,143,177,0.35)'); sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });

    /* Moon — large, pink-tinted */
    const mx = W * 0.80, my = H * 0.15;
    const mr = Math.min(W, H) * 0.052;
    /* outer glow */
    const mog = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 5.5);
    mog.addColorStop(0, 'rgba(248,187,208,0.14)');
    mog.addColorStop(0.5, 'rgba(194,24,91,0.05)');
    mog.addColorStop(1, 'transparent');
    ctx.fillStyle = mog; ctx.beginPath(); ctx.arc(mx, my, mr * 5.5, 0, Math.PI * 2); ctx.fill();
    /* body — pixelated */
    const PX = Math.max(3, Math.floor(mr / 4.2));
    for (let py = -mr; py < mr; py += PX) {
      for (let px = -mr; px < mr; px += PX) {
        if (px*px + py*py <= mr*mr) {
          const rim = Math.sqrt(px*px + py*py) / mr;
          ctx.fillStyle = rim > 0.85
            ? `hsl(340,60%,${76 + rim * 6}%)`
            : 'hsl(340,50%,88%)';
          ctx.fillRect(mx + px, my + py, PX, PX);
        }
      }
    }

    /* Distant mountains — dark silhouettes */
    const drawMnt = (pts, fill, base) => {
      ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(0, base);
      pts.forEach(([fx, fy]) => ctx.lineTo(fx * W, (fy + 0.006 * Math.sin(t * 0.0008 + fx * 10)) * H));
      ctx.lineTo(W, base); ctx.closePath(); ctx.fill();
    };
    drawMnt([[0,.42],[.08,.30],[.17,.38],[.27,.24],[.36,.33],[.46,.22],[.55,.32],[.65,.26],[.74,.34],[.83,.23],[.92,.31],[1,.40]], '#0F000A', H * 0.76);
    drawMnt([[0,.52],[.09,.42],[.18,.50],[.27,.36],[.36,.47],[.45,.40],[.54,.48],[.63,.43],[.71,.51],[.80,.38],[.88,.46],[.96,.49],[1,.54]], '#120009', H * 0.78);

    /* ── Pagoda silhouette ── */
    const pagX = W * 0.62, pagBaseY = H * 0.74;
    const drawPagLevel = (y, w, h, roofExt) => {
      /* roof */
      ctx.fillStyle = '#140008';
      ctx.beginPath();
      ctx.moveTo(pagX - w * 0.5 - roofExt, y);
      ctx.lineTo(pagX, y - h * 0.55);
      ctx.lineTo(pagX + w * 0.5 + roofExt, y);
      ctx.closePath(); ctx.fill();
      /* body */
      ctx.fillRect(pagX - w * 0.38, y, w * 0.76, h * 0.55);
    };
    drawPagLevel(pagBaseY - 0,   70, 24, 18);
    drawPagLevel(pagBaseY - 28,  56, 20, 14);
    drawPagLevel(pagBaseY - 52,  44, 18, 10);
    drawPagLevel(pagBaseY - 72,  34, 16, 8);
    /* spire */
    ctx.fillStyle = '#140008';
    ctx.fillRect(pagX - 2, pagBaseY - 90, 4, 18);

    /* Ground fill */
    const grd = ctx.createLinearGradient(0, H * 0.75, 0, H);
    grd.addColorStop(0, '#150010'); grd.addColorStop(1, '#0D0008');
    ctx.fillStyle = grd; ctx.fillRect(0, H * 0.75, W, H * 0.25);

    /* Pixel grass strip — cherry blossom pink tint */
    const BK = Math.max(6, Math.floor(W / 100));
    const GY = H * 0.75;
    for (let x = 0; x < W; x += BK) {
      const hv = Math.sin(x / W * 12) * 0.016 + Math.sin(x / W * 7 + 1) * 0.010;
      const by = Math.floor(GY + hv * H);
      const br = 0.7 + 0.3 * ((Math.floor(x / BK)) % 2);
      /* dark ground with slight pink tint */
      ctx.fillStyle = `hsl(330,${20 * br}%,${8 * br}%)`;
      ctx.fillRect(x, by, BK, BK);
      ctx.fillStyle = '#0D0008'; ctx.fillRect(x, by + BK, BK, BK * 2);
    }

    /* Cherry blossom tree silhouettes (pixel canopy + dark trunk) */
    const treePositions = [0.05, 0.13, 0.24, 0.36, 0.50, 0.73, 0.84, 0.94];
    treePositions.forEach((pos, idx) => {
      const tx = Math.floor(pos * W);
      const TH  = BK * (6 + (idx % 3));
      const LS  = BK * (6 + (idx % 2));
      const BY  = Math.floor(GY);
      /* trunk */
      ctx.fillStyle = '#1A000E'; ctx.fillRect(tx - BK / 2, BY - TH, BK, TH);
      /* canopy — pixelated cherry blossom cloud */
      for (let py = 0; py < LS * 1.3; py += BK) {
        for (let px2 = 0; px2 < LS * 1.3; px2 += BK) {
          const cx = px2 - LS * 0.65, cy = py - LS * 0.65;
          const dist = Math.sqrt(cx * cx + cy * cy);
          if (dist < LS * 0.68) {
            const bloom = Math.random();
            if (bloom < 0.65) {
              const h2 = 330 + Math.random() * 25;
              const s2 = 45 + Math.random() * 30;
              const l2 = 18 + Math.random() * 12;
              ctx.fillStyle = `hsl(${h2},${s2}%,${l2}%)`;
            } else {
              ctx.fillStyle = `hsl(340,${30 + Math.random()*20}%,${24 + Math.random()*10}%)`;
            }
            ctx.fillRect(tx - LS * 0.65 + px2, BY - TH - LS * 0.65 + py, BK, BK);
          }
        }
      }
    });

    /* Branch decorations on edges */
    branches.forEach(b => {
      const angle = b.side === 'left'
        ? b.angle + 0.06 * Math.sin(t * 0.002)
        : b.angle - 0.06 * Math.sin(t * 0.002);
      drawBranch(b.x, b.y, angle, 0, b.len, b.side);
    });

    /* Petals */
    t++;
    if (t % 5 === 0) spawnPetal();
    petals = petals.filter(p => p.y < H + 20 && p.x > -20 && p.x < W + 20);
    petals.forEach(p => {
      p.swing += p.swingSpd;
      p.x += p.vx + Math.sin(p.swing) * 0.6;
      p.y += p.vy;
      p.rot += p.rotV + 0.005 * Math.sin(p.swing * 0.7);
      /* gentle drift */
      p.vx += (Math.random() - 0.5) * 0.02;
      drawPetal(p);
    });

    /* Atmospheric veil at very bottom */
    const veil = ctx.createLinearGradient(0, H * 0.88, 0, H);
    veil.addColorStop(0, 'transparent');
    veil.addColorStop(1, 'rgba(13,0,8,0.7)');
    ctx.fillStyle = veil; ctx.fillRect(0, H * 0.88, W, H * 0.12);

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}
window.initCanvas = initCanvas;
