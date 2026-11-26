/* props-b.js — sala de fiestas y sala de juegos. */
(function (G) {
  'use strict';
  var C = PX.C, A = G.PROPS_API, reg = A.reg, dec = A.dec, sb = A.sb;

  /* ====================== SALA DE FIESTAS ====================== */
  reg('stage', 112, 76, 7, 2, function (p) {
    // fondo de cortinas y letrero
    p.r(0, 14, 112, 32, C.ink);
    p.r(1, 15, 110, 31, '#1d1840'); p.dith(1, 15, 110, 31, '#3a1a6a', 5);
    for (var i = 0; i < 18; i++) { var sx = 4 + (i * 17) % 100, sy = 24 + (i * 7) % 18; p.r(sx, sy, 1, 3, '#ffe45c'); p.r(sx - 1, sy + 1, 3, 1, '#ffe45c'); }
    p.r(26, 18, 60, 9, '#6b4223'); p.r(26, 18, 60, 1, '#b87a42'); p.r(26, 26, 60, 1, '#2a180c');
    p.txt('FAZBEAR', 41, 20, '#ffe45c', 1);
    // cortinas laterales
    [[0, 0], [98, 1]].forEach(function (c) {
      for (var j = 0; j < 14; j += 3) { p.r(c[0] + j, 14, 3, 33, j % 6 ? '#5a1f9a' : '#7a3ac0'); }
      p.r(c[0] + (c[1] ? 0 : 13), 14, 1, 33, '#2e0a50');
    });
    // cenefa festoneada
    p.r(0, 11, 112, 7, '#6a2cc0'); p.r(0, 11, 112, 1, '#a05cff'); p.r(0, 16, 112, 2, '#f2c21c');
    for (i = 0; i < 112; i += 8) { p.ell(i + 4, 18, 4, 3, '#6a2cc0'); p.r(i + 3, 20, 2, 1, '#f2c21c'); }
    // tarima
    p.r(0, 44, 112, 32, C.ink);
    p.r(1, 45, 110, 14, '#92603a'); p.r(1, 45, 110, 1, '#c68a4e');
    for (i = 0; i < 112; i += 14) p.r(i, 46, 1, 12, '#6b4223');
    p.r(1, 59, 110, 15, '#5a3820'); p.r(1, 59, 110, 2, '#f2c21c'); p.r(1, 61, 110, 1, '#7a5a08');
    for (i = 4; i < 108; i += 11) { p.circ(i + 2, 59, 1.5, '#fff6b0'); }
    for (i = 6; i < 108; i += 22) { p.r(i, 64, 2, 5, '#ffe45c'); p.r(i - 1, 65, 4, 1, '#ffe45c'); }
    p.r(1, 73, 110, 1, '#3b2414');
    // mancha de luz donde falta Freddy
    p.ell(56, 52, 15, 4, p.pat('#fff6b0', 4));
    p.r(55, 38, 2, 14, '#98a8c0'); p.ell(56, 37, 3, 3, '#4a5870');                   // micrófono sin dueño
    // Bonnie y Chica quietos en el escenario
    SPR.body('bonnie', p.at(24, 11, 0.4), { guitar: true });
    SPR.body('chica', p.at(70, 11, 0.4), {});
  }, { light: { dx: 56, dy: 40, r: 46, col: '#c48aff', glow: '#a05cff' } });

  reg('partyTable', 66, 34, 4, 2, function (p, o) {
    var a = o.v === 'b' ? ['#2a5ab0', '#f2f0ff', '#6a8ae0', '#1a3a78'] : ['#c4283c', '#f2f0ff', '#e85a6c', '#7a1424'];
    p.r(0, 0, 66, 18, C.ink); p.r(1, 1, 64, 16, a[1]);
    for (var i = 0; i < 8; i++) for (var j = 0; j < 2; j++) if ((i + j) & 1) p.r(1 + i * 8, 1 + j * 8, 8, 8, a[0]);
    p.r(1, 1, 64, 1, '#ffffff'); p.r(1, 16, 64, 1, a[3]);
    p.r(0, 18, 66, 12, C.ink); p.r(1, 18, 64, 11, a[0]); p.r(1, 18, 64, 2, a[2]);
    for (i = 0; i < 64; i += 8) { p.r(1 + i, 20, 1, 8, a[3]); p.ell(5 + i, 29, 4, 2, a[0]); }
    p.r(6, 30, 4, 4, '#2c3548'); p.r(56, 30, 4, 4, '#2c3548');
    // gorritos, platos, vasos y pastel
    [[7, '#ff5fd2'], [47, '#4de0ff'], [55, '#ffe45c']].forEach(function (h) {
      p.poly([h[0], 9, h[0] + 4, 9, h[0] + 2, 0], C.ink); p.poly([h[0] + 1, 8, h[0] + 3, 8, h[0] + 2, 2], h[1]); p.p(h[0] + 2, 0, '#ffffff');
    });
    p.ell(26, 9, 8, 4, '#c4d0e4'); p.ell(26, 8, 7, 3, '#f2f0ff'); p.r(21, 3, 10, 6, '#7a3a1a'); p.r(21, 3, 10, 3, '#ff9aa0'); p.r(21, 3, 10, 1, '#ffffff');
    p.r(24, 0, 1, 4, '#4de0ff'); p.r(27, 0, 1, 4, '#ffe45c'); p.p(24, 0, '#ff3b4a'); p.p(27, 0, '#ff3b4a');
    p.r(38, 5, 4, 6, '#f2f0ff'); p.r(38, 5, 4, 2, a[0]); p.r(13, 6, 4, 5, '#f2f0ff'); p.r(13, 6, 4, 2, '#3fd479');
    p.p(44, 12, '#ffe45c'); p.p(11, 13, '#4de0ff'); p.p(34, 13, '#ff5fd2'); p.p(30, 14, '#3fd479');
  });

  reg('kidChair', 14, 20, 0, 0, function (p, o) {
    var c = o.v === 'y' ? ['#f2c21c', '#fff6b0', '#9a7a0c'] : o.v === 'b' ? ['#3a7ad0', '#7aaaf0', '#1f4a8a'] : ['#d04a8c', '#ff8ac0', '#7a1f58'];
    p.r(1, 0, 12, 10, C.ink); p.r(2, 1, 10, 8, c[0]); p.r(2, 1, 10, 1, c[1]); p.r(2, 8, 10, 1, c[2]);
    p.r(0, 9, 14, 6, C.ink); p.r(1, 10, 12, 4, c[1]); p.r(1, 13, 12, 1, c[2]);
    p.r(1, 15, 2, 5, C.ink); p.r(11, 15, 2, 5, C.ink); p.r(2, 15, 1, 4, '#6a7a94'); p.r(11, 15, 1, 4, '#6a7a94');
  });

  reg('balloons', 24, 46, 0, 0, function (p) {
    p.r(10, 38, 5, 8, C.ink); p.r(11, 39, 3, 6, '#6a7a94'); p.line(12, 38, 12, 22, '#98a8c0', 1);
  }, {
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y), s = Math.sin(t * 1.3 + inst.x) * 2;
      [[6, 8, '#ff3b4a'], [13, 4, '#4de0ff'], [18, 10, '#ffe45c']].forEach(function (b, i) {
        var bx = b[0] + s * (0.6 + i * 0.3), by = b[1] + Math.sin(t * 1.7 + i) * 1.5;
        p.line(12, 22, bx, by + 8, '#98a8c0', 1);
        p.ell(bx, by, 5, 7, C.ink); p.ell(bx, by, 4, 6, b[2]); p.r(bx - 2, by - 4, 2, 3, '#ffffff'); p.poly([bx - 1, by + 7, bx + 1, by + 7, bx, by + 9], b[2]);
      });
    }
  });

  reg('speaker', 18, 32, 1, 1, function (p) {
    sb(p, 0, 0, 18, 32, '#2c3040', '#5a6078', '#14161e');
    p.circ(9, 10, 5, C.ink); p.circ(9, 10, 4, '#4a5068'); p.circ(9, 10, 2, '#14161e'); p.p(8, 9, '#98a0b8');
    p.circ(9, 23, 6, C.ink); p.circ(9, 23, 5, '#4a5068'); p.circ(9, 23, 3, '#14161e'); p.p(7, 21, '#98a0b8');
    p.r(13, 2, 3, 1, '#ff3b4a');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), k = 1 + (Math.sin(t * 12) > 0.3 ? 1 : 0);
      p.circ(9, 23, 3 + k * 0.4, '#14161e'); p.circ(9, 10, 2 + k * 0.3, '#14161e');
    }
  });

  reg('prizeCounter', 52, 36, 3, 2, function (p) {
    p.r(0, 0, 52, 36, C.ink);
    p.r(1, 1, 50, 14, '#98c8e8'); p.r(1, 1, 50, 1, '#d8f0ff'); p.dith(1, 1, 50, 14, '#ffffff', 2);       // vitrina de vidrio
    [[4, '#ff5fd2'], [14, '#4de0ff'], [24, '#ffe45c'], [34, '#9a4c22'], [43, '#a05cff']].forEach(function (b) {
      p.ell(b[0] + 3, 9, 4, 4, '#05030a'); p.ell(b[0] + 3, 9, 3, 3, b[1]); p.circ(b[0] + 1, 5, 1.4, b[1]); p.circ(b[0] + 5, 5, 1.4, b[1]); p.p(b[0] + 2, 9, C.ink); p.p(b[0] + 4, 9, C.ink);
    });
    p.r(1, 15, 50, 20, '#d04a8c'); p.r(1, 15, 50, 2, '#ff8ac0'); p.r(1, 33, 50, 2, '#7a1f58');
    for (var i = 0; i < 6; i++) { p.r(5 + i * 8, 20, 4, 1, '#ffe45c'); p.r(6 + i * 8, 19, 2, 3, '#ffe45c'); }
    p.r(4, 27, 44, 4, '#7a1f58'); p.txt('PREMIOS', 12, 28, '#ffe45c', 1);
  });

  reg('giftPile', 34, 24, 2, 1, function (p) {
    [[0, 8, 16, 14, '#4de0ff', '#ff3b4a'], [14, 4, 12, 18, '#ff5fd2', '#ffe45c'], [22, 11, 12, 11, '#3fd479', '#ffffff']].forEach(function (g) {
      p.r(g[0], g[1], g[2], g[3], C.ink); p.r(g[0] + 1, g[1] + 1, g[2] - 2, g[3] - 2, g[4]);
      p.r(g[0] + 1, g[1] + 1, g[2] - 2, 1, '#ffffff');
      p.r(g[0] + g[2] / 2 - 1, g[1] + 1, 2, g[3] - 2, g[5]); p.r(g[0] + 1, g[1] + g[3] / 2, g[2] - 2, 2, g[5]);
      p.r(g[0] + g[2] / 2 - 3, g[1] - 2, 3, 3, g[5]); p.r(g[0] + g[2] / 2 + 1, g[1] - 2, 3, 3, g[5]);
    });
  });

  reg('discoStand', 18, 44, 1, 1, function (p) {
    p.r(7, 22, 4, 20, C.ink); p.r(8, 22, 2, 20, '#6a7a94'); p.r(2, 38, 14, 6, C.ink); p.r(3, 39, 12, 4, '#46526a'); p.r(3, 39, 12, 1, '#98a8c0');
    p.r(8, 0, 2, 6, '#98a8c0');
  }, {
    light: { dx: 9, dy: 14, r: 40, col: '#ff5fd2', glow: '#ff5fd2' },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      p.circ(9, 14, 9, C.ink); p.circ(9, 14, 8, '#aab4cc');
      for (var i = 0; i < 14; i++) {
        var a = t * 2 + i * 1.7, r2 = (i * 7) % 7;
        var px = 9 + Math.cos(a) * r2, py = 14 + Math.sin(a * 1.3) * r2 * 0.9;
        p.r(px, py, 2, 2, ['#ffffff', '#ff5fd2', '#4de0ff', '#ffe45c'][i % 4]);
      }
      p.r(4, 10, 3, 2, '#e8f0ff');
    }
  });

  reg('posterTask', 30, 36, 0, 0, function (p) {
    p.r(0, 0, 30, 36, C.ink); p.r(1, 1, 28, 34, '#ffe45c'); p.r(1, 1, 28, 1, '#fff6b0');
    p.r(3, 3, 24, 8, '#b3182b'); p.txt('FIESTA', 4, 5, '#ffffff', 1);
    p.circ(8, 21, 4, '#9a4c22'); p.circ(5, 17, 2, '#9a4c22'); p.circ(11, 17, 2, '#9a4c22'); p.r(5, 14, 6, 2, C.ink); p.p(7, 21, C.ink); p.p(10, 21, C.ink);
    p.circ(18, 22, 3.4, '#6e62e0'); p.r(16, 14, 1, 6, '#6e62e0'); p.r(19, 14, 1, 6, '#6e62e0'); p.p(17, 22, C.ink); p.p(20, 22, C.ink);
    p.r(3, 29, 24, 3, '#ff5fd2'); p.r(5, 30, 20, 1, '#a82a88');
    // esquina despegada con una nota escondida
    p.poly([23, 26, 29, 26, 29, 35], '#c8a020'); p.r(25, 30, 3, 4, '#f6f2e0'); p.p(26, 31, '#8f87b5');
  }, {
    anim: function (ctx, x, y, t, inst, st) {
      if (st && st.done === 'pending' && Math.sin(t * 4) > 0) { var p = new PX.Pen(ctx, 1, x, y); p.r(25, 29, 4, 1, '#ffffff'); p.r(27, 28, 1, 3, '#ffffff'); }
    }
  });

  dec('bannerL', 90, 24, function (p) {
    p.line(0, 3, 89, 3, '#98a8c0', 1);
    var cols = ['#ff3b4a', '#ffe45c', '#4de0ff', '#ff5fd2', '#3fd479'], L = 'FELIZ';
    for (var i = 0; i < 5; i++) {
      var x = 4 + i * 17, c = cols[i];
      p.poly([x, 3, x + 14, 3, x + 7, 22], C.ink); p.poly([x + 1, 4, x + 13, 4, x + 7, 20], c);
      p.txt(L[i], x + 5, 6, C.ink, 1);
    }
  });
  dec('bannerR', 90, 24, function (p) {
    p.line(0, 3, 89, 3, '#98a8c0', 1);
    var cols = ['#4de0ff', '#ff3b4a', '#ffe45c', '#3fd479', '#ff5fd2'], L = 'CUMPL';
    for (var i = 0; i < 5; i++) {
      var x = 4 + i * 17, c = cols[i];
      p.poly([x, 3, x + 14, 3, x + 7, 22], C.ink); p.poly([x + 1, 4, x + 13, 4, x + 7, 20], c);
      p.txt(L[i], x + 5, 6, C.ink, 1);
    }
  });
  dec('rugParty', 112, 32, function (p) {
    p.r(0, 0, 112, 32, C.ink); p.r(2, 2, 108, 28, '#2a1f6a');
    var cols = ['#ff5fd2', '#4de0ff', '#ffe45c', '#3fd479', '#ff3b4a'];
    for (var i = 0; i < 108; i += 12) p.r(2 + i, 2, 6, 28, cols[(i / 12) % 5 | 0]);
    p.dith(2, 2, 108, 28, '#05030a', 6);
    p.r(0, 0, 112, 2, '#f2c21c'); p.r(0, 30, 112, 2, '#f2c21c');
  }, { floor: true });
  dec('confetti', 48, 24, function (p) {
    for (var i = 0; i < 30; i++) {
      var h = PX.rng(i * 13 + 7)(); var x = (h * 47) | 0, y = ((PX.rng(i * 29 + 3)()) * 23) | 0;
      p.r(x, y, 2, 1, ['#4de0ff', '#ffe45c', '#ff3b4a', '#3fd479', '#ff5fd2', '#ffffff'][i % 6]);
    }
  }, { floor: true });
  dec('spill', 20, 12, function (p) {
    p.ell(10, 6, 9, 4, p.pat('#c4283c', 11)); p.ell(8, 5, 5, 2.4, p.pat('#e85a6c', 9));
    p.r(15, 2, 3, 1, '#f2f0ff');
  }, { floor: true });

  /* ====================== SALA DE JUEGOS ====================== */
  var AC = {
    p: ['#ff5fd2', '#ff8ac0', '#a82a88'], c: ['#4de0ff', '#a4f0ff', '#0e5a70'],
    y: ['#ffe45c', '#fff6b0', '#b8820c'], g: ['#3fd479', '#a4ffc4', '#0e4026']
  };
  reg('arcadeM', 30, 46, 2, 1, function (p, o) {
    var c = AC[o.v] || AC.p;
    p.r(1, 0, 28, 46, C.ink);
    p.r(2, 1, 26, 8, '#1c1740'); p.r(2, 1, 26, 1, c[0]); p.txt(o.v === 'c' ? 'PONG' : o.v === 'y' ? 'MAZE' : o.v === 'g' ? 'RACE' : 'ALIEN', 5, 3, c[1], 1);
    p.r(2, 9, 26, 20, '#262055'); p.r(4, 10, 22, 17, C.ink); p.r(5, 11, 20, 15, '#070620');
    p.poly([2, 29, 28, 29, 28, 35, 2, 35], '#383078'); p.r(2, 29, 26, 1, '#5a50a8');
    p.r(7, 30, 2, 4, '#98a8c0'); p.circ(8, 30, 2, c[0]);
    p.circ(15, 32, 1.6, '#ff3b4a'); p.circ(20, 32, 1.6, '#ffe45c'); p.circ(24, 32, 1.6, '#3fd479');
    p.r(2, 35, 26, 11, '#1c1740'); p.r(2, 35, 26, 1, '#383078');
    p.r(12, 38, 6, 4, C.ink); p.r(13, 39, 4, 1, '#ffe45c');
    p.r(2, 1, 1, 45, c[2]); p.r(27, 1, 1, 45, c[2]);
    for (var i = 0; i < 8; i++) { p.r(3, 12 + i * 4, 1, 2, c[0]); p.r(26, 12 + i * 4, 1, 2, c[0]); }   // luces laterales
  }, {
    anim: function (ctx, x, y, t, inst) {
      var p = new PX.Pen(ctx, 1, x, y), v = inst.v || 'p', c = (AC[v] || AC.p), i, j;
      p.r(5, 11, 20, 15, '#070620');
      if (v === 'p') {
        var sh = Math.floor(t * 2) % 4;
        for (j = 0; j < 3; j++) for (i = 0; i < 5; i++) { p.r(7 + i * 4 + sh, 13 + j * 3, 2, 2, c[0]); p.p(7 + i * 4 + sh, 13 + j * 3, '#fff'); }
        p.r(14 + Math.round(Math.sin(t * 1.5) * 6), 23, 3, 2, '#3fd479'); p.r(15 + Math.round(Math.sin(t * 1.5) * 6), 21, 1, 1, '#ffe45c');
      } else if (v === 'c') {
        p.r(7, 14 + Math.round(Math.sin(t * 2) * 4), 1, 5, c[0]); p.r(23, 14 + Math.round(Math.cos(t * 2.2) * 4), 1, 5, c[0]);
        p.r(8 + ((t * 14) % 14 | 0), 12 + ((t * 9) % 12 | 0), 2, 2, '#fff'); p.r(15, 11, 1, 14, 'rgba(255,255,255,0.2)');
      } else if (v === 'y') {
        for (j = 0; j < 4; j++) p.r(6, 12 + j * 3, 18 - (j % 2) * 6, 1, '#2a5ab0');
        for (i = 0; i < 6; i++) p.p(7 + i * 3, 13, '#ffe45c');
        p.circ(10 + ((t * 8) % 12 | 0), 21, 2, '#ffe45c'); p.r(22, 15, 2, 2, '#ff3b4a');
      } else {
        for (j = 0; j < 5; j++) p.r(15 - j * 2, 12 + j * 3 + ((t * 20) % 3 | 0), 1 + j * 4, 1, c[0]);
        p.r(13 + Math.round(Math.sin(t * 2) * 3), 22, 4, 3, '#ff3b4a');
      }
      p.r(5, 11 + ((t * 10) % 15 | 0), 20, 1, 'rgba(255,255,255,0.12)');
    }
  });

  reg('airHockey', 84, 40, 5, 2, function (p) {
    p.r(0, 0, 84, 40, C.ink);
    p.r(1, 1, 82, 24, '#14306a'); p.r(1, 1, 82, 2, '#4a8ae0'); p.r(3, 3, 78, 20, '#0a4a8a'); p.r(3, 3, 78, 1, '#4de0ff');
    p.r(41, 3, 1, 20, '#4de0ff'); p.circ(42, 13, 6, '#0e5a9a'); p.circ(42, 13, 5, '#0a4a8a');
    p.r(1, 25, 82, 14, '#c4283c'); p.r(1, 25, 82, 2, '#ff6070'); p.r(1, 37, 82, 2, '#6b0f1c');
    for (var i = 0; i < 10; i++) p.r(6 + i * 8, 30, 4, 3, '#ffe45c');
    p.r(4, 38, 4, 2, '#14181e'); p.r(76, 38, 4, 2, '#14181e');
  }, {
    light: { dx: 42, dy: 14, r: 40, col: '#4de0ff', glow: '#4de0ff' },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), px = 42 + Math.sin(t * 2.3) * 28, py = 13 + Math.sin(t * 3.1) * 7;
      p.circ(14 + Math.sin(t * 1.4) * 4, 13 + Math.sin(t * 2) * 5, 4, '#ff3b4a'); p.circ(70 + Math.cos(t * 1.7) * 4, 13 + Math.cos(t * 2.2) * 5, 4, '#ffe45c');
      p.circ(px, py, 2.4, '#ffffff');
    }
  });

  reg('clawM', 34, 54, 2, 1, function (p) {
    p.r(0, 0, 34, 54, C.ink);
    p.r(1, 1, 32, 8, '#a82a88'); p.r(1, 1, 32, 1, '#ff8ac0'); p.txt('CLAW', 9, 3, '#ffe45c', 1);
    p.r(2, 10, 30, 28, '#98c8e8'); p.dith(2, 10, 30, 28, '#1c1740', 3); p.r(2, 10, 30, 1, '#d8f0ff');
    [[4, '#ff5fd2'], [11, '#4de0ff'], [18, '#ffe45c'], [25, '#3fd479']].forEach(function (b, i) {
      p.ell(b[0] + 3, 33, 4, 4, '#05030a'); p.ell(b[0] + 3, 33, 3, 3, b[1]); p.circ(b[0] + 1, 30, 1.2, b[1]); p.circ(b[0] + 5, 30, 1.2, b[1]);
      p.ell(b[0] + 5, 26 + (i % 2) * 2, 3, 3, '#05030a'); p.ell(b[0] + 5, 26 + (i % 2) * 2, 2, 2, b[1]);
    });
    p.r(1, 38, 32, 14, '#6a2cc0'); p.r(1, 38, 32, 2, '#a05cff');
    p.circ(9, 44, 2.6, '#ff3b4a'); p.r(15, 42, 2, 5, '#98a8c0'); p.circ(16, 42, 2, '#ffe45c');
    p.r(22, 43, 8, 3, C.ink); p.r(23, 44, 6, 1, '#4de0ff');
  }, {
    light: { dx: 17, dy: 24, r: 34, col: '#ff5fd2', glow: '#ff5fd2' },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), cx = 17 + Math.sin(t * 0.9) * 9, cy = 14 + (Math.sin(t * 1.4) + 1) * 4;
      p.r(cx, 10, 1, cy - 8, '#98a8c0'); p.r(cx - 3, cy, 7, 2, '#c4d0e4'); p.r(cx - 4, cy + 2, 2, 3, '#c4d0e4'); p.r(cx + 3, cy + 2, 2, 3, '#c4d0e4');
    }
  });

  reg('ballpit', 68, 44, 4, 2, function (p) {
    p.r(0, 0, 68, 44, C.ink);
    p.r(1, 1, 66, 26, '#1a4aa8'); p.r(1, 1, 66, 2, '#6aa0f0');
    var cols = ['#ff3b4a', '#ffe45c', '#3fd479', '#4de0ff', '#ff5fd2', '#ffffff'];
    for (var i = 0; i < 96; i++) {
      var h = PX.rng(i * 17 + 5), x = 3 + ((h() * 60) | 0), y = 4 + ((h() * 20) | 0);
      p.circ(x + 2, y + 2, 2.6, C.ink); p.circ(x + 2, y + 2, 2, cols[i % 6]); p.p(x + 1, y + 1, '#ffffff');
    }
    p.r(1, 27, 66, 15, '#2a6ae0'); p.r(1, 27, 66, 2, '#6aa0f0');
    for (i = 0; i < 66; i += 11) p.r(1 + i, 29, 1, 12, '#1a4aa8');
    p.r(1, 40, 66, 2, '#0a2a6a');
  });

  reg('beanBag', 20, 16, 0, 0, function (p, o) {
    var c = o.v === 'g' ? ['#3fd479', '#a4ffc4', '#1f8a4c'] : o.v === 'o' ? ['#ff9a2e', '#ffc866', '#a04a08'] : ['#a05cff', '#d0a4ff', '#5a2aa0'];
    p.ell(10, 9, 9, 6, C.ink); p.ell(10, 8, 8, 5, c[0]); p.ell(8, 6, 4, 2, c[1]); p.r(4, 12, 12, 1, c[2]);
  });

  reg('ticketM', 24, 40, 1, 1, function (p) {
    sb(p, 0, 0, 24, 40, '#c4283c', '#ff6070', '#6b0f1c');
    p.r(3, 3, 18, 8, '#05030a'); p.txt('BOLETOS', 3, 5, '#ffe45c', 1);
    p.r(4, 14, 16, 12, '#f2c21c'); p.r(4, 14, 16, 1, '#fff6b0');
    for (var i = 0; i < 4; i++) p.r(6 + i * 4, 17, 2, 6, '#b3182b');
    p.r(6, 30, 12, 3, C.ink); p.r(7, 31, 10, 1, '#4de0ff');
  }, { light: { dx: 12, dy: 20, r: 22, col: '#ff3b4a', glow: null } });

  dec('neonGames', 44, 22, function (p) {
    p.r(0, 0, 44, 22, '#0a0820'); p.r(1, 1, 42, 20, '#14103a');
    p.txt('GAMES', 7, 6, '#ff5fd2', 2);
    p.r(3, 3, 38, 1, '#4de0ff'); p.r(3, 18, 38, 1, '#4de0ff'); p.r(3, 3, 1, 16, '#4de0ff'); p.r(40, 3, 1, 16, '#4de0ff');
    p.dith(0, 0, 44, 22, '#ff5fd2', 2);
  });
  dec('neonStar', 18, 18, function (p) {
    p.poly([9, 0, 11, 6, 18, 7, 12, 11, 14, 18, 9, 14, 4, 18, 6, 11, 0, 7, 7, 6], '#ffe45c');
    p.poly([9, 3, 10, 7, 14, 8, 11, 10, 12, 14, 9, 12, 6, 14, 7, 10, 4, 8, 8, 7], '#fff6b0');
    p.dith(0, 0, 18, 18, '#ff9a2e', 3);
  });
  dec('rugArcade', 96, 40, function (p) {
    p.r(0, 0, 96, 40, '#0a0820');
    for (var i = 0; i < 96; i += 16) for (var j = 0; j < 40; j += 16) {
      p.poly([i + 8, j, i + 16, j + 8, i + 8, j + 16, i, j + 8], ((i + j) / 16) & 1 ? '#2c2468' : '#4a2c8a');
      p.p(i + 8, j + 8, '#ffe45c');
    }
    p.r(0, 0, 96, 1, '#4de0ff'); p.r(0, 39, 96, 1, '#ff5fd2');
  }, { floor: true });
})(window);
