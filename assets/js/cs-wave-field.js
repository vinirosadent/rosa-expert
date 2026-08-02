/* ============================================================
   cs-wave-field.js — the Connected Science hero
   ------------------------------------------------------------
   A particle ocean seen at a shallow angle. Two invisible impacts
   land on it, each throwing a ring of waves outward; the two fronts
   travel, meet in phase, and where they add a narrow column of
   particles lifts off the surface. Then everything passes and the
   plane goes quiet again.

   The dots ARE the wave. They only rise and fall; the wave is what
   travels. Two contributions arrive from different places, meet,
   add up to more than either alone, and carry on — which is the
   whole argument of the page, stated as physics rather than as a
   diagram.

   Visual vocabulary is borrowed from the homepage hero: many very
   small, translucent navy points where the form comes out of
   DENSITY. Nothing here is a stroked circle.

   ── Coordinate systems ──────────────────────────────────────
   WORLD   (X, Y, Z)  X lateral, Y depth away from the camera,
                      Z height above the plane. The waves live here.
   SCREEN  (sx, sy)   canvas pixels.

   Ground-plane projection with the camera height and focal length
   folded into one constant F:

       scale = sy0 - horizonY          (distance below the horizon)
       Y     = F / scale               (depth)
       sx    = cx + X * scale
       sy    = sy0 - Z * scale

   Two things fall out for free: near rows have a large `scale`, so
   the same world height becomes a bigger movement in pixels near the
   viewer; and crest spacing compresses toward the back. Neither is
   faked by drawing the front wave thicker.

   The horizon sits above the top edge, so no horizon line is ever
   visible — the field fades out before reaching it.

   Rows are placed evenly in SCREEN space, not in world Y. World-even
   rows dump most of the particles into a thin invisible band at the
   back; screen-even rows spend them where they can be seen. The wave
   is still computed in world space, so the geometry stays honest.
   ============================================================ */

(function () {
  'use strict';

  var TAU = Math.PI * 2;

  /* ── Wave profile lookup ───────────────────────────────────
     z(r,t) = A · env(t) · exp(−u²/2σ²) · sin(2π·u),  u = (r − v·t)/λ

     A finite packet: one leading crest and two or three oscillations
     behind it, inside a smooth envelope — not an endless sine. The
     profile depends only on u, so it is sampled once here and read
     per particle, which is what makes ~80,000 particles affordable
     in Canvas 2D. */
  var LUT_N = 4096;
  var WAVE_LUT = new Float32Array(LUT_N);
  var U_MAX = 2.75;
  var U_STEP = (2 * U_MAX) / (LUT_N - 1);
  (function buildWaveLut() {
    var sigma = 1.02;
    for (var i = 0; i < LUT_N; i++) {
      var u = -U_MAX + i * U_STEP;
      WAVE_LUT[i] = Math.exp(-(u * u) / (2 * sigma * sigma)) * Math.sin(TAU * u);
    }
  })();

  var SIN_N = 2048, SIN_LUT = new Float32Array(SIN_N);
  for (var si = 0; si < SIN_N; si++) SIN_LUT[si] = Math.sin((si / SIN_N) * TAU);
  function fastSin(x) {
    return SIN_LUT[((x * (SIN_N / TAU)) | 0) & (SIN_N - 1)];
  }

  function makeRng(seed) {          /* deterministic: same field every load */
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function smoothstep(a, b, x) {
    var t = (x - a) / (b - a);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  }

  /* ── Palette ───────────────────────────────────────────────
     Near: the deep navy of the site. Far: a pale slate dissolving
     into the ivory. Quantised so the renderer changes fillStyle a
     few dozen times per frame instead of eighty thousand. */
  var C_NEAR = [22, 44, 82], C_FAR = [158, 176, 196];
  var COLOR_STEPS = 8, ALPHA_STEPS = 16, ALPHA_MIN = 0.030, ALPHA_MAX = 0.720;
  var STYLES = [];
  (function buildStyles() {
    for (var c = 0; c < COLOR_STEPS; c++) {
      var t = c / (COLOR_STEPS - 1);
      var r = Math.round(C_NEAR[0] + (C_FAR[0] - C_NEAR[0]) * t);
      var g = Math.round(C_NEAR[1] + (C_FAR[1] - C_NEAR[1]) * t);
      var b = Math.round(C_NEAR[2] + (C_FAR[2] - C_NEAR[2]) * t);
      for (var a = 0; a < ALPHA_STEPS; a++) {
        var al = ALPHA_MIN + (ALPHA_MAX - ALPHA_MIN) * (a / (ALPHA_STEPS - 1));
        STYLES[c * ALPHA_STEPS + a] = 'rgba(' + r + ',' + g + ',' + b + ',' + al.toFixed(3) + ')';
      }
    }
  })();
  var ACCENT_STYLES = [];
  for (var ai = 0; ai < ALPHA_STEPS; ai++) {
    ACCENT_STYLES[ai] = 'rgba(224,124,44,' +
      (ALPHA_MIN + (0.34 - ALPHA_MIN) * (ai / (ALPHA_STEPS - 1))).toFixed(3) + ')';
  }

  /* ── Density ───────────────────────────────────────────────
     Far above the numbers a brief would suggest, and the reason is
     measured. The crest bands are a LATTICE effect: rows bunch where
     the surface slopes and spread where it is flat. At 10,000
     particles the spacing is ~13px and a crest has too few rows to
     draw itself with — the field reads as speckle with the wave
     buried in it. The reference plates sit near 3px.
     The ceiling is measured too: 82,000 costs 11.4ms per frame on a
     2850px-wide canvas, which saturates the budget on an ultrawide
     monitor. 52,000 lands near 7ms and still resolves the crests,
     because the grid is biased toward where they are looked at. */
  function targetCount(viewportW) {
    if (viewportW < 780) return 16000;
    if (viewportW < 1100) return 32000;
    return 52000;
  }

  function ConnectedScienceWaveField(root, canvas) {
    this.root = root;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.reduce = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false, addEventListener: null };

    this.running = false; this.inView = true;
    /* Read the real state instead of assuming visible: a page that
       LOADS in a background tab never fires visibilitychange, so
       hardcoding true left the loop marked as running in a tab nobody
       was looking at. */
    this.visible = (typeof document !== 'undefined' && document.visibilityState)
      ? document.visibilityState !== 'hidden' : true;
    this.raf = 0; this.last = 0;
    this.stride = 1; this.frameAcc = 0; this.frameN = 0;

    this.n = 0;
    this.sx = null; this.sy0 = null; this.disp = null;
    this.rA = null; this.rB = null; this.rM = null;
    this.size = null; this.alpha0 = null; this.colorIdx = null; this.phase = null;

    this.build();
    /* Open mid-story: the two fronts are already travelling when the
       page paints, so nobody watches an empty plane wait for an event. */
    this.t = this.T_MEET - 2.2;
    this.bind();
  }

  /* ── The cycle ─────────────────────────────────────────────
     One event per cycle, and the plane genuinely returns to rest
     before the next — so there is no seam to hide. Both origins fire
     together at t = 0.
       0.0s   two invisible impacts
       ~5.4s  the fronts touch on the bisector
       ~5.6s  the column lifts, and falls back within a second
       ~16s   the last of the wave dissolves
       16-21s quiet plane
     Fighting a visible reset with overlapping packets was the wrong
     answer: it kept the surface permanently agitated, which is the
     restlessness this was asked to remove. */
  ConnectedScienceWaveField.prototype.CYCLE = 21.0;
  ConnectedScienceWaveField.prototype.T_MEET = 5.4;
  ConnectedScienceWaveField.prototype.LIFE = 16.0;

  ConnectedScienceWaveField.prototype.build = function () {
    var cssW = this.root.clientWidth, cssH = this.root.clientHeight;
    if (!cssW || !cssH) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    this.dpr = dpr; this.cssW = cssW; this.cssH = cssH;
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var phone = cssW < 780;
    var want = targetCount(window.innerWidth || cssW);

    /* Camera. Depth runs Y = 1 (near) to Y = DEPTH (far); F is solved
       so those land on the near and far screen rows. Getting this
       normalisation right matters: an early pass left world Y near
       0.001 while X was near 1, so the radius was dominated by X and
       the fronts came out as vertical stripes instead of rings. */
    var DEPTH = phone ? 4.2 : 5.2;
    var nearY = cssH * (phone ? 1.05 : 1.03);
    var farY = cssH * (phone ? 0.15 : 0.02);
    var xPad = cssW * 0.30;
    var F = (nearY - farY) / (1 - 1 / DEPTH);
    var horizonY = nearY - F;
    var cx = cssW * 0.50, halfSpan = cssW * 0.5 + xPad;

    function worldAt(fracX, depthT) {
      var sy = farY + (nearY - farY) * depthT, sc = sy - horizonY;
      return { x: (cssW * fracX - cx) / sc, y: F / sc };
    }

    /* ── Two origins, both on the right ─────────────────────
       Separated mostly in X and sitting at the same depth, so the
       perpendicular bisector between them runs INTO the picture and
       the fronts touch first at the midpoint, then unzip along that
       line toward and away from the viewer. The right-hand source is
       half outside the crop, which is what makes it read as a second,
       independent contribution rather than a mirrored decoration. */
    var A = worldAt(phone ? 0.52 : 0.615, phone ? 0.46 : 0.44);
    var B = worldAt(phone ? 0.94 : 0.965, phone ? 0.46 : 0.44);
    var M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
    this.oA = A; this.oB = B; this.meet = M;
    var half = Math.sqrt((A.x - M.x) * (A.x - M.x) + (A.y - M.y) * (A.y - M.y));
    /* speed is DERIVED from where they must meet and when, so the
       encounter cannot drift out of the composition */
    this.speed = half / this.T_MEET;
    this.lambda = (phone ? 0.30 : 0.235);
    this.amp = phone ? 0.055 : 0.072;

    /* screen position of the meeting point — the column rises here */
    var mScale = F / M.y;
    this.meetSx = cx + M.x * mScale;
    this.meetSy = horizonY + mScale;
    this.meetScale = mScale;

    /* ── Grid ───────────────────────────────────────────────
       Deliberately NOT uniform. Columns are biased to the right and
       rows to the foreground, so the particles are spent where the
       composition wants weight and where the eye can resolve them —
       instead of being spread thin across a rectangle whose left
       third is masked away anyway. */
    var aspect = (2 * halfSpan) / Math.max(1, nearY - farY);
    var rows = Math.max(70, Math.round(Math.sqrt(want / Math.max(0.35, aspect)) * 1.18));
    var cols = Math.max(70, Math.round(want / rows));
    var n = rows * cols;

    this.n = n;
    this.sx = new Float32Array(n); this.sy0 = new Float32Array(n);
    this.disp = new Float32Array(n);
    this.rA = new Float32Array(n); this.rB = new Float32Array(n); this.rM = new Float32Array(n);
    this.size = new Float32Array(n); this.alpha0 = new Float32Array(n);
    this.colorIdx = new Uint8Array(n); this.phase = new Float32Array(n);

    var rng = makeRng(0x5C1E7CE);
    var fadeX0 = phone ? 0.02 : 0.26, fadeX1 = phone ? 0.40 : 0.52;

    /* Displacement gain, not raw `scale`. Full perspective multiplies
       world height by scale, a 5x spread here, which produced a 59px
       spike at the near crest while the back barely moved. The 0.68
       power keeps the foreground clearly stronger without the spike.
       This is the one place the projection is deliberately not
       physical. */
    var K = Math.pow(F / 2.4, 1 - 0.68);
    this.maxDisp = ((nearY - farY) / rows) * 3.4;

    var i = 0;
    for (var ri = 0; ri < rows; ri++) {
      var u = (ri + 0.5) / rows;
      var rt = Math.pow(u, 0.82);                 /* 0 far, 1 near; biased near */
      var syBase = farY + (nearY - farY) * rt;
      var depthT = 1 - rt;
      var rowGap = (nearY - farY) * (Math.pow((ri + 1.5) / rows, 0.82) - Math.pow((ri - 0.5) / rows, 0.82)) * 0.5;
      for (var ci = 0; ci < cols; ci++) {
        var cu = (ci + 0.5) / cols;
        var cxr = 1 - Math.pow(1 - cu, 1.55);     /* biased right */
        var colGap = (2 * halfSpan) / cols;
        /* Jitter must stay SMALL. The crest bands are rows bunching;
           at +/-42% of the row spacing an earlier pass turned the whole
           field into uniform speckle — the wave was still in the
           arithmetic and invisible on screen. */
        var sxp = (cx - halfSpan) + cxr * (2 * halfSpan) + (rng() - 0.5) * colGap * 0.55;
        var syp = syBase + (rng() - 0.5) * rowGap * 0.30;
        var scp = syp - horizonY; if (scp < 1) scp = 1;

        this.sx[i] = sxp; this.sy0[i] = syp;
        this.disp[i] = K * Math.pow(scp, 0.68);

        var wx = (sxp - cx) / scp, wy = F / scp;
        var ax = wx - A.x, ay = wy - A.y, bx = wx - B.x, by = wy - B.y;
        var mx = wx - M.x, my = wy - M.y;
        this.rA[i] = Math.sqrt(ax * ax + ay * ay);
        this.rB[i] = Math.sqrt(bx * bx + by * by);
        this.rM[i] = Math.sqrt(mx * mx + my * my);

        var szB = (phone ? 0.62 : 0.58) + (phone ? 1.30 : 1.85) * (1 - depthT) * (1 - depthT);
        this.size[i] = Math.max(0.50, szB * (0.82 + rng() * 0.38));
        this.colorIdx[i] = Math.min(COLOR_STEPS - 1, (depthT * COLOR_STEPS) | 0);

        var aDepth = 0.30 + 0.70 * (1 - depthT * depthT);
        var aTop = smoothstep(0, 0.13, rt);
        var aBottom = 1 - smoothstep(0.94, 1.0, rt) * 0.40;
        var aSide = smoothstep(-0.06, 0.10, sxp / cssW) * (1 - smoothstep(0.93, 1.24, sxp / cssW) * 0.45);
        var aCopy = smoothstep(fadeX0, fadeX1, sxp / cssW);
        if (phone) aCopy = Math.max(aCopy, smoothstep(0.30, 0.68, rt));
        this.alpha0[i] = 0.150 * aDepth * aTop * aBottom * aSide * aCopy * (0.74 + rng() * 0.50);
        this.phase[i] = rng() * TAU;
        i++;
      }
    }

    /* ── The column ─────────────────────────────────────────
       A short stack of particles standing on the meeting point, in
       place for about a second. Drawn as its own tiny set rather than
       by over-lifting surface particles: there are only a handful of
       grid points near M, and stretching them upward gives a smear,
       not the thin taper the reference shows. */
    this.dropN = phone ? 46 : 92;
    this.dropU = new Float32Array(this.dropN);
    this.dropJ = new Float32Array(this.dropN);
    this.dropS = new Float32Array(this.dropN);
    var drng = makeRng(0xD40FF);
    for (var d = 0; d < this.dropN; d++) {
      var du = Math.pow(drng(), 0.62);            /* denser at the base */
      this.dropU[d] = du;
      this.dropJ[d] = (drng() - 0.5) * (1 - du * 0.82);   /* tapers to a point */
      this.dropS[d] = 0.62 + drng() * 0.55;
    }
    this.dropHeight = (nearY - farY) * (phone ? 0.20 : 0.26);
    this.dropWidth = cssW * (phone ? 0.020 : 0.017);

    this.uInvStep = 1 / U_STEP;
    this.gain = phone ? 0.86 : 1.0;
  };

  /* ── Wave displacement ─────────────────────────────────────
     The two packets are kept apart on the way in, because their sum
     is not the only thing worth knowing. `z` is honest superposition
     — zA + zB — so two crests arriving together really do make a peak
     of twice the height. `coh` measures how much of that height came
     from both at once: zero when only one wave is present, large only
     where the two agree in sign and in strength. The geometry is never
     faked; coh only decides how strongly the meeting is DRAWN. */
  ConnectedScienceWaveField.prototype._coh = 0;
  ConnectedScienceWaveField.prototype.waveDisplacement = function (i, front, a, ambPhase, ambAmp) {
    var lam = this.lambda, inv = this.uInvStep, zA = 0, zB = 0;
    var ua = (this.rA[i] - front) / lam;
    if (ua > -U_MAX && ua < U_MAX) zA = a * WAVE_LUT[((ua + U_MAX) * inv) | 0];
    var ub = (this.rB[i] - front) / lam;
    if (ub > -U_MAX && ub < U_MAX) zB = a * WAVE_LUT[((ub + U_MAX) * inv) | 0];
    var aa = zA < 0 ? -zA : zA, ab = zB < 0 ? -zB : zB;
    this._coh = (zA * zB > 0) ? (aa < ab ? aa : ab) : 0;
    return zA + zB + ambAmp * fastSin(ambPhase + this.phase[i]);
  };

  ConnectedScienceWaveField.prototype.renderWaveField = function () {
    var ctx = this.ctx, n = this.n, stride = this.stride;
    ctx.clearRect(0, 0, this.cssW, this.cssH);

    var age = this.t % this.CYCLE;
    if (age < 0) age += this.CYCLE;

    /* Envelope: rises over the first half second as the surface dips
       and rebounds, then decays to exactly zero by LIFE, so the quiet
       phase is really quiet and the next cycle has nothing to hide. */
    var rise = smoothstep(0, 0.46, age);
    var fall = 1 - smoothstep(this.LIFE * 0.55, this.LIFE, age);
    var a = this.amp * rise * fall * Math.exp(-age * 0.035);
    var front = this.speed * age;

    /* The plane at rest is at rest. An earlier version kept a constant
       shimmer going and the whole surface read as restless. */
    var ambAmp = this.amp * 0.011, ambPhase = this.t * 0.22;

    var invAmp = 1 / (a + this.amp * 0.08);
    var cap = this.maxDisp, gain = this.gain;
    var sx = this.sx, sy0 = this.sy0, dsp = this.disp, sz = this.size,
        a0 = this.alpha0, ci = this.colorIdx;
    var lastStyle = -1, lastAccent = false;
    var aScale = (ALPHA_STEPS - 1) / (ALPHA_MAX - ALPHA_MIN);

    for (var i = 0; i < n; i += stride) {
      var al = a0[i];
      if (al < 0.004) continue;

      var z = this.waveDisplacement(i, front, a, ambPhase, ambAmp);
      var dy = z * dsp[i] * gain;
      if (dy > cap) dy = cap; else if (dy < -cap) dy = -cap;
      var y = sy0[i] - dy;
      if (y < -6 || y > this.cssH + 6) continue;

      /* Relief is built from density, weight and colour — not from a
         painted shadow. Crests carry more opacity, a slightly larger
         dot and a step toward the darker end of the ramp; troughs stay
         soft. Where the two waves agree, all three go further, so the
         meeting is findable at a glance. */
      var lift = z * invAmp; if (lift < 0) lift = -lift; if (lift > 1) lift = 1;
      var coh = this._coh * invAmp; if (coh > 1) coh = 1;
      var crest = z > 0 ? lift : lift * 0.45;

      var av = al * (1 + 2.05 * crest + 1.70 * coh);
      var ab2 = ((av - ALPHA_MIN) * aScale) | 0;
      if (ab2 < 0) ab2 = 0; else if (ab2 > ALPHA_STEPS - 1) ab2 = ALPHA_STEPS - 1;

      if (coh > 0.60) {
        if (!lastAccent || lastStyle !== ab2) { ctx.fillStyle = ACCENT_STYLES[ab2]; lastStyle = ab2; lastAccent = true; }
      } else {
        var cIdx = ci[i] - ((crest * 2.2) | 0);        /* crests read darker */
        if (cIdx < 0) cIdx = 0;
        var st = cIdx * ALPHA_STEPS + ab2;
        if (lastAccent || st !== lastStyle) { ctx.fillStyle = STYLES[st]; lastStyle = st; lastAccent = false; }
      }

      var d = sz[i] * (1 + 0.70 * crest + 0.55 * coh);
      ctx.fillRect(sx[i] - d * 0.5, y - d * 0.5, d, d);
    }

    this.renderColumn(age);
  };

  /* ── The column ────────────────────────────────────────────
     One event per cycle, just after the fronts touch. It rises fast,
     hangs for an instant, and drains back — about a second in all. Two
     particles keep going a little past the tip and fall late, which is
     what makes it read as something thrown up by the surface rather
     than a shape drawn on top of it. */
  ConnectedScienceWaveField.prototype.renderColumn = function (age) {
    var t0 = this.T_MEET + 0.12, dur = 1.15;
    var p = (age - t0) / dur;
    if (p <= 0 || p >= 1) return;

    var up = smoothstep(0, 0.30, p);
    var down = 1 - smoothstep(0.52, 1, p);
    var h = this.dropHeight * up * down;
    if (h < 0.5) return;

    var ctx = this.ctx, N = this.dropN;
    var bx = this.meetSx, by = this.meetSy, w = this.dropWidth;
    var fade = up * down;

    for (var d = 0; d < N; d++) {
      var u = this.dropU[d];
      var y = by - h * u;
      var x = bx + this.dropJ[d] * w * (1 - u * 0.55);
      var s = this.dropS[d] * (1.55 - 0.75 * u);
      var al = (0.055 + 0.30 * (1 - u * 0.6)) * fade;
      var ab = ((al - ALPHA_MIN) * ((ALPHA_STEPS - 1) / (ALPHA_MAX - ALPHA_MIN))) | 0;
      if (ab < 0) ab = 0; else if (ab > ALPHA_STEPS - 1) ab = ALPHA_STEPS - 1;
      ctx.fillStyle = STYLES[ab];                     /* darkest colour band */
      ctx.fillRect(x - s * 0.5, y - s * 0.5, s, s);
    }

    /* the two that detach at the tip */
    var det = smoothstep(0.22, 0.95, p);
    var dy1 = h + this.dropHeight * 0.22 * det - this.dropHeight * 0.30 * det * det;
    ctx.fillStyle = STYLES[(ALPHA_STEPS - 3)];
    ctx.fillRect(bx - 1.1, by - dy1 - 1.1, 2.2, 2.2);
    ctx.fillRect(bx + w * 0.16 - 0.8, by - dy1 * 0.86 - 0.8, 1.6, 1.6);
  };

  /* ── Loop ──────────────────────────────────────────────────
     Allocation-free. Paused whenever the hero is off screen or the
     tab is hidden; resuming does not jump, because field time only
     advances while we are actually drawing. */
  ConnectedScienceWaveField.prototype.frame = function (now) {
    this.raf = 0;
    if (!this.running) return;
    var dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
    this.last = now;
    this.t += dt;

    var t0 = performance.now();
    this.renderWaveField();

    /* If frames start costing too much, thin the field rather than let
       the animation stutter. */
    this.frameAcc += performance.now() - t0; this.frameN++;
    if (this.frameN >= 45) {
      var avg = this.frameAcc / this.frameN;
      if (avg > 9 && this.stride < 4) this.stride++;
      else if (avg < 4 && this.stride > 1) this.stride--;
      this.frameAcc = 0; this.frameN = 0;
    }
    this.raf = requestAnimationFrame(this.frameBound);
  };

  ConnectedScienceWaveField.prototype.resumeWaveField = function () {
    if (this.reduce.matches) { this.renderStaticFrame(); return; }
    if (this.running || !this.inView || !this.visible) return;
    this.running = true; this.last = 0;
    this.raf = requestAnimationFrame(this.frameBound);
  };
  ConnectedScienceWaveField.prototype.pauseWaveField = function () {
    this.running = false;
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  };

  /* ── Reduced motion ────────────────────────────────────────
     One chosen frame, drawn once, no rAF at all. The moment is the
     instant after the fronts touch, with the column at full height:
     the still picture still says two waves met and something rose. */
  ConnectedScienceWaveField.prototype.renderStaticFrame = function () {
    this.pauseWaveField();
    this.t = this.T_MEET + 0.52;
    this.renderWaveField();
  };

  ConnectedScienceWaveField.prototype.bind = function () {
    var self = this;
    this.frameBound = function (n) { self.frame(n); };

    var relayout = function () {
      var w = self.root.clientWidth, h = self.root.clientHeight;
      if (w === self.cssW && h === self.cssH) return;
      var keep = self.t;
      self.build();
      self.t = keep;
      if (self.reduce.matches) self.renderStaticFrame(); else self.renderWaveField();
    };
    var deb = 0;
    var onResize = function () { clearTimeout(deb); deb = setTimeout(relayout, 160); };
    if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(this.root);
    else window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          self.inView = e.isIntersecting;
          if (self.inView) self.resumeWaveField(); else self.pauseWaveField();
        });
      }, { threshold: 0 }).observe(this.root);
    }
    document.addEventListener('visibilitychange', function () {
      self.visible = document.visibilityState !== 'hidden';
      if (self.visible) self.resumeWaveField(); else self.pauseWaveField();
    });
    if (this.reduce.addEventListener) {
      this.reduce.addEventListener('change', function () {
        if (self.reduce.matches) self.renderStaticFrame();
        else { self.last = 0; self.resumeWaveField(); }
      });
    }

    if (this.reduce.matches) {
      this.renderStaticFrame();
    } else {
      /* Paint one frame synchronously before handing over to rAF. A
         page opened in a background tab gets no rAF until it is looked
         at, and without this the hero would be a blank rectangle until
         then. */
      this.renderWaveField();
      this.resumeWaveField();
    }
  };

  function init() {
    var root = document.querySelector('.cs-wave-field');
    var canvas = root && root.querySelector('.cs-wave-canvas');
    if (!root || !canvas || !canvas.getContext) return;
    root.classList.add('is-live');
    window.csWaveField = new ConnectedScienceWaveField(root, canvas);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
