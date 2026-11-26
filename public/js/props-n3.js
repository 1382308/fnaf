/* props-n3.js — Noche 3 (Pirate Cove): puente de mando, cubierta, cala de Foxy, camarote, bodega y calabozo.
   Mismo estilo que props-a/b/c/n2: vista 3/4, contorno de tinta, luz arriba-izquierda y sombra abajo-derecha. */
(function (G) {
  'use strict';
  var C = PX.C, A = G.PROPS_API, reg = A.reg, dec = A.dec, sb = A.sb;
  var WD = ['#7a5530', '#b08050', '#3e2814'];       // madera: base, luz, sombra
  var BR = ['#d8a820', '#fff0a0', '#7a5a0c'];       // latón y oro
  var IR = ['#46526a', '#8a98b0', '#222b3c'];       // hierro
  var RP = ['#c8a868', '#e8d098', '#7a6030'];       // cuerda
  var SL = ['#d8ccaa', '#efe6cc', '#a89c78'];       // lona
  var PU = ['#5a2a9a', '#8a4ad0', '#2e1458'];       // terciopelo morado

  /* cuerda de un trazo (con sombra) */
  function rope(p, x0, y0, x1, y1) { p.line(x0, y0 + 1, x1, y1 + 1, RP[2], 1); p.line(x0, y0, x1, y1, RP[0], 1); }
  /* destello en cruz */
  function spark(p, x, y, col) { p.r(x - 1, y, 3, 1, col); p.r(x, y - 1, 1, 3, col); }
  /* llama que titila (x, y = base) */
  function flame(p, x, y, t, k) {
    var f = Math.sin(t * 11 + k), h = 5 + Math.sin(t * 7 + k * 2);
    p.poly([x - 2, y, x + 2, y, x + 1 + f * 0.6, y - h, x + f * 0.8, y - h - 2], '#ff9a2e');
    p.poly([x - 1, y, x + 1, y, x + f * 0.4, y - h + 2], '#ffe45c'); p.p(x, y - 1, '#ffffff');
  }
  /* farol de mano de 8 x 12 (esquina superior izquierda en x, y) */
  function lantern(p, x, y, on) {
    p.r(x + 2, y, 4, 2, C.ink); p.r(x + 3, y - 1, 2, 1, IR[1]);
    p.r(x, y + 2, 8, 9, C.ink); p.r(x + 1, y + 3, 6, 7, on ? '#ffe9a0' : '#7a6a40'); p.r(x + 1, y + 3, 6, 1, on ? '#ffffff' : '#a89868');
    p.r(x + 3, y + 3, 1, 7, IR[0]); p.r(x, y + 10, 8, 2, IR[0]); p.r(x, y + 10, 8, 1, IR[1]);
  }
  /* hacia dónde está el jugador (-1..1): lo siguen con la mirada */
  function gaze(inst, st, cx, cy) {
    var dx = (st ? st.px : 0) - (inst.x + cx), dy = (st ? st.py : 0) - 12 - (inst.y + cy), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 40);
    return { x: dx / d * k, y: dy / d * k };
  }

  /* ====================== CUBIERTA ====================== */
  /* mástil con vela con la calavera, cofa, jarcias y farol; la vela respira y la bandera ondea */
  reg('mast', 72, 120, 2, 1, function (p) {
    var i, f;
    p.ell(36, 114, 16, 4, 'rgba(0,0,0,0.3)');
    [-1, 1].forEach(function (d) {                                                    // obenques con escalones
      var xt = 36 + d * 3, xa = 36 + d * 30, xb = 36 + d * 21;
      p.line(xt, 30, xa, 112, RP[2], 1); p.line(xt, 30, xb, 112, RP[0], 1);
      for (i = 0; i < 6; i++) { f = (i + 1) / 7; p.line(xt + (xa - xt) * f, 30 + 82 * f, xt + (xb - xt) * f, 30 + 82 * f, RP[1], 1); }
    });
    p.r(32, 6, 8, 104, C.ink); p.r(33, 6, 6, 104, WD[0]); p.r(33, 6, 2, 104, WD[1]); p.r(38, 6, 1, 104, WD[2]);
    p.r(33, 38, 6, 2, IR[0]); p.r(33, 38, 6, 1, IR[1]); p.r(33, 64, 6, 2, IR[0]); p.r(33, 64, 6, 1, IR[1]);
    p.ell(36, 11, 11, 3.6, C.ink); p.r(25, 11, 22, 8, C.ink); p.ell(36, 19, 11, 3.6, C.ink);                // cofa
    p.r(26, 11, 20, 8, WD[0]); p.r(26, 11, 20, 1, WD[1]); for (i = 0; i < 5; i++) p.r(29 + i * 4, 12, 1, 7, WD[2]);
    p.ell(36, 11, 9.4, 2.8, '#241408'); p.r(26, 18, 20, 1, WD[2]);
    p.r(4, 21, 64, 5, C.ink); p.r(5, 22, 62, 3, WD[0]); p.r(5, 22, 62, 1, WD[1]); p.r(5, 24, 62, 1, WD[2]); p.r(2, 22, 3, 3, C.ink); p.r(67, 22, 3, 3, C.ink);   // verga
    p.poly([6, 25, 66, 25, 63, 74, 9, 74], C.ink); p.poly([7, 26, 65, 26, 62, 73, 10, 73], SL[0]);                 // vela
    p.dith(44, 26, 21, 47, SL[2], 6); p.ell(30, 50, 14, 22, p.pat(SL[1], 7)); p.r(8, 26, 2, 46, SL[1]);
    for (i = 0; i < 3; i++) p.r(21 + i * 14, 26, 1, 47, SL[2]);
    for (i = 0; i < 12; i++) p.poly([9 + i * 4.4, 72, 13 + i * 4.4, 72, 11 + i * 4.4, 75 + (i * 5) % 4], SL[i % 2 ? 2 : 0]);   // borde deshilachado
    p.r(14, 56, 8, 6, '#8a7a58'); p.r(14, 56, 8, 1, SL[1]); p.line(14, 59, 21, 59, SL[2], 1);                        // parche y agujeros
    p.r(46, 32, 4, 3, '#2a2a38'); p.r(52, 60, 3, 4, '#2a2a38'); p.r(18, 38, 3, 2, '#2a2a38');
    p.line(26, 38, 46, 57, '#1a1a28', 2); p.line(46, 38, 26, 57, '#1a1a28', 2);                                   // huesos cruzados
    p.circ(26, 38, 1.6, '#1a1a28'); p.circ(46, 38, 1.6, '#1a1a28'); p.circ(26, 57, 1.6, '#1a1a28'); p.circ(46, 57, 1.6, '#1a1a28');
    p.circ(36, 44, 7, '#1a1a28'); p.r(32, 48, 8, 5, '#1a1a28'); p.r(32, 42, 3, 3, SL[0]); p.r(38, 42, 3, 3, SL[0]); p.p(36, 47, SL[0]);
    p.r(33, 51, 1, 2, SL[0]); p.r(36, 51, 1, 2, SL[0]); p.r(39, 51, 1, 2, SL[0]);
    p.r(24, 104, 24, 8, C.ink); p.r(25, 105, 22, 6, WD[0]); p.r(25, 105, 22, 1, WD[1]);                            // pasamanos de cabillas
    for (i = 0; i < 5; i++) { p.r(27 + i * 4, 102, 2, 5, WD[1]); p.r(27 + i * 4, 102, 2, 1, BR[1]); }
    p.ell(18, 112, 7, 3, C.ink); p.ell(18, 111, 6, 2.4, RP[0]); p.ell(18, 111, 3, 1, RP[2]); p.ell(54, 112, 7, 3, C.ink); p.ell(54, 111, 6, 2.4, RP[0]); p.ell(54, 111, 3, 1, RP[2]);
    lantern(p, 44, 76, true); p.line(40, 74, 47, 76, IR[0], 1);
  }, {
    light: { dx: 48, dy: 86, r: 58, col: '#ffc880', flick: 0.5 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, w = Math.sin(t * 1.4) * 1.2;
      for (i = 0; i < 11; i++) p.r(37 + i, 2 + Math.round(Math.sin(t * 5 - i * 0.7) * 1.5) + (i >> 2), 1, 5 - (i >> 1), i % 3 ? '#c4283c' : '#ff6070');   // banderola
      p.r(37, 1, 2, 6, C.ink);
      p.r(10 + ((t * 7) % 52 | 0), 27, 1, 44, 'rgba(255,255,240,0.2)');
      p.ell(36, 72 + w, 24, 1.6, 'rgba(0,0,0,0.12)');
      p.r(45, 78 + (Math.sin(t * 3) > 0.4 ? 1 : 0), 6, 7, 'rgba(255,224,140,0.5)');
    }
  });

  /* cañón de hierro sobre cureña. v: r apunta a la derecha, l a la izquierda */
  reg('cannon', 52, 32, 3, 1, function (p, o) {
    var i, left = o.v === 'l';
    if (left) { p.c.save(); p.c.translate(2 * p.ox + 52, 0); p.c.scale(-1, 1); }
    p.ell(26, 29, 24, 3, 'rgba(0,0,0,0.3)');
    p.poly([5, 20, 35, 20, 37, 27, 5, 27], C.ink); p.poly([6, 20, 34, 20, 36, 26, 6, 26], WD[0]); p.r(6, 20, 29, 1, WD[1]); p.r(6, 25, 30, 1, WD[2]);   // cureña
    p.r(10, 16, 6, 6, C.ink); p.r(11, 17, 4, 5, WD[0]); p.r(25, 16, 6, 6, C.ink); p.r(26, 17, 4, 5, WD[0]);
    p.poly([9, 8, 40, 9, 49, 11, 49, 18, 40, 19, 9, 20], C.ink); p.poly([10, 9, 40, 10, 48, 12, 48, 17, 40, 18, 10, 19], '#3c4252');   // caña
    p.r(11, 9, 36, 2, '#7a8498'); p.r(11, 17, 36, 1, '#1c2030'); p.r(15, 9, 2, 10, '#222834'); p.r(30, 9, 2, 10, '#222834'); p.r(38, 10, 2, 8, '#5a6478');
    p.r(44, 11, 5, 7, '#58627a'); p.r(44, 11, 5, 1, '#9aa6be'); p.r(48, 13, 1, 3, '#05030a');
    p.circ(7, 14, 2.6, C.ink); p.circ(7, 14, 1.8, '#3c4252'); p.p(6, 13, '#7a8498'); p.p(20, 8, '#05030a');
    [[11, 25], [32, 25]].forEach(function (w) {
      p.circ(w[0], w[1] - 3, 6.6, C.ink); p.circ(w[0], w[1] - 3, 5.6, WD[0]); p.circ(w[0], w[1] - 3, 3.6, WD[2]); p.circ(w[0], w[1] - 3, 1.6, IR[1]);
      p.line(w[0] - 5, w[1] - 3, w[0] + 5, w[1] - 3, WD[1], 1); p.line(w[0], w[1] - 8, w[0], w[1] + 2, WD[1], 1);
    });
    p.line(8, 17, 14, 24, RP[0], 1); p.line(8, 18, 14, 25, RP[2], 1);
    for (i = 0; i < 3; i++) { var bx = 41 + i * 4 - (i === 2 ? 2 : 0), by = i === 2 ? 22 : 26; p.circ(bx, by, 2.6, C.ink); p.circ(bx, by, 1.8, '#2a2e3a'); p.p(bx - 1, by - 1, '#7a8498'); }
    if (left) p.c.restore();
  });

  /* barril de pie. v: a ron · b agua · c pólvora */
  reg('barrelR', 18, 28, 1, 1, function (p, o) {
    var v = o.v || 'a', b = v === 'b' ? ['#4a6a98', '#7a9ac8', '#223656'] : v === 'c' ? ['#2c2c38', '#5a5a6c', '#101018'] : ['#8a5a30', '#c08a50', '#4a2c14'];
    p.ell(9, 25, 8, 3, C.ink); p.r(1, 6, 16, 19, C.ink); p.ell(9, 6, 8, 3, C.ink);
    p.r(2, 6, 14, 18, b[0]); p.ell(9, 24, 7, 2.4, b[0]); p.r(2, 6, 4, 18, b[1]); p.r(13, 6, 3, 18, b[2]);
    for (var i = 0; i < 3; i++) p.r(6 + i * 3, 7, 1, 17, b[2]);
    p.ell(9, 6, 7, 2.6, b[1]); p.ell(9, 6, 5.4, 1.8, b[0]); p.p(9, 6, C.ink);
    p.r(1, 10, 16, 2, IR[0]); p.r(1, 10, 16, 1, IR[1]); p.r(1, 20, 16, 2, IR[0]); p.r(1, 20, 16, 1, IR[1]);
    if (v === 'a') { p.r(4, 13, 10, 6, '#e8e0f0'); p.r(4, 13, 10, 1, '#fff'); p.txt('RON', 5, 14, '#b3182b', 1); p.r(14, 17, 3, 2, BR[0]); }
    else if (v === 'b') { p.r(4, 13, 10, 6, '#e8e0f0'); p.txt('H2O', 5, 14, '#2a5ab0', 1); }
    else { p.circ(9, 15, 2.6, '#e8e0f0'); p.r(7, 17, 5, 2, '#e8e0f0'); p.p(8, 15, '#2c2c38'); p.p(10, 15, '#2c2c38'); }
  });

  /* caja de madera con asas de cuerda. v: a ORO · b SAL · c PAN */
  reg('crateN', 20, 24, 1, 1, function (p, o) {
    var v = o.v || 'a', t = v === 'a' ? 'ORO' : v === 'b' ? 'SAL' : 'PAN';
    p.r(0, 0, 20, 24, C.ink); p.r(1, 1, 18, 7, WD[1]); p.r(1, 1, 18, 1, '#e0b078'); for (var i = 0; i < 4; i++) p.r(1, 3 + i * 2, 18, 1, WD[0]);
    p.r(1, 8, 18, 14, WD[0]); p.r(1, 8, 18, 1, WD[2]); p.r(1, 8, 2, 14, WD[1]); p.r(17, 8, 2, 14, WD[2]);
    p.line(3, 10, 16, 21, WD[2], 1); p.line(16, 10, 3, 21, WD[2], 1);
    p.r(4, 12, 12, 7, '#d8cca8'); p.r(4, 12, 12, 1, '#f0e8c8'); p.txt(t, 5, 13, v === 'a' ? '#7a5a0c' : '#3a3a48', 1);
    p.r(2, 22, 16, 1, WD[2]);
    if (v === 'a') { p.p(5, 0, BR[0]); p.p(9, 1, BR[1]); p.p(13, 0, BR[0]); }
    p.r(8, 5, 4, 2, RP[0]); p.r(8, 5, 4, 1, RP[1]);
  });

  /* cabrestante: tambor con la soga enrollada y dos barras cruzadas para girarlo */
  reg('capstan', 44, 36, 2, 1, function (p) {
    var i;
    p.ell(22, 33, 18, 3, 'rgba(0,0,0,0.3)');
    p.ell(22, 29, 13.4, 5, C.ink); p.r(8, 14, 28, 15, C.ink); p.ell(22, 14, 13.4, 5, C.ink);
    p.r(9, 14, 26, 15, WD[0]); p.ell(22, 28.4, 12.4, 4, WD[0]); p.r(9, 14, 5, 15, WD[1]); p.r(30, 14, 5, 15, WD[2]);
    for (i = 0; i < 4; i++) { p.r(9, 17 + i * 3, 26, 2, RP[0]); p.r(9, 17 + i * 3, 26, 1, RP[1]); p.r(9, 18 + i * 3, 26, 1, RP[2]); }
    p.ell(22, 14, 12.4, 4, WD[1]); p.ell(22, 14, 10, 3, WD[0]);
    p.line(3, 8, 41, 20, C.ink, 4); p.line(3, 8, 41, 20, WD[1], 2); p.line(3, 20, 41, 8, C.ink, 4); p.line(3, 20, 41, 8, WD[0], 2);
    [[3, 8, WD[1]], [41, 20, WD[0]], [3, 20, WD[1]], [41, 8, WD[0]]].forEach(function (b) { p.circ(b[0], b[1], 2.4, C.ink); p.circ(b[0], b[1], 1.6, b[2]); });
    p.circ(22, 14, 2.6, C.ink); p.circ(22, 14, 1.6, IR[1]); p.p(21, 13, '#ffffff');
    p.line(34, 25, 41, 32, RP[2], 2); p.line(34, 24, 41, 31, RP[0], 1);
  });

  reg('ropeCoil', 18, 12, 1, 1, function (p) {
    p.ell(9, 8, 8, 4, C.ink); p.ell(9, 7, 7.2, 3.4, RP[0]); p.ell(9, 7, 5, 2.4, RP[2]); p.ell(9, 7, 4.2, 1.9, RP[0]); p.ell(9, 7, 2.2, 1, '#241408');
    p.r(3, 4, 4, 1, RP[1]); p.r(9, 4, 3, 1, RP[1]); p.line(15, 8, 18, 11, RP[0], 1);
  });

  /* ancla de hierro apoyada contra la borda */
  reg('anchor', 32, 42, 2, 1, function (p) {
    p.ell(16, 39, 14, 2.6, 'rgba(0,0,0,0.3)');
    p.r(13, 8, 6, 28, C.ink); p.r(14, 9, 4, 26, IR[0]); p.r(14, 9, 1, 26, IR[1]); p.r(17, 9, 1, 26, IR[2]);
    p.r(6, 12, 20, 5, C.ink); p.r(7, 13, 18, 3, IR[0]); p.r(7, 13, 18, 1, IR[1]);
    p.circ(6, 14.5, 2.8, C.ink); p.circ(6, 14.5, 1.8, IR[1]); p.circ(26, 14.5, 2.8, C.ink); p.circ(26, 14.5, 1.8, IR[0]);
    p.circ(16, 5, 4.8, C.ink); p.circ(16, 5, 3.6, IR[1]); p.circ(16, 5, 2.2, '#0a1012');
    p.line(16, 35, 7, 32, C.ink, 5); p.line(7, 32, 4, 25, C.ink, 5); p.line(16, 35, 25, 32, C.ink, 5); p.line(25, 32, 28, 25, C.ink, 5);
    p.line(16, 35, 7, 32, IR[0], 3); p.line(7, 32, 4, 25, IR[0], 3); p.line(16, 35, 25, 32, IR[2], 3); p.line(25, 32, 28, 25, IR[2], 3);
    p.poly([0, 22, 8, 26, 3, 32], C.ink); p.poly([1.5, 23.5, 6.5, 26, 3.5, 30], IR[1]); p.poly([32, 22, 24, 26, 29, 32], C.ink); p.poly([30.5, 23.5, 25.5, 26, 28.5, 30], IR[0]);
    for (var i = 0; i < 3; i++) { p.ell(22 + i * 2.2, 36 + i * 1.5, 2.2, 1.5, C.ink); p.ell(22 + i * 2.2, 36 + i * 1.5, 1.2, 0.8, i % 2 ? IR[1] : IR[0]); }
  });

  /* poste con farol colgante (da luz cálida) */
  reg('lanternPost', 16, 48, 1, 1, function (p) {
    p.ell(8, 45, 7, 2.4, C.ink); p.r(5, 14, 6, 32, C.ink); p.r(6, 14, 4, 31, WD[0]); p.r(6, 14, 2, 31, WD[1]); p.r(9, 14, 1, 31, WD[2]);
    p.r(3, 42, 10, 4, C.ink); p.r(4, 42, 8, 2, WD[1]);
    p.r(5, 22, 6, 2, IR[0]); p.r(5, 22, 6, 1, IR[1]); p.line(8, 12, 14, 6, C.ink, 2); p.line(8, 12, 14, 6, IR[0], 1);
    p.r(11, 4, 2, 3, C.ink); lantern(p, 8, 6, true);
  }, {
    light: { dx: 12, dy: 12, r: 52, col: '#ffd890', flick: 0.6 },
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y);
      p.r(9, 9, 6, 7, '#ffe9a0'); flame(p, 12, 15, t, inst.x); p.r(9, 9, 6, 1, '#ffffff');
    }
  });

  /* farol de piso, pequeño */
  reg('farol', 12, 16, 0, 0, function (p, o) {
    p.ell(6, 14, 5, 2, 'rgba(0,0,0,0.3)'); p.r(1, 12, 10, 3, C.ink); p.r(2, 12, 8, 2, IR[0]);
    p.r(2, 4, 8, 9, C.ink); p.r(3, 5, 6, 7, o.v === 'r' ? '#ff6a5a' : '#ffe9a0'); p.r(3, 5, 6, 1, '#ffffff'); p.r(5, 5, 1, 7, IR[0]);
    p.r(3, 1, 6, 4, C.ink); p.r(4, 2, 4, 2, IR[1]); p.circ(6, 1, 2.4, C.ink); p.circ(6, 1, 1.4, IR[1]);
  }, {
    light: { dx: 6, dy: 8, r: 30, col: '#ffd890', flick: 0.7 },
    anim: function (ctx, x, y, t, inst) { var p = new PX.Pen(ctx, 1, x, y); flame(p, 6, 11, t, inst.x); }
  });

  reg('bollard', 16, 18, 1, 1, function (p) {
    p.ell(8, 16, 7, 2.6, C.ink); p.r(3, 6, 10, 10, C.ink); p.ell(8, 6, 6, 3, C.ink);
    p.r(4, 7, 8, 9, IR[0]); p.r(4, 7, 3, 9, IR[1]); p.r(10, 7, 2, 9, IR[2]); p.ell(8, 14.4, 5.6, 2, IR[0]); p.ell(8, 6, 5, 2.4, IR[1]); p.ell(8, 6, 3, 1.4, IR[0]);
    p.r(3, 10, 10, 3, RP[0]); p.r(3, 10, 10, 1, RP[1]); p.r(3, 12, 10, 1, RP[2]); p.line(12, 12, 15, 17, RP[0], 1);
  });

  /* garfio de Foxy en su soporte (tarea) */
  reg('hookStand', 32, 52, 2, 1, function (p) {
    p.ell(16, 49, 15, 3, 'rgba(0,0,0,0.3)');
    p.r(2, 36, 28, 14, C.ink); p.r(3, 37, 26, 12, WD[0]); p.r(3, 37, 26, 2, WD[1]); p.r(3, 47, 26, 2, WD[2]);            // peana
    p.r(7, 40, 18, 8, C.ink); p.r(8, 41, 16, 6, '#e8d890'); p.txt('FOXY', 9, 41, '#4a2c14', 1);
    p.r(6, 0, 20, 36, C.ink); p.r(7, 1, 18, 34, WD[0]); p.r(7, 1, 18, 1, WD[1]); p.r(7, 1, 2, 34, WD[1]); p.r(23, 1, 2, 34, WD[2]);   // tablero
    p.dith(9, 3, 14, 30, WD[2], 3);
    p.r(13, 2, 6, 5, BR[2]); p.r(13, 2, 6, 1, BR[1]); p.r(14, 3, 4, 3, BR[0]);                                           // abrazadera
    p.line(16, 7, 16, 25, C.ink, 5); p.line(16, 25, 11, 31, C.ink, 5); p.line(11, 31, 8, 24, C.ink, 4);                // garfio
    p.line(16, 7, 16, 25, '#aebfd8', 3); p.line(16, 25, 11, 30, '#aebfd8', 3); p.line(11, 30, 9, 24, '#aebfd8', 2);
    p.line(15, 8, 15, 24, '#f2f8ff', 1); p.line(15, 25, 11, 29, '#f2f8ff', 1); p.line(17, 8, 17, 24, '#53627e', 1); p.p(9, 24, '#ffffff');
    p.r(14, 9, 5, 1, '#53627e'); p.r(14, 12, 5, 1, '#53627e');
    p.r(7, 33, 18, 1, WD[2]); p.r(8, 5, 1, 1, IR[1]); p.r(23, 5, 1, 1, IR[1]); p.r(8, 31, 1, 1, IR[1]); p.r(23, 31, 1, 1, IR[1]);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), k = (t * 14) % 22;
      if (k < 18) spark(p, 15, 8 + k, '#ffffff');
      if (Math.sin(t * 2.3) > 0.7) spark(p, 9, 24, '#fff6b0');
    }
  });

  /* ====================== PUENTE DE MANDO ====================== */
  /* timón (tarea final): el aro gira solo. Se dibuja una vez por ángulo (se repite cada 45°) y se reutiliza */
  function drawWheel(p, cx, cy, a) {
    var k, i, q;
    for (k = 0; k < 28; k++) {
      var a0 = a + k * Math.PI / 14, a1 = a0 + Math.PI / 14;
      p.line(cx + Math.cos(a0) * 15, cy + Math.sin(a0) * 15, cx + Math.cos(a1) * 15, cy + Math.sin(a1) * 15, C.ink, 5);
    }
    for (k = 0; k < 28; k++) {
      var b0 = a + k * Math.PI / 14, b1 = b0 + Math.PI / 14, lit = Math.sin(b0 - Math.PI * 0.75) > 0;
      p.line(cx + Math.cos(b0) * 15, cy + Math.sin(b0) * 15, cx + Math.cos(b1) * 15, cy + Math.sin(b1) * 15, lit ? WD[1] : WD[0], 3);
    }
    for (i = 0; i < 8; i++) {
      q = a + i * Math.PI / 4;
      p.line(cx, cy, cx + Math.cos(q) * 21, cy + Math.sin(q) * 21, C.ink, 4); p.line(cx, cy, cx + Math.cos(q) * 21, cy + Math.sin(q) * 21, WD[0], 2);
      p.line(cx, cy, cx + Math.cos(q) * 21, cy + Math.sin(q) * 21, WD[1], 1);
      p.circ(cx + Math.cos(q) * 22.4, cy + Math.sin(q) * 22.4, 2.6, C.ink); p.circ(cx + Math.cos(q) * 22.4, cy + Math.sin(q) * 22.4, 1.8, WD[1]); p.p(cx + Math.cos(q) * 22.4, cy + Math.sin(q) * 22.4, BR[1]);
    }
    p.circ(cx, cy, 5, C.ink); p.circ(cx, cy, 4, BR[0]); p.circ(cx, cy, 2, BR[1]); p.p(cx - 1, cy - 1, '#ffffff');
  }
  var wheelFrames = [];
  function wheelFrame(a) {
    var n = 20, k = Math.floor((a % (Math.PI / 4)) / (Math.PI / 4) * n) % n;
    if (!wheelFrames[k]) { var t = PX.mk(52, 52); drawWheel(t.pen, 26, 26, k * (Math.PI / 4) / n); wheelFrames[k] = t.cv; }
    return wheelFrames[k];
  }
  reg('wheel', 52, 62, 3, 1, function (p) {
    p.ell(26, 58, 22, 4, 'rgba(0,0,0,0.3)');
    p.r(13, 36, 26, 24, C.ink); p.r(14, 37, 24, 22, WD[0]); p.r(14, 37, 3, 22, WD[1]); p.r(35, 37, 3, 22, WD[2]);
    p.r(14, 37, 24, 3, BR[0]); p.r(14, 37, 24, 1, BR[1]); p.r(14, 58, 24, 2, BR[0]); p.r(14, 59, 24, 1, BR[2]);
    p.r(16, 50, 20, 9, C.ink); p.r(17, 51, 18, 7, '#14102a'); p.txt('POPA', 19, 52, BR[1], 1);
    p.r(10, 58, 32, 3, C.ink); p.r(11, 58, 30, 1, WD[1]);
    p.r(23, 24, 6, 14, C.ink); p.r(24, 24, 4, 14, BR[0]); p.r(24, 24, 1, 14, BR[1]);
  }, {
    light: { dx: 26, dy: 26, r: 34, col: '#7ad8ff' },
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), on = st && st.done !== 'locked' && st.done !== 'done';
      ctx.drawImage(wheelFrame(t * (on ? 0.9 : 0.25)), x, y - 1);
      if (on && Math.sin(t * 5) > 0.5) spark(p, 26 + Math.cos(t * 1.8) * 12, 25 + Math.sin(t * 1.8) * 12, '#ffffff');
    }
  });

  /* bitácora con brújula bajo cúpula de latón */
  reg('binnacle', 22, 40, 1, 1, function (p) {
    p.ell(11, 37, 9, 3, 'rgba(0,0,0,0.3)');
    p.r(5, 20, 12, 18, C.ink); p.r(6, 21, 10, 16, WD[0]); p.r(6, 21, 3, 16, WD[1]); p.r(14, 21, 2, 16, WD[2]);
    p.r(4, 34, 14, 4, C.ink); p.r(5, 34, 12, 3, WD[1]); p.r(7, 25, 8, 6, C.ink); p.r(8, 26, 6, 4, '#14102a'); p.p(11, 28, '#ff3b4a');
    p.ell(11, 14, 10, 8, C.ink); p.r(1, 14, 20, 6, C.ink); p.ell(11, 14, 9, 7, BR[0]); p.r(2, 14, 18, 5, BR[0]); p.r(2, 14, 3, 5, BR[1]); p.r(17, 14, 3, 5, BR[2]);
    p.ell(11, 12, 6.6, 5, C.ink); p.ell(11, 12, 5.6, 4.2, '#e8f0ff'); p.p(11, 8, '#b3182b'); p.p(11, 16, '#2a5ab0'); p.p(7, 12, '#7a8498'); p.p(15, 12, '#7a8498');
    p.ell(11, 6, 4, 2, BR[1]); p.circ(11, 3, 2, C.ink); p.circ(11, 3, 1.2, BR[0]);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), a = Math.sin(t * 1.3) * 0.5 - 1.2;
      p.line(11, 12, 11 + Math.cos(a) * 4.5, 12 + Math.sin(a) * 3.6, '#b3182b', 1); p.line(11, 12, 11 - Math.cos(a) * 4, 12 - Math.sin(a) * 3.2, '#14102a', 1); p.p(11, 12, '#ffffff');
    }
  });

  /* catalejo sobre trípode */
  reg('telescope', 28, 44, 1, 1, function (p) {
    p.ell(14, 41, 11, 2.6, 'rgba(0,0,0,0.3)');
    p.line(14, 24, 5, 42, C.ink, 3); p.line(14, 24, 23, 42, C.ink, 3); p.line(14, 24, 14, 42, C.ink, 3);
    p.line(14, 24, 5, 41, WD[0], 1); p.line(14, 24, 23, 41, WD[2], 1); p.line(14, 24, 14, 41, WD[1], 1);
    p.line(4, 33, 24, 33, WD[2], 1);
    p.line(8, 24, 22, 4, C.ink, 7); p.line(8, 24, 22, 4, BR[0], 5); p.line(7, 24, 21, 4, BR[1], 1); p.line(10, 24, 23, 5, BR[2], 1);
    p.line(14, 15, 18, 9, WD[0], 5); p.line(13, 15, 17, 9, WD[1], 1);
    p.circ(22, 4, 3.4, C.ink); p.circ(22, 4, 2.4, '#9ad8f0'); p.p(21, 3, '#ffffff'); p.circ(7, 25, 2.4, C.ink); p.circ(7, 25, 1.6, WD[2]);
    p.circ(14, 24, 2.2, IR[0]); p.p(13, 23, IR[1]);
  }, {
    anim: function (ctx, x, y, t) { if (Math.sin(t * 1.9) > 0.8) spark(new PX.Pen(ctx, 1, x, y), 22, 4, '#ffffff'); }
  });

  /* estante de mapas enrollados */
  reg('chartRack', 32, 46, 2, 1, function (p) {
    var i, j;
    p.r(0, 0, 32, 46, C.ink); p.r(1, 1, 30, 44, WD[0]); p.r(1, 1, 30, 1, WD[1]); p.r(1, 1, 2, 44, WD[1]); p.r(29, 1, 2, 44, WD[2]);
    for (j = 0; j < 3; j++) {
      var y = 3 + j * 14;
      p.r(3, y, 26, 12, '#1c1208');
      for (i = 0; i < 4; i++) {
        var cx = 7 + i * 6.2, cy = y + 6;
        p.circ(cx, cy, 2.8, C.ink); p.circ(cx, cy, 2, i % 2 ? '#e8d8a8' : '#d8c288'); p.p(cx - 1, cy - 1, '#fff6d8'); p.p(cx, cy, '#8a6a3a');
        if ((i + j) % 3 === 0) p.r(cx - 3, cy + 2, 6, 1, '#b3182b');
      }
      p.r(1, y + 12, 30, 2, WD[1]); p.r(1, y + 13, 30, 1, WD[2]);
    }
    p.r(2, 44, 4, 2, C.ink); p.r(26, 44, 4, 2, C.ink);
  });

  /* campana del barco con su soga; la campana se mece */
  reg('bell', 24, 46, 1, 1, function (p) {
    p.ell(12, 43, 9, 2.6, 'rgba(0,0,0,0.3)');
    p.r(2, 1, 4, 44, C.ink); p.r(3, 2, 2, 42, WD[0]); p.r(3, 2, 1, 42, WD[1]); p.r(18, 1, 4, 44, C.ink); p.r(19, 2, 2, 42, WD[0]); p.r(19, 2, 1, 42, WD[1]);
    p.r(0, 0, 24, 5, C.ink); p.r(1, 1, 22, 3, WD[0]); p.r(1, 1, 22, 1, WD[1]); p.r(1, 3, 22, 1, WD[2]);
    p.r(0, 41, 24, 4, C.ink); p.r(1, 41, 22, 2, WD[1]);
    p.line(12, 5, 12, 8, IR[0], 1);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), sw = Math.round(Math.sin(t * 1.6) * 2);
      p.line(12, 5, 12 + sw, 10, IR[0], 1);
      p.poly([8 + sw, 20, 16 + sw, 20, 18 + sw, 27, 6 + sw, 27], C.ink); p.poly([9 + sw, 11, 15 + sw, 11, 16 + sw, 20, 8 + sw, 20], C.ink);
      p.poly([10 + sw, 12, 14 + sw, 12, 15 + sw, 20, 9 + sw, 20], BR[0]); p.r(10 + sw, 12, 2, 8, BR[1]); p.poly([8 + sw, 20, 16 + sw, 20, 17 + sw, 26, 7 + sw, 26], BR[0]); p.r(8 + sw, 20, 2, 6, BR[1]); p.r(7 + sw, 25, 10, 1, BR[2]);
      p.circ(12 + sw, 28, 1.6, BR[2]); p.line(12, 6, 12, 8, RP[0], 1); p.line(12 + sw, 29, 12 + sw, 37, RP[0], 1); p.circ(12 + sw, 38, 1.6, RP[0]);
    }
  });

  /* ====================== LA CALA DE FOXY ====================== */
  /* escenario de la cala: tarima de tablas, cortina morada con estrellas y el letrero. Foxy se asoma por la abertura */
  var STARS = [[6, 24], [20, 36], [31, 22], [40, 40], [10, 44], [27, 46], [103, 26], [90, 38], [80, 24], [73, 46], [106, 44], [95, 47]];
  reg('coveStage', 112, 96, 7, 3, function (p) {
    var i, x;
    for (i = 0; i < 28; i++) {                                                       // pliegues del terciopelo
      x = i * 4; p.r(x, 16, 4, 34, PU[i % 4 === 1 ? 1 : i % 4 === 3 ? 2 : 0]); p.r(x, 16, 1, 34, PU[2]);
      if (i % 4 === 1) p.r(x + 1, 16, 1, 34, '#a870e8');
    }
    p.dith(0, 38, 112, 12, '#14082a', 6); p.dith(0, 16, 112, 6, '#14082a', 4);
    p.poly([46, 16, 66, 16, 72, 50, 40, 50], C.ink); p.poly([47, 16, 65, 16, 70.5, 50, 41.5, 50], '#0a0618');          // abertura
    p.dith(47, 16, 20, 34, '#2a1458', 5); p.dith(47, 16, 20, 14, '#0a0618', 6);
    p.line(46, 16, 40, 50, '#b890ff', 1); p.line(66, 16, 72, 50, PU[2], 1); p.line(47, 16, 41, 50, PU[1], 1);
    STARS.forEach(function (s) { spark(p, s[0], s[1], '#ffe45c'); p.p(s[0], s[1], '#fff6b0'); });
    p.r(0, 12, 112, 4, C.ink); p.r(1, 13, 110, 2, BR[0]); p.r(1, 13, 110, 1, BR[1]);                                    // varilla y anillos
    for (i = 3; i < 108; i += 9) { p.r(i, 15, 3, 4, BR[2]); p.r(i, 15, 1, 4, BR[0]); }
    p.circ(1, 14, 3, C.ink); p.circ(1, 14, 2, BR[0]); p.p(0, 13, BR[1]); p.circ(111, 14, 3, C.ink); p.circ(111, 14, 2, BR[0]); p.p(110, 13, BR[1]);
    p.r(30, 0, 52, 12, C.ink); p.r(31, 1, 50, 10, WD[0]); p.r(31, 1, 50, 1, WD[1]); p.r(31, 10, 50, 1, WD[2]);          // letrero
    p.txt('PIRATE COVE', 34, 3, BR[1], 1); p.line(35, 11, 35, 12, RP[0], 1); p.line(76, 11, 76, 12, RP[0], 1);
    p.circ(26, 7, 3.4, C.ink); p.circ(26, 7, 2.6, '#e8e0f0'); p.p(25, 6, C.ink); p.p(27, 6, C.ink); p.r(25, 9, 3, 1, C.ink);
    p.circ(86, 7, 3.4, C.ink); p.circ(86, 7, 2.6, '#e8e0f0'); p.p(85, 6, C.ink); p.p(87, 6, C.ink); p.r(85, 9, 3, 1, C.ink);
    // tarima de tablas
    p.r(0, 48, 112, 46, C.ink); p.r(1, 49, 110, 31, '#8a6238'); p.r(1, 49, 110, 1, '#d8a868');
    for (i = 0; i < 5; i++) { p.r(1, 54 + i * 6, 110, 1, '#3e2814'); p.r(1, 55 + i * 6, 110, 1, '#a87a44'); }
    for (i = 0; i < 12; i++) p.r(6 + (i * 37) % 104, 50 + (i % 5) * 6, 1, 5, '#4a2c14');
    p.ell(56, 66, 30, 7, p.pat('#d49aff', 3)); p.ell(56, 66, 18, 4, p.pat('#e8c8ff', 3));
    p.r(1, 80, 110, 13, '#4a2c14'); p.r(1, 80, 110, 2, '#c89a5c'); p.r(1, 87, 110, 3, BR[0]); p.r(1, 87, 110, 1, BR[1]); p.r(1, 90, 110, 1, BR[2]);
    for (i = 6; i < 108; i += 12) { p.circ(i, 84, 1.4, C.ink); p.circ(i, 84, 0.8, BR[1]); }
    p.r(1, 93, 110, 3, 'rgba(0,0,0,0.5)');
    p.r(8, 58, 16, 14, C.ink); p.r(9, 59, 14, 12, WD[0]); p.r(9, 59, 14, 3, WD[1]); p.line(9, 64, 22, 64, WD[2], 1); p.r(14, 63, 4, 3, BR[0]);     // cofrecito
    p.circ(88, 63, 4.4, C.ink); p.circ(88, 63, 3.6, '#e8e0f0'); p.r(86, 62, 2, 2, C.ink); p.r(90, 62, 2, 2, C.ink); p.r(87, 66, 4, 2, '#e8e0f0');   // calavera en el tablón
    p.line(84, 70, 92, 60, '#e8e0f0', 1); p.line(92, 70, 84, 60, '#e8e0f0', 1);
    rope(p, 98, 70, 106, 66); rope(p, 98, 72, 108, 70); p.circ(104, 64, 2.4, C.ink); p.circ(104, 64, 1.6, '#2a2e3a'); p.circ(108, 66, 2.4, C.ink); p.circ(108, 66, 1.6, '#2a2e3a');
  }, {
    light: { dx: 56, dy: 56, r: 50, col: '#c48aff', glow: '#a05cff', flick: 0.6 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), ph = t % 7.5, sw = Math.round(Math.sin(t * 1.3) * 1.2), i;
      p.line(46 + sw, 16, 40 + sw, 50, '#c8a0ff', 1);
      if (ph > 3.2 && ph < 4.8 && !(ph > 4.0 && ph < 4.12)) {                           // Foxy: un ojo amarillo y el parche
        p.r(50, 30, 6, 6, '#12081f'); p.ell(52.5, 33, 3, 2.6, C.ink); p.ell(59, 32, 3.4, 3, '#ffe45c'); p.ell(59, 32, 1.6, 1.6, C.ink); p.p(58, 31, '#ffffff');
        p.r(49, 36, 14, 2, '#80201a'); p.r(53, 38, 2, 1, '#b33a24'); p.r(60, 38, 2, 1, '#b33a24'); p.p(47, 40, '#b33a24');
      }
      for (i = 0; i < STARS.length; i++) if (Math.sin(t * 2.2 + i * 1.7) > 0.88) spark(p, STARS[i][0], STARS[i][1], '#ffffff');
    }
  });

  /* cartel «fuera de servicio» (tarea) */
  reg('outOrder', 48, 46, 3, 1, function (p) {
    p.ell(24, 43, 21, 3, 'rgba(0,0,0,0.3)');
    p.line(9, 32, 6, 44, C.ink, 3); p.line(39, 32, 42, 44, C.ink, 3); p.line(9, 32, 6, 43, WD[1], 1); p.line(39, 32, 42, 43, WD[2], 1);
    p.r(2, 4, 44, 32, C.ink); p.r(3, 5, 42, 30, '#e8e0f0'); p.r(3, 5, 42, 1, '#ffffff'); p.r(3, 34, 42, 1, '#a89cc0');
    p.r(3, 5, 42, 2, '#c4283c'); p.r(3, 33, 42, 2, '#c4283c'); p.r(3, 5, 2, 30, '#c4283c'); p.r(43, 5, 2, 30, '#c4283c');
    p.txt('LO SIENTO', 7, 8, '#c4283c', 1); p.txt('FUERA DE', 9, 15, '#1c1836', 1); p.txt('SERVICIO', 9, 22, '#1c1836', 1);
    p.r(5, 29, 38, 3, '#f2c21c'); for (var i = 0; i < 7; i++) p.poly([8 + i * 5, 29, 10 + i * 5, 29, 8 + i * 5, 32, 6 + i * 5, 32], '#14181e');
    p.r(20, 0, 8, 4, C.ink); p.r(21, 1, 6, 3, IR[0]); p.line(24, 4, 24, 5, IR[1], 1);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), on = Math.sin(t * 4.2) > 0;
      p.circ(24, 0, 2.4, C.ink); p.circ(24, 0, 1.6, on ? '#ff3b4a' : '#6b0f1c'); if (on) p.p(23, -1, '#ffd0d0');
    }
  });

  /* montón de monedas y joyas */
  reg('goldHeap', 40, 28, 2, 1, function (p) {
    var i;
    p.ell(20, 25, 19, 3, 'rgba(0,0,0,0.3)'); p.ell(20, 19, 18, 8, C.ink); p.ell(20, 18, 17, 7, BR[2]); p.ell(20, 17, 16, 6, BR[0]); p.ell(17, 13, 10, 3, p.pat(BR[1], 9));
    for (i = 0; i < 20; i++) { var cx = 6 + (i * 7) % 28, cy = 11 + (i * 5) % 12; p.ell(cx, cy, 2, 1.3, i % 3 ? BR[1] : BR[2]); p.p(cx - 1, cy, BR[0]); }
    p.r(24, 9, 4, 4, C.ink); p.r(25, 10, 2, 2, '#ff3b4a'); p.p(25, 10, '#ffd0d0'); p.r(10, 14, 4, 4, C.ink); p.r(11, 15, 2, 2, '#4de0ff'); p.p(11, 15, '#ffffff');
    p.r(29, 15, 4, 4, C.ink); p.r(30, 16, 2, 2, '#3fd479'); p.p(30, 16, '#d0ffe0');
    p.r(30, 5, 7, 5, C.ink); p.r(31, 5, 5, 4, BR[0]); p.r(31, 5, 1, 4, BR[1]); p.r(33, 10, 1, 3, C.ink); p.r(31, 13, 5, 2, C.ink); p.r(32, 13, 3, 1, BR[0]);        // copa
    p.line(5, 17, 11, 22, '#f2f0ff', 1); p.line(11, 22, 18, 22, '#f2f0ff', 1); p.p(8, 20, '#ffffff');
  }, {
    light: { dx: 20, dy: 14, r: 28, col: '#ffe08a' },
    anim: function (ctx, x, y, t) {
      var k = Math.floor(t * 3) % 4, s = [[10, 10], [26, 8], [18, 16], [32, 14]][k];
      spark(new PX.Pen(ctx, 1, x, y), s[0], s[1], '#ffffff');
    }
  });

  /* palmera: el tronco es fijo, las hojas se mecen */
  reg('palm', 48, 84, 1, 1, function (p) {
    var i, tx, ty;
    p.ell(24, 80, 9, 3, 'rgba(0,0,0,0.3)');
    for (i = 0; i < 12; i++) {
      tx = 24 + Math.sin(i * 0.28) * 4 + i * 0.3; ty = 79 - i * 5;
      p.r(tx - 3.5, ty, 7, 6, C.ink); p.r(tx - 2.5, ty, 5, 5, '#8a6a40'); p.r(tx - 2.5, ty, 2, 5, '#b8945c'); p.r(tx + 1.5, ty, 1, 5, '#4a3a20'); p.r(tx - 2.5, ty + 4, 5, 1, '#4a3a20');
    }
    p.circ(22, 22, 2.8, C.ink); p.circ(22, 22, 2, '#5a3a18'); p.circ(28, 23, 2.8, C.ink); p.circ(28, 23, 2, '#5a3a18'); p.p(21, 21, '#8a6a40');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), cx = 28, cy = 19, F = [[-22, -2], [-17, 11], [-8, -13], [8, -13], [18, 10], [23, -3], [0, -16]], i;
      F.forEach(function (f, n) {
        var sw = Math.sin(t * 1.4 + n * 1.1) * 2.2, tx = cx + f[0] + sw, ty = cy + f[1] + Math.cos(t * 1.1 + n) * 1.2, mx = cx + f[0] * 0.5, my = cy + f[1] * 0.5 - 7;
        p.poly([cx, cy - 1, mx, my - 3, tx, ty, mx, my + 3.5], C.ink); p.poly([cx, cy, mx, my - 2, tx - Math.sign(f[0]) * 1, ty, mx, my + 2], n % 2 ? '#2e8a3e' : '#3fb054');
        p.line(cx, cy, mx, my, '#1a5028', 1);
      });
      p.circ(cx, cy, 3, C.ink); p.circ(cx, cy, 2, '#1a5028');
    }
  });

  /* roca con musgo y espuma. v: b = más baja */
  reg('rock', 36, 28, 2, 1, function (p, o) {
    var lo = o.v === 'b';
    p.ell(18, 25, 17, 3, 'rgba(0,0,0,0.3)');
    if (!lo) {
      p.poly([3, 26, 1, 16, 8, 7, 17, 3, 27, 6, 34, 15, 35, 26], C.ink); p.poly([4, 25, 3, 16, 9, 8, 17, 4.5, 26, 7, 33, 15, 33, 25], '#5e5878');
      p.poly([9, 8, 17, 5, 22, 8, 14, 13, 5, 16], '#7e789a'); p.poly([26, 7, 33, 15, 33, 25, 24, 25, 26, 15], '#3c3858'); p.dith(6, 17, 11, 7, '#3a7a3a', 5);
    } else {
      p.poly([2, 26, 2, 19, 9, 13, 18, 12, 26, 15, 33, 21, 34, 26], C.ink); p.poly([3, 25, 4, 19.5, 10, 14.5, 18, 13.5, 25, 16, 32, 21.5, 32.5, 25], '#5e5878');
      p.poly([10, 14, 18, 13, 22, 16, 14, 19, 6, 20], '#7e789a'); p.poly([25, 16, 32, 21, 32, 25, 22, 25], '#3c3858'); p.dith(15, 18, 10, 6, '#3a7a3a', 5);
    }
    p.r(3, 24, 31, 2, '#2a2848'); p.dith(2, 25, 33, 2, '#c8f0f0', 6); p.p(14, 10, '#9ad8f0'); p.p(14, 8, '#4de0c8');
  });

  /* antorcha de hierro clavada en la arena */
  reg('torchStand', 16, 50, 1, 1, function (p) {
    p.ell(8, 47, 7, 2, 'rgba(0,0,0,0.3)'); p.line(8, 44, 3, 49, C.ink, 3); p.line(8, 44, 13, 49, C.ink, 3); p.line(8, 44, 3, 48, IR[1], 1); p.line(8, 44, 13, 48, IR[0], 1);
    p.r(6, 18, 4, 28, C.ink); p.r(7, 18, 2, 27, IR[0]); p.r(7, 18, 1, 27, IR[1]);
    p.poly([1, 12, 15, 12, 12, 21, 4, 21], C.ink); p.poly([2, 13, 14, 13, 11, 20, 5, 20], IR[0]); p.r(2, 13, 12, 1, IR[1]); p.ell(8, 12, 6.4, 2.4, C.ink); p.ell(8, 12, 5.4, 1.8, '#ff6a2a'); p.r(5, 21, 6, 1, IR[2]);
  }, {
    light: { dx: 8, dy: 8, r: 56, col: '#ffc070', glow: '#ff8a20', flick: 0.9 },
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y);
      flame(p, 6, 12, t, inst.x); flame(p, 10, 12, t + 1.5, inst.x + 3);
    }
  });

  /* bote varado en la arena con su nombre */
  reg('lifeboat', 84, 36, 5, 2, function (p) {
    var i;
    p.ell(42, 33, 40, 3, 'rgba(0,0,0,0.3)');
    p.poly([3, 16, 5, 10, 44, 8, 66, 7, 84, 1, 70, 13, 44, 16], C.ink); p.poly([5, 15, 6.5, 11, 44, 9.5, 66, 8.5, 80, 3.5, 69, 12.5, 44, 15], '#4a2e1a'); p.dith(6, 10, 68, 5, '#241408', 5);
    for (i = 0; i < 3; i++) { p.r(17 + i * 16, 9, 5, 7, C.ink); p.r(18 + i * 16, 10, 3, 5, WD[1]); p.r(18 + i * 16, 10, 3, 1, '#e0b078'); }
    p.poly([2, 15, 44, 15, 70, 12, 84, 1, 80, 14, 68, 26, 52, 31, 24, 32, 8, 29], C.ink); p.poly([3.5, 16.5, 44, 16.5, 69.5, 13.5, 81, 4, 78, 14, 67, 25, 52, 29.5, 24, 30.5, 9, 27.5], '#8a3a2a');
    p.line(3, 16, 44, 16, '#e8d8b0', 1); p.line(44, 16, 70, 13, '#e8d8b0', 1); p.line(70, 13, 83, 2, '#e8d8b0', 1);
    p.line(8, 22, 50, 22, '#6a2a1c', 1); p.line(10, 26, 52, 26, '#6a2a1c', 1); p.line(52, 22, 74, 17, '#6a2a1c', 1); p.line(52, 26, 68, 22, '#6a2a1c', 1);
    p.dith(4, 24, 60, 6, '#3a140c', 4); p.txt('FOXY', 12, 18, '#f2ecd8', 1);
    p.line(24, 11, 62, 5, WD[2], 3); p.line(24, 11, 62, 5, WD[1], 1); p.ell(66, 4.5, 4, 2, WD[1]); p.ell(8, 12, 3.4, 1.8, RP[0]); p.ell(8, 12, 1.8, 0.9, RP[2]);
  });

  /* cangrejito que pasea por la arena */
  reg('crab', 56, 12, 0, 0, function () {}, {
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y), u = (t * 0.35 + inst.x * 0.01) % 2, cx = 8 + (u < 1 ? u : 2 - u) * 40, k = Math.floor(t * 8) % 2, i;
      for (i = 0; i < 3; i++) { p.line(cx - 3, 8, cx - 6, 9 + (i + k) % 2, '#8a2a1c', 1); p.line(cx + 3, 8, cx + 6, 9 + (i + k) % 2, '#8a2a1c', 1); }
      p.ell(cx, 7, 4.4, 2.8, C.ink); p.ell(cx, 7, 3.6, 2.2, '#e0604a'); p.p(cx - 1, 6, '#ff9a80');
      p.circ(cx - 5, 4 - k, 2.2, C.ink); p.circ(cx - 5, 4 - k, 1.4, '#e0604a'); p.circ(cx + 5, 4 - (1 - k), 2.2, C.ink); p.circ(cx + 5, 4 - (1 - k), 1.4, '#e0604a');
      p.p(cx - 2, 4, C.ink); p.p(cx + 2, 4, C.ink);
    }
  });

  /* ====================== CAMAROTE DEL CAPITÁN ====================== */
  reg('bedC', 52, 58, 3, 2, function (p) {
    var i;
    p.r(1, 0, 50, 26, C.ink); p.r(2, 1, 48, 24, '#5a2e22'); p.r(2, 1, 48, 2, '#8a5040'); p.r(2, 1, 2, 24, '#7a4a3a'); p.r(48, 1, 2, 24, '#3a1a12');
    p.r(6, 6, 40, 16, '#4a2418'); p.r(6, 6, 40, 1, '#24100c'); p.r(6, 21, 40, 1, '#7a4a3a'); p.r(8, 8, 36, 12, '#63342a'); p.r(8, 8, 36, 1, '#8a5040');
    p.poly([26, 9, 31, 14, 26, 19, 21, 14], BR[2]); p.poly([26, 10, 29.5, 14, 26, 18, 22.5, 14], BR[0]); p.p(26, 11, BR[1]);
    p.circ(3, 2, 3, C.ink); p.circ(3, 2, 2, BR[0]); p.p(2, 1, BR[1]); p.circ(49, 2, 3, C.ink); p.circ(49, 2, 2, BR[0]); p.p(48, 1, BR[1]);
    p.r(0, 22, 52, 36, C.ink); p.r(1, 23, 50, 8, '#f2ecd8'); p.r(1, 23, 50, 1, '#ffffff');                                         // almohadas
    p.ell(14, 27, 11, 4.4, '#e4dcc4'); p.ell(38, 27, 11, 4.4, '#e4dcc4'); p.ell(13, 26, 8, 2.4, '#f8f2e0'); p.ell(37, 26, 8, 2.4, '#f8f2e0'); p.line(6, 29, 22, 29, '#b8ac90', 1); p.line(30, 29, 46, 29, '#b8ac90', 1);
    p.r(1, 31, 50, 20, '#2a4a8a'); p.r(1, 31, 50, 2, '#6a8ae0'); p.r(1, 31, 3, 20, '#3a5aa0'); p.r(47, 31, 4, 20, '#1a3070');
    p.r(1, 34, 50, 3, BR[0]); p.r(1, 34, 50, 1, BR[1]); p.r(1, 36, 50, 1, BR[2]);                                                    // doblez dorado
    for (i = 0; i < 6; i++) { p.p(6 + i * 8, 41 + (i % 2) * 4, BR[0]); p.p(7 + i * 8, 42 + (i % 2) * 4, BR[1]); }
    p.dith(1, 44, 50, 7, '#10204a', 5);
    p.r(1, 51, 50, 7, '#4a2418'); p.r(1, 51, 50, 2, '#8a5040'); p.r(3, 54, 46, 2, '#24100c'); p.r(3, 55, 4, 1, BR[0]); p.r(45, 55, 4, 1, BR[0]);
    p.poly([40, 2, 50, 4, 48, 8, 42, 7], '#14141e'); p.line(40, 2, 50, 4, BR[0], 1);
  });

  /* mesa de mapas con el mapa pirata desplegado (tarea) */
  reg('mapTable', 68, 46, 4, 2, function (p) {
    var i;
    p.r(0, 0, 68, 42, C.ink); p.r(1, 1, 66, 28, '#6a3a24'); p.r(1, 1, 66, 1, '#a06848'); p.r(1, 28, 66, 1, '#3a1a10');
    p.r(1, 29, 66, 11, '#4a2418'); p.r(1, 29, 66, 2, '#7a4a3a'); p.r(1, 38, 66, 2, '#24100c'); for (i = 0; i < 6; i++) p.p(5 + i * 12, 34, BR[0]);
    p.r(4, 41, 8, 5, C.ink); p.r(56, 41, 8, 5, C.ink); p.r(5, 41, 6, 4, '#4a2418'); p.r(57, 41, 6, 4, '#4a2418');
    p.r(7, 3, 52, 24, C.ink); p.r(8, 4, 50, 22, '#d8c288'); p.dith(8, 4, 50, 22, '#a8905a', 3); p.r(8, 4, 50, 1, '#efe0aa');                                // pergamino
    p.ell(22, 12, 9, 5, '#8aa060'); p.ell(26, 15, 5, 3, '#8aa060'); p.ell(13, 18, 4, 3, '#8aa060'); p.ell(46, 9, 7, 4, '#8aa060'); p.ell(40, 20, 6, 3, '#6a8850');
    p.dith(8, 4, 50, 22, '#7a9aa8', 2); p.ell(22, 12, 9, 5, p.pat('#a8bf78', 6)); p.ell(46, 9, 7, 4, p.pat('#a8bf78', 6));
    for (i = 0; i < 9; i++) p.p(14 + i * 4, 21 - Math.round(Math.sin(i * 0.7) * 3 + 3), '#b3182b');                                                     // ruta de puntos
    p.line(46, 12, 52, 18, '#b3182b', 2); p.line(52, 12, 46, 18, '#b3182b', 2);
    p.poly([14, 5, 15.2, 8, 18, 9, 15.2, 10, 14, 13, 12.8, 10, 10, 9, 12.8, 8], '#3a2410'); p.p(14, 9, '#b3182b');                                           // rosa de los vientos
    p.txt('ISLA', 24, 7, '#5a3a18', 1); p.txt('X', 53, 6, '#b3182b', 1);
    p.poly([8, 26, 14, 26, 8, 22], '#c8b070'); p.poly([58, 26, 52, 26, 58, 22], '#c8b070');
    p.r(60, 4, 5, 7, C.ink); p.r(61, 5, 3, 5, '#1c1c28'); p.line(63, 5, 66, 0, '#e8e0f0', 1); p.line(63, 4, 65, 0, '#c8c0d8', 1);                          // tintero y pluma
    p.r(2, 13, 4, 8, C.ink); p.r(3, 14, 2, 7, '#e8e0d0'); p.r(1, 21, 6, 3, BR[2]); p.r(2, 21, 4, 1, BR[0]);                                                  // vela
    p.circ(62, 20, 3, C.ink); p.circ(62, 20, 2.2, '#e8e0f0'); p.p(61, 19, C.ink); p.p(63, 19, C.ink); p.r(61, 22, 3, 1, C.ink);                                // calavera pisapapeles
  }, {
    light: { dx: 4, dy: 8, r: 38, col: '#ffd890', flick: 0.7 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y); flame(p, 4, 12, t, 3);
      if (Math.sin(t * 2.6) > 0.7) spark(p, 49, 15, '#ffffff');
    }
  });

  /* librero del capitán con un barco en miniatura */
  reg('shelfShip', 48, 62, 3, 1, function (p) {
    var i, j, cs = ['#b3182b', '#2a5ab0', '#2a7a4a', '#d8a820', '#6a2cc0', '#8a5a34'];
    p.r(0, 0, 48, 62, C.ink); p.r(1, 1, 46, 60, '#5a2e22'); p.r(1, 1, 46, 2, '#8a5040'); p.r(1, 1, 2, 60, '#7a4a3a'); p.r(45, 1, 2, 60, '#3a1a12');
    for (j = 0; j < 3; j++) {
      var y = 4 + j * 19;
      p.r(4, y, 40, 16, '#1c0e08'); p.r(4, y, 40, 1, '#0a0404');
      p.r(2, y + 16, 44, 2, '#8a5040'); p.r(2, y + 17, 44, 1, '#24100c');
      if (j === 0) {                                                                       // galeón en miniatura
        for (i = 0; i < 3; i++) { p.r(5 + i * 3, y + 4, 2, 12, cs[i]); p.r(5 + i * 3, y + 4, 1, 12, '#ffffff'); }
        p.poly([14, y + 15, 38, y + 15, 35, y + 11, 17, y + 11], C.ink); p.poly([15, y + 14, 37, y + 14, 34, y + 12, 18, y + 12], '#8a3a2a'); p.r(15, y + 12, 22, 1, '#e8d8b0');
        p.r(25, y + 2, 1, 10, C.ink); p.poly([26, y + 3, 33, y + 6, 26, y + 10], '#f2ecd8'); p.poly([24, y + 4, 18, y + 7, 24, y + 10], '#d8ccaa'); p.p(25, y + 1, '#ff3b4a');
        for (i = 0; i < 2; i++) { p.r(39 + i * 3, y + 5, 2, 11, cs[(i + 3) % 6]); p.r(39 + i * 3, y + 5, 1, 11, '#ffffff'); }
      } else if (j === 1) {
        [[6, '#3a8a4a'], [13, '#8a5a34'], [20, '#2a5aa8']].forEach(function (b) { p.r(b[0], y + 5, 5, 11, C.ink); p.r(b[0] + 1, y + 6, 3, 9, b[1]); p.r(b[0] + 1, y + 6, 1, 9, '#ffffff'); p.r(b[0] + 1, y + 3, 3, 3, '#6a5a3a'); p.r(b[0] + 1, y + 11, 3, 2, '#e8e0f0'); });
        for (i = 0; i < 5; i++) { p.r(27 + i * 3, y + 3 + (i % 2) * 2, 2, 13 - (i % 2) * 2, cs[(i + 2) % 6]); p.r(27 + i * 3, y + 3 + (i % 2) * 2, 1, 13 - (i % 2) * 2, '#ffffff'); }
      } else {
        for (i = 0; i < 6; i++) { p.r(5 + i * 3, y + 2 + (i % 3), 2, 14 - (i % 3), cs[i]); p.r(5 + i * 3, y + 2 + (i % 3), 1, 14 - (i % 3), '#ffffff'); }
        p.r(26, y + 8, 14, 8, C.ink); p.r(27, y + 9, 12, 6, '#6a4224'); p.r(27, y + 9, 12, 1, '#a07040'); p.r(31, y + 11, 4, 3, BR[0]);
      }
    }
    p.r(3, 59, 6, 3, C.ink); p.r(39, 59, 6, 3, C.ink);
  });

  /* loro de peluche en su percha: te sigue con la mirada */
  reg('parrotPerch', 24, 46, 1, 1, function (p) {
    p.ell(12, 43, 9, 2.6, 'rgba(0,0,0,0.3)'); p.ell(12, 41, 8, 2.6, C.ink); p.ell(12, 40.6, 7, 2, BR[0]); p.r(5, 40, 14, 1, BR[1]);
    p.r(10, 22, 4, 19, C.ink); p.r(11, 22, 2, 19, BR[0]); p.r(11, 22, 1, 19, BR[1]);
    p.r(3, 20, 18, 4, C.ink); p.r(4, 21, 16, 2, BR[0]); p.r(4, 21, 16, 1, BR[1]); p.circ(3, 22, 2.6, C.ink); p.circ(3, 22, 1.8, BR[0]); p.circ(21, 22, 2.6, C.ink); p.circ(21, 22, 1.8, BR[0]);
    p.r(7, 32, 10, 5, C.ink); p.r(8, 33, 8, 3, '#e8e0f0'); p.r(9, 34, 6, 1, '#b3182b');
    p.poly([9, 16, 15, 16, 14, 33, 8, 30], C.ink); p.poly([10, 17, 14, 17, 13, 31, 9, 29], '#2a5ab0'); p.poly([11, 19, 13, 19, 12, 28, 10, 26], '#3fd479'); p.r(10, 27, 3, 4, '#ffe45c');       // cola
    p.ell(12, 12, 6.4, 8.4, C.ink); p.ell(12, 12, 5.4, 7.4, '#c4283c'); p.ell(10, 9, 2.6, 5, '#e85a6c'); p.ell(15, 14, 2.6, 5, '#8a1a2e'); p.ell(12, 16, 3.4, 3.6, '#ffe45c');
    p.ell(8, 14, 2.4, 4.4, C.ink); p.ell(8, 14, 1.6, 3.6, '#2a5ab0'); p.line(8, 11, 8, 17, '#6a8ae0', 1);
    p.circ(12, 5, 5, C.ink); p.circ(12, 5, 4, '#c4283c'); p.circ(11, 3, 2, '#e85a6c');
    p.poly([15, 3, 21, 5, 20, 8, 17, 9, 15, 8], C.ink); p.poly([16, 4, 20, 5.5, 19, 7.5, 16.6, 8], '#ffe45c'); p.line(16, 7, 19, 7, '#b8820c', 1);
    p.line(7, 10, 9, 12, '#e8e0f0', 1);
  }, {
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), g = gaze(inst, st, 12, 5), bl = (Math.floor(t * 1.2 + inst.x * 0.2) % 5) === 4;
      p.circ(12.5, 4, 2.2, C.ink); if (bl) { p.r(11, 4, 3, 1, '#8a1a2e'); return; }
      p.circ(12.5, 4, 1.7, '#ffffff'); p.circ(12.5 + g.x * 0.8, 4 + g.y * 0.8, 0.9, C.ink);
    }
  });

  /* baúl de viaje. v: a madera · b verdoso */
  reg('trunk', 32, 26, 2, 1, function (p, o) {
    var b = o.v === 'b' ? ['#2a6a66', '#4aa8a0', '#143a38'] : ['#7a4a2a', '#b07a4a', '#3e2210'];
    p.ell(16, 24, 15, 2.4, 'rgba(0,0,0,0.3)');
    p.r(1, 12, 30, 13, C.ink); p.r(2, 13, 28, 11, b[0]); p.r(2, 13, 28, 1, b[1]); p.r(2, 23, 28, 1, b[2]); p.r(28, 13, 2, 11, b[2]);
    p.ell(16, 11, 15, 8, C.ink); p.r(1, 11, 30, 3, C.ink); p.ell(16, 11, 14, 7, b[0]); p.r(2, 11, 28, 3, b[0]); p.ell(14, 8, 9, 3, p.pat(b[1], 8));
    p.r(2, 13, 28, 1, b[2]); [6, 16, 25].forEach(function (x) { p.r(x, 4, 3, 21, IR[0]); p.r(x, 4, 1, 21, IR[1]); p.p(x + 1, 8, '#aeb9cc'); p.p(x + 1, 20, '#aeb9cc'); });
    p.r(13, 14, 6, 6, C.ink); p.r(14, 15, 4, 4, BR[0]); p.r(14, 15, 4, 1, BR[1]); p.p(15, 17, C.ink); p.p(16, 18, C.ink);
  });

  /* globo terráqueo; los continentes giran */
  reg('globe', 26, 40, 1, 1, function (p) {
    var k, a;
    p.ell(13, 37, 9, 2.4, 'rgba(0,0,0,0.3)');
    p.line(13, 24, 6, 38, C.ink, 3); p.line(13, 24, 20, 38, C.ink, 3); p.line(13, 24, 13, 38, C.ink, 3); p.line(13, 24, 6, 37, WD[0], 1); p.line(13, 24, 20, 37, WD[2], 1); p.line(13, 24, 13, 37, WD[1], 1);
    p.circ(13, 14, 11.6, C.ink); p.circ(13, 14, 10.4, '#2a6aa8'); p.ell(10, 10, 5, 4, p.pat('#6aa8e0', 8));
    for (k = 0; k < 20; k++) { a = k * Math.PI / 10; p.line(13 + Math.cos(a) * 12, 14 + Math.sin(a) * 12.8, 13 + Math.cos(a + Math.PI / 10) * 12, 14 + Math.sin(a + Math.PI / 10) * 12.8, BR[0], 1); }
    p.r(12, 1, 2, 3, BR[0]); p.r(12, 25, 2, 3, BR[2]);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      [[0, 2, 4], [2.1, -4, 3], [4, 5, -2], [5.3, -2, -5]].forEach(function (c) {
        var ph = t * 0.7 + c[0], cs = Math.cos(ph);
        if (cs > 0.15) p.ell(13 + Math.sin(ph) * 8, 14 + c[1], 3 * cs + 1, 2 + c[2] * 0.2, '#5a9a4a');
      });
      p.r(8, 8, 3, 1, 'rgba(255,255,255,0.4)');
    }
  });

  /* candelabro de pie con tres velas */
  reg('candelabra', 18, 38, 1, 1, function (p) {
    p.ell(9, 35, 7, 2.4, C.ink); p.ell(9, 34.6, 6, 1.8, BR[0]); p.r(8, 14, 2, 21, C.ink); p.r(8, 14, 2, 20, BR[0]); p.r(8, 14, 1, 20, BR[1]);
    p.line(9, 16, 2, 11, C.ink, 2); p.line(9, 16, 16, 11, C.ink, 2); p.line(9, 16, 2, 11, BR[0], 1); p.line(9, 16, 16, 11, BR[0], 1);
    [[2, 11], [9, 9], [16, 11]].forEach(function (c) { p.r(c[0] - 2, c[1], 5, 2, C.ink); p.r(c[0] - 1, c[1], 3, 1, BR[1]); p.r(c[0] - 1, c[1] - 6, 3, 7, C.ink); p.r(c[0], c[1] - 6, 1, 7, '#f2ecd8'); p.p(c[0] - 1, c[1] - 5, '#ffffff'); });
  }, {
    light: { dx: 9, dy: 8, r: 44, col: '#ffd890', flick: 0.8 },
    anim: function (ctx, x, y, t, inst) { var p = new PX.Pen(ctx, 1, x, y); flame(p, 2, 5, t, inst.x); flame(p, 9, 3, t + 1, inst.x + 2); flame(p, 16, 5, t + 2, inst.x + 4); }
  });

  /* silla del capitán de respaldo alto */
  reg('chairP', 22, 34, 1, 1, function (p) {
    p.r(2, 0, 18, 22, C.ink); p.r(3, 1, 16, 20, '#5a2e22'); p.r(3, 1, 16, 1, '#8a5040'); p.r(3, 1, 2, 20, '#7a4a3a'); p.r(17, 1, 2, 20, '#3a1a12');
    p.r(6, 4, 10, 14, C.ink); p.r(7, 5, 8, 12, '#a01a2c'); p.r(7, 5, 8, 1, '#e04a5c'); p.r(7, 16, 8, 1, '#5a0a14'); p.p(11, 10, BR[0]); p.p(9, 8, BR[0]); p.p(13, 12, BR[0]);
    p.circ(4, 1, 2.2, C.ink); p.circ(4, 1, 1.4, BR[0]); p.circ(18, 1, 2.2, C.ink); p.circ(18, 1, 1.4, BR[0]);
    p.r(0, 20, 22, 8, C.ink); p.r(1, 21, 20, 6, '#c4283c'); p.r(1, 21, 20, 1, '#ff6070'); p.r(1, 26, 20, 1, '#6b0f1c');
    p.r(2, 28, 3, 6, C.ink); p.r(17, 28, 3, 6, C.ink); p.r(3, 28, 1, 5, WD[1]); p.r(18, 28, 1, 5, WD[1]);
  });

  /* ====================== BODEGA ====================== */
  /* cofre del tesoro cerrado con candado (tarea): el oro brilla por las rendijas */
  reg('treasureChest', 52, 46, 3, 2, function (p) {
    var i;
    p.ell(26, 43, 25, 3, 'rgba(0,0,0,0.3)');
    p.r(2, 22, 48, 20, C.ink); p.r(3, 23, 46, 18, '#7a4a2a'); p.r(3, 23, 46, 1, '#b07a4a'); p.r(3, 40, 46, 1, '#3e2210');
    for (i = 0; i < 6; i++) p.r(3 + i * 8, 24, 1, 16, '#4a2810');
    p.ell(26, 15, 24, 11, C.ink); p.r(2, 15, 48, 8, C.ink); p.ell(26, 15, 23, 10, '#8a5a34'); p.r(3, 15, 46, 7, '#8a5a34'); p.ell(22, 9, 14, 4, p.pat('#c08a50', 8));
    p.dith(3, 14, 46, 8, '#3e2210', 3);
    [[6, 12], [22, 5], [41, 12]].forEach(function (b) { p.r(b[0], b[1], 5, 41 - b[1], BR[2]); p.r(b[0], b[1], 4, 41 - b[1], BR[0]); p.r(b[0], b[1], 1, 41 - b[1], BR[1]); p.p(b[0] + 2, 26, C.ink); p.p(b[0] + 2, 36, C.ink); });
    p.r(2, 20, 48, 4, C.ink); p.r(3, 21, 46, 2, BR[0]); p.r(3, 21, 46, 1, BR[1]); p.r(3, 23, 46, 1, BR[2]);
    p.r(2, 22, 5, 8, BR[2]); p.r(45, 22, 5, 8, BR[2]); p.r(2, 22, 5, 1, BR[1]); p.r(45, 22, 5, 1, BR[1]);
    p.r(19, 23, 14, 12, C.ink); p.r(20, 24, 12, 10, BR[0]); p.r(20, 24, 12, 2, BR[1]); p.r(25, 27, 2, 4, C.ink);
    p.r(22, 33, 8, 3, C.ink); p.r(23, 34, 6, 1, IR[1]); p.r(23, 36, 6, 6, C.ink); p.r(24, 37, 4, 4, BR[0]); p.r(24, 37, 1, 4, BR[1]); p.p(25, 39, C.ink);        // candado
    p.circ(26, 8, 3, C.ink); p.circ(26, 8, 2.2, '#c4283c'); p.p(25, 7, '#ffd0d0');
    for (i = 0; i < 6; i++) { var cx = 6 + i * 9 + (i % 2) * 2, cy = 43 + (i % 2); p.ell(cx, cy, 2.2, 1.3, C.ink); p.ell(cx, cy, 1.6, 0.9, i % 2 ? BR[1] : BR[0]); }
    p.line(40, 41, 47, 44, '#f2f0ff', 1); p.p(43, 43, '#ffffff');
  }, {
    light: { dx: 26, dy: 24, r: 46, col: '#ffe08a', glow: '#ffb030', flick: 0.4 },
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), a = 0.5 + 0.5 * Math.sin(t * 3), k = Math.floor(t * 4) % 5;
      p.r(8, 21, 11, 1, a > 0.5 ? '#fff6b0' : '#ffe45c'); p.r(33, 21, 11, 1, a > 0.5 ? '#ffe45c' : '#fff6b0');
      spark(p, [8, 17, 35, 43, 26][k], [20, 22, 22, 20, 13][k], '#ffffff');
    }
  });

  /* estante de cordaje y faroles */
  reg('shelfN', 34, 52, 2, 1, function (p) {
    var j, i;
    p.r(0, 0, 34, 52, C.ink); p.r(1, 1, 32, 50, '#3e2a1a'); p.r(1, 1, 32, 1, '#6a4a2c'); p.r(1, 1, 2, 50, '#5a3c22'); p.r(31, 1, 2, 50, '#241408');
    for (j = 0; j < 3; j++) {
      var y = 3 + j * 16;
      p.r(3, y, 28, 13, '#150c06'); p.r(2, y + 13, 30, 2, '#7a5530'); p.r(2, y + 14, 30, 1, '#241408');
      if (j === 0) { lantern(p, 5, y + 1, false); p.r(17, y + 5, 7, 8, C.ink); p.r(18, y + 6, 5, 6, IR[0]); p.r(18, y + 6, 1, 6, IR[1]); p.r(23, y + 7, 4, 2, C.ink); p.r(25, y + 4, 4, 3, RP[2]); }
      else if (j === 1) { [[9, 11], [22, 11]].forEach(function (c) { p.ell(c[0], y + c[1] - 4, 7, 5, C.ink); p.ell(c[0], y + c[1] - 5, 6, 4, RP[0]); p.ell(c[0], y + c[1] - 5, 3.4, 2, RP[2]); p.ell(c[0], y + c[1] - 5, 1.6, 0.8, '#150c06'); p.r(c[0] - 4, y + c[1] - 8, 3, 1, RP[1]); }); }
      else { for (i = 0; i < 2; i++) { p.poly([4 + i * 13, y + 5, 14 + i * 13, y + 5, 13 + i * 13, y + 13, 5 + i * 13, y + 13], C.ink); p.poly([5 + i * 13, y + 6, 13 + i * 13, y + 6, 12 + i * 13, y + 12, 6 + i * 13, y + 12], IR[0]); p.r(5 + i * 13, y + 6, 8, 1, IR[1]); } p.r(28, y + 4, 3, 9, '#2a6a66'); p.r(28, y + 4, 3, 1, '#4aa8a0'); }
    }
    p.r(2, 50, 4, 2, C.ink); p.r(28, 50, 4, 2, C.ink);
  });

  /* costales. v: a claro · b oscuro */
  reg('sackPile', 34, 28, 2, 1, function (p, o) {
    var c = o.v === 'b' ? ['#a08a66', '#c4aa80', '#6a5638'] : ['#c8b484', '#e4d4a4', '#8a7850'];
    function sack(cx, by, w, h) {
      p.ell(cx, by - h / 2, w / 2 + 1, h / 2 + 1, C.ink); p.ell(cx, by - h / 2, w / 2, h / 2, c[0]); p.ell(cx - w / 5, by - h * 0.65, w / 4, h / 4, c[1]); p.ell(cx + w / 4, by - h * 0.3, w / 5, h / 4, c[2]);
      p.r(cx - 3, by - h - 2, 6, 4, C.ink); p.r(cx - 2, by - h - 1, 4, 3, c[1]); p.r(cx - 3, by - h + 1, 6, 1, RP[0]);
    }
    p.ell(17, 26, 16, 2.6, 'rgba(0,0,0,0.3)');
    sack(9, 25, 14, 15); sack(23, 25, 14, 13); sack(16, 14, 13, 12);
    p.r(5, 17, 6, 4, '#e8e0f0'); p.r(6, 19, 4, 1, c[2]); p.line(21, 10, 27, 13, c[2], 1);
  });

  /* balas de cañón en su cajón */
  reg('ballPile', 24, 22, 1, 1, function (p) {
    p.ell(12, 20, 11, 2.4, 'rgba(0,0,0,0.3)'); p.r(1, 15, 22, 6, C.ink); p.r(2, 16, 20, 4, WD[0]); p.r(2, 16, 20, 1, WD[1]); p.r(2, 19, 20, 1, WD[2]);
    [[6, 14], [12, 14], [18, 14], [9, 9], [15, 9], [12, 4]].forEach(function (b) { p.circ(b[0], b[1], 3.6, C.ink); p.circ(b[0], b[1], 2.8, '#2a2e3a'); p.p(b[0] - 1, b[1] - 1, '#7a8498'); p.p(b[0] - 1, b[1], '#4a5468'); });
  });

  /* remos apoyados en la pared */
  reg('oars', 24, 46, 1, 1, function (p) {
    p.ell(12, 44, 9, 2, 'rgba(0,0,0,0.3)');
    [[5, 9, 0], [11, 14, 1], [16, 19, 2]].forEach(function (o) {
      p.line(o[0], 44, o[1], 14, C.ink, 4); p.line(o[0], 44, o[1], 14, WD[0], 2); p.line(o[0] - 1, 44, o[1] - 1, 14, WD[1], 1);
      p.ell(o[1] + 0.5, 8, 3.8, 8, C.ink); p.ell(o[1] + 0.5, 8, 2.8, 7, o[2] === 1 ? '#c8a060' : '#b08050'); p.r(o[1] - 2, 3, 5, 2, o[2] === 2 ? '#2a5ab0' : '#c4283c'); p.r(o[1] - 1, 2, 1, 11, '#d8b078');
    });
    rope(p, 4, 34, 18, 32);
  });

  /* gotera de una tubería: la gota cae y salpica */
  reg('dripper', 14, 34, 0, 0, function (p) {
    p.ell(8, 30, 6, 2.4, '#0e1e2a'); p.ell(8, 30, 5, 1.8, '#1c3a4a'); p.r(3, 30, 3, 1, '#4aa8b0');
    p.r(0, 2, 9, 6, C.ink); p.r(1, 3, 7, 4, IR[0]); p.r(1, 3, 7, 1, IR[1]); p.r(8, 1, 3, 8, C.ink); p.r(8, 2, 2, 6, '#5a3a22'); p.r(2, 5, 2, 1, '#8a5a3a');
  }, {
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y), u = (t * 0.9 + (inst.x % 7) * 0.13) % 1;
      if (u < 0.86) { var dy = 9 + u / 0.86 * 17; p.r(9, dy, 1, 3, '#9ad8f0'); p.p(9, dy, '#ffffff'); }
      else { var r = (u - 0.86) / 0.14; p.ell(9, 29.5, 1.5 + r * 5, 0.8 + r * 1.4, p.pat('#9ad8f0', 8 - Math.round(r * 5))); }
    }
  });

  /* ====================== CALABOZO ====================== */
  /* jaula de hierro. v: e abierta y vacía · s con esqueleto · f con un peluche de Foxy que brilla */
  reg('cage', 38, 48, 2, 1, function (p, o) {
    var v = o.v || 'e', i;
    p.ell(19, 45, 17, 2.6, 'rgba(0,0,0,0.3)');
    p.r(2, 7, 34, 34, C.ink); p.r(3, 8, 32, 32, '#080c12'); p.dith(3, 8, 32, 32, '#1c2630', 3);
    p.r(3, 34, 32, 6, '#2a2418'); for (i = 0; i < 7; i++) { p.r(4 + i * 4.5, 34 + (i % 3), 3, 1, '#d0b060'); }
    if (v === 's') {
      p.circ(19, 29, 4.6, C.ink); p.circ(19, 29, 3.8, '#e8e0d0'); p.r(16, 28, 2, 2, C.ink); p.r(20, 28, 2, 2, C.ink); p.r(17, 32, 5, 2, '#e8e0d0'); p.p(18, 32, C.ink); p.p(20, 32, C.ink);
      p.r(14, 34, 11, 4, C.ink); for (i = 0; i < 3; i++) p.r(15 + i * 4, 35, 2, 2, '#e8e0d0'); p.line(8, 37, 15, 36, '#e8e0d0', 2); p.line(30, 37, 24, 36, '#e8e0d0', 2);
      p.poly([12, 25, 26, 25, 28, 28, 10, 28], '#14141e'); p.line(12, 25, 26, 25, BR[0], 1);
    } else if (v === 'f') {
      SPR.head('foxy', p.at(p.ox + 9, p.oy + 12, 0.4), {}); p.dith(3, 8, 32, 32, '#05030a', 5);
      p.r(7, 34, 24, 5, '#80201a'); p.r(7, 34, 24, 1, '#b33a24');
    } else {
      p.r(10, 36, 16, 3, '#6a5a38'); p.p(14, 34, '#d0b060'); p.p(22, 35, '#d0b060');
    }
    p.r(0, 2, 38, 6, C.ink); p.r(1, 3, 36, 4, IR[0]); p.r(1, 3, 36, 1, IR[1]); p.circ(19, 2, 3.4, C.ink); p.circ(19, 2, 2.4, IR[1]); p.circ(19, 2, 1.2, C.ink);
    p.r(0, 40, 38, 6, C.ink); p.r(1, 41, 36, 4, IR[0]); p.r(1, 41, 36, 1, IR[1]); p.r(1, 44, 36, 1, IR[2]);
    for (i = 0; i < 9; i++) {
      var bx = 3 + i * 3.8;
      if (v === 'e' && i > 3 && i < 6) continue;                                      // puerta abierta
      p.r(bx, 8, 2, 32, C.ink); p.r(bx, 8, 1, 32, IR[1]); p.r(bx + 1, 8, 1, 32, IR[2]);
    }
    p.r(1, 22, 36, 3, C.ink); p.r(2, 23, 34, 1, IR[0]);
    if (v === 'e') { p.poly([18, 9, 25, 11, 25, 38, 18, 39], C.ink); p.poly([19, 10, 24, 12, 24, 37, 19, 38], 'rgba(70,82,106,0.6)'); p.line(19, 10, 19, 38, IR[1], 1); p.r(24, 24, 3, 6, BR[0]); p.p(25, 25, BR[1]); }
    else { p.r(17, 22, 5, 7, C.ink); p.r(18, 23, 3, 5, BR[0]); p.p(18, 23, BR[1]); }
  }, {
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y);
      if (inst.v === 'f') { var fl = Math.sin(t * 2.4 + inst.x) > -0.2; p.ell(21, 25, 1.8, 1.8, fl ? '#ffe45c' : '#b8820c'); p.p(21, 24, '#ffffff'); if (Math.floor(t * 1.3) % 7 === 0) p.r(18, 25, 6, 1, C.ink); }
      if (inst.v === 's' && Math.sin(t * 1.9) > 0.9) { p.p(17, 28, '#ff3b4a'); p.p(21, 28, '#ff3b4a'); }
    }
  });

  /* esqueleto de pirata sentado contra la pared */
  reg('skelSit', 28, 34, 1, 1, function (p) {
    var B = '#e8e0d0', i;
    p.ell(14, 31, 11, 2.4, 'rgba(0,0,0,0.3)');
    p.r(4, 27, 8, 5, C.ink); p.r(5, 28, 6, 3, '#2a1a10'); p.r(16, 27, 8, 5, C.ink); p.r(17, 28, 6, 3, '#2a1a10');
    p.r(6, 18, 4, 10, C.ink); p.r(7, 18, 2, 9, B); p.r(18, 18, 4, 10, C.ink); p.r(19, 18, 2, 9, B);
    p.r(5, 14, 18, 5, C.ink); p.r(6, 15, 16, 3, B); p.r(6, 15, 16, 1, '#ffffff'); p.r(13, 15, 2, 3, '#8a8470');
    p.r(7, 5, 14, 11, C.ink); p.r(8, 6, 12, 9, '#14141e'); for (i = 0; i < 4; i++) p.r(9, 7 + i * 2, 10, 1, B); p.r(13, 6, 2, 9, B);
    p.r(2, 6, 4, 13, C.ink); p.r(3, 7, 2, 11, B); p.r(22, 6, 4, 13, C.ink); p.r(23, 7, 2, 11, B); p.circ(4, 19, 2, C.ink); p.circ(4, 19, 1.2, B); p.circ(24, 19, 2, C.ink); p.circ(24, 19, 1.2, B);
    p.circ(14, 3, 5.4, C.ink); p.circ(14, 3, 4.6, B); p.r(11, 2, 3, 3, C.ink); p.r(15, 2, 3, 3, C.ink); p.r(13, 6, 3, 2, C.ink); p.p(12, 7, B); p.p(15, 7, B);
    p.poly([4, 1, 24, 0, 27, 4, 14, 2, 1, 4], C.ink); p.poly([5, 1, 23, 1, 25, 3, 14, 2, 3, 3], '#1c1c28'); p.line(5, 1, 23, 1, BR[0], 1);
    p.circ(14, 1, 1, '#e8e0d0');
  }, {
    anim: function (ctx, x, y, t, inst) { if (Math.sin(t * 1.7 + inst.x) > 0.86) { var p = new PX.Pen(ctx, 1, x, y); p.p(12, 3, '#ff3b4a'); p.p(16, 3, '#ff3b4a'); } }
  });

  /* mesita del guardia con llaves, jarra y cartas */
  reg('tableGuard', 40, 36, 2, 1, function (p) {
    var i;
    p.ell(20, 34, 18, 2.4, 'rgba(0,0,0,0.3)');
    p.r(4, 26, 5, 9, C.ink); p.r(5, 26, 3, 8, WD[0]); p.r(31, 26, 5, 9, C.ink); p.r(32, 26, 3, 8, WD[2]);
    p.r(2, 16, 36, 12, C.ink); p.r(3, 17, 34, 10, WD[0]); p.r(3, 17, 34, 2, WD[1]); p.r(3, 26, 34, 1, WD[2]);
    p.ell(20, 12, 19, 8, C.ink); p.ell(20, 12, 18, 7, WD[1]); p.ell(18, 10, 12, 3, p.pat('#e0b078', 8)); for (i = 0; i < 3; i++) p.line(6 + i * 3, 15 + i, 33 - i * 2, 15 + i, WD[0], 1);
    p.circ(10, 10, 3.4, C.ink); p.circ(10, 10, 2.4, IR[1]); p.circ(10, 10, 1.2, '#8a6a3a'); p.r(9, 13, 2, 4, IR[0]); p.r(12, 12, 3, 1, IR[1]); p.r(8, 14, 3, 1, IR[1]);
    p.r(19, 4, 7, 8, C.ink); p.r(20, 5, 5, 6, '#c8a060'); p.r(20, 5, 5, 1, '#e8c888'); p.r(26, 6, 3, 4, C.ink); p.r(26, 7, 2, 2, '#c8a060');
    p.r(13, 8, 5, 6, C.ink); p.r(14, 9, 3, 4, '#f2ecd8'); p.r(16, 8, 5, 6, C.ink); p.r(17, 9, 3, 4, '#f2ecd8'); p.p(14, 10, '#c4283c'); p.p(18, 10, '#14141e');
    p.r(30, 3, 4, 9, C.ink); p.r(31, 4, 2, 8, '#e8e0d0'); p.r(29, 11, 6, 2, BR[0]);
  }, {
    light: { dx: 32, dy: 2, r: 40, col: '#ffd890', flick: 0.8 },
    anim: function (ctx, x, y, t, inst) { flame(new PX.Pen(ctx, 1, x, y), 32, 4, t, inst.x); }
  });

  /* ====================== DECORACIÓN ====================== */
  /* red de pesca: rejilla en diagonal dentro de un rectángulo */
  function mesh(p, x0, y0, w, h, col) {
    var k, n = w + h;
    for (k = 6; k < n; k += 6) {
      p.line(x0 + Math.min(k, w), y0 + Math.max(0, k - w), x0 + Math.max(0, k - h), y0 + Math.min(k, h), col, 1);
      p.line(x0 + Math.max(0, w - k), y0 + Math.max(0, k - w), x0 + Math.min(w, w - k + h), y0 + Math.min(k, h), col, 1);
    }
  }

  dec('woodSign', 60, 15, function (p, o) {
    var txt = o.text || 'CUBIERTA', w = PX.Pen.prototype.txtW.call(p, txt, 1) + 10;
    p.line(3, 0, 3, 3, RP[0], 1); p.line(w - 4, 0, w - 4, 3, RP[0], 1);
    p.r(0, 3, w, 11, C.ink); p.r(1, 4, w - 2, 9, WD[0]); p.r(1, 4, w - 2, 1, WD[1]); p.r(1, 12, w - 2, 1, WD[2]); p.r(1, 8, w - 2, 1, 'rgba(62,40,20,0.35)');
    p.txt(txt, 5, 6, '#f6e8b0', 1); p.p(2, 8, IR[1]); p.p(w - 3, 8, IR[1]);
  });
  dec('porthole', 24, 24, function (p) {
    var k;
    p.circ(12, 12, 12, C.ink); p.circ(12, 12, 11, BR[2]); p.circ(12, 12, 10, BR[0]); p.circ(12, 12, 8, C.ink); p.circ(12, 12, 7, '#0c1a3a');
    p.dith(5, 12, 14, 7, '#1a4a78', 7); p.dith(5, 15, 14, 4, '#2a7aa8', 5);
    p.circ(16, 8, 2.4, '#f2f0ff'); p.circ(17.4, 7, 2, '#0c1a3a'); p.p(8, 7, '#ffffff'); p.p(10, 10, '#9a90ff'); p.p(6, 11, '#9a90ff');
    p.r(6, 17, 5, 1, '#4ab0c8'); p.r(13, 15, 6, 1, '#4ab0c8'); p.line(5, 8, 7, 5, '#c8e8ff', 1);
    p.line(3, 9, 6, 4, BR[1], 1); for (k = 0; k < 8; k++) p.p(12 + Math.cos(k * 0.785) * 9.6 - 0.5, 12 + Math.sin(k * 0.785) * 9.6 - 0.5, C.ink);
  });
  dec('jollyFlag', 32, 26, function (p) {
    p.poly([2, 2, 30, 3, 28, 10, 31, 17, 27, 24, 2, 22], C.ink); p.poly([3, 3, 29, 4, 27, 10, 30, 17, 26, 23, 3, 21], '#16161f'); p.dith(22, 4, 8, 19, '#2a2a3c', 6);
    for (var i = 0; i < 3; i++) p.line(9 + i * 8, 4, 9 + i * 8, 21, '#1f1f2c', 1);
    p.line(8, 6, 24, 18, '#e8e0f0', 2); p.line(24, 6, 8, 18, '#e8e0f0', 2); p.circ(8, 6, 1.4, '#e8e0f0'); p.circ(24, 6, 1.4, '#e8e0f0'); p.circ(8, 18, 1.4, '#e8e0f0'); p.circ(24, 18, 1.4, '#e8e0f0');
    p.circ(16, 11, 5.4, '#16161f'); p.circ(16, 11, 4.6, '#f2f0ff'); p.r(13, 10, 3, 3, '#16161f'); p.r(17, 10, 3, 3, '#16161f'); p.p(16, 13, '#16161f'); p.r(13, 15, 7, 2, '#f2f0ff'); p.p(15, 16, '#16161f'); p.p(17, 16, '#16161f');
    p.r(0, 0, 4, 4, C.ink); p.r(1, 1, 2, 2, IR[1]);
  });
  dec('lifebuoy', 20, 20, function (p) {
    var q, k, pts;
    p.circ(10, 10, 10, C.ink); p.circ(10, 10, 9, '#f2f0ff');
    for (q = 0; q < 4; q += 2) { pts = [10, 10]; for (k = 0; k <= 6; k++) pts.push(10 + Math.cos((q + k / 6) * Math.PI / 2) * 9.6, 10 + Math.sin((q + k / 6) * Math.PI / 2) * 9.6); p.poly(pts, '#c4283c'); }
    p.circ(10, 10, 4.8, C.ink); p.circ(10, 10, 3.8, '#14243e'); p.r(4, 3, 3, 1, '#ffffff'); p.r(14, 15, 3, 1, '#a89cc0'); p.p(2, 9, RP[0]); p.p(17, 10, RP[0]);
  });
  dec('swordsX', 30, 30, function (p) {
    p.line(4, 4, 26, 26, C.ink, 4); p.line(4, 4, 26, 26, '#aeb9cc', 2); p.line(3, 4, 25, 26, '#e8f0ff', 1);
    p.line(26, 4, 4, 26, C.ink, 4); p.line(26, 4, 4, 26, '#aeb9cc', 2); p.line(25, 4, 3, 26, '#e8f0ff', 1);
    p.line(2, 9, 9, 2, BR[0], 2); p.line(21, 2, 28, 9, BR[0], 2); p.circ(3, 3, 2, BR[0]); p.circ(27, 3, 2, BR[0]);
    p.circ(15, 15, 6.6, C.ink); p.circ(15, 15, 5.6, '#c4283c'); p.circ(15, 15, 3.6, '#8a1a2e'); p.circ(15, 15, 2, BR[0]); p.p(14, 14, BR[1]); p.line(10, 11, 12, 9, '#ff6070', 1);
  });
  dec('shackles', 22, 34, function (p) {
    var i;
    p.r(7, 0, 8, 5, C.ink); p.r(8, 1, 6, 3, IR[0]); p.r(8, 1, 6, 1, IR[1]); p.circ(11, 7, 3.6, C.ink); p.circ(11, 7, 2.4, '#0a1012'); p.p(10, 5, IR[1]);
    for (i = 0; i < 6; i++) { p.ell(6, 10 + i * 3, 1.6, 2.2, C.ink); p.ell(6, 10 + i * 3, 1, 1.6, i % 2 ? IR[1] : IR[0]); p.ell(16, 10 + i * 3, 1.6, 2.2, C.ink); p.ell(16, 10 + i * 3, 1, 1.6, i % 2 ? IR[0] : IR[1]); }
    [3, 13].forEach(function (x) { p.r(x - 2, 27, 9, 7, C.ink); p.r(x - 1, 28, 7, 5, IR[0]); p.r(x - 1, 28, 7, 1, IR[1]); p.r(x + 1, 29, 3, 3, '#0a1012'); });
  });
  dec('lanternWall', 14, 22, function (p) {
    p.r(5, 0, 4, 4, IR[0]); p.r(5, 0, 4, 1, IR[1]); p.line(7, 4, 7, 7, IR[0], 1); lantern(p, 3, 7, true);
    p.ell(7, 13, 6.4, 6.6, p.pat('#ffc060', 2));
  });
  dec('posterFoxy', 36, 42, function (p) {
    sb(p, 0, 0, 36, 42, '#e8d8a8', '#f6ecc8', '#a89868');
    p.r(2, 2, 32, 8, '#80201a'); p.r(2, 2, 32, 1, '#b33a24'); p.txt('SE BUSCA', 3, 4, '#f6e8b0', 1);
    SPR.head('foxy', p.at(p.ox + 8, p.oy + 11, 0.42), {});
    p.r(2, 32, 32, 8, '#3a2a14'); p.txt('FOXY', 4, 34, '#f6e8b0', 1); p.txt('$500', 21, 34, '#ffe45c', 1);
    p.r(15, 0, 6, 2, '#b33a24');
  });
  dec('keyRack', 26, 20, function (p) {
    var i;
    p.r(0, 0, 26, 8, C.ink); p.r(1, 1, 24, 6, WD[0]); p.r(1, 1, 24, 1, WD[1]); p.r(1, 6, 24, 1, WD[2]);
    for (i = 0; i < 5; i++) { var x = 4 + i * 5; p.p(x, 3, IR[1]); p.line(x, 4, x, 10, C.ink, 1); p.circ(x, 11, 1.6, C.ink); p.circ(x, 11, 0.9, i % 2 ? BR[0] : IR[1]); p.r(x - 1, 12, 3, 4 + i % 2, C.ink); p.r(x, 12, 1, 3 + i % 2, i % 2 ? BR[0] : IR[1]); }
  });
  dec('netHang', 38, 32, function (p) {
    var i;
    p.line(1, 2, 37, 2, RP[0], 2); mesh(p, 4, 4, 30, 24, RP[0]);
    p.line(2, 3, 7, 28, RP[0], 1); p.line(36, 3, 31, 28, RP[0], 1); p.line(7, 28, 31, 28, RP[0], 1);
    for (i = 0; i < 4; i++) { p.circ(9 + i * 7, 29, 2.4, C.ink); p.circ(9 + i * 7, 29, 1.6, i % 2 ? '#e8e0f0' : '#c4283c'); }
    p.circ(15, 14, 1.4, C.ink); p.p(25, 9, '#e8e0f0');
  });
  dec('cannonPort', 24, 22, function (p) {
    p.r(1, 4, 22, 17, C.ink); p.r(2, 5, 20, 15, '#05030a'); p.r(2, 5, 20, 2, '#14100c');
    p.r(0, 0, 24, 6, C.ink); p.r(1, 1, 22, 4, WD[0]); p.r(1, 1, 22, 1, WD[1]); p.r(1, 4, 22, 1, WD[2]); p.p(2, 2, IR[1]); p.p(21, 2, IR[1]);
    p.circ(12, 14, 5.6, C.ink); p.circ(12, 14, 4.6, '#3c4252'); p.circ(12, 14, 3, '#05030a'); p.p(10, 12, '#7a8498'); p.r(10, 17, 5, 1, '#1c2030');
  });
  dec('ropeHang', 16, 30, function (p) {
    var i;
    p.r(6, 0, 4, 3, C.ink); p.r(7, 0, 2, 2, IR[1]); p.line(8, 3, 8, 5, IR[0], 1);
    for (i = 0; i < 4; i++) { p.ell(8, 9 + i * 4.4, 6, 2.6, C.ink); p.ell(8, 8.6 + i * 4.4, 5.2, 2, RP[0]); p.r(4, 8 + i * 4.4, 3, 1, RP[1]); }
    p.line(12, 24, 14, 29, RP[0], 1); p.line(13, 24, 15, 28, RP[2], 1);
  });

  dec('poolWater', 80, 44, function (p) {
    p.ell(40, 22, 39.5, 21.5, p.pat('#3a2e1c', 8)); p.ell(40, 22, 37, 19.5, p.pat('#e8f8f8', 7)); p.ell(40, 22, 35, 17.5, '#2e7480'); p.ell(40, 23, 28, 12.5, '#1f5868'); p.ell(40, 25, 18, 7, '#164050');
    p.dith(8, 8, 64, 10, '#4aa8b0', 5); p.r(16, 14, 14, 1, '#9ae0e0'); p.r(44, 11, 16, 1, '#9ae0e0'); p.r(28, 24, 10, 1, '#6ac4c8'); p.r(50, 28, 12, 1, '#6ac4c8'); p.r(20, 32, 8, 1, '#4a9aa8');
    p.p(24, 18, '#ffffff'); p.p(54, 20, '#ffffff'); p.p(38, 14, '#d8ffff');
  }, { floor: true });
  dec('netFloor', 52, 32, function (p) {
    p.poly([3, 6, 18, 2, 40, 4, 50, 14, 46, 28, 22, 30, 6, 24, 1, 14], 'rgba(0,0,0,0.25)'); mesh(p, 4, 5, 44, 22, RP[0]);
    p.line(3, 6, 18, 2, RP[0], 1); p.line(18, 2, 40, 4, RP[0], 1); p.line(40, 4, 50, 14, RP[0], 1); p.line(46, 28, 22, 30, RP[2], 1); p.line(22, 30, 6, 24, RP[2], 1);
    [[8, 4], [24, 2], [44, 8], [34, 29]].forEach(function (f, i) { p.circ(f[0], f[1], 2.6, C.ink); p.circ(f[0], f[1], 1.8, i % 2 ? '#e8e0f0' : '#c4283c'); });
  }, { floor: true });
  dec('ropeFloor', 46, 14, function (p) {
    var i;
    for (i = 0; i < 16; i++) { var x = 2 + i * 2.7, y = 7 + Math.sin(i * 0.8) * 4; p.ell(x, y + 1, 2.4, 2, C.ink); }
    for (i = 0; i < 16; i++) { var x2 = 2 + i * 2.7, y2 = 7 + Math.sin(i * 0.8) * 4; p.ell(x2, y2, 2.2, 1.6, i % 2 ? RP[0] : RP[1]); }
    p.line(1, 7, 0, 4, RP[0], 1); p.line(44, 8, 46, 11, RP[0], 1);
  }, { floor: true });
  dec('hatch', 34, 34, function (p) {
    var i;
    p.r(0, 0, 34, 34, C.ink); p.r(1, 1, 32, 32, WD[2]); p.r(1, 1, 32, 1, WD[1]); p.r(1, 1, 1, 32, WD[0]);
    p.r(4, 4, 26, 26, C.ink); for (i = 0; i < 6; i++) { p.r(5, 5 + i * 4, 24, 2, '#3a2a18'); p.r(5, 6 + i * 4, 24, 1, '#5a4228'); }
    for (i = 0; i < 6; i++) p.r(5 + i * 4, 5, 1, 24, '#14100c');
    p.circ(17, 17, 4.4, C.ink); p.circ(17, 17, 3.2, IR[1]); p.circ(17, 17, 1.8, C.ink); p.p(16, 16, '#ffffff');
    p.p(2, 2, IR[1]); p.p(31, 2, IR[1]); p.p(2, 31, IR[1]); p.p(31, 31, IR[1]);
  }, { floor: true });
  dec('rugCabin', 96, 64, function (p) {
    var i;
    p.r(0, 0, 96, 64, '#0c1030'); p.r(2, 2, 92, 60, '#1f3560'); p.r(5, 5, 86, 54, '#7a1a2c'); p.dith(5, 5, 86, 54, '#4a0e1a', 3);
    p.r(8, 8, 80, 48, '#a01a30'); p.dith(8, 8, 80, 48, '#6a1020', 4);
    p.r(11, 11, 74, 1, BR[0]); p.r(11, 52, 74, 1, BR[0]); p.r(11, 11, 1, 42, BR[0]); p.r(84, 11, 1, 42, BR[0]);
    for (i = 0; i < 5; i++) { p.poly([20 + i * 14, 14, 24 + i * 14, 18, 20 + i * 14, 22, 16 + i * 14, 18], BR[2]); p.poly([20 + i * 14, 42, 24 + i * 14, 46, 20 + i * 14, 50, 16 + i * 14, 46], BR[2]); }
    p.ell(48, 32, 17, 13, BR[2]); p.ell(48, 32, 15.6, 11.6, '#1f3560'); p.ell(48, 32, 12, 9, p.pat('#2c4a80', 6));
    p.r(47, 22, 2, 18, BR[0]); p.r(42, 26, 12, 2, BR[0]); p.circ(48, 23, 2.4, BR[0]); p.circ(48, 23, 1.2, '#1f3560'); p.line(41, 34, 48, 40, BR[0], 2); p.line(55, 34, 48, 40, BR[0], 2); p.r(41, 32, 2, 3, BR[0]); p.r(53, 32, 2, 3, BR[0]);
    for (i = 0; i < 96; i += 3) { p.r(i, 0, 1, 2, '#d8c890'); p.r(i, 62, 1, 2, '#d8c890'); }
  }, { floor: true });
  dec('compassRose', 52, 52, function (p) {
    var k, d = '#2a1a0a', g = '#8a6410';
    for (k = 0; k < 40; k++) p.p(25.5 + Math.cos(k * 0.157) * 23.5, 25.5 + Math.sin(k * 0.157) * 23.5, d);
    for (k = 0; k < 40; k += 2) p.p(25.5 + Math.cos(k * 0.157) * 21, 25.5 + Math.sin(k * 0.157) * 21, g);
    p.poly([26, 31, 30, 31, 26, 50, 22, 31], d); p.poly([26, 21, 30, 21, 26, 2, 22, 21], d); p.poly([21, 26, 21, 22, 2, 26, 21, 30], d); p.poly([31, 26, 31, 22, 50, 26, 31, 30], d);
    p.poly([26, 21, 26, 2, 22, 21], g); p.poly([21, 26, 2, 26, 21, 30], g); p.poly([26, 31, 26, 50, 30, 31], g); p.poly([31, 26, 50, 26, 31, 22], g);
    p.line(26, 26, 38, 14, g, 2); p.line(26, 26, 14, 14, d, 2); p.line(26, 26, 14, 38, g, 2); p.line(26, 26, 38, 38, d, 2);
    p.circ(26, 26, 3.4, d); p.circ(26, 26, 2, '#d8a820'); p.txt('N', 24, 6, '#d8a820', 1);
  }, { floor: true });
  /* huellas de garra de Foxy (rojizas). o.dir: u d l r */
  dec('clawPrints', 26, 18, function (p, o) {
    var d = o.dir || 'd', fx = d === 'l' ? -1 : d === 'r' ? 1 : 0, fy = d === 'u' ? -1 : d === 'd' ? 1 : 0, i, k, cx, cy, c = p.pat('#8a2a1c', 12);
    for (i = 0; i < 3; i++) {
      cx = 13 + fx * (i - 1) * 9 + (fx ? 0 : (i % 2 ? 3 : -3)); cy = 9 + fy * (i - 1) * 5 + (fy ? 0 : (i % 2 ? 2 : -2));
      p.ell(cx, cy, 2.6, 2, c);
      for (k = -1; k <= 1; k++) p.line(cx + fx * 2 - fy * k * 2, cy + fy * 2 + fx * k * 2, cx + fx * 6 - fy * k * 3, cy + fy * 6 + fx * k * 3, c, 1);
    }
  }, { floor: true });
  /* escalón del puente (vertical) */
  dec('stepEdge', 8, 112, function (p) {
    p.r(0, 0, 8, 112, 'rgba(0,0,0,0.28)'); p.r(0, 0, 3, 112, '#4a3418'); p.r(3, 0, 1, 112, '#e8c878'); p.r(4, 0, 1, 112, '#7a5628'); p.dith(5, 0, 3, 112, '#1c1208', 6);
    for (var i = 4; i < 112; i += 16) { p.p(1, i, '#e8c040'); }
  }, { floor: true });
  dec('coins', 28, 14, function (p) {
    [[4, 4], [11, 8], [17, 4], [22, 9], [8, 11], [24, 3]].forEach(function (c, i) { p.ell(c[0], c[1], 2.4, 1.6, C.ink); p.ell(c[0], c[1], 1.8, 1.1, i % 2 ? BR[0] : BR[1]); });
  }, { floor: true });
  dec('strawFloor', 38, 22, function (p) {
    var i;
    for (i = 0; i < 22; i++) { var x = 3 + (i * 11) % 32, y = 3 + (i * 7) % 15; p.line(x, y, x + 3 - (i % 3) * 2, y + 2 - (i % 2), i % 2 ? '#d0b060' : '#a88838', 1); }
  }, { floor: true });
  dec('chainFloor', 46, 14, function (p) {
    for (var i = 0; i < 12; i++) { var x = 3 + i * 3.6, y = 6 + Math.sin(i * 0.7) * 3; p.ell(x, y, 2.3, 1.5, C.ink); p.ell(x, y, 1.6, 0.9, i % 2 ? IR[0] : IR[1]); }
    p.r(40, 7, 5, 4, C.ink); p.r(41, 8, 3, 2, IR[0]);
  }, { floor: true });
  dec('seaweed', 22, 18, function (p) {
    [[4, 12], [9, 15], [14, 11], [18, 14]].forEach(function (s) { p.line(s[0], 17, s[0] + 2, s[1] - 12 + 14, '#1e5a3a', 2); p.line(s[0] + 2, s[1] + 2, s[0] - 1, s[1] - 1, '#2e8a4a', 1); p.p(s[0] - 1, s[1] - 1, '#6ac47a'); });
    p.dith(2, 15, 18, 3, '#7ac8c8', 4);
  }, { floor: true });
  dec('bonesFloor', 24, 14, function (p) {
    var B = '#e8e0d0';
    p.line(2, 10, 12, 6, C.ink, 3); p.line(2, 10, 12, 6, B, 1); p.circ(2, 10, 1.6, B); p.circ(12, 6, 1.6, B);
    p.line(10, 12, 21, 11, C.ink, 3); p.line(10, 12, 21, 11, B, 1); p.circ(21, 11, 1.6, B);
    p.circ(15, 6, 3.4, C.ink); p.circ(15, 6, 2.6, B); p.p(14, 5, C.ink); p.p(16, 5, C.ink);
  }, { floor: true });
})(window);
