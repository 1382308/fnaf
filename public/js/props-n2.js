/* props-n2.js — Noche 2 (El Escenario): escenario, comedor, cabinas de luces y control, servicio, bodega y camerino.
   Mismo estilo que props-a/b/c: vista 3/4, contorno de tinta, luz arriba-izquierda y sombra abajo-derecha. */
(function (G) {
  'use strict';
  var C = PX.C, A = G.PROPS_API, reg = A.reg, dec = A.dec, sb = A.sb;
  var GOLD = ['#f2c21c', '#fff6b0', '#9a7a0c'];     // dorado: base, luz, sombra

  /* hacia dónde está el jugador (-1..1): los animatrónicos lo siguen con la mirada */
  function gaze(inst, st, cx, cy) {
    var dx = (st ? st.px : 0) - (inst.x + cx), dy = (st ? st.py : 0) - 12 - (inst.y + cy), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 40);
    return { x: dx / d * k, y: dy / d * k };
  }

  /* ====================== ESCENARIO ====================== */
  /* telón de terciopelo recogido con una lazada; se mece despacio */
  reg('telon', 64, 48, 4, 1, function (p, o) {
    var right = o.v === 'r', i, y, g, inner, tx;
    for (i = 0; i < 16; i++) {
      p.r(i * 4, 8, 4, 39, ['#6b1020', '#8a1a2e', '#b3243e', '#8a1a2e'][i % 4]);
      p.r(i * 4, 8, 1, 39, '#4a0a16');
      if (i % 4 === 2) p.r(i * 4 + 1, 8, 1, 39, '#d8485e');
    }
    p.dith(0, 9, 64, 8, '#2e060c', 3);
    for (y = 8; y < 47; y++) {                       // se recorta el borde interior (la lazada)
      g = (y - 28) / 9; inner = 64 - Math.round(22 * Math.exp(-g * g));
      if (right) { p.c.clearRect(p.ox, p.oy + y, 64 - inner, 1); p.r(64 - inner, y, 1, 1, C.ink); }
      else { p.c.clearRect(p.ox + inner, p.oy + y, 64 - inner, 1); p.r(inner - 1, y, 1, 1, C.ink); }
    }
    p.r(right ? 63 : 0, 8, 1, 39, C.ink);
    inner = 42; tx = right ? 22 : inner - 4;         // cordón con borla
    p.r(right ? 22 : 1, 27, inner - 2, 2, GOLD[0]); p.r(right ? 22 : 1, 27, inner - 2, 1, GOLD[1]);
    p.r(tx, 29, 3, 8, GOLD[0]); p.r(tx, 29, 1, 8, GOLD[1]); p.circ(tx + 1, 28, 2.2, GOLD[0]); p.p(tx, 27, GOLD[1]);
    p.r(0, 44, 64, 3, GOLD[2]); p.r(0, 44, 64, 1, GOLD[0]);                      // dobladillo y flecos
    for (i = 1; i < 64; i += 2) p.r(i, 46, 1, 2, GOLD[0]);
    p.r(0, 0, 64, 9, C.ink); p.r(1, 1, 62, 6, '#7a1228'); p.r(1, 1, 62, 1, '#c8384e'); p.r(1, 6, 62, 1, GOLD[0]);   // cenefa festoneada
    for (i = 0; i < 64; i += 8) { p.ell(i + 4, 8, 4, 3, C.ink); p.ell(i + 4, 7, 3.4, 2.4, '#7a1228'); p.r(i + 3, 9, 2, 2, GOLD[0]); }
  }, {
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y), r = inst.v === 'r', hx = 6 + Math.round((Math.sin(t * 0.9 + (r ? 2 : 0)) * 0.5 + 0.5) * 38), i;
      p.r(r ? hx + 14 : hx, 33, 2, 10, 'rgba(255,150,170,0.28)');
      for (i = 1; i < 64; i += 2) p.r(i, 46, 1, 1, ((i + Math.floor(t * 3)) & 2) ? GOLD[1] : GOLD[2]);
    }
  });

  /* letrero luminoso del fondo del escenario */
  var MQ = [];
  (function () { for (var x = 4; x <= 114; x += 8) MQ.push([x, 2], [x, 27]); MQ.push([1, 10], [1, 18], [117, 10], [117, 18]); })();
  reg('marquee', 120, 30, 0, 0, function (p) {
    p.r(0, 0, 120, 30, C.ink); p.r(1, 1, 118, 28, '#6a2cc0'); p.r(1, 1, 118, 1, '#a05cff'); p.r(1, 28, 118, 1, '#3a1070');
    p.r(4, 4, 112, 22, '#1d0c40'); p.dith(4, 4, 112, 22, '#3a1a6a', 4); p.r(4, 4, 112, 1, '#05030a');
    p.txt("FREDDY FAZBEAR'S", 28, 7, GOLD[1], 1); p.r(28, 14, 63, 1, GOLD[2]);
    p.txt('SHOW 6 PM', 25, 16, '#ffffff', 2);
    MQ.forEach(function (b) { p.r(b[0], b[1], 2, 2, '#8a7a30'); });
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), n = Math.floor(t * 6);
      MQ.forEach(function (b, i) { if ((i + n) % 3 === 0) { p.r(b[0] - 1, b[1] - 1, 4, 4, 'rgba(255,224,120,0.3)'); p.r(b[0], b[1], 2, 2, '#fff6b0'); } });
    }
  });

  /* podio redondo: f = Freddy, c = Chica, b = el lugar vacío de Bonnie */
  reg('pedestal', 48, 72, 3, 1, function (p, o) {
    var v = o.v || 'f', m = v === 'b' ? ['#3c1a66', '#5a2a9a', '#220e40'] : ['#5a1f9a', '#8a4ad0', '#3a1070'];
    var name = v === 'f' ? 'FREDDY' : v === 'c' ? 'CHICA' : 'BONNIE';
    p.ell(24, 66, 22, 6, C.ink); p.r(2, 54, 44, 12, C.ink); p.ell(24, 54, 22, 6, C.ink);
    p.ell(24, 66, 21, 5, m[0]); p.r(3, 54, 42, 12, m[0]); p.r(3, 54, 7, 12, m[1]); p.r(38, 54, 7, 12, m[2]);
    p.dith(10, 60, 28, 11, m[2], 4);
    p.ell(24, 54, 21, 5, m[1]); p.ell(24, 54, 17, 3.4, m[0]);
    p.r(3, 58, 42, 2, GOLD[0]); p.r(3, 58, 42, 1, GOLD[1]);
    p.r(11, 61, 26, 7, C.ink); p.r(12, 62, 24, 5, '#e8d890'); p.txt(name, 24 - ((name.length * 4 - 1) >> 1), 63, '#3a1070', 1);
    if (v === 'f') SPR.body('freddy', p.at(13, 7, 0.42), {});
    else if (v === 'c') SPR.body('chica', p.at(13, 7, 0.42), { cake: false });
    else {                                           // sin Bonnie: marcas de los pies, cable cortado y pelusa morada
      p.ell(19, 55, 4, 1.6, m[2]); p.ell(29, 55, 4, 1.6, m[2]); p.p(18, 55, '#8a4ad0'); p.p(28, 55, '#8a4ad0');
      p.line(24, 54, 23, 47, C.ink, 2); p.r(23, 46, 2, 2, '#d8a010');
      p.r(31, 52, 3, 2, C.bn2); p.r(33, 51, 2, 1, C.bn3); p.r(14, 53, 2, 1, C.bn2);
    }
  }, {
    anim: function (ctx, x, y, t, inst, st) {
      var v = inst.v || 'f', p = new PX.Pen(ctx, 1, x, y), bl = (Math.floor(t * 1.1 + inst.x * 0.3) % 6) === 5, g, i, cx, cy;
      if (v === 'b') {
        if (Math.sin(t * 5 + inst.x) > 0.8) { p.r(23, 44 - (t * 9 % 3 | 0), 1, 2, '#fff6b0'); p.r(25, 45, 1, 1, '#ffe45c'); p.r(22, 43, 1, 1, '#ffffff'); }
        p.r(41, 62, 2, 2, Math.sin(t * 3) > 0 ? '#ff3b4a' : '#6b0f1c');
        return;
      }
      g = gaze(inst, st, 24, 17);
      for (i = 0; i < 2; i++) {
        cx = 19.3 + i * 7.6; cy = v === 'f' ? 17.1 : 16.5;
        p.ell(cx, cy, 2.4, 2.4, v === 'f' ? C.ink : C.wh);
        if (bl) { p.r(cx - 2, cy - 1, 5, 2, C.ink); continue; }
        p.ell(cx + g.x * 0.9, cy + g.y * 0.9, v === 'f' ? 1.7 : 1.4, v === 'f' ? 1.7 : 1.4, v === 'f' ? '#5ab4ff' : '#e040e0');
        p.r(cx + g.x * 1.3, cy + g.y * 1.3, 1, 1, C.ink);
      }
      p.r(41, 62, 2, 2, '#3fd479');
    }
  });

  /* frente de la tarima con focos de pie; los focos corren en cadena */
  reg('stageLip', 64, 16, 4, 1, function (p) {
    var i;
    p.r(0, 0, 64, 16, C.ink);
    p.r(1, 0, 62, 3, '#c68a4e'); p.r(1, 0, 62, 1, '#e8b070'); p.r(1, 3, 62, 1, '#6b4223');
    p.r(1, 4, 62, 10, '#4a1478'); p.r(1, 4, 62, 1, '#8a4ad0');
    p.r(1, 6, 62, 2, GOLD[0]); p.r(1, 6, 62, 1, GOLD[1]); p.r(1, 8, 62, 1, GOLD[2]);
    for (i = 0; i < 4; i++) { p.circ(8 + i * 16, 11, 2.3, C.ink); p.circ(8 + i * 16, 11, 1.6, '#8a7a30'); p.r(15 + i * 16, 9, 1, 4, '#2e0a50'); }
    p.r(1, 13, 62, 2, '#1e0a38'); p.r(0, 15, 64, 1, 'rgba(0,0,0,0.5)');
  }, {
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y), n = Math.floor(t * 5), i;
      for (i = 0; i < 4; i++) {
        if ((i + Math.floor(inst.x / 16) + n) % 4 === 0) { p.circ(8 + i * 16, 11, 3.4, 'rgba(255,230,120,0.3)'); p.circ(8 + i * 16, 11, 1.6, '#fff6b0'); }
      }
    }
  });
  dec('stageSteps', 32, 16, function (p) {
    p.r(0, 0, 32, 16, C.ink);
    for (var i = 0; i < 3; i++) {
      var y = 1 + i * 5; p.r(2, y, 28, 5, i === 2 ? '#7a5030' : '#92603a'); p.r(2, y, 28, 1, '#c68a4e'); p.r(2, y + 3, 28, 2, '#4a2c16'); p.r(2, y + 3, 28, 1, '#3b2414');
    }
    p.r(0, 0, 2, 16, '#5a1f9a'); p.r(30, 0, 2, 16, '#5a1f9a'); p.r(0, 0, 1, 16, '#8a4ad0');
    p.circ(1, 14, 2, GOLD[0]); p.circ(31, 14, 2, GOLD[0]); p.p(0, 13, GOLD[1]); p.p(30, 13, GOLD[1]);
  }, { floor: true });

  /* foco de escenario sobre trípode (v: a blanco, b azul, p morado, g verde) */
  var LENS = { a: ['#fff6b0', '#ffe45c'], b: ['#9ac4ff', '#4a8ae0'], p: ['#e0b0ff', '#a05cff'], g: ['#a4ffc4', '#3fd479'] };
  reg('spotStand', 20, 40, 1, 1, function (p, o) {
    var c = LENS[o.v] || LENS.a;
    p.line(10, 24, 3, 38, C.ink, 2); p.line(10, 24, 17, 38, C.ink, 2); p.line(10, 24, 10, 38, C.ink, 2);
    p.line(10, 24, 4, 37, C.mt3, 1); p.line(10, 24, 16, 37, C.mt3, 1); p.r(9, 24, 1, 12, C.mt4);
    p.r(8, 17, 4, 8, C.ink); p.r(9, 18, 2, 6, C.mt3);
    p.r(1, 3, 18, 15, C.ink); p.r(2, 4, 16, 13, '#2c3040'); p.r(2, 4, 16, 1, '#5a6078'); p.r(2, 4, 1, 13, '#46526a');
    p.r(4, 0, 12, 4, C.ink); p.r(5, 1, 10, 2, '#46526a');
    p.ell(10, 11, 6.4, 5.6, C.ink); p.ell(10, 11, 5.4, 4.8, c[1]); p.ell(10, 10, 3.6, 3, c[0]); p.p(8, 9, '#ffffff');
    p.p(1, 17, C.mt5); p.p(18, 17, C.mt5);
  }, {
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y), c = LENS[inst.v] || LENS.a, fl = 0.5 + 0.5 * Math.sin(t * 3 + inst.x);
      p.ell(10, 11, 5, 4.2, fl > 0.3 ? c[0] : c[1]);
      p.poly([10, 8, -8, -34, 28, -34], p.pat(c[0], 2));
    }
  });
  reg('wedge', 32, 14, 2, 1, function (p) {           // monitor de piso
    p.poly([5, 0, 27, 0, 32, 13, 0, 13], C.ink); p.poly([6, 1, 26, 1, 30, 11, 2, 11], '#2a2d3a');
    p.r(6, 1, 20, 1, '#5a6078'); p.dith(7, 3, 18, 7, '#0e1018', 8); p.r(3, 11, 26, 2, '#14161e'); p.r(3, 11, 26, 1, '#46526a');
    p.r(2, 12, 3, 2, C.mt4); p.r(27, 12, 3, 2, C.mt4); p.p(15, 9, '#3fd479');
  });
  reg('drumKit', 56, 46, 3, 1, function (p) {
    var i;
    p.line(9, 10, 9, 30, C.mt2, 1); p.line(47, 8, 47, 30, C.mt2, 1);
    p.ell(9, 9, 9, 3.2, C.ink); p.ell(9, 9, 8, 2.5, GOLD[0]); p.ell(8, 8.5, 4, 1, GOLD[1]); p.p(9, 9, GOLD[2]);
    p.ell(47, 7, 9, 3.2, C.ink); p.ell(47, 7, 8, 2.5, GOLD[0]); p.ell(46, 6.5, 4, 1, GOLD[1]); p.p(47, 7, GOLD[2]);
    [[21, 17], [35, 17]].forEach(function (d) {
      p.r(d[0] - 7, d[1], 15, 7, C.ink); p.ell(d[0], d[1] + 6.5, 7.5, 3, C.ink); p.ell(d[0], d[1], 8, 3.4, C.ink);
      p.r(d[0] - 6, d[1], 13, 7, '#2a5ab0'); p.r(d[0] - 6, d[1], 3, 7, '#6a8ae0'); p.ell(d[0], d[1], 6.6, 2.6, '#e8e0f0'); p.ell(d[0], d[1] - 0.5, 4, 1.2, '#ffffff');
    });
    p.r(3, 28, 14, 5, C.ink); p.ell(10, 33, 7.5, 2.6, C.ink); p.ell(10, 28, 8, 3, C.ink); p.r(4, 28, 12, 5, '#8a94a8'); p.ell(10, 28, 6.6, 2.4, '#e8e0f0');   // tarola
    p.r(38, 27, 16, 8, C.ink); p.ell(46, 35, 8.5, 3, C.ink); p.ell(46, 27, 9, 3.4, C.ink);                                                             // tom de piso
    p.r(39, 27, 14, 8, '#2a5ab0'); p.r(39, 27, 3, 8, '#6a8ae0'); p.ell(46, 27, 7.4, 2.8, '#e8e0f0');
    p.circ(28, 33, 12, C.ink); p.circ(28, 33, 11, '#b3182b'); p.circ(28, 33, 9, '#f2f0ff'); p.circ(28, 33, 8, '#e0dcf0');   // bombo
    p.r(26, 29, 3, 7, '#b3182b'); p.r(26, 29, 5, 2, '#b3182b'); p.r(26, 32, 4, 1, '#b3182b'); p.p(21, 27, '#ffffff'); p.p(22, 27, '#ffffff');
    for (i = 0; i < 8; i++) p.p(28 + Math.round(Math.cos(i * 0.785) * 10.5), 33 + Math.round(Math.sin(i * 0.785) * 10.5), '#ffe45c');
    p.ell(28, 43, 6, 2.4, C.ink); p.ell(28, 42.6, 5, 1.8, '#3a4560'); p.r(27, 44, 2, 2, C.ink);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      p.r(5 + ((t * 9) % 8 | 0), 8, 2, 1, '#ffffff'); p.r(43 + ((t * 7) % 8 | 0), 6, 2, 1, '#ffffff');
    }
  });
  /* amplificadores: combo pequeño y torre */
  reg('ampS', 32, 28, 2, 1, function (p) {
    p.r(0, 0, 32, 28, C.ink); p.r(1, 1, 30, 26, '#262836'); p.r(1, 1, 30, 1, '#454a60'); p.r(1, 1, 1, 26, '#3a3f56');
    p.r(2, 2, 28, 7, '#9aa0b0'); p.r(2, 2, 28, 1, '#d8dce8'); p.r(2, 8, 28, 1, '#5a6078');
    for (var i = 0; i < 5; i++) { p.circ(6 + i * 4.6, 5.4, 1.8, C.ink); p.p(6 + i * 4.6, 4, '#ffffff'); }
    p.r(3, 11, 26, 14, '#6a5a30'); p.dith(3, 11, 26, 14, '#2a200c', 7); p.r(3, 11, 26, 1, '#b8a068'); p.r(3, 24, 26, 1, '#3a2e14');
    p.r(10, 17, 12, 7, '#262836'); p.txt('FAZ', 11, 18, GOLD[0], 1);
    p.r(2, 26, 4, 2, C.ink); p.r(26, 26, 4, 2, C.ink);
  }, {
    anim: function (ctx, x, y, t) { new PX.Pen(ctx, 1, x, y).r(26, 4, 2, 2, Math.sin(t * 2.4) > -0.2 ? '#ff3b4a' : '#6b0f1c'); }
  });
  reg('ampL', 32, 58, 2, 1, function (p) {
    var i, y;
    p.r(0, 0, 32, 58, C.ink);
    p.r(1, 1, 30, 14, '#262836'); p.r(1, 1, 30, 1, '#454a60'); p.r(2, 3, 28, 7, '#9aa0b0'); p.r(2, 3, 28, 1, '#d8dce8');
    for (i = 0; i < 6; i++) { p.circ(5 + i * 4.4, 6.6, 1.7, C.ink); p.p(5 + i * 4.4, 5, '#ffffff'); }
    p.r(3, 11, 26, 2, '#14161e'); p.r(24, 4, 3, 1, '#ff3b4a');
    for (i = 0; i < 2; i++) {
      y = 16 + i * 21;
      p.r(1, y, 30, 20, '#262836'); p.r(1, y, 30, 1, '#454a60'); p.r(1, y, 1, 20, '#3a3f56');
      p.r(3, y + 2, 26, 16, '#1c1c24'); p.dith(3, y + 2, 26, 16, '#3e3e4a', 6); p.r(3, y + 2, 26, 1, '#c8c0a0'); p.r(3, y + 17, 26, 1, '#c8c0a0');
      p.r(1, y + 19, 30, 1, '#14161e');
    }
    p.r(11, 22, 10, 5, '#262836'); p.txt('FAZ', 11, 22, GOLD[0], 1);
    p.r(2, 56, 4, 2, C.ink); p.r(26, 56, 4, 2, C.ink);
  });
  /* micrófono de Freddy (tarea) */
  reg('micStand', 14, 34, 1, 1, function (p) {
    p.ell(7, 31, 6, 2.4, C.ink); p.ell(7, 30.6, 5, 1.7, '#46526a'); p.r(3, 30, 4, 1, '#8a98b0');
    p.r(6, 11, 3, 20, C.ink); p.r(7, 11, 1, 19, '#98a8c0');
    p.line(7, 11, 12, 6, C.ink, 3); p.line(7, 11, 12, 6, '#98a8c0', 1);
    p.circ(12, 4, 3.8, C.ink); p.circ(12, 4, 2.9, '#8a98b0'); p.dith(9, 1, 7, 7, '#14181e', 7); p.p(11, 2, '#ffffff');
    p.r(9, 18, 5, 5, C.ink); p.r(10, 19, 3, 3, '#ffe45c'); p.r(10, 20, 3, 1, '#b8820c');
    p.line(7, 31, 2, 33, C.ink, 1); p.line(7, 31, 12, 33, '#14181e', 1);
  }, {
    anim: function (ctx, x, y, t) { if (Math.sin(t * 2.1) > 0.9) new PX.Pen(ctx, 1, x, y).r(10, 2, 2, 1, '#ffffff'); }
  });
  /* guitarra en soporte (v: bonnie = la de Bonnie, con una nota; r rojo, b azul, y amarillo, k negro) */
  var GT = { bonnie: ['#c4283c', '#ff6070', '#7a1424'], r: ['#c4283c', '#ff6070', '#7a1424'], b: ['#2a5ab0', '#6a8ae0', '#1a3a78'], y: ['#f2c21c', '#fff6b0', '#9a7a0c'], k: ['#2c3040', '#5a6078', '#14161e'] };
  reg('guitarStand', 20, 34, 1, 1, function (p, o) {
    var c = GT[o.v] || GT.r, i;
    p.line(10, 25, 3, 33, C.ink, 2); p.line(10, 25, 17, 33, C.ink, 2); p.line(10, 25, 10, 33, C.ink, 1);
    p.r(8, 2, 4, 14, C.ink); p.r(9, 3, 2, 13, '#8a5a34');
    for (i = 0; i < 5; i++) p.r(9, 5 + i * 2, 2, 1, '#d8c890');
    p.r(7, 0, 6, 4, C.ink); p.r(8, 1, 4, 2, '#4a2c16'); p.p(7, 1, C.mt5); p.p(12, 1, C.mt5);
    p.ell(10, 15, 5.8, 4.8, C.ink); p.ell(10, 24, 7.6, 6.6, C.ink); p.r(6, 17, 8, 4, C.ink);
    p.ell(10, 15, 4.8, 3.8, c[0]); p.ell(10, 24, 6.6, 5.6, c[0]); p.r(7, 17, 6, 4, c[0]);
    p.ell(7, 22, 3, 2, p.pat(c[1], 9)); p.ell(10, 24, 6.6, 5.6, p.pat(c[2], 3));
    p.ell(11, 22, 3, 2.4, '#e8e0f0'); p.r(8, 19, 5, 1, C.ink); p.r(8, 22, 5, 1, C.ink); p.r(8, 27, 5, 1, C.mt4);
    p.p(14, 25, C.mt5); p.p(14, 27, C.mt5);
    if (o.v === 'bonnie') { p.r(2, 20, 7, 8, C.ink); p.r(3, 21, 5, 6, '#f6f2e0'); p.r(4, 22, 3, 1, '#8f87b5'); p.r(4, 24, 3, 1, '#8f87b5'); p.r(5, 20, 2, 1, '#ff3b4a'); }
  });

  /* ====================== COMEDOR ====================== */
  /* mesa larga con mantel: a menta con lunares, b crema con rayas moradas */
  reg('longTable', 96, 40, 6, 2, function (p, o) {
    var b = o.v === 'b', c = b ? ['#f2e6b0', '#fff6d0', '#6a2cc0', '#c8b878'] : ['#b8e0d0', '#e0fff0', '#2a7272', '#7ab0a0'], i;
    p.r(0, 0, 96, 38, C.ink);
    p.r(1, 1, 94, 22, c[0]); p.r(1, 1, 94, 1, c[1]); p.r(1, 22, 94, 1, c[3]);
    if (b) for (i = 0; i < 94; i += 12) p.r(1 + i, 1, 4, 22, c[2]); else { for (i = 0; i < 24; i++) p.p(4 + (i * 17) % 90, 3 + (i * 7) % 18, '#ffffff'); p.r(1, 1, 94, 2, c[2]); p.r(1, 20, 94, 2, c[2]); }
    p.r(1, 23, 94, 14, c[0]); p.r(1, 23, 94, 1, c[3]);
    for (i = 0; i < 88; i += 8) { p.ell(5 + i, 36, 4, 2, c[0]); p.r(1 + i, 25, 1, 11, c[3]); }
    p.r(1, 23, 94, 3, c[2]); p.r(1, 23, 94, 1, c[1]);
    p.r(4, 37, 3, 3, '#2c3548'); p.r(89, 37, 3, 3, '#2c3548');
    [[8, '#ff5fd2'], [40, '#4de0ff'], [70, '#ffe45c']].forEach(function (h) {         // gorritos
      p.poly([h[0], 9, h[0] + 5, 9, h[0] + 2.5, -3], C.ink); p.poly([h[0] + 1, 8, h[0] + 4, 8, h[0] + 2.5, -1], h[1]); p.p(h[0] + 2, -3, '#ffffff'); p.r(h[0] + 1, 4, 3, 1, '#ffffff');
    });
    for (i = 0; i < 4; i++) {                                                          // platos con rebanada y vasos
      var px = 14 + i * 20;
      p.ell(px, 14, 6.5, 3.4, C.ink); p.ell(px, 13.6, 5.8, 2.9, '#f2f0ff'); p.poly([px - 3, 13, px + 3, 12, px, 16], '#e8a030'); p.p(px - 1, 14, '#b3182b'); p.p(px + 1, 13, '#b3182b');
      p.r(px + 8, 8, 4, 6, C.ink); p.r(px + 9, 9, 2, 4, ['#ff3b4a', '#4de0ff', '#ffe45c', '#3fd479'][i]);
    }
    p.r(46, 4, 5, 7, C.ink); p.r(47, 5, 3, 5, '#e8e0f0'); p.r(47, 5, 3, 1, '#ff3b4a');  // servilletero
  });
  /* silla de comedor. n: del lado norte (se ve el frente) · s: del lado sur (se ve el respaldo) · t: asiento verde */
  reg('chairD', 14, 24, 0, 0, function (p, o) {
    var v = o.v || 'n', south = v.charAt(0) === 's', cu = v.length > 1 ? ['#2a7272', '#4aa8a8', '#143e3e'] : ['#b3182b', '#ff6070', '#6b0f1c'], w = ['#8a5a34', '#b87a42', '#4a2c16'];
    if (!south) {
      p.r(1, 0, 12, 10, C.ink); p.r(2, 1, 10, 8, w[0]); p.r(2, 1, 10, 1, w[1]); p.r(4, 2, 1, 7, w[2]); p.r(9, 2, 1, 7, w[2]); p.r(6, 2, 2, 7, w[2]);
      p.r(0, 10, 14, 6, C.ink); p.r(1, 11, 12, 4, cu[0]); p.r(1, 11, 12, 1, cu[1]); p.r(1, 14, 12, 1, cu[2]);
      p.r(1, 16, 2, 7, C.ink); p.r(11, 16, 2, 7, C.ink); p.r(1, 16, 1, 6, w[1]); p.r(11, 16, 1, 6, w[1]);
    } else {
      p.r(1, 3, 12, 5, C.ink); p.r(2, 4, 10, 3, cu[0]); p.r(2, 4, 10, 1, cu[1]);
      p.r(0, 6, 14, 12, C.ink); p.r(1, 7, 12, 10, w[0]); p.r(1, 7, 12, 1, w[1]); p.r(3, 9, 1, 8, w[2]); p.r(6, 9, 2, 8, w[2]); p.r(10, 9, 1, 8, w[2]); p.r(1, 16, 12, 1, w[2]);
      p.r(1, 18, 2, 5, C.ink); p.r(11, 18, 2, 5, C.ink); p.r(1, 18, 1, 4, w[1]); p.r(11, 18, 1, 4, w[1]);
    }
  });
  /* pastel de Chica sobre mesa redonda (tarea) */
  reg('cakeBig', 48, 46, 3, 2, function (p) {
    var i;
    p.ell(24, 31, 23, 9, C.ink); p.r(2, 31, 44, 12, C.ink); p.ell(24, 42, 23, 3, C.ink);
    p.r(3, 31, 42, 11, '#f2f0ff'); p.ell(24, 31, 22, 8, '#f2f0ff'); p.ell(24, 30, 20, 7, '#ffffff');
    for (i = 0; i < 42; i += 6) { p.ell(6 + i, 42, 3.6, 2, '#f2f0ff'); p.r(4 + i, 33, 1, 8, '#c8c0d8'); }
    p.r(3, 34, 42, 2, '#ff8ac0'); p.r(3, 34, 42, 1, '#ffc0e0'); p.dith(3, 38, 42, 4, '#c8c0d8', 4);
    p.txt('CHICA', 15, 36, '#b3182b', 1);
    [[6, 26, '#ff5fd2'], [36, 28, '#4de0ff']].forEach(function (h) { p.poly([h[0], h[1], h[0] + 5, h[1], h[0] + 2.5, h[1] - 11], C.ink); p.poly([h[0] + 1, h[1] - 1, h[0] + 4, h[1] - 1, h[0] + 2.5, h[1] - 9], h[2]); p.p(h[0] + 2, h[1] - 11, '#ffffff'); });
    p.ell(24, 27, 14, 5, C.ink); p.r(10, 20, 28, 7, C.ink); p.ell(24, 20, 14, 5, C.ink);
    p.r(11, 20, 26, 7, '#ff8ac0'); p.r(11, 20, 5, 7, '#ffc0e0'); p.r(32, 20, 5, 7, '#d84aa0'); p.ell(24, 27, 13, 4, '#ff8ac0'); p.ell(24, 20, 13, 4, '#ffc0e0');
    for (i = 0; i < 26; i += 4) p.r(11 + i, 21, 2, 3 + (i % 3), '#ffffff');
    p.r(14, 12, 20, 8, C.ink); p.ell(24, 20, 10, 3.4, C.ink); p.ell(24, 12, 10, 3.4, C.ink);
    p.r(15, 12, 18, 8, '#d84aa0'); p.r(15, 12, 4, 8, '#ff8ac0'); p.ell(24, 20, 9, 2.8, '#d84aa0'); p.ell(24, 12, 9, 2.8, '#ffc0e0');
    p.r(18, 6, 12, 6, C.ink); p.ell(24, 12, 6, 2, C.ink); p.ell(24, 6, 6, 2.2, C.ink);
    p.r(19, 6, 10, 6, '#ff8ac0'); p.ell(24, 12, 5, 1.6, '#ff8ac0'); p.ell(24, 6, 5, 1.8, '#fff'); p.circ(24, 5, 1.6, '#c4283c');
    for (i = 0; i < 3; i++) { p.r(21 + i * 3, 1, 1, 4, ['#4de0ff', '#ffe45c', '#ff3b4a'][i]); }
  }, {
    light: { dx: 24, dy: 8, r: 30, col: '#ffd080', glow: '#ffb050', flick: 0.5 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i;
      for (i = 0; i < 3; i++) { var h = 1 + (Math.sin(t * 9 + i * 2) > 0 ? 1 : 0); p.r(21 + i * 3, 0 - h, 1, h + 1, i % 2 ? '#ff9a2e' : '#ffe45c'); }
    }
  });
  /* pila de sillas */
  reg('chairStack', 20, 40, 1, 1, function (p, o) {
    var cu = o.v === 't' ? ['#2a7272', '#4aa8a8'] : ['#b3182b', '#ff6070'], i, y;
    p.r(2, 30, 3, 9, C.ink); p.r(15, 30, 3, 9, C.ink); p.r(3, 30, 1, 8, '#b87a42');
    for (i = 0; i < 4; i++) {
      y = 24 - i * 6;
      p.r(0, y, 20, 7, C.ink); p.r(1, y + 1, 18, 4, i % 2 ? cu[0] : '#8a5a34'); p.r(1, y + 1, 18, 1, i % 2 ? cu[1] : '#b87a42'); p.r(1, y + 5, 18, 1, '#4a2c16');
      p.r(2, y + 6, 2, 2, C.ink); p.r(16, y + 6, 2, 2, C.ink);
    }
    p.r(2, 0, 16, 3, C.ink); p.r(3, 1, 14, 1, '#b87a42'); p.r(4, 3, 2, 6, C.ink); p.r(14, 3, 2, 6, C.ink); p.r(9, 3, 2, 6, C.ink);
  });
  reg('jukebox', 32, 50, 2, 1, function (p) {
    var i;
    p.ell(16, 13, 14, 12, C.ink); p.r(2, 13, 28, 36, C.ink);
    p.ell(16, 13, 13, 11, '#8a1a4a'); p.r(3, 13, 26, 35, '#8a1a4a'); p.r(3, 13, 3, 35, '#c4285f'); p.r(26, 13, 3, 35, '#5a0f30');
    p.ell(16, 13, 10, 8.6, C.ink); p.ell(16, 13, 9, 7.6, '#14103a'); p.r(7, 13, 18, 12, '#14103a');
    p.ell(16, 19, 8, 4.4, C.ink); p.ell(16, 19, 7, 3.6, '#2a2a3a'); p.ell(16, 19, 2.6, 1.6, '#ff5fd2'); p.p(16, 19, C.ink);
    p.line(24, 13, 17, 18, C.mt5, 1);
    p.r(5, 26, 22, 3, '#c4d0e4'); p.r(5, 26, 22, 1, '#ffffff');
    for (i = 0; i < 5; i++) { p.r(7 + i * 4, 27, 2, 1, ['#ff3b4a', '#ffe45c', '#3fd479', '#4de0ff', '#ff5fd2'][i]); }
    p.r(5, 30, 22, 14, '#2a0a1a'); p.dith(5, 30, 22, 14, '#5a2a40', 5); p.r(5, 30, 22, 1, GOLD[0]); p.r(5, 43, 22, 1, GOLD[2]);
    p.r(12, 36, 8, 3, C.ink); p.txt('FAZ', 12, 36, GOLD[0], 1);
    p.r(4, 46, 24, 3, '#c4d0e4'); p.r(4, 46, 24, 1, '#ffffff'); p.r(4, 48, 24, 1, '#6a7a94');
  }, {
    light: { dx: 16, dy: 22, r: 40, col: '#ff5fd2', glow: '#ff5fd2', flick: 0.6 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), cols = ['#ff5fd2', '#4de0ff', '#ffe45c', '#3fd479'], i, a;
      for (i = 0; i < 12; i++) { a = Math.PI * (1.05 + i * 0.1); p.r(16 + Math.cos(a) * 11.6 - 1, 13 + Math.sin(a) * 10 - 1, 2, 2, cols[(i + Math.floor(t * 6)) % 4]); }
      p.r(9 + ((t * 6) % 14 | 0), 13, 1, 11, 'rgba(255,255,255,0.14)');
    }
  });
  reg('sodaMachine', 32, 50, 2, 1, function (p) {
    var i, j;
    p.r(0, 0, 32, 50, C.ink); p.r(1, 1, 30, 48, '#c4283c'); p.r(1, 1, 30, 1, '#ff6070'); p.r(1, 1, 2, 48, '#e85a6c'); p.r(29, 1, 2, 48, '#7a1424');
    p.r(3, 3, 26, 8, '#f2f0ff'); p.txt('SODA', 8, 5, '#c4283c', 1); p.r(3, 10, 26, 1, '#c8c0d8');
    p.r(4, 13, 17, 22, C.ink); p.r(5, 14, 15, 20, '#1a2230');
    for (j = 0; j < 4; j++) for (i = 0; i < 3; i++) { p.r(6 + i * 5, 15 + j * 5, 4, 4, C.ink); p.r(7 + i * 5, 16 + j * 5, 2, 3, ['#4de0ff', '#ffe45c', '#3fd479', '#ff9a2e', '#a05cff'][(i + j * 2) % 5]); }
    p.r(23, 14, 5, 6, C.ink); p.r(24, 15, 3, 2, '#3fd479'); p.r(24, 18, 3, 1, '#ffe45c');
    for (i = 0; i < 3; i++) p.r(24, 22 + i * 4, 3, 2, '#8a98b0');
    p.r(5, 38, 22, 8, C.ink); p.r(6, 39, 20, 6, '#0a0e18'); p.r(11, 42, 6, 4, '#f2f0ff'); p.r(11, 42, 6, 1, '#c4283c');
    p.r(3, 47, 26, 2, '#7a1424');
  }, {
    light: { dx: 12, dy: 24, r: 28, col: '#ff8a6a', glow: null, flick: 0.4 },
    anim: function (ctx, x, y, t) { if (Math.sin(t * 7) > 0.5) new PX.Pen(ctx, 1, x, y).r(3, 3, 26, 8, 'rgba(255,255,255,0.18)'); }
  });
  reg('hostStand', 22, 34, 1, 1, function (p) {
    p.r(1, 14, 20, 20, C.ink); p.r(2, 15, 18, 18, '#6b4223'); p.r(2, 15, 3, 18, '#8a5a34'); p.r(17, 15, 3, 18, '#4a2c16');
    p.r(4, 18, 14, 12, '#7c5230'); p.r(4, 18, 14, 1, '#a06c3c'); p.r(4, 29, 14, 1, '#2a180c');
    p.r(2, 21, 18, 8, C.ink); p.r(3, 22, 16, 6, '#14181e'); p.txt('MENU', 3, 23, '#ffe45c', 1);
    p.poly([0, 14, 22, 14, 20, 6, 2, 6], C.ink); p.poly([1, 13, 21, 13, 19, 7, 3, 7], '#8a5a34'); p.r(3, 7, 16, 1, '#b87a42');
    p.r(5, 3, 12, 6, C.ink); p.r(6, 4, 10, 4, '#f6f2e0'); p.r(7, 5, 8, 1, '#8f87b5'); p.r(7, 7, 6, 1, '#b3182b');
    p.circ(17, 3, 2.4, C.ink); p.circ(17, 3, 1.6, GOLD[0]);
    p.r(3, 32, 3, 2, C.ink); p.r(16, 32, 3, 2, C.ink);
  });

  /* ====================== CABINAS DE LUCES Y CONTROL ====================== */
  /* panel de luces del escenario (tarea) */
  reg('lightPanel', 64, 42, 4, 2, function (p, o) {
    var i, cols = ['#ff3b4a', '#ff9a2e', '#ffe45c', '#3fd479', '#4de0ff', '#4a8ae0', '#a05cff', '#ffffff'];
    p.r(0, 0, 64, 42, C.ink);
    p.r(1, 1, 62, 24, '#2c3548'); p.r(1, 1, 62, 1, '#5a6a84'); p.r(1, 24, 62, 1, '#141a28');
    p.r(3, 3, 17, 11, C.ink); p.r(4, 4, 15, 9, '#06182a'); p.r(4, 4, 15, 1, '#0e3a5a');                // pantalla con el plano del escenario
    p.r(6, 7, 11, 4, '#1a4a7a'); p.p(8, 9, '#ffe45c'); p.p(11, 9, '#fff'); p.p(14, 9, '#ff5fd2');
    for (i = 0; i < 8; i++) { p.r(24 + i * 5, 4, 4, 3, C.ink); p.r(24 + i * 5, 4, 4, 2, cols[i]); p.r(24 + i * 5, 8, 4, 1, '#0e121c'); }
    for (i = 0; i < 11; i++) { p.r(6 + i * 5, 14, 3, 9, '#0e121c'); p.r(7 + i * 5, 15, 1, 7, '#1a2030'); p.r(5 + i * 5, 17, 5, 2, C.ink); p.r(5 + i * 5, 17, 5, 1, i % 2 ? '#e8e0f0' : '#98a8c0'); }
    p.r(1, 25, 62, 15, '#1e2432'); p.r(1, 25, 62, 1, '#46526a');
    for (i = 0; i < 12; i++) { p.circ(6 + i * 5, 31, 1.5, '#0a0e18'); p.p(6 + i * 5, 30, '#46526a'); }
    p.r(20, 35, 24, 5, C.ink); p.r(21, 36, 22, 3, '#14181e'); p.txt('LUCES', 22, 36, GOLD[0], 1);
    p.r(2, 40, 5, 2, C.ink); p.r(57, 40, 5, 2, C.ink);
  }, {
    light: { dx: 32, dy: 12, r: 40, col: '#ffd070', glow: '#ff9a2e' },
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), i, on = st && st.done === 'pending';
      for (i = 0; i < 11; i++) {
        p.r(6 + i * 5, 14, 3, 9, '#0e121c'); p.r(7 + i * 5, 15, 1, 7, '#1a2030');
        var fy = 15 + Math.round((on ? Math.sin(t * 1.4 + i * 0.8) : Math.sin(i * 1.7)) * 3 + 3);
        p.r(5 + i * 5, fy, 5, 2, C.ink); p.r(5 + i * 5, fy, 5, 1, i % 2 ? '#e8e0f0' : '#98a8c0');
      }
      for (i = 0; i < 8; i++) if ((i + Math.floor(t * 4)) % 4 === 0) p.r(25 + i * 5, 3, 2, 1, '#ffffff');
    }
  });
  /* consola de mezcla del show (tarea final) */
  reg('mixer', 80, 46, 5, 2, function (p) {
    var i;
    p.r(0, 0, 80, 46, C.ink);
    p.r(1, 1, 78, 28, '#323d52'); p.r(1, 1, 78, 1, '#6a7a94'); p.r(1, 28, 78, 1, '#141a28');
    for (i = 0; i < 16; i++) {
      var x = 4 + i * 4;
      p.r(x, 3, 3, 3, [C.rd3, '#ff9a2e', '#ffe45c', '#3fd479'][i % 4]); p.r(x, 7, 3, 2, '#98a8c0'); p.r(x, 10, 3, 2, '#98a8c0');
      p.r(x + 1, 14, 1, 11, '#0e121c'); p.r(x, 17, 3, 2, C.ink); p.r(x, 17, 3, 1, i % 3 ? '#e8e0f0' : '#d8a010');
    }
    p.r(69, 3, 9, 9, C.ink); p.r(70, 4, 7, 7, '#06180f');
    p.r(69, 14, 9, 11, '#7a1424'); p.r(70, 15, 7, 6, '#ff3b4a'); p.r(70, 15, 7, 1, '#ff9aa0'); p.txt('ON', 71, 22, '#ffffff', 1);
    p.r(1, 29, 78, 15, '#1e2432'); p.r(1, 29, 78, 1, '#46526a');
    for (i = 0; i < 16; i++) { p.circ(6 + i * 4.6, 33, 1.3, '#0a0e18'); p.circ(6 + i * 4.6, 38, 1.3, '#0a0e18'); }
    p.r(46, 32, 32, 9, C.ink); p.r(47, 33, 30, 7, '#14181e'); p.txt('CONTROL', 48, 35, GOLD[0], 1);
    p.r(2, 44, 6, 2, C.ink); p.r(72, 44, 6, 2, C.ink);
  }, {
    light: { dx: 40, dy: 12, r: 46, col: '#9affc4', glow: '#3fd479' },
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), i, on = st && st.done === 'pending', v, j;
      for (i = 0; i < 16; i++) {
        var xx = 4 + i * 4, fy = 14 + Math.round(Math.sin(t * (on ? 1.8 : 0.7) + i * 0.7) * 3 + 3);
        p.r(xx, 14, 3, 11, '#0e121c'); p.r(xx + 1, 14, 1, 11, '#1a2030');
        p.r(xx, fy, 3, 2, C.ink); p.r(xx, fy, 3, 1, i % 3 ? '#e8e0f0' : '#d8a010');
      }
      for (i = 0; i < 2; i++) {                                    // medidores
        v = Math.floor((Math.sin(t * 5 + i * 1.3) * 0.5 + 0.5) * 6);
        for (j = 0; j < 6; j++) p.r(71 + i * 4, 10 - j, 2, 1, j < v ? (j > 4 ? '#ff3b4a' : j > 3 ? '#ffe45c' : '#3fd479') : '#0e3a1c');
      }
      if (Math.sin(t * 5) > 0) p.r(70, 15, 7, 1, '#ffffff');
    }
  });
  reg('rack', 32, 50, 2, 1, function (p) {
    var i;
    p.r(0, 0, 32, 50, C.ink); p.r(1, 1, 30, 48, '#2c3040'); p.r(1, 1, 30, 1, '#5a6078');
    for (i = 0; i < 5; i++) {
      var y = 3 + i * 9;
      p.r(3, y, 26, 8, C.ink); p.r(4, y + 1, 24, 6, i % 2 ? '#3a4560' : '#4a5870'); p.r(4, y + 1, 24, 1, '#8a98b0');
      p.circ(7, y + 4, 1.6, C.ink); p.p(7, y + 3, '#c4d0e4'); p.circ(12, y + 4, 1.6, C.ink); p.p(12, y + 3, '#c4d0e4');
      p.r(24, y + 2, 1, 1, '#3fd479');
    }
    p.r(2, 48, 4, 2, C.ink); p.r(26, 48, 4, 2, C.ink);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, j, v;
      for (i = 0; i < 5; i++) {
        v = Math.floor((Math.sin(t * 4 + i * 1.9) * 0.5 + 0.5) * 6);
        for (j = 0; j < 6; j++) p.r(15 + j * 1.5 | 0, 7 + i * 9, 1, 2, j < v ? (j > 4 ? '#ff3b4a' : j > 3 ? '#ffe45c' : '#3fd479') : '#16283a');
        if (Math.sin(t * 3 + i * 2) > 0.6) p.p(25, 5 + i * 9, '#ff9a2e');
      }
    }
  });
  /* tres cámaras del lugar en la pared: escenario, comedor y servicio */
  reg('camBank', 52, 32, 0, 0, function (p) {
    var i, n = ['ESC', 'COM', 'SRV'];
    p.r(0, 0, 52, 32, C.ink); p.r(1, 1, 50, 30, '#2c3548'); p.r(1, 1, 50, 1, '#5a6a84');
    for (i = 0; i < 3; i++) { p.r(3 + i * 16, 3, 16, 17, C.ink); p.r(4 + i * 16, 4, 14, 15, '#0a2a18'); p.txt(n[i], 5 + i * 16, 22, '#3fd479', 1); p.p(3 + i * 16 + 13, 24, '#ff3b4a'); }
    p.r(3, 28, 46, 2, '#141a28');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), sx = (t * 9) % 30;
      // cámara 1: el escenario con un lugar vacío
      p.r(5, 5, 12, 13, '#0a2a18'); p.r(5, 14, 12, 1, '#1f8a4c');
      p.r(7, 8, 2, 6, '#7e90b0'); p.r(13, 8, 2, 6, '#a4a070'); p.p(11, 14, Math.sin(t * 4) > 0 ? '#a05cff' : '#3a2a8a');
      // cámara 2: mesas del comedor
      p.r(21, 5, 12, 13, '#0a2a18'); p.r(22, 8, 4, 2, '#1f8a4c'); p.r(28, 8, 4, 2, '#1f8a4c'); p.r(22, 13, 4, 2, '#1f8a4c'); p.r(28, 13, 4, 2, '#1f8a4c');
      // cámara 3: el pasillo de servicio y algo morado que camina
      p.r(37, 5, 12, 13, '#0a2a18'); p.r(37, 13, 12, 1, '#1f8a4c'); p.r(37, 9, 12, 1, '#146a38');
      if (sx < 12) { p.r(37 + sx, 8, 2, 6, '#8a7af0'); p.p(37 + sx, 9, '#ff4adf'); }
      p.r(5, 5 + ((t * 6) % 13 | 0), 44, 1, 'rgba(164,255,196,0.18)');
      if (Math.sin(t * 3) > 0) { p.p(14, 24, '#ff3b4a'); p.p(30, 24, '#ff3b4a'); p.p(46, 24, '#ff3b4a'); }
    }
  });
  reg('onAir', 34, 14, 0, 0, function (p) {
    p.r(0, 0, 34, 14, C.ink); p.r(1, 1, 32, 12, '#6b0f1c'); p.r(1, 1, 32, 1, '#b3182b'); p.r(2, 2, 30, 10, '#2e060c');
    p.txt('EN VIVO', 3, 4, '#7a1424', 1);
  }, {
    light: { dx: 17, dy: 7, r: 22, col: '#ff3b4a', glow: '#ff3b4a' },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      if (Math.sin(t * 2.2) > -0.3) { p.r(2, 2, 30, 10, '#b3182b'); p.txt('EN VIVO', 3, 4, '#ffffff', 1); p.r(1, 1, 32, 1, '#ff6070'); }
    }
  });
  reg('lampShelf', 32, 50, 2, 1, function (p) {
    var i, j, gel = ['#ff3b4a', '#4de0ff', '#ffe45c', '#3fd479', '#a05cff', '#ff9a2e'];
    p.r(0, 0, 32, 50, C.ink); p.r(1, 1, 30, 48, '#3a4560');
    for (i = 0; i < 3; i++) {
      var y = 3 + i * 15;
      p.r(1, y + 12, 30, 3, '#98a8c0'); p.r(1, y + 12, 30, 1, '#e8f0ff'); p.r(1, y + 14, 30, 1, '#222b3c');
      for (j = 0; j < 5; j++) {
        if (i === 0) { p.circ(5 + j * 6, y + 7, 3.4, C.ink); p.circ(5 + j * 6, y + 7, 2.6, '#e8e0c0'); p.p(4 + j * 6, y + 6, '#ffffff'); p.r(4 + j * 6, y + 10, 3, 2, C.mt3); }
        else if (i === 1) { p.r(3 + j * 5.6, y + 3, 5, 9, C.ink); p.r(4 + j * 5.6, y + 4, 3, 7, gel[(j + i) % 6]); p.r(4 + j * 5.6, y + 4, 3, 1, '#ffffff'); }
        else { p.r(3 + j * 5.6, y + 7, 5, 5, C.ink); p.r(4 + j * 5.6, y + 8, 3, 3, C.mt4); p.r(2 + j * 5.6, y + 5, 7, 3, C.mt3); }
      }
    }
  });
  reg('tapeShelf', 32, 50, 2, 1, function (p) {
    var i, j;
    p.r(0, 0, 32, 50, C.ink); p.r(1, 1, 30, 48, '#5a3820'); p.r(1, 1, 30, 1, '#a06c3c');
    for (i = 0; i < 4; i++) {
      var y = 3 + i * 11;
      p.r(2, y + 9, 28, 2, '#8a5a34'); p.r(2, y + 9, 28, 1, '#b87a42');
      for (j = 0; j < 6; j++) {
        var c = ['#e8e0f0', '#ffe45c', '#4de0ff', '#ff9aa0', '#3fd479', '#c4beff'][(i + j) % 6];
        p.r(3 + j * 4.5, y + 1, 4, 8, C.ink); p.r(4 + j * 4.5, y + 2, 2, 6, c); p.r(4 + j * 4.5, y + 4, 2, 2, '#14181e');
      }
    }
  });
  reg('reelC', 20, 20, 1, 1, function (p) {
    p.ell(10, 16, 9, 4, C.ink); p.r(1, 6, 18, 10, C.ink); p.ell(10, 6, 9, 4, C.ink);
    p.r(2, 6, 16, 10, '#d86a1c'); p.ell(10, 16, 8, 3, '#a04a08'); p.ell(10, 6, 8, 3, '#ff9a2e'); p.ell(10, 6, 4, 1.6, '#8a98b0'); p.circ(10, 6, 1.4, C.ink);
    for (var i = 0; i < 4; i++) p.r(3, 8 + i * 2, 14, 1, '#a04a08');
    p.line(18, 14, 19, 19, '#14181e', 1);
  });
  reg('beacon', 14, 18, 0, 0, function (p) {          // baliza de emergencia en la pared
    p.r(2, 12, 10, 6, C.ink); p.r(3, 13, 8, 4, '#46526a'); p.r(3, 13, 8, 1, '#98a8c0');
    p.ell(7, 8, 6.4, 6.4, C.ink); p.r(0, 8, 14, 5, C.ink);
    p.ell(7, 8, 5.4, 5.4, '#8a1a1a'); p.r(1, 8, 12, 4, '#8a1a1a'); p.p(4, 5, '#ff9aa0');
  }, {
    light: { dx: 7, dy: 9, r: 26, col: '#ff3b4a', glow: '#ff3b4a', flick: 0.6 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), on = Math.sin(t * 5) > 0;
      p.ell(7, 8, 4.4, 4.4, on ? '#ff3b4a' : '#6b0f1c'); p.r(on ? 8 : 3, 6, 3, 3, '#ffd0d0');
    }
  });
  reg('trussPiece', 48, 14, 3, 1, function (p) {
    var i;
    p.r(0, 0, 48, 14, C.ink); p.r(1, 1, 46, 3, '#aeb9cc'); p.r(1, 1, 46, 1, '#ffffff'); p.r(1, 10, 46, 3, '#98a8c0'); p.r(1, 12, 46, 1, '#6a7a94');
    for (i = 0; i < 46; i += 8) { p.line(2 + i, 4, 6 + i, 10, '#7e90b0', 1); p.line(6 + i, 10, 10 + i, 4, '#7e90b0', 1); }
    p.r(0, 0, 3, 14, '#6a7a94'); p.r(45, 0, 3, 14, '#6a7a94'); p.p(1, 6, '#14181e'); p.p(46, 6, '#14181e');
  });
  reg('caseF', 32, 30, 2, 1, function (p, o) {
    var lbl = o.v === 'a' ? 'AUDIO' : 'LUCES';
    p.r(0, 0, 32, 30, C.ink); p.r(1, 1, 30, 26, '#262836'); p.r(1, 1, 30, 1, '#454a60'); p.r(1, 1, 1, 26, '#3a3f56');
    p.r(0, 0, 5, 5, '#aeb9cc'); p.r(27, 0, 5, 5, '#aeb9cc'); p.r(0, 23, 5, 5, '#aeb9cc'); p.r(27, 23, 5, 5, '#aeb9cc');
    p.r(1, 13, 30, 2, '#3a3f56'); p.r(13, 11, 6, 6, C.ink); p.r(14, 12, 4, 4, '#d8dce8'); p.r(15, 13, 2, 2, '#46526a');
    p.r(6, 5, 20, 6, '#f6f2e0'); p.r(6, 5, 20, 1, '#fff'); p.txt(lbl, 8, 6, '#b3182b', 1);
    p.r(24, 19, 5, 4, '#ffe45c'); p.r(25, 20, 3, 1, C.ink);
    p.circ(5, 28, 2, C.ink); p.circ(27, 28, 2, C.ink); p.p(5, 28, C.mt4); p.p(27, 28, C.mt4);
  });

  /* ====================== BODEGA DE INSTRUMENTOS ====================== */
  reg('caseG', 34, 14, 2, 1, function (p, o) {         // estuche de guitarra tumbado
    p.r(0, 2, 34, 12, C.ink); p.r(1, 3, 32, 10, o.v === 'b' ? '#3a3050' : '#2a2630'); p.r(1, 3, 32, 1, '#5a5070'); p.r(1, 12, 32, 1, '#14101c');
    p.r(0, 2, 3, 12, '#5a5070'); p.r(31, 2, 3, 12, '#5a5070'); p.r(13, 0, 8, 4, C.ink); p.r(14, 1, 6, 2, '#8a7a60');
    p.r(7, 6, 3, 4, '#c8b878'); p.r(24, 6, 3, 4, '#c8b878'); p.p(8, 7, C.ink); p.p(25, 7, C.ink);
    p.r(11, 8, 12, 3, '#6a2cc0'); p.txt('FAZ', 12, 8, '#ffe45c', 1);
  });
  reg('caseV', 16, 38, 1, 1, function (p) {            // estuche de guitarra de pie
    p.ell(8, 8, 7, 7, C.ink); p.r(1, 8, 14, 26, C.ink); p.ell(8, 33, 7, 4, C.ink);
    p.ell(8, 8, 6, 6, '#2a2630'); p.r(2, 8, 12, 26, '#2a2630'); p.ell(8, 33, 6, 3, '#2a2630');
    p.r(2, 8, 2, 26, '#5a5070'); p.r(12, 8, 2, 26, '#14101c'); p.r(5, 14, 6, 1, '#5a5070'); p.r(5, 22, 6, 1, '#5a5070');
    p.r(6, 18, 4, 4, '#c8b878'); p.p(7, 19, C.ink); p.r(3, 28, 10, 2, '#6a2cc0');
    p.r(6, 2, 4, 2, '#8a7a60');
  });
  reg('keyStand', 32, 28, 2, 1, function (p) {
    var i;
    p.line(4, 14, 10, 27, C.ink, 2); p.line(28, 14, 22, 27, C.ink, 2); p.line(4, 27, 28, 14, '#46526a', 1); p.line(4, 14, 28, 27, '#46526a', 1);
    p.r(0, 3, 32, 12, C.ink); p.r(1, 4, 30, 10, '#2a2d3a'); p.r(1, 4, 30, 1, '#5a6078');
    p.r(3, 5, 6, 3, '#06182a'); p.r(4, 6, 4, 1, '#4de0ff'); for (i = 0; i < 4; i++) p.r(12 + i * 4, 5, 3, 2, ['#ff3b4a', '#ffe45c', '#3fd479', '#4de0ff'][i]);
    p.r(1, 9, 30, 5, '#f2f0ff'); for (i = 0; i < 15; i++) p.r(2 + i * 2, 9, 1, 5, '#98a8c0');
    for (i = 0; i < 11; i++) if (i % 7 !== 2 && i % 7 !== 6) p.r(3 + i * 2.6, 9, 2, 3, C.ink);
    p.r(0, 0, 32, 3, '#c4d0e4'); p.r(0, 0, 32, 1, '#ffffff');
  });
  reg('tuneBench', 52, 36, 3, 1, function (p) {
    var i;
    p.r(0, 0, 52, 36, C.ink); p.r(1, 1, 50, 12, '#a06c3c'); p.r(1, 1, 50, 1, '#d8a868'); p.r(1, 12, 50, 1, '#4a2c16');
    p.r(1, 13, 50, 22, '#6b4223'); p.r(3, 15, 22, 17, '#7c5230'); p.r(27, 15, 22, 17, '#7c5230'); p.r(12, 22, 4, 1, '#d8c890'); p.r(36, 22, 4, 1, '#d8c890');
    p.r(4, 3, 10, 8, C.ink); p.r(5, 4, 8, 6, '#06182a'); p.r(6, 6, 6, 1, '#3fd479'); p.p(9, 5, '#ff3b4a');          // afinador
    for (i = 0; i < 6; i++) p.r(18 + i * 3, 3, 2, 8, ['#c4d0e4', '#b87a42', '#c4d0e4', '#b87a42', '#c4d0e4', '#ffe45c'][i]);   // cuerdas
    p.r(38, 4, 3, 7, '#c4283c'); p.r(42, 6, 6, 5, C.ink); p.r(43, 7, 4, 3, '#98a8c0');
  });

  /* ====================== CAMERINO ====================== */
  reg('vanity', 48, 48, 3, 2, function (p) {
    var i;
    p.r(3, 0, 42, 26, C.ink); p.r(5, 2, 38, 22, '#7a8aa4'); p.r(5, 2, 38, 2, '#aab8d0');
    p.poly([8, 22, 16, 22, 28, 4, 20, 4], '#98aac4'); p.poly([26, 22, 32, 22, 40, 6, 34, 6], '#98aac4');
    for (i = 0; i < 9; i++) { p.circ(6 + i * 4.5, 1, 1.5, C.ink); p.circ(6 + i * 4.5, 1, 1, '#fff6b0'); }
    for (i = 0; i < 5; i++) { p.circ(3, 5 + i * 4.5, 1.5, C.ink); p.circ(3, 5 + i * 4.5, 1, '#fff6b0'); p.circ(45, 5 + i * 4.5, 1.5, C.ink); p.circ(45, 5 + i * 4.5, 1, '#fff6b0'); }
    p.r(0, 26, 48, 20, C.ink); p.r(1, 27, 46, 5, '#8a3a5a'); p.r(1, 27, 46, 1, '#c8687a');
    p.r(1, 32, 46, 13, '#6a2a44'); p.r(3, 34, 20, 9, '#7a3450'); p.r(25, 34, 20, 9, '#7a3450'); p.r(10, 38, 5, 1, GOLD[0]); p.r(32, 38, 5, 1, GOLD[0]);
    p.r(6, 22, 6, 5, '#f2f0ff'); p.r(7, 21, 4, 2, '#ff5fd2'); p.r(16, 23, 10, 4, '#d8c890'); p.r(30, 21, 3, 6, '#b3182b'); p.r(36, 24, 8, 3, '#4de0ff');
    p.r(2, 45, 5, 3, C.ink); p.r(41, 45, 5, 3, C.ink);
  }, {
    light: { dx: 24, dy: 12, r: 34, col: '#ffd8a0', glow: null },
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y), i, off = Math.floor(t * 2.5 + inst.x) % 14;
      for (i = 0; i < 9; i++) if (i + 5 === off || (i + 1) * 3 === off) p.circ(6 + i * 4.5, 1, 1, '#4a3a20');
      for (i = 0; i < 5; i++) if (i + 14 === off) { p.circ(3, 5 + i * 4.5, 1, '#4a3a20'); }
    }
  });
  reg('costumeRack', 36, 54, 2, 1, function (p) {
    var i;
    p.r(0, 0, 36, 4, C.ink); p.r(1, 1, 34, 2, '#98a8c0'); p.r(1, 1, 34, 1, '#e8f0ff');
    p.r(1, 0, 3, 52, C.ink); p.r(32, 0, 3, 52, C.ink); p.r(2, 1, 1, 51, '#98a8c0'); p.r(33, 1, 1, 51, '#98a8c0');
    p.line(2, 51, 6, 53, C.ink, 2); p.line(33, 51, 29, 53, C.ink, 2); p.circ(4, 52, 2, C.ink); p.circ(32, 52, 2, C.ink); p.circ(18, 52, 2, C.ink);
    [[7, C.bn2, C.bn3, C.bn0, 'ear'], [17, C.yl2, C.yl3, C.yl1, 'beak'], [26, C.fr2, C.fr3, C.fr1, 'round']].forEach(function (s, k) {
      var x = s[0];
      p.line(x + 3, 3, x + 3, 6, '#8a98b0', 1);
      p.r(x, 6, 8, 38, C.ink); p.r(x + 1, 7, 6, 36, s[1]); p.r(x + 1, 7, 2, 36, s[2]); p.r(x + 5, 7, 2, 36, s[3]);
      p.r(x - 1, 14, 2, 18, C.ink); p.r(x + 7, 14, 2, 18, C.ink); p.r(x, 14, 1, 17, s[1]); p.r(x + 7, 14, 1, 17, s[3]);
      p.r(x + 1, 39, 2, 7, s[3]); p.r(x + 5, 39, 2, 7, s[3]);
      if (s[4] === 'ear') { p.ell(x + 1, 4, 2, 6, C.ink); p.ell(x + 1, 4, 1, 5, s[2]); p.ell(x + 6, 4, 2, 6, C.ink); p.ell(x + 6, 4, 1, 5, s[2]); }
      else if (s[4] === 'round') { p.circ(x + 1, 6, 2.6, C.ink); p.circ(x + 1, 6, 1.6, s[2]); p.circ(x + 6, 6, 2.6, C.ink); p.circ(x + 6, 6, 1.6, s[2]); }
      else { p.r(x + 2, 4, 4, 3, '#ff9a2e'); p.p(x + 3, 4, C.ink); }
    });
  }, {
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y), k = Math.floor(t * 0.8 + inst.x) % 6;
      if (k === 4) { p.r(9, 11, 1, 2, '#ffffff'); p.r(12, 11, 1, 2, '#ffffff'); }
      if (k === 2) { p.r(28, 11, 1, 2, '#ff4adf'); p.r(31, 11, 1, 2, '#ff4adf'); }
    }
  });
  reg('dressScreen', 48, 42, 3, 1, function (p) {
    var i;
    for (i = 0; i < 3; i++) {
      var x = i * 16, y = i === 1 ? 0 : 2;
      p.r(x, y, 16, 40 - y, C.ink); p.r(x + 1, y + 1, 14, 38 - y, i === 1 ? '#7a3a8a' : '#6a2a7a'); p.r(x + 1, y + 1, 14, 1, '#a85aba'); p.r(x + 1, y + 1, 1, 38 - y, '#8a4a9a');
      p.r(x + 3, y + 4, 10, 30 - y, '#4a1a5a'); p.r(x + 3, y + 4, 10, 1, '#8a4a9a');
      p.poly([x + 8, y + 9, x + 10, y + 14, x + 8, y + 19, x + 6, y + 14], GOLD[0]); p.p(x + 8, y + 14, GOLD[1]);
      p.circ(x + 8, y + 26 - y, 2.6, '#c4beff'); p.circ(x + 9, y + 25 - y, 2.2, '#4a1a5a');
      p.r(x + 1, 36, 14, 2, '#3a1048');
    }
    p.r(0, 39, 48, 3, C.ink); p.r(1, 40, 46, 1, '#2e0a38');
  });

  /* ====================== DECORACIÓN ====================== */
  /* telón de fondo pintado del escenario (256 x 32) */
  dec('backdrop', 256, 32, function (p) {
    var i;
    p.r(0, 0, 256, 32, '#1d1456'); p.dith(0, 8, 256, 12, '#2c1c80', 5); p.dith(0, 18, 256, 14, '#3a1a6a', 7);
    for (i = 0; i < 60; i++) p.p((i * 53) % 254 + 1, (i * 17) % 22 + 1, ['#ffe45c', '#c4beff', '#ffffff'][i % 3]);
    p.circ(40, 12, 8, '#f2f0ff'); p.circ(45, 10, 7.4, '#1d1456'); p.dith(33, 6, 6, 12, '#c4beff', 4);       // luna
    [[216, 12], [196, 22]].forEach(function (s) { p.poly([s[0], s[1] - 7, s[0] + 2, s[1] - 2, s[0] + 7, s[1] - 1, s[0] + 3, s[1] + 2, s[0] + 4, s[1] + 7, s[0], s[1] + 4, s[0] - 4, s[1] + 7, s[0] - 3, s[1] + 2, s[0] - 7, s[1] - 1, s[0] - 2, s[1] - 2], '#ffe45c'); });
    for (i = 0; i < 256; i += 16) p.poly([i, 0, i + 16, 0, i + 8, 6], i % 32 ? '#ff5fd2' : '#4de0ff');         // banderines
    p.r(0, 0, 256, 1, '#98a8c0');
    p.r(0, 28, 256, 4, '#14102a'); p.r(0, 28, 256, 1, GOLD[0]);
  });
  dec('tapeMark', 10, 10, function (p, o) {
    var c = o.col || '#e8e0f0';
    p.line(1, 1, 8, 8, c, 1); p.line(8, 1, 1, 8, c, 1); p.line(2, 1, 9, 8, c, 1);
  }, { floor: true });
  dec('stageStar', 72, 44, function (p) {
    p.ell(36, 22, 34, 19, p.pat('#c8a020', 5)); p.ell(36, 22, 31, 16.5, p.pat('#2a0f4e', 9));
    p.poly([36, 4, 42, 16, 56, 17, 46, 26, 50, 38, 36, 31, 22, 38, 26, 26, 16, 17, 30, 16], p.pat(GOLD[0], 9));
    p.poly([36, 9, 40, 17, 49, 18, 43, 24, 45, 32, 36, 28, 27, 32, 29, 24, 23, 18, 32, 17], p.pat(GOLD[1], 5));
  }, { floor: true });
  dec('danceRug', 128, 56, function (p) {
    p.ell(64, 28, 63, 27, '#14081e'); p.ell(64, 28, 61, 25, '#5a1f9a'); p.ell(64, 28, 56, 21, p.pat('#2a0f4e', 10));
    p.ell(64, 28, 50, 17, '#8a2a4a'); p.ell(64, 28, 46, 14, '#c4283c'); p.dith(14, 10, 100, 36, '#6b0f1c', 4);
    p.ell(64, 28, 61, 25, p.pat(GOLD[0], 2));
    for (var i = 0; i < 12; i++) { var a = i * 0.5236; p.r(64 + Math.cos(a) * 54 - 1, 28 + Math.sin(a) * 21, 3, 2, GOLD[0]); }
    p.poly([64, 16, 67, 25, 77, 26, 69, 32, 72, 41, 64, 36, 56, 41, 59, 32, 51, 26, 61, 25], GOLD[0]);
    p.poly([64, 20, 66, 26, 72, 27, 67, 31, 69, 36, 64, 33, 59, 36, 61, 31, 56, 27, 62, 26], GOLD[1]);
  }, { floor: true });
  dec('welcomeMat', 64, 26, function (p) {
    p.r(0, 0, 64, 26, C.ink); p.r(1, 1, 62, 24, '#8a1a2e'); p.r(2, 2, 60, 22, '#b3243e'); p.dith(2, 2, 60, 22, '#6b1020', 4);
    p.r(3, 3, 58, 1, GOLD[0]); p.r(3, 22, 58, 1, GOLD[0]); p.r(3, 3, 1, 20, GOLD[0]); p.r(60, 3, 1, 20, GOLD[0]);
    p.txt('BIENVENIDOS', 10, 8, '#fff6b0', 1); p.txt('ESCENARIO', 14, 15, GOLD[0], 1);
  }, { floor: true });
  dec('cablesB', 48, 16, function (p) {
    p.line(0, 4, 14, 9, '#14181e', 2); p.line(14, 9, 30, 5, '#14181e', 2); p.line(30, 5, 47, 11, '#14181e', 2);
    p.line(0, 8, 12, 13, '#b3182b', 1); p.line(12, 13, 30, 10, '#b3182b', 1); p.line(30, 10, 47, 14, '#b3182b', 1);
    p.line(2, 2, 16, 6, '#2a5ab0', 1); p.line(16, 6, 34, 3, '#2a5ab0', 1);
    p.r(18, 5, 6, 2, '#d8a010'); p.r(36, 8, 5, 2, '#d8a010');
  }, { floor: true });
  /* huellas moradas de Bonnie. o.dir: u d l r */
  dec('pawPrints', 24, 16, function (p, o) {
    var d = o.dir || 'd', i, x, y, vx = d === 'l' ? -1 : d === 'r' ? 1 : 0, vy = d === 'u' ? -1 : d === 'd' ? 1 : 0;
    for (i = 0; i < 3; i++) {
      x = 12 + vx * (i - 1) * 8 + (vx ? 0 : (i % 2 ? 3 : -3)); y = 8 + vy * (i - 1) * 5 + (vy ? 0 : (i % 2 ? 2 : -2));
      p.ell(x, y, 3.4, 2.4, p.pat('#6e62e0', 12)); p.r(x - 3, y - 4, 2, 2, p.pat('#6e62e0', 12)); p.r(x, y - 5, 2, 2, p.pat('#6e62e0', 12)); p.r(x + 3, y - 4, 2, 2, p.pat('#6e62e0', 12));
    }
  }, { floor: true });
  dec('serpFloor', 40, 18, function (p) {
    p.line(0, 4, 8, 12, '#ff5fd2', 1); p.line(8, 12, 16, 5, '#ff5fd2', 1); p.line(16, 5, 26, 13, '#ff5fd2', 1);
    p.line(4, 14, 14, 9, '#4de0ff', 1); p.line(14, 9, 24, 15, '#4de0ff', 1); p.line(24, 15, 38, 6, '#4de0ff', 1);
    p.line(20, 2, 28, 8, '#ffe45c', 1); p.line(28, 8, 36, 3, '#ffe45c', 1);
  }, { floor: true });
  dec('posterShow', 34, 30, function (p) {
    sb(p, 0, 0, 34, 30, '#f6f2e0', '#ffffff', '#c9bfa0');
    p.r(2, 2, 30, 8, '#6a2cc0'); p.txt('SHOW', 10, 4, '#ffe45c', 1);
    SPR.head('bonnie', p.at(p.ox + 3, p.oy + 11, 0.21), {}); SPR.head('freddy', p.at(p.ox + 12, p.oy + 11, 0.21), {}); SPR.head('chica', p.at(p.ox + 21, p.oy + 11, 0.21), {});
    p.r(2, 22, 30, 6, '#b3182b'); p.txt('HOY 6PM', 4, 23, '#ffffff', 1);
  });
  dec('bunting', 96, 14, function (p) {
    p.line(0, 2, 95, 2, '#98a8c0', 1);
    var cols = ['#ff3b4a', '#ffe45c', '#4de0ff', '#ff5fd2', '#3fd479', '#a05cff'];
    for (var i = 0; i < 8; i++) { var x = 2 + i * 12; p.poly([x, 2, x + 10, 2, x + 5, 12], C.ink); p.poly([x + 1, 3, x + 9, 3, x + 5, 10], cols[i % 6]); }
  });
  dec('streamer', 40, 30, function (p) {
    var i, cols = ['#ff5fd2', '#4de0ff', '#ffe45c'];
    for (i = 0; i < 3; i++) {
      var x = 4 + i * 13;
      p.r(x - 1, 0, 3, 3, '#e8e0f0');
      p.line(x, 2, x - 3, 8, cols[i], 2); p.line(x - 3, 8, x + 3, 14, cols[i], 2); p.line(x + 3, 14, x - 2, 20, cols[i], 2); p.line(x - 2, 20, x + 2, 28, cols[i], 2);
    }
  });
  dec('guitarWall', 38, 32, function (p) {
    var i;
    p.r(0, 4, 38, 3, C.ink); p.r(1, 5, 36, 1, '#8a5a34');
    [[9, '#c4283c'], [29, '#2a5ab0']].forEach(function (g) {
      p.r(g[0] - 2, 6, 4, 11, C.ink); p.r(g[0] - 1, 7, 2, 10, '#8a5a34'); p.r(g[0] - 3, 2, 6, 5, C.ink); p.r(g[0] - 2, 3, 4, 3, '#4a2c16');
      p.ell(g[0], 18, 5.2, 3.8, C.ink); p.ell(g[0], 25, 7, 5.6, C.ink); p.r(g[0] - 4, 19, 8, 4, C.ink);
      p.ell(g[0], 18, 4.2, 2.8, g[1]); p.ell(g[0], 25, 6, 4.6, g[1]); p.r(g[0] - 3, 19, 6, 4, g[1]); p.ell(g[0] + 1, 24, 2.6, 1.8, '#e8e0f0'); p.r(g[0] - 2, 27, 5, 1, C.ink);
    });
  });
  dec('setlist', 16, 22, function (p) {
    p.r(0, 0, 16, 22, '#8f87b5'); p.r(1, 1, 14, 20, '#f6f2e0'); p.r(2, 2, 12, 3, '#6a2cc0'); p.txt('SET', 3, 2, '#ffe45c', 1);
    for (var i = 0; i < 5; i++) { p.r(3, 7 + i * 3, 2, 1, '#b3182b'); p.r(6, 7 + i * 3, 8 - (i % 2) * 3, 1, '#8f87b5'); }
    p.r(7, 0, 2, 2, '#ff3b4a');
  });
  dec('mirrorFull', 20, 32, function (p) {
    p.r(0, 0, 20, 32, C.ink); p.r(1, 1, 18, 30, GOLD[2]); p.r(2, 2, 16, 28, '#7a8aa4'); p.r(2, 2, 16, 2, '#aab8d0');
    p.poly([4, 28, 10, 28, 16, 4, 10, 4], '#98aac4'); p.poly([13, 28, 16, 28, 17, 18, 16, 14], '#b8c6dc');
    p.r(8, 10, 4, 14, '#4a5870'); p.circ(10, 9, 3, '#4a5870'); p.p(9, 9, '#ff4adf'); p.p(11, 9, '#ff4adf');
  });
})(window);
