/* tiles.js — arte de pisos, paredes y tapas para el mundo en vista 3/4 (baldosas de 16x16).
   Cada función dibuja con un Pen ya posicionado en la esquina superior izquierda de la baldosa. */
(function (G) {
  'use strict';
  var C = PX.C, T = 16;

  function hash(x, y, s) {
    var n = (x * 374761393 + y * 668265263 + (s || 0) * 2147483647) | 0;
    n = (n ^ (n >>> 13)) * 1274126177 | 0;
    n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  }

  /* ---------------- PISOS ---------------- */
  var FLOOR = {
    /* pasillo: baldosas moradas en damero con desgaste */
    H: function (p, tx, ty) {
      var a = (tx + ty) & 1, h = hash(tx, ty, 1), h2 = hash(tx, ty, 2);
      p.r(0, 0, 16, 16, a ? '#2f2951' : '#272143');
      p.r(0, 0, 16, 1, '#1a1533'); p.r(0, 0, 1, 16, '#1a1533');
      p.r(1, 1, 14, 1, a ? '#3b3464' : '#312a52');
      p.r(1, 1, 1, 14, a ? '#383160' : '#2e284d');
      if (h > 0.72) p.r(3 + (h2 * 7 | 0), 5 + (h * 6 | 0), 4 + (h2 * 4 | 0), 1, '#443c72');
      if (h < 0.14) p.dith(2, 3, 11, 9, '#120e26', 5);
      if (h2 > 0.93) { p.p(4, 12, '#50467e'); p.p(5, 12, '#50467e'); }
      if (h2 < 0.05) p.line(3, 3, 11, 12, '#1a1533', 1);          // grieta
      if (ty % 4 === 0) p.r(0, 14, 16, 1, '#5a4a2a');               // franja de seguridad tenue
    },
    /* oficina de seguridad: loseta gris con remaches */
    S: function (p, tx, ty) {
      var h = hash(tx, ty, 3), h2 = hash(tx, ty, 4);
      p.r(0, 0, 16, 16, '#323d4e');
      p.r(0, 0, 16, 1, '#232c3a'); p.r(0, 0, 1, 16, '#232c3a');
      p.r(1, 1, 14, 1, '#40506a');
      p.p(2, 2, '#232c3a'); p.p(13, 2, '#232c3a'); p.p(2, 13, '#232c3a'); p.p(13, 13, '#232c3a');
      if (h > 0.75) p.dith(3, 4, 10, 8, '#1a222e', 4);
      if (h2 > 0.9) { p.r(4, 8, 6, 1, '#5a6a86'); p.r(6, 9, 4, 1, '#26303f'); }
      if (h2 < 0.06) p.line(2, 14, 12, 4, '#1a222e', 1);
    },
    /* sala de fiestas: damero rosa/mostaza con confeti */
    F: function (p, tx, ty) {
      var a = (tx + ty) & 1, h = hash(tx, ty, 5), h2 = hash(tx, ty, 6);
      p.r(0, 0, 16, 16, a ? '#8c2f68' : '#9a7a1e');
      p.r(0, 0, 16, 1, a ? '#6b2150' : '#74590f'); p.r(0, 0, 1, 16, a ? '#6b2150' : '#74590f');
      p.r(1, 1, 14, 1, a ? '#a8407c' : '#b8921f');
      if (h > 0.55) p.r(2 + (h * 11 | 0), 3 + (h2 * 9 | 0), 2, 1, ['#4de0ff', '#ffe45c', '#ff3b4a', '#3fd479'][(h2 * 4) | 0]);
      if (h2 > 0.6) p.r(3 + (h2 * 9 | 0), 9 + (h * 4 | 0), 1, 2, ['#ff5fd2', '#4de0ff', '#ffffff'][(h * 3) | 0]);
      if (h < 0.1) p.dith(3, 4, 9, 8, '#1a0a1a', 4);
    },
    /* oficina del gerente: duela de madera */
    W: function (p, tx, ty) {
      var h = hash(tx, ty, 7), h2 = hash(tx, ty, 8);
      var cs = ['#6e4526', '#64401f', '#74492a', '#5e3a1c'];
      p.r(0, 0, 16, 8, cs[(h * 4) | 0]); p.r(0, 8, 16, 8, cs[(h2 * 4) | 0]);
      p.r(0, 0, 16, 1, '#4a2c16'); p.r(0, 8, 16, 1, '#4a2c16');
      p.r(0, 1, 16, 1, '#8a5a34');  p.r(0, 9, 16, 1, '#8a5a34');
      p.r((h * 14) | 0, 0, 1, 8, '#4a2c16'); p.r((h2 * 14) | 0, 8, 1, 8, '#4a2c16');
      if (h > 0.6) p.r(3 + (h2 * 8 | 0), 4, 4, 1, '#52331a');
      if (h2 > 0.7) { p.p(10, 12, '#4a2c16'); p.p(11, 12, '#4a2c16'); p.p(11, 11, '#4a2c16'); }
    },
    /* cocina: azulejo blanco con juntas */
    K: function (p, tx, ty) {
      var a = (tx + ty) & 1, h = hash(tx, ty, 9);
      p.r(0, 0, 16, 16, a ? '#b2c0d8' : '#a4b3cd');
      p.r(0, 0, 16, 1, '#6a7a98'); p.r(0, 0, 1, 16, '#6a7a98');
      p.r(1, 1, 14, 1, '#d0dbec'); p.r(1, 1, 1, 14, '#c6d2e6');
      p.r(8, 8, 1, 1, '#8c9cb8');
      if (h > 0.8) p.dith(2, 4, 11, 9, '#7a5a3a', 3);           // manchas de grasa
      if (h < 0.08) { p.circ(8, 8, 3, '#5a6a88'); p.circ(8, 8, 1.5, '#2a3446'); } // coladera
      if (h > 0.4 && h < 0.46) p.r(3, 10, 6, 2, '#9a2a24');       // salsa derramada
    },
    /* arcade: alfombra oscura con patrón neón */
    A: function (p, tx, ty) {
      var h = hash(tx, ty, 10), h2 = hash(tx, ty, 11);
      p.r(0, 0, 16, 16, '#1c1742');
      p.r(0, 0, 16, 1, '#141030'); p.r(0, 0, 1, 16, '#141030');
      var cols = ['#ff5fd2', '#4de0ff', '#ffe45c', '#9a90ff'];
      p.r(3, 3, 2, 2, cols[(h * 4) | 0]); p.r(11, 11, 2, 2, cols[(h2 * 4) | 0]);
      p.p(8, 7, cols[(h2 * 4) | 0]); p.p(7, 8, cols[(h2 * 4) | 0]); p.p(9, 8, cols[(h2 * 4) | 0]); p.p(8, 9, cols[(h2 * 4) | 0]);
      if (h > 0.6) p.line(1, 13, 6, 8, '#2c2468', 1);
      p.dith(0, 0, 16, 16, '#0a0820', 3);
    },
    /* almacén: concreto agrietado */
    C: function (p, tx, ty) {
      var h = hash(tx, ty, 12), h2 = hash(tx, ty, 13);
      p.r(0, 0, 16, 16, '#4b505d');
      p.r(0, 0, 16, 1, '#383c47'); p.r(0, 0, 1, 16, '#383c47');
      p.dith(1, 1, 14, 14, '#565c6b', 5);
      if (h > 0.6) p.line(2, 4 + (h2 * 8 | 0), 13, 3 + (h * 9 | 0), '#2e323c', 1);
      if (h2 > 0.82) p.dith(3, 3, 10, 9, '#2a2418', 6);          // mancha de aceite
      p.p((h * 14) | 0, (h2 * 14) | 0, '#6a7080');
    },
    /* umbral de puerta */
    D: function (p, tx, ty) {
      p.r(0, 0, 16, 16, '#3a2c20');
      p.r(0, 0, 16, 1, '#241a12'); p.r(0, 15, 16, 1, '#241a12');
      p.r(2, 2, 12, 12, '#4a3828'); p.r(2, 2, 12, 1, '#5e4832');
      p.r(4, 4, 8, 1, '#5e4832'); p.r(4, 8, 8, 1, '#5e4832'); p.r(4, 12, 8, 1, '#5e4832');
    }
  };

  /* ---------------- CARAS DE PARED (16 de ancho x 32 de alto) ---------------- */
  var FACE = {
    H: function (p, tx) {
      p.r(0, 0, 16, 32, '#4a4470');
      p.dith(0, 0, 16, 12, '#5d5688', 4);
      p.r(0, 0, 1, 28, '#3d375f');
      p.r(0, 13, 16, 2, '#7a70b0'); p.r(0, 15, 16, 1, '#2a2548');
      p.r(0, 16, 16, 12, '#33305a');
      p.r(2, 18, 12, 8, '#3d3969'); p.r(2, 18, 12, 1, '#4c4882'); p.r(2, 25, 12, 1, '#25224a'); p.r(2, 18, 1, 8, '#2b2850');
      p.r(0, 28, 16, 4, '#1c1836'); p.r(0, 28, 16, 1, '#52498a');
      if (hash(tx, 3, 20) > 0.82) p.dith(3, 2, 10, 8, '#2a2548', 5);        // humedad
    },
    S: function (p, tx) {
      p.r(0, 0, 16, 32, '#34414f');
      p.r(0, 0, 1, 32, '#25303c'); p.r(15, 0, 1, 32, '#3e4d5e');
      p.r(0, 15, 16, 2, '#25303c'); p.r(0, 17, 16, 1, '#455668');
      [[2, 2], [12, 2], [2, 10], [12, 10], [2, 20], [12, 20]].forEach(function (q) { p.r(q[0], q[1], 2, 2, '#1e2832'); p.p(q[0], q[1], '#5a6e84'); });
      for (var i = 0; i < 16; i += 4) { p.poly([i, 26, i + 2, 26, i + 4, 32, i + 2, 32], '#d8a010'); p.poly([i + 2, 26, i + 4, 26, i + 6, 32, i + 4, 32], '#14181e'); }
      p.r(0, 25, 16, 1, '#14181e');
      if (hash(tx, 4, 21) > 0.7) p.dith(2, 4, 12, 10, '#1a232d', 5);
    },
    F: function (p, tx) {
      for (var i = 0; i < 16; i += 8) { p.r(i, 0, 8, 22, (((tx * 2 + i / 8) & 1) ? '#c4407e' : '#e0c070')); }
      p.dith(0, 0, 16, 22, '#2a0a20', 3);
      p.r(((tx & 1) ? 3 : 11), 6, 1, 3, '#fff6b0'); p.r(((tx & 1) ? 2 : 10), 7, 3, 1, '#fff6b0');
      p.r(((tx & 1) ? 11 : 3), 14, 1, 3, '#fff6b0'); p.r(((tx & 1) ? 10 : 2), 15, 3, 1, '#fff6b0');
      p.r(0, 20, 16, 2, '#f2c21c'); p.r(0, 22, 16, 1, '#7a5a08');
      p.r(0, 23, 16, 9, '#5a1f42'); p.r(2, 25, 12, 5, '#6a2750'); p.r(2, 25, 12, 1, '#7e3460'); p.r(2, 29, 12, 1, '#43142f');
      p.r(0, 29, 16, 3, '#2e0a22');
    },
    W: function (p, tx) {
      p.r(0, 0, 16, 32, '#5e1b2b');
      p.dith(0, 0, 16, 14, '#4a1220', 4);
      var o = (tx & 1) * 4;
      p.poly([8, 2, 12, 6, 8, 10, 4, 6], '#7a2a3c'); p.poly([8, 3, 11, 6, 8, 9, 5, 6], '#5e1b2b');
      p.p(o + 1, 13, '#7a2a3c');
      p.r(0, 14, 16, 3, '#6b4223'); p.r(0, 14, 16, 1, '#a06c3c'); p.r(0, 17, 16, 1, '#2a180c');
      p.r(0, 18, 16, 14, '#4a2c16'); p.r(2, 20, 12, 9, '#573418'); p.r(2, 20, 12, 1, '#7c5230'); p.r(2, 28, 12, 1, '#2a180c');
      p.r(0, 29, 16, 3, '#2a180c'); p.r(0, 29, 16, 1, '#6b4223');
    },
    K: function (p, tx) {
      p.r(0, 0, 16, 32, '#cfd9e8');
      for (var y = 0; y < 32; y += 8) p.r(0, y, 16, 1, '#9aaec9');
      p.r(0, 0, 1, 32, '#9aaec9'); p.r(8, 0, 1, 32, '#9aaec9');
      p.dith(0, 0, 16, 32, '#6a7a98', 3);
      p.r(0, 14, 16, 3, '#3a6aa8'); p.r(0, 14, 16, 1, '#6a9ad8'); p.r(0, 17, 16, 1, '#264a78');
      p.r(0, 28, 16, 4, '#7a8aa8'); p.r(0, 28, 16, 1, '#a8b8d0');
      if (hash(tx, 5, 22) > 0.7) p.dith(3, 18, 10, 8, '#7a5a3a', 3);
    },
    A: function (p, tx) {
      p.r(0, 0, 16, 32, '#171344');
      p.r(0, 0, 1, 32, '#0f0c30');
      p.r(0, 12, 16, 1, '#2a8fa8'); p.r(0, 13, 16, 2, '#4de0ff'); p.r(0, 15, 16, 1, '#2a8fa8');
      p.r(0, 19, 16, 1, '#a82a88'); p.r(0, 20, 16, 2, '#ff5fd2'); p.r(0, 22, 16, 1, '#a82a88');
      p.dith(0, 10, 16, 14, '#4de0ff', 2);
      p.p(((tx * 5) % 14) + 1, 3, '#ffffff'); p.p(((tx * 7) % 14) + 1, 7, '#9a90ff'); p.p(((tx * 3) % 14) + 1, 26, '#ffe45c');
      p.r(0, 28, 16, 4, '#0c0a28'); p.r(0, 28, 16, 1, '#2c2468');
    },
    C: function (p, tx) {
      p.r(0, 0, 16, 32, '#505665');
      for (var y = 0; y < 32; y += 8) {
        p.r(0, y, 16, 1, '#373c48');
        var off = ((y / 8) & 1) ? 8 : 0;
        p.r((off + 8) % 16, y, 1, 8, '#373c48');
      }
      p.dith(0, 0, 16, 32, '#6a7080', 3);
      if (hash(tx, 6, 23) > 0.6) p.dith(2, 10, 12, 14, '#2a2418', 4);
      p.r(0, 29, 16, 3, '#2e323c');
    }
  };

  /* ---------------- TAPA DE PARED (techo del muro) ---------------- */
  function cap(p, tx, ty, nb) {
    var h = hash(tx, ty, 30);
    p.r(0, 0, 16, 16, '#221d3b');
    p.dith(0, 0, 16, 16, '#2e2850', 5);
    if (nb.n) { p.r(0, 0, 16, 2, '#4a4272'); p.r(0, 2, 16, 1, '#161230'); }
    if (nb.s) { p.r(0, 13, 16, 3, '#14102a'); p.r(0, 12, 16, 1, '#3a3360'); }
    if (nb.w) { p.r(0, 0, 2, 16, '#4a4272'); p.r(2, 0, 1, 16, '#161230'); }
    if (nb.e) { p.r(14, 0, 2, 16, '#14102a'); p.r(13, 0, 1, 16, '#3a3360'); }
    if (h > 0.8) p.p((h * 12 | 0) + 2, 6, '#3a3360');
  }

  /* jambas de puerta sobre las caras que bordean una abertura */
  function jamb(p, left, right) {
    if (left) { p.r(0, 0, 3, 32, '#2a180c'); p.r(3, 0, 1, 32, '#6b4223'); p.r(0, 0, 3, 1, '#a06c3c'); }
    if (right) { p.r(13, 0, 3, 32, '#2a180c'); p.r(12, 0, 1, 32, '#6b4223'); p.r(13, 0, 3, 1, '#a06c3c'); }
  }

  /* ================= TEMAS DE LA NOCHE 2 =================
     E escenario · Q comedor · B cabinas · V pasillo de servicio · G bodega · M camerino */
  FLOOR.E = function (p, tx, ty) {                       // tablas de escenario
    var h = hash(tx, ty, 40), h2 = hash(tx, ty, 41), h3 = hash(tx, ty, 42), cs = ['#5c3024', '#54291e', '#643828', '#4e271c'], o = (tx + ty) & 1;
    p.r(0, 0, 8, 16, cs[(h * 4) | 0]); p.r(8, 0, 8, 16, cs[(h2 * 4) | 0]);
    p.r(0, 0, 1, 16, '#2a120c'); p.r(8, 0, 1, 16, '#2a120c');
    p.r(1, 0, 1, 16, '#7a4a36'); p.r(9, 0, 1, 16, '#7a4a36');
    p.r(0, o ? 7 : 15, 8, 1, '#2a120c'); p.r(8, o ? 15 : 7, 8, 1, '#2a120c');
    p.p(3, 2, '#2a120c'); p.p(12, 10, '#2a120c');
    if (h3 > 0.8) p.dith(2, 4, 12, 8, '#2a120c', 3);
    if (h3 < 0.1) { p.r(3, 5, 4, 1, '#8a5a44'); p.r(10, 9, 3, 1, '#8a5a44'); }
  };
  FLOOR.Q = function (p, tx, ty) {                       // damero crema y azul oscuro
    var a = (tx + ty) & 1, h = hash(tx, ty, 43), h2 = hash(tx, ty, 44);
    p.r(0, 0, 16, 16, a ? '#b8b09a' : '#2d2b42');
    p.r(0, 0, 16, 1, a ? '#8a826e' : '#1a1830'); p.r(0, 0, 1, 16, a ? '#8a826e' : '#1a1830');
    p.r(1, 1, 14, 1, a ? '#d4ccb4' : '#3d3a5a'); p.r(1, 1, 1, 14, a ? '#cac2aa' : '#37354f');
    if (a) p.dith(2, 2, 12, 12, '#a39b86', 3);
    if (h > 0.78) p.dith(2, 4, 12, 9, a ? '#6a6250' : '#0e0c1c', 4);
    if (h2 > 0.9) p.line(2, 13, 12, 4, a ? '#6a6250' : '#0e0c1c', 1);
    if (h2 < 0.06) p.r(4 + (h * 6 | 0), 8, 2, 1, ['#ff5fd2', '#4de0ff', '#ffe45c'][(h * 3) | 0]);
    if (h < 0.03) p.circ(8, 9, 1.4, '#7a2a50');
  };
  FLOOR.B = function (p, tx, ty) {                       // alfombra técnica de las cabinas
    var h = hash(tx, ty, 45), h2 = hash(tx, ty, 46);
    p.r(0, 0, 16, 16, ((tx + ty) & 1) ? '#273248' : '#222c40');
    p.r(0, 0, 16, 1, '#141a28'); p.r(0, 0, 1, 16, '#141a28');
    p.dith(1, 1, 14, 14, '#33405c', 4);
    p.p(2, 2, '#4a5a7c'); p.p(13, 13, '#4a5a7c');
    if (h > 0.85) { p.r(0, 6 + (h2 * 6 | 0), 16, 2, '#7a6a18'); p.r(0, 6 + (h2 * 6 | 0), 16, 1, '#a88c20'); }
    if (h < 0.12) p.dith(2, 3, 11, 9, '#0e121c', 5);
    if (h2 > 0.93) p.line(1, 14, 14, 2, '#141a28', 1);
  };
  FLOOR.V = function (p, tx, ty) {                       // linóleo verde con línea guía
    var a = (tx + ty) & 1, h = hash(tx, ty, 47), h2 = hash(tx, ty, 48);
    p.r(0, 0, 16, 16, a ? '#5d7870' : '#54706a');
    p.r(0, 0, 16, 1, '#38504a'); p.r(0, 0, 1, 16, '#38504a');
    p.r(1, 1, 14, 1, '#7a948a'); p.r(1, 1, 1, 14, '#6e887f');
    if (h > 0.75) p.dith(2, 3, 12, 10, '#2e443e', 4);
    if (h2 > 0.9) { p.r(3, 11, 8, 1, '#8aa498'); p.r(5, 12, 5, 1, '#2e443e'); }
    if (ty % 4 === 3) { p.r(0, 7, 16, 2, '#a88418'); p.r(0, 7, 16, 1, '#d8b030'); }
    if (h2 < 0.05) p.line(3, 3, 11, 12, '#2e443e', 1);
  };
  FLOOR.G = function (p, tx, ty) {                       // tablones de bodega
    var h = hash(tx, ty, 49), h2 = hash(tx, ty, 50), cs = ['#6e5434', '#7a5e3a', '#634c2e'];
    p.r(0, 0, 16, 16, cs[(h * 3) | 0]);
    p.r(0, 0, 16, 1, '#3e2c18'); p.r(0, 0, 1, 16, '#3e2c18'); p.r(1, 1, 14, 1, '#8e7048');
    p.r(0, 8, 16, 1, '#4a3820'); p.r(0, 9, 16, 1, '#86683e');
    p.line(2, 4 + (h2 * 3 | 0), 12, 5 + (h2 * 3 | 0), '#5a4326', 1); p.line(3, 12, 13, 13, '#574024', 1);
    p.p(3, 3, '#2a1c0e'); p.p(12, 12, '#2a1c0e');
    if (h > 0.8) p.dith(2, 2, 12, 12, '#2a1c0e', 5);
    if (h2 > 0.9) { p.r(2, 14, 3, 1, '#c8a060'); p.r(9, 13, 2, 1, '#c8a060'); }
  };
  FLOOR.M = function (p, tx, ty) {                       // alfombra felpa ciruela
    var h = hash(tx, ty, 51), h2 = hash(tx, ty, 52);
    p.r(0, 0, 16, 16, '#4a2c56'); p.dith(0, 0, 16, 16, '#5e3a6a', 5);
    p.r(0, 0, 16, 1, '#2e1a38'); p.r(0, 0, 1, 16, '#2e1a38');
    p.poly([8, 3, 13, 8, 8, 13, 3, 8], '#5e3a6a'); p.poly([8, 5, 11, 8, 8, 11, 5, 8], '#4a2c56'); p.p(8, 8, '#c8a020');
    if (h > 0.8) p.dith(2, 3, 12, 10, '#26132e', 5);
    if (h2 > 0.92) p.r(3, 13, 6, 1, '#8a6a98');
  };

  FACE.E = function (p, tx) {                            // muro del escenario: morado, moldura dorada y zócalo
    p.r(0, 0, 16, 32, '#2a1456'); p.dith(0, 0, 16, 12, '#3c1f78', 4); p.r(0, 0, 1, 32, '#1c0c3c');
    p.p(((tx * 5) % 13) + 1, 4, '#ffe45c'); p.p(((tx * 7) % 13) + 2, 9, '#c4beff');
    p.r(0, 13, 16, 2, '#f2c21c'); p.r(0, 13, 16, 1, '#fff6b0'); p.r(0, 15, 16, 1, '#7a5a08');
    p.r(0, 16, 16, 16, '#3a1c18'); p.r(2, 18, 12, 9, '#4a261f'); p.r(2, 18, 12, 1, '#6a3c30'); p.r(2, 26, 12, 1, '#24100c');
    p.r(0, 28, 16, 4, '#1c0d0a'); p.r(0, 28, 16, 1, '#7a5a08');
  };
  FACE.Q = function (p, tx) {                            // comedor: papel a rayas, riel y friso verde
    for (var i = 0; i < 16; i += 8) p.r(i, 0, 8, 19, ((tx * 2 + i / 8) & 1) ? '#8a2433' : '#d6cbae');
    p.dith(0, 0, 16, 19, '#1a0a10', 3); p.r(0, 0, 1, 19, '#5a1220'); p.r(8, 0, 1, 19, '#a89e82');
    p.p(((tx * 3) % 12) + 2, 6, '#f2c21c'); p.p(((tx * 5) % 12) + 2, 12, '#f2c21c');
    p.r(0, 19, 16, 3, '#6b4223'); p.r(0, 19, 16, 1, '#b87a42'); p.r(0, 22, 16, 1, '#2a180c');
    p.r(0, 23, 16, 9, '#1f5a5a'); p.r(2, 24, 12, 5, '#2a7272'); p.r(2, 24, 12, 1, '#3a9090'); p.r(2, 28, 12, 1, '#143e3e');
    p.r(0, 29, 16, 3, '#102e2e'); p.r(0, 29, 16, 1, '#3a9090');
  };
  function foam(p, x, y) {                               // pirámide de espuma acústica 8x8
    p.poly([x, y, x + 8, y, x + 4, y + 4], '#3c4766'); p.poly([x, y, x + 4, y + 4, x, y + 8], '#2e3852');
    p.poly([x + 8, y, x + 8, y + 8, x + 4, y + 4], '#222a40'); p.poly([x, y + 8, x + 8, y + 8, x + 4, y + 4], '#141a2a');
  }
  FACE.B = function (p, tx) {                            // cabinas: espuma acústica y tira de LED
    p.r(0, 0, 16, 32, '#1a2034');
    foam(p, 0, 0); foam(p, 8, 0); foam(p, 0, 8); foam(p, 8, 8);
    p.r(0, 16, 16, 1, '#0e5a70'); p.r(0, 17, 16, 1, '#4de0ff'); p.r(0, 18, 16, 1, '#0e5a70');
    foam(p, 0, 19); foam(p, 8, 19);
    p.p((tx * 3) % 14 + 1, 10, '#4de0ff');
    p.r(0, 28, 16, 4, '#2c3548'); p.r(0, 28, 16, 1, '#6a7a94'); p.r(0, 31, 16, 1, '#141a28');
  };
  FACE.V = function (p, tx) {                            // servicio: pintura menta, tubo y riel verde
    p.r(0, 0, 16, 32, '#a9c2b6'); p.dith(0, 0, 16, 14, '#8fa89c', 4); p.r(0, 0, 1, 32, '#7a9488');
    p.r(0, 3, 16, 3, '#59666e'); p.r(0, 3, 16, 1, '#8a98a2'); p.r(0, 5, 16, 1, '#2e383e');
    if (tx % 4 === 0) { p.r(5, 2, 4, 5, '#2e383e'); p.r(6, 3, 2, 1, '#8a98a2'); }
    p.r(0, 14, 16, 2, '#2f5a4a'); p.r(0, 14, 16, 1, '#4a8068');
    p.r(0, 16, 16, 12, '#46705f'); p.dith(0, 16, 16, 12, '#2f5a4a', 3);
    if (hash(tx, 7, 24) > 0.7) p.dith(2, 17, 12, 9, '#25402f', 6);
    p.r(0, 28, 16, 4, '#1c2f28'); p.r(0, 28, 16, 1, '#6a9a84');
  };
  FACE.G = function (p, tx) {                            // bodega: chapa acanalada y zócalo de madera
    p.r(0, 0, 16, 32, '#6a7284');
    for (var i = 0; i < 16; i += 4) { p.r(i, 0, 1, 26, '#8a94a8'); p.r(i + 2, 0, 2, 26, '#4a5264'); }
    if (hash(tx, 8, 25) > 0.6) p.dith(1, 4, 13, 18, '#7a4a2a', 4);
    p.r((tx & 1) ? 3 : 10, 2, 2, 2, '#2e343f');
    p.r(0, 26, 16, 6, '#4a2c16'); p.r(0, 26, 16, 1, '#905a30'); p.r(0, 29, 16, 3, '#2a180c'); p.r(0, 29, 16, 1, '#6b4223');
  };
  FACE.M = function (p, tx) {                            // camerino: papel verde azulado con rombos y friso ciruela
    p.r(0, 0, 16, 32, '#1f4a50'); p.dith(0, 0, 16, 17, '#2c6870', 3);
    p.poly([8, 2, 12, 7, 8, 12, 4, 7], '#2c6870'); p.poly([8, 4, 10, 7, 8, 10, 6, 7], '#1f4a50'); p.p(8, 7, '#c8a020');
    p.r(0, 16, 16, 3, '#c8a020'); p.r(0, 16, 16, 1, '#fff6b0'); p.r(0, 19, 16, 1, '#7a5a08');
    p.r(0, 20, 16, 12, '#4a2434'); p.r(2, 22, 12, 6, '#5e3044'); p.r(2, 22, 12, 1, '#7a4a5e'); p.r(2, 27, 12, 1, '#2e141e');
    p.r(0, 29, 16, 3, '#2e141e'); p.r(0, 29, 16, 1, '#c8a020');
  };

  /* ================= TEMAS DE LA NOCHE 3 =================
     P cubierta · T puente · R camarote · X bodega · N cala (arena y gruta) · L calabozo */
  FLOOR.P = function (p, tx, ty) {                       // tablones grises de cubierta, con juntas de brea
    var h = hash(tx, ty, 60), h2 = hash(tx, ty, 61), h3 = hash(tx, ty, 62), cs = ['#6a6454', '#5f5a4a', '#716a58', '#575242'];
    p.r(0, 0, 16, 8, cs[(h * 4) | 0]); p.r(0, 8, 16, 8, cs[(h2 * 4) | 0]);
    p.r(0, 0, 16, 1, '#241e16'); p.r(0, 8, 16, 1, '#241e16'); p.r(0, 1, 16, 1, '#8a8470'); p.r(0, 9, 16, 1, '#8a8470');
    p.r(((h * 12) | 0) + 2, 1, 1, 7, '#3a3224'); p.r(((h2 * 12) | 0) + 2, 9, 1, 7, '#3a3224');
    p.p(2, 4, '#2a2418'); p.p(13, 12, '#2a2418');
    p.r(3 + ((h2 * 6) | 0), 5, 5, 1, '#4a4436'); p.r(2 + ((h * 6) | 0), 13, 6, 1, '#4a4436');
    if (h3 > 0.9) p.dith(1, 2, 14, 12, '#1e1a1a', 4);
    if (h3 < 0.07) { p.r(2, 3, 9, 1, '#aaa492'); p.r(6, 12, 6, 1, '#aaa492'); }
    if (h3 > 0.46 && h3 < 0.5) { p.circ(8, 4, 1.6, '#2e281c'); p.p(8, 4, '#4a4436'); }
  };
  FLOOR.T = function (p, tx, ty) {                       // teca pulida del puente
    var h = hash(tx, ty, 63), h2 = hash(tx, ty, 64), cs = ['#b08850', '#a88048', '#b89058', '#9c7640'];
    p.r(0, 0, 16, 8, cs[(h * 4) | 0]); p.r(0, 8, 16, 8, cs[(h2 * 4) | 0]);
    p.r(0, 0, 16, 1, '#4a3418'); p.r(0, 8, 16, 1, '#4a3418'); p.r(0, 1, 16, 1, '#d8b878'); p.r(0, 9, 16, 1, '#d8b878');
    p.r(((h * 12) | 0) + 2, 1, 1, 7, '#6a4a22'); p.r(((h2 * 12) | 0) + 2, 9, 1, 7, '#6a4a22');
    p.p(2, 4, '#e8c040'); p.p(13, 12, '#e8c040');
    if (ty & 1) { p.r(0, 5, 16, 1, '#7a5628'); p.r(0, 13, 16, 1, '#7a5628'); }
    if (h > 0.75) p.dith(3, 2, 10, 5, '#f0d890', 3);
    if (h2 > 0.9) p.dith(2, 10, 12, 5, '#3a2810', 3);
  };
  FLOOR.R = function (p, tx, ty) {                       // caoba oscura con hilo de latón
    var h = hash(tx, ty, 65), h2 = hash(tx, ty, 66), cs = ['#5a2e22', '#4f2a1e', '#63342a'];
    p.r(0, 0, 8, 16, cs[(h * 3) | 0]); p.r(8, 0, 8, 16, cs[(h2 * 3) | 0]);
    p.r(0, 0, 1, 16, '#24100c'); p.r(8, 0, 1, 16, '#24100c'); p.r(1, 0, 1, 16, '#7a4a3a'); p.r(9, 0, 1, 16, '#7a4a3a');
    p.r(0, ((h2 * 12) | 0) + 2, 8, 1, '#24100c'); p.r(8, ((h * 12) | 0) + 2, 8, 1, '#24100c');
    if ((tx + ty) % 4 === 0) { p.r(0, 7, 16, 1, '#8a6410'); p.r(0, 8, 16, 1, '#d8a820'); }
    if (h > 0.84) p.dith(2, 3, 12, 10, '#1a0a08', 4);
    if (h2 > 0.93) p.r(3, 5, 4, 1, '#a06a50');
  };
  FLOOR.X = function (p, tx, ty) {                       // tablas de bodega, oscuras, con baba verde y brea
    var h = hash(tx, ty, 67), h2 = hash(tx, ty, 68), h3 = hash(tx, ty, 69), cs = ['#3b3027', '#352b23', '#413629'], i;
    for (i = 0; i < 4; i++) { p.r(i * 4, 0, 4, 16, cs[((h * 7 + i * 3) | 0) % 3]); p.r(i * 4, 0, 1, 16, '#14100c'); p.r(i * 4 + 1, 0, 1, 16, '#524434'); }
    p.r(0, ((h2 * 12) | 0) + 2, 8, 1, '#14100c'); p.r(8, ((h * 12) | 0) + 2, 8, 1, '#14100c');
    p.p(2, 3, '#7a5a3a'); p.p(10, 13, '#7a5a3a');
    if (h3 > 0.88) p.dith(1, 2, 14, 12, '#2c4a26', 4);
    if (h3 < 0.14) p.dith(2, 4, 12, 9, '#0a0a10', 6);
    if (h3 > 0.4 && h3 < 0.45) p.r(3, 6, 8, 2, '#1e3a3c');
  };
  FLOOR.N = function (p, tx, ty) {                       // arena de la cala con piedras, conchas y partes mojadas
    var h = hash(tx, ty, 70), h2 = hash(tx, ty, 71), wet = hash(tx, ty, 72), i;
    p.r(0, 0, 16, 16, '#a68c5a'); p.dith(0, 0, 16, 16, '#bca470', 6); p.dith(0, 0, 16, 16, '#7a6642', 3);
    for (i = 0; i < 5; i++) p.p(((h * 91 + i * 37) | 0) % 15, ((h2 * 77 + i * 53) | 0) % 15, i % 2 ? '#d8c490' : '#6a5634');
    if (h > 0.7) { p.r(3 + ((h2 * 8) | 0), 4 + ((h * 6) | 0), 3, 2, '#5a4a30'); p.r(4 + ((h2 * 8) | 0), 4 + ((h * 6) | 0), 1, 1, '#8a7650'); }
    if (h2 > 0.9) { p.p(4, 11, '#f6ece0'); p.p(5, 11, '#f6ece0'); p.p(5, 12, '#d8a8a0'); }
    if (h2 < 0.04) { p.line(8, 8, 13, 13, '#d8604a', 1); p.line(8, 8, 3, 13, '#d8604a', 1); p.line(8, 8, 8, 2, '#d8604a', 1); p.p(8, 8, '#f09a80'); }
    if (wet > 0.7) p.dith(0, 0, 16, 16, '#4a3c24', 6);                         // arena mojada
  };
  FLOOR.L = function (p, tx, ty) {                       // losas de piedra del calabozo con moho y paja
    var h = hash(tx, ty, 73), h2 = hash(tx, ty, 74), a = (tx + ty) & 1;
    p.r(0, 0, 16, 16, a ? '#444e52' : '#3c4649');
    p.r(0, 0, 16, 2, '#1c2426'); p.r(0, 0, 2, 16, '#1c2426'); p.r(2, 2, 13, 1, a ? '#5e6a6c' : '#56625e'); p.r(2, 2, 1, 13, '#566264');
    p.dith(3, 3, 12, 12, '#2c3638', 4);
    if (h > 0.9) p.dith(2, 3, 13, 11, '#3a5a2c', 4);
    if (h2 > 0.96) { p.r(4, 8, 7, 1, '#d0b060'); p.r(6, 9, 6, 1, '#a88838'); p.r(3, 10, 5, 1, '#d0b060'); p.r(9, 7, 3, 1, '#a88838'); }
    if (h2 < 0.05) { p.circ(8, 8, 5, '#1c2426'); p.circ(8, 8, 4, '#0a1012'); p.r(4, 8, 9, 1, '#586668'); p.r(8, 4, 1, 9, '#586668'); }
    if (h < 0.06) p.line(3, 13, 12, 4, '#14181a', 1);
  };

  FACE.P = function (p, tx) {                            // borda azul del casco, pasamanos de madera y zócalo
    var i, c = ['#2e4c7a', '#294570', '#335483'];
    for (i = 0; i < 3; i++) { p.r(0, i * 4, 16, 4, c[(i + tx) % 3]); p.r(0, i * 4, 16, 1, '#4a70a8'); p.r(0, i * 4 + 3, 16, 1, '#14243e'); }
    p.r(0, 12, 16, 1, '#14243e'); p.r(0, 0, 1, 13, '#1e3558'); p.p(((tx * 5) % 13) + 2, 5, '#6a90c8');
    p.r(0, 13, 16, 3, '#8a6238'); p.r(0, 13, 16, 1, '#c89a5c'); p.r(0, 16, 16, 1, '#2a1a0c');
    for (i = 0; i < 3; i++) { p.r(0, 17 + i * 4, 16, 4, c[(i + tx + 1) % 3]); p.r(0, 17 + i * 4, 16, 1, '#4a70a8'); p.r(0, 20 + i * 4, 16, 1, '#14243e'); }
    p.p(2, 18, '#a8b8c8'); p.p(13, 22, '#a8b8c8'); p.p(2, 26, '#a8b8c8');
    if (hash(tx, 9, 26) > 0.65) p.dith(2, 17, 12, 11, '#0e1a2e', 5);
    p.r(0, 28, 16, 4, '#1c1408'); p.r(0, 28, 16, 1, '#6a4a28'); p.r(0, 31, 16, 1, '#0a0804');
  };
  FACE.T = function (p, tx) {                            // puente: teca vertical con cinta de latón
    var i;
    p.r(0, 0, 16, 32, '#7a5430');
    for (i = 0; i < 16; i += 5) { p.r(i, 0, 1, 13, '#4a2e14'); p.r(i + 1, 0, 1, 13, '#a07844'); }
    p.dith(0, 0, 16, 13, '#3a2410', 3);
    p.r(0, 13, 16, 3, '#d8a820'); p.r(0, 13, 16, 1, '#fff0a0'); p.r(0, 15, 16, 1, '#7a5a0c'); p.r(0, 16, 16, 1, '#2a1a0c');
    p.r(0, 17, 16, 11, '#5a3a1c'); p.r(2, 19, 12, 7, '#6a4624'); p.r(2, 19, 12, 1, '#8a6034'); p.r(2, 25, 12, 1, '#2a1a0c');
    p.p(3, 20, '#e8c040'); p.p(12, 20, '#e8c040'); p.p(3, 24, '#e8c040'); p.p(12, 24, '#e8c040');
    p.r(0, 28, 16, 4, '#2a1a0c'); p.r(0, 28, 16, 1, '#a07844');
  };
  FACE.R = function (p, tx) {                            // camarote: papel azul con anclas doradas y friso de caoba
    var ox = (tx & 1) ? 2 : 9;
    p.r(0, 0, 16, 32, '#1f3560'); p.dith(0, 0, 16, 16, '#2c4a80', 3); p.r(0, 0, 1, 16, '#14244a');
    p.r(ox + 2, 2, 1, 7, '#c8a020'); p.r(ox, 4, 5, 1, '#c8a020'); p.r(ox, 7, 1, 2, '#c8a020'); p.r(ox + 4, 7, 1, 2, '#c8a020'); p.r(ox + 1, 9, 3, 1, '#c8a020'); p.p(ox + 2, 2, '#fff0a0');
    p.r(((tx & 1) ? 10 : 3) + 1, 11, 1, 1, '#c8a020');
    p.r(0, 16, 16, 3, '#c8a020'); p.r(0, 16, 16, 1, '#fff0a0'); p.r(0, 19, 16, 1, '#6a4a0c');
    p.r(0, 20, 16, 12, '#4a2420'); p.r(2, 22, 12, 6, '#5e3028'); p.r(2, 22, 12, 1, '#7a463c'); p.r(2, 27, 12, 1, '#24100c');
    p.p(1, 24, '#e8c040'); p.p(14, 24, '#e8c040'); p.r(0, 29, 16, 3, '#24100c'); p.r(0, 29, 16, 1, '#c8a020');
  };
  FACE.X = function (p, tx) {                            // bodega: costillas del casco, tablas húmedas y moho
    var i;
    p.r(0, 0, 16, 32, '#3c2a18');
    for (i = 0; i < 32; i += 4) p.r(0, i, 16, 1, '#241608');
    p.r(0, 0, 4, 28, '#5a3c20'); p.r(0, 0, 1, 28, '#7a5a34'); p.r(3, 0, 1, 28, '#2a1a0c');
    p.r(10, 0, 4, 28, '#5a3c20'); p.r(10, 0, 1, 28, '#7a5a34'); p.r(13, 0, 1, 28, '#2a1a0c');
    p.r(0, 13, 16, 3, '#464e5c'); p.r(0, 13, 16, 1, '#7a8498'); p.r(0, 15, 16, 1, '#1c2230'); p.p(1, 14, '#aeb9cc'); p.p(11, 14, '#aeb9cc');
    if (hash(tx, 10, 27) > 0.5) p.dith(4, 2, 7, 11, '#1a2a1c', 6);
    p.dith(0, 18, 16, 10, '#2c4a26', 4); p.r(0, 28, 16, 4, '#1c1408'); p.r(0, 28, 16, 1, '#4a3a22');
    if (hash(tx, 11, 28) > 0.7) { p.r(6, 16, 1, 8, '#2a4a58'); p.p(6, 24, '#4aa8b0'); }
  };
  FACE.N = function (p, tx) {                            // gruta: roca por capas, goteras y algas que brillan
    var i, y;
    p.r(0, 0, 16, 32, '#352f55');
    for (y = 0; y < 28; y += 7) { p.r(0, y, 16, 3, '#413a68'); p.r(0, y + 3, 16, 1, '#22203c'); p.r(0, y, 16, 1, '#544c80'); }
    p.dith(0, 0, 16, 28, '#14122a', 4);
    for (i = 0; i < 3; i++) p.poly([i * 6 + 2, 0, i * 6 + 6, 0, i * 6 + 4, 4 + ((tx * (i + 3)) % 4)], '#22203c');   // goteros
    p.r(((tx * 7) % 12) + 1, 9, 2, 1, '#4de0c8'); p.p(((tx * 5) % 13) + 1, 17, '#4de0c8'); p.p(((tx * 3) % 12) + 2, 22, '#9af0e0');
    if (hash(tx, 12, 29) > 0.6) p.dith(3, 8, 9, 16, '#1e4a4a', 4);
    p.r(0, 24, 16, 4, '#2a2448'); p.dith(0, 24, 16, 4, '#4aa8b0', 5); p.r(0, 28, 16, 4, '#1c1a34'); p.r(0, 28, 16, 1, '#7ac8c8'); p.dith(0, 29, 16, 3, '#9ae0e0', 3);
  };
  FACE.L = function (p, tx) {                            // calabozo: sillares verdosos, argollas y chorreras
    var y, off;
    p.r(0, 0, 16, 32, '#2f3b3a');
    for (y = 0; y < 28; y += 8) { off = ((y / 8) & 1) ? 8 : 0; p.r(0, y, 16, 1, '#161e1e'); p.r((off + tx * 4) % 16, y, 1, 8, '#161e1e'); p.r(0, y + 1, 16, 1, '#4a5a58'); }
    p.dith(0, 0, 16, 28, '#1a2424', 3);
    if (hash(tx, 13, 30) > 0.45) { p.dith(2, 2, 12, 12, '#3a5a2c', 5); p.r(7, 14, 1, 10, '#2a4a40'); }
    p.r(0, 13, 16, 2, '#52483c'); p.r(0, 13, 16, 1, '#8a7a5c'); p.r(0, 15, 16, 1, '#1c1408');
    if (tx % 3 === 0) { p.r(6, 18, 4, 5, '#2a2018'); p.r(7, 19, 2, 3, '#8a6a3a'); p.p(7, 19, '#c8a060'); }
    p.r(0, 28, 16, 4, '#141c1c'); p.r(0, 28, 16, 1, '#4a5a58');
  };

  /* ================= TEMAS DE LA NOCHE 4 =================
     J cocina industrial · O horno de pizza · Z cámara fría · k despensa · U lavado · I comedor del personal · Y vestidor */
  FLOOR.J = function (p, tx, ty) {                       // loseta de gres gris con juntas negras, grasa y coladeras
    var h = hash(tx, ty, 80), h2 = hash(tx, ty, 81), a = (tx + ty) & 1;
    p.r(0, 0, 16, 16, a ? '#566460' : '#4e5c58');
    p.r(0, 0, 16, 1, '#1e2624'); p.r(0, 0, 1, 16, '#1e2624'); p.r(1, 1, 14, 1, '#6c7c76'); p.r(1, 1, 1, 14, '#65746e');
    p.dith(3, 3, 11, 11, '#3c4844', 3); p.p(5, 6, '#2e3836'); p.p(11, 11, '#2e3836');
    if (h > 0.78) p.dith(2, 3, 12, 11, '#3a2a14', 4);                                   // grasa
    if (h < 0.07) { p.circ(8, 8, 4.5, '#1e2624'); p.circ(8, 8, 3.5, '#10161a'); p.r(4, 8, 9, 1, '#4a5854'); p.r(8, 4, 1, 9, '#4a5854'); }   // coladera
    if (h2 > 0.93) { p.r(3, 9, 8, 2, '#7a1c18'); p.r(4, 9, 3, 1, '#a8382c'); }            // salsa
    if (h2 < 0.06) p.dith(1, 1, 14, 14, '#d8d4c4', 8);                                  // harina
  };
  FACE.J = function (p, tx) {                            // acero inoxidable con juntas, remaches y franja verde
    var i;
    p.r(0, 0, 16, 32, '#7e8c90');
    p.r(0, 0, 1, 28, '#a8b8bc'); p.r(15, 0, 1, 28, '#566466'); p.dith(0, 0, 16, 28, '#98a8ac', 4);
    for (i = 2; i < 14; i += 4) p.r(i, 1, 1, 12, '#98a8ac');
    p.p(1, 2, '#d8e4e6'); p.p(14, 2, '#d8e4e6'); p.p(1, 12, '#d8e4e6'); p.p(14, 12, '#d8e4e6');
    p.r(0, 13, 16, 3, '#2a6a4a'); p.r(0, 13, 16, 1, '#4aa07a'); p.r(0, 15, 16, 1, '#123a28'); p.r(0, 16, 16, 1, '#1c2a2a');
    p.r(0, 17, 16, 11, '#6e7c80'); p.r(0, 17, 16, 1, '#8a9a9e'); p.r(7, 17, 2, 11, '#4a5658'); p.p(3, 21, '#d8e4e6'); p.p(12, 25, '#d8e4e6');
    if (hash(tx, 14, 31) > 0.55) p.dith(3, 18, 10, 10, '#3a2a14', 3);                  // salpicaduras de grasa
    if (hash(tx, 15, 32) > 0.7) { p.r(6, 3, 1, 9, '#5a4a30'); p.p(6, 12, '#7a6440'); }
    p.r(0, 28, 16, 4, '#242c2c'); p.r(0, 28, 16, 1, '#566466');
  };
  FLOOR.O = function (p, tx, ty) {                       // baldosa de barro cocido con hollín
    var h = hash(tx, ty, 82), h2 = hash(tx, ty, 83), a = (tx + ty) & 1;
    p.r(0, 0, 16, 16, a ? '#8a4a2c' : '#7c4126');
    p.r(0, 0, 16, 1, '#3a1a0e'); p.r(0, 0, 1, 16, '#3a1a0e'); p.r(1, 1, 14, 1, '#a8643c'); p.r(1, 1, 1, 14, '#9c5a36');
    p.dith(2, 2, 13, 13, '#5a2e1a', 3); p.p(6, 5, '#a8643c'); p.p(11, 10, '#5a2e1a');
    if (h > 0.8) p.dith(1, 2, 14, 12, '#1a1008', 4);
    if (h < 0.07) p.line(3, 13, 12, 4, '#2a1408', 1);
    if (h2 > 0.94) { p.r(4, 6, 7, 3, '#e8d8a8'); p.r(5, 7, 5, 1, '#c89848'); }           // masa caída
  };
  FACE.O = function (p, tx) {                            // ladrillo rojo con mortero, hollín y repisa de hierro
    var y, off;
    p.r(0, 0, 16, 32, '#7a3a28');
    for (y = 0; y < 13; y += 4) { off = ((y / 4) & 1) ? 8 : 0; p.r(0, y + 3, 16, 1, '#c8a890'); p.r((off + 5) % 16, y, 1, 3, '#c8a890'); p.r(0, y, 16, 1, '#9a4c36'); }
    p.dith(0, 0, 16, 13, '#2a1008', 4);
    p.r(0, 13, 16, 3, '#2a2c34'); p.r(0, 13, 16, 1, '#5e6272'); p.r(0, 16, 16, 1, '#0a0a10');
    for (y = 17; y < 28; y += 4) { off = ((y / 4) & 1) ? 8 : 0; p.r(0, y + 3, 16, 1, '#b89880'); p.r((off + 3) % 16, y, 1, 3, '#b89880'); p.r(0, y, 16, 1, '#8a4430'); }
    p.dith(0, 17, 16, 11, '#1a0c06', 3);
    if (hash(tx, 16, 33) > 0.5) p.dith(3, 0, 10, 14, '#0a0604', 3);
    p.r(0, 28, 16, 4, '#2a1008'); p.r(0, 28, 16, 1, '#6a3220');
  };
  FLOOR.Z = function (p, tx, ty) {                       // chapa estriada helada con escarcha
    var h = hash(tx, ty, 84), h2 = hash(tx, ty, 85), i;
    p.r(0, 0, 16, 16, '#9cb8cc'); p.r(0, 0, 16, 1, '#4a6a82'); p.r(0, 0, 1, 16, '#4a6a82'); p.r(1, 1, 14, 1, '#d4e8f4'); p.r(1, 1, 1, 14, '#c4dcec');
    for (i = 0; i < 4; i++) { p.line(2 + i * 3.4, 4, 5 + i * 3.4, 2, '#bcd4e4', 1); p.line(2 + i * 3.4, 12, 5 + i * 3.4, 10, '#bcd4e4', 1); }
    p.dith(1, 1, 14, 14, '#e8f4fc', 4);
    if (h > 0.7) p.dith(2, 2, 12, 12, '#f4fbff', 3);
    if (h2 > 0.9) { p.ell(8, 8, 5, 3, '#dff1fb'); p.ell(8, 8, 3, 1.6, '#f8fdff'); }
    if (h2 < 0.05) p.line(3, 13, 12, 4, '#6a8aa2', 1);
  };
  FACE.Z = function (p, tx) {                            // paneles de poliuretano blancos con franja azul y escarcha
    var i;
    p.r(0, 0, 16, 32, '#dcecf4'); p.r(0, 0, 1, 28, '#f8fdff'); p.r(15, 0, 1, 28, '#9ab4c6'); p.dith(0, 0, 16, 28, '#c4dcea', 4);
    p.r(7, 0, 2, 13, '#9ab4c6'); p.p(3, 3, '#7a9ab0'); p.p(12, 9, '#7a9ab0');
    p.r(0, 13, 16, 3, '#2a5aa0'); p.r(0, 13, 16, 1, '#6a9ad8'); p.r(0, 15, 16, 1, '#14305a'); p.r(0, 16, 16, 1, '#6a8aa2');
    p.r(0, 17, 16, 11, '#cfe2ee'); p.r(7, 17, 2, 11, '#9ab4c6');
    for (i = 0; i < 3; i++) if (hash(tx, 17 + i, 34) > 0.45) p.poly([2 + i * 5, 17, 6 + i * 5, 17, 4 + i * 5, 20 + ((tx * 3 + i) % 5)], '#f8fdff');   // carámbanos
    p.dith(0, 0, 16, 6, '#ffffff', 3);
    p.r(0, 28, 16, 4, '#7e9cb2'); p.r(0, 28, 16, 1, '#f0fafe');
  };
  FLOOR.k = function (p, tx, ty) {                       // concreto pulido de despensa con marcas de cajas
    var h = hash(tx, ty, 86), h2 = hash(tx, ty, 87);
    p.r(0, 0, 16, 16, '#5c5040'); p.r(0, 0, 16, 1, '#2a2218'); p.r(0, 0, 1, 16, '#2a2218'); p.r(1, 1, 14, 1, '#76685a');
    p.dith(2, 2, 13, 13, '#4a4034', 3); p.dith(2, 2, 13, 13, '#6c5e4c', 2);
    if (h > 0.82) { p.r(2, 3, 12, 9, '#4a4030'); p.r(2, 3, 12, 1, '#7a6a50'); p.r(2, 11, 12, 1, '#2a2218'); }      // marca de caja
    if (h < 0.06) p.line(2, 14, 13, 3, '#221a10', 1);
    if (h2 > 0.93) { p.p(5, 5, '#c8b890'); p.p(9, 9, '#c8b890'); p.p(6, 10, '#c8b890'); }
  };
  FACE.k = function (p, tx) {                            // yeso crema con zócalo de madera y repisas pintadas
    var i;
    p.r(0, 0, 16, 32, '#8a7a5c'); p.dith(0, 0, 16, 13, '#a49470', 3); p.r(0, 0, 1, 13, '#6c5e44');
    p.r(0, 13, 16, 3, '#4a2e16'); p.r(0, 13, 16, 1, '#8a5e30'); p.r(0, 16, 16, 1, '#1a0e06');
    p.r(0, 17, 16, 11, '#6e5a3a'); for (i = 0; i < 16; i += 5) { p.r(i, 17, 1, 11, '#3e2e16'); p.r(i + 1, 17, 1, 11, '#8a7048'); }
    p.dith(0, 17, 16, 11, '#2a1c0c', 5);
    if (hash(tx, 18, 35) > 0.6) p.dith(3, 2, 9, 10, '#4a3a22', 4);
    p.r(0, 28, 16, 4, '#2a1c0c'); p.r(0, 28, 16, 1, '#8a5e30');
  };
  FLOOR.U = function (p, tx, ty) {                       // mosaico verde agua con agua estancada
    var h = hash(tx, ty, 88), h2 = hash(tx, ty, 89), x, y;
    p.r(0, 0, 16, 16, '#2c5c5a');
    for (y = 0; y < 16; y += 4) for (x = 0; x < 16; x += 4) { p.r(x, y, 3, 3, ((x + y) >> 2 & 1) ? '#3c7a76' : '#46867f'); p.r(x, y, 3, 1, '#6cb0a6'); }
    p.dith(0, 0, 16, 16, '#143a3a', 5);
    if (h > 0.7) { p.ell(8, 8, 6, 4, '#18403f'); p.ell(7, 7, 4, 2, '#4a9a98'); p.p(5, 6, '#c8f0ec'); }                         // charco
    if (h < 0.07) { p.circ(8, 8, 4, '#0e2626'); p.circ(8, 8, 3, '#06121a'); p.r(5, 8, 7, 1, '#3c6a68'); p.r(8, 5, 1, 7, '#3c6a68'); }
    if (h2 > 0.93) { p.circ(5, 5, 2, '#d8f4f0'); p.circ(9, 4, 1.4, '#d8f4f0'); p.p(11, 7, '#d8f4f0'); }                   // espuma
  };
  FACE.U = function (p, tx) {                            // azulejo verde agua hasta el techo, chorreras y moho
    var x, y;
    p.r(0, 0, 16, 32, '#7ab4aa');
    for (y = 0; y < 28; y += 7) for (x = 0; x < 16; x += 8) { p.r(x, y, 8, 7, '#6ea8a0'); p.r(x, y, 8, 1, '#a8dcd2'); p.r(x, y, 1, 7, '#98ccc2'); p.r(x + 7, y, 1, 7, '#3c7a74'); p.r(x, y + 6, 8, 1, '#3c7a74'); }
    p.r(0, 13, 16, 2, '#1c4a4a'); p.r(0, 13, 16, 1, '#3c7a74');
    if (hash(tx, 19, 36) > 0.5) { p.r(5, 2, 2, 10, '#3c7a74'); p.dith(4, 8, 5, 5, '#2a5a4a', 3); }
    if (hash(tx, 20, 37) > 0.6) p.dith(2, 17, 12, 10, '#2a5a4a', 5);
    p.r(0, 28, 16, 4, '#1c4a4a'); p.r(0, 28, 16, 1, '#a8dcd2'); p.dith(0, 29, 16, 3, '#0e2a2a', 4);
  };
  FLOOR.I = function (p, tx, ty) {                       // linóleo a cuadros crema y verde oliva
    var a = (tx + ty) & 1, h = hash(tx, ty, 90), h2 = hash(tx, ty, 91);
    p.r(0, 0, 16, 16, a ? '#b4ac80' : '#6e7648');
    p.r(0, 0, 16, 1, '#3a3a22'); p.r(0, 0, 1, 16, '#3a3a22'); p.r(1, 1, 14, 1, a ? '#d4ccA0' : '#8a9460');
    p.dith(2, 2, 13, 13, a ? '#948c64' : '#566038', 3);
    if (h > 0.84) p.dith(2, 3, 12, 10, '#3a2a14', 4);
    if (h < 0.06) { p.circ(6, 8, 3, '#8a2a24'); p.circ(6, 8, 2, '#b0443a'); p.line(8, 9, 13, 12, '#8a2a24', 1); }          // salsa
    if (h2 > 0.94) { p.p(4, 5, '#f2ecd0'); p.p(5, 5, '#f2ecd0'); p.p(11, 11, '#f2ecd0'); }                               // migas
  };
  FACE.I = function (p, tx) {                            // papel mostaza con huellas de pollito, riel y friso verde
    var ox = (tx & 1) ? 3 : 10;
    p.r(0, 0, 16, 32, '#c8a43c'); p.dith(0, 0, 16, 13, '#dcb84c', 3); p.r(0, 0, 1, 13, '#8a6c1c');
    p.r(ox, 4, 1, 3, '#8a6c1c'); p.r(ox - 2, 5, 2, 1, '#8a6c1c'); p.r(ox + 1, 5, 2, 1, '#8a6c1c'); p.r(ox, 7, 1, 2, '#8a6c1c');
    p.r(0, 13, 16, 3, '#f2ecd0'); p.r(0, 13, 16, 1, '#ffffff'); p.r(0, 15, 16, 1, '#a89c70'); p.r(0, 16, 16, 1, '#2a2410');
    p.r(0, 17, 16, 11, '#4a5a30'); p.r(0, 17, 16, 1, '#6c8044'); p.r(2, 19, 12, 7, '#566838'); p.r(2, 25, 12, 1, '#2a3418');
    if (hash(tx, 21, 38) > 0.65) p.dith(3, 18, 10, 9, '#2a3418', 4);
    p.r(0, 28, 16, 4, '#2a3418'); p.r(0, 28, 16, 1, '#6c8044');
  };
  FLOOR.Y = function (p, tx, ty) {                       // alfombra amarilla de pelo corto con motas
    var h = hash(tx, ty, 92), h2 = hash(tx, ty, 93), i;
    p.r(0, 0, 16, 16, '#9a7c2c'); p.dith(0, 0, 16, 16, '#b4963c', 5); p.dith(0, 0, 16, 16, '#6e5618', 3);
    for (i = 0; i < 5; i++) p.p(((h * 91 + i * 37) | 0) % 15, ((h2 * 77 + i * 53) | 0) % 15, i % 2 ? '#d4b44c' : '#5a4612');
    if ((tx + ty) % 4 === 0) { p.r(7, 7, 2, 2, '#c8a43c'); p.p(7, 7, '#e8c85a'); }
    if (h > 0.9) p.dith(1, 3, 14, 9, '#3a2a0c', 4);
    if (h2 > 0.95) { p.line(3, 4, 6, 7, '#f2ecd0', 1); p.line(8, 9, 12, 6, '#f2ecd0', 1); }                              // plumas
  };
  FACE.Y = function (p, tx) {                            // papel amarillo pálido con plumas, espejo corrido y friso naranja
    var i, ox = (tx % 3) * 4 + 2;
    p.r(0, 0, 16, 32, '#e0c868'); p.dith(0, 0, 16, 13, '#f0dc84', 3); p.r(0, 0, 1, 13, '#a88a30');
    p.line(ox, 8, ox + 3, 3, '#f8f0c8', 1); p.line(ox + 3, 3, ox + 6, 6, '#f8f0c8', 1); p.p(ox + 3, 8, '#b8982c');
    p.r(0, 13, 16, 3, '#d8782c'); p.r(0, 13, 16, 1, '#f4a860'); p.r(0, 15, 16, 1, '#7a3a10'); p.r(0, 16, 16, 1, '#2a1808');
    p.r(0, 17, 16, 11, '#b8641e'); for (i = 0; i < 16; i += 4) { p.r(i, 17, 1, 11, '#7a3a10'); p.r(i + 1, 17, 1, 11, '#d8843a'); }
    p.dith(0, 17, 16, 11, '#7a3a10', 3);
    p.r(0, 28, 16, 4, '#4a2408'); p.r(0, 28, 16, 1, '#d8843a');
  };

  /* ================= TEMAS DE LA NOCHE 5 =================
     e pasillo oeste · a almacén y limpieza · b baños · m sala de máquinas · o objetos perdidos y guardia */
  FLOOR.e = function (p, tx, ty) {                       // linóleo verde sucio, rayado, con brillo de piso mojado
    var h = hash(tx, ty, 100), h2 = hash(tx, ty, 101), a = (tx + ty) & 1;
    p.r(0, 0, 16, 16, a ? '#566458' : '#4e5c52');
    p.r(0, 0, 16, 1, '#232c26'); p.r(0, 0, 1, 16, '#232c26'); p.r(1, 1, 14, 1, '#6c7c6e'); p.r(1, 1, 1, 14, '#64745f');
    p.dith(3, 3, 11, 11, '#3e4a40', 3);
    if (ty % 8 === 0) { p.r(0, 7, 16, 2, '#b89a1c'); p.r(0, 7, 16, 1, '#e8cc4c'); }                // franja de seguridad
    if (h > 0.8) p.line(2, 12, 12, 4, '#2e382f', 1);                                              // rayón
    if (h2 > 0.88) { p.ell(8, 8, 6, 3, 'rgba(170,210,230,0.28)'); p.ell(7, 7, 3, 1, 'rgba(230,246,255,0.35)'); }   // charco brillante
    if (h2 < 0.05) p.dith(2, 2, 12, 12, '#2a2418', 4);
  };
  FACE.e = function (p, tx) {                            // pintura verde apagada, franja de azulejo oscuro y zócalo amarillo
    var i;
    p.r(0, 0, 16, 32, '#72826f'); p.dith(0, 0, 16, 13, '#869682', 3); p.r(0, 0, 1, 13, '#52614f');
    if (hash(tx, 0, 102) > 0.6) p.dith(3, 0, 9, 8, '#4a5a48', 4);                                // humedad
    p.r(0, 13, 16, 3, '#2c4a3a'); p.r(0, 13, 16, 1, '#58806a'); p.r(0, 15, 16, 1, '#0e1c14'); p.r(0, 16, 16, 1, '#1a2a22');
    p.r(0, 17, 16, 11, '#3a5a48'); for (i = 0; i < 16; i += 8) p.r(i, 17, 1, 11, '#1e3228');
    p.r(0, 22, 16, 1, '#1e3228'); p.r(0, 17, 16, 1, '#6a9a80'); p.dith(0, 17, 16, 11, '#4a6e58', 4);
    p.r(0, 28, 16, 4, '#b89a1c'); p.r(0, 28, 16, 1, '#f0d85a'); p.r(0, 31, 16, 1, '#4a3a08');
    for (i = 0; i < 16; i += 6) p.r(i + (tx & 1) * 2, 29, 3, 2, '#1a1408');
  };
  FLOOR.a = function (p, tx, ty) {                       // concreto frío con grietas y líneas amarillas de tarima
    var h = hash(tx, ty, 103), h2 = hash(tx, ty, 104);
    p.r(0, 0, 16, 16, '#686c72'); p.r(0, 0, 16, 1, '#2c2e34'); p.r(0, 0, 1, 16, '#2c2e34'); p.r(1, 1, 14, 1, '#80858c');
    p.dith(2, 2, 13, 13, '#585c62', 3); p.dith(2, 2, 13, 13, '#7a7e84', 2);
    if (h > 0.85) { p.r(0, 14, 16, 2, '#b89a1c'); p.r(0, 14, 16, 1, '#e8cc4c'); }
    if (h < 0.07) { p.line(2, 14, 8, 8, '#25272c', 1); p.line(8, 8, 13, 9, '#25272c', 1); p.line(8, 8, 9, 3, '#25272c', 1); }
    if (h2 > 0.94) p.dith(1, 2, 14, 12, '#3a2c1c', 4);
  };
  FACE.a = function (p, tx) {                            // bloque de concreto gris con banda amarilla y negra
    var y, off;
    p.r(0, 0, 16, 32, '#7e838a');
    for (y = 0; y < 13; y += 6) { off = ((y / 6) & 1) ? 8 : 0; p.r(0, y + 5, 16, 1, '#4e5258'); p.r((off + 7) % 16, y, 1, 5, '#4e5258'); p.r(0, y, 16, 1, '#969ba2'); }
    p.dith(0, 0, 16, 13, '#6a6f76', 4);
    p.r(0, 13, 16, 3, '#d8b414'); p.r(0, 13, 16, 1, '#fff078'); p.r(0, 15, 16, 1, '#7a6408');
    for (y = 0; y < 16; y += 4) p.poly([y, 13, y + 2, 13, y + 4, 16, y + 2, 16], '#1a1408');
    p.r(0, 16, 16, 1, '#1c1e22');
    for (y = 17; y < 28; y += 6) { off = ((y / 6) & 1) ? 8 : 0; p.r(0, y + 5, 16, 1, '#4e5258'); p.r((off + 3) % 16, y, 1, 5, '#4e5258'); p.r(0, y, 16, 1, '#8c9198'); }
    p.dith(0, 17, 16, 11, '#6a6f76', 3);
    if (hash(tx, 17, 105) > 0.6) p.dith(4, 0, 8, 28, '#4a4e54', 5);
    p.r(0, 28, 16, 4, '#2c2e34'); p.r(0, 28, 16, 1, '#5a5e66');
  };
  FLOOR.b = function (p, tx, ty) {                       // mosaico blanco y celeste con juntas sucias
    var h = hash(tx, ty, 106), h2 = hash(tx, ty, 107), i, j;
    p.r(0, 0, 16, 16, '#9aa8ae');
    for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) {
      p.r(1 + i * 8, 1 + j * 8, 7, 7, ((tx * 2 + i + ty * 2 + j) & 1) ? '#dcecf0' : '#bcd4dc');
      p.r(1 + i * 8, 1 + j * 8, 7, 1, '#f8feff'); p.r(1 + i * 8, 1 + j * 8, 1, 7, '#f0fafc');
    }
    if (h > 0.84) p.dith(1, 1, 14, 14, '#7a8a90', 4);
    if (h < 0.06) p.line(2, 3, 12, 13, '#4a5a60', 1);
    if (h2 > 0.9) { p.ell(8, 8, 6, 3, 'rgba(90,150,190,0.4)'); p.ell(7, 7, 3, 1, 'rgba(240,250,255,0.5)'); }
    if (h2 < 0.02) { p.r(5, 5, 5, 3, '#6a1c18'); p.r(6, 5, 3, 1, '#a8382c'); }
  };
  FACE.b = function (p, tx) {                            // azulejo blanco con franja azul marino
    var i, j;
    p.r(0, 0, 16, 32, '#d8e8ec');
    for (j = 0; j < 13; j += 6) for (i = 0; i < 16; i += 8) { p.r(i, j, 8, 1, '#f8feff'); p.r(i, j, 1, 6, '#f4fcfe'); p.r(i + 7, j, 1, 6, '#9ab0b8'); p.r(i, j + 5, 8, 1, '#9ab0b8'); }
    if (hash(tx, 0, 108) > 0.65) p.dith(2, 0, 11, 13, '#a8bcc2', 4);
    p.r(0, 13, 16, 3, '#1c3a6a'); p.r(0, 13, 16, 1, '#4a78b8'); p.r(0, 15, 16, 1, '#0a1a38'); p.r(0, 16, 16, 1, '#7a92a0');
    for (j = 17; j < 28; j += 6) for (i = 0; i < 16; i += 8) { p.r(i, j, 8, 1, '#f0fafc'); p.r(i, j, 1, 6, '#eaf6fa'); p.r(i + 7, j, 1, 6, '#8aa0a8'); p.r(i, j + 5, 8, 1, '#8aa0a8'); }
    if (hash(tx, 1, 109) > 0.7) { p.r(6, 18, 1, 9, '#6a5a2c'); p.p(6, 27, '#8a7a44'); }       // chorrera de óxido
    p.r(0, 28, 16, 4, '#56707c'); p.r(0, 28, 16, 1, '#a8c4d0');
  };
  FLOOR.m = function (p, tx, ty) {                       // chapa de acero con rombos, aceite y remaches
    var h = hash(tx, ty, 110), h2 = hash(tx, ty, 111), i;
    p.r(0, 0, 16, 16, '#3c424a'); p.r(0, 0, 16, 1, '#14171c'); p.r(0, 0, 1, 16, '#14171c'); p.r(1, 1, 14, 1, '#58616c');
    for (i = 0; i < 3; i++) { p.line(2 + i * 5, 13, 6 + i * 5, 3, '#5a646f', 1); p.line(5 + i * 5, 13, 9 + i * 5, 3, '#2a3036', 1); }
    p.p(2, 2, '#8a94a0'); p.p(13, 2, '#8a94a0'); p.p(2, 13, '#22272d'); p.p(13, 13, '#22272d');
    if (h > 0.82) p.dith(2, 2, 12, 12, '#16110a', 3);                                             // aceite
    if (h < 0.06) { p.r(0, 6, 16, 3, '#b3601c'); p.r(0, 6, 16, 1, '#f0a050'); }                    // línea naranja
    if (h2 > 0.94) { p.ell(8, 9, 5, 2.4, 'rgba(60,140,200,0.35)'); }
  };
  FACE.m = function (p, tx) {                            // chapa gris oscura con tubería naranja y remaches
    var i;
    p.r(0, 0, 16, 32, '#4a5058'); p.dith(0, 0, 16, 13, '#5c636c', 3); p.r(0, 0, 1, 13, '#2a2e34');
    for (i = 0; i < 16; i += 5) { p.p(i + 1, 2, '#8a94a0'); p.p(i + 1, 10, '#8a94a0'); }
    p.r(0, 13, 16, 5, C.ink); p.r(0, 14, 16, 3, '#c8641c'); p.r(0, 14, 16, 1, '#ffb060'); p.r(0, 16, 16, 1, '#7a3a0c');
    if (tx % 4 === 0) { p.r(5, 12, 4, 7, C.ink); p.r(6, 12, 2, 7, '#8a94a0'); }                   // brida
    p.r(0, 18, 16, 10, '#3a4046'); p.r(0, 18, 16, 1, '#5a626c'); for (i = 0; i < 16; i += 8) p.r(i, 19, 1, 9, '#1e2226');
    p.dith(0, 18, 16, 10, '#2c3238', 3);
    if (hash(tx, 18, 112) > 0.6) p.dith(3, 0, 9, 28, '#1a1c20', 5);
    p.r(0, 28, 16, 4, '#1c1f24'); p.r(0, 28, 16, 1, '#4a525c');
  };
  FLOOR.o = function (p, tx, ty) {                       // alfombra gris azulada gastada con motas
    var h = hash(tx, ty, 113), h2 = hash(tx, ty, 114), i;
    p.r(0, 0, 16, 16, '#4c5a6c'); p.dith(0, 0, 16, 16, '#5e6e82', 5); p.dith(0, 0, 16, 16, '#3a4656', 3);
    for (i = 0; i < 5; i++) p.p(((h * 91 + i * 37) | 0) % 15, ((h2 * 77 + i * 53) | 0) % 15, i % 2 ? '#7a8aa0' : '#2e3846');
    if ((tx + ty) % 3 === 0) { p.r(0, 7, 16, 1, '#3a4656'); p.r(7, 0, 1, 16, '#3a4656'); }
    if (h > 0.9) p.dith(1, 3, 14, 9, '#1c222c', 4);
    if (h2 > 0.95) { p.r(4, 5, 5, 3, '#8a6aa0'); p.r(5, 5, 2, 1, '#b890d0'); }                      // peluche perdido
  };
  FACE.o = function (p, tx) {                            // papel crema con rayas azules y friso de madera
    var i;
    p.r(0, 0, 16, 32, '#c8b898'); p.dith(0, 0, 16, 13, '#d8ccac', 3); p.r(0, 0, 1, 13, '#8a7c5c');
    for (i = 3; i < 16; i += 8) { p.r(i, 0, 2, 13, '#7a8aa8'); p.r(i, 0, 1, 13, '#9aaac4'); }
    p.r(0, 13, 16, 3, '#4a3a2a'); p.r(0, 13, 16, 1, '#8a6e4a'); p.r(0, 15, 16, 1, '#1c140c'); p.r(0, 16, 16, 1, '#2a2018');
    p.r(0, 17, 16, 11, '#6a5238'); for (i = 0; i < 16; i += 5) { p.r(i, 17, 1, 11, '#3e2e1c'); p.r(i + 1, 17, 1, 11, '#8a6e4a'); }
    p.dith(0, 17, 16, 11, '#4a3a28', 3);
    p.r(0, 28, 16, 4, '#2a2018'); p.r(0, 28, 16, 1, '#6a5238');
  };

  /* ================= TEMAS DE LA NOCHE 6 =================
     h pasillo de servicio · q sala de cabezas · u almacén de partes · w taller · v oficina de servicio · y vestidor */
  FLOOR.h = function (p, tx, ty) {                       // loseta gris azulada con juntas, franja amarilla y manchas
    var h = hash(tx, ty, 120), h2 = hash(tx, ty, 121), a = (tx + ty) & 1;
    p.r(0, 0, 16, 16, a ? '#3a4558' : '#343e50'); p.r(0, 0, 16, 1, '#1c222e'); p.r(0, 0, 1, 16, '#1c222e'); p.r(1, 1, 14, 1, a ? '#4a5870' : '#424e64');
    p.p(2, 2, '#1c222e'); p.p(13, 13, '#1c222e');
    if (ty % 4 === 0) { p.r(0, 13, 16, 2, '#9a7a1c'); p.r(0, 13, 16, 1, '#d8b030'); }
    if (h > 0.8) p.dith(2, 3, 12, 10, '#161b26', 4);
    if (h < 0.06) p.line(3, 12, 12, 3, '#161b26', 1);
    if (h2 > 0.94) { p.ell(8, 8, 5, 2.4, 'rgba(210,150,60,0.28)'); }
  };
  FACE.h = function (p, tx) {                            // panel perforado azul pizarra con riel de acero y zócalo
    var i, j;
    p.r(0, 0, 16, 32, '#2e3a52'); p.r(0, 0, 1, 13, '#202a3e');
    for (j = 2; j < 12; j += 3) for (i = 2; i < 16; i += 4) p.p(i, j, '#161d2c');
    p.r(0, 13, 16, 3, '#6a7a96'); p.r(0, 13, 16, 1, '#a4b4cc'); p.r(0, 15, 16, 1, '#2a3244');
    p.r(0, 16, 16, 12, '#26304a'); for (i = 0; i < 16; i += 8) { p.r(i, 16, 1, 12, '#161d2c'); p.r(i + 1, 16, 1, 12, '#34415e'); }
    p.dith(0, 16, 16, 12, '#1c2438', 3);
    if (hash(tx, 12, 122) > 0.65) p.dith(3, 0, 9, 28, '#141a28', 5);
    p.r(0, 28, 16, 4, '#161c2a'); p.r(0, 28, 16, 1, '#4a5a78');
  };
  FLOOR.q = function (p, tx, ty) {                       // alfombra burdeos con rombos dorados gastados
    var h = hash(tx, ty, 123), h2 = hash(tx, ty, 124);
    p.r(0, 0, 16, 16, '#4a1a28'); p.dith(0, 0, 16, 16, '#5e2434', 5); p.dith(0, 0, 16, 16, '#340f1a', 3);
    p.poly([8, 1, 15, 8, 8, 15, 1, 8], '#8a6a2a'); p.poly([8, 3, 13, 8, 8, 13, 3, 8], '#4a1a28'); p.p(8, 8, '#c8a048');
    if (h > 0.86) p.dith(1, 1, 14, 14, '#220a10', 4);
    if (h2 > 0.93) { p.r(4, 10, 6, 1, '#6a5a58'); p.r(5, 11, 4, 1, '#8a7a76'); }
    if (h2 < 0.03) p.ell(8, 8, 4, 2, 'rgba(20,6,10,0.6)');
  };
  FACE.q = function (p, tx) {                            // terciopelo burdeos acolchado con botones y moldura dorada
    var i, j;
    p.r(0, 0, 16, 32, '#5a1a2c'); p.r(0, 0, 1, 13, '#3a0f1c');
    for (j = 3; j < 13; j += 6) for (i = (j % 12 === 3 ? 4 : 12); i < 16; i += 8) { p.r(i - 1, j - 1, 3, 3, '#7a2a40'); p.p(i, j, '#c8a048'); }
    p.r(0, 13, 16, 3, '#8a6a2a'); p.r(0, 13, 16, 1, '#e0c068'); p.r(0, 15, 16, 1, '#3a2a0c');
    p.r(0, 16, 16, 12, '#3e1220'); for (i = 0; i < 16; i += 4) p.r(i, 16, 1, 12, '#2a0a14');
    p.dith(0, 16, 16, 12, '#2a0a14', 3);
    if (hash(tx, 13, 125) > 0.7) p.dith(2, 0, 11, 28, '#1e060e', 5);
    p.r(0, 28, 16, 4, '#2a0a14'); p.r(0, 28, 16, 1, '#6a4a22');
  };
  FLOOR.u = function (p, tx, ty) {                       // tablones de tarima claros con clavos y marcas de cajas
    var h = hash(tx, ty, 126), h2 = hash(tx, ty, 127), j;
    p.r(0, 0, 16, 16, '#8a6c44');
    for (j = 0; j < 16; j += 5) { p.r(0, j, 16, 1, '#4a3820'); p.r(0, j + 1, 16, 1, '#a68858'); }
    p.p(2, 2, '#3a2c18'); p.p(13, 7, '#3a2c18'); p.p(5, 12, '#3a2c18');
    if (h > 0.84) p.dith(1, 1, 14, 14, '#5a4428', 4);
    if (h < 0.1) { p.r(2, 3, 12, 9, '#7a5c36'); p.r(2, 3, 12, 1, '#5a4428'); p.r(2, 11, 12, 1, '#5a4428'); }
    if (h2 > 0.95) p.r(3, 6, 9, 2, '#d8d0a0');
  };
  FACE.u = function (p, tx) {                            // chapa acanalada verde oliva con franja de estarcido
    var i;
    p.r(0, 0, 16, 32, '#3e4a32'); for (i = 0; i < 16; i += 4) { p.r(i, 0, 1, 28, '#2a3422'); p.r(i + 2, 0, 1, 28, '#566444'); }
    p.r(0, 0, 16, 1, '#6a7a58');
    p.r(0, 13, 16, 4, '#1c2214'); p.r(0, 14, 16, 2, '#c8a028'); p.r(0, 14, 16, 1, '#f0d058');
    if (tx % 3 === 0) { p.r(3, 5, 10, 5, '#c8d0a8'); p.r(4, 6, 8, 1, '#3e4a32'); p.r(4, 8, 5, 1, '#3e4a32'); }     // etiqueta
    p.dith(0, 17, 16, 11, '#2a3422', 3);
    if (hash(tx, 14, 128) > 0.65) p.dith(3, 0, 9, 28, '#161c10', 5);
    p.r(0, 28, 16, 4, '#1c2214'); p.r(0, 28, 16, 1, '#566444');
  };
  FLOOR.w = function (p, tx, ty) {                       // tablones oscuros con viruta, aceite y chispas de soldadura
    var h = hash(tx, ty, 129), h2 = hash(tx, ty, 130), j;
    p.r(0, 0, 16, 16, '#3c3228');
    for (j = 0; j < 16; j += 8) { p.r(0, j, 16, 1, '#1c160e'); p.r(0, j + 1, 16, 1, '#4e4234'); }
    p.r(((tx * 7 + ty * 3) % 12) + 2, 4, 1, 4, '#1c160e');
    if (h > 0.76) p.dith(1, 1, 14, 14, '#161008', 4);
    if (h2 > 0.82) { p.p(3, 5, '#a0a8b0'); p.p(9, 11, '#c8d0d8'); p.p(12, 3, '#a0a8b0'); p.p(6, 9, '#d8a040'); }
    if (h < 0.05) p.r(2, 7, 11, 2, '#b0905a');
    if (h2 < 0.04) p.ell(8, 8, 5, 2.4, 'rgba(10,8,4,0.6)');
  };
  FACE.w = function (p, tx) {                            // chapa verde azulada remachada con tubería de cobre
    var i;
    p.r(0, 0, 16, 32, '#2e4a52'); p.dith(0, 0, 16, 13, '#3a5a64', 4); p.r(0, 0, 1, 13, '#1c2e34');
    for (i = 0; i < 16; i += 5) { p.p(i + 1, 2, '#8ab0b8'); p.p(i + 1, 10, '#8ab0b8'); }
    p.r(0, 13, 16, 5, C.ink); p.r(0, 14, 16, 3, '#b0642c'); p.r(0, 14, 16, 1, '#f0a868'); p.r(0, 16, 16, 1, '#6a3410');
    if (tx % 4 === 1) { p.r(5, 12, 4, 7, C.ink); p.r(6, 12, 2, 7, '#8ab0b8'); }
    p.r(0, 18, 16, 10, '#26383e'); p.r(0, 18, 16, 1, '#4a6a74'); for (i = 0; i < 16; i += 8) p.r(i, 19, 1, 9, '#141e22');
    if (hash(tx, 15, 131) > 0.6) p.dith(3, 0, 9, 28, '#10181a', 5);
    p.r(0, 28, 16, 4, '#141e22'); p.r(0, 28, 16, 1, '#3a5660');
  };
  FLOOR.v = function (p, tx, ty) {                       // linóleo gris verdoso a cuadros, rayado
    var h = hash(tx, ty, 132), h2 = hash(tx, ty, 133), a = (tx + ty) & 1;
    p.r(0, 0, 16, 16, a ? '#3c4a44' : '#34403a'); p.r(0, 0, 16, 1, '#1e2622'); p.r(0, 0, 1, 16, '#1e2622'); p.r(1, 1, 14, 1, a ? '#4e5e56' : '#46544c');
    if (h > 0.8) p.dith(2, 3, 12, 10, '#18201c', 4);
    if (h < 0.08) p.line(2, 13, 13, 4, '#18201c', 1);
    if (h2 > 0.93) { p.r(4, 8, 7, 1, '#6a7a72'); p.r(6, 9, 4, 1, '#222c28'); }
    if (h2 < 0.04) p.ell(8, 8, 4, 2, 'rgba(60,200,120,0.16)');
  };
  FACE.v = function (p, tx) {                            // pared crema sucia sobre friso verde bosque
    var i;
    p.r(0, 0, 16, 32, '#b8b49c'); p.dith(0, 0, 16, 13, '#c8c4aa', 3); p.r(0, 0, 1, 13, '#8a8670');
    if (hash(tx, 16, 134) > 0.6) p.dith(3, 0, 9, 13, '#9a967e', 4);
    p.r(0, 13, 16, 3, '#e0dcc4'); p.r(0, 13, 16, 1, '#f4f0dc'); p.r(0, 15, 16, 1, '#6a6650');
    p.r(0, 16, 16, 12, '#2e5a44'); for (i = 0; i < 16; i += 8) { p.r(i, 16, 1, 12, '#1c3a2a'); p.r(i + 1, 16, 1, 12, '#3e7258'); }
    p.dith(0, 16, 16, 12, '#1c3a2a', 3);
    p.r(0, 28, 16, 4, '#1c3a2a'); p.r(0, 28, 16, 1, '#4a8266');
  };
  FLOOR.y = function (p, tx, ty) {                       // parquet de espiga gastado
    var h = hash(tx, ty, 135), h2 = hash(tx, ty, 136), i;
    p.r(0, 0, 16, 16, '#7a5a44');
    for (i = 0; i < 16; i += 4) { p.r(i, 0, 1, 16, '#3e2c20'); p.r(i + 1, 0, 1, 16, '#9a7a5c'); p.r(i + (((tx + ty) & 1) ? 2 : 0), 8, 2, 1, '#3e2c20'); }
    if (h > 0.84) p.dith(1, 1, 14, 14, '#4e3828', 4);
    if (h < 0.05) p.line(2, 2, 12, 13, '#2a1c12', 1);
    if (h2 > 0.95) { p.r(3, 5, 9, 1, '#d8b0c0'); p.r(4, 6, 6, 1, '#a07888'); }
  };
  FACE.y = function (p, tx) {                            // papel rosa viejo a rayas con friso crema
    var i;
    p.r(0, 0, 16, 32, '#8a5a6a'); for (i = 0; i < 16; i += 6) { p.r(i, 0, 2, 13, '#a47486'); }
    p.dith(0, 0, 16, 13, '#6a4050', 3); p.r(0, 0, 1, 13, '#5a3442');
    if (hash(tx, 17, 137) > 0.65) p.dith(3, 0, 9, 13, '#5a3442', 4);
    p.r(0, 13, 16, 3, '#d8c8a8'); p.r(0, 13, 16, 1, '#f4e8cc'); p.r(0, 15, 16, 1, '#6a5a40');
    p.r(0, 16, 16, 12, '#5a3a46'); for (i = 0; i < 16; i += 8) { p.r(i, 16, 1, 12, '#3a2430'); p.r(i + 1, 16, 1, 12, '#7a5262'); }
    p.r(0, 28, 16, 4, '#3a2430'); p.r(0, 28, 16, 1, '#7a5262');
  };

  /* ================= TEMAS DE LA NOCHE 7 =================
     g pasillos rotos · r cuarto de Golden · n ventilación */
  FLOOR.g = function (p, tx, ty) {                       // damero casi negro con tinte rojo, grietas y manchas
    var h = hash(tx, ty, 200), h2 = hash(tx, ty, 201), a = (tx + ty) & 1;
    p.r(0, 0, 16, 16, a ? '#2a1c2e' : '#221625');
    p.r(0, 0, 16, 1, '#120a16'); p.r(0, 0, 1, 16, '#120a16'); p.r(1, 1, 14, 1, a ? '#3a2640' : '#2f1f36');
    if (h > 0.7) p.dith(2, 3, 12, 10, '#0c060e', 5);
    if (h < 0.12) p.line(2, 3, 12, 13, '#0c060e', 1);
    if (h2 > 0.9) { p.r(3, 9, 8, 2, '#4a0f1a'); p.r(4, 9, 3, 1, '#6b1a28'); }
    if (h2 < 0.05) p.dith(1, 1, 14, 14, '#05030a', 9);
  };
  FACE.g = function (p, tx) {                            // papel malva rasgado con chorreras rojas y friso oscuro
    p.r(0, 0, 16, 32, '#3a2a46'); p.dith(0, 0, 16, 12, '#4c3a5a', 4); p.r(0, 0, 1, 28, '#251a2e');
    p.r(0, 13, 16, 2, '#6a3a4a'); p.r(0, 15, 16, 1, '#1a1020');
    p.r(0, 16, 16, 12, '#2a1c34'); p.r(2, 18, 12, 8, '#33223e'); p.r(2, 18, 12, 1, '#432e50'); p.r(2, 25, 12, 1, '#1a1020');
    p.r(0, 28, 16, 4, '#150c1a'); p.r(0, 28, 16, 1, '#4a2a3a');
    if (hash(tx, 3, 210) > 0.7) { p.r(6, 2, 1, 10, '#5a1020'); p.p(6, 12, '#7a1a2c'); }
    if (hash(tx, 3, 211) > 0.8) p.dith(3, 0, 10, 12, '#120a18', 6);
  };
  FLOOR.r = function (p, tx, ty) {                       // damero rojo oscuro y negro, quemado y agrietado
    var h = hash(tx, ty, 202), h2 = hash(tx, ty, 203), a = (tx + ty) & 1;
    p.r(0, 0, 16, 16, a ? '#4a1620' : '#1c1218');
    p.r(0, 0, 16, 1, '#0e080c'); p.r(0, 0, 1, 16, '#0e080c'); p.r(1, 1, 14, 1, a ? '#62202e' : '#2a1c24');
    p.dith(2, 2, 13, 13, '#0e080c', 3);
    if (h > 0.8) { p.circ(8, 8, 5, '#0a0508'); p.dith(2, 2, 12, 12, '#2a0c12', 5); }
    if (h < 0.1) p.line(1, 5, 14, 11, '#0a0508', 1);
    if (h2 > 0.93) p.r(3, 7, 9, 2, '#6a5014');
  };
  FACE.r = function (p, tx) {                            // paneles vino con moldura dorada y zócalo negro
    var i;
    p.r(0, 0, 16, 32, '#4a1a26'); for (i = 0; i < 16; i += 8) p.r(i, 0, 1, 13, '#2e0e16');
    p.dith(0, 0, 16, 13, '#2e0e16', 3); p.r(0, 0, 1, 28, '#2e0e16');
    p.r(0, 13, 16, 2, '#8a6a1c'); p.r(0, 13, 16, 1, '#c8a02c'); p.r(0, 15, 16, 1, '#1e1006');
    p.r(0, 16, 16, 12, '#321018'); p.r(2, 18, 12, 8, '#3e161f'); p.r(2, 18, 12, 1, '#54222e'); p.r(2, 25, 12, 1, '#1e0a0e');
    p.r(0, 28, 16, 4, '#12080c'); p.r(0, 28, 16, 1, '#5a2a30');
    if (hash(tx, 3, 212) > 0.75) p.dith(3, 0, 10, 12, '#0e060a', 6);
  };
  FLOOR.n = function (p, tx, ty) {                       // rejilla de acero con remaches y óxido
    var h = hash(tx, ty, 204), h2 = hash(tx, ty, 205), i;
    p.r(0, 0, 16, 16, '#2e343c');
    p.r(0, 0, 16, 1, '#12161a'); p.r(0, 0, 1, 16, '#12161a'); p.r(1, 1, 14, 1, '#4a525c');
    for (i = 3; i < 15; i += 4) { p.r(i, 3, 2, 10, '#10141a'); p.r(i, 3, 2, 1, '#3a424c'); }
    p.p(2, 2, '#6a727c'); p.p(13, 13, '#6a727c');
    if (h > 0.8) p.dith(1, 1, 14, 14, '#5a2a12', 4);
    if (h < 0.08) p.dith(1, 1, 14, 14, '#05030a', 8);
    if (h2 > 0.94) { p.r(4, 6, 8, 3, '#4a0f1a'); }
  };
  FACE.n = function (p, tx) {                            // chapa acanalada gris con óxido y tubo rojo
    var i;
    p.r(0, 0, 16, 32, '#4a525c'); for (i = 1; i < 16; i += 4) { p.r(i, 0, 1, 13, '#6a727c'); p.r(i + 2, 0, 1, 13, '#2a3036'); }
    p.r(0, 0, 1, 28, '#2a3036');
    p.r(0, 13, 16, 3, '#6b0f1c'); p.r(0, 13, 16, 1, '#b3182b'); p.r(0, 15, 16, 1, '#2e060c');
    p.r(0, 16, 16, 12, '#3a424c'); for (i = 0; i < 16; i += 8) { p.r(i, 16, 1, 12, '#222830'); p.r(i + 1, 16, 1, 12, '#5a626c'); }
    p.r(0, 28, 16, 4, '#1a1e24'); p.r(0, 28, 16, 1, '#5a626c');
    if (hash(tx, 3, 213) > 0.6) p.dith(2, 0, 12, 13, '#5a2a12', 4);
  };

  G.TILES = { T: T, hash: hash, FLOOR: FLOOR, FACE: FACE, cap: cap, jamb: jamb };
})(window);
