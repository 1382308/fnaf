/* scenes-c.js — título, exterior, ojos en la oscuridad, amanecer (6 AM) y jumpscare. */
(function (G) {
  'use strict';
  var C = PX.C, W = PX.W, H = PX.H, SC = G.SC, U = SC.util;

  function hex2rgb(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  function mix(a, b, k) {
    var A = hex2rgb(a), B = hex2rgb(b);
    var r = A.map(function (v, i) { return Math.round(v + (B[i] - v) * k); });
    return '#' + r.map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
  }
  U.mix = mix;

  /* ---------- Pizzería (se dibuja una vez en un lienzo transparente) ---------- */
  var bldg = null;
  function building() {
    if (bldg) return bldg;
    var t = PX.mk(W, H), p = t.pen, x, y, i;
    // suelo
    p.r(0, 140, W, 40, '#1b1436'); p.dith(0, 140, W, 40, C.ink, 5);
    for (x = 8; x < W; x += 40) p.r(x, 164, 22, 2, '#53627e');
    p.r(0, 140, W, 2, '#3d2e6b');
    // fachada
    p.r(40, 76, 240, 64, '#4a3a7a');
    for (y = 76; y < 140; y += 8) { p.r(40, y, 240, 1, '#3a2c64'); for (x = 40 + ((y / 8) % 2) * 8; x < 280; x += 16) p.r(x, y, 1, 8, '#3a2c64'); }
    p.dith(40, 76, 240, 64, C.ink, 4);
    p.r(36, 70, 248, 8, '#241f38'); p.r(36, 70, 248, 2, '#53627e');
    // cartel del techo
    p.r(96, 62, 3, 10, '#364158'); p.r(221, 62, 3, 10, '#364158');
    p.box(84, 26, 152, 40, '#120d24', '#7e90b0', 2);
    p.dith(86, 28, 148, 36, '#2a1f4d', 6);
    // toldo
    for (x = 40; x < 280; x += 20) { p.r(x, 92, 10, 12, C.rd2); p.r(x + 10, 92, 10, 12, C.wh); p.ell(x + 5, 104, 5, 3, C.rd2); p.ell(x + 15, 104, 5, 3, C.wh); }
    p.r(40, 90, 240, 3, '#5a0f1c');
    p.dith(40, 92, 240, 16, C.ink, 4);
    // ventanas
    [[52, 112], [96, 112], [208, 112], [236, 112]].forEach(function (w, k) {
      var ww = k === 0 ? 38 : (k === 1 ? 30 : (k === 2 ? 22 : 30));
      p.box(w[0], w[1], ww, 26, '#ffd23a', '#241f38', 2);
      p.dith(w[0], w[1], ww, 26, '#ff9a2e', 5);
      p.r(w[0] + ww / 2, w[1], 1, 26, '#241f38');
    });
    // puerta doble
    p.box(138, 108, 44, 32, '#241f38', '#7e90b0', 2);
    p.r(140, 110, 19, 30, '#ffd23a'); p.r(161, 110, 19, 30, '#ffd23a');
    p.dith(140, 110, 40, 30, '#ff9a2e', 6);
    p.r(159, 108, 2, 32, '#241f38');
    p.r(156, 124, 2, 6, '#7e90b0'); p.r(162, 124, 2, 6, '#7e90b0');
    p.box(144, 100, 32, 7, C.rd2, C.ink, 1); p.txt('OPEN', 150, 101, C.wh, 1);
    // globos
    [[28, C.rd3], [34, C.cy], [22, C.yl3]].forEach(function (b, k) {
      p.line(24 + k * 6, 140, 26 + k * 4, 118, '#98a8c0', 1);
      p.circ(26 + k * 4, 114, 5, b[1]); p.p(24 + k * 4, 112, C.wh);
    });
    // poste de luz
    p.r(298, 96, 3, 46, '#364158'); p.r(290, 94, 14, 4, '#364158'); p.circ(293, 100, 3, C.yl3);
    p.dith(276, 96, 40, 44, C.yl3, 2);
    bldg = t.cv;
    return bldg;
  }

  function sky(p, k) {
    // k 0..1: noche -> amanecer
    var top = mix('#05030a', '#2a4a8a', k), mid = mix('#1b1436', '#ff7a3a', k), low = mix('#2a1f4d', '#ffd23a', k);
    p.grad(0, 0, W, 60, top, mid, false);
    p.grad(0, 60, W, 82, mid, low, false);
  }

  function neon(p, t, on) {
    var c1 = on ? C.yl3 : '#6a5a20', c2 = on ? C.pk : '#6a2c58';
    p.txt("FREDDY FAZBEAR'S", 97, 32, c1, 2);
    p.txt('PIZZA', 131, 48, c2, 3);
  }

  SC.reg.exterior = {
    paint: function (p, ctx) {
      sky(p, 0);
      var rnd = PX.rng(77), i;
      // horizonte de edificios lejanos
      for (i = 0; i < 18; i++) { var bw = 12 + ((rnd() * 20) | 0), bh = 14 + ((rnd() * 36) | 0); p.r(i * 18 - 4, 140 - bh, bw, bh, '#120d24'); }
      p.circ(264, 32, 12, '#f2f0ff'); p.circ(268, 29, 10, '#2a1f4d'); p.ell(260, 36, 3, 2, p.pat('#9a9ab0', 8));
      p.circ(264, 32, 14, 'rgba(0,0,0,0)');
      ctx.drawImage(building(), 0, 0);
    },
    frame: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0), rnd = PX.rng(5), i;
      for (i = 0; i < 40; i++) {
        var sx = (rnd() * W) | 0, sy = (rnd() * 70) | 0, ph = rnd() * 6;
        if (Math.sin(t * 2 + ph) > 0.2) p.p(sx, sy, i % 4 ? '#9a90ff' : C.wh);
      }
      var on = !(Math.sin(t * 23) > 0.9 && Math.sin(t * 2.1) > 0.3);
      p.r(86, 28, 148, 36, '#120d24'); p.dith(86, 28, 148, 36, '#2a1f4d', 6);
      neon(p, t, on);
      // ojitos en las ventanas
      var b = (Math.floor(t * 1.3) % 5 !== 4);
      if (b) { p.r(110, 122, 2, 2, '#5ab4ff'); p.r(116, 122, 2, 2, '#5ab4ff'); p.r(218, 124, 2, 2, '#ff4adf'); p.r(224, 124, 2, 2, '#ff4adf'); }
    }
  };

  /* ---------- Título: Freddy enorme con ojos parpadeantes ---------- */
  SC.reg.title = {
    paint: function (p, ctx) {
      p.r(0, 0, W, H, '#05030a');
      p.dith(0, 0, W, H, C.n2, 3);
      // pasillo de fondo
      p.poly([0, 0, 320, 0, 220, 70, 100, 70], '#0a0714');
      p.poly([0, 180, 320, 180, 220, 110, 100, 110], '#0e0a1e');
    },
    frame: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0);
      var glitch = Math.sin(t * 13) > 0.93 ? ((Math.random() * 6 - 3) | 0) : 0;
      var off = Math.sin(t * 1.2) > 0.97;
      var eyeOn = !(Math.sin(t * 9) > 0.8 && Math.sin(t * 1.7) > 0.4);
      var s = 3.55, ox = 156 + glitch, oy = 4 + Math.round(Math.sin(t) * 2);
      // halo
      p.ell(ox + 24 * s, oy + 28 * s, 32 * s, 28 * s, p.pat('#3d2e6b', 2));
      SPR.head('freddy', p.at(ox, oy, s), { eye: eyeOn ? '#5ab4ff' : '#05030a', lx: st ? (st.mx - 230) / 200 : 0, ly: st ? (st.my - 90) / 200 : 0 });
      // oscurecer (sombras dramáticas)
      p.dith(ox, oy, Math.round(48 * s), Math.round(50 * s), C.ink, off ? 10 : 4);
      // estática
      for (var i = 0; i < 90; i++) {
        ctx.fillStyle = 'rgba(255,255,255,' + (0.04 + Math.random() * 0.1) + ')';
        ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 1 + (Math.random() * 12) | 0, 1);
      }
      var yy = ((t * 50) % (H + 40)) - 20;
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(0, yy, W, 12);
    }
  };

  /* ---------- Ojos en la oscuridad (diapositiva 2 de la intro) ---------- */
  SC.reg.eyes = {
    paint: function (p) { p.r(0, 0, W, H, '#05030a'); p.dith(0, 0, W, H, C.n1, 2); },
    frame: function (ctx, t) {
      var p = new PX.Pen(ctx, 1, 0, 0);
      var pairs = [[50, 70, '#5ab4ff', 0], [120, 110, '#ff4adf', 1.7], [190, 60, '#ff4adf', 3.1], [250, 100, '#ffe45c', 4.4], [90, 40, '#5ab4ff', 5.2], [270, 38, '#ff4adf', 2.2]];
      pairs.forEach(function (e) {
        var on = Math.sin(t * 1.1 + e[3]) > -0.55;
        if (!on) return;
        var sc = 1 + 0.6 * Math.sin(t * 0.8 + e[3]);
        p.ell(e[0], e[1], 14, 8, p.pat(e[2], 2));
        p.r(e[0] - 6, e[1], 3, 3, e[2]); p.r(e[0] + 4, e[1], 3, 3, e[2]);
        p.p(e[0] - 6, e[1], C.wh); p.p(e[0] + 4, e[1], C.wh);
      });
      for (var i = 0; i < 40; i++) {
        ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.05) + ')';
        ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 1 + (Math.random() * 7) | 0, 1);
      }
    }
  };

  /* ---------- Amanecer: las 6 AM ---------- */
  SC.reg.dawn = {
    paint: function () { },
    frame: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0), k = st ? Math.min(1, st.prog) : 0, i;
      sky(p, k);
      var sy = 150 - k * 108, sx = 262;
      // rayos
      for (i = 0; i < 8; i++) {
        var a = i / 8 * Math.PI * 2 + t * 0.3;
        p.poly([sx, sy, sx + Math.cos(a - 0.05) * 260, sy + Math.sin(a - 0.05) * 260, sx + Math.cos(a + 0.05) * 260, sy + Math.sin(a + 0.05) * 260], p.pat('#fff6b0', 1));
      }
      p.circ(sx, sy, 22, '#ff9a2e'); p.circ(sx, sy, 17, '#ffd23a'); p.circ(sx, sy, 11, '#fff6b0');
      // nubes
      [[30, 40, 1], [200, 30, 1.4], [260, 70, 0.8]].forEach(function (c, n) {
        var cx = ((c[0] + t * (3 + n * 2)) % (W + 80)) - 40;
        p.ell(cx, c[1], 22 * c[2], 5 * c[2], mix('#2a1f4d', '#ffd9a0', k));
        p.ell(cx + 10, c[1] - 4, 12 * c[2], 5 * c[2], mix('#3d2e6b', '#ffe9c0', k));
      });
      ctx.drawImage(building(), 0, 0);
      p.dith(0, 70, W, 110, '#ff9a2e', Math.round(k * 4));
      // letrero apagado
      p.r(86, 28, 148, 36, '#120d24');
      p.txt("FREDDY FAZBEAR'S", 97, 32, k > 0.4 ? '#ffe45c' : '#6a5a20', 2);
      p.txt('PIZZA', 131, 48, '#ff5fd2', 3);
      // confeti
      if (st && st.confetti) {
        var rnd = PX.rng(31);
        for (i = 0; i < 46; i++) {
          var cx2 = (rnd() * W) | 0, sp = 18 + rnd() * 40, ph = rnd() * 10;
          var cy = ((t * sp + ph * 30) % (H + 20)) - 10;
          p.r(cx2 + Math.sin(t * 3 + i) * 5, cy, 3, 3, [C.rd3, C.yl3, C.cy, C.pk, C.gr3][i % 5]);
        }
      }
    }
  };

  /* ---------- Jumpscare ---------- */
  SC.jump = function (ctx, kind, t) {
    var p = new PX.Pen(ctx, 1, 0, 0), i;
    var flash = Math.sin(t * 50) > 0;
    p.r(0, 0, W, H, flash ? '#2e060c' : '#05030a');
    // trama de ruido
    for (i = 0; i < 160; i++) {
      ctx.fillStyle = 'rgba(255,60,70,' + (Math.random() * 0.25) + ')';
      ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 2 + (Math.random() * 22) | 0, 1);
    }
    var zoom = Math.min(1, t / 0.18);
    var s = 1.2 + zoom * 2.6;
    var shake = t > 0.18 ? [(Math.random() * 10 - 5) | 0, (Math.random() * 10 - 5) | 0] : [0, 0];
    var ox = Math.round(160 - 24 * s + shake[0]), oy = Math.round(94 - 25 * s + shake[1]);
    var mouth = 0.55 + 0.45 * Math.abs(Math.sin(t * 28));
    var eye = kind === 'foxy' ? '#ffe45c' : (kind === 'golden' ? '#ffffff' : '#ff2a2a');
    SPR.head(kind === 'mike' ? 'freddy' : kind, p.at(ox, oy, s), { mouth: mouth, angry: true, eye: eye });
    p.dith(0, 0, W, H, C.ink, flash ? 0 : 3);
    for (i = 0; i < 30; i++) {
      ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.3) + ')';
      ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 1 + (Math.random() * 30) | 0, 1);
    }
  };
})(window);
