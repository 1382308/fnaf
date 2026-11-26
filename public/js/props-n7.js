/* props-n7.js — Noche 7 (Golden Freddy): la oficina de la Noche 1, ahora rota y a oscuras.
   Pósteres «IT'S ME», luz roja de emergencia, ventilación, peluches caídos y cables que chispean.
   Mismo estilo que props-a/b/c/n2..n6: vista 3/4, contorno de tinta, luz arriba-izquierda y sombra abajo-derecha. */
(function (G) {
  'use strict';
  var C = PX.C, A = G.PROPS_API, reg = A.reg, dec = A.dec, sb = A.sb;
  var SL = ['#3a424c', '#6a727c', '#1a1e24'];       // acero oscuro: base, luz, sombra
  var GD = ['#d8a410', '#f4cc3c', '#a87800'];       // dorado de Golden Freddy
  var WD = ['#6a4223', '#a06c3c', '#2a180c'];       // madera

  /* ====================== TAREAS ====================== */
  /* póster «IT'S ME» en un atril (TAREA, paso 1) */
  reg('meStandee', 32, 46, 2, 1, function (p) {
    p.ell(16, 43, 15, 2.4, 'rgba(0,0,0,0.35)');
    p.r(5, 36, 3, 9, C.ink); p.r(24, 36, 3, 9, C.ink); p.r(6, 36, 1, 8, SL[1]); p.r(25, 36, 1, 8, SL[1]);
    sb(p, 0, 0, 32, 38, '#3a0c14', '#7a2030', '#14040a');
    p.circ(9, 8, 3.5, C.ink); p.circ(23, 8, 3.5, C.ink); p.circ(9, 8, 2.4, GD[2]); p.circ(23, 8, 2.4, GD[2]);
    p.circ(16, 15, 9.5, C.ink); p.circ(16, 15, 8.5, GD[0]); p.ell(13, 11, 4, 2, p.pat(GD[1], 8));
    p.ell(12, 13, 2.6, 2.6, C.ink); p.ell(20, 13, 2.6, 2.6, C.ink);
    p.ell(16, 20, 4.5, 3, GD[1]); p.ell(16, 20, 4.5, 3, p.pat(GD[2], 6)); p.r(14, 19, 4, 2, C.ink);
    p.line(5, 6, 9, 14, '#14040a', 1);
    p.poly([24, 0, 31, 0, 31, 7], '#05030a');
    p.txt('IT\'S ME', 3, 28, '#ffe45c', 1);
    p.r(3, 33, 26, 1, '#6b0f1c');
  }, {
    light: { dx: 16, dy: 14, r: 24, col: '#ff4a4a', flick: 0.6 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), on = Math.sin(t * 2.3) + Math.sin(t * 9.1) > -0.6;
      if (on) { p.p(12, 13, '#ffffff'); p.p(20, 13, '#ffffff'); }
    }
  });

  /* Golden Freddy desplomado contra la pared (TAREA, paso 2) */
  reg('goldenSlump', 32, 40, 2, 1, function (p) {
    p.ell(16, 37, 14, 2.6, 'rgba(0,0,0,0.38)');
    p.bell(6, 34, 4, 2.6, GD[0], C.ink); p.bell(26, 34, 4, 2.6, GD[0], C.ink);               // pies
    p.bell(16, 27, 10, 8.5, GD[0], C.ink); p.ell(14, 25, 7, 5, p.pat(GD[1], 7)); p.ell(16, 30, 6, 4, GD[2]);   // torso
    p.bell(5, 29, 2.6, 6, GD[0], C.ink); p.bell(27, 29, 2.6, 6, GD[0], C.ink);               // brazos caídos
    p.r(11, 23, 10, 3, C.ink); p.r(12, 24, 8, 1, '#3a1a50'); p.r(15, 23, 2, 3, '#6a2cc0');   // corbatín
    p.r(12, 27, 8, 7, C.ink); p.r(13, 28, 6, 5, '#f6f0dc'); p.r(14, 29, 4, 1, '#8f87b5'); p.r(14, 31, 3, 1, '#8f87b5');   // papel
    SPR.head('golden', p.at(p.ox + 5, p.oy + 1, 0.45), { eye: '#ffffff', angry: false });
  }, {
    light: { dx: 16, dy: 14, r: 34, col: '#ffe9a0', flick: 0.4 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), g = 0.5 + Math.sin(t * 1.7) * 0.5;
      p.r(11, 11, 4, 3, C.ink); p.r(18, 11, 4, 3, C.ink);
      if (Math.sin(t * 6.1) + Math.sin(t * 2.3) > -0.4) { p.p(13, 12, '#ffffff'); p.p(20, 12, '#ffffff'); }
      p.p(3 + ((t * 7) % 26 | 0), 30 - ((t * 5) % 22 | 0), 'rgba(255,240,160,' + (0.4 + g * 0.5).toFixed(2) + ')');
    }
  });

  /* monitor roto con estática (TAREA, paso 3). Va sobre el escritorio. */
  reg('staticCrt', 18, 22, 0, 0, function (p) {
    p.r(0, 0, 18, 18, C.ink); p.r(1, 1, 16, 16, '#8a8880'); p.r(1, 1, 16, 1, '#b8b6ae'); p.r(1, 16, 16, 1, '#4a4842');
    p.r(3, 3, 12, 11, '#0a0a10');
    p.line(4, 4, 9, 9, '#8a8880', 1); p.line(9, 9, 6, 13, '#8a8880', 1); p.line(9, 9, 14, 11, '#8a8880', 1);
    p.r(4, 17, 10, 3, '#6a6862'); p.r(2, 19, 14, 2, '#4a4842'); p.p(14, 15, '#ff3b4a');
  }, {
    light: { dx: 9, dy: 10, r: 26, col: '#9ac0ff', flick: 0.8 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i;
      for (i = 0; i < 6; i++) {
        var w = 2 + ((Math.random() * 8) | 0);
        p.r(3 + ((Math.random() * (12 - w)) | 0), 3 + ((Math.random() * 11) | 0), w, 1, Math.random() > 0.5 ? '#c8d4e8' : '#5a6a84');
      }
      p.r(3, 3 + ((t * 10) % 11 | 0), 12, 1, 'rgba(255,255,255,0.3)');
      p.line(4, 4, 9, 9, '#05030a', 1); p.line(9, 9, 6, 13, '#05030a', 1);
    }
  });

  /* ventilador industrial de la sala de ventilación (TAREA, paso 5) */
  reg('ventFan', 48, 48, 3, 1, function (p) {
    var i;
    p.ell(24, 45, 22, 2.6, 'rgba(0,0,0,0.35)');
    p.r(2, 42, 8, 4, C.ink); p.r(38, 42, 8, 4, C.ink);
    sb(p, 0, 0, 48, 44, SL[0], SL[1], SL[2]);
    p.circ(24, 20, 18, C.ink); p.circ(24, 20, 17, '#0a0c10');
    for (i = 0; i < 4; i++) p.p(3 + (i % 2) * 41, 3 + ((i / 2) | 0) * 37, SL[1]);
    p.r(1, 38, 46, 1, SL[2]);
    p.txt('VENT 2', 15, 38, '#b3182b', 1);
  }, {
    light: { dx: 24, dy: 20, r: 34, col: '#9ac0ff', flick: 0.5 },
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), i, sp = st && st.done === 'done' ? 3 : 11;
      p.circ(24, 20, 16, '#0a0c10');
      for (i = 0; i < 4; i++) {
        var a = t * sp + i * 1.5708;
        p.poly([24, 20, 24 + Math.cos(a - 0.35) * 15, 20 + Math.sin(a - 0.35) * 15, 24 + Math.cos(a + 0.35) * 15, 20 + Math.sin(a + 0.35) * 15], SL[1]);
        p.line(24, 20, 24 + Math.cos(a) * 15, 20 + Math.sin(a) * 15, SL[2], 1);
      }
      p.circ(24, 20, 3, C.ink); p.circ(24, 20, 2, SL[1]);
      p.ell(24, 20, 16, 16, p.pat('#05030a', 3));
      for (i = -12; i <= 12; i += 6) p.r(24 + i, 4, 1, 34, 'rgba(5,3,10,0.9)');        // rejilla delantera
      for (i = 8; i <= 34; i += 8) p.r(8, i, 32, 1, 'rgba(5,3,10,0.9)');
    }
  });

  /* panel final de la oficina: chispea (TAREA final, paso 6). Cuelga de la pared. */
  reg('finalPanel', 32, 32, 0, 0, function (p) {
    sb(p, 0, 0, 32, 32, '#3a4252', '#6a7a94', '#1a2030');
    p.r(3, 3, 26, 11, C.ink); p.r(4, 4, 24, 9, '#2a1406'); p.txt('X1 X2', 6, 6, '#ffb050', 1); p.txt('?', 24, 6, '#ffb050', 1);
    p.r(5, 10, 18, 1, '#6a3a10');
    p.r(4, 17, 24, 11, '#222b3c');
    [[6, 19], [14, 19], [22, 19]].forEach(function (b) { p.r(b[0], b[1], 5, 7, C.ink); p.r(b[0] + 1, b[1] + 1, 3, 5, '#53627e'); });
    p.r(4, 29, 24, 1, '#05030a');
  }, {
    light: { dx: 16, dy: 14, r: 30, col: '#ffb050', flick: 0.7 },
    anim: function (ctx, x, y, t, inst, st) {
      var p = new PX.Pen(ctx, 1, x, y), ok = st && st.done === 'done';
      p.r(7, 20, 3, 2, ok ? '#3fd479' : (Math.sin(t * 5) > 0 ? '#ff3b4a' : '#6b0f1c'));
      p.r(15, 20, 3, 2, ok ? '#3fd479' : (Math.sin(t * 3.7) > 0 ? '#ff3b4a' : '#6b0f1c'));
      p.r(23, 20, 3, 2, ok ? '#3fd479' : (Math.sin(t * 4.3) > 0 ? '#ff3b4a' : '#6b0f1c'));
      if (!ok && Math.sin(t * 13) * Math.sin(t * 2.1) > 0.5) { p.p(29, 14 + ((t * 20) % 8 | 0), '#fff6b0'); p.p(30, 16, '#ffe45c'); }
    }
  });

  /* ====================== AMBIENTE ====================== */
  /* baliza roja de emergencia que pulsa (cuelga de la pared) */
  reg('alarmLamp', 12, 16, 0, 0, function (p) {
    p.r(2, 10, 8, 5, C.ink); p.r(3, 11, 6, 3, SL[0]); p.r(3, 11, 6, 1, SL[1]);
    p.ell(6, 7, 5, 5, C.ink); p.ell(6, 7, 4, 4, '#6b0f1c');
  }, {
    light: { dx: 6, dy: 8, r: 36, col: '#ff2a3a', glow: '#ff2a3a', flick: 0.45 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), g = 0.5 + Math.sin(t * 4.2) * 0.5;
      p.ell(6, 7, 4, 4, 'rgba(255,' + Math.round(40 + g * 50) + ',60,' + (0.55 + g * 0.45).toFixed(2) + ')');
      p.r(4, 5, 2, 2, 'rgba(255,230,230,' + (0.3 + g * 0.6).toFixed(2) + ')');
    }
  });

  /* caja eléctrica con un cable colgando que chispea */
  reg('sparkBox', 16, 22, 0, 0, function (p) {
    sb(p, 2, 0, 12, 12, SL[0], SL[1], SL[2]);
    p.r(4, 2, 8, 6, '#14181e'); p.r(5, 3, 2, 1, '#ff3b4a'); p.r(9, 9, 2, 1, '#ffb050');
    p.line(8, 12, 6, 16, C.ink, 1); p.line(6, 16, 8, 20, C.ink, 1);
  }, {
    light: { dx: 8, dy: 20, r: 22, col: '#ffe08a', flick: 1.2 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      if (Math.sin(t * 17) * Math.sin(t * 3.1) > 0.35) {
        p.p(8, 20, '#ffffff'); p.p(5 + ((t * 31) % 5 | 0), 19 + ((t * 13) % 3 | 0), '#ffe45c'); p.p(10, 21, '#fff6b0'); p.p(6, 21, '#ffb050');
      }
    }
  });

  /* cámara de seguridad en la pared, con luz roja que parpadea */
  reg('secCam', 18, 16, 0, 0, function (p) {
    p.r(0, 0, 6, 5, C.ink); p.r(1, 1, 4, 3, SL[1]);
    p.r(3, 3, 14, 9, C.ink); p.r(4, 4, 12, 7, SL[0]); p.r(4, 4, 12, 1, SL[1]); p.r(4, 10, 12, 1, SL[2]);
    p.r(2, 5, 3, 5, C.ink); p.r(3, 6, 1, 3, '#0a0c10');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      p.r(12, 6, 2, 3, Math.sin(t * 7) > 0 ? '#ff3b4a' : '#3a0c14');
      p.p(3 + ((Math.sin(t * 0.8) + 1) | 0), 7, '#9ac0ff');
    }
  });

  /* ducto grande de ventilación, de pie */
  reg('ductRun', 64, 40, 4, 1, function (p) {
    var i;
    p.ell(32, 37, 30, 2.6, 'rgba(0,0,0,0.35)');
    sb(p, 0, 4, 64, 32, SL[0], SL[1], SL[2]);
    for (i = 8; i < 62; i += 14) { p.r(i, 5, 2, 30, SL[2]); p.r(i + 2, 5, 1, 30, SL[1]); }
    p.r(4, 14, 24, 14, C.ink); for (i = 0; i < 5; i++) p.r(5, 15 + i * 3, 22, 1, '#3a424c');                 // rejilla
    p.r(34, 20, 22, 8, '#5a2a12'); p.dith(34, 20, 22, 8, '#2a1206', 5);                                     // óxido
    for (i = 0; i < 4; i++) { p.p(3, 7 + i * 7, SL[1]); p.p(60, 7 + i * 7, SL[1]); }
    p.r(30, 36, 4, 3, C.ink); p.r(52, 36, 4, 3, C.ink);
  });

  /* unidad de aire con ventilador que gira */
  reg('blowerUnit', 32, 36, 2, 1, function (p) {
    p.ell(16, 33, 14, 2.4, 'rgba(0,0,0,0.35)');
    sb(p, 0, 2, 32, 30, SL[0], SL[1], SL[2]);
    p.circ(16, 16, 10.5, C.ink); p.circ(16, 16, 9.5, '#0a0c10');
    p.r(2, 27, 28, 1, SL[2]); p.p(3, 4, SL[1]); p.p(28, 4, SL[1]);
    p.r(24, 28, 4, 2, '#b3182b');
  }, {
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), i;
      for (i = 0; i < 3; i++) { var a = t * 9 + i * 2.094; p.line(16, 16, 16 + Math.cos(a) * 9, 16 + Math.sin(a) * 9, SL[1], 2); }
      p.circ(16, 16, 2, C.ink);
    }
  });

  /* pared de televisores muertos, con estática */
  reg('tvWall', 48, 44, 3, 1, function (p) {
    p.ell(24, 41, 22, 2.6, 'rgba(0,0,0,0.35)');
    sb(p, 0, 0, 48, 40, SL[0], SL[1], SL[2]);
    p.r(3, 36, 42, 3, C.ink);
    for (var j = 0; j < 2; j++) for (var i = 0; i < 3; i++) {
      var x = 3 + i * 14, y = 3 + j * 16;
      p.r(x, y, 14, 14, C.ink); p.r(x + 1, y + 1, 12, 12, '#6a6862'); p.r(x + 2, y + 2, 10, 8, '#0a0a10'); p.p(x + 11, y + 11, '#ff3b4a');
    }
  }, {
    light: { dx: 24, dy: 20, r: 30, col: '#9ab0d0', flick: 0.9 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), k, n = Math.floor(t * 9);
      for (var j = 0; j < 2; j++) for (var i = 0; i < 3; i++) {
        var sx = 5 + i * 14, sy = 5 + j * 16;
        for (k = 0; k < 4; k++) {
          var h = ((n * 7 + i * 13 + j * 29 + k * 11) % 9);
          p.r(sx + (h % 4), sy + k * 2, 3 + (h % 5), 1, (h + k) % 2 ? '#c8d4e8' : '#4a5a74');
        }
      }
      p.r(5 + 14, 5 + 16, 3, 1, Math.sin(t * 2) > 0 ? '#ffffff' : '#05030a'); p.r(9 + 14, 5 + 16, 3, 1, Math.sin(t * 2) > 0 ? '#ffffff' : '#05030a');
    }
  });

  /* silla de oficina caída */
  reg('tippedChair', 16, 16, 1, 1, function (p) {
    p.ell(8, 14, 7, 1.8, 'rgba(0,0,0,0.35)');
    p.r(0, 3, 6, 11, C.ink); p.r(1, 4, 4, 9, '#3a3f58'); p.r(1, 4, 1, 9, '#5a6288');
    p.r(5, 6, 8, 5, C.ink); p.r(6, 7, 6, 3, '#5a6288'); p.r(6, 7, 6, 1, '#8a92b8');
    p.r(12, 3, 2, 12, C.ink); p.r(12, 4, 1, 10, '#6a727c');
    p.r(11, 2, 4, 3, C.ink); p.r(11, 12, 4, 3, C.ink); p.r(7, 11, 1, 3, '#6a727c');
  });

  /* estante con peluches polvorientos */
  reg('plushShelf', 48, 44, 3, 1, function (p) {
    var i, cols = ['#9a4c22', '#6e62e0', '#f2c21c', '#b33a24', '#d8d0e8'];
    p.ell(24, 41, 22, 2.6, 'rgba(0,0,0,0.35)');
    sb(p, 0, 0, 48, 40, WD[0], WD[1], WD[2]);
    p.r(2, 2, 44, 17, '#14100c'); p.r(2, 22, 44, 14, '#14100c'); p.r(2, 19, 44, 3, WD[1]); p.r(2, 36, 44, 1, WD[2]);
    for (i = 0; i < 5; i++) {
      var x = 7 + i * 8;
      p.circ(x, 14, 3.2, C.ink); p.circ(x, 14, 2.4, cols[i]); p.circ(x - 2, 11, 1.4, cols[i]); p.circ(x + 2, 11, 1.4, cols[i]); p.p(x - 1, 14, C.ink); p.p(x + 1, 14, C.ink);
    }
    for (i = 0; i < 4; i++) { p.r(5 + i * 10, 29, 7, 7, C.ink); p.r(6 + i * 10, 30, 5, 5, cols[(i + 2) % 5]); p.p(7 + i * 10, 32, C.ink); p.p(9 + i * 10, 32, C.ink); }
    p.dith(2, 2, 44, 34, '#05030a', 3);
  });

  /* mesa de fiesta arruinada, con un pastel aplastado */
  reg('wreckTable', 48, 36, 3, 1, function (p) {
    var i;
    p.ell(24, 33, 22, 2.4, 'rgba(0,0,0,0.35)');
    p.r(3, 16, 4, 17, C.ink); p.r(41, 16, 4, 17, C.ink);
    sb(p, 0, 12, 48, 12, '#8a2f68', '#c4407e', '#4a1236');
    p.r(2, 24, 44, 8, '#6b2150'); p.r(2, 24, 44, 1, '#2a0a20');
    p.poly([14, 12, 34, 12, 32, 5, 16, 5], C.ink); p.poly([15, 11, 33, 11, 31, 6, 17, 6], '#e8d8a8');
    p.r(16, 6, 16, 3, '#ff5fd2'); p.r(20, 3, 3, 4, '#b3182b'); p.r(26, 4, 3, 4, '#4de0ff'); p.p(21, 2, '#ffe45c');
    p.poly([36, 12, 42, 12, 39, 5], '#ffe45c'); p.poly([4, 12, 9, 12, 6.5, 6], '#4de0ff');
    for (i = 0; i < 5; i++) p.p(10 + i * 7, 20 + (i % 2), ['#ff5fd2', '#ffe45c', '#4de0ff'][i % 3]);
  }, {
    light: { dx: 21, dy: 4, r: 20, col: '#ffb050', flick: 1.4 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y), f = Math.sin(t * 12) > 0 ? 3 : 2;
      p.r(21, 0, 1, f, '#ffe45c'); p.p(21, 1, '#ff9a2e');
    }
  });

  /* traje vacío de animatrónico sobre un soporte: sin cabeza, con el endoesqueleto a la vista */
  reg('springSuit', 32, 44, 2, 1, function (p) {
    var i;
    p.ell(16, 41, 14, 2.4, 'rgba(0,0,0,0.35)');
    p.r(5, 36, 22, 5, C.ink); p.r(6, 37, 20, 3, SL[0]); p.r(6, 37, 20, 1, SL[1]);
    p.r(15, 20, 2, 17, C.ink); p.r(15, 20, 1, 17, SL[1]);
    p.bell(16, 18, 10, 11, GD[0], C.ink); p.ell(13, 15, 6, 4, p.pat(GD[1], 7));
    p.r(11, 8, 10, 5, C.ink); p.r(12, 9, 8, 3, '#0a0c10');
    for (i = 0; i < 3; i++) p.r(12 + i * 3, 10, 2, 2, SL[1]);
    p.line(8, 22, 5, 33, C.ink, 3); p.line(8, 22, 5, 33, GD[0], 1); p.line(24, 22, 27, 33, C.ink, 3); p.line(24, 22, 27, 33, GD[0], 1);
    p.r(12, 22, 8, 3, C.ink); p.r(13, 23, 6, 1, '#6a2cc0');
    p.r(12, 28, 8, 5, C.ink); p.r(13, 29, 6, 3, '#0a0c10'); p.p(15, 30, '#ff3b4a');
  });

  /* lámpara de pie doblada que parpadea */
  reg('lampBroken', 14, 34, 1, 1, function (p) {
    p.ell(7, 31, 6, 1.8, 'rgba(0,0,0,0.35)');
    p.r(3, 29, 8, 3, C.ink); p.r(4, 29, 6, 1, SL[1]);
    p.r(6, 12, 2, 18, C.ink); p.r(6, 12, 1, 18, SL[1]);
    p.line(7, 12, 11, 8, C.ink, 2);
    p.poly([6, 5, 14, 5, 12, 11, 8, 11], C.ink); p.poly([7, 6, 13, 6, 11, 10, 9, 10], '#5a4a2a');
  }, {
    light: { dx: 10, dy: 10, r: 36, col: '#ffd0a0', flick: 1.6 },
    anim: function (ctx, x, y, t) {
      var p = new PX.Pen(ctx, 1, x, y);
      if (Math.sin(t * 19) + Math.sin(t * 4.7) > -0.5) { p.r(8, 9, 4, 2, '#fff0c0'); p.r(7, 6, 6, 1, '#ffd070'); }
    }
  });

  /* ====================== DECORACIÓN DE PARED ====================== */
  /* póster grande «IT'S ME» */
  dec('itsMeWall', 34, 30, function (p) {
    sb(p, 0, 0, 34, 30, '#2a0a10', '#7a2030', '#0a0204');
    p.circ(9, 7, 3, C.ink); p.circ(25, 7, 3, C.ink); p.circ(9, 7, 2, GD[2]); p.circ(25, 7, 2, GD[2]);
    p.circ(17, 13, 8.5, C.ink); p.circ(17, 13, 7.5, GD[0]); p.ell(14, 9, 3.6, 2, p.pat(GD[1], 8));
    p.ell(13, 11, 2.4, 2.4, C.ink); p.ell(21, 11, 2.4, 2.4, C.ink); p.p(13, 11, C.wh); p.p(21, 11, C.wh);
    p.ell(17, 17, 4, 2.6, GD[1]); p.r(15, 16, 4, 2, C.ink);
    p.txt('IT\'S ME', 4, 22, '#ffe45c', 1);
    p.poly([0, 30, 8, 30, 0, 22], '#05030a');
  });

  /* póster rasgado: solo quedan los ojos y la mitad del texto */
  dec('itsMeTorn', 22, 28, function (p) {
    p.poly([1, 0, 21, 0, 20, 8, 21, 16, 17, 27, 11, 25, 6, 28, 0, 26], '#3a0c14');
    p.poly([1, 0, 21, 0, 20, 8, 21, 16, 17, 27, 11, 25, 6, 28, 0, 26], p.pat('#14040a', 4));
    p.r(3, 4, 6, 4, C.ink); p.r(12, 4, 6, 4, C.ink); p.p(5, 5, C.wh); p.p(14, 5, C.wh);
    p.txt('ME', 8, 15, '#d8a410', 1); p.line(2, 11, 9, 13, '#05030a', 1);
    p.r(4, 21, 8, 1, '#6b0f1c');
  });

  /* arañazos de garra */
  dec('scratchWall', 26, 28, function (p) {
    for (var i = 0; i < 4; i++) { p.line(5 + i * 5, 2, 8 + i * 5, 24, '#14040a', 2); p.line(5 + i * 5, 2, 8 + i * 5, 24, '#7a1a28', 1); }
    p.p(11, 24, '#b3182b'); p.p(21, 25, '#b3182b');
  });

  /* sombra de un oso en la pared */
  dec('shadowFigure', 26, 32, function (p) {
    p.circ(13, 10, 6, p.pat('#05030a', 9)); p.circ(6, 5, 3, p.pat('#05030a', 8)); p.circ(20, 5, 3, p.pat('#05030a', 8));
    p.ell(13, 24, 9, 8, p.pat('#05030a', 8)); p.r(11, 8, 2, 2, '#fff6b0'); p.r(15, 8, 2, 2, '#fff6b0');
  });

  /* pintada en la pared */
  dec('helpScrawl', 36, 14, function (p) {
    p.txt('HELP ME', 4, 2, '#b3182b', 1);
    p.r(5, 8, 1, 4, '#b3182b'); p.r(14, 8, 1, 3, '#b3182b'); p.r(23, 8, 1, 5, '#6b0f1c'); p.r(27, 8, 1, 2, '#b3182b');
  });

  /* cables que cuelgan del techo */
  dec('cableDrape', 24, 30, function (p) {
    p.line(3, 0, 5, 14, C.ink, 2); p.line(5, 14, 3, 24, C.ink, 2); p.line(12, 0, 11, 18, '#2a1a1a', 2);
    p.line(19, 0, 17, 10, C.ink, 2); p.line(17, 10, 20, 26, C.ink, 2);
    p.r(2, 24, 3, 3, '#c4d0e4'); p.r(19, 26, 3, 3, '#c4d0e4'); p.p(11, 18, '#ff3b4a');
  });

  /* gotera con chorreras en la pared */
  dec('ceilLeak', 18, 30, function (p) {
    p.ell(9, 3, 8, 3, p.pat('#05030a', 8));
    p.r(5, 4, 2, 18, p.pat('#05030a', 8)); p.r(11, 4, 2, 24, p.pat('#05030a', 9));
    p.p(6, 24, '#3a4a6a'); p.p(12, 29, '#3a4a6a');
  });

  /* ====================== DECORACIÓN DE PISO ====================== */
  /* mancha de luz roja de emergencia */
  dec('glowRed', 64, 40, function (p) {
    p.ell(32, 20, 30, 18, p.pat('#4a0a14', 2)); p.ell(32, 20, 20, 12, p.pat('#6b0f1c', 3)); p.ell(32, 20, 10, 6, p.pat('#b3182b', 2));
  }, { floor: true });

  /* peluche caído */
  dec('plushFloor', 22, 14, function (p) {
    p.ell(11, 11, 9, 2.4, 'rgba(0,0,0,0.3)');
    p.bell(11, 7, 6, 4, '#9a4c22', C.ink); p.circ(5, 4, 2.6, C.ink); p.circ(5, 4, 1.8, '#9a4c22');
    p.circ(17, 5, 3.4, C.ink); p.circ(17, 5, 2.6, '#9a4c22'); p.p(16, 4, C.ink); p.p(18, 5, C.ink); p.r(9, 6, 3, 1, '#6e62e0');
  }, { floor: true });

  /* vidrios rotos */
  dec('glassShards', 28, 16, function (p) {
    p.poly([2, 10, 6, 6, 9, 11], '#9ac0ff'); p.poly([12, 4, 17, 3, 15, 9], '#c8d8f0'); p.poly([19, 11, 25, 9, 23, 14], '#9ac0ff');
    p.poly([8, 13, 12, 12, 11, 15], '#e8f0ff'); p.p(15, 6, '#fff'); p.p(4, 9, '#fff');
  }, { floor: true });

  /* papeles regados */
  dec('paperScatter', 34, 18, function (p) {
    p.poly([3, 6, 12, 4, 14, 11, 5, 13], '#d8d0b8'); p.poly([16, 8, 25, 6, 28, 12, 18, 14], '#c8c0a8'); p.poly([20, 1, 28, 2, 27, 6, 19, 5], '#e8e0c8');
    p.line(5, 8, 11, 7, '#8f87b5', 1); p.line(18, 10, 25, 9, '#8f87b5', 1); p.line(21, 3, 26, 4, '#8f87b5', 1);
  }, { floor: true });

  /* marca de quemadura */
  dec('burnMark', 26, 16, function (p) {
    p.ell(13, 8, 12, 6, p.pat('#05030a', 10)); p.ell(13, 8, 6, 3, '#05030a'); p.p(9, 5, '#ffb050'); p.p(18, 11, '#ff7a2e');
  }, { floor: true });
})(window);
