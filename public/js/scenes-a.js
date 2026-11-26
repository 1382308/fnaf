/* scenes-a.js — núcleo de escenas + Oficina (noches 1 y 7) + Escenario (noche 2).
   Cada escena tiene paint(p) (fondo estático, se dibuja una vez) y frame(ctx,t,st) (animación). */
(function (G) {
  'use strict';
  var C = PX.C, W = PX.W, H = PX.H;
  var SC = G.SC = { reg: {}, util: {} };
  var U = SC.util;

  /* ---------- utilidades comunes ---------- */
  var EYES = {
    freddy: { e: [[15, 24], [33, 24]], c: '#5ab4ff', mouth: [24, 38] },
    bonnie: { e: [[16, 27], [32, 27]], c: '#ff4adf', mouth: [24, 41] },
    chica: { e: [[15, 22.5], [33, 22.5]], c: '#ff4adf', mouth: [24, 36] },
    foxy: { e: [[33, 24]], c: '#ffe45c', mouth: [24, 39] },
    golden: { e: [[15, 24], [33, 24]], c: '#ffffff', mouth: [24, 38] }
  };
  var silCache = {};
  function sil(kind, s) {
    var k = kind + '@' + s;
    if (silCache[k]) return silCache[k];
    var w = Math.ceil(52 * s) + 4, h = Math.ceil(120 * s) + 4;
    var t = PX.mk(w, h);
    SPR.body(kind, new PX.Pen(t.ctx, s, 2, 2), { mic: false, cake: false, guitar: false });
    var d = t.ctx.getImageData(0, 0, w, h), a = d.data;
    for (var i = 0; i < a.length; i += 4) { if (a[i + 3] > 0) { a[i] = 7; a[i + 1] = 5; a[i + 2] = 15; a[i + 3] = 255; } }
    t.ctx.putImageData(d, 0, 0);
    return (silCache[k] = t.cv);
  }
  /* silueta + ojos brillantes. pos = [cx, baseY, s] ; stage 1 = solo ojos, 2 = silueta, 3 = silueta cerca */
  function lurk(ctx, kind, stage, t, pos, clip, tint) {
    if (stage < 1) return;
    var s = pos[2], ox = Math.round(pos[0] - 24 * s), oy = Math.round(pos[1] - 112 * s);
    ctx.save();
    if (clip) { ctx.beginPath(); ctx.rect(clip[0], clip[1], clip[2], clip[3]); ctx.clip(); }
    if (stage >= 2) {
      var c = sil(kind, s);
      ctx.drawImage(c, ox - 2, oy - 2);
    }
    var E = EYES[kind], p = new PX.Pen(ctx, s, ox, oy);
    var pulse = 0.6 + 0.4 * Math.sin(t * 5);
    var blink = (Math.floor(t * 1.3) % 5 === 4) && (t * 1.3 % 1 < 0.16);
    if (!blink) {
      E.e.forEach(function (e) {
        var r = Math.max(1.5, 2.4 / s * (stage >= 3 ? 1.25 : 1));
        p.ell(e[0], e[1], r * 1.9, r * 1.9, p.pat(E.c, Math.round(3 + 3 * pulse)));
        p.ell(e[0], e[1], r, r, E.c);
        p.p(e[0], e[1], '#ffffff');
      });
    }
    if (stage >= 3 && kind === 'foxy') p.r(15, 40, 18, 2, C.wh);
    ctx.restore();
  }
  U.lurk = lurk; U.sil = sil; U.EYES = EYES;

  /* visor de cámara de seguridad: etiqueta abajo a la derecha (el HUD ocupa las otras esquinas) */
  function camOverlay(ctx, t, label, where) {
    var p = new PX.Pen(ctx, 1, 0, 0), i;
    var tw = p.txtW(label + '  ' + where);
    p.r(W - tw - 18, H - 12, tw + 14, 10, 'rgba(0,0,0,0.6)');
    p.txt(label, W - tw - 11, H - 10, C.wh, 1); p.txt(where, W - tw - 11 + 4 * (label.length + 2), H - 10, C.gr4, 1);
    if (Math.floor(t * 1.6) % 2 === 0) p.circ(W - tw - 15, H - 7, 2, C.rd3);
    // barra de estática
    var yy = ((t * 38) % (H + 30)) - 20;
    ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(0, yy, W, 7);
    for (i = 0; i < 26; i++) {
      ctx.fillStyle = 'rgba(255,255,255,' + (0.03 + Math.random() * 0.07) + ')';
      ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 1 + (Math.random() * 9) | 0, 1);
    }
    // esquinas del visor
    var k = C.wh;
    [[6, 30], [W - 12, 30], [6, H - 32], [W - 12, H - 32]].forEach(function (c) {
      p.r(c[0], c[1], 6, 1, k); p.r(c[0] + (c[0] < W / 2 ? 0 : 5), c[1], 1, 6, k);
    });
  }
  U.cam = camOverlay;

  /* pequeño cartel/póster de fiesta */
  function poster(p, x, y, w, h) {
    p.box(x, y, w, h, '#f2f0ff', '#8f87b5', 1);
    p.r(x + 1, y + 1, w - 2, 7, C.pu1);
    p.txt('PARTY', x + 6, y + 2, C.yl3, 1);
    var by = y + h - 12;
    // Freddy
    p.circ(x + 8, by + 4, 4, C.fr2); p.circ(x + 5, by, 1.6, C.fr2); p.circ(x + 11, by, 1.6, C.fr2); p.r(x + 6, by - 4, 4, 3, C.ink); p.r(x + 6, by + 3, 1, 1, C.ink); p.r(x + 9, by + 3, 1, 1, C.ink);
    // Bonnie
    p.circ(x + 17, by + 5, 3.4, C.bn2); p.r(x + 15, by - 5, 2, 7, C.bn2); p.r(x + 18, by - 5, 2, 7, C.bn2); p.r(x + 16, by + 4, 1, 1, C.ink); p.r(x + 18, by + 4, 1, 1, C.ink);
    // Chica
    p.circ(x + 26, by + 4, 4, C.yl2); p.r(x + 24, by + 5, 5, 2, C.or1); p.r(x + 24, by + 2, 1, 1, C.ink); p.r(x + 27, by + 2, 1, 1, C.ink);
    // globos
    p.circ(x + 4, y + 14, 2.4, C.rd3); p.circ(x + w - 5, y + 15, 2.4, C.cy);
    p.r(x + 4, y + 17, 1, 8, C.mt3); p.r(x + w - 5, y + 18, 1, 8, C.mt3);
  }
  U.poster = poster;

  /* ====================================================== */
  /*  OFICINA                                                */
  /* ====================================================== */
  function opal(n7) {
    return n7 ? { ceil: '#120a1a', wall: '#2a1424', wall0: '#1b0d19', wall2: '#3a1c30', trim: '#4f2b47', floor: '#0b0610', hallA: '#05030a', hallB: '#3e1a34', glow: '#ff3b4a', h0: '#0e0610', h1: '#22101f', h2: '#321629' }
              : { ceil: '#16112b', wall: '#2f2a49', wall0: '#241f38', wall2: '#3d3760', trim: '#53627e', floor: '#120d24', hallA: '#05030a', hallB: '#3b3070', glow: '#9fe8b0', h0: '#0e0b22', h1: '#1d1740', h2: '#2b2252' };
  }

  function door(p, q, x) {
    p.r(x - 4, 18, 64, 102, q.trim); p.r(x - 4, 18, 64, 2, '#7e90b0'); p.r(x - 4, 18, 2, 102, '#7e90b0');
    p.r(x, 22, 56, 94, q.hallA);
    hallway(p, q, x, 22, 56, 94);
    // bisagras y remaches
    p.r(x - 3, 34, 3, 7, '#98a8c0'); p.r(x - 3, 92, 3, 7, '#98a8c0');
    p.r(x + 58, 34, 2, 7, '#7e90b0'); p.r(x + 58, 92, 2, 7, '#7e90b0');
  }
  /* pasillo en perspectiva dentro de un marco (x,y,w,h) */
  function hallway(p, q, x, y, w, h) {
    var ix = Math.round(w * 0.29), iy = Math.round(h * 0.23);
    p.poly([x, y, x + w, y, x + w - ix, y + iy, x + ix, y + iy], q.h0);
    p.poly([x, y + h, x + w, y + h, x + w - ix, y + h - iy, x + ix, y + h - iy], q.h2);
    p.poly([x, y, x + ix, y + iy, x + ix, y + h - iy, x, y + h], q.h1);
    p.poly([x + w, y, x + w - ix, y + iy, x + w - ix, y + h - iy, x + w, y + h], q.h1);
    p.r(x + ix, y + iy, w - 2 * ix, h - 2 * iy, q.hallB);
    p.dith(x + ix, y + iy, w - 2 * ix, h - 2 * iy, C.ink, 5);
    // baldosas del piso
    for (var k = 1; k < 4; k++) {
      var yy = y + h - iy + Math.round(iy * k / 4 * 0.0) - Math.round(k * k * iy / 16 * 1.0);
      p.line(x + Math.round(ix * (4 - k) / 4 * 0.0), y + h - iy * k / 4 * 1.0, x + w - 0, y + h - iy * k / 4 * 1.0, q.h1, 1);
    }
    p.dith(x, y, w, h, C.ink, 3);
  }
  function panel(p, x) {
    p.box(x, 56, 12, 38, '#364158', C.ink, 1);
    p.r(x + 1, 57, 10, 1, '#7e90b0');
    p.box(x + 3, 60, 6, 10, C.gr2, C.ink, 1); p.r(x + 4, 61, 4, 2, C.gr4);
    p.box(x + 3, 76, 6, 10, C.rd2, C.ink, 1); p.r(x + 4, 77, 4, 2, C.rd4);
    p.p(x + 6, 90, C.yl3);
  }
  function kidDrawing(p, x, y) {
    p.box(x, y, 26, 32, '#e8e0f0', '#8f87b5', 1);
    p.circ(x + 19, y + 7, 4, C.yl2);
    p.r(x + 2, y + 24, 22, 3, C.gr2);
    p.r(x + 5, y + 14, 4, 8, C.rd3); p.circ(x + 7, y + 12, 2.2, C.sk1); p.r(x + 3, y + 16, 8, 1, C.rd3);
    p.r(x + 13, y + 15, 7, 7, C.cy); p.r(x + 14, y + 16, 2, 2, C.wh); p.r(x + 18, y + 16, 2, 2, C.wh);
    p.line(x + 3, y + 5, x + 9, y + 8, C.pu1, 1); p.line(x + 9, y + 8, x + 12, y + 3, C.pu1, 1);
  }

  function officeBg(p, ctx, n7) {
    var q = opal(n7), x;
    p.r(0, 0, W, 20, q.ceil); p.r(0, 18, W, 2, q.trim);
    p.r(0, 20, W, 92, q.wall);
    for (x = 0; x < W; x += 40) { p.r(x, 20, 1, 92, q.wall0); p.r(x + 1, 20, 1, 92, q.wall2); }
    p.dith(0, 20, W, 26, q.wall0, 7);
    p.r(0, 94, W, 18, q.wall0); p.r(0, 94, W, 1, q.trim);
    for (x = 0; x < W; x += 12) p.r(x, 100, 1, 12, q.wall);
    p.r(0, 112, W, 68, q.floor); p.dith(0, 112, W, 68, C.ink, 7);
    // lámpara de techo (base)
    p.box(132, 6, 56, 7, '#98a8c0', C.ink, 1);
    p.r(134, 8, 52, 3, n7 ? '#4a2030' : '#cfeedd');
    door(p, q, 6); door(p, q, 258);
    panel(p, 64); panel(p, 244);
    // apertura central
    p.r(108, 30, 104, 78, q.trim);
    p.r(112, 34, 96, 70, q.hallA);
    hallway(p, q, 112, 34, 96, 70);
    p.r(124, 38, 72, 4, C.mt1);
    for (x = 126; x < 194; x += 6) p.r(x, 38, 2, 4, C.ink);
    p.r(152, 62, 16, 10, q.hallB); p.dith(150, 60, 20, 14, q.glow, 2);

    if (n7) {
      // cartel "IT'S ME"
      p.box(78, 36, 34, 42, '#1a0d1a', '#6b0f1c', 1);
      p.txt("IT'S", 83, 40, C.rd3, 1); p.txt('ME', 87, 47, C.rd3, 1);
      SPR.head('golden', p.at(85, 54, 0.5), {});
      p.dith(78, 36, 34, 42, C.ink, 4);
    } else {
      poster(p, 78, 36, 32, 42);
      kidDrawing(p, 214, 42);
    }
    // escritorio
    p.r(18, 116, 284, 64, '#3a2414');
    p.r(18, 116, 284, 10, '#7c5230'); p.r(18, 116, 284, 2, '#b87a42'); p.r(18, 125, 284, 1, '#2a180c');
    p.r(22, 126, 276, 54, '#4a2c16');
    p.dith(22, 126, 276, 54, C.ink, 5);
    p.box(36, 136, 70, 34, '#6b4223', '#2a180c', 1); p.r(66, 150, 10, 3, '#b87a42');
    p.box(214, 136, 70, 34, '#6b4223', '#2a180c', 1); p.r(244, 150, 10, 3, '#b87a42');

    // objetos del escritorio
    // papeles
    p.box(58, 111, 34, 5, '#e8e0f0', '#8f87b5', 1); p.r(62, 113, 20, 1, '#8f87b5');
    // vaso
    p.box(104, 100, 8, 16, C.rd2, C.ink, 1); p.r(105, 103, 6, 3, C.wh); p.r(109, 94, 1, 8, C.yl3);
    // teléfono (base)
    p.box(116, 108, 34, 8, '#222b3c', C.ink, 1); p.r(118, 109, 30, 1, '#53627e');
    p.box(120, 101, 26, 6, '#364158', C.ink, 1); p.r(121, 102, 24, 1, '#7e90b0');
    p.r(128, 110, 2, 2, '#7e90b0'); p.r(132, 110, 2, 2, '#7e90b0'); p.r(136, 110, 2, 2, '#7e90b0');
    // pastelito de Chica ("Carl")
    p.box(161, 109, 12, 7, '#d84aa0', C.ink, 1);
    p.ell(167, 106, 7, 4, C.pk); p.ell(167, 103, 5, 3, C.rd4);
    p.r(166, 96, 2, 6, C.cy); p.p(166, 95, C.yl3); p.p(167, 94, C.rd3);
    p.r(163, 104, 2, 2, C.wh); p.r(169, 104, 2, 2, C.wh); p.p(164, 105, C.ink); p.p(170, 105, C.ink);
    // monitor
    p.box(198, 80, 46, 36, '#364158', C.ink, 1);
    p.r(199, 81, 44, 1, '#7e90b0');
    p.r(203, 85, 36, 26, C.gr0);
    p.r(214, 116, 14, 3, '#222b3c'); p.r(208, 118, 26, 2, '#364158');
    p.p(240, 113, C.rd3);
    // ventilador (base)
    p.box(250, 112, 20, 4, '#364158', C.ink, 1); p.r(259, 100, 2, 12, '#7e90b0');
    // lápices
    p.r(80, 106, 1, 9, C.yl3); p.r(82, 107, 1, 8, C.rd3); p.r(78, 108, 1, 7, C.cy);
    // viñeta inferior
    p.grad(0, 164, W, 16, '#00000000', '#05030a', false);
  }

  SC.reg.office = {
    paint: function (p, ctx) { officeBg(p, ctx, false); },
    frame: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0);
      // parpadeo de la lámpara
      var fl = (Math.sin(t * 31) > 0.6 && Math.sin(t * 3.1) > 0.4) ? 0 : 1;
      p.r(134, 8, 52, 3, fl ? '#cfeedd' : '#5a6a60');
      if (!fl) p.dith(0, 20, W, 92, C.ink, 9);
      // pantalla del monitor
      p.r(203, 85, 36, 26, C.gr0);
      var sy = ((t * 14) % 26) | 0;
      p.r(203, 85 + sy, 36, 2, C.gr1);
      p.txt('CAM 1A', 206, 88, C.gr3, 1);
      p.txt(Math.floor(t * 2) % 2 ? 'REC' : '   ', 206, 96, C.rd3, 1);
      p.r(206, 103, 8, 5, C.gr2); p.r(217, 103, 8, 5, C.gr1); p.r(228, 103, 8, 5, C.gr1);
      // ventilador
      var a = t * 9, cx = 260, cy = 98, i;
      p.circ(cx, cy, 11, 'rgba(126,144,176,0.12)');
      for (i = 0; i < 3; i++) {
        var an = a + i * 2.094;
        p.line(cx, cy, cx + Math.cos(an) * 10, cy + Math.sin(an) * 10, C.mt4, 3);
      }
      p.circ(cx, cy, 2, C.mt2);
      // teléfono sonando (si la pista sigue sin resolver)
      if (st && st.unsolved && st.unsolved.phone) {
        var ring = (t % 1.6) < 0.7;
        if (ring) {
          var sh = Math.sin(t * 60) > 0 ? 1 : 0;
          p.box(120, 100 - sh, 26, 6, '#364158', C.ink, 1);
          p.line(116, 92, 120, 96, C.yl3, 1); p.line(148, 96, 152, 92, C.yl3, 1);
          p.line(113, 98, 118, 101, C.yl3, 1); p.line(151, 101, 156, 98, C.yl3, 1);
        }
      }
      // Freddy acecha en la puerta derecha
      lurk(ctx, 'freddy', st ? st.stage : 0, t, [286, 118, 0.82], [260, 22, 56, 94], '#5ab4ff');
      if (st && st.stage >= 3) { p.txt('HA HA HA', 266, 28 + Math.round(Math.sin(t * 20)), C.rd3, 1); }
    }
  };

  SC.reg.office7 = {
    paint: function (p, ctx) {
      officeBg(p, ctx, true);
      // Golden Freddy desplomado en el pasillo central
      var t = PX.mk(60, 120);
      SPR.body('golden', t.pen.at(4, 4, 0.66), { tilt: 5 });
      ctx.drawImage(t.cv, 142, 32);
    },
    frame: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0);
      var fl = (Math.sin(t * 17) > 0.2) ? 1 : 0;
      p.r(134, 8, 52, 3, fl ? '#7a2030' : '#2a1018');
      if (!fl) p.dith(0, 20, W, 92, C.ink, 8);
      // Golden Freddy se incorpora conforme aumenta el peligro
      var stage = st ? st.stage : 0, lift = stage;
      var gx = 142, gy = 32 - lift * 3;
      ctx.save(); ctx.beginPath(); ctx.rect(112, 34, 96, 70); ctx.clip();
      var q = PX.mk(60, 120);
      SPR.body('golden', q.pen.at(4, 4, 0.66), { tilt: 5 - lift * 2, mouth: stage >= 3 ? 0.8 : 0, angry: stage >= 2 });
      ctx.drawImage(q.cv, gx, gy);
      ctx.restore();
      // ojitos blancos que parpadean
      if (stage >= 1 && Math.sin(t * 3) > -0.8) {
        p.r(157, 61 - lift * 3, 2, 2, C.wh); p.r(171, 61 - lift * 3, 2, 2, C.wh);
      }
      // pantalla
      p.r(203, 85, 36, 26, C.gr0);
      p.r(203, 85 + (((t * 14) % 26) | 0), 36, 2, C.gr1);
      p.txt('X = ?', 208, 88, C.gr3, 1);
      p.txt('PASO 3', 206, 98, C.gr2, 1);
      // ventilador
      var cx = 260, cy = 98, i;
      for (i = 0; i < 3; i++) { var an = t * 9 + i * 2.094; p.line(cx, cy, cx + Math.cos(an) * 10, cy + Math.sin(an) * 10, C.mt4, 3); }
      p.circ(cx, cy, 2, C.mt2);
      if (st && st.unsolved && st.unsolved.phone && (t % 1.6) < 0.7) {
        p.line(116, 92, 120, 96, C.yl3, 1); p.line(148, 96, 152, 92, C.yl3, 1);
      }
    }
  };

  /* ====================================================== */
  /*  ESCENARIO (noche 2)                                    */
  /* ====================================================== */
  function curtain(p, x, w, flip) {
    var i;
    for (i = 0; i < w; i += 6) {
      p.r(x + i, 0, 6, 120, (i / 6) % 2 ? C.pu0 : C.pu1);
      p.r(x + i + 2, 0, 2, 120, C.pu2); p.dith(x + i + 2, 0, 2, 120, C.pu1, 6);
    }
    var rnd = PX.rng(flip ? 11 : 7);
    for (i = 0; i < 9; i++) {
      var sx = x + 4 + ((rnd() * (w - 12)) | 0), sy = 28 + ((rnd() * 80) | 0);
      p.r(sx, sy, 1, 3, C.yl3); p.r(sx - 1, sy + 1, 3, 1, C.yl3);
    }
    p.dith(x, 0, w, 120, C.ink, 4);
    p.r(flip ? x : x + w - 3, 0, 3, 120, C.pu0);
    p.r(flip ? x + w - 8 : x + 2, 96, 6, 30, C.yl1); p.r(flip ? x + w - 8 : x + 2, 96, 6, 4, C.yl3);
  }
  function stageBg(p, ctx) {
    var i, x, rnd = PX.rng(5);
    p.r(0, 0, W, 90, '#140e2a');
    p.dith(0, 0, W, 90, C.n3, 5);
    for (i = 0; i < 40; i++) p.p((rnd() * W) | 0, 16 + ((rnd() * 70) | 0), '#3d2e6b');
    // telón de fondo
    p.box(50, 26, 220, 62, '#1d1840', '#53627e', 2);
    p.dith(52, 28, 216, 58, C.pu0, 6);
    for (i = 0; i < 16; i++) { var sx = 58 + ((rnd() * 204) | 0), sy = 44 + ((rnd() * 40) | 0); p.r(sx, sy, 1, 3, C.yl2); p.r(sx - 1, sy + 1, 3, 1, C.yl2); }
    // escenario
    p.r(36, 88, 248, 22, '#6b4223'); p.r(36, 88, 248, 3, '#b87a42');
    for (x = 36; x < 284; x += 20) p.r(x, 91, 1, 19, '#4a2c16');
    p.dith(36, 91, 248, 19, C.ink, 4);
    p.r(30, 108, 260, 9, '#4a2c16'); p.r(30, 108, 260, 1, '#905a30');
    p.txt("FREDDY FAZBEAR'S PIZZA", 116, 110, C.yl3, 1);
    // piso del comedor
    p.r(0, 117, W, 63, '#1a1430');
    var r, c;
    for (r = 0; r < 6; r++) {
      var y0 = 117 + r * r * 1.7 + r * 5, y1 = 117 + (r + 1) * (r + 1) * 1.7 + (r + 1) * 5;
      for (c = -2; c < 22; c++) {
        var wdt = 14 + r * 3;
        var xx = Math.round(c * wdt - (r * 2));
        if ((r + c) % 2 === 0) p.r(xx, Math.round(y0), wdt, Math.round(y1 - y0), '#2a2250');
      }
    }
    p.dith(0, 117, W, 63, C.ink, 5);
    // cortinas y cenefa
    curtain(p, 0, 46, true); curtain(p, 274, 46, false);
    p.r(0, 0, W, 14, C.pu0); p.r(0, 12, W, 2, C.yl1);
    for (x = -4; x < W + 24; x += 22) { p.bell(x + 11, 14, 11, 8, C.pu1, C.pu0, 1); p.dith(x, 12, 22, 12, C.ink, 3); p.r(x + 9, 20, 4, 2, C.yl2); }
    // barra de luces
    p.r(70, 20, 180, 3, '#364158');
    [92, 128, 160, 192, 228].forEach(function (lx) { p.box(lx - 6, 22, 12, 8, '#222b3c', C.ink, 1); p.r(lx - 4, 28, 8, 2, '#ffe45c'); });
    // mesas de fiesta (primer plano)
    function table(tx, flip) {
      p.r(tx, 138, 64, 4, '#e8e0f0'); p.r(tx + 2, 142, 60, 22, '#b3182b');
      for (var k = 0; k < 6; k++) p.r(tx + 2 + k * 10, 142, 5, 22, '#e8e0f0');
      p.dith(tx + 2, 142, 60, 22, C.ink, 5);
      p.poly([tx + 14, 138, tx + 20, 120, tx + 26, 138], flip ? C.cy : C.pk); p.circ(tx + 20, 119, 2, C.wh);
      p.box(tx + 40, 128, 8, 10, C.wh, C.ink, 1); p.r(tx + 41, 131, 6, 2, C.rd3);
      p.poly([tx + 50, 138, tx + 54, 124, tx + 58, 138], C.yl2);
    }
    table(14, false); table(242, true);
    // consola de control (pista final)
    p.box(126, 134, 68, 28, '#364158', C.ink, 1); p.r(127, 135, 66, 2, '#7e90b0');
    for (i = 0; i < 6; i++) { p.r(134 + i * 9, 142, 3, 14, C.ink); p.r(133 + i * 9, 144 + (i * 5) % 8, 5, 3, i % 2 ? C.cy : C.yl3); }
    p.box(177, 140, 12, 12, C.rd2, C.ink, 1); p.r(179, 141, 8, 3, C.rd4);
    p.txt('SHOW', 130, 128, C.yl3, 1);
    p.grad(0, 164, W, 16, '#00000000', '#05030a', false);
  }

  SC.reg.stage = {
    paint: function (p, ctx) { stageBg(p, ctx); },
    frame: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0), i;
      var stage = st ? st.stage : 0;
      // focos
      var fl = Math.sin(t * 2) * 0.5 + 0.5;
      [[92, 0xff], [160, 0xff], [228, 0xff]].forEach(function (s, k) {
        var cx = s[0];
        var col = k === 1 ? '#fff6b0' : (k === 0 ? '#9a90ff' : '#ffd23a');
        p.poly([cx - 3, 28, cx + 3, 28, cx + 28 + Math.sin(t + k) * 4, 104, cx - 28 + Math.sin(t + k) * 4, 104], p.pat(col, 2 + Math.round(fl * 1.2)));
      });
      // banderines
      for (i = 0; i < 12; i++) {
        var bx = 62 + i * 16, sag = Math.sin(i / 11 * Math.PI) * 7, sw = Math.sin(t * 2 + i) * 1.5;
        p.line(bx, 48 + sag - 3, bx + 16, 48 + sag - 3 + (i < 5.5 ? 1 : -1), '#53627e', 1);
        p.poly([bx + 2, 48 + sag - 3, bx + 12, 48 + sag - 3, bx + 7 + sw, 48 + sag + 6], [C.rd3, C.yl3, C.cy, C.pk][i % 4]);
      }
      // animatrónicos con respiración sutil
      var bob = Math.sin(t * 2) > 0.7 ? 1 : 0;
      var blink = (Math.floor(t * 1.1) % 6 === 5) && (t * 1.1 % 1 < 0.15);
      var look = st ? { lx: (st.mx - 160) / 160, ly: (st.my - 60) / 120 } : { lx: 0, ly: 0 };
      var S = 0.78;
      SPR.body('bonnie', p.at(74, 22 + bob, S), { blink: blink, lx: look.lx, ly: look.ly });
      SPR.body('freddy', p.at(142, 22, S), { mic: true, blink: blink, lx: look.lx, ly: look.ly });
      SPR.body('chica', p.at(206, 22 + (1 - bob), S), { blink: blink, lx: look.lx, ly: look.ly });
      // Bonnie sale del escenario conforme aumenta el peligro
      lurk(ctx, 'bonnie', stage, t, [stage === 1 ? 16 : (stage === 2 ? 36 : 50), stage === 1 ? 118 : (stage === 2 ? 150 : 178), stage === 1 ? 0.36 : (stage === 2 ? 0.7 : 1.15)], null, '#ff4adf');
      camOverlay(ctx, t, 'CAM 1A', 'SHOW STAGE');
    }
  };
})(window);
