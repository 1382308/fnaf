/* props-n4.js — Noche 4 (La Cocina): cocina industrial, horno de pizza, cámara fría, despensa, lavado,
   comedor del personal y vestidor de Chica. Mismo estilo que props-a/b/c/n2/n3: vista 3/4, contorno de tinta,
   luz arriba-izquierda y sombra abajo-derecha. */
(function (G) {
  'use strict';
  var C = PX.C, A = G.PROPS_API, reg = A.reg, dec = A.dec, sb = A.sb;
  var ST = ['#8a989c', '#c4d0d4', '#4a585c'];       // acero: base, luz, sombra
  var BK = ['#2a2e36', '#5e6272', '#0e1014'];       // hierro negro
  var WD = ['#8a5a30', '#c08a50', '#4a2c14'];       // madera
  var CR = ['#e8e0c8', '#fffaf0', '#a89c78'];       // loza y crema
  var YL = ['#e8b830', '#fff078', '#8a6410'];       // amarillo de Chica

  /* vapor que sube (x, y = base; n bocanadas) */
  function steam(p, x, y, t, k, n) {
    for (var i = 0; i < n; i++) {
      var f = (t * 0.45 + i / n + k) % 1;
      p.circ(x + Math.sin(t * 2 + i * 2.1 + k) * 2.4 + i - n / 2, y - f * 20, 1.6 + f * 3, 'rgba(232,238,244,' + (0.5 * (1 - f)).toFixed(2) + ')');
    }
  }
  /* llama de gas azul (x, y = base) */
  function gas(p, x, y, t, k) {
    var h = 3 + Math.sin(t * 13 + k) * 1.2;
    p.poly([x - 2, y, x + 2, y, x + Math.sin(t * 9 + k) * 0.8, y - h], '#4a8aff'); p.poly([x - 1, y, x + 1, y, x, y - h + 2], '#c4e0ff');
  }
  /* hacia dónde está el jugador (-1..1) */
  function gaze(inst, st, cx, cy) {
    var dx = (st ? st.px : 0) - (inst.x + cx), dy = (st ? st.py : 0) - 12 - (inst.y + cy), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 40);
    return { x: dx / d * k, y: dy / d * k };
  }
  /* patas y zócalo de un mueble de acero (base en y = h) */
  function legs(p, x, w, h) { p.r(x + 1, h - 4, 3, 4, C.ink); p.r(x + w - 4, h - 4, 3, 4, C.ink); p.r(x + 2, h - 4, 1, 3, ST[1]); p.r(x + w - 3, h - 4, 1, 3, ST[1]); }

  /* ====================== COCINA ====================== */
  /* cocina industrial de cuatro fuegos con repisa trasera; dos fuegos encendidos */
  reg('stoveBank', 66, 54, 4, 1, function (p) {
    var i;
    p.ell(33, 52, 31, 3, 'rgba(0,0,0,0.25)');
    sb(p, 0, 0, 66, 16, ST[0], ST[1], ST[2]);
    p.r(3, 4, 60, 8, ST[2]); p.r(3, 4, 60, 1, BK[0]);                                         // repisa con sal y especias
    for (i = 0; i < 8; i++) { p.r(6 + i * 7, 6, 4, 6, i % 3 ? '#c8a04c' : '#b3182b'); p.r(6 + i * 7, 6, 4, 1, '#ffe9a0'); }
    sb(p, 0, 16, 66, 14, BK[0], BK[1], BK[2]);
    for (i = 0; i < 4; i++) {                                                                 // parrillas
      p.ell(8 + i * 16, 23, 7, 3.4, C.ink); p.ell(8 + i * 16, 22, 6, 2.8, BK[1]); p.ell(8 + i * 16, 22, 3, 1.2, BK[2]);
      p.r(1 + i * 16, 22, 14, 1, BK[0]); p.r(8 + i * 16, 18, 1, 8, BK[0]);
    }
    p.ell(8, 20, 5, 2.6, ST[0]); p.ell(8, 18, 5, 2.4, ST[1]); p.r(3, 18, 10, 2, ST[0]); p.r(13, 17, 5, 2, BK[1]);   // olla con tapa
    sb(p, 0, 30, 66, 22, ST[0], ST[1], ST[2]);
    for (i = 0; i < 4; i++) { p.circ(8 + i * 16, 36, 3, C.ink); p.circ(8 + i * 16, 36, 2.2, BK[1]); p.r(8 + i * 16, 34, 1, 2, '#ff6a3a'); p.r(2 + i * 16, 42, 12, 8, ST[2]); p.r(2 + i * 16, 42, 12, 1, ST[1]); p.r(6 + i * 16, 45, 4, 1, BK[0]); }
    legs(p, 0, 66, 54);
  }, {
    light: { dx: 33, dy: 26, r: 38, col: '#7aa8ff', flick: 0.5 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i;
      for (i = 0; i < 6; i++) { gas(p, 20 + i * 2, 24, t, i); gas(p, 52 - i * 2, 24, t, i + 3); }
      steam(p, 8, 14, t, 0.2, 3);
    }
  });

  /* mesón con la olla enorme de la cocina (TAREA) */
  reg('steelPot', 36, 44, 2, 1, function (p) {
    p.ell(18, 42, 17, 2.6, 'rgba(0,0,0,0.25)');
    sb(p, 0, 24, 36, 18, ST[0], ST[1], ST[2]);
    p.r(3, 28, 14, 11, ST[2]); p.r(19, 28, 14, 11, ST[2]); p.r(3, 28, 14, 1, ST[1]); p.r(19, 28, 14, 1, ST[1]); p.r(14, 32, 2, 3, BK[0]); p.r(20, 32, 2, 3, BK[0]);
    p.r(5, 22, 26, 3, ST[2]);
    p.bell(18, 16, 13, 4, '#2a3236', C.ink, 1);                                              // olla grande
    p.r(5, 14, 26, 9, C.ink); p.r(6, 14, 24, 8, '#9aa6aa'); p.r(6, 14, 4, 8, ST[1]); p.r(27, 14, 3, 8, ST[2]); p.dith(10, 14, 16, 8, '#b8c4c8', 6);
    p.ell(18, 14, 12, 3.4, C.ink); p.ell(18, 14, 11, 2.8, '#b8481a'); p.ell(18, 14, 8, 1.8, '#d86a2a');
    p.r(1, 17, 4, 3, C.ink); p.r(2, 18, 2, 1, ST[1]); p.r(31, 17, 4, 3, C.ink); p.r(32, 18, 2, 1, ST[2]);
    p.r(7, 18, 6, 1, '#f2f6f8');
    p.r(2, 38, 3, 1, '#7a1c18'); p.r(30, 36, 3, 2, '#7a1c18');
  }, {
    light: { dx: 18, dy: 18, r: 30, col: '#ff8a3a', flick: 0.4 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, b;
      for (i = 0; i < 4; i++) { b = (t * 1.4 + i * 0.25) % 1; p.circ(11 + i * 5, 14 + Math.sin(i * 2) - b * 2, 0.8 + b * 1.4, b < 0.8 ? '#f08a3a' : '#ffe0b0'); }
      steam(p, 18, 12, t, 0.5, 4);
    }
  });

  /* plancha con una sartén chisporroteante (TAREA) */
  reg('grillTop', 52, 46, 3, 1, function (p) {
    p.ell(26, 44, 25, 2.8, 'rgba(0,0,0,0.25)');
    sb(p, 0, 26, 52, 18, ST[0], ST[1], ST[2]);
    p.r(3, 30, 46, 10, ST[2]); p.r(3, 30, 46, 1, ST[1]); p.r(8, 33, 4, 2, BK[0]); p.r(40, 33, 4, 2, BK[0]); p.r(20, 33, 12, 3, '#141c1c');
    sb(p, 0, 12, 52, 14, BK[0], BK[1], BK[2]);
    p.r(3, 14, 46, 8, '#1a1e24'); p.dith(3, 14, 46, 8, '#3a2a14', 4); p.r(4, 15, 44, 1, '#3a4250');
    p.r(7, 17, 10, 2, '#7a3a1c'); p.r(8, 17, 4, 1, '#a8602c');                                // salchichas
    p.bell(32, 18, 11, 4, '#1a1c20', C.ink, 1); p.ell(32, 18, 9, 2.8, '#3a2a18'); p.r(38, 15, 9, 3, C.ink); p.r(39, 16, 7, 1, WD[0]);  // sartén y mango
    p.circ(30, 18, 3.4, '#f6f0dc'); p.circ(30, 18, 1.6, '#f2c21c'); p.circ(35, 19, 2.6, '#f6f0dc'); p.circ(35, 19, 1.2, '#f2c21c');   // huevos
    p.r(0, 0, 14, 12, C.ink); p.r(1, 1, 12, 10, ST[0]); p.r(1, 1, 12, 1, ST[1]); p.r(3, 3, 8, 6, '#2a3236');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, f;
      for (i = 0; i < 5; i++) { f = (t * 1.3 + i * 0.21) % 1; p.p(26 + i * 4 + Math.sin(t * 3 + i) * 2, 16 - f * 7, f < 0.6 ? '#ffd890' : 'rgba(255,200,120,0.4)'); }
      steam(p, 32, 14, t, 0.1, 3);
    }
  });

  /* mesón de acero con ingredientes. v: a cuchillos, b verduras, c masa */
  reg('steelTable', 68, 36, 4, 2, function (p, o) {
    var v = o.v || 'a', i;
    sb(p, 0, 0, 68, 36, ST[0], ST[1], ST[2]);
    p.r(2, 2, 64, 15, '#a0aeb2'); p.r(2, 2, 64, 1, ST[1]); p.dith(2, 2, 64, 15, '#b8c4c8', 6); p.r(2, 17, 64, 1, ST[2]);
    p.r(2, 18, 64, 2, ST[2]); p.r(2, 22, 64, 1, ST[2]); p.r(4, 24, 60, 9, '#7a888c'); p.r(4, 24, 60, 1, ST[1]);        // repisa inferior
    for (i = 0; i < 5; i++) p.r(8 + i * 12, 26, 8, 6, i % 2 ? '#6a7a7e' : '#8a9a9e');
    legs(p, 0, 68, 36);
    if (v === 'a') {
      p.r(6, 5, 18, 10, C.ink); p.r(7, 6, 16, 8, WD[1]); p.r(7, 6, 16, 1, '#e8b878'); p.r(7, 13, 16, 1, WD[2]);
      p.line(10, 12, 20, 8, C.ink, 3); p.line(10, 12, 20, 8, ST[1], 1); p.r(8, 10, 5, 3, WD[2]);
      p.r(34, 5, 20, 3, '#1a1c20'); [37, 43, 49].forEach(function (x) { p.r(x, 6, 5, 6, ST[1]); p.r(x - 1, 11, 7, 3, BK[1]); });
      p.circ(60, 9, 3, '#b3182b'); p.p(59, 8, '#ff6070');
    } else if (v === 'b') {
      for (i = 0; i < 4; i++) { p.circ(10 + i * 6, 9, 3, C.ink); p.circ(10 + i * 6, 9, 2.4, '#c8281c'); p.p(9 + i * 6, 8, '#ff7060'); p.r(10 + i * 6, 6, 1, 1, '#2e8a3a'); }
      p.r(36, 4, 16, 10, C.ink); p.r(37, 5, 14, 8, '#2e8a3a'); p.dith(37, 5, 14, 8, '#6ac47a', 5); p.r(37, 5, 14, 1, '#8ae09a');
      p.ell(58, 9, 4, 3, C.ink); p.ell(58, 9, 3, 2.2, '#e8a030'); p.r(55, 8, 6, 1, '#c88020');
    } else {
      p.ell(18, 9, 11, 5, C.ink); p.ell(18, 9, 10, 4, '#efe2b8'); p.ell(16, 8, 6, 2.4, '#fff8dc'); p.r(10, 5, 1, 1, '#a89868');
      p.r(34, 8, 22, 4, C.ink); p.r(35, 9, 20, 2, WD[1]); p.r(32, 8, 3, 4, WD[2]); p.r(55, 8, 3, 4, WD[2]);
      p.dith(2, 2, 18, 6, '#ffffff', 2); p.p(44, 5, '#efe2b8'); p.p(48, 14, '#efe2b8'); p.p(60, 6, '#efe2b8');
    }
  });

  /* freidora doble con aceite que burbujea */
  reg('fryer', 32, 38, 2, 1, function (p) {
    p.ell(16, 36, 15, 2.6, 'rgba(0,0,0,0.25)');
    sb(p, 0, 12, 32, 24, ST[0], ST[1], ST[2]);
    p.r(2, 14, 28, 4, ST[2]); [4, 18].forEach(function (x) { p.r(x, 14, 10, 4, '#a86a14'); p.r(x, 14, 10, 1, '#e8a830'); });
    p.r(3, 21, 12, 12, ST[2]); p.r(17, 21, 12, 12, ST[2]); p.r(8, 25, 3, 5, BK[0]); p.r(22, 25, 3, 5, BK[0]);
    p.r(2, 1, 28, 10, C.ink); p.r(3, 2, 26, 8, '#3a4650'); p.r(3, 2, 26, 1, ST[1]); p.r(5, 4, 4, 4, '#ff6a3a'); p.r(11, 4, 3, 4, '#3fd479'); p.r(22, 4, 6, 4, '#0e1a0e'); p.txt('350', 22, 5, '#ff6a3a', 1);
    p.line(6, 12, 2, 8, C.ink, 2); p.line(26, 12, 30, 8, C.ink, 2);
    legs(p, 0, 32, 38);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, b;
      for (i = 0; i < 6; i++) { b = (t * 1.6 + i * 0.17) % 1; p.p(5 + (i % 3) * 3 + (i > 2 ? 14 : 0), 16 - b * 2, b < 0.7 ? '#ffd058' : '#fff0a0'); }
      steam(p, 9, 12, t, 0.3, 2); steam(p, 23, 12, t, 0.7, 2);
    }
  });

  /* marmita volcable con sopa humeante */
  reg('tiltKettle', 34, 50, 2, 1, function (p) {
    p.ell(17, 48, 16, 2.6, 'rgba(0,0,0,0.25)');
    sb(p, 2, 28, 30, 20, ST[0], ST[1], ST[2]); p.r(5, 32, 24, 12, ST[2]); p.r(5, 32, 24, 1, ST[1]); p.circ(17, 38, 4, BK[0]); p.circ(17, 38, 2.6, '#b3182b'); p.p(16, 37, '#ff7a82');
    p.ell(17, 22, 15, 6, C.ink); p.r(2, 14, 30, 14, C.ink); p.r(3, 14, 28, 13, '#a4b0b4'); p.r(3, 14, 5, 13, ST[1]); p.r(27, 14, 4, 13, ST[2]); p.dith(8, 14, 18, 13, '#c0ccd0', 6);
    p.ell(17, 14, 14, 5, C.ink); p.ell(17, 14, 13, 4.2, '#5a2a14'); p.ell(17, 14, 10, 2.8, '#8a3c1c'); p.ell(14, 13, 4, 1.2, '#b8602c');
    p.r(0, 12, 4, 6, C.ink); p.r(1, 13, 2, 3, ST[1]); p.r(30, 12, 4, 6, C.ink);
    p.r(30, 24, 4, 12, C.ink); p.r(31, 25, 2, 10, BK[1]); p.circ(32, 36, 2, C.ink); p.circ(32, 36, 1.2, ST[1]);
  }, {
    anim: function (ctx, x, y, t) { var p = new PX.Pen(ctx, 1, x, y); steam(p, 15, 10, t, 0, 4); steam(p, 22, 11, t, 0.6, 3); }
  });

  /* batidora de masa: el gancho gira en el tazón */
  reg('mixerK', 34, 50, 2, 1, function (p) {
    p.ell(17, 48, 16, 2.6, 'rgba(0,0,0,0.25)');
    p.r(3, 42, 28, 6, C.ink); p.r(4, 43, 26, 4, '#2a6a8a'); p.r(4, 43, 26, 1, '#5aa8c8');
    p.r(22, 6, 10, 38, C.ink); p.r(23, 7, 8, 36, '#3a8aaa'); p.r(23, 7, 3, 36, '#6ac0e0'); p.r(29, 7, 2, 36, '#1e5470');
    p.r(2, 4, 26, 12, C.ink); p.r(3, 5, 24, 10, '#3a8aaa'); p.r(3, 5, 24, 1, '#8ad0f0'); p.r(24, 8, 3, 3, '#ffe45c'); p.r(5, 12, 20, 2, '#1e5470');
    p.r(13, 16, 3, 6, C.ink); p.r(14, 16, 1, 6, ST[1]);
    p.ell(14, 36, 11, 4, C.ink); p.r(3, 24, 22, 12, C.ink); p.r(4, 24, 20, 11, '#b8c4c8'); p.r(4, 24, 4, 11, '#e0ecf0'); p.r(21, 24, 3, 11, ST[2]);
    p.ell(14, 24, 11, 3.6, C.ink); p.ell(14, 24, 10, 3, '#f0e6c0'); p.ell(13, 23, 5, 1.4, '#fffaf0');
    p.r(2, 38, 24, 2, ST[2]);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), a = Math.sin(t * 5) * 6;
      p.line(14, 20, 14 + a, 26, ST[0], 2); p.line(14 + a, 26, 14 - a * 0.6, 28, ST[1], 1);
      p.ell(14 + a * 0.8, 25, 3, 1.2, '#e8dcb0');
      if (Math.sin(t * 5) > 0.9) p.p(24, 22, '#ffffff');
    }
  });

  /* carrito con filas de pizzas enfriándose */
  reg('pizzaRack', 34, 50, 2, 1, function (p) {
    var i;
    p.ell(17, 48, 15, 2.6, 'rgba(0,0,0,0.25)');
    p.r(2, 2, 3, 46, C.ink); p.r(3, 2, 1, 46, ST[1]); p.r(29, 2, 3, 46, C.ink); p.r(30, 2, 1, 46, ST[2]);
    for (i = 0; i < 4; i++) {
      p.r(3, 8 + i * 10, 28, 3, C.ink); p.r(4, 9 + i * 10, 26, 1, ST[1]);
      p.ell(17, 6 + i * 10, 11, 3.4, C.ink); p.ell(17, 6 + i * 10, 10, 2.8, '#d8a050'); p.ell(17, 6 + i * 10, 8, 2, '#c83a24');
      p.p(12, 5 + i * 10, '#fff0a0'); p.p(19, 6 + i * 10, '#fff0a0'); p.p(15, 7 + i * 10, '#2e6a3a'); p.p(21, 5 + i * 10, '#2e6a3a');
    }
    p.circ(5, 48, 2, C.ink); p.circ(29, 48, 2, C.ink); p.p(5, 47, ST[1]);
  });

  /* caja de verduras. v: a tomates, b lechuga */
  reg('veggieCrate', 32, 26, 2, 1, function (p, o) {
    var i, b = o.v === 'b';
    p.ell(16, 24, 15, 2.4, 'rgba(0,0,0,0.25)');
    p.r(1, 12, 30, 12, C.ink); p.r(2, 13, 28, 10, WD[0]); p.r(2, 13, 28, 1, WD[1]); for (i = 0; i < 3; i++) p.r(2, 16 + i * 3, 28, 1, WD[2]);
    for (i = 0; i < 6; i++) {
      if (b) { p.circ(5 + i * 4.6, 11, 3.4, C.ink); p.circ(5 + i * 4.6, 11, 2.8, i % 2 ? '#4aa04a' : '#7ac46a'); p.p(4 + i * 4.6, 10, '#c8f0b0'); }
      else { p.circ(5 + i * 4.6, 11, 3.2, C.ink); p.circ(5 + i * 4.6, 11, 2.6, '#c8281c'); p.p(4 + i * 4.6, 10, '#ff7a6a'); }
    }
  });

  /* extractor de pared: las aspas giran */
  reg('extractor', 38, 30, 0, 0, function (p) {
    sb(p, 0, 0, 38, 30, ST[0], ST[1], ST[2]);
    p.circ(19, 15, 12, C.ink); p.circ(19, 15, 11, '#141a1e'); p.circ(19, 15, 10, '#1e262a');
    p.p(3, 3, ST[1]); p.p(34, 3, ST[1]); p.p(3, 26, ST[1]); p.p(34, 26, ST[1]);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), k, a;
      for (k = 0; k < 4; k++) { a = t * 9 + k * 1.571; p.poly([19, 15, 19 + Math.cos(a) * 10, 15 + Math.sin(a) * 10, 19 + Math.cos(a + 0.5) * 9, 15 + Math.sin(a + 0.5) * 9], k % 2 ? '#5a6a70' : '#7e8e94'); }
      p.circ(19, 15, 2, ST[0]); p.p(18, 14, ST[1]);
    }
  });

  /* lámpara con jaula (de pared). parpadea */
  reg('cageLamp', 16, 24, 0, 0, function (p) {
    p.r(5, 0, 6, 4, C.ink); p.r(6, 1, 4, 2, ST[0]);
    p.circ(8, 13, 7, C.ink); p.circ(8, 13, 6, '#4a2e10'); p.circ(8, 13, 3.4, '#ffe9a0'); p.p(7, 12, '#ffffff');
    p.line(8, 6, 8, 20, ST[0], 1); p.line(3, 8, 3, 18, ST[0], 1); p.line(13, 8, 13, 18, ST[0], 1); p.r(4, 19, 8, 2, C.ink); p.r(5, 19, 6, 1, ST[1]);
  }, {
    light: { dx: 8, dy: 14, r: 52, col: '#ffcf80', flick: 0.9 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      if (Math.sin(t * 17 + x) + Math.sin(t * 7.3) > 1.3) { p.circ(8, 13, 6, '#2a1a08'); p.circ(8, 13, 2, '#8a5a20'); }
    }
  });

  /* contenedor con ruedas y moscas */
  reg('wheelieBin', 34, 40, 2, 1, function (p) {
    p.ell(17, 38, 16, 2.6, 'rgba(0,0,0,0.25)');
    p.poly([3, 10, 31, 10, 29, 36, 5, 36], C.ink); p.poly([4, 11, 30, 11, 28, 35, 6, 35], '#2e5a3a'); p.r(4, 11, 4, 24, '#4a8a5a'); p.r(25, 11, 4, 24, '#1a3a24');
    p.r(2, 5, 30, 7, C.ink); p.r(3, 6, 28, 5, '#3a6a48'); p.r(3, 6, 28, 1, '#6aaa7a'); p.r(8, 3, 18, 3, C.ink); p.r(9, 4, 16, 1, '#4a8a5a');
    p.r(11, 18, 12, 8, '#e8e0d0'); p.txt('BASURA', 5, 28, '#c8e0c0', 1);
    p.circ(7, 37, 2, C.ink); p.circ(27, 37, 2, C.ink); p.p(7, 36, ST[1]);
    p.r(24, 12, 1, 6, '#6a5a30'); p.p(25, 18, '#6a5a30');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i;
      for (i = 0; i < 3; i++) p.p(17 + Math.cos(t * 4 + i * 2.1) * (6 + i * 3), 0 + Math.sin(t * 5.3 + i * 1.7) * 4, C.ink);
    }
  });

  /* ====================== HORNO DE PIZZA ====================== */
  /* horno de ladrillo con cúpula y boca encendida (TAREA) */
  reg('pizzaOven', 70, 72, 4, 1, function (p) {
    var i;
    p.ell(35, 70, 33, 3, 'rgba(0,0,0,0.3)');
    p.r(5, 40, 60, 30, C.ink); p.r(6, 41, 58, 28, '#8a3a24'); p.r(6, 41, 58, 1, '#c8644a');                // base
    for (i = 0; i < 6; i++) { p.r(6, 46 + i * 4, 58, 1, '#d8b8a0'); p.r(10 + ((i & 1) ? 7 : 0) + (i * 9) % 20, 42 + i * 4, 1, 4, '#d8b8a0'); }
    p.dith(6, 41, 58, 28, '#2a1008', 3); p.r(6, 66, 58, 4, '#3a1208');
    p.ell(35, 34, 31, 24, C.ink); p.ell(35, 34, 30, 23, '#9a4a30'); p.ell(30, 28, 22, 16, '#b0583c');         // cúpula
    for (i = 0; i < 5; i++) { p.line(8, 18 + i * 5, 62, 18 + i * 5, '#d8b8a0', 1); }
    p.dith(10, 12, 50, 30, '#3a1608', 4);
    p.r(46, 0, 12, 20, C.ink); p.r(47, 1, 10, 19, '#7a3a24'); p.r(47, 1, 3, 19, '#a85a3c'); p.r(44, 0, 16, 3, C.ink); p.r(45, 1, 14, 1, '#c8644a');   // chimenea
    p.poly([14, 56, 56, 56, 56, 38, 35, 28, 14, 38], C.ink);                                                 // boca (arco)
    p.poly([16, 55, 54, 55, 54, 39, 35, 30, 16, 39], '#1a0a04'); p.ell(35, 50, 17, 4, '#2a1008');
    p.r(24, 58, 22, 4, C.ink); p.r(25, 59, 20, 2, '#c8a050');                                               // puerta de chapa
    p.r(28, 60, 14, 1, '#7a5a20'); p.txt('PIZZA', 25, 66, '#f6e8b0', 1);
  }, {
    light: { dx: 35, dy: 46, r: 74, col: '#ff8030', flick: 0.7 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, h;
      for (i = 0; i < 6; i++) {
        h = 8 + Math.sin(t * 9 + i * 1.9) * 3;
        p.poly([20 + i * 5.4, 54, 26 + i * 5.4, 54, 23 + i * 5.4 + Math.sin(t * 6 + i) * 1.4, 54 - h], i % 2 ? '#ff7a1c' : '#ff9a2e');
        p.poly([22 + i * 5.4, 54, 25 + i * 5.4, 54, 23.5 + i * 5.4, 54 - h + 4], '#ffe45c');
      }
      p.r(20, 52, 30, 2, '#ffb040');
      for (i = 0; i < 3; i++) { var f = (t * 0.6 + i * 0.33) % 1; p.p(52 + Math.sin(t + i * 3) * 2, 0 - f * 12, 'rgba(60,50,50,' + (0.6 * (1 - f)).toFixed(2) + ')'); }
      p.p(27 + ((t * 9) % 16 | 0), 47 - ((t * 7) % 6 | 0), '#fff0a0');
    }
  });

  /* estante de tablas y palas de pizza con masa lista */
  reg('doughShelf', 34, 52, 2, 1, function (p) {
    var i, y;
    p.ell(17, 50, 16, 2.6, 'rgba(0,0,0,0.25)');
    p.r(2, 2, 3, 46, C.ink); p.r(3, 2, 1, 46, WD[1]); p.r(29, 2, 3, 46, C.ink); p.r(30, 2, 1, 46, WD[2]);
    for (i = 0; i < 4; i++) {
      y = 10 + i * 11;
      p.r(2, y, 30, 3, C.ink); p.r(3, y, 28, 1, WD[1]); p.r(3, y + 1, 28, 1, WD[0]);
      if (i === 0) { p.ell(10, y - 3, 6, 3, C.ink); p.ell(10, y - 3, 5, 2.4, '#efe2b8'); p.ell(24, y - 3, 5, 2.6, C.ink); p.ell(24, y - 3, 4, 2, '#e4d6aa'); }
      if (i === 1) { for (var k = 0; k < 3; k++) { p.ell(9 + k * 8, y - 3, 4, 2.4, C.ink); p.ell(9 + k * 8, y - 3, 3, 1.8, '#f0e4bc'); } }
      if (i === 2) { p.r(5, y - 7, 22, 7, C.ink); p.r(6, y - 6, 20, 5, '#f2ecd0'); p.r(6, y - 6, 20, 1, '#fff'); p.r(8, y - 4, 8, 1, '#b3182b'); }
      if (i === 3) { p.r(4, y - 6, 24, 6, C.ink); p.r(5, y - 5, 22, 4, '#c83a24'); p.dith(5, y - 5, 22, 4, '#f06a4a', 5); }
    }
  });

  /* tarros de harina y sacos (uno roto y derramado) */
  reg('flourSacks', 34, 32, 2, 1, function (p) {
    p.ell(17, 30, 16, 2.6, 'rgba(0,0,0,0.25)');
    p.poly([2, 14, 17, 12, 17, 29, 2, 29], C.ink); p.poly([3, 15, 16, 13, 16, 28, 3, 28], '#d8ccaa'); p.r(3, 15, 3, 13, '#efe6cc'); p.r(6, 20, 8, 4, '#b3182b'); p.txt('HARINA', 3, 17, '#6a5a30', 1);
    p.poly([17, 16, 32, 14, 32, 29, 17, 29], C.ink); p.poly([18, 17, 31, 15, 31, 28, 18, 28], '#cbbf9a'); p.r(18, 17, 2, 11, '#e0d6b8');
    p.poly([6, 2, 22, 4, 21, 14, 7, 14], C.ink); p.poly([7, 3, 21, 5, 20, 13, 8, 13], '#d8ccaa'); p.r(7, 3, 3, 10, '#efe6cc'); p.poly([12, 4, 18, 5, 15, 12], '#fffaf0');
    p.ell(26, 29, 6, 2, '#f2ecd0'); p.dith(21, 27, 10, 4, '#ffffff', 5);
  });

  /* ====================== CÁMARA FRÍA ====================== */
  /* puerta de la cámara fría con termómetro y luz de aviso (TAREA final) */
  reg('walkIn', 52, 70, 3, 1, function (p) {
    p.ell(26, 68, 25, 3, 'rgba(0,0,0,0.3)');
    sb(p, 0, 0, 52, 68, '#dcecf4', '#ffffff', '#7e9cb2');
    p.r(4, 6, 44, 58, C.ink); p.r(5, 7, 42, 56, '#cfe2ee'); p.r(5, 7, 42, 1, '#f8fdff'); p.r(5, 7, 1, 56, '#e8f4fc'); p.r(45, 7, 2, 56, '#8aa8be');
    p.dith(5, 7, 42, 56, '#ffffff', 2);
    p.r(9, 12, 34, 22, '#aac4d6'); p.r(9, 12, 34, 1, '#6a8aa2'); p.r(9, 33, 34, 1, '#f8fdff');             // ventanilla escarchada
    p.dith(9, 12, 34, 22, '#f4fbff', 3); p.r(11, 14, 30, 18, '#0e1a26'); p.dith(11, 14, 30, 18, '#6aa0c8', 6);
    p.r(40, 42, 5, 14, C.ink); p.r(41, 43, 3, 12, ST[1]); p.r(41, 43, 1, 12, '#ffffff'); p.circ(42, 56, 2, C.ink);   // manija
    p.r(8, 40, 18, 12, C.ink); p.r(9, 41, 16, 10, '#0a1018'); p.txt('-18', 11, 44, '#4de0ff', 1); p.p(23, 43, '#4de0ff');
    p.r(2, 66, 48, 2, '#7e9cb2');
    p.poly([6, 7, 12, 7, 9, 12 + 3], '#ffffff'); p.poly([30, 7, 36, 7, 33, 11], '#ffffff');                    // escarcha
    p.dith(5, 54, 42, 9, '#f4fbff', 3);
  }, {
    light: { dx: 26, dy: 40, r: 56, col: '#7ad0ff', flick: 0.8 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, f;
      p.r(16, 41, 3, 3, Math.sin(t * 6) > 0 ? '#ff3b4a' : '#4a0a10');
      for (i = 0; i < 4; i++) { f = (t * 0.35 + i * 0.25) % 1; p.circ(10 + i * 11 + Math.sin(t + i) * 3, 66 - f * 6, 3 + f * 4, 'rgba(210,235,250,' + (0.34 * (1 - f)).toFixed(2) + ')'); }
      if (Math.sin(t * 13) > 0.85) p.r(11, 14, 30, 18, 'rgba(180,230,255,0.25)');
    }
  });

  /* estantería de congelados con cajas de pizza heladas */
  reg('frostShelf', 34, 54, 2, 1, function (p) {
    var i, y;
    p.ell(17, 52, 16, 2.6, 'rgba(0,0,0,0.25)');
    p.r(2, 2, 3, 48, C.ink); p.r(3, 2, 1, 48, '#c4dcec'); p.r(29, 2, 3, 48, C.ink); p.r(30, 2, 1, 48, '#7e9cb2');
    for (i = 0; i < 4; i++) {
      y = 13 + i * 11;
      p.r(2, y, 30, 2, C.ink); p.r(3, y, 28, 1, '#e8f4fc');
      p.r(5, y - 8, 12, 8, C.ink); p.r(6, y - 7, 10, 6, i % 2 ? '#d8a050' : '#cdd8e0'); p.r(6, y - 7, 10, 1, '#ffffff'); p.r(8, y - 5, 5, 1, '#b3182b');
      p.r(18, y - 6, 11, 6, C.ink); p.r(19, y - 5, 9, 4, i % 2 ? '#cdd8e0' : '#d8a050'); p.r(19, y - 5, 9, 1, '#ffffff');
      p.dith(4, y - 8, 26, 8, '#f8fdff', 3); p.poly([6 + i * 3, y + 2, 9 + i * 3, y + 2, 7 + i * 3, y + 5], '#f8fdff');
    }
  });

  /* máquina de hielo: caen cubos y la pantalla parpadea */
  reg('iceMachine', 32, 44, 2, 1, function (p) {
    p.ell(16, 42, 15, 2.6, 'rgba(0,0,0,0.25)');
    sb(p, 0, 4, 32, 38, '#c8d8e4', '#ffffff', '#6a8aa2');
    p.r(3, 7, 26, 10, '#2a4a62'); p.r(3, 7, 26, 1, '#6aa0c8'); p.r(5, 9, 22, 6, '#0a1620');
    p.r(4, 19, 24, 17, '#90aebf'); p.r(4, 19, 24, 1, '#e8f4fc'); p.r(14, 25, 4, 6, C.ink); p.r(15, 26, 2, 4, '#dff1fb');
    p.poly([2, 38, 30, 38, 28, 42, 4, 42], C.ink); p.dith(3, 36, 26, 4, '#f8fdff', 3);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), f = (t * 1.1) % 1;
      p.txt(Math.sin(t * 3) > -0.6 ? '-4C' : '', 9, 10, '#4de0ff', 1);
      p.r(15, 14 + f * 18, 2, 2, '#f4fbff'); p.p(15, 14 + f * 18, '#ffffff');
    }
  });

  /* ====================== DESPENSA ====================== */
  /* estantería de latas y frascos. v: a latas, b frascos */
  reg('canShelf', 34, 54, 2, 1, function (p, o) {
    var i, k, y, jar = o.v === 'b';
    p.ell(17, 52, 16, 2.6, 'rgba(0,0,0,0.25)');
    p.r(2, 2, 3, 48, C.ink); p.r(3, 2, 1, 48, WD[1]); p.r(29, 2, 3, 48, C.ink); p.r(30, 2, 1, 48, WD[2]);
    for (i = 0; i < 4; i++) {
      y = 13 + i * 11;
      p.r(2, y, 30, 2, C.ink); p.r(3, y, 28, 1, WD[1]);
      for (k = 0; k < 5; k++) {
        if (jar) { p.r(5 + k * 5, y - 8, 4, 8, C.ink); p.r(6 + k * 5, y - 7, 2, 6, ['#c83a24', '#e8a030', '#6ac47a', '#a05cff'][(k + i) % 4]); p.r(5 + k * 5, y - 9, 4, 2, ST[0]); }
        else { p.r(5 + k * 5, y - 7, 4, 7, C.ink); p.r(6 + k * 5, y - 6, 2, 5, ['#c83a24', '#e8c040', '#9a6a3c', '#d8d0c0'][(k * 2 + i) % 4]); p.r(6 + k * 5, y - 6, 2, 1, '#ffffff'); }
      }
    }
  });

  /* gotera sobre un balde: una gota cae y suena */
  reg('leakBucket', 20, 42, 1, 1, function (p) {
    p.ell(10, 40, 9, 2, 'rgba(0,0,0,0.25)');
    p.r(5, 0, 11, 3, C.ink); p.r(6, 0, 9, 1, ST[1]); p.r(6, 1, 9, 1, ST[0]); p.p(7, 1, C.ink); p.p(13, 1, C.ink);
    p.r(8, 3, 5, 17, C.ink); p.r(9, 3, 3, 17, ST[0]); p.r(9, 3, 1, 17, ST[1]); p.r(6, 16, 9, 4, C.ink); p.r(7, 17, 7, 2, ST[2]); p.r(8, 20, 4, 2, '#3a6a8a');
    p.poly([3, 28, 17, 28, 15, 40, 5, 40], C.ink); p.poly([4, 29, 16, 29, 14, 39, 6, 39], '#7a8a94'); p.r(4, 29, 2, 10, '#a8b8c0');
    p.ell(10, 29, 7, 2.6, C.ink); p.ell(10, 29, 6, 2, '#3a6a8a'); p.ell(9, 29, 3, 0.8, '#8ad0f0');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), f = (t * 0.9) % 1;
      if (f < 0.7) { p.r(10, 22 + f * 10, 1, 2, '#8ad0f0'); }
      else { p.ell(10, 29, 1.5 + (f - 0.7) * 14, 0.5 + (f - 0.7) * 4, 'rgba(138,208,240,' + (0.7 - (f - 0.7)).toFixed(2) + ')'); }
    }
  });

  /* ====================== LAVADO ====================== */
  /* lavavajillas industrial: escapa vapor por la puerta */
  reg('dishMachine', 52, 52, 3, 1, function (p) {
    var i;
    p.ell(26, 50, 25, 2.8, 'rgba(0,0,0,0.25)');
    sb(p, 0, 8, 52, 40, ST[0], ST[1], ST[2]);
    sb(p, 2, 0, 48, 14, ST[2], ST[0], BK[0]);
    p.r(6, 4, 8, 6, '#0a1620'); p.r(8, 6, 4, 2, '#4de0ff'); p.r(18, 4, 4, 6, '#3fd479'); p.r(26, 4, 4, 6, '#ff6a3a'); p.r(34, 4, 12, 6, '#0a1620'); p.txt('82C', 35, 5, '#ff6a3a', 1);
    p.r(5, 16, 42, 26, C.ink); p.r(6, 17, 40, 24, '#a4b2b6'); p.r(6, 17, 40, 1, ST[1]); p.dith(6, 17, 40, 24, '#c0ccd0', 5);
    p.r(6, 22, 40, 14, '#8896a0'); p.r(6, 22, 40, 1, ST[1]); p.r(12, 27, 28, 3, C.ink); p.r(13, 28, 26, 1, ST[1]);   // manija
    for (i = 0; i < 4; i++) p.p(9 + i * 11, 38, ST[2]);
    legs(p, 0, 52, 52);
  }, {
    anim: function (ctx, x, y, t) { var p = new PX.Pen(ctx, 1, x, y); steam(p, 12, 18, t, 0.2, 4); steam(p, 38, 18, t, 0.6, 4); }
  });

  /* pileta doble con grifo que gotea */
  reg('potSink', 54, 46, 3, 1, function (p) {
    p.ell(27, 44, 26, 2.8, 'rgba(0,0,0,0.25)');
    sb(p, 0, 20, 54, 24, ST[0], ST[1], ST[2]);
    p.r(3, 24, 22, 16, ST[2]); p.r(29, 24, 22, 16, ST[2]); p.r(3, 24, 22, 1, ST[1]); p.r(29, 24, 22, 1, ST[1]); p.r(12, 30, 4, 3, BK[0]); p.r(38, 30, 4, 3, BK[0]);
    p.r(0, 14, 54, 8, C.ink); p.r(1, 15, 52, 6, '#a4b2b6'); p.r(1, 15, 52, 1, ST[1]);
    p.ell(14, 16, 11, 3, C.ink); p.ell(14, 16, 10, 2.4, '#3a6a8a'); p.ell(13, 16, 6, 1, '#8ad0f0');            // pocetas
    p.ell(40, 16, 11, 3, C.ink); p.ell(40, 16, 10, 2.4, '#2a4a62'); p.ell(40, 16, 5, 1, '#6aa0c8');
    p.r(24, 2, 6, 14, C.ink); p.r(25, 3, 4, 12, ST[1]); p.r(25, 3, 1, 12, '#ffffff'); p.r(22, 0, 12, 4, C.ink); p.r(23, 1, 10, 2, ST[0]);       // grifo
    p.r(19, 8, 4, 5, C.ink); p.r(20, 9, 2, 3, '#b3182b'); p.r(31, 8, 4, 5, C.ink); p.r(32, 9, 2, 3, '#2a6ac8');
    p.r(24, 15, 6, 2, C.ink);
    p.ell(8, 12, 5, 2, '#e8e0d0'); p.ell(7, 10, 4, 2, '#d8d0c0');                                              // platos sucios
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), f = (t * 1.3) % 1;
      if (f < 0.6) p.r(27, 4 + f * 10, 1, 2, '#8ad0f0'); else p.ell(27, 16, 1 + (f - 0.6) * 8, 0.4 + (f - 0.6) * 2, 'rgba(180,230,255,' + (0.8 - (f - 0.6) * 2).toFixed(2) + ')');
    }
  });

  /* carro de platos apilados (algunos astillados) */
  reg('platesCart', 34, 40, 2, 1, function (p) {
    var i;
    p.ell(17, 38, 15, 2.6, 'rgba(0,0,0,0.25)');
    p.r(3, 20, 28, 3, C.ink); p.r(4, 21, 26, 1, ST[1]); p.r(3, 31, 28, 3, C.ink); p.r(4, 32, 26, 1, ST[1]);
    p.r(3, 20, 3, 18, C.ink); p.r(4, 21, 1, 16, ST[1]); p.r(28, 20, 3, 18, C.ink); p.r(29, 21, 1, 16, ST[2]);
    for (i = 0; i < 6; i++) { p.ell(10, 18 - i * 1.6, 7, 2.2, C.ink); p.ell(10, 18 - i * 1.6, 6, 1.6, i % 2 ? CR[0] : CR[1]); }
    for (i = 0; i < 4; i++) { p.ell(23, 18 - i * 1.6, 6, 2, C.ink); p.ell(23, 18 - i * 1.6, 5, 1.4, i % 2 ? CR[1] : CR[0]); }
    for (i = 0; i < 5; i++) { p.ell(17, 29 - i * 1.5, 8, 2.2, C.ink); p.ell(17, 29 - i * 1.5, 7, 1.6, i % 2 ? CR[0] : CR[2]); }
    p.circ(5, 37, 2, C.ink); p.circ(29, 37, 2, C.ink); p.p(5, 36, ST[1]);
  });

  /* ====================== COMEDOR DEL PERSONAL ====================== */
  /* mesa larga del personal con bandejas. v: a pizza, b café */
  reg('staffTable', 64, 34, 4, 2, function (p, o) {
    var i;
    sb(p, 0, 0, 64, 34, '#8a6a3a', '#c8a060', '#4a3418');
    p.r(2, 2, 60, 14, '#a07c44'); p.r(2, 2, 60, 1, '#d8b878'); for (i = 0; i < 5; i++) p.r(5 + i * 12, 4 + (i * 3) % 6, 8, 1, '#8a6a3a'); p.r(2, 16, 60, 1, '#4a3418');
    p.r(2, 17, 60, 14, '#6a4e28'); p.r(4, 19, 56, 1, '#8a6a3a'); legs(p, 0, 64, 34);
    p.r(6, 5, 14, 9, C.ink); p.r(7, 6, 12, 7, '#d8d0c0'); p.r(7, 6, 12, 1, '#fff');
    p.r(40, 5, 14, 9, C.ink); p.r(41, 6, 12, 7, '#d8d0c0'); p.r(41, 6, 12, 1, '#fff');
    if (o.v === 'b') {
      p.r(9, 8, 8, 4, '#4a2e16'); p.circ(25, 9, 3, C.ink); p.circ(25, 9, 2.4, '#fff'); p.circ(25, 9, 1.6, '#4a2410'); p.r(27, 8, 3, 2, C.ink);
      p.r(44, 8, 6, 4, '#e8c040'); p.r(32, 6, 3, 8, C.ink); p.r(33, 7, 1, 6, '#fff');
    } else {
      p.poly([9, 12, 17, 12, 13, 7], '#d8a050'); p.poly([10, 11, 16, 11, 13, 8], '#c83a24'); p.p(12, 10, '#fff0a0');
      p.poly([43, 12, 51, 12, 47, 7], '#d8a050'); p.poly([44, 11, 50, 11, 47, 8], '#c83a24'); p.p(46, 10, '#2e6a3a');
      p.circ(28, 9, 3, C.ink); p.circ(28, 9, 2.4, '#fff'); p.circ(28, 9, 1.6, '#4a2410'); p.r(30, 8, 3, 2, C.ink);
    }
  });

  /* taburete redondo */
  reg('stool', 16, 22, 1, 1, function (p) {
    p.ell(8, 20, 7, 2.4, 'rgba(0,0,0,0.25)');
    p.r(7, 10, 2, 10, C.ink); p.r(7, 10, 1, 10, ST[1]); p.line(8, 16, 3, 20, C.ink, 2); p.line(8, 16, 13, 20, C.ink, 2);
    p.ell(8, 9, 7, 3.4, C.ink); p.ell(8, 8, 6, 2.8, '#b3182b'); p.ell(7, 7, 3, 1.2, '#ff6070');
  });

  /* máquina de refrescos: se apaga y se enciende */
  reg('sodaK', 34, 52, 2, 1, function (p) {
    var i;
    p.ell(17, 50, 15, 2.6, 'rgba(0,0,0,0.25)');
    sb(p, 0, 0, 34, 50, '#b3182b', '#ff6070', '#5a0c18');
    p.r(3, 3, 28, 6, '#f2ecd0'); p.txt('FAZ-COLA', 4, 5, '#b3182b', 1);
    p.r(3, 11, 28, 22, '#0a0e14'); p.r(4, 12, 26, 20, '#1a2a3a');
    for (i = 0; i < 3; i++) for (var k = 0; k < 4; k++) { p.r(6 + k * 6, 14 + i * 6, 4, 5, C.ink); p.r(7 + k * 6, 15 + i * 6, 2, 3, ['#e8c040', '#3fd479', '#4de0ff', '#ff5fd2'][(i + k) % 4]); }
    p.r(24, 36, 6, 8, C.ink); p.r(25, 37, 4, 6, BK[1]); p.r(5, 36, 16, 8, C.ink); p.r(6, 37, 14, 6, '#05080c');
    p.r(2, 46, 30, 3, '#5a0c18');
  }, {
    light: { dx: 17, dy: 22, r: 36, col: '#ff7a8a', flick: 0.95 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      if (Math.sin(t * 15 + 2) + Math.sin(t * 6.1) < -0.9) p.r(4, 12, 26, 20, 'rgba(5,3,10,0.7)');
    }
  });

  /* ====================== VESTIDOR DE CHICA ====================== */
  /* tocador con espejo y bombillas; algo se asoma en el reflejo */
  reg('vanityC', 56, 58, 3, 1, function (p) {
    var i;
    p.ell(28, 56, 26, 2.8, 'rgba(0,0,0,0.25)');
    sb(p, 0, 30, 56, 26, '#d8a850', '#fff0b0', '#7a5a1c');
    p.r(3, 33, 24, 18, '#b8883c'); p.r(29, 33, 24, 18, '#b8883c'); p.r(3, 33, 24, 1, '#e8c070'); p.r(29, 33, 24, 1, '#e8c070'); p.r(12, 40, 6, 2, '#fff0b0'); p.r(38, 40, 6, 2, '#fff0b0');
    p.r(4, 22, 12, 9, C.ink); p.r(5, 23, 10, 7, '#e8e0f0'); p.r(7, 25, 6, 2, '#ff5fd2'); p.circ(24, 26, 3, C.ink); p.circ(24, 26, 2.4, YL[0]); p.r(40, 24, 10, 6, C.ink); p.r(41, 25, 8, 4, '#b3182b');
    p.r(2, 0, 52, 28, C.ink); p.r(3, 1, 50, 26, '#6a5018'); p.r(6, 5, 44, 19, C.ink); p.r(7, 6, 42, 17, '#7a98a8'); p.r(7, 6, 42, 1, '#c4dcec'); p.dith(7, 6, 42, 17, '#9ab8c8', 4);
    p.line(10, 20, 20, 8, '#c4dcec', 1); p.line(14, 20, 22, 10, '#c4dcec', 1);
    for (i = 0; i < 8; i++) { p.circ(6 + i * 6, 3, 2, C.ink); p.circ(6 + i * 6, 3, 1.4, '#ffe9a0'); }
  }, {
    light: { dx: 28, dy: 8, r: 46, col: '#ffe0a0', flick: 0.6 },
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), i, g = gaze(inst, st, 28, 14), on = Math.sin(t * 9) > -0.8;
      for (i = 0; i < 8; i++) if (!on && i % 3 === 0) p.circ(6 + i * 6, 3, 1.4, '#6a5018');
      if (Math.sin(t * 0.8) > 0.93) {                                                                     // ojos en el reflejo
        p.circ(34, 14, 1.7, '#ffffff'); p.circ(40, 14, 1.7, '#ffffff'); p.p(34 + g.x, 14 + g.y, C.ink); p.p(40 + g.x, 14 + g.y, C.ink);
      }
    }
  });

  /* perchero con trajes de pollo y picos de repuesto. v: a trajes, b picos */
  reg('rackC', 42, 56, 2, 1, function (p, o) {
    var i;
    p.ell(21, 54, 19, 2.6, 'rgba(0,0,0,0.25)');
    p.r(3, 2, 36, 3, C.ink); p.r(4, 3, 34, 1, ST[1]); p.r(3, 2, 3, 52, C.ink); p.r(4, 3, 1, 50, ST[1]); p.r(36, 2, 3, 52, C.ink); p.r(37, 3, 1, 50, ST[2]);
    p.r(2, 50, 38, 3, C.ink); p.r(3, 51, 36, 1, ST[0]); p.circ(5, 54, 2, C.ink); p.circ(37, 54, 2, C.ink);
    for (i = 0; i < 4; i++) {
      p.line(8 + i * 7, 4, 8 + i * 7, 8, ST[0], 1);
      if (o.v === 'b') { p.poly([6 + i * 7, 12, 12 + i * 7, 12, 9 + i * 7, 22], C.ink); p.poly([7 + i * 7, 12, 11 + i * 7, 12, 9 + i * 7, 20], i % 2 ? '#f08a30' : '#ff9a2e'); p.r(7 + i * 7, 12, 1, 3, '#ffd890'); }
      else { p.poly([5 + i * 7, 8, 13 + i * 7, 8, 14 + i * 7, 44, 4 + i * 7, 44], C.ink); p.poly([6 + i * 7, 9, 12 + i * 7, 9, 13 + i * 7, 43, 5 + i * 7, 43], i % 2 ? YL[0] : '#d8a020'); p.r(6 + i * 7, 9, 2, 34, YL[1]); p.r(12 + i * 7, 9, 1, 34, YL[2]); }
    }
    if (o.v === 'b') p.r(6, 36, 30, 10, '#4a3a18');
  });

  /* percha con el babero de Chica «LET'S EAT!» (TAREA): el babero se mece */
  reg('bibStand', 28, 48, 1, 1, function (p) {
    p.ell(14, 46, 10, 2.4, 'rgba(0,0,0,0.25)');
    p.r(13, 6, 3, 38, C.ink); p.r(14, 6, 1, 38, ST[1]); p.ell(14, 45, 8, 2.2, C.ink); p.ell(14, 44, 7, 1.6, ST[0]);
    p.r(5, 4, 18, 3, C.ink); p.r(6, 5, 16, 1, ST[1]); p.circ(5, 5, 2, C.ink); p.circ(23, 5, 2, C.ink); p.p(5, 4, ST[1]);
    p.line(14, 6, 14, 2, ST[0], 1); p.circ(14, 2, 1.6, C.ink); p.p(14, 1, ST[1]);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), s = Math.sin(t * 1.7) * 1.4, sw = s * 0.5;
      p.line(8, 6, 9 + s * 0.3, 11, '#f2ecd0', 1); p.line(20, 6, 19 + s * 0.3, 11, '#f2ecd0', 1);
      p.poly([4 + sw, 11, 24 + sw, 11, 25 + s, 34, 14 + s, 38, 3 + s, 34], C.ink);
      p.poly([5 + sw, 12, 23 + sw, 12, 24 + s, 33, 14 + s, 36, 4 + s, 33], '#f6f0e0'); p.poly([5 + sw, 12, 9 + sw, 12, 8 + s, 33, 4 + s, 33], '#ffffff');
      p.r(6 + sw, 15, 16, 1, '#e8c040'); p.txt('LETS', 6 + s * 0.8, 19, '#b3182b', 1); p.txt('EAT', 8 + s * 0.8, 26, '#b3182b', 1);
      p.circ(14 + s * 0.8, 31, 1.4, YL[0]);
      p.dith(5 + s, 28, 18, 5, '#c8a050', 6);                                                               // manchas de salsa
    }
  });

  /* ====================== GENERAL ====================== */
  /* rejilla de vapor en el piso: sale vapor por ráfagas */
  reg('steamVent', 22, 14, 0, 0, function (p) {
    p.r(0, 4, 22, 9, C.ink); p.r(1, 5, 20, 7, BK[1]); for (var i = 0; i < 6; i++) p.r(2 + i * 3, 6, 2, 5, '#0a0a10');
    p.r(1, 5, 20, 1, '#8a8aa0');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), on = Math.sin(t * 0.9) > -0.3;
      if (on) steam(p, 11, 8, t, 0.4, 5);
    }
  });

  /* ====================== DECORACIÓN DE PISO ====================== */
  /* mancha de grasa vieja */
  dec('greaseStain', 30, 16, function (p) {
    p.ell(15, 8, 14, 6, p.pat('#1a1008', 9)); p.ell(13, 8, 9, 4, p.pat('#3a2a14', 7)); p.ell(11, 6, 3, 1.4, 'rgba(255,220,140,0.25)');
  }, { floor: true });
  /* pisadas de Chica en salsa (tres dedos). o.dir: u d l r */
  dec('sauceSteps', 28, 20, function (p, o) {
    var d = o.dir || 'd', fx = d === 'l' ? -1 : d === 'r' ? 1 : 0, fy = d === 'u' ? -1 : d === 'd' ? 1 : 0, i, k, cx, cy, c = p.pat('#a02a1c', 13);
    for (i = 0; i < 3; i++) {
      cx = 14 + fx * (i - 1) * 9 + (fx ? 0 : (i % 2 ? 4 : -4)); cy = 10 + fy * (i - 1) * 5 + (fy ? 0 : (i % 2 ? 3 : -3));
      p.ell(cx, cy, 2.4, 2.8, c);
      for (k = -1; k <= 1; k++) p.line(cx + fx * 2 - fy * k * 2, cy + fy * 2 + fx * k * 2, cx + fx * 5 - fy * k * 3, cy + fy * 5 + fx * k * 3, c, 1);
    }
  }, { floor: true });
  /* platos rotos */
  dec('brokenPlate', 26, 14, function (p) {
    p.poly([3, 9, 9, 3, 12, 8], C.ink); p.poly([4, 8, 9, 4, 11, 8], CR[0]);
    p.poly([13, 10, 19, 5, 23, 10], C.ink); p.poly([14, 9, 19, 6, 21, 9], CR[1]);
    p.poly([8, 12, 14, 9, 16, 13], C.ink); p.poly([9, 12, 14, 10, 15, 12], CR[2]);
    p.p(22, 4, CR[1]); p.p(6, 11, CR[1]);
  }, { floor: true });
  /* escarcha en el piso */
  dec('frostPatch', 34, 18, function (p) {
    p.ell(17, 9, 16, 8, p.pat('#f4fbff', 7)); p.ell(16, 8, 10, 5, p.pat('#ffffff', 6));
    p.line(6, 12, 14, 6, '#ffffff', 1); p.line(20, 14, 28, 5, '#ffffff', 1); p.p(12, 9, '#ffffff');
  }, { floor: true });
  /* harina derramada */
  dec('flourSpill', 30, 16, function (p) {
    p.ell(15, 8, 13, 6, p.pat('#f2ecd0', 8)); p.ell(13, 7, 8, 3.4, p.pat('#fffaf0', 7)); p.line(22, 8, 29, 11, '#f2ecd0', 1);
  }, { floor: true });
  /* rejilla de desagüe */
  dec('floorGrate', 40, 14, function (p) {
    p.r(0, 0, 40, 14, C.ink); p.r(1, 1, 38, 12, '#10161a'); for (var i = 0; i < 9; i++) p.r(3 + i * 4, 2, 2, 10, ST[2]);
    p.r(1, 1, 38, 1, ST[0]); p.r(1, 12, 38, 1, '#05080c'); p.dith(1, 1, 38, 12, '#1a2a3a', 8);
  }, { floor: true });
  /* alfombra de goma antifatiga con rombos */
  dec('kitchenMat', 70, 24, function (p) {
    p.r(0, 0, 70, 24, C.ink); p.r(1, 1, 68, 22, '#22282c'); p.r(2, 2, 66, 20, '#2e363a');
    for (var i = 0; i < 16; i++) for (var j = 0; j < 4; j++) p.poly([5 + i * 4, 6 + j * 4, 7 + i * 4, 4 + j * 4, 9 + i * 4, 6 + j * 4, 7 + i * 4, 8 + j * 4], '#1a2024');
  }, { floor: true });
  /* charco de agua sucia con jabón */
  dec('soapPuddle', 34, 16, function (p) {
    p.ell(17, 8, 16, 7, p.pat('#4a7a8a', 9)); p.ell(15, 7, 10, 4, p.pat('#a8d8e0', 7)); p.circ(10, 5, 1.6, '#ffffff'); p.circ(22, 9, 1.4, '#ffffff'); p.circ(18, 5, 1, '#ffffff');
  }, { floor: true });

  /* ====================== DECORACIÓN DE PARED ====================== */
  /* ollas y cucharones colgados */
  dec('panWall', 60, 30, function (p) {
    var i;
    p.r(2, 2, 56, 3, C.ink); p.r(3, 3, 54, 1, ST[1]);
    for (i = 0; i < 4; i++) {
      p.line(8 + i * 13, 4, 8 + i * 13, 8, ST[0], 1); p.circ(8 + i * 13, 15 + (i % 2) * 2, 6, C.ink); p.circ(8 + i * 13, 15 + (i % 2) * 2, 5, i % 2 ? '#8a5a30' : ST[0]);
      p.circ(8 + i * 13, 15 + (i % 2) * 2, 3, i % 2 ? '#4a2c14' : '#2a3236'); p.p(5 + i * 13, 12 + (i % 2) * 2, ST[1]);
    }
    for (i = 0; i < 3; i++) { p.line(14 + i * 13, 6, 14 + i * 13, 24, C.ink, 2); p.line(14 + i * 13, 6, 14 + i * 13, 22, ST[0], 1); p.ell(14 + i * 13, 26, 3, 2.4, C.ink); p.ell(14 + i * 13, 26, 2, 1.6, ST[1]); }
  });
  /* tira magnética de cuchillos */
  dec('knifeStrip', 44, 20, function (p) {
    var i;
    p.r(0, 2, 44, 5, C.ink); p.r(1, 3, 42, 3, '#3a2a18'); p.r(1, 3, 42, 1, WD[1]);
    for (i = 0; i < 6; i++) { p.r(4 + i * 7, 7, 3, 4 + (i % 3) * 2, C.ink); p.r(5 + i * 7, 7, 1, 3 + (i % 3) * 2, ST[1]); p.r(4 + i * 7, 5, 3, 3, WD[2]); }
    p.r(6, 17, 4, 2, '#7a1c18');
  });
  /* riel de comandas con pedidos pegados */
  dec('ticketRail', 56, 22, function (p) {
    var i;
    p.r(0, 0, 56, 4, C.ink); p.r(1, 1, 54, 2, ST[0]); p.r(1, 1, 54, 1, ST[1]);
    for (i = 0; i < 6; i++) { var h = 8 + (i * 5) % 9; p.r(4 + i * 9, 4, 7, h, C.ink); p.r(5 + i * 9, 4, 5, h - 1, '#f6f2e0'); p.r(6 + i * 9, 7, 3, 1, '#b3182b'); p.r(6 + i * 9, 10, 3, 1, '#8f87b5'); if (h > 12) p.r(6 + i * 9, 13, 2, 1, '#8f87b5'); }
  });
  /* pizarra de especiales */
  dec('specialsBoard', 44, 30, function (p) {
    p.r(0, 0, 44, 30, C.ink); p.r(1, 1, 42, 28, WD[0]); p.r(3, 3, 38, 24, '#1c2a24'); p.dith(3, 3, 38, 24, '#2c3a34', 5);
    p.txt('HOY', 16, 5, '#f2ecd0', 1); p.txt('PIZZA', 12, 12, '#ffe45c', 1); p.txt('3X2', 16, 19, '#f08a8a', 1);
    p.r(4, 24, 8, 1, '#f2ecd0'); p.line(30, 22, 36, 24, '#f2ecd0', 1);
  });
  /* reloj de cocina (se quedó en las 12:00) */
  dec('wallClock4', 22, 22, function (p) {
    p.circ(11, 11, 10, C.ink); p.circ(11, 11, 9, '#f2ecd0'); p.circ(11, 11, 8, '#fffaf0');
    for (var k = 0; k < 12; k++) p.p(11 + Math.cos(k * 0.5236) * 6.5, 11 + Math.sin(k * 0.5236) * 6.5, C.ink);
    p.line(11, 11, 11, 5, C.ink, 1); p.line(11, 11, 11, 4, C.ink, 1); p.p(11, 11, '#b3182b');
  });
  /* cartel de la cámara fría */
  dec('coldSign', 30, 16, function (p) {
    p.r(0, 0, 30, 16, C.ink); p.r(1, 1, 28, 14, '#2a5aa0'); p.r(1, 1, 28, 1, '#6a9ad8'); p.txt('FRIO', 8, 3, '#ffffff', 1); p.txt('-18C', 6, 9, '#4de0ff', 1);
  });
  /* aviso de lavado de manos */
  dec('handwash', 26, 22, function (p) {
    p.r(0, 0, 26, 22, C.ink); p.r(1, 1, 24, 20, '#e8f4f4'); p.r(1, 1, 24, 1, '#ffffff'); p.txt('LAVA', 5, 3, '#2a6a8a', 1); p.txt('TUS', 7, 9, '#2a6a8a', 1);
    p.circ(9, 17, 2.4, '#2a6a8a'); p.r(8, 14, 3, 3, '#2a6a8a'); p.r(14, 14, 5, 5, '#2a6a8a'); p.r(15, 12, 1, 3, '#2a6a8a'); p.r(17, 12, 1, 3, '#2a6a8a');
  });
  /* póster de Chica */
  dec('chicaPoster', 30, 38, function (p) {
    p.r(0, 0, 30, 38, C.ink); p.r(1, 1, 28, 36, '#b3182b'); p.r(1, 1, 28, 1, '#ff6070'); p.r(3, 3, 24, 32, '#2a1a3a');
    p.circ(15, 17, 8, C.ink); p.circ(15, 17, 7, YL[0]); p.circ(13, 14, 3, YL[1]); p.r(12, 14, 2, 2, '#fff'); p.r(17, 14, 2, 2, '#fff'); p.p(12, 15, C.ink); p.p(18, 15, C.ink);
    p.poly([12, 18, 18, 18, 15, 22], '#ff9a2e'); p.poly([12, 9, 15, 3, 18, 9], YL[0]); p.r(14, 8, 2, 1, '#b3182b');
    p.r(7, 27, 16, 5, '#f6f0e0'); p.txt('CHICA', 8, 28, '#b3182b', 1);
  });
  /* tuberías de vapor con válvulas */
  dec('steamPipe', 64, 16, function (p) {
    var i;
    p.r(0, 5, 64, 6, C.ink); p.r(0, 6, 64, 4, ST[0]); p.r(0, 6, 64, 1, ST[1]); p.r(0, 9, 64, 1, ST[2]);
    for (i = 0; i < 4; i++) { p.r(6 + i * 16, 3, 4, 10, C.ink); p.r(7 + i * 16, 4, 2, 8, ST[1]); }
    p.circ(32, 3, 3, C.ink); p.circ(32, 3, 2.2, '#b3182b'); p.r(31, 3, 3, 1, '#ff6070'); p.r(32, 10, 1, 4, C.ink);
    p.dith(0, 6, 64, 4, '#6a4a2c', 9);
  });
  /* reja de ventilación */
  dec('ductGrille', 30, 22, function (p) {
    p.r(0, 0, 30, 22, C.ink); p.r(1, 1, 28, 20, ST[0]); p.r(1, 1, 28, 1, ST[1]);
    for (var i = 0; i < 6; i++) { p.r(3, 4 + i * 3, 24, 2, '#10161a'); p.r(3, 4 + i * 3, 24, 1, '#05080c'); }
    p.p(2, 2, ST[1]); p.p(27, 2, ST[1]); p.p(2, 19, ST[2]); p.p(27, 19, ST[2]);
  });
  /* palas y rodillos de pizza colgados */
  dec('ovenTools', 36, 36, function (p) {
    var i;
    for (i = 0; i < 3; i++) {
      p.line(8 + i * 10, 2, 8 + i * 10, 30, C.ink, 3); p.line(8 + i * 10, 2, 8 + i * 10, 28, WD[1], 1);
      if (i !== 1) { p.ell(8 + i * 10, 30, 5, 3.4, C.ink); p.ell(8 + i * 10, 30, 4, 2.6, ST[0]); p.ell(7 + i * 10, 29, 2, 1, ST[1]); }
    }
    p.r(2, 0, 32, 2, C.ink); p.r(3, 0, 30, 1, ST[1]);
  });
  /* aviso de seguridad: extintor y salida de humos */
  dec('smokeWarn', 34, 18, function (p) {
    p.r(0, 0, 34, 18, C.ink); p.r(1, 1, 32, 16, '#e8b830'); p.r(1, 1, 32, 1, '#fff078');
    for (var i = 0; i < 6; i++) p.poly([2 + i * 6, 1, 5 + i * 6, 1, 3 + i * 6, 5], C.ink);
    p.txt('ALTA', 5, 7, C.ink, 1); p.txt('TEMP', 17, 7, C.ink, 1); p.r(3, 13, 28, 1, C.ink);
  });
})(window);
