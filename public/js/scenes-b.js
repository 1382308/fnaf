/* scenes-b.js — Pirate Cove (noche 3), Cocina (4), Pasillo Oeste (5), Trastienda (6). */
(function (G) {
  'use strict';
  var C = PX.C, W = PX.W, H = PX.H, SC = G.SC, U = SC.util;

  function planks(p, x, y, w, h, c0, c1, c2, ph) {
    var yy, i;
    for (yy = 0, i = 0; yy < h; yy += ph, i++) {
      p.r(x, y + yy, w, ph, i % 2 ? c1 : c0);
      p.r(x, y + yy, w, 1, c2);
      var off = (i * 23) % 40;
      for (var xx = -off; xx < w; xx += 40) p.r(x + xx + 20, y + yy + 1, 1, ph - 1, c2);
    }
  }

  /* ====================================================== */
  /*  PIRATE COVE (noche 3)                                  */
  /* ====================================================== */
  function drawCurtain(p, x0, x1, t, mirror) {
    var w = x1 - x0;
    if (w <= 0) return;
    for (var x = 0; x < w; x += 5) {
      var d = mirror ? (w - x) : x, sway = Math.sin(t * 1.5 + d * 0.15) * 0.5 + 0.5;
      p.r(x0 + x, 20, 5, 90, (x / 5) % 2 ? C.pu0 : C.pu1);
      p.r(x0 + x + 1, 20, 1, 90, sway > 0.5 ? C.pu2 : C.pu1);
    }
    // estrellas blancas
    var rnd = PX.rng(mirror ? 3 : 9), n = Math.max(1, Math.floor(w / 9)), i;
    for (i = 0; i < n; i++) {
      var sx = x0 + 3 + ((rnd() * (w - 6)) | 0), sy = 26 + ((rnd() * 76) | 0);
      p.r(sx, sy, 1, 3, C.wh); p.r(sx - 1, sy + 1, 3, 1, C.wh);
    }
    p.dith(x0, 20, w, 90, C.ink, 4);
    p.r(mirror ? x0 : x1 - 2, 20, 2, 90, C.pu0);
    // brillo de la tela al borde de la abertura
    p.r(x0, 106, w, 4, C.pu0);
  }

  SC.reg.cove = {
    paint: function (p) {
      var x, i;
      p.r(0, 0, W, 112, '#171530');
      planks(p, 0, 0, W, 112, '#231b3d', '#1b1533', '#120d24', 14);
      p.dith(0, 0, W, 112, C.ink, 4);
      planks(p, 0, 112, W, 68, '#4a2c16', '#3b2414', '#2a180c', 11);
      p.dith(0, 112, W, 68, C.ink, 6);
      // interior de la cala
      p.box(80, 22, 160, 88, '#0f0c26', '#3d2e6b', 2);
      var rnd = PX.rng(21);
      for (i = 0; i < 26; i++) p.p(84 + ((rnd() * 152) | 0), 26 + ((rnd() * 50) | 0), i % 3 ? '#3d2e6b' : '#9a90ff');
      p.circ(210, 44, 9, '#f2f0ff'); p.circ(213, 42, 8, '#0f0c26');
      // mástil y vela rota de fondo
      p.r(158, 34, 3, 76, '#4a2c16');
      p.poly([161, 38, 196, 52, 188, 82, 161, 80], '#c9bfa0'); p.dith(161, 38, 35, 44, C.ink, 5);
      p.line(166, 48, 190, 60, '#8c8060', 1);
      p.r(80, 98, 160, 12, '#2a180c'); p.dith(80, 98, 160, 12, C.ink, 4);
      // varilla de la cortina + letrero
      p.r(70, 17, 180, 4, C.yl1); p.r(70, 17, 180, 1, C.yl3);
      p.circ(70, 19, 3, C.yl2); p.circ(250, 19, 3, C.yl2);
      p.box(110, 3, 100, 12, '#6b4223', C.ink, 1); p.r(111, 4, 98, 2, '#b87a42');
      p.txt('PIRATE COVE', 138, 7, C.yl3, 1);
      p.circ(120, 9, 2, C.wh); p.circ(200, 9, 2, C.wh);
      // plataforma
      p.r(60, 108, 200, 12, '#6b4223'); p.r(60, 108, 200, 2, '#b87a42'); p.dith(60, 110, 200, 10, C.ink, 5);
      // cartel "Sorry! Out of order"
      p.line(138, 112, 134, 120, '#c9bfa0', 1); p.line(182, 112, 186, 120, '#c9bfa0', 1);
      p.box(128, 120, 64, 26, '#e8e0f0', '#6b4223', 2);
      p.txt('SORRY!', 144, 123, C.rd3, 1); p.txt('OUT OF', 144, 130, C.n4, 1); p.txt('ORDER', 148, 137, C.n4, 1);
      p.r(131, 123, 4, 20, C.yl2); p.r(185, 123, 4, 20, C.yl2);
      // timón
      var wx = 36, wy = 58;
      p.circ(wx, wy, 24, '#2a180c');
      for (i = 0; i < 8; i++) { var a = i * Math.PI / 4; p.line(wx, wy, wx + Math.cos(a) * 22, wy + Math.sin(a) * 22, '#6b4223', 3); p.circ(wx + Math.cos(a) * 25, wy + Math.sin(a) * 25, 3, '#905a30'); }
      p.circ(wx, wy, 20, '#171530'); p.dith(wx - 20, wy - 20, 40, 40, C.ink, 4);
      for (i = 0; i < 8; i++) { var b = i * Math.PI / 4; p.line(wx, wy, wx + Math.cos(b) * 21, wy + Math.sin(b) * 21, '#905a30', 2); }
      p.circ(wx, wy, 20.5, 'rgba(0,0,0,0)');
      p.circ(wx, wy, 6, '#b87a42'); p.circ(wx, wy, 3, C.yl3);
      p.circ(wx, wy, 22, 'rgba(0,0,0,0)');
      // gancho de Foxy
      p.r(60, 56, 14, 4, '#4a2c16'); p.r(60, 56, 14, 1, '#905a30');
      p.line(67, 60, 67, 84, C.mt4, 3); p.line(67, 84, 63, 92, C.mt5, 3); p.line(63, 92, 58, 90, C.mt5, 2); p.line(58, 90, 58, 84, C.mt5, 2);
      p.poly([55, 80, 60, 84, 55, 86], C.mt5);
      // mapa
      p.box(256, 30, 46, 40, '#d8b878', '#6b4223', 1);
      p.dith(256, 30, 46, 40, '#8c6a3a', 4);
      p.line(262, 62, 270, 50, C.rd2, 1); p.line(270, 50, 280, 56, C.rd2, 1); p.line(280, 56, 290, 40, C.rd2, 1);
      p.r(288, 37, 2, 6, C.rd3); p.r(286, 39, 6, 2, C.rd3);
      p.ell(268, 40, 5, 3, '#6b8f4a'); p.ell(296, 62, 4, 3, '#6b8f4a');
      p.p(258, 32, C.mt4); p.p(300, 32, C.mt4);
      // baúl del tesoro
      p.box(254, 108, 48, 26, '#6b4223', C.ink, 1);
      p.r(254, 118, 48, 3, C.mt3); p.r(264, 108, 3, 26, C.mt3); p.r(289, 108, 3, 26, C.mt3);
      p.ell(278, 108, 24, 9, '#905a30'); p.r(254, 106, 48, 2, '#905a30');
      p.dith(254, 108, 48, 26, C.ink, 4);
      p.box(274, 114, 8, 8, C.yl2, C.ink, 1); p.r(277, 117, 2, 3, C.ink);
      for (i = 0; i < 9; i++) { p.circ(258 + i * 5 + (i % 2) * 2, 134 + (i % 3), 2, i % 2 ? C.yl2 : C.yl3); }
      p.grad(0, 164, W, 16, '#00000000', '#05030a', false);
    },
    frame: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0), stage = st ? st.stage : 0;
      var slit = [0, 6, 30, 80][stage];
      var cl = 160 - slit / 2, cr = 160 + slit / 2;
      // Foxy detrás de la cortina
      if (stage === 1) U.lurk(ctx, 'foxy', 1, t, [160, 112, 0.7], [80, 22, 160, 88]);
      else if (stage === 2) {
        ctx.save(); ctx.beginPath(); ctx.rect(80, 22, 160, 88); ctx.clip();
        SPR.body('foxy', p.at(126, 34, 0.7), { lx: (st.mx - 160) / 160, ly: (st.my - 60) / 120 });
        p.dith(80, 22, 160, 88, C.ink, 5);
        ctx.restore();
      } else if (stage >= 3) {
        var jig = Math.round(Math.sin(t * 40) * 1.5);
        SPR.body('foxy', p.at(112 + jig, 30, 0.98), { mouth: 0.9, angry: true });
      }
      drawCurtain(p, 80, cl, t, false);
      drawCurtain(p, cr, 240, t, true);
      // cartel que se mece
      var sw = Math.round(Math.sin(t * 1.7) * 1.4);
      if (sw !== 0) p.r(127 + (sw > 0 ? 0 : 0), 119, 1, 1, '#6b4223');
      U.cam(ctx, t, 'CAM 1C', 'PIRATE COVE');
      if (stage >= 3 && Math.floor(t * 6) % 2 === 0) p.txt('!!! CORRE !!!', 126, 26, C.rd3, 1);
    }
  };

  /* ====================================================== */
  /*  COCINA (noche 4) — solo audio + linterna                */
  /* ====================================================== */
  SC.reg.kitchen = {
    dark: true,
    paint: function (p) {
      var x, y, i;
      // pared de azulejos
      p.r(0, 0, W, 104, '#53627e');
      for (y = 0; y < 104; y += 10) for (x = (y / 10 % 2) * 5; x < W; x += 10) {
        p.r(x, y, 9, 9, ((x / 10 + y / 10) | 0) % 3 ? '#7e90b0' : '#8c9ec0');
        p.r(x, y, 9, 1, '#aebfd8');
      }
      p.dith(0, 0, W, 104, C.ink, 4);
      // puerta de vaivén (al comedor)
      p.box(104, 28, 40, 76, '#222b3c', C.ink, 2);
      p.r(110, 36, 28, 52, '#0a0714'); p.r(112, 40, 24, 8, '#1b1436');
      p.r(106, 30, 36, 2, '#53627e');
      // campana extractora
      p.poly([150, 4, 232, 4, 240, 26, 142, 26], '#7e90b0'); p.dith(142, 4, 98, 22, C.ink, 5);
      p.r(142, 24, 98, 3, '#aebfd8');
      // barra con ollas
      p.r(16, 20, 68, 3, '#aebfd8');
      p.line(24, 23, 24, 28, C.mt3, 1); p.line(46, 23, 46, 28, C.mt3, 1); p.line(70, 23, 70, 28, C.mt3, 1);
      p.box(16, 28, 18, 16, '#53627e', C.ink, 1); p.r(18, 28, 14, 3, '#364158'); p.r(16, 32, 3, 4, '#222b3c'); p.r(31, 32, 3, 4, '#222b3c'); p.r(19, 34, 3, 8, '#98a8c0');
      p.circ(54, 38, 11, C.ink); p.circ(54, 38, 9.5, '#364158'); p.circ(54, 38, 6, '#222b3c'); p.line(54, 49, 54, 56, C.mt3, 2);
      p.box(64, 26, 16, 20, '#7e90b0', C.ink, 1); p.r(66, 28, 4, 16, '#aebfd8'); p.r(62, 30, 3, 3, C.ink);
      // mesón
      p.r(0, 104, W, 8, '#aebfd8'); p.r(0, 104, W, 2, '#e8e8f0'); p.r(0, 110, W, 2, '#53627e');
      p.r(0, 112, W, 40, '#364158');
      for (x = 0; x < W; x += 40) { p.r(x, 112, 1, 40, '#222b3c'); p.r(x + 15, 126, 10, 2, '#7e90b0'); }
      p.dith(0, 112, W, 40, C.ink, 5);
      // estufa + sartén
      p.box(90, 98, 56, 8, '#141a26', C.ink, 1); p.circ(104, 100, 6, '#364158'); p.circ(130, 100, 6, '#364158');
      p.ell(116, 94, 22, 6, C.ink); p.ell(116, 93, 20, 5, '#364158'); p.ell(116, 93, 14, 3, '#222b3c');
      p.line(137, 91, 150, 86, '#222b3c', 3);
      p.circ(112, 93, 2, C.yl2); p.circ(118, 92, 2, C.wh); p.circ(122, 94, 2, C.yl3);
      // horno
      p.box(150, 112, 70, 40, '#53627e', C.ink, 1);
      p.r(152, 114, 66, 4, '#7e90b0');
      for (i = 0; i < 4; i++) p.circ(162 + i * 14, 109, 2.5, '#98a8c0');
      p.box(158, 122, 54, 24, '#141a26', C.ink, 1); p.r(160, 124, 50, 20, '#2e060c'); p.dith(160, 124, 50, 20, C.rd2, 3);
      p.r(156, 120, 58, 2, '#aebfd8');
      // babero de Chica colgado
      p.r(228, 32, 6, 3, '#53627e');
      p.poly([222, 36, 240, 36, 244, 70, 218, 70], C.ink);
      p.poly([223, 37, 239, 37, 243, 69, 219, 69], C.wh);
      p.txt('LETS', 225, 46, C.pu1, 1); p.txt('EAT', 225, 53, C.pu1, 1); p.r(225, 62, 14, 1, C.pk);
      // refrigerador
      p.box(250, 18, 62, 134, '#7e90b0', C.ink, 2);
      p.r(252, 20, 58, 3, '#aebfd8');
      p.r(251, 86, 60, 3, '#364158');
      p.box(256, 38, 4, 30, '#364158', C.ink, 1); p.box(256, 96, 4, 40, '#364158', C.ink, 1);
      p.dith(252, 24, 58, 126, C.ink, 4);
      p.box(278, 44, 8, 8, C.rd3, C.ink, 1); p.box(292, 58, 8, 8, C.yl2, C.ink, 1);
      // piso
      for (y = 152; y < H; y += 10) for (x = ((y / 10) % 2) * 10; x < W; x += 20) p.r(x, y, 10, 10, '#1b1436');
      p.r(0, 152, W, 28, 'rgba(0,0,0,0)');
      p.dith(0, 152, W, 28, C.ink, 6);
    },
    frame: function (ctx, t, st) { /* la cocina vive en la oscuridad */ },
    /* anillos de sonido que delatan las pistas pendientes, dibujados sobre la oscuridad */
    overlay: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0), stage = st ? st.stage : 0;
      // ojos de Chica en la puerta
      if (stage >= 1) U.lurk(ctx, 'chica', stage === 1 ? 1 : 1, t, [124, 100, 0.7], [104, 28, 40, 76]);
      if (stage >= 2) {
        var pulse = 0.5 + 0.5 * Math.sin(t * 3);
        p.ell(124, 70, 22 + pulse * 3, 10, p.pat('#ff4adf', 2));
        U.lurk(ctx, 'chica', 1, t, [124, 100, 0.7], [104, 28, 40, 76]);
        // la silueta se acerca por el mesón
        if (stage >= 3) { var q = U.sil('chica', 1.0); ctx.drawImage(q, 112, 70); U.lurk(ctx, 'chica', 1, t, [136, 182, 1.0]); }
      }
      // barra de audio
      p.r(W - 150, H - 12, 146, 10, 'rgba(0,0,0,0.7)');
      p.txt('CAM 6 AUDIO ONLY', W - 146, H - 10, C.wh, 1);
      for (var i = 0; i < 14; i++) {
        var hh = 1 + Math.abs(Math.sin(t * 7 + i * 0.9) * Math.sin(t * 2.3 + i * 0.37)) * 7;
        p.r(W - 80 + i * 5, H - 7 - hh / 2, 3, Math.max(1, hh), stage >= 2 ? C.pk : C.gr3);
      }
    }
  };

  /* ====================================================== */
  /*  PASILLO OESTE (noche 5) — perspectiva                   */
  /* ====================================================== */
  var VPX = 160, VPY = 84;
  function wallPt(side, x, v) {   // x en coordenadas del lado izquierdo (0..128)
    var yt = 0.525 * x, yb = 180 - 0.6 * x;
    var y = yb - v * (yb - yt);
    return [side < 0 ? x : 320 - x, y];
  }
  function wallQuad(side, x1, x2, v1, v2) {
    var a = wallPt(side, x1, v1), b = wallPt(side, x2, v1), c = wallPt(side, x2, v2), d = wallPt(side, x1, v2);
    return [a[0], a[1], b[0], b[1], c[0], c[1], d[0], d[1]];
  }

  SC.reg.hall = {
    paint: function (p) {
      var i, z, c, k;
      p.r(0, 0, W, H, C.ink);
      // sala del fondo (brillante, para que se vean las siluetas)
      p.r(128, 67, 64, 36, '#6a5fd4');
      p.grad(128, 67, 64, 36, '#9a90ff', '#4a3fb0', false);
      p.r(140, 72, 40, 31, '#c4beff'); p.dith(140, 72, 40, 31, '#6a5fd4', 6);
      p.r(128, 100, 64, 3, '#2a1f4d');
      // techo
      p.poly([0, 0, 320, 0, 192, 67, 128, 67], '#16112b');
      p.dith(0, 0, W, 67, C.ink, 5);
      // paredes
      p.poly([0, 0, 128, 67, 128, 103, 0, 180], '#2f2a49');
      p.poly([320, 0, 192, 67, 192, 103, 320, 180], '#2f2a49');
      // zócalo y listones (en perspectiva)
      [-1, 1].forEach(function (side) {
        p.poly(wallQuad(side, 0, 128, 0, 0.16), '#1b1436');
        p.poly(wallQuad(side, 0, 128, 0.16, 0.18), '#53627e');
        for (z = 1.4; z < 5; z += 0.45) {
          var xx = 160 - 160 / z;
          var a = wallPt(side, xx, 0), b = wallPt(side, xx, 1);
          p.line(a[0], a[1], b[0], b[1], '#241f38', 1);
        }
        p.dith(side < 0 ? 0 : 192, 0, 128, 180, C.ink, 3);
      });
      // piso en perspectiva
      var zs = [1, 1.25, 1.55, 1.9, 2.35, 2.9, 3.6, 5];
      for (i = 0; i < zs.length - 1; i++) {
        var y0 = VPY + 96 / zs[i + 1], y1 = VPY + 96 / zs[i];
        for (c = -9; c < 9; c++) {
          var q0 = 40 / zs[i + 1], q1 = 40 / zs[i];
          p.poly([VPX + c * q0, y0, VPX + (c + 1) * q0, y0, VPX + (c + 1) * q1, y1, VPX + c * q1, y1], (i + c) % 2 ? '#241d44' : '#12102a');
        }
      }
      p.dith(0, 103, W, 77, C.ink, 4);
      // lámparas del techo (base)
      [[1.7, 2.1], [2.8, 3.2], [4, 4.4]].forEach(function (zz) {
        var z1 = zz[0], z2 = zz[1];
        p.poly([VPX - 36 / z1, VPY - 84 / z1, VPX + 36 / z1, VPY - 84 / z1, VPX + 36 / z2, VPY - 84 / z2, VPX - 36 / z2, VPY - 84 / z2], '#98a8c0');
      });
      // puerta del almacén (pared izquierda)
      p.poly(wallQuad(-1, 8, 60, 0, 0.82), C.ink);
      p.poly(wallQuad(-1, 10, 58, 0.02, 0.8), '#364158');
      p.poly(wallQuad(-1, 14, 54, 0.1, 0.72), '#222b3c');
      var tb = wallPt(-1, 34, 0.62);
      p.box(Math.round(tb[0]) - 14, Math.round(tb[1]) - 2, 28, 8, '#e8e0f0', C.ink, 1);
      p.txt('CLOSET', Math.round(tb[0]) - 12, Math.round(tb[1]), C.rd2, 1);
      var kn = wallPt(-1, 52, 0.4);
      p.circ(kn[0], kn[1], 2, C.yl3);
      // caja de breakers (pared izquierda, lejos)
      p.poly(wallQuad(-1, 84, 108, 0.32, 0.62), C.ink);
      p.poly(wallQuad(-1, 85, 107, 0.34, 0.6), '#53627e');
      var br = wallPt(-1, 96, 0.47);
      p.r(br[0] - 4, br[1] - 4, 8, 8, '#141a26'); p.r(br[0] - 1, br[1] - 3, 2, 4, C.rd3); p.r(br[0] - 3, br[1] + 1, 6, 1, C.yl3);
      // póster (pared derecha)
      p.poly(wallQuad(1, 16, 58, 0.4, 0.78), C.ink);
      p.poly(wallQuad(1, 17, 57, 0.42, 0.76), '#e8e0f0');
      var pc = wallPt(1, 38, 0.66);
      p.r(pc[0] - 12, pc[1] - 3, 24, 5, C.pu1); p.txt('PARTY', pc[0] - 10, pc[1] - 3, C.yl3, 1);
      var pf = wallPt(1, 38, 0.52);
      p.circ(pf[0] - 8, pf[1], 4, C.fr2); p.circ(pf[0], pf[1] + 1, 3.4, C.bn2); p.circ(pf[0] + 8, pf[1], 4, C.yl2);
      // panel del interruptor de luz (pared derecha, lejos)
      p.poly(wallQuad(1, 84, 108, 0.45, 0.75), C.ink);
      p.poly(wallQuad(1, 85, 107, 0.47, 0.73), '#364158');
      var lp = wallPt(1, 96, 0.6);
      p.box(lp[0] - 3, lp[1] - 5, 6, 10, C.yl2, C.ink, 1); p.r(lp[0] - 2, lp[1] - 4, 4, 3, C.yl4);
      // cartel de piso mojado
      p.poly([120, 128, 136, 128, 142, 160, 114, 160], C.ink);
      p.poly([121, 130, 135, 130, 140, 158, 116, 158], C.yl2);
      p.poly([123, 132, 133, 132, 137, 156, 119, 156], C.yl3);
      p.circ(128, 138, 2, C.ink); p.r(127, 140, 2, 8, C.ink); p.r(124, 150, 8, 2, C.ink);
      p.dith(114, 128, 28, 32, C.ink, 3);
      p.ell(128, 162, 18, 3, p.pat(C.ink, 6));
      p.grad(0, 164, W, 16, '#00000000', '#05030a', false);
    },
    frame: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0), stage = st ? st.stage : 0;
      // lámparas parpadeando
      var seeds = [t * 11, t * 7 + 2, t * 5 + 4];
      [[1.7, 2.1], [2.8, 3.2], [4, 4.4]].forEach(function (zz, i) {
        var on = Math.sin(seeds[i] * 3.1) + Math.sin(seeds[i] * 1.3) > -1.2;
        var z1 = zz[0], z2 = zz[1];
        p.poly([VPX - 30 / z1, VPY - 84 / z1 + 1, VPX + 30 / z1, VPY - 84 / z1 + 1, VPX + 30 / z2, VPY - 84 / z2 + 1, VPX - 30 / z2, VPY - 84 / z2 + 1], on ? '#e8fff0' : '#3d4a44');
        if (!on) p.dith(0, 0, W, 180, C.ink, 2);
      });
      // Bonnie al fondo
      if (stage === 1) U.lurk(ctx, 'bonnie', 1, t, [160, 103, 0.3]);
      else if (stage === 2) U.lurk(ctx, 'bonnie', 2, t, [160, 104, 0.5]);
      else if (stage >= 3) { U.lurk(ctx, 'bonnie', 3, t, [160 + Math.round(Math.sin(t * 30)), 150, 1.0]); }
    }
  };
  SC.wall = { pt: wallPt, quad: wallQuad };

  /* ====================================================== */
  /*  TRASTIENDA (noche 6)                                    */
  /* ====================================================== */
  function endo(p, cx, top, t) {
    var sw = Math.round(Math.sin(t * 1.2) * 1);
    // cuerda
    p.r(cx - 1, 6, 2, top + 6, C.mt2);
    // cráneo
    p.bell(cx, top + 16, 15, 14, C.mt3, C.ink, 1);
    p.ell(cx - 5, top + 9, 6, 3, p.pat(C.mt5, 8));
    p.r(cx - 10, top + 16, 8, 7, C.ink); p.r(cx + 2, top + 16, 8, 7, C.ink);
    p.r(cx - 7, top + 18, 3, 3, C.rd3); p.r(cx + 5, top + 18, 3, 3, C.rd3);
    p.r(cx - 7, top + 26, 14, 8, C.mt3); for (var i = 0; i < 6; i++) p.r(cx - 6 + i * 2, top + 28, 1, 6, C.ink);
    p.r(cx - 5, top + 33, 10, 3, C.mt2);
    // columna y costillas
    p.r(cx - 2, top + 36, 4, 40, C.mt3);
    for (i = 0; i < 4; i++) { p.line(cx - 2, top + 40 + i * 7, cx - 16 + i, top + 42 + i * 7, C.mt4, 3); p.line(cx + 2, top + 40 + i * 7, cx + 16 - i, top + 42 + i * 7, C.mt4, 3); }
    p.box(cx - 10, top + 74, 20, 8, C.mt2, C.ink, 1);
    // brazos y piernas
    p.line(cx - 15, top + 42, cx - 22 + sw, top + 60, C.mt4, 3); p.line(cx - 22 + sw, top + 60, cx - 20 + sw, top + 74, C.mt3, 3);
    p.line(cx + 15, top + 42, cx + 22 + sw, top + 60, C.mt4, 3); p.line(cx + 22 + sw, top + 60, cx + 20 + sw, top + 74, C.mt3, 3);
    p.line(cx - 6, top + 82, cx - 8, top + 100, C.mt4, 4); p.line(cx + 6, top + 82, cx + 8, top + 100, C.mt4, 4);
    p.circ(cx - 22 + sw, top + 60, 3, C.mt5); p.circ(cx + 22 + sw, top + 60, 3, C.mt5);
  }

  SC.reg.backstage = {
    paint: function (p) {
      var x, y, i;
      p.r(0, 0, W, 130, '#2b3550');
      for (x = 0; x < W; x += 16) p.r(x, 0, 1, 130, '#222b3c');
      p.dith(0, 0, W, 130, C.ink, 4);
      // panel perforado
      for (y = 22; y < 80; y += 8) for (x = 160; x < 310; x += 8) p.p(x, y, '#141a26');
      // piso
      p.r(0, 130, W, 50, '#364158'); planks(p, 0, 130, W, 50, '#2c3548', '#242d40', '#1b2230', 10); p.dith(0, 130, W, 50, C.ink, 5);
      // puerta oscura (izquierda)
      p.box(0, 38, 38, 94, '#05030a', '#53627e', 2); p.r(0, 38, 38, 3, '#7e90b0');
      p.poly([0, 41, 36, 41, 36, 128, 0, 128], '#0a0714');
      // estantes
      p.box(44, 74, 108, 6, '#6b4223', C.ink, 1); p.r(44, 74, 108, 1, '#b87a42');
      p.box(188, 74, 118, 6, '#6b4223', C.ink, 1); p.r(188, 74, 118, 1, '#b87a42');
      p.r(50, 80, 3, 12, '#4a2c16'); p.r(144, 80, 3, 12, '#4a2c16'); p.r(194, 80, 3, 12, '#4a2c16'); p.r(298, 80, 3, 12, '#4a2c16');
      // letrero
      p.box(100, 12, 120, 14, '#e8e0f0', C.ink, 1); p.r(100, 12, 120, 3, C.rd2);
      p.txt('PARTS / SERVICE', 128, 18, C.n3, 1);
      // mesa de trabajo
      p.r(40, 138, 272, 6, '#6b4223'); p.r(40, 138, 272, 2, '#b87a42');
      p.r(44, 144, 264, 36, '#4a2c16'); p.dith(44, 144, 264, 36, C.ink, 5);
      for (x = 60; x < 300; x += 66) p.box(x, 150, 40, 22, '#6b4223', '#2a180c', 1);
      // herramientas en la mesa
      p.r(60, 130, 18, 3, C.mt4); p.r(60, 130, 4, 8, C.rd2);
      p.box(96, 130, 14, 8, C.rd2, C.ink, 1); p.r(98, 128, 10, 2, C.mt4);
      p.r(130, 133, 20, 5, C.mt3); p.circ(135, 134, 3, C.mt4); p.circ(145, 134, 2, C.mt5);
      // terminal
      p.box(260, 106, 42, 32, '#364158', C.ink, 1);
      p.r(264, 110, 34, 22, C.gr0);
      p.r(270, 138, 22, 3, '#222b3c');
      // cajas apiladas
      p.box(206, 120, 24, 18, '#905a30', C.ink, 1); p.r(206, 126, 24, 2, '#6b4223');
      p.box(184, 124, 18, 14, '#b87a42', C.ink, 1);
      p.box(116, 112, 28, 26, '#905a30', C.ink, 1); p.r(116, 122, 28, 2, '#6b4223'); p.txt('PARTS', 120, 114, C.ink, 1);
      p.grad(0, 164, W, 16, '#00000000', '#05030a', false);
      p.dith(0, 0, 6, 180, C.ink, 8); p.dith(314, 0, 6, 180, C.ink, 8);
    },
    frame: function (ctx, t, st) {
      var p = new PX.Pen(ctx, 1, 0, 0), stage = st ? st.stage : 0, i;
      var mx = st ? st.mx : 160, my = st ? st.my : 80;
      endo(p, 168, 24, t);
      // cabezas de repuesto: los ojos siguen al cursor
      var heads = [['freddy', 48, 38], ['bonnie', 96, 36], ['chica', 196, 38], ['foxy', 248, 36]];
      var blink = (Math.floor(t * 0.9) % 6 === 5) && (t * 0.9 % 1 < 0.14);
      heads.forEach(function (h) {
        var hx = h[1] + 18, hy = h[2] + 18;
        var lx = Math.max(-1, Math.min(1, (mx - hx) / 90)), ly = Math.max(-1, Math.min(1, (my - hy) / 60));
        SPR.head(h[0], p.at(h[1], h[2] - 4, 0.75), { lx: lx, ly: ly, blink: blink });
      });
      // foco colgante
      var bx = 160 + Math.sin(t * 1.3) * 3;
      p.r(Math.round(bx), 0, 1, 8, C.mt2);
      p.circ(bx, 11, 3, '#fff6b0');
      // Freddy en la puerta
      lurk(stage, t);
      function lurk(s, tt) {
        if (s === 1) U.lurk(ctx, 'freddy', 1, tt, [19, 128, 0.7], [0, 40, 38, 90]);
        else if (s === 2) U.lurk(ctx, 'freddy', 2, tt, [19, 128, 0.78], [0, 40, 38, 90]);
        else if (s >= 3) U.lurk(ctx, 'freddy', 3, tt, [30 + Math.round(Math.sin(tt * 30)), 176, 1.05]);
      }
      p.dith(0, 0, 14, 180, C.ink, 8);
    }
  };
})(window);
