/* props-a.js — objetos y decoración: utilidades, oficina de seguridad y pasillo.
   Cada objeto se dibuja en vista 3/4 sobre su propio lienzo; la parte baja del sprite es su "base" en el suelo. */
(function (G) {
  'use strict';
  var C = PX.C, PROPS = G.PROPS = {}, DECOR = G.DECOR = {};
  function reg(n, w, h, fw, fh, draw, o) { PROPS[n] = Object.assign({ n: n, w: w, h: h, fw: fw, fh: fh, draw: draw }, o || {}); }
  function dec(n, w, h, draw, o) { DECOR[n] = Object.assign({ n: n, w: w, h: h, draw: draw }, o || {}); }
  G.PROPS_API = { reg: reg, dec: dec };

  /* caja con relieve: luz arriba/izquierda, sombra abajo/derecha, contorno de tinta dentro del rectángulo */
  function sb(p, x, y, w, h, base, hi, lo) {
    p.r(x, y, w, h, C.ink); p.r(x + 1, y + 1, w - 2, h - 2, base);
    p.r(x + 1, y + 1, w - 2, 1, hi); p.r(x + 1, y + 1, 1, h - 2, hi);
    p.r(x + 1, y + h - 2, w - 2, 1, lo); p.r(x + w - 2, y + 1, 1, h - 2, lo);
  }
  G.PROPS_API.sb = sb;

  /* ====================== OFICINA DE SEGURIDAD ====================== */
  reg('deskL', 80, 32, 5, 2, function (p) {
    sb(p, 0, 0, 80, 32, '#7c5230', '#b87a42', '#3b2414');
    p.r(2, 2, 76, 12, '#8e5e36'); p.r(2, 2, 76, 1, '#c68a4e');            // tablero
    for (var i = 0; i < 6; i++) p.r(6 + i * 13, 4 + (i * 3) % 7, 8, 1, '#7a4c28');   // vetas
    p.r(2, 14, 76, 1, '#2a180c');
    p.r(2, 15, 76, 15, '#5a3820');                                         // frente
    p.r(2, 15, 3, 15, '#3b2414'); p.r(75, 15, 3, 15, '#3b2414');
    p.r(28, 16, 24, 13, '#1f1109'); p.r(28, 16, 24, 1, '#0f0804');          // hueco para las piernas
    [[6, 17], [55, 17]].forEach(function (d) {                                // cajones
      p.r(d[0], d[1], 17, 5, '#6e4426'); p.r(d[0], d[1], 17, 1, '#9a6a3c'); p.r(d[0] + 6, d[1] + 2, 5, 1, '#d8c890');
      p.r(d[0], d[1] + 6, 17, 5, '#6e4426'); p.r(d[0], d[1] + 6, 17, 1, '#9a6a3c'); p.r(d[0] + 6, d[1] + 8, 5, 1, '#d8c890');
    });
    // papeles, taza y tarjeta sobre el escritorio
    p.r(6, 5, 11, 7, '#e8e0f0'); p.r(6, 5, 11, 1, '#fff'); p.r(8, 7, 7, 1, '#8f87b5'); p.r(8, 9, 5, 1, '#8f87b5');
    p.r(9, 4, 11, 7, '#d8d0e8'); p.r(11, 6, 7, 1, '#8f87b5');
    p.box(63, 4, 5, 6, '#b3182b', C.ink, 0); p.r(68, 5, 2, 3, '#b3182b'); p.r(63, 4, 5, 1, '#ff6070');
    p.r(70, 6, 6, 4, '#ffe45c'); p.r(71, 7, 4, 1, '#b8820c');                 // nota adhesiva
    p.r(38, 6, 24, 6, '#2c3548'); p.r(38, 6, 24, 1, '#4a5870');              // teclado
    for (var k = 0; k < 11; k++) p.r(39 + k * 2, 8, 1, 1, '#98a8c0');
  });

  reg('cabinet', 16, 30, 1, 1, function (p) {
    sb(p, 0, 0, 16, 30, '#4a586e', '#7e90b0', '#2c3548');
    p.r(2, 2, 12, 5, '#6c7c96'); p.r(2, 2, 12, 1, '#a4b4cc');
    for (var i = 0; i < 3; i++) {
      var y = 9 + i * 7;
      p.r(2, y, 12, 6, '#56667f'); p.r(2, y, 12, 1, '#8ca0bc'); p.r(2, y + 5, 12, 1, '#34425a');
      p.r(6, y + 2, 4, 2, '#c4d0e4'); p.r(3, y + 1, 2, 2, '#e8e0f0');
    }
  });

  reg('locker', 16, 38, 1, 1, function (p, o) {
    var col = o.v === 'b' ? ['#3a6a8a', '#6ea0c4', '#1f3f56'] : ['#4a6a4a', '#7ea67e', '#2a402a'];
    sb(p, 0, 0, 16, 38, col[0], col[1], col[2]);
    p.r(2, 2, 12, 5, col[1]); p.r(2, 2, 12, 1, '#ffffff');
    p.r(2, 8, 12, 27, col[0]); p.r(2, 8, 12, 1, col[2]); p.r(8, 8, 1, 27, col[2]);
    for (var i = 0; i < 4; i++) p.r(3, 11 + i * 2, 4, 1, col[2]);               // rejillas
    for (i = 0; i < 4; i++) p.r(10, 11 + i * 2, 4, 1, col[2]);
    p.r(6, 22, 2, 3, '#d8c890'); p.r(10, 22, 2, 3, '#d8c890');                  // manijas
    p.r(4, 28, 3, 3, '#ffe45c'); p.r(5, 29, 1, 1, C.ink);                        // candado
  });

  reg('crt', 18, 22, 0, 0, function (p) {
    p.r(0, 0, 18, 18, C.ink); p.r(1, 1, 16, 16, '#aaa8a0'); p.r(1, 1, 16, 1, '#d8d6ce'); p.r(1, 16, 16, 1, '#6a6862');
    p.r(3, 3, 12, 11, '#06180f'); p.r(3, 3, 12, 1, '#0e4026');
    p.r(4, 17, 10, 3, '#8a8880'); p.r(2, 19, 14, 2, '#6a6862'); p.p(14, 15, '#ff3b4a');
  }, {
    light: { dx: 9, dy: 10, r: 26, col: '#3fd479' },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      p.r(3, 3, 12, 11, '#06180f');
      for (var i = 0; i < 4; i++) { var w = 4 + ((i * 5 + Math.floor(t * 1.5)) % 6); p.r(4, 4 + i * 2, w, 1, i % 2 ? '#1f8a4c' : '#3fd479'); }
      if (Math.sin(t * 5) > 0) p.r(4, 12, 2, 1, '#a4ffc4');
      p.r(3, 3 + ((t * 8) % 11 | 0), 12, 1, 'rgba(164,255,196,0.25)');
    }
  });

  reg('phone', 18, 12, 0, 0, function (p) {
    p.r(0, 3, 18, 9, C.ink); p.r(1, 4, 16, 7, '#2a3040'); p.r(1, 4, 16, 1, '#5a6a84');
    p.r(3, 0, 12, 4, C.ink); p.r(4, 1, 10, 2, '#363f52'); p.r(4, 1, 10, 1, '#6a7a94');   // auricular
    p.r(2, 0, 3, 5, '#363f52'); p.r(13, 0, 3, 5, '#363f52');
    for (var i = 0; i < 3; i++) for (var j = 0; j < 2; j++) p.r(5 + i * 3, 6 + j * 2, 2, 1, '#98a8c0');
    p.p(15, 6, '#ff3b4a');
  }, {
    anim: function (ctx, x, y, t, inst, st) {
      if (st && st.done !== 'pending') return;
      var p = new PX.Pen(ctx, 1, x, y), ring = (t % 1.5) < 0.8, sh = ring && Math.sin(t * 50) > 0 ? 1 : 0;
      if (!ring) return;
      p.r(3, 0 - sh, 12, 3, '#fff6b0');
      p.line(-2, 0, 0, -3, '#ffe45c', 1); p.line(18, -3, 20, 0, '#ffe45c', 1); p.line(-4, 3, -1, 2, '#ffe45c', 1); p.line(19, 2, 22, 3, '#ffe45c', 1);
      p.p(15, 6, '#ffe45c');
    }
  });

  reg('fan', 16, 22, 0, 0, function (p) {
    p.r(5, 17, 6, 5, C.ink); p.r(6, 18, 4, 3, '#46526a'); p.r(7, 10, 2, 8, '#6a7a94');
    p.r(1, 0, 14, 14, C.ink); p.r(2, 1, 12, 12, '#2c3548');
    p.ell(8, 7, 6, 6, '#1a2030'); p.r(7, 6, 2, 2, '#98a8c0');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      for (var i = 0; i < 3; i++) { var a = t * 14 + i * 2.094; p.line(8, 7, 8 + Math.cos(a) * 5, 7 + Math.sin(a) * 5, '#98a8c0', 2); }
      p.r(7, 6, 2, 2, '#c4d0e4');
    }
  });

  reg('chairO', 18, 26, 0, 0, function (p, o) {
    var col = o.v === 'g' ? ['#2a6a4a', '#4a9a74', '#18402c'] : ['#3a3f58', '#5a6288', '#22253a'];
    p.r(2, 0, 14, 4, C.ink); p.r(3, 1, 12, 14, col[0]); p.r(3, 1, 12, 1, col[1]); p.r(3, 14, 12, 1, col[2]);
    p.r(1, 2, 16, 12, C.ink); p.r(2, 3, 14, 10, col[0]); p.r(2, 3, 14, 1, col[1]); p.r(4, 6, 10, 1, col[2]);
    p.r(0, 14, 18, 7, C.ink); p.r(1, 15, 16, 5, col[1]); p.r(1, 15, 16, 1, '#ffffff'); p.r(1, 19, 16, 1, col[2]);
    p.r(8, 21, 2, 3, '#46526a'); p.r(3, 24, 12, 1, '#46526a'); p.r(2, 24, 2, 2, C.ink); p.r(14, 24, 2, 2, C.ink); p.r(8, 24, 2, 2, C.ink);
  });

  reg('trash', 12, 14, 0, 0, function (p) {
    p.poly([1, 3, 11, 3, 10, 13, 2, 13], C.ink); p.poly([2, 4, 10, 4, 9, 12, 3, 12], '#4a5870');
    p.r(2, 4, 8, 1, '#7e90b0'); p.r(1, 2, 10, 2, '#6a7a94'); p.r(1, 2, 10, 1, '#a4b4cc');
    p.r(3, 0, 3, 3, '#e8e0f0'); p.r(7, 1, 3, 2, '#d8c890');                         // papeles
    for (var i = 0; i < 4; i++) p.r(3 + i * 2, 6, 1, 5, '#34425a');
  });

  reg('plant', 18, 32, 1, 1, function (p, o) {
    p.r(3, 20, 12, 11, C.ink); p.r(4, 21, 10, 9, '#a04a2c'); p.r(4, 21, 10, 2, '#d06a44'); p.r(4, 28, 10, 2, '#6a2a18');
    p.r(2, 19, 14, 3, '#d06a44'); p.r(2, 19, 14, 1, '#f09a70');
    p.r(4, 22, 10, 1, '#3a2010');
    var g = ['#2a7a3a', '#3fb054', '#1a5028'];
    p.ell(9, 10, 4, 10, g[2]); p.ell(9, 10, 3, 9, g[0]);
    p.ell(4, 12, 3, 7, g[2]); p.ell(4, 12, 2, 6, g[1]);
    p.ell(14, 11, 3, 8, g[2]); p.ell(14, 11, 2, 7, g[1]);
    p.line(9, 19, 9, 5, '#1a5028', 1); p.ell(9, 3, 2, 3, g[1]);
  });

  reg('coffee', 18, 30, 1, 1, function (p) {
    sb(p, 0, 14, 18, 16, '#6a4223', '#a06c3c', '#3b2414');                          // mesita
    p.r(2, 18, 14, 1, '#3b2414'); p.r(2, 23, 14, 1, '#3b2414'); p.r(7, 19, 4, 3, '#2a180c');
    sb(p, 3, 0, 12, 14, '#b3182b', '#ff6070', '#6b0f1c');                          // cafetera
    p.r(5, 3, 8, 3, '#1a1a22'); p.r(6, 4, 6, 1, '#4de0ff');
    p.r(6, 8, 6, 5, '#e8e0f0'); p.r(7, 9, 4, 3, '#6a3a1a');
    p.r(12, 7, 2, 2, '#3fd479');
  }, { light: { dx: 12, dy: 8, r: 18, col: '#ffe45c', glow: null } });

  reg('doorPanel', 24, 30, 0, 0, function (p) {
    sb(p, 0, 0, 24, 30, '#3a4558', '#6a7e98', '#1e2832');
    p.r(3, 3, 18, 7, '#05030a'); p.r(4, 4, 16, 5, '#0e4026');
    p.txt('SEG', 6, 5, '#3fd479', 1);
    // botón de puerta (verde) y luz (roja)
    p.r(3, 12, 8, 8, C.ink); p.r(4, 13, 6, 6, '#1f8a4c'); p.r(4, 13, 6, 2, '#3fd479');
    p.r(13, 12, 8, 8, C.ink); p.r(14, 13, 6, 6, '#b3182b'); p.r(14, 13, 6, 2, '#ff6070');
    p.r(3, 22, 18, 5, '#222b3c'); for (var i = 0; i < 6; i++) p.r(4 + i * 3, 24, 2, 1, '#6a7e98');
  }, {
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), on = st && st.done !== 'locked' ? 1 : 0;
      p.r(11, 25, 2, 1, Math.sin(t * 5) > 0 ? '#ff3b4a' : '#6b0f1c');
      if (Math.sin(t * 3) > 0) p.r(19, 4, 1, 1, '#a4ffc4');
      
    },
    light: { dx: 12, dy: 14, r: 22, col: '#3fd479', glow: '#3fd479' }
  });

  /* ---- decoración de piso (oficina) ---- */
  dec('rugO', 80, 48, function (p) {
    p.r(0, 0, 80, 48, '#1c0a12'); p.r(2, 2, 76, 44, '#6b1f2e'); p.r(5, 5, 70, 38, '#7a2a3c');
    p.dith(5, 5, 70, 38, '#4a1220', 3);
    p.r(8, 8, 64, 32, '#6b1f2e'); p.r(11, 11, 58, 26, '#7a2a3c');
    for (var i = 0; i < 5; i++) p.poly([40, 12 + i * 5, 46 + i * 2, 24, 40, 36 - i * 5, 34 - i * 2, 24], i % 2 ? '#a04a5c' : '#4a1220');
    for (i = 0; i < 80; i += 4) { p.r(i, -1 + 0, 1, 2, '#c8b078'); p.r(i, 47, 1, 2, '#c8b078'); }
  }, { floor: true });
  dec('cables', 40, 14, function (p) {
    p.line(0, 3, 14, 8, '#14181e', 2); p.line(14, 8, 28, 4, '#14181e', 2); p.line(28, 4, 39, 10, '#14181e', 2);
    p.line(0, 6, 12, 11, '#2a1a1a', 1); p.line(12, 11, 30, 8, '#2a1a1a', 1);
    p.r(13, 7, 3, 2, '#c4d0e4'); p.r(29, 3, 3, 2, '#c4d0e4');
  }, { floor: true });
  dec('hazard', 48, 4, function (p) {
    for (var i = 0; i < 48; i += 8) { p.poly([i, 0, i + 4, 0, i + 8, 4, i + 4, 4], '#d8a010'); }
    p.r(0, 0, 48, 1, '#1a1000'); p.r(0, 3, 48, 1, '#1a1000');
  }, { floor: true });

  /* ---- decoración de pared ---- */
  dec('camMon', 46, 28, function (p) {
    sb(p, 0, 0, 46, 28, '#2c3548', '#5a6a84', '#14181e');
    for (var j = 0; j < 2; j++) for (var i = 0; i < 3; i++) {
      var x = 3 + i * 14, y = 3 + j * 12;
      p.r(x, y, 12, 10, C.ink); p.r(x + 1, y + 1, 10, 8, '#0a2a18');
      p.r(x + 1, y + 1, 10, 1, '#0e4026');
      p.txt(String(i + 1 + j * 3), x + 2, y + 2, '#3fd479', 1);
      p.r(x + 2 + ((i * 3 + j) % 5), y + 6, 4, 2, '#1f8a4c');
    }
  });
  dec('corkboard', 34, 24, function (p) {
    sb(p, 0, 0, 34, 24, '#b8884a', '#d8a868', '#6a4a22');
    p.dith(2, 2, 30, 20, '#8a5a2a', 4);
    p.r(4, 4, 9, 7, '#e8e0f0'); p.r(5, 5, 7, 1, '#8f87b5'); p.r(5, 7, 5, 1, '#8f87b5'); p.r(8, 3, 2, 2, '#ff3b4a');
    p.r(16, 5, 8, 9, '#ffe45c'); p.r(17, 7, 6, 1, '#b8820c'); p.r(17, 9, 4, 1, '#b8820c'); p.r(19, 4, 2, 2, '#3a6aa8');
    p.r(25, 4, 7, 7, '#4de0ff'); p.r(26, 6, 5, 1, '#0e5a70'); p.r(28, 3, 2, 2, '#ff3b4a');
    p.r(6, 14, 11, 7, '#ff9aa0'); p.r(7, 16, 9, 1, '#b3182b'); p.r(10, 13, 2, 2, '#3fd479');
    p.line(14, 6, 21, 15, '#b3182b', 1);                                          // hilo rojo
    p.r(20, 15, 10, 6, '#e8e0f0'); p.r(21, 17, 8, 1, '#8f87b5');
  });
  dec('clock', 16, 16, function (p) {
    p.circ(8, 8, 8, C.ink); p.circ(8, 8, 7, '#d8d0e8'); p.circ(8, 8, 6, '#f2f0ff');
    p.r(8, 3, 1, 5, C.ink); p.r(8, 8, 4, 1, C.ink); p.p(8, 8, '#ff3b4a');
    for (var i = 0; i < 4; i++) { p.p(8, 2 + (i % 2) * 12, C.ink); }
    p.p(2, 8, C.ink); p.p(14, 8, C.ink);
  });
  dec('kidDraw', 18, 22, function (p) {
    p.r(0, 0, 18, 22, '#8f87b5'); p.r(1, 1, 16, 20, '#f2f0ff');
    p.circ(13, 6, 3, '#ffe45c'); p.r(2, 15, 14, 2, '#3fd479');
    p.r(4, 9, 3, 6, '#ff3b4a'); p.circ(5, 7, 2, '#f0b888'); p.r(2, 10, 7, 1, '#ff3b4a');
    p.r(10, 10, 5, 5, '#4de0ff'); p.p(11, 11, '#fff'); p.p(13, 11, '#fff');
    p.line(3, 3, 8, 5, '#a05cff', 1);
    p.r(7, 0, 4, 2, '#ff3b4a');
  });
  dec('posterA', 22, 28, function (p) {
    sb(p, 0, 0, 22, 28, '#f2f0ff', '#ffffff', '#c9bfa0');
    p.r(2, 2, 18, 6, '#6a2cc0'); p.txt('YAY!', 4, 3, '#ffe45c', 1);
    p.circ(6, 17, 3.2, '#9a4c22'); p.circ(4, 14, 1.4, '#9a4c22'); p.circ(8, 14, 1.4, '#9a4c22'); p.r(4, 11, 4, 2, C.ink); p.p(5, 17, C.ink); p.p(7, 17, C.ink);
    p.circ(12, 18, 2.6, '#6e62e0'); p.r(11, 11, 1, 5, '#6e62e0'); p.r(13, 11, 1, 5, '#6e62e0'); p.p(11, 18, C.ink); p.p(13, 18, C.ink);
    p.circ(18, 18, 3, '#f2c21c'); p.r(16, 19, 4, 2, '#ff9a2e'); p.p(17, 17, C.ink); p.p(19, 17, C.ink);
    p.r(3, 23, 16, 2, '#ff5fd2'); p.r(5, 24, 12, 1, '#a82a88');
  });
  dec('notice', 14, 18, function (p) {
    p.r(0, 0, 14, 18, '#8f87b5'); p.r(1, 1, 12, 16, '#f6f2e0');
    p.r(2, 2, 10, 2, '#b3182b'); for (var i = 0; i < 4; i++) p.r(2, 6 + i * 3, 10 - (i % 2) * 3, 1, '#8f87b5');
    p.r(6, 0, 2, 2, '#ff3b4a');
  });
  dec('vent', 18, 12, function (p) {
    sb(p, 0, 0, 18, 12, '#4a5870', '#7e90b0', '#222b3c');
    for (var i = 0; i < 4; i++) p.r(2, 2 + i * 2, 14, 1, '#14181e');
    p.p(1, 1, '#c4d0e4'); p.p(16, 1, '#c4d0e4'); p.p(1, 10, '#c4d0e4'); p.p(16, 10, '#c4d0e4');
  });
  dec('fireExt', 10, 20, function (p) {
    p.r(2, 0, 6, 3, C.ink); p.r(3, 1, 4, 1, '#98a8c0'); p.r(7, 1, 3, 2, C.ink);
    p.r(1, 3, 8, 16, C.ink); p.r(2, 4, 6, 14, '#c8202e'); p.r(2, 4, 2, 14, '#ff6070'); p.r(2, 10, 6, 3, '#f2f0ff');
    p.r(8, 3, 2, 8, C.ink); p.p(9, 10, '#98a8c0');
  });
  dec('sconce', 12, 18, function (p) {
    p.r(4, 10, 4, 6, C.ink); p.r(5, 11, 2, 4, '#7e90b0');
    p.poly([1, 10, 11, 10, 9, 2, 3, 2], C.ink); p.poly([2, 9, 10, 9, 8, 3, 4, 3], '#ffe9a0'); p.r(4, 4, 4, 1, '#fff');
  });
  dec('plate', 40, 12, function (p, o) {
    var txt = o.text || 'SALA', w = Math.max(20, PX.Pen.prototype.txtW.call(p, txt, 1) + 8);
    sb(p, 0, 0, w, 12, '#1c1836', '#9a90ff', '#0a0820');
    p.r(2, 2, w - 4, 8, '#e8e0f0'); p.txt(txt, 4, 4, '#1c1836', 1);
  });
  dec('exitSign', 22, 12, function (p) {
    sb(p, 0, 0, 22, 12, '#2e0a10', '#b3182b', '#1a0408');
    p.r(2, 2, 18, 8, '#b3182b'); p.txt('SALIDA', 2, 4, '#ffffff', 1);
  });
  dec('windowN', 34, 26, function (p) {
    p.r(0, 0, 34, 26, '#2a180c'); p.r(2, 2, 30, 22, '#070620');
    p.r(2, 2, 30, 22, '#0c0a38'); p.dith(2, 12, 30, 12, '#2a2a70', 6);
    p.circ(24, 9, 4, '#f2f0ff'); p.circ(26, 8, 3.4, '#0c0a38');
    for (var i = 0; i < 6; i++) p.p(4 + i * 5, 4 + (i * 7) % 12, '#9a90ff');
    p.r(16, 2, 2, 22, '#2a180c'); p.r(2, 12, 30, 2, '#2a180c'); p.r(0, 24, 34, 2, '#6b4223'); p.r(0, 0, 34, 1, '#6b4223');
    for (i = 3; i < 22; i += 3) p.r(2, i, 14, 1, 'rgba(0,0,0,0.3)');
  });

  /* ====================== PASILLO ====================== */
  reg('bench', 34, 20, 2, 1, function (p) {
    p.r(0, 0, 34, 20, C.ink);
    p.r(1, 1, 32, 6, '#6b4223'); p.r(1, 1, 32, 1, '#a06c3c'); p.r(1, 6, 32, 1, '#2a180c');
    p.r(1, 8, 32, 5, '#7c5230'); p.r(1, 8, 32, 1, '#b87a42'); p.r(1, 12, 32, 1, '#3b2414');
    for (var i = 0; i < 4; i++) p.r(5 + i * 8, 10, 4, 1, '#6b4223');
    p.r(2, 13, 4, 6, '#2c3548'); p.r(28, 13, 4, 6, '#2c3548');
    p.r(2, 13, 4, 1, '#6a7a94'); p.r(28, 13, 4, 1, '#6a7a94');
  });
  reg('wetsign', 14, 20, 0, 0, function (p) {
    p.poly([1, 18, 4, 1, 10, 1, 13, 18], C.ink); p.poly([3, 17, 5, 3, 9, 3, 11, 17], '#f2c21c'); p.r(5, 3, 4, 1, '#fff6b0');
    p.circ(7, 7, 1.5, C.ink); p.r(6, 9, 3, 5, C.ink); p.r(4, 14, 7, 2, C.ink);
    p.r(3, 16, 9, 1, '#b8820c');
  });
  reg('fountain', 18, 32, 1, 1, function (p) {
    sb(p, 2, 14, 14, 18, '#c4d0e4', '#ffffff', '#6a7a94');
    p.r(4, 16, 10, 12, '#98a8c0'); p.r(4, 16, 10, 1, '#d8e0f0');
    p.r(1, 6, 16, 9, C.ink); p.r(2, 7, 14, 7, '#e8f0ff'); p.r(2, 7, 14, 1, '#ffffff'); p.r(4, 9, 10, 3, '#4a6a98');
    p.r(7, 3, 4, 4, '#98a8c0'); p.r(8, 2, 2, 2, C.ink);
    p.r(15, 9, 2, 3, '#ff3b4a');
    p.r(6, 22, 6, 6, '#6a7a94'); p.r(7, 23, 4, 4, '#4a5870');
  });
  reg('trashC', 14, 18, 1, 1, function (p) {
    p.r(1, 3, 12, 15, C.ink); p.r(2, 4, 10, 13, '#3a6a4a'); p.r(2, 4, 10, 1, '#5aa070'); p.r(2, 16, 10, 1, '#1f3f2a');
    p.r(0, 1, 14, 3, '#2a5238'); p.r(0, 1, 14, 1, '#5aa070'); p.r(5, 0, 4, 2, C.ink);
    for (var i = 0; i < 4; i++) p.r(3 + i * 2, 7, 1, 8, '#2a5238');
    p.r(4, 9, 6, 4, '#e8e0f0'); p.r(5, 10, 4, 1, '#3a6a4a');
  });
  reg('mopBucket', 16, 28, 1, 1, function (p) {
    p.r(3, 0, 2, 16, '#a06c3c'); p.r(3, 0, 1, 16, '#c8903c');
    p.r(0, 14, 10, 8, C.ink); p.r(1, 15, 8, 6, '#d8d0b0'); for (var i = 0; i < 6; i++) p.r(1 + i, 20, 1, 3, '#b8b090');
    p.poly([6, 18, 16, 18, 15, 28, 7, 28], C.ink); p.poly([7, 19, 15, 19, 14, 27, 8, 27], '#f2c21c');
    p.r(7, 19, 8, 1, '#fff6b0'); p.r(7, 22, 8, 3, '#4de0ff'); p.r(7, 22, 8, 1, '#a4f0ff');
    p.r(8, 26, 6, 1, '#b8820c');
  });
  dec('arrowFloor', 20, 12, function (p) {
    p.poly([0, 4, 10, 4, 10, 0, 20, 6, 10, 12, 10, 8, 0, 8], '#8a7020');
  }, { floor: true });
  dec('floorText', 64, 8, function (p, o) { p.txt(o.text || '', 0, 1, '#8a7020', 1); }, { floor: true });
  dec('doormat', 36, 12, function (p, o) {
    p.r(0, 0, 36, 12, C.ink); p.r(1, 1, 34, 10, '#3a2c20'); p.r(2, 2, 32, 8, '#5a4630'); p.dith(2, 2, 32, 8, '#241a12', 4);
    p.txt(o.text || '', 18 - ((String(o.text || '').length * 4 - 1) >> 1), 4, '#e8d8a0', 1);
  }, { floor: true });
  dec('stain', 24, 12, function (p) {
    p.ell(12, 6, 11, 5, p.pat('#0a0818', 9)); p.ell(11, 6, 7, 3, p.pat('#0a0818', 7));
  }, { floor: true });
})(window);
