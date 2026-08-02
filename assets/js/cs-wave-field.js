/* ============================================================
   cs-wave-field.js — the Connected Science hero        [V2]
   ------------------------------------------------------------
   A particle ocean seen at a shallow angle. Two invisible impacts
   land on it; each throws a CAUSAL wave packet outward. The two
   packets travel, and their leading crests — both positive —
   arrive at the meeting point together. Where they add, the surface
   rises to its warmest point — the amber-tinted crest of the joining.
   Then the waves pass through each other, carry on, and the plane
   goes quiet.

   The dots ARE the wave. They only rise and fall; the wave is what
   travels. Two contributions arrive from different places, meet,
   add to more than either alone, and continue — the argument of
   the page stated as physics rather than as a diagram.

   ── What changed in V2, and why ─────────────────────────────
   V1 used a symmetric packet, exp(-u²/2σ²)·sin(2πu). That has two
   defects which together made the encounter unreadable:

     · sin(2πu) is ZERO at u = 0. At the planned meeting instant the
       meeting point received two zero-crossings, not two crests.
       The one moment the whole page is about was, numerically, the
       flattest moment of the cycle.
     · a symmetric envelope carries energy AHEAD of the packet
       centre, so the two fields were already blended before the
       fronts nominally touched.

   V2 uses a causal packet in q = (front − r)/λ: nothing exists
   ahead of q = −0.35, the profile peaks at q = 0 with cos(2πq) = 1,
   and it decays behind. λ and speed are now DERIVED from the source
   separation, so the q = 0 crest of A and the q = 0 crest of B land
   on M at T_MEET at every viewport width.

   ── Coordinate systems ──────────────────────────────────────
   WORLD   (X, Y, Z)  X lateral, Y depth away from camera,
                      Z height above the plane. The waves live here.
   SCREEN  (sx, sy)   canvas pixels.

   Ground-plane projection with camera height and focal length
   folded into one constant F:

       scale = sy0 − horizonY          (distance below the horizon)
       Y     = F / scale               (depth)
       sx    = cx + X · scale
       sy    = sy0 − Z · scale

   Near rows have a large `scale`, so the same world height becomes a
   larger movement in pixels near the viewer, and crest spacing
   compresses toward the back. Neither is faked by drawing the front
   wave thicker.

   The horizon sits above the top edge, so no horizon line is ever
   visible — the field fades out before reaching it.

   Rows are placed evenly in SCREEN space, not in world Y. World-even
   rows dump most particles into a thin invisible band at the back;
   screen-even rows spend them where they can be seen. The wave is
   still computed in world space, so the geometry stays honest.

   Debug: append ?waveDebug=1 to the URL. Nothing is created, drawn
   or measured for it otherwise.
   ============================================================ */

(function () {
  'use strict';

  var TAU = Math.PI * 2;

  var DEBUG = false;
  try {
    DEBUG = new URLSearchParams(location.search).get('waveDebug') === '1';
  } catch (e) { DEBUG = false; }

  /* ── Causal packet profile ─────────────────────────────────
     q = (front − r) / λ  — how many wavelengths BEHIND the leading
     edge a particle sits. q < 0 means the wave has not arrived.

         lead(q)  = smoothstep(−0.35, 0, q)     no energy ahead of the front
         tail(q)  = 1 − smoothstep(2.25, 3.0, q) packet ends cleanly
         decay(q) = exp(−0.48 · max(q, 0))      crests fade behind the leader
         P(q)     = lead · tail · decay · cos(2πq)

     P(0) = 1 · 1 · 1 · 1 = +1 — the leading edge IS a positive crest.
     Roughly three oscillations follow it before the tail closes. */
  var Q_MIN = -0.35, Q_MAX = 3.0, LUT_N = 4096;
  var Q_STEP = (Q_MAX - Q_MIN) / (LUT_N - 1);
  var Q_INV = 1 / Q_STEP;
  var WAVE_LUT = new Float32Array(LUT_N);
  var SLOPE_LUT = new Float32Array(LUT_N);   /* dP/dq, central difference */

  function smoothstep(a, b, x) {
    var t = (x - a) / (b - a);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  }

  (function buildPacketLut() {
    var i, q;
    for (i = 0; i < LUT_N; i++) {
      q = Q_MIN + i * Q_STEP;
      var lead = smoothstep(-0.35, 0.0, q);
      var tail = 1 - smoothstep(2.25, 3.0, q);
      var decay = Math.exp(-0.48 * (q > 0 ? q : 0));
      WAVE_LUT[i] = lead * tail * decay * Math.cos(TAU * q);
    }
    /* radial derivative table, from the table itself so the two can
       never drift apart */
    for (i = 0; i < LUT_N; i++) {
      var a = WAVE_LUT[i > 0 ? i - 1 : 0];
      var b = WAVE_LUT[i < LUT_N - 1 ? i + 1 : LUT_N - 1];
      var span = (i > 0 && i < LUT_N - 1) ? (2 * Q_STEP) : Q_STEP;
      SLOPE_LUT[i] = (b - a) / span;
    }
  })();

  /* P(q) and dP/dq with linear interpolation; 0 outside the packet. */
  function packetAt(q) {
    if (q <= Q_MIN || q >= Q_MAX) return 0;
    var f = (q - Q_MIN) * Q_INV, i = f | 0, w = f - i;
    return WAVE_LUT[i] * (1 - w) + WAVE_LUT[i + 1] * w;
  }
  function packetSlopeAt(q) {
    if (q <= Q_MIN || q >= Q_MAX) return 0;
    var f = (q - Q_MIN) * Q_INV, i = f | 0, w = f - i;
    return SLOPE_LUT[i] * (1 - w) + SLOPE_LUT[i + 1] * w;
  }

  function makeRng(seed) {          /* deterministic: same field every load */
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }

  /* ── Palette ───────────────────────────────────────────────
     Near: the deep navy of the site. Far: a slate that keeps more
     weight than V1's, which drained to near-ivory and made 52,000
     particles look like a thin haze. */
  var C_NEAR = [22, 44, 82], C_FAR = [126, 145, 168];
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
  /* The single warm note. Capped at 0.26 and gated on BOTH phase
     agreement and proximity to M, so it marks the emergence and
     cannot scatter across the field wherever two packets overlap. */
  var ACCENT_MAX = 0.30;
  var ACCENT_STYLES = [];
  for (var ai = 0; ai < ALPHA_STEPS; ai++) {
    ACCENT_STYLES[ai] = 'rgba(224,124,44,' +
      (ALPHA_MIN + (ACCENT_MAX - ALPHA_MIN) * (ai / (ALPHA_STEPS - 1))).toFixed(3) + ')';
  }

  /* Raised after holding the field against the reference plates: they sit
     near 3px spacing with visibly chunky foreground dots, and 52,000 read
     as a veil next to them. 78,000 on a 1596px canvas costs ~9ms with the
     DPR already capped at 1.35 — inside budget without the stride. */
  function targetCount(viewportW) {
    if (viewportW < 780) return 22000;
    if (viewportW < 1100) return 44000;
    return 78000;
  }

  function ConnectedScienceWaveField(root, canvas) {
    this.root = root;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.reduce = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false, addEventListener: null };

    this.running = false; this.inView = true;
    this.visible = (typeof document !== 'undefined' && document.visibilityState)
      ? document.visibilityState !== 'hidden' : true;
    this.raf = 0; this.last = 0;
    this.msAvg = 0; this.fps = 0; this.drawn = 0;

    this.n = 0;
    this.sx = null; this.sy0 = null; this.disp = null;
    this.rA = null; this.rB = null; this.rM = null;
    this.uA = null; this.uB = null;                 /* radial-to-camera components */
    this.size = null; this.alpha0 = null; this.colorIdx = null;

    this.build();
    /* Open mid-story: the packets are already travelling when the page
       paints, so nobody watches an empty plane wait for an event. */
    this.t = this.T_MEET - 2.2;
    this.bind();
  }

  /* ── The cycle ─────────────────────────────────────────────
       0.0s   os dois pacotes nascem
       ~T_MEET as cristas positivas se encontram em M
       7.2-11s o campo desvanece ate zero
       11-12s plano silencioso para esconder a emenda */
  ConnectedScienceWaveField.prototype.CYCLE = 12.0;
  ConnectedScienceWaveField.prototype.T_MEET = 5.4;
  ConnectedScienceWaveField.prototype.LIFE = 11.0;

  /* B's amplitude fades in over this many seconds, A's does not. Both
     packets are born at age 0 and travel at the SAME derived speed — this
     does NOT touch position, front, lambda or T_MEET, so the constructive
     meeting at M is bit-for-bit unchanged. It only suppresses how much of
     B is drawn early in the cycle, so the two rings stop reading as one
     obvious symmetric "two circles at once" gesture: A is already
     blooming by the time B asserts itself.
     NOTE: an earlier iteration tried moving B's ORIGIN off-canvas (fracX
     ~1.02) to solve a different complaint (the meeting read as two
     separate ring systems before touching); that made B read as ambient
     "weather" rather than a second contribution and was reverted. This is
     a different lever — a time gate on B's amplitude, origin untouched. */
  ConnectedScienceWaveField.prototype.B_STAGGER = 0.9;
  ConnectedScienceWaveField.prototype.bGateAt = function (age) {
    return smoothstep(0, this.B_STAGGER, age);
  };

  ConnectedScienceWaveField.prototype.build = function () {
    var cssW = this.root.clientWidth, cssH = this.root.clientHeight;
    if (!cssW || !cssH) return;

    /* 1.35, not 1.6: the first lever on cost is resolution, because the
       particle count is fixed per breakpoint and the stride is not
       allowed to move during a cycle. */
    var dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    this.dpr = dpr; this.cssW = cssW; this.cssH = cssH;
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var phone = cssW < 780;
    this.phone = phone;
    var want = targetCount(window.innerWidth || cssW);

    /* Camera. Depth runs Y = 1 (near) to Y = DEPTH (far); F is solved so
       those land on the near and far screen rows. */
    var DEPTH = phone ? 4.2 : 5.2;
    var nearY = cssH * (phone ? 1.05 : 1.03);
    var farY = cssH * (phone ? 0.15 : 0.02);
    var xPad = cssW * 0.30;
    var F = (nearY - farY) / (1 - 1 / DEPTH);
    var horizonY = nearY - F;
    var cx = cssW * 0.50, halfSpan = cssW * 0.5 + xPad;
    this.F = F; this.horizonY = horizonY; this.cxs = cx;

    function worldAt(fracX, depthT) {
      var sy = farY + (nearY - farY) * depthT, sc = sy - horizonY;
      return { x: (cssW * fracX - cx) / sc, y: F / sc };
    }
    this._worldAt = worldAt;

    /* ── Two sources, and the point where they meet ─────────
       Same depth, separated in X, so the perpendicular bisector runs
       into the picture: the fronts touch first at the midpoint and
       then unzip along that line. B sits past the right edge, which
       is what makes it read as a second, independent contribution. */
    /* B pulled inside the frame (was 1.02): every reference plate shows
       TWO visible ring systems before the meeting, and with the centre
       past the crop the second wave read as weather, not as a second
       contribution. lambda and speed re-derive automatically. */
    /* Recentred by markup: the meeting must land at ~2/3 of the VIEWPORT
       (the canvas runs 12% past the right edge, so canvas fractions sit
       lower than viewport ones). With A at 0.45 and B at 0.75 both ring
       systems live entirely on screen and M projects to ~0.67 of the
       viewport — the action happens where it can be watched. */
    var A = worldAt(phone ? 0.40 : 0.45, phone ? 0.46 : 0.44);
    var B = worldAt(phone ? 0.88 : 0.75, phone ? 0.46 : 0.44);
    var M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
    this.oA = A; this.oB = B; this.meet = M;
    var half = Math.sqrt((A.x - M.x) * (A.x - M.x) + (A.y - M.y) * (A.y - M.y));
    this.half = half;

    /* λ and speed are DERIVED from the separation, not chosen. At
       t = T_MEET the front has travelled exactly `half`, so a particle
       at M sits at q = (half − half)/λ = 0 for BOTH sources: the two
       positive crests arrive together, at any viewport width. */
    this.lambda = half * (phone ? 0.55 : 0.48);
    this.speed = half / this.T_MEET;
    this.amp = phone ? 0.045 : 0.050;

    var mScale = F / M.y;
    this.meetSx = cx + M.x * mScale;
    this.meetSy = horizonY + mScale;
    this.meetScale = mScale;

    /* ── Grid ───────────────────────────────────────────────
       Not uniform: columns biased right and rows biased to the
       foreground, so particles are spent where the composition wants
       weight and where the eye can resolve them. */
    var aspect = (2 * halfSpan) / Math.max(1, nearY - farY);
    var rows = Math.max(70, Math.round(Math.sqrt(want / Math.max(0.35, aspect)) * 1.18));
    var cols = Math.max(70, Math.round(want / rows));
    var n = rows * cols;
    this.rows = rows; this.cols = cols;

    this.n = n;
    this.sx = new Float32Array(n); this.sy0 = new Float32Array(n);
    this.disp = new Float32Array(n);
    this.rA = new Float32Array(n); this.rB = new Float32Array(n); this.rM = new Float32Array(n);
    this.uA = new Float32Array(n); this.uB = new Float32Array(n);
    this.size = new Float32Array(n); this.alpha0 = new Float32Array(n);
    this.colorIdx = new Uint8Array(n);

    var rng = makeRng(0x5C1E7CE);
    var fadeX0 = phone ? 0.02 : 0.26, fadeX1 = phone ? 0.40 : 0.52;

    /* Displacement gain, not raw `scale`. Full perspective spans 5x here
       and produced a spike at the near crest while the back barely
       moved. The 0.68 power keeps the foreground clearly stronger
       without the spike. The one place the projection is not physical. */
    var K = Math.pow(F / 2.4, 1 - 0.68);
    this.K = K;
    /* Headroom for the SUM. At 3.4 row spacings a single crest already
       reached the clamp, so the combined peak was flattened to the same
       height and the interference had no visual payoff at all. */
    this.rowSpacing = (nearY - farY) / rows;
    this.maxDisp = this.rowSpacing * (phone ? 5.6 : 6.4);

    var i = 0;
    for (var ri = 0; ri < rows; ri++) {
      var u = (ri + 0.5) / rows;
      var rt = Math.pow(u, 0.82);                 /* 0 far, 1 near; biased near */
      var syBase = farY + (nearY - farY) * rt;
      var depthT = 1 - rt;
      var rowGap = (nearY - farY) *
        (Math.pow((ri + 1.5) / rows, 0.82) - Math.pow((ri - 0.5) / rows, 0.82)) * 0.5;
      for (var ci = 0; ci < cols; ci++) {
        var cu = (ci + 0.5) / cols;
        var cxr = 1 - Math.pow(1 - cu, 1.55);     /* biased right */
        var colGap = (2 * halfSpan) / cols;
        /* Jitter must stay SMALL. The crest bands are rows bunching where
           the surface slopes; at +/-42% of the row spacing an earlier
           pass turned the field into uniform speckle — the wave was
           still in the arithmetic and invisible on screen. */
        var sxp = (cx - halfSpan) + cxr * (2 * halfSpan) + (rng() - 0.5) * colGap * 0.55;
        var syp = syBase + (rng() - 0.5) * rowGap * 0.30;
        var scp = syp - horizonY; if (scp < 1) scp = 1;

        this.sx[i] = sxp; this.sy0[i] = syp;
        this.disp[i] = K * Math.pow(scp, 0.68);

        var wx = (sxp - cx) / scp, wy = F / scp;
        var dxa = wx - A.x, dya = wy - A.y;
        var dxb = wx - B.x, dyb = wy - B.y;
        var dxm = wx - M.x, dym = wy - M.y;
        var ra = Math.sqrt(dxa * dxa + dya * dya) || 1e-6;
        var rb = Math.sqrt(dxb * dxb + dyb * dyb) || 1e-6;
        this.rA[i] = ra; this.rB[i] = rb;
        this.rM[i] = Math.sqrt(dxm * dxm + dym * dym);
        /* Depth component of each unit radial direction. The camera looks
           along +Y, so this is how much of a radial slope tilts the
           surface toward or away from the viewer — the quantity slope
           shading needs, precomputed once. */
        this.uA[i] = dya / ra;
        this.uB[i] = dyb / rb;

        var szB = (phone ? 0.72 : 0.66) + (phone ? 1.65 : 2.45) * (1 - depthT) * (1 - depthT);
        this.size[i] = Math.max(0.55, szB * (0.78 + rng() * 0.50));
        this.colorIdx[i] = Math.min(COLOR_STEPS - 1, (depthT * COLOR_STEPS) | 0);

        var aDepth = 0.30 + 0.70 * (1 - depthT * depthT);
        var aTop = smoothstep(0, 0.13, rt);
        /* Full fade at the canvas edge. A 40% fade left the nearest rows
           chopped by the element boundary in a razor-straight line right
           above "The wider lab" — the one place the crop must not show. */
        var aBottom = 1 - smoothstep(0.86, 0.995, rt);
        var aSide = smoothstep(-0.06, 0.10, sxp / cssW) *
                    (1 - smoothstep(0.93, 1.24, sxp / cssW) * 0.45);
        /* A hard 0 under the copy read as a dead void on the left of the
           hero — reported as breaking the page's balance. Floor of .16,
           not 0, so the guard still dims the field behind the text but
           never empties it: same ripples, just quiet there. */
        var aCopy = 0.16 + 0.84 * smoothstep(fadeX0, fadeX1, sxp / cssW);
        if (phone) aCopy = Math.max(aCopy, smoothstep(0.30, 0.68, rt));
        this.alpha0[i] = 0.235 * aDepth * aTop * aBottom * aSide * aCopy * (0.74 + rng() * 0.50);
        i++;
      }
    }

    this.gain = phone ? 0.86 : 1.0;
  };

  /* ── Envelope of the whole event ───────────────────────────
     rise over the first half second, decay to EXACTLY zero at LIFE. */
  ConnectedScienceWaveField.prototype.envelopeAt = function (age) {
    var rise = smoothstep(0, 0.46, age);
    var fall = 1 - smoothstep(7.2, this.LIFE, age);
    return this.amp * rise * fall * Math.exp(-age * 0.035);
  };

  /* ── Analytic state at the meeting point ───────────────────
     Everything the debug overlay needs, computed in
     closed form at M — no sampling of the particle array.

     coherence = min(|zA|,|zB|) / max(|zA|,|zB|) when the two agree in
     sign, else 0. A pure phase-agreement ratio in [0,1]: 1 means the
     two contributions are matched, which at M is what "in phase"
     actually means. It is not a magnitude, so it cannot be faked by
     one large wave and one negligible one. */
  ConnectedScienceWaveField.prototype.computeMeetingState = function (age) {
    var a = this.envelopeAt(age);
    var front = this.speed * age;
    var qA = (front - this.half) / this.lambda;
    var qB = qA;                       /* M is equidistant by construction */
    var zA = a * packetAt(qA);
    var zB = a * packetAt(qB) * this.bGateAt(age);   /* mirrors the render path */
    var absA = zA < 0 ? -zA : zA, absB = zB < 0 ? -zB : zB;
    var coherence = (zA * zB > 0 && Math.max(absA, absB) > 1e-9)
      ? Math.min(absA, absB) / Math.max(absA, absB) : 0;
    var summed = zA + zB;

    var dsp = this.K * Math.pow(this.meetScale, 0.68) * this.gain;
    var cap = this.maxDisp;
    var single = Math.min(cap, Math.abs(zA) * dsp);
    var both = Math.min(cap, Math.abs(summed) * dsp);
    return {
      age: age, front: front, envelope: a,
      qA: qA, qB: qB, zA: zA, zB: zB,
      phaseA: (qA % 1 + 1) % 1, phaseB: (qB % 1 + 1) % 1,
      coherence: coherence, summedHeight: summed,
      projectedSingleHeight: single, projectedSummedHeight: both,
      ratio: single > 1e-6 ? both / single : 0
    };
  };

  /* ── Per-particle displacement ─────────────────────────────
     zA and zB are kept separate on the way in because their sum is not
     the only thing worth knowing. `z` is honest superposition — two
     crests arriving together really do make a peak of twice the
     height. `_coh` and `_slope` are read-outs only: they change how a
     particle is DRAWN, never where it is. */
  ConnectedScienceWaveField.prototype._coh = 0;
  ConnectedScienceWaveField.prototype._slope = 0;
  ConnectedScienceWaveField.prototype._bGate = 1;
  ConnectedScienceWaveField.prototype.waveDisplacement = function (i, front, a) {
    var lam = this.lambda;
    var qa = (front - this.rA[i]) / lam;
    var qb = (front - this.rB[i]) / lam;
    var zA = 0, zB = 0, sA = 0, sB = 0, f, k, w;

    if (qa > Q_MIN && qa < Q_MAX) {
      f = (qa - Q_MIN) * Q_INV; k = f | 0; w = f - k;
      zA = a * (WAVE_LUT[k] * (1 - w) + WAVE_LUT[k + 1] * w);
      sA = a * (SLOPE_LUT[k] * (1 - w) + SLOPE_LUT[k + 1] * w);
    }
    if (qb > Q_MIN && qb < Q_MAX) {
      f = (qb - Q_MIN) * Q_INV; k = f | 0; w = f - k;
      var gB = this._bGate;             /* set once per frame in renderWaveField */
      zB = a * (WAVE_LUT[k] * (1 - w) + WAVE_LUT[k + 1] * w) * gB;
      sB = a * (SLOPE_LUT[k] * (1 - w) + SLOPE_LUT[k + 1] * w) * gB;
    }

    var absA = zA < 0 ? -zA : zA, absB = zB < 0 ? -zB : zB;
    var mx = absA > absB ? absA : absB;
    this._coh = (zA * zB > 0 && mx > 1e-9) ? (absA < absB ? absA : absB) / mx : 0;
    this._share = (absA < absB ? absA : absB);

    /* dz/dr = −(1/λ)·dP/dq. Project each radial slope onto the depth
       axis: uA, uB are the Y-components of the unit radial directions,
       so this is how much the local surface tilts toward the camera. */
    this._slope = -(sA * this.uA[i] + sB * this.uB[i]) / lam;
    return zA + zB;
  };

  ConnectedScienceWaveField.prototype.renderWaveField = function () {
    var ctx = this.ctx, n = this.n;
    ctx.clearRect(0, 0, this.cssW, this.cssH);

    var age = this.t % this.CYCLE;
    if (age < 0) age += this.CYCLE;
    this.age = age;

    var a = this.envelopeAt(age);
    var front = this.speed * age;
    this._bGate = this.bGateAt(age);
    var ms = this.computeMeetingState(age);
    this.meetState = ms;
    var invAmp = 1 / (a + this.amp * 0.08);
    var cap = this.maxDisp, gain = this.gain;
    var sx = this.sx, sy0 = this.sy0, dsp = this.disp, sz = this.size,
        a0 = this.alpha0, ci = this.colorIdx, rM = this.rM;
    var accentR = 0.70 * this.lambda;
    var slopeNorm = 1 / (this.amp / this.lambda * 6.0);   /* normaliser for dz/dr */
    var lastStyle = -1, lastAccent = false, drawn = 0;
    var aScale = (ALPHA_STEPS - 1) / (ALPHA_MAX - ALPHA_MIN);

    for (var i = 0; i < n; i++) {
      var al = a0[i];
      if (al < 0.004) continue;

      var z = this.waveDisplacement(i, front, a);
      var dy = z * dsp[i] * gain;
      if (dy > cap) dy = cap; else if (dy < -cap) dy = -cap;
      var y = sy0[i] - dy;
      if (y < -6 || y > this.cssH + 6) continue;

      /* Relief from density, weight and colour — never a painted
         shadow. Crests carry more opacity, a slightly larger dot and a
         step toward the dark end; troughs stay soft. */
      var lift = z * invAmp; if (lift < 0) lift = -lift; if (lift > 1) lift = 1;
      var coh = this._coh;                       /* 0..1 phase agreement */
      var share = this._share * invAmp; if (share > 1) share = 1;
      var agree = coh * share;                   /* agreement AND substance */
      var crest = z > 0 ? lift : lift * 0.45;

      /* Slope shading: a face tilted toward the camera goes discreetly
         darker and denser, a face tilted away goes lighter. Clamped to
         +/-22% on opacity and at most one colour step, so it reads as
         relief and never as a second light source. */
      var sl = this._slope * slopeNorm;
      if (sl > 1) sl = 1; else if (sl < -1) sl = -1;
      var slopeGain = 1 + 0.22 * sl;

      var av = al * (1 + 2.05 * crest + 1.35 * agree) * slopeGain;
      var ab2 = ((av - ALPHA_MIN) * aScale) | 0;
      if (ab2 < 0) ab2 = 0; else if (ab2 > ALPHA_STEPS - 1) ab2 = ALPHA_STEPS - 1;

      /* Orange only where the two really are in phase AND only within
         0.70 lambda of M. Both conditions, so it marks the emergence
         and cannot appear as scattered markers wherever packets cross. */
      if (coh > 0.75 && rM[i] < accentR && z > 0) {
        if (!lastAccent || lastStyle !== ab2) {
          ctx.fillStyle = ACCENT_STYLES[ab2]; lastStyle = ab2; lastAccent = true;
        }
      } else {
        var cIdx = ci[i] - ((crest * 2.2) | 0) - (sl > 0.45 ? 1 : 0);
        if (cIdx < 0) cIdx = 0;
        var st = cIdx * ALPHA_STEPS + ab2;
        if (lastAccent || st !== lastStyle) {
          ctx.fillStyle = STYLES[st]; lastStyle = st; lastAccent = false;
        }
      }

      var d = sz[i] * (1 + 0.70 * crest + 0.45 * agree);
      ctx.fillRect(sx[i] - d * 0.5, y - d * 0.5, d, d);
      drawn++;
    }
    this.drawn = drawn;

    if (DEBUG) this.renderDebug(age, ms);
  };

  /* ── Debug ─────────────────────────────────────────────────
     Only under ?waveDebug=1. Radii are drawn by sampling points on a
     world-space circle and projecting each one, so the rings sit on the
     inclined plane and read as ellipses in perspective. Drawing 2D
     screen circles would misrepresent the geometry, which is exactly
     what a reviewer would be checking. */
  ConnectedScienceWaveField.prototype.projectWorld = function (X, Y) {
    if (Y <= 0.02) return null;
    var scale = this.F / Y;
    return { x: this.cxs + X * scale, y: this.horizonY + scale };
  };
  ConnectedScienceWaveField.prototype.strokeWorldCircle = function (O, radius, style, dash) {
    if (radius <= 0) return;
    var ctx = this.ctx, first = true, N = 160;
    ctx.save(); ctx.beginPath();
    ctx.strokeStyle = style; ctx.lineWidth = 1;
    if (dash) ctx.setLineDash(dash);
    for (var k = 0; k <= N; k++) {
      var th = (k / N) * TAU;
      var p = this.projectWorld(O.x + Math.cos(th) * radius, O.y + Math.sin(th) * radius);
      if (!p) { first = true; continue; }
      if (first) { ctx.moveTo(p.x, p.y); first = false; } else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke(); ctx.restore();
  };
  ConnectedScienceWaveField.prototype.markWorld = function (O, label, color) {
    var p = this.projectWorld(O.x, O.y); if (!p) return;
    var ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(p.x - 7, p.y); ctx.lineTo(p.x + 7, p.y);
    ctx.moveTo(p.x, p.y - 7); ctx.lineTo(p.x, p.y + 7); ctx.stroke();
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText(label, p.x + 9, p.y - 5);
    ctx.restore();
  };

  ConnectedScienceWaveField.prototype.renderDebug = function (age, ms) {
    var ctx = this.ctx, front = ms.front, lam = this.lambda;
    var NAVY = 'rgba(0,61,124,.55)', ORANGE = 'rgba(224,110,20,.75)', GREY = 'rgba(60,80,100,.30)';

    /* leading crest (q = 0) and the packet envelope limits.
       q = (front − r)/λ  ⇒  r = front − q·λ
       leading edge  q = Q_MIN → r = front − Q_MIN·λ (largest radius)
       trailing edge q = Q_MAX → r = front − Q_MAX·λ */
    var rCrest = front;
    var rLead = front - Q_MIN * lam;
    var rTail = front - Q_MAX * lam;
    var srcs = [[this.oA, 'A'], [this.oB, 'B']];
    for (var s = 0; s < 2; s++) {
      this.strokeWorldCircle(srcs[s][0], rCrest, NAVY);
      this.strokeWorldCircle(srcs[s][0], rLead, GREY, [4, 5]);
      if (rTail > 0) this.strokeWorldCircle(srcs[s][0], rTail, GREY, [4, 5]);
      this.markWorld(srcs[s][0], 'Source ' + srcs[s][1], NAVY);
    }
    this.markWorld(this.meet, 'M', ORANGE);
    this.strokeWorldCircle(this.meet, 0.70 * lam, ORANGE, [2, 4]);   /* accent radius */

    var L = [
      'waveDebug=1   ' + this.cssW + 'x' + this.cssH + '  dpr ' + this.dpr,
      'cycle age     ' + age.toFixed(3) + ' s   / CYCLE ' + this.CYCLE + '  t ' + this.t.toFixed(2),
      'particles     ' + this.n + ' built · ' + this.drawn + ' drawn',
      'fps / ms      ' + this.fps.toFixed(1) + ' / ' + this.msAvg.toFixed(2),
      '',
      'half |A-M|    ' + this.half.toFixed(4) + '   lambda ' + lam.toFixed(4),
      'speed         ' + this.speed.toFixed(4) + ' world/s   front ' + front.toFixed(4),
      'crest radius  ' + rCrest.toFixed(4) + '   envelope [' + rTail.toFixed(3) + ' .. ' + rLead.toFixed(3) + ']',
      'envelope amp  ' + ms.envelope.toFixed(5),
      '',
      'qA / qB       ' + ms.qA.toFixed(4) + ' / ' + ms.qB.toFixed(4),
      'phaseA/phaseB ' + ms.phaseA.toFixed(4) + ' / ' + ms.phaseB.toFixed(4),
      'zA / zB       ' + ms.zA.toFixed(5) + ' / ' + ms.zB.toFixed(5),
      'summedHeight  ' + ms.summedHeight.toFixed(5),
      'projSingle    ' + ms.projectedSingleHeight.toFixed(2) + ' px',
      'projSummed    ' + ms.projectedSummedHeight.toFixed(2) + ' px',
      'ratio         ' + ms.ratio.toFixed(3) + '   (target 1.60-1.90)',
      'coherence     ' + ms.coherence.toFixed(4),
      'maxDisp clamp ' + this.maxDisp.toFixed(2) + ' px  (' +
        (this.maxDisp / this.rowSpacing).toFixed(2) + ' row spacings)'
    ];
    ctx.save();
    ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
    var pad = 8, lh = 14, w = 0;
    for (var i2 = 0; i2 < L.length; i2++) w = Math.max(w, ctx.measureText(L[i2]).width);
    ctx.fillStyle = 'rgba(255,252,246,.90)';
    ctx.fillRect(pad, pad, w + 2 * pad, L.length * lh + 2 * pad);
    ctx.strokeStyle = 'rgba(0,61,124,.25)'; ctx.strokeRect(pad, pad, w + 2 * pad, L.length * lh + 2 * pad);
    ctx.fillStyle = 'rgba(11,34,55,.92)';
    for (var i3 = 0; i3 < L.length; i3++) ctx.fillText(L[i3], pad * 2, pad * 2 + (i3 + 1) * lh - 4);
    ctx.restore();
  };

  /* ── Loop ──────────────────────────────────────────────────
     Allocation-free. Paused when the hero leaves the viewport or the
     tab is hidden; resuming does not jump, because field time only
     advances while we are actually drawing.

     NOTE: there is no adaptive stride. V1 raised it mid-cycle when
     frames got expensive, which made half the field vanish while the
     viewer was watching. Cost is controlled before the loop starts —
     DPR cap first, then a fixed count per breakpoint — never by
     thinning the field during the animation. */
  ConnectedScienceWaveField.prototype.frame = function (now) {
    this.raf = 0;
    if (!this.running) return;
    var dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
    this.last = now;
    this.t += dt;

    var t0 = performance.now();
    this.renderWaveField();
    var ms = performance.now() - t0;
    this.msAvg = this.msAvg ? this.msAvg * 0.9 + ms * 0.1 : ms;
    this.fps = dt > 0 ? (this.fps ? this.fps * 0.9 + (1 / dt) * 0.1 : 1 / dt) : 0;

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
     Um quadro deterministico no encontro construtivo das ondas. */
  ConnectedScienceWaveField.prototype.STATIC_T = 0;
  ConnectedScienceWaveField.prototype.renderStaticFrame = function () {
    this.pauseWaveField();
    var target = this.T_MEET + this.STATIC_T;
    this.t = target;
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
      /* Paint one frame synchronously before handing over to rAF: a page
         opened in a background tab gets no rAF until it is looked at,
         and without this the hero would be a blank rectangle. */
      this.renderWaveField();
      this.resumeWaveField();
    }
  };

  function init() {
    var root = document.querySelector('.cs-wave-field');
    var canvas = root && root.querySelector('.cs-wave-canvas');
    if (!root || !canvas || !canvas.getContext) return;
    root.classList.add('is-live');
    var f = new ConnectedScienceWaveField(root, canvas);
    window.csWaveField = f;

    if (DEBUG) {
      window.csWaveDebug = {
        field: f,
        /* Pausa, posiciona o ciclo e renderiza exatamente um quadro. */
        seek: function (seconds) {
          f.pauseWaveField();
          f.t = seconds;
          f.renderWaveField();
          return f.meetState;
        },
        state: function (seconds) {
          return f.computeMeetingState(seconds === undefined ? f.age : seconds);
        },
        resume: function () { f.last = 0; f.resumeWaveField(); }
      };
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
