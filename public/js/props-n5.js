/* props-n5.js — Noche 5 (Pasillo Oeste): almacén, baños, cuarto de limpieza, sala de máquinas,
   objetos perdidos y sala de guardia. Mismo estilo que props-a/b/c/n2/n3/n4: vista 3/4,
   contorno de tinta, luz arriba-izquierda y sombra abajo-derecha. */
(function (G) {
  'use strict';
  var C = PX.C, A = G.PROPS_API, reg = A.reg, dec = A.dec, sb = A.sb;
  var ST = ['#8a989c', '#c4d0d4', '#4a585c'];       // acero: base, luz, sombra
  var BK = ['#2a2e36', '#5e6272', '#0e1014'];       // hierro negro
  var YL = ['#e8b830', '#fff078', '#8a6410'];       // amarillo de seguridad
  var RD = ['#b3182b', '#ff6070', '#5a0a14'];       // rojo
  var BL = ['#2a5aa0', '#6a9ad8', '#14305a'];       // azul industrial
  var TL = ['#cfe2ea', '#f8feff', '#8aa0a8'];       // azulejo de baño
  var WD = ['#8a5a30', '#c08a50', '#4a2c14'];       // madera
  var PR = ['#6a48b0', '#a888e8', '#30205a'];       // morado de Bonnie

  /* vapor que sube (x, y = base) */
  function steam(p, x, y, t, k, n) {
    for (var i = 0; i < n; i++) {
      var f = (t * 0.45 + i / n + k) % 1;
      p.circ(x + Math.sin(t * 2 + i * 2.1 + k) * 2.4 + i - n / 2, y - f * 18, 1.5 + f * 3, 'rgba(232,238,244,' + (0.5 * (1 - f)).toFixed(2) + ')');
    }
  }
  /* gota que cae (x, y = salida, h = caída) */
  function drip(p, x, y, h, t, k, col) {
    var f = (t * 0.8 + k) % 1;
    if (f < 0.8) p.r(x, y + f / 0.8 * h, 1, 2, col || '#9ad0f0');
    else p.ell(x, y + h + 1, 2 + (f - 0.8) * 8, 1, 'rgba(154,208,240,' + (1 - (f - 0.8) * 4).toFixed(2) + ')');
  }

  /* ====================== TAREAS ====================== */
  /* letrero grande de «piso mojado» con una nota pegada (TAREA) */
  reg('wetBoard', 32, 38, 2, 1, function (p) {
    p.ell(16, 36, 14, 2.4, 'rgba(0,0,0,0.3)');
    p.poly([3, 36, 7, 5, 11, 5, 8, 36], C.ink); p.poly([29, 36, 25, 5, 21, 5, 24, 36], C.ink);           // patas del caballete
    p.r(4, 6, 24, 28, C.ink); p.r(5, 7, 22, 26, YL[0]); p.r(5, 7, 22, 1, YL[1]); p.r(5, 7, 1, 26, YL[1]); p.r(5, 32, 22, 1, YL[2]); p.r(26, 7, 1, 26, YL[2]);
    p.circ(16, 12, 2.2, C.ink);                                                                           // figura resbalando
    p.line(16, 14, 13, 20, C.ink, 2); p.line(15, 16, 20, 14, C.ink, 1); p.line(14, 16, 10, 18, C.ink, 1); p.line(13, 20, 19, 23, C.ink, 1); p.line(13, 20, 9, 24, C.ink, 1);
    p.r(7, 26, 18, 1, C.ink); p.txt('PISO', 9, 28, C.ink, 1);
    p.r(20, 8, 6, 8, '#f6f2e0'); p.r(20, 8, 6, 1, '#fff'); p.r(21, 10, 4, 1, '#8f87b5'); p.r(21, 12, 3, 1, '#8f87b5'); p.r(21, 14, 3, 1, '#8f87b5');     // nota
    p.r(18, 5, 12, 2, C.ink);
  }, {
    anim: function (ctx, x, y, t) { var p = new PX.Pen(ctx, 1, x, y); drip(p, 8, 34, 2, t, 0.1, '#9ad0f0'); }
  });

  /* reja del almacén con cadena y candado (TAREA) */
  reg('padlockGate', 34, 54, 2, 1, function (p) {
    var i;
    p.ell(17, 52, 16, 2.6, 'rgba(0,0,0,0.3)');
    sb(p, 0, 2, 34, 50, ST[2], ST[0], BK[2]);
    p.r(3, 5, 28, 44, '#10141a');
    for (i = 0; i < 6; i++) { p.r(5 + i * 5, 5, 2, 44, ST[0]); p.r(5 + i * 5, 5, 1, 44, ST[1]); }                // barrotes
    p.r(3, 14, 28, 2, C.ink); p.r(3, 33, 28, 2, C.ink); p.r(3, 14, 28, 1, ST[1]); p.r(3, 33, 28, 1, ST[1]);
    p.r(0, 0, 34, 5, C.ink); p.r(1, 1, 32, 3, ST[0]); p.r(1, 1, 32, 1, ST[1]);
    for (i = 0; i < 8; i++) { p.circ(4 + i * 3.5, 24 + (i % 2) * 2, 1.7, C.ink); p.circ(4 + i * 3.5, 24 + (i % 2) * 2, 0.9, ST[1]); }   // cadena
    p.r(12, 26, 10, 11, C.ink); p.r(13, 27, 8, 9, RD[0]); p.r(13, 27, 8, 1, RD[1]); p.r(13, 35, 8, 1, RD[2]);       // candado
    p.circ(17, 24, 5, C.ink); p.circ(17, 24, 3.4, '#10141a'); p.r(15, 24, 5, 3, '#10141a'); p.circ(17, 31, 1.4, C.ink);
    p.r(7, 6, 20, 7, '#f6f0dc'); p.r(7, 6, 20, 1, '#fff'); p.txt('SOLO', 8, 7, RD[0], 1); p.r(8, 10, 18, 1, RD[0]); p.r(8, 12, 12, 1, C.ink);
    p.r(0, 49, 34, 3, BK[0]); p.r(0, 49, 34, 1, BK[1]);
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), g = (t * 0.7) % 1;
      if (g < 0.2) { p.p(14, 28, '#fff'); p.p(15, 28 - g * 6, '#ffd0d0'); }
    }
  });

  /* tablero con un póster arrugado (TAREA) */
  reg('posterBoard', 48, 50, 3, 1, function (p) {
    p.ell(24, 48, 22, 2.6, 'rgba(0,0,0,0.28)');
    p.r(4, 38, 4, 12, C.ink); p.r(40, 38, 4, 12, C.ink); p.r(5, 38, 1, 11, ST[1]); p.r(41, 38, 1, 11, ST[1]);
    sb(p, 0, 0, 48, 42, WD[0], WD[1], WD[2]);
    p.r(3, 3, 42, 36, '#a07a48'); p.dith(3, 3, 42, 36, '#7c5a30', 5); p.r(3, 3, 42, 1, '#c8a064');
    p.poly([7, 5, 38, 4, 41, 36, 9, 37, 6, 22], C.ink);                                                   // póster arrugado
    p.poly([8, 6, 37, 5, 40, 35, 10, 36, 7, 22], '#e8dcc0');
    p.poly([8, 6, 22, 5, 17, 20, 7, 22], '#f4ecd4'); p.poly([22, 5, 37, 5, 40, 35, 29, 24], '#d4c8a8');
    p.line(22, 5, 17, 20, '#a89c78', 1); p.line(17, 20, 29, 24, '#a89c78', 1); p.line(29, 24, 40, 35, '#a89c78', 1); p.line(7, 22, 17, 20, '#a89c78', 1);
    p.circ(23, 16, 5, C.ink); p.circ(23, 16, 4, PR[0]); p.poly([19, 12, 20, 4, 22, 11], PR[0]); p.poly([24, 11, 27, 4, 27, 12], PR[0]);   // cara de Bonnie
    p.r(21, 15, 2, 2, '#fff'); p.r(25, 15, 2, 2, '#fff'); p.p(22, 16, C.ink); p.p(26, 16, C.ink); p.r(21, 19, 6, 1, C.ink);
    p.txt('SE BUSCA', 7, 26, RD[0], 1); p.r(9, 32, 28, 1, '#8f87b5'); p.r(9, 34, 20, 1, '#8f87b5');
    p.circ(10, 7, 1.6, RD[0]); p.p(9, 6, RD[1]); p.circ(38, 7, 1.6, '#2e8a3a'); p.circ(9, 35, 1.6, YL[0]);   // chinchetas
  }, {
    anim: function (ctx, x, y, t) { var p = new PX.Pen(ctx, 1, x, y); if (Math.sin(t * 1.3) > 0.97) p.line(30, 24, 36, 30, 'rgba(255,255,255,0.5)', 1); }
  });

  /* caja de interruptor de luz con palanca grande (TAREA) */
  reg('switchPanel', 24, 30, 0, 0, function (p) {
    sb(p, 0, 0, 24, 30, ST[0], ST[1], ST[2]);
    p.r(3, 3, 18, 24, '#3a4650'); p.r(3, 3, 18, 1, ST[0]); p.r(3, 26, 18, 1, BK[2]);
    p.r(9, 6, 6, 12, C.ink); p.r(10, 7, 4, 10, BK[0]);                                                    // ranura de la palanca
    p.r(10, 14, 4, 3, C.ink); p.r(10, 14, 4, 2, RD[0]); p.r(10, 14, 4, 1, RD[1]); p.circ(12, 14, 2.4, C.ink); p.circ(12, 14, 1.6, '#c8d0d0');
    p.circ(6, 7, 1.6, C.ink); p.circ(6, 7, 0.9, '#3a0a10'); p.r(5, 20, 14, 7, '#f6f0dc'); p.txt('LUZ', 7, 21, C.ink, 1);
    p.r(15, 3, 6, 4, '#f6f0dc'); p.r(15, 3, 6, 1, '#fff'); p.line(16, 5, 20, 5, '#8f87b5', 1);
  }, {
    light: { dx: 6, dy: 7, r: 22, col: '#ff4050', flick: 0.5 },
    anim: function (ctx, x, y, t) { var p = new PX.Pen(ctx, 1, x, y); if (Math.sin(t * 4) > 0.3) p.circ(6, 7, 1.6, '#ff5060'); }
  });

  /* tablero de breakers con luces, rótulo y breakers caídos (TAREA) */
  reg('breakerBoard', 64, 58, 4, 1, function (p) {
    var i, j;
    p.ell(32, 56, 30, 2.6, 'rgba(0,0,0,0.3)');
    sb(p, 0, 0, 64, 54, '#5a6068', '#8a929c', '#22262c');
    p.r(3, 3, 58, 7, C.ink); p.r(4, 4, 56, 5, '#1a1e24'); p.txt('BREAKERS', 7, 5, YL[0], 1); p.txt('480V', 41, 5, RD[1], 1);
    p.r(3, 12, 58, 38, '#2a2e36');
    for (j = 0; j < 3; j++) for (i = 0; i < 8; i++) {                                                     // breakers
      var x = 5 + i * 7, y = 14 + j * 11, off = (i * 5 + j * 3) % 7 === 2;
      p.r(x, y, 6, 9, C.ink); p.r(x + 1, y + 1, 4, 7, '#4a4e58'); p.r(x + 1, y + (off ? 5 : 1), 4, 3, off ? RD[0] : '#c8d0d0');
      p.r(x + 1, y + (off ? 5 : 1), 4, 1, off ? RD[1] : '#fff');
    }
    p.r(3, 48, 58, 1, BK[2]);
    p.r(0, 52, 64, 2, BK[0]);
    for (i = 0; i < 64; i += 8) p.poly([i, 52, i + 4, 52, i + 8, 54, i + 4, 54], YL[0]);
  }, {
    light: { dx: 32, dy: 28, r: 46, col: '#ff9a4a', flick: 0.6 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i;
      for (i = 0; i < 8; i++) {
        var on = Math.sin(t * (2 + i * 0.7) + i * 1.9) > 0;
        p.r(5 + i * 7, 46, 6, 2, on ? (i % 3 ? '#3fd479' : '#ffb030') : (i % 3 ? '#143a24' : '#4a3008'));
        if (on) p.p(6 + i * 7, 46, '#ffffff');
      }
      if (Math.sin(t * 9 + 1) + Math.sin(t * 3.7) > 1.55) { p.line(58, 2, 55, 8, '#aee8ff', 1); p.line(55, 8, 59, 12, '#aee8ff', 1); p.p(55, 8, '#fff'); }   // chispa
    }
  });

  /* ====================== SALA DE MÁQUINAS ====================== */
  /* caldera con horno, manómetros y chimenea */
  reg('boiler', 52, 70, 3, 2, function (p) {
    var i;
    p.ell(26, 66, 25, 3.4, 'rgba(0,0,0,0.3)');
    p.r(2, 44, 48, 22, C.ink); p.r(3, 45, 46, 20, '#4a4e58'); p.r(3, 45, 46, 1, '#8a929c'); p.r(3, 45, 4, 20, '#6a707a'); p.r(45, 45, 4, 20, '#22262c');
    p.r(14, 50, 24, 14, C.ink); p.r(15, 51, 22, 12, '#14100c'); p.r(15, 51, 22, 1, '#5a626c');           // puerta del horno
    p.r(12, 49, 2, 16, '#c8d0d0'); p.r(38, 49, 2, 16, '#c8d0d0'); p.r(24, 46, 4, 2, RD[0]);
    p.r(4, 64, 44, 2, BK[2]);
    p.bell(26, 24, 21, 8, '#6a707a', C.ink, 1);                                                           // tanque
    p.r(5, 14, 42, 28, C.ink); p.r(6, 14, 40, 28, '#868e98'); p.r(6, 14, 7, 28, '#b4bcc6'); p.r(40, 14, 6, 28, '#4a525c'); p.dith(13, 14, 27, 28, '#a0a8b2', 5);
    p.ell(26, 14, 21, 6, C.ink); p.ell(26, 14, 20, 5, '#a8b0ba'); p.ell(26, 13, 12, 2.4, '#c8d0d8');
    for (i = 0; i < 3; i++) { p.r(5, 21 + i * 10, 42, 2, C.ink); p.r(6, 21 + i * 10, 40, 1, '#c8d0d8'); for (var k = 0; k < 7; k++) p.p(8 + k * 6, 22 + i * 10, '#e8f0f4'); }
    p.r(22, 0, 8, 10, C.ink); p.r(23, 0, 6, 9, ST[0]); p.r(23, 0, 2, 9, ST[1]);                          // chimenea
    p.circ(14, 32, 5, C.ink); p.circ(14, 32, 4, '#f6f2e0'); p.r(14, 28, 1, 5, RD[0]); p.p(14, 32, C.ink);   // manómetro
    p.circ(38, 32, 5, C.ink); p.circ(38, 32, 4, '#f6f2e0'); p.p(38, 32, C.ink);
    p.r(30, 38, 12, 3, C.ink); p.r(31, 38, 10, 1, '#d8a010');
  }, {
    light: { dx: 26, dy: 56, r: 50, col: '#ff7a2a', flick: 0.6 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, a = Math.sin(t * 1.4) * 0.5;
      p.line(14, 32, 14 + Math.sin(-1.4 + a) * 3.4, 32 + Math.cos(-1.4 + a) * 3.4, RD[0], 1);
      p.line(38, 32, 38 + Math.sin(0.9 - a) * 3.4, 32 - Math.cos(0.9 - a) * 3.4, RD[0], 1);
      for (i = 0; i < 6; i++) { var h = 5 + Math.sin(t * 11 + i * 2) * 2.2; p.poly([17 + i * 3, 62, 20 + i * 3, 62, 18.5 + i * 3, 62 - h], i % 2 ? '#ff9a2a' : '#ffd24a'); }
      steam(p, 26, 2, t, 0.3, 4);
    }
  });

  /* generador con volante que gira, escape y chispas */
  reg('genSet', 48, 44, 3, 1, function (p) {
    p.ell(24, 42, 22, 2.8, 'rgba(0,0,0,0.3)');
    sb(p, 0, 14, 48, 28, '#3a5a3a', '#6a9a6a', '#14281a');
    p.r(3, 28, 42, 11, '#2a4a2c'); p.r(3, 28, 42, 1, '#6a9a6a'); for (var i = 0; i < 6; i++) p.r(6 + i * 7, 30, 3, 7, '#142818');
    p.r(1, 2, 28, 14, C.ink); p.r(2, 3, 26, 12, '#4a5a4a'); p.r(2, 3, 26, 1, '#8aaa8a'); p.r(4, 6, 12, 6, '#10181a'); p.r(5, 7, 4, 4, '#3fd479');   // alternador
    p.r(34, 6, 5, 10, C.ink); p.r(35, 0, 3, 8, BK[1]); p.r(35, 0, 3, 1, '#8a8aa0');                        // escape
    p.circ(36, 22, 10, C.ink); p.circ(36, 22, 9, '#6a707a'); p.circ(36, 22, 3, C.ink);
    p.r(20, 40, 24, 2, BK[0]);
  }, {
    light: { dx: 24, dy: 24, r: 34, col: '#ffcf60', flick: 0.5 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, a;
      for (i = 0; i < 4; i++) { a = t * 14 + i * 1.5708; p.line(36, 22, 36 + Math.cos(a) * 8.2, 22 + Math.sin(a) * 8.2, i % 2 ? '#aab2bc' : '#4a525c', 2); }
      p.circ(36, 22, 2, '#c8d0d8');
      for (i = 0; i < 3; i++) { var f = (t * 0.9 + i / 3) % 1; p.circ(36 + Math.sin(t * 3 + i) * 2, 0 - f * 12, 1.4 + f * 3, 'rgba(70,74,80,' + (0.6 * (1 - f)).toFixed(2) + ')'); }
      if (Math.sin(t * 7) + Math.sin(t * 2.3) > 1.5) { p.p(8, 24, '#ffe08a'); p.p(10, 22, '#fff'); }
    }
  });

  /* motobomba con aspas visibles dentro de la jaula */
  reg('pumpMotor', 34, 32, 2, 1, function (p) {
    p.ell(17, 30, 16, 2.4, 'rgba(0,0,0,0.3)');
    sb(p, 0, 16, 34, 14, BK[0], BK[1], BK[2]);
    p.r(2, 24, 30, 4, '#1a1e24'); p.r(4, 18, 4, 3, YL[0]);
    p.r(1, 2, 18, 18, C.ink); p.r(2, 3, 16, 16, '#4a5058'); p.r(2, 3, 16, 1, ST[0]);                       // motor
    for (var i = 0; i < 4; i++) p.r(4 + i * 4, 5, 2, 12, '#2a2e34');
    p.circ(26, 11, 8, C.ink); p.circ(26, 11, 7, '#22262c'); p.r(18, 9, 4, 4, ST[0]);
    p.r(30, 3, 4, 6, BL[0]); p.r(30, 3, 4, 1, BL[1]);                                                       // tubería azul
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i, a;
      for (i = 0; i < 3; i++) { a = t * 18 + i * 2.0944; p.line(26, 11, 26 + Math.cos(a) * 6, 11 + Math.sin(a) * 6, '#8a929c', 2); }
      p.circ(26, 11, 1.6, '#c8d0d8');
    }
  });

  /* tubería vertical con válvula roja y fuga de vapor */
  reg('pipeRiser', 22, 64, 1, 1, function (p) {
    p.ell(11, 62, 9, 2, 'rgba(0,0,0,0.3)');
    p.r(2, 56, 18, 6, C.ink); p.r(3, 57, 16, 4, BK[1]); p.r(3, 57, 16, 1, '#8a8aa0');                       // base
    p.r(7, 0, 8, 58, C.ink); p.r(8, 0, 6, 58, '#a04a1c'); p.r(8, 0, 2, 58, '#e08a3c'); p.r(12, 0, 2, 58, '#5a2408');
    [10, 30, 48].forEach(function (y) { p.r(5, y, 12, 4, C.ink); p.r(6, y, 10, 2, ST[0]); p.r(6, y, 10, 1, ST[1]); });
    p.r(15, 22, 5, 3, C.ink); p.circ(21, 23, 3.4, C.ink); p.circ(21, 23, 2.4, RD[0]); p.p(20, 22, RD[1]); p.r(20, 21, 2, 5, RD[0]);   // válvula
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      if (Math.sin(t * 0.8) > -0.2) steam(p, 4, 32, t, 0.2, 4);
    }
  });

  /* ====================== BAÑOS ====================== */
  /* cubículo: v a cerrado, b abierto con inodoro, c puerta rota */
  reg('toiletStall', 32, 58, 2, 1, function (p, o) {
    var v = o.v || 'a';
    p.ell(16, 56, 15, 2.4, 'rgba(0,0,0,0.3)');
    if (v === 'b') {                                                                                       // inodoro al fondo
      p.r(2, 6, 28, 40, C.ink); p.r(3, 7, 26, 38, '#8aa0a8'); p.r(3, 7, 26, 1, TL[1]);
      p.ell(16, 40, 7, 4, C.ink); p.ell(16, 39, 6, 3, '#f4f8fa'); p.r(10, 24, 12, 12, C.ink); p.r(11, 25, 10, 10, '#e8f0f4'); p.r(11, 25, 10, 2, '#fff'); p.r(13, 22, 6, 3, '#c8d0d4');
      p.ell(16, 39, 4, 1.6, '#3a5a6a'); p.r(2, 4, 28, 3, ST[0]); p.r(2, 4, 28, 1, ST[1]);
      p.r(0, 4, 4, 52, C.ink); p.r(1, 5, 2, 50, '#7a8a96'); p.r(1, 5, 1, 50, TL[1]);                        // puerta abierta de lado
      p.poly([0, 8, 4, 8, 4, 54, 0, 54], '#6a7a86');
    } else {
      p.r(0, 4, 32, 50, C.ink); p.r(1, 5, 30, 48, '#8aa4b8'); p.r(1, 5, 30, 1, '#c4dcec'); p.r(1, 5, 1, 48, '#b0c8d8'); p.r(30, 5, 1, 48, '#5a7488'); p.r(1, 52, 30, 1, '#3a5468');
      p.dith(2, 6, 28, 46, '#a4bccc', 4);
      p.r(0, 2, 32, 3, C.ink); p.r(1, 2, 30, 2, ST[0]); p.r(1, 2, 30, 1, ST[1]);
      p.r(4, 9, 24, 36, '#7a94a8'); p.r(4, 9, 24, 1, '#c4dcec'); p.r(4, 44, 24, 1, '#3a5468');            // hoja de la puerta
      p.r(22, 24, 4, 5, C.ink); p.r(23, 25, 2, 3, v === 'c' ? '#8a8a8a' : RD[0]);                             // pestillo
      p.r(8, 12, 8, 4, '#f6f0dc'); p.txt(v === 'c' ? 'X' : 'WC', v === 'c' ? 11 : 9, 13, v === 'c' ? RD[0] : C.ink, 1);
      p.r(2, 53, 28, 3, '#1c2830');                                                                         // hueco al piso
      if (v === 'c') { p.poly([4, 34, 12, 44, 4, 44], '#10181e'); p.line(4, 32, 14, 26, C.ink, 1); p.r(4, 38, 20, 2, '#10181e'); }
    }
  });

  /* fila de lavabos con espejo agrietado y llaves que gotean */
  reg('sinkRow', 64, 46, 4, 1, function (p) {
    var i;
    p.ell(32, 44, 30, 2.4, 'rgba(0,0,0,0.28)');
    for (i = 0; i < 3; i++) {                                                                               // espejos
      p.r(2 + i * 21, 0, 19, 20, C.ink); p.r(3 + i * 21, 1, 17, 18, '#aebcc6'); p.r(3 + i * 21, 1, 17, 1, '#e8f0f4');
      p.dith(3 + i * 21, 3, 17, 14, '#c8d8e2', 4); p.line(5 + i * 21, 15, 9 + i * 21, 4, 'rgba(255,255,255,0.7)', 1);
    }
    p.line(32, 1, 36, 9, C.ink, 1); p.line(36, 9, 33, 18, C.ink, 1); p.line(36, 9, 40, 12, C.ink, 1);    // grieta del espejo del centro
    sb(p, 0, 22, 64, 8, TL[0], TL[1], TL[2]); p.r(0, 29, 64, 1, C.ink);
    for (i = 0; i < 3; i++) {                                                                               // lavabos
      p.ell(11 + i * 21, 26, 8, 3.6, C.ink); p.ell(11 + i * 21, 26, 7, 3, '#f4f8fa'); p.ell(11 + i * 21, 26, 4, 1.6, '#6a8a98');
      p.r(10 + i * 21, 17, 3, 5, C.ink); p.r(10 + i * 21, 18, 3, 3, ST[1]); p.r(8 + i * 21, 22, 7, 2, ST[0]);
      p.r(18 + i * 21, 21, 3, 4, C.ink); p.r(18 + i * 21, 21, 3, 3, '#e8c8d0');                              // jabón
    }
    sb(p, 2, 30, 60, 14, TL[2], TL[0], '#56707c');
    for (i = 0; i < 3; i++) { p.r(5 + i * 21, 33, 14, 9, '#4a6068'); p.r(5 + i * 21, 33, 14, 1, TL[1]); p.r(11 + i * 21, 36, 3, 1, '#c8d0d4'); }
    p.r(0, 43, 64, 3, '#2a3a40');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y); drip(p, 11, 23, 2, t, 0.1); drip(p, 53, 23, 2, t, 0.55);
      if (Math.sin(t * 2) > 0.8) p.line(8, 12, 12, 5, 'rgba(255,255,255,0.7)', 1);
    }
  });

  /* ====================== ALMACÉN Y LIMPIEZA ====================== */
  /* estantería industrial azul con rollos de papel y bidones. v a/b */
  reg('suppliesRack', 48, 60, 3, 1, function (p, o) {
    var v = o.v || 'a', i, j;
    p.ell(24, 58, 22, 2.6, 'rgba(0,0,0,0.28)');
    p.r(1, 2, 3, 56, C.ink); p.r(44, 2, 3, 56, C.ink); p.r(2, 2, 1, 56, BL[1]); p.r(45, 2, 1, 56, BL[1]);
    for (j = 0; j < 4; j++) {
      var y = 14 + j * 14;
      p.r(1, y, 46, 3, C.ink); p.r(2, y, 44, 2, BL[0]); p.r(2, y, 44, 1, BL[1]);
      if ((j + (v === 'a' ? 0 : 1)) % 3 === 0) { for (i = 0; i < 5; i++) { p.r(5 + i * 8, y - 11, 7, 11, C.ink); p.r(6 + i * 8, y - 10, 5, 9, '#f2f0e8'); p.r(6 + i * 8, y - 10, 5, 1, '#fff'); p.ell(8.5 + i * 8, y - 10, 2.4, 1, '#d8d4c4'); } }
      else if ((j + (v === 'a' ? 0 : 1)) % 3 === 1) { for (i = 0; i < 3; i++) { p.r(5 + i * 13, y - 12, 11, 12, C.ink); p.r(6 + i * 13, y - 11, 9, 10, i % 2 ? '#3a8acc' : '#3fb37a'); p.r(6 + i * 13, y - 11, 9, 1, '#a8e8ff'); p.r(8 + i * 13, y - 8, 5, 4, '#f6f2e0'); p.r(9 + i * 13, y - 14, 3, 3, C.ink); } }
      else { p.r(4, y - 9, 18, 9, C.ink); p.r(5, y - 8, 16, 7, '#b08a50'); p.r(5, y - 8, 16, 1, '#d8b878'); p.r(24, y - 12, 20, 12, C.ink); p.r(25, y - 11, 18, 10, '#c4a064'); p.r(25, y - 11, 18, 1, '#e8c888'); p.r(28, y - 7, 12, 3, '#f6f2e0'); }
    }
    p.r(1, 56, 46, 2, C.ink);
  });

  /* tarima con cajas envueltas en plástico */
  reg('palletStack', 34, 44, 2, 1, function (p) {
    p.ell(17, 42, 16, 2.6, 'rgba(0,0,0,0.28)');
    p.r(1, 36, 32, 6, C.ink); p.r(2, 37, 30, 4, WD[0]); p.r(2, 37, 30, 1, WD[1]); p.r(6, 37, 4, 4, C.ink); p.r(15, 37, 4, 4, C.ink); p.r(24, 37, 4, 4, C.ink);
    p.r(2, 18, 30, 19, C.ink); p.r(3, 19, 28, 17, '#b08a50'); p.r(3, 19, 28, 1, '#d8b878'); p.r(3, 35, 28, 1, '#6a4a28'); p.r(16, 19, 2, 17, '#8a6a38');
    p.r(4, 2, 26, 17, C.ink); p.r(5, 3, 24, 15, '#c4a064'); p.r(5, 3, 24, 1, '#e8c888'); p.r(15, 3, 3, 15, '#9a7a44');
    p.dith(3, 3, 28, 33, '#f0f6fa', 3); p.line(3, 33, 30, 22, 'rgba(255,255,255,0.45)', 1); p.r(7, 7, 19, 8, '#f6f2e0'); p.txt('FRAG', 9, 9, RD[0], 1);
  });

  /* estante de limpieza con botellas de colores y etiquetas de peligro */
  reg('chemShelf', 32, 52, 2, 1, function (p) {
    var j, i, cols = ['#3fb37a', '#3a8acc', '#e8508a', '#e8b830', '#8a58c8'];
    p.ell(16, 50, 15, 2.4, 'rgba(0,0,0,0.28)');
    sb(p, 0, 2, 32, 48, '#8a8e96', '#c0c6ce', '#4a4e56');
    for (j = 0; j < 3; j++) {
      var y = 16 + j * 14;
      p.r(2, y, 28, 2, BK[0]); p.r(2, y, 28, 1, BK[1]);
      for (i = 0; i < 5; i++) { var c = cols[(i + j * 2) % 5]; p.r(4 + i * 5, y - 11, 4, 11, C.ink); p.r(5 + i * 5, y - 9, 2, 9, c); p.r(5 + i * 5, y - 9, 1, 8, '#ffffff'); p.r(5 + i * 5, y - 13, 2, 3, C.ink); p.r(5 + i * 5, y - 12, 2, 1, RD[0]); }
    }
    p.r(2, 46, 28, 2, C.ink); p.r(5, 4, 22, 5, '#f6f0dc'); p.poly([7, 8, 10, 4, 13, 8], YL[0]); p.poly([6, 8, 9, 4, 12, 8], C.ink); p.poly([7, 8, 9, 5, 11, 8], YL[0]); p.r(14, 5, 10, 1, C.ink); p.r(14, 7, 8, 1, C.ink);
  });

  /* pileta de mantenimiento con trapeador colgado */
  reg('janitorSink', 32, 44, 2, 1, function (p) {
    p.ell(16, 42, 15, 2.4, 'rgba(0,0,0,0.28)');
    sb(p, 0, 16, 32, 26, '#d8dee2', '#fff', '#8a949c');
    p.r(3, 20, 26, 12, '#9aa6ac'); p.r(3, 20, 26, 2, '#6a767c'); p.r(6, 24, 20, 7, '#2a3a40'); p.dith(6, 24, 20, 7, '#4a6a7a', 6);
    p.r(14, 8, 4, 13, C.ink); p.r(15, 8, 2, 12, ST[1]); p.r(11, 6, 10, 4, C.ink); p.r(12, 7, 8, 2, ST[0]);
    p.r(24, 0, 2, 20, C.ink); p.r(24, 0, 1, 20, WD[1]); p.r(21, 20, 8, 6, C.ink); p.r(22, 20, 6, 5, '#d8d4c4'); p.dith(22, 20, 6, 5, '#a89c78', 5);   // trapeador
    p.r(2, 34, 28, 6, '#6a767c'); p.r(2, 34, 28, 1, '#a8b2b8'); p.r(5, 36, 4, 2, C.ink);
  }, {
    anim: function (ctx, x, y, t) { var p = new PX.Pen(ctx, 1, x, y); drip(p, 16, 21, 4, t, 0.2); }
  });

  /* carrito de objetos perdidos: mochila, paraguas y peluches */
  reg('lostCart', 36, 44, 2, 1, function (p) {
    p.ell(18, 42, 16, 2.4, 'rgba(0,0,0,0.28)');
    p.r(2, 36, 5, 6, C.ink); p.circ(5, 40, 2.4, C.ink); p.circ(5, 40, 1.4, ST[1]); p.circ(31, 40, 2.4, C.ink); p.circ(31, 40, 1.4, ST[1]);
    sb(p, 0, 16, 36, 20, BL[0], BL[1], BL[2]);
    p.r(3, 19, 30, 14, '#10182a'); p.r(2, 14, 32, 3, C.ink); p.r(3, 14, 30, 1, BL[1]);
    p.r(4, 20, 8, 12, C.ink); p.r(5, 21, 6, 10, '#c8281c'); p.r(5, 21, 6, 1, '#ff7060'); p.r(6, 25, 4, 4, '#8a1c14');                   // mochila
    p.ell(24, 11, 7, 5, C.ink); p.ell(24, 10, 6, 4, PR[0]); p.poly([20, 6, 21, 0, 23, 6], PR[0]); p.poly([25, 6, 27, 0, 28, 7], PR[0]);   // peluche morado
    p.r(22, 9, 2, 2, '#fff'); p.r(26, 9, 2, 2, '#fff'); p.p(23, 10, C.ink); p.p(27, 10, C.ink);
    p.line(30, 12, 33, 2, C.ink, 2); p.line(30, 12, 33, 2, '#d8a010', 1); p.line(33, 2, 35, 5, C.ink, 1);                                 // paraguas
    p.r(13, 3, 8, 12, C.ink); p.r(14, 4, 6, 10, '#2e8a3a'); p.r(14, 4, 6, 1, '#6ac47a'); p.r(15, 6, 4, 3, '#f6f0dc');
  });

  /* estantería de casilleros abiertos con objetos olvidados. v a/b */
  reg('cubbyShelf', 48, 58, 3, 1, function (p, o) {
    var v = o.v || 'a', i, j;
    p.ell(24, 56, 22, 2.6, 'rgba(0,0,0,0.28)');
    sb(p, 0, 2, 48, 54, WD[0], WD[1], WD[2]);
    for (j = 0; j < 3; j++) for (i = 0; i < 3; i++) {
      var x = 3 + i * 14, y = 5 + j * 17, k = (i + j * 2 + (v === 'a' ? 0 : 1)) % 5;
      p.r(x, y, 13, 15, C.ink); p.r(x + 1, y + 1, 11, 13, '#1c120a'); p.r(x + 1, y + 1, 11, 1, '#0a0604');
      if (k === 0) { p.r(x + 3, y + 5, 7, 9, '#2e5a9a'); p.r(x + 3, y + 5, 7, 1, '#6a9ad8'); p.r(x + 5, y + 8, 3, 3, '#f2c21c'); }
      else if (k === 1) { p.ell(x + 6, y + 10, 4, 3.4, PR[0]); p.poly([x + 3, y + 8, x + 4, y + 3, x + 6, y + 8], PR[0]); p.poly([x + 7, y + 8, x + 9, y + 3, x + 10, y + 8], PR[0]); }
      else if (k === 2) { p.poly([x + 2, y + 13, x + 5, y + 8, x + 11, y + 8, x + 11, y + 13], '#b3182b'); p.r(x + 2, y + 12, 9, 1, '#ff6070'); }
      else if (k === 3) { p.r(x + 4, y + 4, 3, 10, '#c8d0d4'); p.r(x + 4, y + 4, 3, 1, '#fff'); p.r(x + 4, y + 3, 3, 2, RD[0]); }
      else { p.ell(x + 6, y + 11, 4, 3, '#8a5a30'); p.circ(x + 6, y + 8, 3, '#8a5a30'); p.r(x + 5, y + 8, 1, 1, C.ink); p.r(x + 7, y + 8, 1, 1, C.ink); }
    }
    p.r(0, 54, 48, 2, C.ink);
  });

  /* montón de peluches olvidados (oso, conejo, pollo, zorro) */
  reg('plushPile', 34, 26, 2, 1, function (p) {
    p.ell(17, 24, 15, 2.6, 'rgba(0,0,0,0.28)');
    p.ell(10, 16, 9, 7, C.ink); p.ell(10, 15, 8, 6, '#8a5a30'); p.circ(6, 6, 3, C.ink); p.circ(6, 6, 2, '#8a5a30'); p.circ(14, 6, 3, C.ink); p.circ(14, 6, 2, '#8a5a30');
    p.r(7, 11, 2, 2, '#fff'); p.r(12, 11, 2, 2, '#fff'); p.p(8, 12, C.ink); p.p(13, 12, C.ink); p.ell(10, 16, 3, 2, '#c08a50');                       // oso
    p.ell(25, 17, 7, 6, C.ink); p.ell(25, 16, 6, 5, PR[0]); p.poly([21, 10, 22, 2, 24, 10], PR[0]); p.poly([26, 10, 28, 2, 29, 10], PR[0]); p.r(22, 13, 2, 2, '#fff'); p.r(26, 13, 2, 2, '#fff');   // conejo
    p.ell(20, 10, 5, 4, C.ink); p.ell(20, 9, 4, 3, YL[0]); p.poly([19, 12, 22, 12, 20, 15], '#ff9a2e');                                          // pollo
    p.ell(30, 21, 3, 2, '#c8501c');
  });

  /* ====================== LUCES ====================== */
  /* tubo fluorescente de pared que parpadea */
  reg('tubeLight', 40, 14, 0, 0, function (p) {
    p.r(0, 2, 40, 9, C.ink); p.r(1, 3, 38, 7, ST[0]); p.r(1, 3, 38, 1, ST[1]);
    p.r(3, 5, 34, 4, '#2a3236'); p.r(4, 6, 32, 2, '#4a585c'); p.r(0, 0, 3, 14, C.ink); p.r(37, 0, 3, 14, C.ink);
  }, {
    light: { dx: 20, dy: 8, r: 64, col: '#cfeaff', glow: '#3a5a7a', flick: 1.0 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), on = Math.sin(t * 23 + x) + Math.sin(t * 9.1 + y) > -0.6;
      if (on) { p.r(4, 6, 32, 2, '#f4fcff'); p.r(3, 5, 34, 4, 'rgba(200,236,255,0.5)'); }
    }
  });
  /* tubo fundido que cuelga de un lado y suelta chispas */
  reg('tubeDead', 40, 20, 0, 0, function (p) {
    p.r(0, 2, 40, 7, C.ink); p.r(1, 3, 38, 5, ST[2]); p.r(1, 3, 38, 1, ST[0]);
    p.line(5, 9, 33, 16, C.ink, 3); p.line(5, 9, 33, 16, '#3a4650', 1); p.r(1, 8, 4, 3, C.ink); p.r(32, 15, 5, 3, C.ink);
    p.p(20, 13, '#6a727c'); p.p(21, 13, '#aab2bc');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      if (Math.sin(t * 6 + x) + Math.sin(t * 2.1) > 1.5) { p.p(33, 18, '#fff'); p.p(31, 20, '#ffe08a'); p.p(35, 20, '#ffe08a'); }
    }
  });

  /* ====================== PASILLO Y SEGURIDAD ====================== */
  /* postes con cinta de precaución amarilla */
  reg('tapePost', 40, 26, 2, 1, function (p) {
    p.ell(20, 24, 18, 2.2, 'rgba(0,0,0,0.28)');
    [3, 33].forEach(function (x) {
      p.r(x, 20, 5, 4, C.ink); p.r(x + 1, 21, 3, 2, BK[1]); p.r(x + 1, 2, 3, 19, C.ink); p.r(x + 2, 3, 1, 17, YL[0]); p.r(x + 2, 3, 1, 3, RD[0]);
    });
    p.line(6, 8, 34, 10, C.ink, 4);
    for (var i = 0; i < 9; i++) p.line(6 + i * 3.4, 8 + i * 0.25, 8 + i * 3.4, 8.5 + i * 0.25, i % 2 ? C.ink : YL[0], 3);
    p.line(6, 14, 34, 17, C.ink, 3);
    for (i = 0; i < 9; i++) p.line(6 + i * 3.4, 14 + i * 0.37, 8 + i * 3.4, 14.5 + i * 0.37, i % 2 ? C.ink : YL[0], 2);
  });

  /* ====================== SALA DE GUARDIA ====================== */
  /* escritorio del guardia con monitor, radio y un termo */
  reg('guardDesk', 64, 46, 4, 1, function (p) {
    p.ell(32, 44, 30, 2.6, 'rgba(0,0,0,0.28)');
    sb(p, 0, 16, 64, 28, WD[0], WD[1], WD[2]);
    p.r(2, 18, 60, 10, '#9a6a3c'); p.r(2, 18, 60, 1, '#d8a868'); p.r(2, 28, 60, 1, WD[2]);
    p.r(24, 30, 16, 13, '#1c120a'); [4, 44].forEach(function (x) { p.r(x, 31, 16, 5, '#7c5230'); p.r(x, 31, 16, 1, '#b87a42'); p.r(x + 6, 33, 4, 1, '#d8c890'); p.r(x, 37, 16, 5, '#7c5230'); p.r(x + 6, 39, 4, 1, '#d8c890'); });
    p.r(6, 3, 22, 15, C.ink); p.r(7, 4, 20, 12, '#3a4650'); p.r(9, 6, 16, 8, '#0a1a14'); p.dith(9, 6, 16, 8, '#10281c', 6); p.r(14, 18, 6, 2, C.ink);    // monitor
    p.r(34, 8, 12, 11, C.ink); p.r(35, 9, 10, 9, '#3a3e48'); p.circ(40, 13, 3, '#14181e'); p.r(44, 4, 1, 5, C.ink); p.r(36, 10, 3, 1, '#8a8aa0');       // radio
    p.r(50, 8, 7, 11, C.ink); p.r(51, 9, 5, 9, '#c8d0d4'); p.r(51, 9, 5, 1, '#fff'); p.r(51, 8, 5, 3, RD[0]);                                             // termo
    p.r(58, 12, 4, 6, '#f6f2e0'); p.r(58, 12, 4, 1, '#fff');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i;
      for (i = 0; i < 4; i++) p.r(10, 7 + i * 2, 6 + ((t * 3 + i * 5) % 8 | 0), 1, '#3fd479');
      if (Math.sin(t * 5) > 0.2) p.p(11, 7 + (((t * 2) | 0) % 4) * 2, '#c8ffd8');
    }
  });

  /* catre plegable con cobija, almohada y zapatos */
  reg('cot', 48, 30, 3, 1, function (p) {
    p.ell(24, 28, 22, 2.4, 'rgba(0,0,0,0.28)');
    p.r(2, 22, 4, 6, C.ink); p.r(42, 22, 4, 6, C.ink); p.r(3, 22, 1, 5, ST[1]);
    sb(p, 0, 12, 48, 12, '#4a5a3a', '#7a9060', '#22301a');
    p.r(3, 14, 42, 8, '#5a6a46'); p.r(3, 14, 42, 1, '#8aa070'); for (var i = 0; i < 5; i++) p.r(6 + i * 8, 16, 5, 4, '#4a5a3a');
    p.r(3, 3, 14, 11, C.ink); p.r(4, 4, 12, 9, '#e8e4d4'); p.r(4, 4, 12, 1, '#fff'); p.r(6, 8, 8, 1, '#c8c4b4');
    p.r(18, 4, 28, 10, C.ink); p.r(19, 5, 26, 8, '#8a4a2c'); p.r(19, 5, 26, 1, '#b86a42'); p.r(19, 8, 26, 1, '#5a2c18'); p.r(30, 5, 1, 8, '#5a2c18');
  });

  /* ====================== DECORACIÓN DE PARED ====================== */
  /* cartel de normas de seguridad con cuatro pictogramas */
  dec('safetyBoard', 40, 32, function (p) {
    sb(p, 0, 0, 40, 32, '#2a5a3a', '#4a9a64', '#10281a');
    p.txt('SEGURIDAD', 3, 3, '#f6f2e0', 1);
    [[4, '#e8b830'], [14, '#b3182b'], [24, '#2a5aa0']].forEach(function (c, i) {
      p.r(c[0], 11, 10, 10, C.ink); p.r(c[0] + 1, 12, 8, 8, c[1]);
      if (i === 0) { p.poly([c[0] + 5, 13, c[0] + 8, 19, c[0] + 2, 19], C.ink); p.r(c[0] + 5, 15, 1, 2, c[1]); }
      else if (i === 1) { p.line(c[0] + 2, 14, c[0] + 8, 18, '#fff', 1); p.line(c[0] + 2, 18, c[0] + 8, 14, '#fff', 1); }
      else { p.circ(c[0] + 5, 14, 1.6, '#fff'); p.r(c[0] + 4, 16, 3, 3, '#fff'); }
    });
    p.r(34, 11, 4, 10, '#f6f2e0'); p.r(3, 24, 34, 1, '#f6f2e0'); p.r(3, 27, 28, 1, '#f6f2e0');
  });
  /* aviso de alto voltaje */
  dec('voltWarn', 22, 22, function (p) {
    p.poly([11, 1, 21, 20, 1, 20], C.ink); p.poly([11, 4, 18, 18, 4, 18], YL[0]); p.poly([11, 4, 14, 8, 8, 8], YL[1]);
    p.poly([12, 7, 8, 13, 11, 13, 10, 17, 15, 11, 12, 11], C.ink);
  });
  /* tres rasguños de garra en la pared (huella de Bonnie) */
  dec('earsScratch', 22, 28, function (p) {
    [4, 10, 16].forEach(function (x, i) {
      p.line(x, 2, x + 3 - i, 24, '#1a1228', 2); p.line(x + 1, 3, x + 3 - i, 22, PR[1], 1);
      p.p(x + 2, 6, '#e8d8ff');
    });
  });
  /* plano de evacuación */
  dec('evacMap', 36, 28, function (p) {
    sb(p, 0, 0, 36, 28, '#f2ecd0', '#fffaf0', '#a89c78');
    p.r(3, 3, 30, 14, '#e4dcba'); p.r(5, 5, 14, 3, '#7a8aa8'); p.r(5, 5, 14, 1, '#aab8d0'); p.r(5, 5, 3, 11, '#7a8aa8'); p.r(5, 13, 22, 3, '#7a8aa8'); p.r(24, 5, 6, 8, '#7a8aa8');
    p.poly([9, 14, 12, 12, 12, 16], RD[0]); p.circ(27, 8, 1.4, RD[0]); p.r(3, 19, 30, 1, '#a89c78');
    p.txt('SALIDA', 3, 21, RD[0], 1); p.r(30, 21, 3, 3, '#2e8a3a');
  });
  /* letrero de baños: v por el texto */
  dec('restroomSign', 28, 16, function (p, o) {
    sb(p, 0, 0, 28, 16, '#1c3a6a', '#4a78b8', '#0a1a38');
    p.circ(6, 5, 1.6, '#fff'); p.r(4, 7, 5, 6, '#fff'); p.r(4, 12, 2, 3, '#fff'); p.r(7, 12, 2, 3, '#fff');
    p.r(11, 2, 1, 12, '#fff'); p.txt(o.text || 'WC', 14, 5, '#fff', 1);
  });
  /* espejo roto que ya no refleja nada */
  dec('brokenMirror', 22, 32, function (p) {
    p.r(0, 0, 22, 32, C.ink); p.r(1, 1, 20, 30, ST[2]); p.r(3, 3, 16, 26, '#98aab6'); p.r(3, 3, 16, 1, '#e8f0f4'); p.dith(3, 3, 16, 26, '#b4c4ce', 4);
    p.poly([3, 3, 11, 3, 3, 18], '#c8d8e2'); p.poly([19, 29, 11, 29, 19, 16], '#7a8c98');
    p.line(11, 16, 4, 6, C.ink, 1); p.line(11, 16, 18, 8, C.ink, 1); p.line(11, 16, 6, 27, C.ink, 1); p.line(11, 16, 17, 26, C.ink, 1); p.line(11, 16, 11, 3, C.ink, 1);
    p.circ(11, 16, 2, '#3a4650'); p.p(7, 8, '#fff'); p.p(14, 20, '#fff');
  });
  /* manómetros de la sala de máquinas */
  dec('gaugeWall', 44, 22, function (p) {
    p.r(0, 0, 44, 22, C.ink); p.r(1, 1, 42, 20, '#3a4046'); p.r(1, 1, 42, 1, ST[0]);
    [8, 22, 36].forEach(function (x, i) {
      p.circ(x, 11, 6.4, C.ink); p.circ(x, 11, 5.4, '#f6f2e0'); p.r(x - 5, 11, 2, 1, '#2e8a3a'); p.r(x + 3, 11, 2, 1, RD[0]);
      p.line(x, 11, x + (i - 1) * 3, 7 - i, RD[0], 1); p.p(x, 11, C.ink);
    });
  });
  /* riel de ganchos con abrigos y mochilas olvidados */
  dec('hookRail', 52, 30, function (p) {
    var i, cols = ['#b3182b', '#2a5aa0', '#2e8a3a', '#8a5a30'];
    p.r(0, 2, 52, 4, C.ink); p.r(1, 3, 50, 2, WD[1]); p.r(1, 3, 50, 1, '#e8b878');
    for (i = 0; i < 4; i++) {
      p.r(5 + i * 12, 6, 2, 3, C.ink);
      if (i % 2) { p.poly([2 + i * 12, 9, 11 + i * 12, 9, 12 + i * 12, 27, 1 + i * 12, 27], C.ink); p.poly([3 + i * 12, 10, 10 + i * 12, 10, 11 + i * 12, 26, 2 + i * 12, 26], cols[i]); p.r(3 + i * 12, 10, 2, 16, 'rgba(255,255,255,0.15)'); }
      else { p.r(1 + i * 12, 9, 10, 15, C.ink); p.r(2 + i * 12, 10, 8, 13, cols[i]); p.r(2 + i * 12, 10, 8, 1, 'rgba(255,255,255,0.6)'); p.r(3 + i * 12, 16, 6, 4, 'rgba(0,0,0,0.3)'); }
    }
  });
  /* tubería con rueda de válvula roja */
  dec('valveWheel', 36, 26, function (p) {
    p.r(0, 14, 36, 6, C.ink); p.r(0, 15, 36, 4, '#a04a1c'); p.r(0, 15, 36, 1, '#e08a3c'); p.r(0, 18, 36, 1, '#5a2408');
    p.r(16, 8, 4, 8, C.ink); p.r(17, 8, 2, 8, ST[0]);
    p.circ(18, 7, 6, C.ink); p.circ(18, 7, 5, RD[0]); p.circ(18, 7, 3, C.ink); p.circ(18, 7, 2, '#3a0a10'); p.r(13, 6, 10, 2, RD[0]); p.r(17, 2, 2, 10, RD[0]);
    p.r(14, 20, 8, 3, C.ink); p.r(15, 20, 6, 2, '#8a929c');
  });

  /* ====================== DECORACIÓN DE PISO ====================== */
  /* letras pintadas en el piso, en amarillo de seguridad */
  dec('paintText', 64, 8, function (p, o) { p.txt(o.text || '', 0, 1, '#e8cc4c', 1); }, { floor: true });
  /* huellas moradas de Bonnie (dir: r l u d) */
  dec('bunnyScuff', 22, 14, function (p, o) {
    var d = o.dir || 'r', v = d === 'r' || d === 'l' ? [[3, 3], [13, 8]] : [[4, 2], [9, 9]];
    v.forEach(function (q) { p.ell(q[0] + 4, q[1] + 3, 4, 2.4, PR[2]); p.ell(q[0] + 4, q[1] + 3, 3, 1.6, PR[0]); p.p(q[0] + 2, q[1] + 1, PR[1]); });
  }, { floor: true });
  /* grieta grande en el piso */
  dec('floorCrack', 44, 22, function (p) {
    p.line(1, 18, 10, 12, '#14161a', 2); p.line(10, 12, 18, 14, '#14161a', 1); p.line(18, 14, 26, 6, '#14161a', 2); p.line(26, 6, 33, 8, '#14161a', 1);
    p.line(26, 6, 28, 1, '#14161a', 1); p.line(10, 12, 8, 20, '#14161a', 1); p.line(33, 8, 42, 3, '#14161a', 1);
    p.line(2, 17, 10, 11, 'rgba(255,255,255,0.12)', 1);
  }, { floor: true });
  /* brillo de piso recién mojado */
  dec('wetSheen', 60, 22, function (p) {
    p.ell(30, 11, 29, 10, p.pat('#5a8ab0', 6)); p.ell(28, 10, 20, 6, p.pat('#a4d0f0', 7)); p.line(10, 8, 24, 5, 'rgba(255,255,255,0.5)', 1); p.line(36, 14, 50, 11, 'rgba(255,255,255,0.35)', 1);
  }, { floor: true });
})(window);
