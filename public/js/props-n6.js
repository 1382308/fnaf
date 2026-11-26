/* props-n6.js — Noche 6 (La Trastienda): sala de cabezas, almacén de partes, vestidor de trajes,
   taller de reparación y oficina de servicio. Mismo estilo que props-a/b/c/n2..n5: vista 3/4,
   contorno de tinta, luz arriba-izquierda y sombra abajo-derecha. */
(function (G) {
  'use strict';
  var C = PX.C, A = G.PROPS_API, reg = A.reg, dec = A.dec, sb = A.sb;
  var SL = ['#4a5878', '#8a9cc0', '#242c40'];       // acero azulado: base, luz, sombra
  var CU = ['#b0642c', '#f0a868', '#6a3410'];       // cobre
  var CB = ['#a8804c', '#d8b078', '#5a4020'];       // cartón
  var WD = ['#7a5230', '#b87a42', '#3b2414'];       // madera
  var MT = ['#8a929c', '#d0d8e0', '#4a525c'];       // metal claro

  /* hacia dónde está el jugador (-1..1): las cabezas lo siguen con la mirada */
  function gaze(inst, st, cx, cy) {
    var dx = (st ? st.px : 0) - (inst.x + cx), dy = (st ? st.py : 0) - 12 - (inst.y + cy), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 40);
    return { x: dx / d * k, y: dy / d * k };
  }
  /* pestañeo: de vez en cuando y siempre al terminar la tarea */
  function blinks(t, st) { return (st && st.done === 'done') || (Math.floor(t * 0.9) % 6 === 5 && t * 0.9 % 1 < 0.14); }

  /* ====================== TAREAS ====================== */
  /* cabeza de repuesto sobre un pedestal con placa (TAREA). v: freddy · bonnie · chica · foxy */
  reg('spareHead', 32, 46, 2, 1, function (p, o) {
    var name = String(o.v || 'freddy').toUpperCase();
    p.ell(16, 43, 14, 2.4, 'rgba(0,0,0,0.3)');
    p.r(12, 26, 8, 9, C.ink); p.r(13, 26, 6, 9, SL[0]); p.r(13, 26, 2, 9, SL[1]);                              // cuello
    sb(p, 1, 33, 30, 11, SL[0], SL[1], SL[2]);
    p.r(3, 36, 26, 6, '#f6f0dc'); p.r(3, 36, 26, 1, '#fff'); p.txt(name, 16 - ((name.length * 4 - 1) >> 1), 37, C.ink, 1);
    p.p(2, 35, MT[1]); p.p(29, 35, MT[1]);
  }, {
    light: { dx: 16, dy: 14, r: 24, col: '#9ac0ff', flick: 0.4 },
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), g = gaze(inst, st, 16, 14);
      SPR.head(inst.v || 'freddy', p.at(p.ox + 1 + Math.round(g.x * 1.5), p.oy, 0.6), { lx: g.x * 1.8, ly: g.y * 1.8, blink: blinks(t, st) });
    }
  });

  /* endoesqueleto colgado de un pórtico con cadena (TAREA) */
  reg('endoHang', 48, 90, 3, 1, function (p) {
    var i;
    p.ell(24, 86, 22, 3, 'rgba(0,0,0,0.3)');
    [1, 43].forEach(function (x) { p.r(x, 5, 4, 83, C.ink); p.r(x + 1, 5, 2, 83, SL[0]); p.r(x + 1, 5, 1, 83, SL[1]); p.r(x - 2, 84, 8, 4, C.ink); p.r(x - 1, 85, 6, 2, SL[2]); });
    p.r(0, 0, 48, 7, C.ink); p.r(1, 1, 46, 5, SL[0]); p.r(1, 1, 46, 1, SL[1]); p.r(1, 5, 46, 1, SL[2]);        // viga
    p.r(23, 7, 2, 12, C.ink); for (i = 0; i < 4; i++) p.r(23, 8 + i * 3, 2, 1, MT[1]);                          // cadena
    p.circ(24, 27, 8, C.ink); p.circ(24, 27, 7, '#b8c0c8'); p.circ(24, 27, 7, p.pat('#e8f0f4', 9));
    p.r(18, 33, 12, 5, C.ink); p.r(19, 34, 10, 3, '#8a929c'); for (i = 0; i < 4; i++) p.r(20 + i * 2, 35, 1, 2, C.ink);   // mandíbula
    p.r(17, 25, 5, 5, C.ink); p.r(26, 25, 5, 5, C.ink);                                                         // cuencas
    p.r(23, 38, 2, 24, C.ink); p.r(23, 38, 1, 24, MT[1]); p.r(24, 38, 1, 24, SL[0]);                            // columna
    for (i = 0; i < 4; i++) { p.r(15, 41 + i * 4, 18, 2, C.ink); p.r(16, 41 + i * 4, 16, 1, MT[0]); }
    p.line(15, 42, 10, 60, C.ink, 3); p.line(15, 42, 10, 60, MT[0], 1); p.line(33, 42, 38, 60, C.ink, 3); p.line(33, 42, 38, 60, MT[0], 1);
    p.circ(9, 62, 3, C.ink); p.circ(9, 62, 2, MT[1]); p.circ(39, 62, 3, C.ink); p.circ(39, 62, 2, MT[1]);       // manos
    p.r(17, 61, 14, 6, C.ink); p.r(18, 62, 12, 4, SL[0]); p.r(18, 62, 12, 1, SL[1]);                            // pelvis
    p.line(20, 67, 19, 82, C.ink, 4); p.line(20, 67, 19, 82, MT[0], 2); p.line(28, 67, 29, 82, C.ink, 4); p.line(28, 67, 29, 82, MT[0], 2);
    p.r(15, 81, 8, 3, C.ink); p.r(25, 81, 8, 3, C.ink);
  }, {
    light: { dx: 24, dy: 27, r: 30, col: '#ff3a3a', flick: 0.5 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), g = 0.5 + Math.sin(t * 2.2) * 0.5;
      p.r(19, 26, 3, 3, 'rgba(255,' + Math.round(40 + g * 60) + ',40,' + (0.55 + g * 0.45).toFixed(2) + ')');
      p.r(27, 26, 3, 3, 'rgba(255,' + Math.round(40 + g * 60) + ',40,' + (0.55 + g * 0.45).toFixed(2) + ')');
      p.p(20, 26, '#ffffff'); p.p(28, 26, '#ffffff');
    }
  });

  /* terminal de servicio: monitor verde sobre un escritorio de metal (TAREA) */
  reg('serviceTerminal', 48, 54, 3, 1, function (p) {
    var i;
    p.ell(24, 51, 22, 2.6, 'rgba(0,0,0,0.3)');
    sb(p, 0, 30, 48, 22, SL[0], SL[1], SL[2]);
    p.r(2, 32, 44, 4, SL[1]); p.r(2, 36, 44, 1, SL[2]);
    p.r(4, 39, 18, 10, '#1a2030'); p.r(4, 39, 18, 1, SL[2]); p.r(26, 39, 18, 5, '#1a2030'); p.r(26, 45, 18, 4, '#1a2030');
    p.r(11, 43, 5, 1, MT[1]); p.r(33, 41, 5, 1, MT[1]); p.r(33, 47, 5, 1, MT[1]);
    p.r(15, 22, 18, 9, C.ink); p.r(18, 24, 12, 7, SL[2]);                                                       // pie del monitor
    sb(p, 7, 0, 34, 26, '#c8c4a8', '#f0ecd4', '#6a6650');
    p.r(10, 3, 28, 17, C.ink); p.r(11, 4, 26, 15, '#06180f');
    p.txt('X=', 13, 6, '#3fd479', 1); p.r(13, 13, 14, 1, '#1f8a4c'); p.r(13, 15, 10, 1, '#1f8a4c');
    p.r(10, 21, 28, 3, '#a8a48a'); p.p(34, 22, '#ff3b4a');
    p.r(8, 27, 24, 4, C.ink); p.r(9, 28, 22, 2, '#2c3548'); for (i = 0; i < 9; i++) p.r(10 + i * 2.4, 28, 1, 1, '#98a8c0');   // teclado
    p.r(36, 27, 9, 4, '#f6f0dc'); p.r(36, 27, 9, 1, '#fff'); p.r(37, 29, 6, 1, '#8f87b5');                       // papeles
  }, {
    light: { dx: 24, dy: 12, r: 40, col: '#3fe08a', flick: 0.3 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      if (Math.sin(t * 3.4) > 0) p.r(23, 6, 3, 5, '#a4ffc4');
      p.r(11, 4 + ((t * 9) % 15 | 0), 26, 1, 'rgba(164,255,196,0.18)');
    }
  });

  /* ====================== TALLER ====================== */
  /* mesa de reparación con un brazo a medio armar, tornillo de banco y caja de herramientas */
  reg('repairBench', 64, 46, 4, 2, function (p) {
    var i;
    p.ell(32, 43, 30, 3, 'rgba(0,0,0,0.3)');
    [2, 58].forEach(function (x) { p.r(x, 30, 4, 14, C.ink); p.r(x + 1, 30, 2, 14, SL[0]); });
    sb(p, 0, 10, 64, 24, WD[0], WD[1], WD[2]);
    p.r(2, 12, 60, 14, '#8e5e36'); p.r(2, 12, 60, 1, '#c68a4e'); for (i = 0; i < 6; i++) p.r(6 + i * 10, 15 + (i * 3) % 7, 7, 1, '#7a4c28');
    p.r(2, 26, 60, 1, '#2a180c'); p.r(2, 27, 60, 6, '#5a3820');
    p.r(5, 28, 22, 4, '#3b2414'); p.r(30, 28, 12, 4, '#3b2414');                                                 // cajón
    p.r(8, 17, 22, 4, C.ink); p.r(9, 18, 20, 2, MT[0]); p.r(9, 18, 20, 1, MT[1]);                                // brazo mecánico
    p.circ(9, 19, 4, C.ink); p.circ(9, 19, 3, SL[1]); p.r(27, 16, 8, 6, C.ink); p.r(28, 17, 6, 4, SL[0]); p.r(34, 17, 3, 1, MT[1]); p.r(34, 20, 3, 1, MT[1]);
    p.r(40, 10, 8, 3, C.ink); p.r(40, 6, 8, 5, C.ink); p.r(41, 7, 6, 3, '#b3182b'); p.r(41, 7, 6, 1, '#ff6070');   // caja de herramientas
    p.r(40, 14, 8, 8, C.ink); p.r(41, 15, 6, 6, '#b3182b'); p.r(41, 15, 6, 1, '#ff6070'); p.r(43, 17, 2, 1, MT[1]);
    p.r(53, 6, 8, 9, C.ink); p.r(54, 7, 6, 7, SL[0]); p.r(54, 7, 6, 1, SL[1]); p.r(55, 15, 4, 4, C.ink);          // tornillo de banco
    p.r(60, 9, 2, 9, C.ink); p.line(62, 11, 63, 11, MT[1], 1);
    p.r(17, 21, 1, 3, '#d8c890'); p.r(19, 22, 1, 2, '#d8c890'); p.p(22, 23, '#a0a8b0'); p.p(14, 24, '#a0a8b0'); p.p(37, 23, '#a0a8b0');   // tornillos sueltos
    p.line(50, 22, 56, 24, '#d8d0b0', 1); p.p(56, 24, '#b3182b');                                                // destornillador
  });

  /* mesa de soldar con lupa articulada y humo; el soldador brilla */
  reg('solderBench', 48, 42, 3, 1, function (p) {
    var i;
    p.ell(24, 40, 22, 2.6, 'rgba(0,0,0,0.3)');
    sb(p, 0, 14, 48, 25, SL[0], SL[1], SL[2]);
    p.r(2, 16, 44, 10, '#3a4658'); p.r(2, 16, 44, 1, SL[1]); p.r(2, 26, 44, 1, C.ink);
    p.r(3, 28, 18, 8, '#1a2030'); p.r(3, 28, 18, 1, SL[2]); p.r(8, 31, 7, 1, MT[1]);
    p.r(26, 28, 18, 8, '#1a2030'); p.r(26, 28, 18, 1, SL[2]);
    p.r(14, 17, 16, 8, C.ink); p.r(15, 18, 14, 6, '#1e6a40'); for (i = 0; i < 4; i++) { p.r(17 + i * 3, 19, 2, 2, C.ink); p.p(17 + i * 3, 19, MT[1]); }    // placa
    p.line(16, 22, 27, 22, '#d8c890', 1);
    p.r(34, 19, 10, 3, C.ink); p.r(35, 20, 8, 1, MT[0]); p.r(38, 18, 5, 2, CU[0]);                              // soldador y soporte
    p.r(4, 17, 6, 8, C.ink); p.r(5, 18, 4, 6, '#d8c890');                                                        // carrete de estaño
    p.r(5, 3, 3, 15, C.ink); p.r(6, 3, 1, 15, SL[1]); p.line(7, 4, 18, 1, C.ink, 2); p.line(7, 4, 18, 1, SL[0], 1);   // brazo de la lupa
    p.circ(20, 7, 6, C.ink); p.circ(20, 7, 4.6, '#cfe8f0'); p.circ(20, 7, 4.6, p.pat('#8ab0c0', 6)); p.p(18, 5, '#fff');
  }, {
    light: { dx: 20, dy: 14, r: 30, col: '#cfe8ff', flick: 0.4 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, f;
      p.r(34, 19, 2, 2, Math.sin(t * 5) > -0.3 ? '#ff6a2a' : '#c8401a');
      for (i = 0; i < 3; i++) { f = (t * 0.55 + i / 3) % 1; p.circ(35 + Math.sin(t * 2 + i * 2) * 2, 17 - f * 14, 1 + f * 2.2, 'rgba(210,214,220,' + (0.5 * (1 - f)).toFixed(2) + ')'); }
      if (Math.sin(t * 8) + Math.sin(t * 2.7) > 1.6) { p.p(36, 20, '#ffffff'); p.p(34, 18, '#aee8ff'); p.p(38, 19, '#fff6b0'); }
    }
  });

  /* carrito con un endoesqueleto desarmado */
  reg('endoCart', 48, 32, 3, 1, function (p) {
    var i;
    p.ell(24, 30, 22, 2.4, 'rgba(0,0,0,0.3)');
    sb(p, 0, 16, 48, 8, SL[0], SL[1], SL[2]);
    p.r(44, 4, 2, 14, C.ink); p.r(40, 3, 7, 3, C.ink); p.r(41, 4, 5, 1, MT[1]);                                  // manija
    [5, 40].forEach(function (x) { p.circ(x + 2, 27, 3, C.ink); p.circ(x + 2, 27, 1.6, MT[0]); p.r(x + 1, 24, 2, 3, C.ink); });
    p.circ(9, 11, 6, C.ink); p.circ(9, 11, 5, '#b8c0c8'); p.r(5, 9, 3, 3, C.ink); p.r(10, 9, 3, 3, C.ink); p.r(7, 14, 5, 2, '#8a929c');   // cráneo
    p.r(17, 8, 14, 9, C.ink); for (i = 0; i < 3; i++) { p.r(18, 9 + i * 3, 12, 1, MT[0]); } p.r(23, 8, 2, 9, SL[2]);   // tórax
    p.line(32, 12, 42, 14, C.ink, 3); p.line(32, 12, 42, 14, MT[0], 1);
    p.line(20, 17, 34, 19, C.ink, 3); p.line(20, 17, 34, 19, MT[1], 1); p.circ(35, 19, 2, MT[0]);
    p.r(14, 17, 5, 2, '#d8a010');
  });

  /* carrete grande de cable con la punta suelta */
  reg('cableReel', 32, 30, 2, 1, function (p) {
    var i;
    p.ell(16, 28, 14, 2.4, 'rgba(0,0,0,0.3)');
    p.line(22, 24, 28, 27, C.ink, 2); p.line(22, 24, 28, 27, '#b3182b', 1); p.p(29, 27, '#d8b030');
    p.circ(14, 14, 13, C.ink); p.circ(14, 14, 12, WD[0]); p.circ(14, 14, 12, p.pat(WD[1], 4));
    p.circ(14, 14, 9, C.ink); p.circ(14, 14, 8, '#2a5aa0');
    for (i = 7; i >= 3; i -= 2) p.circ(14, 14, i + 1, i % 4 === 3 ? '#1e4278' : '#4a7ac0');
    p.circ(14, 14, 3, C.ink); p.circ(14, 14, 2, '#8a929c'); p.p(13, 13, MT[1]);
    p.r(12, 24, 4, 3, C.ink); p.r(5, 26, 18, 2, WD[2]);
  });

  /* ====================== SALA DE CABEZAS ====================== */
  /* estante con máscaras vacías de los cuatro animatrónicos (sin ojos) */
  reg('headRack', 48, 62, 3, 1, function (p) {
    var i, j, c = ['#6b3216', '#6a2cc0', '#f2c21c', '#b33a24'];
    p.ell(24, 59, 22, 2.6, 'rgba(0,0,0,0.3)');
    sb(p, 0, 4, 48, 56, WD[0], WD[1], WD[2]);
    p.r(3, 7, 42, 50, '#1c1008');
    for (j = 0; j < 3; j++) {
      var y = 24 + j * 15;
      p.r(3, y, 42, 3, '#6b4223'); p.r(3, y, 42, 1, WD[1]);
      for (i = 0; i < 3; i++) {
        var cx = 10 + i * 14, col = c[(i + j) % 4];
        p.ell(cx, y - 7, 5.4, 6, C.ink); p.ell(cx, y - 7, 4.4, 5, col); p.ell(cx - 1, y - 9, 2, 1.4, 'rgba(255,255,255,0.25)');
        p.r(cx - 3, y - 9, 2, 3, C.ink); p.r(cx + 1, y - 9, 2, 3, C.ink);                                        // cuencas vacías
        if ((i + j) % 4 === 1) { p.r(cx - 4, y - 16, 2, 6, C.ink); p.r(cx + 2, y - 16, 2, 6, C.ink); p.r(cx - 3, y - 15, 1, 5, col); p.r(cx + 3, y - 15, 1, 5, col); }
      }
    }
    p.r(0, 0, 48, 5, C.ink); p.r(1, 1, 46, 3, WD[1]); p.r(1, 1, 46, 1, '#d8a060');
  });

  /* caja con ojos sueltos que miran al jugador */
  reg('eyeCrate', 30, 26, 2, 1, function (p) {
    p.ell(15, 24, 14, 2.4, 'rgba(0,0,0,0.3)');
    sb(p, 0, 10, 30, 15, WD[0], WD[1], WD[2]);
    p.r(2, 12, 26, 11, WD[2]); p.r(0, 18, 30, 1, WD[2]);
    p.r(6, 15, 18, 7, '#f6f0dc'); p.txt('OJOS', 8, 16, C.ink, 1);
    [[6, 8], [15, 6], [24, 8]].forEach(function (e) { p.circ(e[0], e[1], 4.2, C.ink); p.circ(e[0], e[1], 3.4, '#f2f0ff'); });
  }, {
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), g = gaze(inst, st, 15, 8), e = [[6, 8, '#5ab4ff'], [15, 6, '#e040e0'], [24, 8, '#3fd479']];
      e.forEach(function (q) { p.circ(q[0] + g.x * 1.4, q[1] + g.y * 1.2, 1.8, q[2]); p.p(q[0] + g.x * 1.4, q[1] + g.y * 1.2, C.ink); });
    }
  });

  /* tina con orejas sueltas de repuesto */
  reg('earBin', 20, 28, 1, 1, function (p) {
    p.ell(10, 26, 9, 2, 'rgba(0,0,0,0.3)');
    p.r(5, 2, 4, 14, C.ink); p.r(6, 2, 2, 13, '#6a2cc0'); p.r(6, 3, 1, 10, '#a05cff');                            // orejas de conejo
    p.r(11, 5, 4, 12, C.ink); p.r(12, 5, 2, 11, '#6a2cc0'); p.circ(15, 12, 3, C.ink); p.circ(15, 12, 2, '#9a4c22');
    p.circ(4, 14, 3, C.ink); p.circ(4, 14, 2, '#9a4c22');                                                         // orejas redondas
    sb(p, 1, 14, 18, 12, SL[0], SL[1], SL[2]);
    p.r(3, 17, 14, 6, '#161c28'); p.circ(7, 15, 2, '#6b3216'); p.circ(13, 15, 2, '#6b3216');
  });

  /* ====================== ALMACÉN DE PARTES ====================== */
  /* caja de madera con el rótulo PARTS. v: a cerrada · b abierta con brazos dentro */
  reg('partsCrate', 32, 34, 2, 1, function (p, o) {
    var open = o.v === 'b', i;
    p.ell(16, 32, 15, 2.6, 'rgba(0,0,0,0.3)');
    sb(p, 0, 8, 32, 25, WD[0], WD[1], WD[2]);
    for (i = 0; i < 3; i++) p.r(2, 14 + i * 6, 28, 1, WD[2]);
    p.r(0, 8, 3, 25, WD[2]); p.r(29, 8, 3, 25, WD[2]);
    p.r(5, 17, 22, 9, C.ink); p.r(6, 18, 20, 7, '#e8e0c0'); p.txt('PARTS', 7, 19, C.ink, 1);
    if (open) {
      p.r(2, 2, 28, 8, C.ink); p.r(3, 3, 26, 6, '#161008');
      p.line(6, 8, 14, 1, C.ink, 3); p.line(6, 8, 14, 1, MT[0], 1); p.line(22, 8, 26, 0, C.ink, 3); p.line(22, 8, 26, 0, MT[1], 1);
      p.circ(15, 1, 2, MT[1]);
    } else { p.r(0, 4, 32, 6, C.ink); p.r(1, 5, 30, 4, WD[1]); p.r(1, 5, 30, 1, '#d8a060'); p.r(14, 5, 4, 4, MT[0]); }
  });

  /* tarima con cajas envueltas en plástico */
  reg('partsPallet', 32, 48, 2, 1, function (p) {
    var i;
    p.ell(16, 46, 15, 2.4, 'rgba(0,0,0,0.3)');
    p.r(0, 40, 32, 6, C.ink); p.r(1, 41, 30, 2, '#9a7a4c'); p.r(1, 41, 30, 1, '#c8a064');
    for (i = 0; i < 4; i++) p.r(2 + i * 8, 43, 5, 3, '#6a4a28');
    sb(p, 1, 22, 30, 18, CB[0], CB[1], CB[2]); p.r(2, 31, 28, 1, CB[2]); p.r(7, 24, 18, 5, '#e8e0c0'); p.txt('PARTS', 8, 25, C.ink, 1);
    sb(p, 3, 5, 26, 18, CB[0], CB[1], CB[2]); p.r(14, 5, 4, 18, '#c8b078'); p.r(5, 12, 5, 1, CB[2]);
    p.line(2, 40, 14, 6, 'rgba(255,255,255,0.28)', 1); p.line(18, 40, 29, 8, 'rgba(255,255,255,0.2)', 1);
  });

  /* estantería metálica con cajas rotuladas */
  reg('partsShelf', 48, 62, 3, 1, function (p) {
    var i, j, lab = [['ARMS', 'EYES'], ['LEGS', 'EARS'], ['JAWS', 'GEAR']];
    p.ell(24, 59, 22, 2.6, 'rgba(0,0,0,0.3)');
    p.r(1, 2, 46, 56, '#141a26');
    [0, 44].forEach(function (x) { p.r(x, 0, 4, 60, C.ink); p.r(x + 1, 0, 2, 60, SL[0]); p.r(x + 1, 0, 1, 60, SL[1]); });
    for (j = 0; j < 3; j++) {
      var y = 19 + j * 15;
      for (i = 0; i < 2; i++) {
        var bx = 5 + i * 21;
        sb(p, bx, y - 13, 18, 13, CB[0], CB[1], CB[2]); p.r(bx + 2, y - 10, 15, 7, '#e8e0c0'); p.txt(lab[j][i], bx + 2, y - 9, C.ink, 1);
      }
      p.r(0, y, 48, 3, C.ink); p.r(1, y, 46, 2, SL[0]); p.r(1, y, 46, 1, SL[1]);
    }
    p.r(0, 56, 48, 3, SL[2]);
  });

  /* cesto de alambre con brazos y piernas de repuesto */
  reg('limbBin', 32, 34, 2, 1, function (p) {
    var i;
    p.ell(16, 32, 15, 2.6, 'rgba(0,0,0,0.3)');
    p.line(7, 16, 4, 1, C.ink, 4); p.line(7, 16, 4, 1, MT[0], 2); p.circ(4, 1, 2, MT[1]);
    p.line(14, 16, 18, 0, C.ink, 4); p.line(14, 16, 18, 0, '#d0a060', 2);
    p.line(22, 16, 28, 3, C.ink, 4); p.line(22, 16, 28, 3, MT[0], 2); p.r(26, 1, 5, 3, C.ink); p.r(27, 2, 3, 1, MT[1]);
    p.r(1, 12, 30, 20, C.ink); p.r(2, 13, 28, 18, '#141a26');
    for (i = 0; i < 6; i++) { p.r(4 + i * 5, 13, 1, 18, SL[0]); p.r(4 + i * 5, 13, 1, 1, SL[1]); }
    for (i = 0; i < 3; i++) p.r(2, 17 + i * 6, 28, 1, SL[0]);
    p.r(0, 11, 32, 3, C.ink); p.r(1, 12, 30, 1, SL[1]);
  });

  /* ====================== VESTIDOR ====================== */
  /* barra de la que cuelgan trajes vacíos; los trajes se mecen */
  reg('suitRail', 64, 62, 4, 1, function (p) {
    p.ell(32, 59, 30, 2.8, 'rgba(0,0,0,0.3)');
    [1, 59].forEach(function (x) { p.r(x, 4, 4, 54, C.ink); p.r(x + 1, 4, 2, 54, SL[0]); p.r(x + 1, 4, 1, 54, SL[1]); p.r(x - 2, 55, 8, 4, C.ink); p.r(x - 1, 56, 6, 2, SL[2]); });
    p.r(0, 2, 64, 5, C.ink); p.r(1, 3, 62, 3, MT[0]); p.r(1, 3, 62, 1, MT[1]); p.r(1, 5, 62, 1, MT[2]);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), cols = [['#6b3216', '#9a4c22'], ['#6a2cc0', '#a05cff'], ['#d8a410', '#fff0a0'], ['#80201a', '#d9663c']];
      cols.forEach(function (c, i) {
        var cx = 12 + i * 13, sw = Math.round(Math.sin(t * 1.2 + i * 1.7) * 1.4);
        p.r(cx, 7, 1, 5, MT[0]);
        p.r(cx - 5 + sw, 12, 11, 17, C.ink); p.r(cx - 4 + sw, 13, 9, 15, c[0]); p.r(cx - 4 + sw, 13, 3, 15, c[1]);
        p.ell(cx + sw, 12, 3, 1.4, C.ink); p.ell(cx + sw, 12, 2, 0.8, '#0a0714');                                  // cuello vacío
        p.r(cx - 8 + sw * 2, 14, 3, 13, C.ink); p.r(cx - 7 + sw * 2, 14, 1, 12, c[0]); p.r(cx + 5 + sw * 2, 14, 3, 13, C.ink); p.r(cx + 6 + sw * 2, 14, 1, 12, c[0]);
        p.r(cx - 4 + sw, 29, 4, 17, C.ink); p.r(cx - 3 + sw, 29, 2, 16, c[0]); p.r(cx + 1 + sw, 29, 4, 17, C.ink); p.r(cx + 2 + sw, 29, 2, 16, c[0]);
        p.r(cx - 1 + sw, 17, 3, 5, '#f6f0dc');
      });
    }
  });

  /* traje sin cabeza sobre un soporte. v: f Freddy · b Bonnie · c Chica */
  reg('suitStand', 20, 56, 1, 1, function (p, o) {
    var c = o.v === 'b' ? ['#6a2cc0', '#a05cff'] : o.v === 'c' ? ['#d8a410', '#fff0a0'] : ['#6b3216', '#9a4c22'];
    p.ell(10, 54, 9, 2, 'rgba(0,0,0,0.3)');
    p.r(9, 30, 2, 22, C.ink); p.r(9, 30, 1, 22, SL[1]); p.r(3, 51, 14, 3, C.ink); p.r(4, 51, 12, 1, SL[0]);
    p.r(3, 11, 14, 19, C.ink); p.r(4, 12, 12, 17, c[0]); p.r(4, 12, 3, 17, c[1]); p.ell(10, 11, 4, 1.8, C.ink); p.ell(10, 11, 3, 1.2, '#0a0714');
    p.r(0, 13, 4, 14, C.ink); p.r(1, 14, 2, 12, c[0]); p.r(16, 13, 4, 14, C.ink); p.r(17, 14, 2, 12, c[0]);
    p.r(4, 30, 5, 18, C.ink); p.r(5, 30, 3, 17, c[0]); p.r(11, 30, 5, 18, C.ink); p.r(12, 30, 3, 17, c[0]);
    p.r(8, 18, 4, 4, '#f6f0dc');
    if (o.v === 'c') { p.r(7, 23, 6, 4, '#f2f0ff'); p.r(8, 24, 4, 1, '#a05cff'); } else p.r(8, 22, 4, 2, '#b3182b');
  });

  /* mesa de coser con máquina; la aguja sube y baja */
  reg('sewingTable', 44, 36, 3, 1, function (p) {
    var i;
    p.ell(22, 34, 20, 2.4, 'rgba(0,0,0,0.3)');
    sb(p, 0, 16, 44, 18, WD[0], WD[1], WD[2]);
    p.r(2, 18, 40, 6, '#8e5e36'); p.r(2, 18, 40, 1, '#c68a4e'); p.r(3, 26, 12, 5, '#3b2414'); p.r(18, 26, 22, 6, '#2a180c');
    p.r(6, 8, 22, 6, C.ink); p.r(7, 9, 20, 4, '#d8d0b8'); p.r(7, 9, 20, 1, '#fff'); p.r(22, 3, 8, 12, C.ink); p.r(23, 4, 6, 10, '#d8d0b8');   // máquina
    p.r(26, 14, 3, 3, C.ink); p.r(23, 6, 1, 3, 'rgba(0,0,0,0.5)');
    p.circ(31, 8, 3, C.ink); p.circ(31, 8, 2, MT[0]);
    p.r(33, 4, 5, 8, C.ink); p.r(34, 5, 3, 6, '#b3182b'); p.r(34, 4, 3, 1, '#ff6070');                          // carrete
    p.r(1, 16, 20, 3, '#c8508a'); p.r(1, 16, 20, 1, '#f080b8'); for (i = 0; i < 5; i++) p.p(3 + i * 4, 17, '#a03a6a');   // tela
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), n = Math.round(Math.sin(t * 9) * 1.5);
      p.r(26, 14 + n, 1, 4 - n, MT[1]); p.p(31 + Math.round(Math.cos(t * 9) * 2), 8, C.ink);
    }
  });

  /* ====================== OFICINA ====================== */
  /* rack de cargadores con luces de estado que cambian */
  reg('chargerBank', 48, 48, 3, 1, function (p) {
    var i, j;
    p.ell(24, 46, 22, 2.6, 'rgba(0,0,0,0.3)');
    sb(p, 0, 2, 48, 44, SL[0], SL[1], SL[2]);
    p.r(3, 5, 42, 8, C.ink); p.r(4, 6, 40, 6, '#e8e0c0'); p.txt('CARGA', 6, 7, C.ink, 1); p.r(30, 7, 12, 3, '#d8a010');
    for (j = 0; j < 3; j++) for (i = 0; i < 4; i++) {
      var x = 5 + i * 10, y = 16 + j * 10;
      p.r(x, y, 9, 8, C.ink); p.r(x + 1, y + 1, 7, 6, '#1a2030'); p.r(x + 2, y + 2, 5, 3, '#3a4658'); p.r(x + 3, y + 1, 3, 1, MT[1]);
    }
    p.r(0, 43, 48, 3, SL[2]);
  }, {
    light: { dx: 24, dy: 24, r: 28, col: '#3fd479', flick: 0.5 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, j, v;
      for (j = 0; j < 3; j++) for (i = 0; i < 4; i++) {
        v = Math.floor(t * 0.6 + i * 1.3 + j * 2.1) % 3;
        p.r(7 + i * 10, 22 + j * 10, 3, 1, v === 0 ? '#3fd479' : v === 1 ? '#ffb030' : '#ff3b4a');
      }
    }
  });

  /* ====================== DECORACIÓN DE PARED ====================== */
  /* tablero perforado con herramientas colgadas y sus siluetas */
  dec('toolWall', 46, 30, function (p) {
    var i;
    p.r(0, 0, 46, 30, C.ink); p.r(1, 1, 44, 28, '#5a4630'); p.r(1, 1, 44, 1, '#8a6e4a');
    for (i = 0; i < 44; i += 5) for (var j = 3; j < 28; j += 5) p.p(2 + i, j, '#2a2018');
    p.r(5, 4, 3, 14, '#8a929c'); p.r(3, 4, 7, 3, C.ink); p.r(4, 4, 5, 2, SL[1]);                                  // llave inglesa
    p.r(15, 5, 2, 14, '#b8c0c8'); p.r(14, 18, 4, 4, '#b3182b');                                                   // destornillador
    p.line(22, 4, 22, 20, '#d8d0b0', 1); p.poly([22, 4, 30, 8, 22, 12], '#8a929c');                              // sierra
    p.r(33, 5, 8, 3, C.ink); p.r(34, 6, 6, 1, MT[1]); p.r(36, 8, 2, 12, '#7a4c28');                               // martillo
    p.r(4, 22, 36, 1, 'rgba(255,255,255,0.15)'); p.r(8, 24, 6, 3, 'rgba(0,0,0,0.35)'); p.r(18, 24, 6, 3, 'rgba(0,0,0,0.35)');   // siluetas vacías
  });

  /* máscaras colgadas de ganchos en una tabla */
  dec('maskWall', 32, 26, function (p) {
    var i, c = ['#6a2cc0', '#6b3216', '#d8a410'];
    p.r(0, 0, 32, 4, C.ink); p.r(1, 1, 30, 2, WD[1]); p.r(1, 1, 30, 1, '#d8a060');
    for (i = 0; i < 3; i++) {
      var cx = 6 + i * 10;
      p.r(cx, 4, 1, 3, MT[0]);
      p.ell(cx, 14, 5, 7, C.ink); p.ell(cx, 14, 4, 6, c[i]); p.r(cx - 3, 11, 2, 3, C.ink); p.r(cx + 1, 11, 2, 3, C.ink); p.r(cx - 2, 18, 4, 1, C.ink);
      if (i === 0) { p.r(cx - 3, 3, 2, 3, c[i]); p.r(cx + 1, 3, 2, 3, c[i]); }
    }
  });

  /* plano azul del endoesqueleto */
  dec('blueprintWall', 34, 26, function (p) {
    var i;
    p.r(0, 0, 34, 26, C.ink); p.r(1, 1, 32, 24, '#1c4a8a');
    for (i = 4; i < 32; i += 6) p.r(i, 1, 1, 24, '#2c64ae');
    for (i = 6; i < 24; i += 6) p.r(1, i, 32, 1, '#2c64ae');
    p.circ(17, 8, 4, '#d8ecff'); p.circ(17, 8, 3, '#1c4a8a'); p.circ(13, 5, 1.6, '#d8ecff'); p.circ(21, 5, 1.6, '#d8ecff');
    p.r(13, 12, 8, 7, '#d8ecff'); p.r(14, 13, 6, 5, '#1c4a8a'); p.r(8, 12, 4, 1, '#d8ecff'); p.r(22, 12, 4, 1, '#d8ecff');
    p.txt('FREDDY', 5, 20, '#d8ecff', 1);
  });

  /* cartel de personal autorizado, amarillo y negro */
  dec('staffOnly', 38, 14, function (p) {
    var i;
    p.r(0, 0, 38, 14, C.ink); p.r(1, 1, 36, 12, '#e8b830'); p.r(1, 1, 36, 1, '#fff078');
    for (i = 0; i < 38; i += 6) { p.poly([i, 0, i + 3, 0, i + 1, 3, i - 2, 3], C.ink); p.poly([i, 14, i + 3, 14, i + 1, 11, i - 2, 11], C.ink); }
    p.r(3, 3, 32, 8, C.ink); p.txt('PERSONAL', 4, 5, '#e8b830', 1);
  });

  /* pizarra de turnos de la oficina */
  dec('dutyBoard', 36, 26, function (p) {
    var i;
    p.r(0, 0, 36, 26, C.ink); p.r(1, 1, 34, 22, '#e8ecf0'); p.r(1, 1, 34, 1, '#fff'); p.r(0, 23, 36, 3, SL[0]); p.r(0, 23, 36, 1, SL[1]);
    p.txt('TURNO', 4, 4, '#b3182b', 1);
    for (i = 0; i < 3; i++) { p.r(4, 11 + i * 4, 3, 3, C.ink); p.r(5, 12 + i * 4, 1, 1, i < 2 ? '#3fd479' : '#e8ecf0'); p.r(10, 12 + i * 4, 20 - i * 4, 1, '#5a6a8a'); }
  });

  /* ====================== DECORACIÓN DE PISO ====================== */
  /* aserrín y virutas */
  dec('sawdust', 30, 14, function (p) {
    p.ell(15, 7, 14, 5, p.pat('#c8a870', 6)); p.ell(12, 6, 8, 3, p.pat('#e8d098', 5));
    p.p(5, 3, '#a0a8b0'); p.p(22, 10, '#c8d0d8'); p.line(8, 10, 12, 8, '#d8b878', 1);
  }, { floor: true });
  /* huellas de oso (dir: r l = horizontales, u d = verticales) */
  dec('bearPrints', 22, 14, function (p, o) {
    var d = o.dir || 'r', v = d === 'r' || d === 'l' ? [[3, 3], [13, 8]] : [[4, 2], [9, 9]];
    v.forEach(function (q) {
      p.ell(q[0] + 4, q[1] + 4, 3.6, 2.6, '#1a1008'); p.ell(q[0] + 4, q[1] + 4, 2.8, 1.8, '#4a2c16');
      p.p(q[0] + 1, q[1], '#4a2c16'); p.p(q[0] + 3, q[1] - 1, '#4a2c16'); p.p(q[0] + 5, q[1] - 1, '#4a2c16'); p.p(q[0] + 7, q[1], '#4a2c16');
    });
  }, { floor: true });
  /* cables sueltos enredados */
  dec('wireTangle', 36, 16, function (p) {
    p.line(1, 12, 10, 4, '#b3182b', 1); p.line(10, 4, 20, 11, '#b3182b', 1); p.line(20, 11, 34, 5, '#b3182b', 1);
    p.line(2, 6, 12, 12, '#2a5aa0', 1); p.line(12, 12, 24, 4, '#2a5aa0', 1); p.line(24, 4, 35, 12, '#2a5aa0', 1);
    p.line(4, 14, 18, 8, '#05030a', 2); p.line(18, 8, 30, 14, '#05030a', 2);
    p.p(1, 12, '#d8b030'); p.p(34, 5, '#d8b030'); p.p(35, 12, '#d8b030');
  }, { floor: true });
  /* tornillos, tuercas y un engranaje regados */
  dec('boltsFloor', 28, 14, function (p) {
    p.circ(7, 8, 3, C.ink); p.circ(7, 8, 2.2, MT[0]); p.circ(7, 8, 0.8, C.ink);
    p.r(14, 4, 4, 1, MT[1]); p.r(14, 5, 4, 1, MT[2]); p.r(20, 9, 1, 3, MT[1]); p.r(23, 6, 3, 1, MT[1]); p.r(11, 11, 3, 1, MT[0]);
    p.circ(17, 9, 2.4, C.ink); p.circ(17, 9, 1.6, CU[0]); p.circ(17, 9, 0.6, C.ink);
  }, { floor: true });
})(window);
