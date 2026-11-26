/* maps.js — mapas de las noches en modo exploración.
   Coordenadas en baldosas de 16 px. Cada banda de pared mide 3 filas (tapa + 2 de cara).
   B.prop(nombre, tx, ty, opciones): (tx, ty) = esquina inferior izquierda; ox/oy mueven en píxeles. */
(function (G) {
  'use strict';
  var MAPS = G.MAPS = G.MAPS || {};

  /* ============================================================ */
  /*  NOCHE 1: pasillo central con cuartos al norte y al sur       */
  /* ============================================================ */
  MAPS.noche1 = {
    cols: 64, rows: 36,
    build: function (B) {
      var T = 16;
      // ---- cuartos ----
      var HALL = B.room('pasillo', 'Pasillo', 3, 18, 60, 21, 'H', { ambient: 0.9, color: '#4a4470', hall: true });
      var SEC = B.room('seg', 'Oficina de seguridad', 3, 7, 14, 14, 'S', { ambient: 0.5, color: '#4a6a8a', alwaysVisible: true });
      var FIE = B.room('fiestas', 'Sala de fiestas', 18, 7, 35, 14, 'F', { ambient: 0.86, color: '#c4407e' });
      var GER = B.room('gerente', 'Oficina del gerente', 39, 7, 50, 14, 'W', { ambient: 0.84, color: '#8a5a34' });
      var COC = B.room('cocina', 'Cocina', 3, 25, 16, 32, 'K', { ambient: 0.82, color: '#9aaec9' });
      var ALM = B.room('almacen', 'Almacén', 20, 25, 29, 32, 'C', { ambient: 0.9, color: '#6a7080' });
      var ARC = B.room('arcade', 'Sala de juegos', 33, 25, 48, 32, 'A', { ambient: 0.74, color: '#6a4ad0' });
      // ---- puertas (3 filas de espesor) ----
      B.door(8, 15, 9, 17); B.door(26, 15, 27, 17); B.door(44, 15, 45, 17);
      B.door(9, 22, 10, 24); B.door(24, 22, 25, 24); B.door(40, 22, 41, 24);
      B.start = [7 * T + 8, 11 * T + 14];
      B.spawn(58 * T, 20 * T + 8); B.spawn(47 * T, 29 * T);

      // ======================= PASILLO =======================
      [7, 13, 22, 30, 38, 47, 53, 58].forEach(function (sx, i) {
        B.wall('sconce', sx, 16, { ox: 2, oy: 6 });
        B.light(sx * T + 8, 18 * T + 2, 48, '#ffe9a0', { flick: 0.6 + i * 0.13, clip: HALL });
      });
      B.wall('plate', 6, 16, { ox: 0, oy: 8, text: 'SEGURIDAD' });
      B.wall('plate', 21, 16, { ox: 4, oy: 8, text: 'SALA DE FIESTAS' });
      B.wall('plate', 40, 16, { ox: 2, oy: 8, text: 'GERENTE' });
      B.wall('posterA', 16, 16, { ox: 0, oy: 4 });
      B.wall('kidDraw', 33, 16, { ox: 0, oy: 6 });
      B.wall('notice', 36, 16, { ox: 2, oy: 6 });
      B.wall('fireExt', 24, 16, { ox: 0, oy: 8 });
      B.wall('exitSign', 59, 16, { ox: -6, oy: 0 });
      B.wall('vent', 49, 16, { ox: 0, oy: 8 });
      B.wall('clock', 11, 16, { ox: 0, oy: 4 });
      B.wall('posterA', 51, 16, { ox: 0, oy: 4 });
      B.wall('notice', 4, 16, { ox: 0, oy: 6 });
      B.decorPx('doormat', 9 * T - 2, 21 * T + 3, { text: 'COCINA' });
      B.decorPx('doormat', 24 * T - 2, 21 * T + 3, { text: 'ALMACEN' });
      B.decorPx('doormat', 40 * T - 2, 21 * T + 3, { text: 'JUEGOS' });
      B.decorPx('hazard', 8 * T, 17 * T + 12, {}); B.decorPx('hazard', 26 * T, 17 * T + 12, {}); B.decorPx('hazard', 44 * T, 17 * T + 12, {});
      B.decorPx('arrowFloor', 20 * T, 19 * T, {}); B.decorPx('stain', 33 * T, 19 * T + 4, {}); B.decorPx('stain', 15 * T, 20 * T, {}); B.decorPx('stain', 50 * T, 19 * T, {});
      B.decorPx('puddle', 28 * T, 20 * T, {});
      B.prop('plant', 3, 19, {}); B.prop('fountain', 5, 19);
      B.prop('bench', 12, 19); B.prop('bench', 33, 19); B.prop('bench', 54, 19);
      B.prop('trashC', 17, 19, { ox: 2 }); B.prop('trashC', 48, 19, {});
      B.prop('wetsign', 22, 20, {}); B.prop('mopBucket', 36, 22, {}); B.prop('wetsign', 56, 22, { ox: 2 });
      B.prop('plant', 59, 19, {});

      // ======================= OFICINA DE SEGURIDAD =======================
      B.decorPx('rugO', 5 * T + 8, 10 * T + 4, {}); B.decorPx('cables', 6 * T, 9 * T + 4, {});
      B.wall('corkboard', 3, 5, { ox: 4, oy: 8 }); B.wall('camMon', 7, 5, { ox: 2, oy: 4 }); B.wall('clock', 6, 5, { ox: 0, oy: 6 });
      B.wall('hazard', 11, 6, { ox: 0, oy: 12 });
      B.prop('cabinet', 3, 8); B.prop('cabinet', 4, 8);
      B.prop('locker', 13, 8); B.prop('locker', 14, 8, { v: 'b' });
      B.prop('deskL', 6, 9);
      B.prop('crt', 7, 8, { ox: 2, oy: -5, sb: 144.5 });
      B.prop('crt', 9, 8, { ox: -1, oy: -5, sb: 144.5 });
      B.prop('phone', 6, 8, { ox: 8, oy: -3, sb: 144.5, act: { id: 'phone', name: 'Teléfono', zone: [-20, 8, 60, 46] } });
      B.prop('fan', 10, 8, { ox: -2, oy: -2, sb: 144.5 });
      B.prop('chairO', 8, 11, { ox: -1 });
      B.prop('doorPanel', 11, 7, { ox: 0, act: { id: 'panel', name: 'Panel de la puerta', zone: [-6, 6, 36, 40] } });
      B.prop('trash', 3, 13, { ox: 2 }); B.prop('plant', 3, 15, {}); B.prop('coffee', 12, 15, {});
      B.light(8 * T, 9 * T, 72, '#cfeedd', { clip: SEC });

      // ======================= SALA DE FIESTAS =======================
      B.decorPx('rugParty', 23 * T, 10 * T, {});
      B.decorPx('confetti', 20 * T, 9 * T, {}); B.decorPx('confetti', 30 * T, 12 * T, {}); B.decorPx('confetti', 25 * T, 13 * T, {}); B.decorPx('spill', 22 * T, 12 * T + 8, {});
      B.decorPx('bannerL', 18 * T + 6, 5 * T + 2, {}); B.decorPx('bannerR', 30 * T + 4, 5 * T + 2, {});
      B.prop('stage', 23, 9, {});
      B.prop('speaker', 21, 8, {}); B.prop('speaker', 31, 8, {});
      B.prop('posterTask', 21, 7, { ox: 4, oy: 4, act: { id: 'poster', name: 'Póster de fiesta', zone: [-14, 6, 54, 76] } });
      B.prop('prizeCounter', 18, 9, { ox: -2 });
      B.prop('giftPile', 33, 9, { ox: 0 });
      B.prop('partyTable', 19, 12, { ox: -1, v: 'a' }); B.prop('partyTable', 30, 12, { ox: -1, v: 'b' });
      B.prop('partyTable', 19, 15, { ox: -1, v: 'b' }); B.prop('partyTable', 31, 15, { ox: -1, v: 'a' });
      [[18, 11, 'y'], [23, 11, 'b'], [29, 11, 'p'], [34, 11, 'y'], [18, 14, 'p'], [23, 14, 'y'], [30, 14, 'b'], [35, 14, 'p']].forEach(function (c, i) {
        B.prop('kidChair', c[0], c[1], { ox: 1, v: c[2] });
      });
      B.prop('discoStand', 27, 11, {});
      B.prop('balloons', 35, 9, { ox: -4 }); B.prop('balloons', 18, 12, { ox: 4, oy: 2 });
      B.light(21 * T, 11 * T, 52, '#ff5fd2', { clip: FIE, glow: '#ff5fd2', flick: 0.5 });
      B.light(32 * T, 12 * T, 52, '#4de0ff', { clip: FIE, glow: '#4de0ff', flick: 0.7 });
      B.light(27 * T, 8 * T, 56, '#ffe45c', { clip: FIE });

      // ======================= OFICINA DEL GERENTE =======================
      B.decorPx('rugMgr', 42 * T + 4, 10 * T + 8, {});
      B.wall('windowN', 41, 5, { ox: 0, oy: 6 }); B.wall('framedA', 44, 5, { ox: 0, oy: 4 }); B.wall('framedB', 47, 5, { ox: 4, oy: 4 }); B.wall('diploma', 49, 5, { ox: 4, oy: 10 });
      B.prop('bookshelf', 39, 8, { ox: -1 });
      B.prop('deskMgr', 43, 10, { ox: -5 });
      B.prop('pcMgr', 45, 9, { ox: 6, oy: -10, sb: 160.5, act: { id: 'monitor', name: 'Computadora', zone: [-26, 34, 78, 46] } });
      B.prop('chairO', 45, 8, { ox: -1, v: 'g' });
      B.prop('chairO', 44, 13, { ox: 0, v: 'g' }); B.prop('chairO', 47, 13, { ox: 0, v: 'g' });
      B.prop('safe', 49, 8, { ox: -2 });
      B.prop('lampFloor', 50, 8, { ox: 0 });
      B.prop('sofa', 40, 12, { ox: -2 }); B.prop('coffeeTbl', 40, 14, { ox: -1 });
      B.prop('plant', 50, 15, {});
      B.prop('trashC', 39, 15, { ox: 2 });
      B.light(45 * T, 9 * T, 70, '#ffe9a0', { clip: GER });
      B.light(41 * T, 11 * T, 52, '#ffd8a0', { clip: GER });

      // ======================= COCINA =======================
      B.wall('potRack', 3, 23, { ox: 6, oy: 2 }); B.wall('menuBoard', 7, 23, { ox: 0, oy: 2 }); B.wall('hood', 11, 23, { ox: -4, oy: 4 });
      B.wall('tickets', 13, 23, { ox: 4, oy: 4 });
      B.decorPx('rubberMat', 4 * T, 27 * T + 4, {}); B.decorPx('puddle', 5 * T + 8, 28 * T, {});
      B.prop('counterK', 3, 26, { ox: -1 }); B.prop('sinkK', 5, 26, { ox: -1 }); B.prop('counterK', 7, 26, { ox: -1 });
      B.prop('stove', 11, 26, { ox: -1 }); B.prop('counterK', 13, 26, { ox: -1 }); B.prop('fridge', 15, 26, { ox: -1 });
      B.prop('prepTable', 7, 30, { ox: -2 });
      B.prop('cupcake', 9, 29, { ox: 10, oy: -3, sb: 480.5, act: { id: 'cupcake', name: 'Pastelito de Chica', zone: [-34, 28, 84, 38] } });
      B.prop('shelfK', 3, 30, { ox: -1 }); B.prop('pizzaBoxes', 5, 32, { ox: 2 }); B.prop('pizzaBoxes', 3, 32, { ox: 0 });
      B.prop('ovenBig', 14, 31, { ox: -4 });
      B.prop('mopBucket', 16, 32, { ox: 0 }); B.prop('trash', 12, 32, { ox: 2 });
      B.light(9 * T, 28 * T, 76, '#f2f8ff', { clip: COC, flick: 0.35 });

      // ======================= ALMACÉN =======================
      B.wall('cobweb', 20, 23, { ox: 0, oy: 8 }); B.wall('broomWall', 22, 23, { ox: 0, oy: 4 }); B.wall('notice', 28, 23, { ox: 0, oy: 6 });
      B.decorPx('partsFloor', 21 * T, 29 * T, {}); B.decorPx('partsFloor', 26 * T, 31 * T, {}); B.decorPx('stain', 23 * T, 28 * T, {});
      B.prop('shelfBoxes', 20, 26, { ox: -1 }); B.prop('shelfBoxes', 22, 26, { ox: -1 });
      B.prop('headShelf', 26, 26, { ox: -2 }); B.prop('shelfBoxes', 28, 26, { ox: -1 });
      B.prop('toolBench', 20, 30, { ox: -2 });
      B.prop('ladder', 24, 32, { ox: 2 });
      B.prop('boxStack', 28, 32, { ox: 0 }); B.prop('boxStack', 27, 32, { ox: 6, oy: -4 }); B.prop('barrel', 20, 32, { ox: 0 }); B.prop('barrel', 21, 32, { ox: 4 });
      B.prop('mopBucket', 29, 29, { ox: 0 });
      B.light(24 * T, 29 * T, 62, '#e8e0c0', { clip: ALM, flick: 0.9 });

      // ======================= SALA DE JUEGOS =======================
      B.decorPx('rugArcade', 36 * T, 27 * T, {});
      B.wall('neonGames', 37, 23, { ox: 2, oy: 6 }); B.wall('neonStar', 36, 23, { ox: 0, oy: 8 }); B.wall('neonStar', 39, 23, { ox: 6, oy: 10 });
      var arc = [[33, 'p'], [35, 'c'], [42, 'y'], [44, 'g'], [46, 'p']];
      var cols = { p: '#ff5fd2', c: '#4de0ff', y: '#ffe45c', g: '#3fd479' };
      arc.forEach(function (a) {
        B.prop('arcadeM', a[0], 26, { ox: 1, v: a[1], light: { dx: 15, dy: 24, r: 36, col: cols[a[1]], glow: cols[a[1]], clip: ARC } });
      });
      B.prop('airHockey', 37, 30, { ox: -2 });
      B.prop('clawM', 33, 30, { ox: -1 }); B.prop('ticketM', 47, 30, { ox: 0 });
      B.prop('ballpit', 43, 32, { ox: -2 });
      B.prop('beanBag', 34, 32, { ox: 0, v: 'g' }); B.prop('beanBag', 36, 32, { ox: 4, v: 'o' }); B.prop('beanBag', 47, 28, { ox: 0 });
      B.light(41 * T, 30 * T, 80, '#a05cff', { clip: ARC, glow: '#6a4ad0' });
    }
  };
})(window);
